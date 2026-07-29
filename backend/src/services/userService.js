import { clerkClient } from "@clerk/express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";
import { upsertStreamUser } from "../lib/stream.js";

/**
 * Generates a guaranteed unique Candidate Key (e.g. CAND-8F4A2D).
 * Checks MongoDB in a while-loop to prevent any duplicate key collision.
 */
export async function generateUniqueCandidateKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let isUnique = false;
  let candidateKey = "";

  while (!isUnique) {
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    candidateKey = `CAND-${randomPart}`;
    const existing = await User.findOne({
      $or: [{ candidateId: candidateKey }, { candidateKey: candidateKey }],
    });
    if (!existing) isUnique = true;
  }

  return candidateKey;
}

/**
 * Fetch real user details from the Clerk Management API with a strict 1.5s timeout.
 * Prevents external API latency from hanging the authentication request.
 */
async function fetchClerkDetails(clerkId) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Clerk API timeout")), 1500)
    );

    const clerkUser = await Promise.race([
      clerkClient.users.getUser(clerkId),
      timeoutPromise,
    ]);

    if (clerkUser) {
      const name =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        clerkUser.username ||
        null;
      const email =
        clerkUser.emailAddresses?.[0]?.emailAddress || null;
      const profileImage = clerkUser.imageUrl || "";
      return { name, email, profileImage };
    }
  } catch (e) {
    console.warn(`[UserService] Clerk API fetch skipped for ${clerkId}: ${e.message}`);
  }
  return null;
}

function isPlaceholderEmail(email) {
  return !email || email.endsWith("@clerk.user");
}

function isPlaceholderName(name) {
  return !name || name === "Candidate User" || name.trim() === "";
}

/**
 * Central User Onboarding & Synchronization
 * 
 * Instant (local-first) MongoDB user synchronization.
 * Never hangs on external network calls.
 */
export async function syncOrCreateUser(clerkId, initialData = {}) {
  if (!clerkId) throw new Error("clerkId is required for user synchronization");

  // 1. Search by clerkId
  let user = await User.findOne({ clerkId });

  // 2. If not found by clerkId, search by email to link existing accounts (prevents E11000 duplicate email errors!)
  const inputEmail = initialData.email;
  if (!user && inputEmail && !isPlaceholderEmail(inputEmail)) {
    user = await User.findOne({ email: inputEmail.toLowerCase() });
    if (user) {
      user.clerkId = clerkId;
      if (initialData.name && !isPlaceholderName(initialData.name)) user.name = initialData.name;
      if (initialData.profileImage) user.profileImage = initialData.profileImage;
      await user.save();
      console.log(`[UserService] 🔗 Linked existing email (${user.email}) to new clerkId: ${clerkId}`);
      return user;
    }
  }

  // 3. Existing User Self-Healing (Instant local-first resolution)
  if (user) {
    let updated = false;

    // Self-heal: Candidate Key
    if (!user.candidateId || !user.candidateKey) {
      const newKey = await generateUniqueCandidateKey();
      user.candidateId = newKey;
      user.candidateKey = newKey;
      updated = true;
      console.log(`[UserService] 🔧 Self-healed Candidate Key for ${clerkId}: ${newKey}`);
    }

    // Self-heal: Placeholder email or name (only if initialData has real values)
    const needsEmailFix = isPlaceholderEmail(user.email);
    const needsNameFix = isPlaceholderName(user.name);

    if (needsEmailFix || needsNameFix) {
      let realEmail = (!isPlaceholderEmail(initialData.email)) ? initialData.email : null;
      let realName = (!isPlaceholderName(initialData.name)) ? initialData.name : null;

      // Only attempt remote Clerk fetch if local initialData was incomplete
      if (!realEmail || !realName) {
        const clerkDetails = await fetchClerkDetails(clerkId);
        if (clerkDetails) {
          realEmail = realEmail || clerkDetails.email;
          realName = realName || clerkDetails.name;
        }
      }

      if (realEmail && needsEmailFix) {
        user.email = realEmail.toLowerCase();
        updated = true;
      }
      if (realName && needsNameFix) {
        user.name = realName;
        updated = true;
      }
      if (initialData.profileImage && !user.profileImage) {
        user.profileImage = initialData.profileImage;
        updated = true;
      }
    }

    if (updated) {
      try {
        await user.save();
      } catch (saveErr) {
        console.warn(`[UserService] Save self-heal warning for ${clerkId}: ${saveErr.message}`);
      }
    }

    return user;
  }

  // 4. New User Onboarding (Instant local-first resolution)
  console.log(`[UserService] ✨ Onboarding new user for clerkId: ${clerkId}`);

  let resolvedName = (!isPlaceholderName(initialData.name)) ? initialData.name : null;
  let resolvedEmail = (!isPlaceholderEmail(initialData.email)) ? initialData.email : null;
  let resolvedImage = initialData.profileImage || "";

  // Only call Clerk API if local initialData was incomplete
  if (!resolvedName || !resolvedEmail) {
    const clerkDetails = await fetchClerkDetails(clerkId);
    if (clerkDetails) {
      resolvedName = resolvedName || clerkDetails.name;
      resolvedEmail = resolvedEmail || clerkDetails.email;
      resolvedImage = resolvedImage || clerkDetails.profileImage;
    }
  }

  const finalName = resolvedName || "Candidate User";
  let finalEmail = (resolvedEmail ? resolvedEmail.toLowerCase() : `${clerkId}@clerk.user`);

  // Check once more if email exists before creating
  if (!isPlaceholderEmail(finalEmail)) {
    const existingByEmail = await User.findOne({ email: finalEmail });
    if (existingByEmail) {
      existingByEmail.clerkId = clerkId;
      await existingByEmail.save();
      console.log(`[UserService] 🔗 Linked existing account by email (${finalEmail}) to clerkId: ${clerkId}`);
      return existingByEmail;
    }
  }

  // Generate unique Candidate Key
  const candidateKey = await generateUniqueCandidateKey();

  // Create User with retry loop for absolute safety
  let attempts = 0;
  while (!user && attempts < 3) {
    attempts++;
    try {
      const keyToUse = attempts === 1 ? candidateKey : await generateUniqueCandidateKey();
      const emailToUse = attempts === 1 ? finalEmail : `${clerkId.slice(-6)}_${Date.now()}@clerk.user`;

      user = await User.create({
        clerkId,
        email: emailToUse,
        name: finalName,
        profileImage: resolvedImage,
        role: "pending",
        candidateId: keyToUse,
        candidateKey: keyToUse,
      });

      console.log(`[UserService] ✅ Onboarded user ${user._id} — ${user.name} (${user.email}) — Key: ${user.candidateKey}`);
    } catch (createErr) {
      console.warn(`[UserService] User.create attempt ${attempts} warning: ${createErr.message}`);
      user = await User.findOne({ clerkId });
      if (user) return user;
    }
  }

  if (!user) {
    const emergencyKey = `CAND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const emergencyEmail = `${clerkId.slice(-6)}_${Date.now()}@clerk.user`;
    user = await User.create({
      clerkId,
      email: emergencyEmail,
      name: finalName,
      profileImage: resolvedImage,
      role: "pending",
      candidateId: emergencyKey,
      candidateKey: emergencyKey,
    });
  }

  // Welcome notification (non-blocking)
  Notification.create({
    recipient: user._id,
    sender: user._id,
    title: "Welcome to the Platform!",
    message: `Your account is ready. Your permanent Candidate Key is "${user.candidateKey}". Share it with hosts to receive interview invitations.`,
    type: "status_update",
  }).catch(() => {});

  // Activity log (non-blocking)
  Activity.create({
    userId: user._id,
    action: "USER_ONBOARDED",
    details: `New user onboarded with Candidate Key: ${user.candidateKey}`,
  }).catch(() => {});

  // Async Stream SDK upsert (non-blocking)
  upsertStreamUser({
    id: clerkId,
    name: user.name,
    image: user.profileImage,
  }).catch((e) => console.warn("[UserService] Stream upsert warning:", e.message));

  return user;
}
