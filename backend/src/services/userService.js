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
 * Fetch real user details from the Clerk Management API.
 * Returns { name, email, profileImage } or null on failure.
 */
async function fetchClerkDetails(clerkId) {
  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
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
    console.warn(`[UserService] Clerk API fetch failed for ${clerkId}: ${e.message}`);
  }
  return null;
}

/**
 * Resolve the best name and email from available sources.
 * Priority: initialData (session claims) → Clerk API → fallback placeholder
 */
function isPlaceholderEmail(email) {
  return !email || email.endsWith("@clerk.user");
}

function isPlaceholderName(name) {
  return !name || name === "Candidate User" || name.trim() === "";
}

/**
 * Central user onboarding & synchronization.
 * Called on every authenticated request via protectRoute.
 * Ensures every Clerk user has a complete, real MongoDB record.
 */
export async function syncOrCreateUser(clerkId, initialData = {}) {
  if (!clerkId) throw new Error("clerkId is required for user synchronization");

  let user = await User.findOne({ clerkId });

  if (user) {
    let updated = false;

    // --- Self-heal: Candidate Key ---
    if (!user.candidateId || !user.candidateKey) {
      const newKey = await generateUniqueCandidateKey();
      user.candidateId = user.candidateId || newKey;
      user.candidateKey = user.candidateKey || newKey;
      updated = true;
      console.log(`[UserService] 🔧 Self-healed Candidate Key for ${clerkId}: ${newKey}`);
    }

    // --- Self-heal: Placeholder email or name ---
    const needsEmailFix = isPlaceholderEmail(user.email);
    const needsNameFix = isPlaceholderName(user.name);

    if (needsEmailFix || needsNameFix) {
      // Try session claims first (fastest, no network call)
      let realEmail = (!isPlaceholderEmail(initialData.email)) ? initialData.email : null;
      let realName = (!isPlaceholderName(initialData.name)) ? initialData.name : null;

      // Fallback to Clerk API if session claims are incomplete
      if (!realEmail || !realName) {
        const clerkDetails = await fetchClerkDetails(clerkId);
        if (clerkDetails) {
          realEmail = realEmail || clerkDetails.email;
          realName = realName || clerkDetails.name;
        }
      }

      if (realEmail && needsEmailFix) {
        user.email = realEmail;
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

      if (updated) {
        console.log(`[UserService] ✨ Self-healed profile: ${user.name} (${user.email})`);
      }
    }

    if (updated) {
      try {
        await user.save();
      } catch (saveErr) {
        // Handle duplicate email conflict — find the real record
        if (saveErr.code === 11000) {
          console.warn(`[UserService] Duplicate key on save — refetching user: ${saveErr.message}`);
          user = await User.findOne({ clerkId });
        } else {
          throw saveErr;
        }
      }
    }

    return user;
  }

  // ─── New User Onboarding ──────────────────────────────────────────────────
  console.log(`[UserService] ✨ Onboarding new user for clerkId: ${clerkId}`);

  // Resolve name and email — session claims → Clerk API → fallback
  let resolvedName = (!isPlaceholderName(initialData.name)) ? initialData.name : null;
  let resolvedEmail = (!isPlaceholderEmail(initialData.email)) ? initialData.email : null;
  let resolvedImage = initialData.profileImage || "";

  if (!resolvedName || !resolvedEmail) {
    const clerkDetails = await fetchClerkDetails(clerkId);
    if (clerkDetails) {
      resolvedName = resolvedName || clerkDetails.name;
      resolvedEmail = resolvedEmail || clerkDetails.email;
      resolvedImage = resolvedImage || clerkDetails.profileImage;
    }
  }

  // Final fallbacks — only used if Clerk API also fails
  const finalName = resolvedName || "Candidate User";
  const finalEmail = resolvedEmail || `${clerkId}@clerk.user`;

  if (finalEmail.endsWith("@clerk.user")) {
    console.warn(`[UserService] ⚠️  Using placeholder email for ${clerkId} — Clerk API may be misconfigured`);
  }

  // Generate unique Candidate Key
  const candidateKey = await generateUniqueCandidateKey();

  // Create MongoDB user
  try {
    user = await User.create({
      clerkId,
      email: finalEmail,
      name: finalName,
      profileImage: resolvedImage,
      role: "pending",
      candidateId: candidateKey,
      candidateKey: candidateKey,
    });
    console.log(`[UserService] ✅ Created user ${user._id} — ${finalName} (${finalEmail}) — Key: ${candidateKey}`);
  } catch (dbErr) {
    // Race condition: another request already created this user
    if (dbErr.code === 11000) {
      console.warn(`[UserService] Race condition detected — user already created: ${clerkId}`);
      user = await User.findOne({ clerkId });
      if (user) return user;
    }
    // Email duplicate with a different clerkId — use timestamped fallback
    const fallbackEmail = `${clerkId.slice(-8)}_${Date.now()}@clerk.user`;
    user = await User.create({
      clerkId,
      email: fallbackEmail,
      name: finalName,
      profileImage: resolvedImage,
      role: "pending",
      candidateId: candidateKey,
      candidateKey: candidateKey,
    });
    console.warn(`[UserService] ⚠️  Created with fallback email ${fallbackEmail}`);
  }

  // Welcome notification
  try {
    await Notification.create({
      recipient: user._id,
      sender: user._id,
      title: "Welcome to Talent IQ!",
      message: `Your account is ready. Your permanent Candidate Key is "${candidateKey}". Share it with hosts to receive interview invitations.`,
      type: "status_update",
    });
  } catch (e) {
    console.warn("[UserService] Welcome notification skipped:", e.message);
  }

  // Activity log
  try {
    await Activity.create({
      userId: user._id,
      action: "USER_ONBOARDED",
      details: `New user onboarded with Candidate Key: ${candidateKey}`,
    });
  } catch (e) {
    console.warn("[UserService] Activity log skipped:", e.message);
  }

  // Async Stream SDK upsert — non-blocking
  upsertStreamUser({
    id: clerkId,
    name: user.name,
    image: user.profileImage,
  }).catch((e) => console.warn("[UserService] Stream upsert warning:", e.message));

  return user;
}
