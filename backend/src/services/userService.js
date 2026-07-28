import { clerkClient } from "@clerk/express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";
import { upsertStreamUser } from "../lib/stream.js";

/**
 * Generates a guaranteed unique Candidate Key (e.g. CAND-8F4A2D)
 * Checks MongoDB in a while loop to prevent any duplicate key collision.
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

    if (!existing) {
      isUnique = true;
    }
  }

  return candidateKey;
}

/**
 * Centralized User Onboarding & Synchronization
 * Ensures every Clerk user has a complete MongoDB document, Role, Candidate Key, and real Clerk Profile.
 */
export async function syncOrCreateUser(clerkId, initialData = {}) {
  if (!clerkId) {
    throw new Error("clerkId is required for user synchronization");
  }

  // 1. Search MongoDB for existing user by clerkId
  let user = await User.findOne({ clerkId });

  // Helper to fetch full details from Clerk API
  const fetchClerkDetails = async () => {
    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      if (clerkUser) {
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Candidate User";
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkId}@clerk.user`;
        const profileImage = clerkUser.imageUrl || "";
        return { name, email, profileImage };
      }
    } catch (e) {
      console.warn("Could not fetch Clerk user profile details:", e.message);
    }
    return null;
  };

  if (user) {
    let updated = false;

    // Self-healing Candidate Key check
    if (!user.candidateId || !user.candidateKey) {
      console.log(`🔧 Self-healing Candidate Key for user ${clerkId}`);
      const newKey = await generateUniqueCandidateKey();
      user.candidateId = user.candidateId || newKey;
      user.candidateKey = user.candidateKey || newKey;
      updated = true;
    }

    // Self-healing Placeholder Email/Name check
    if (user.email?.endsWith("@clerk.user") || user.name === "Candidate User") {
      let realDetails = null;
      
      // Try using the session claims passed in initialData first
      if (initialData.email && !initialData.email.endsWith("@clerk.user")) {
        realDetails = initialData;
      } else {
        realDetails = await fetchClerkDetails();
      }

      if (realDetails && realDetails.email && !realDetails.email.endsWith("@clerk.user")) {
        user.email = realDetails.email;
        user.name = realDetails.name && realDetails.name !== "Candidate User" ? realDetails.name : user.name;
        user.profileImage = realDetails.profileImage || user.profileImage;
        updated = true;
        console.log(`✨ Self-healed real user profile in MongoDB: ${user.name} (${user.email})`);
      }
    }

    if (updated) {
      await user.save();
    }
    return user;
  }

  // 2. User does NOT exist in MongoDB -> Onboard New User
  console.log(`✨ Onboarding new user in MongoDB for clerkId: ${clerkId}`);

  let realDetails = null;
  // Use session claims if available
  if (initialData.email && !initialData.email.endsWith("@clerk.user")) {
    realDetails = initialData;
  } else {
    realDetails = await fetchClerkDetails();
  }

  const name = realDetails?.name && realDetails.name !== "Candidate User" ? realDetails.name : "Candidate User";
  const email = realDetails?.email || `${clerkId}@clerk.user`;
  const profileImage = realDetails?.profileImage || "";

  // Generate guaranteed unique candidate key
  const candidateKey = await generateUniqueCandidateKey();

  // Create User in MongoDB
  try {
    user = await User.create({
      clerkId,
      email,
      name,
      profileImage,
      role: "pending",
      candidateId: candidateKey,
      candidateKey: candidateKey,
    });
    console.log(`✅ Created MongoDB User ${user._id} (${user.name}) with Key: ${candidateKey}`);
  } catch (dbErr) {
    console.warn("MongoDB User.create warning, attempting recovery:", dbErr.message);
    user = await User.findOne({ clerkId });
    if (!user) {
      const fallbackEmail = `${clerkId}_${Date.now()}@clerk.user`;
      user = await User.create({
        clerkId,
        email: fallbackEmail,
        name,
        profileImage,
        role: "pending",
        candidateId: candidateKey,
        candidateKey: candidateKey,
      });
    }
  }

  // Auto-initialize Welcome Notification in MongoDB
  try {
    await Notification.create({
      recipient: user._id,
      sender: user._id,
      title: "Welcome to Talent IQ!",
      message: `Your account is ready. Your permanent Candidate Key is "${candidateKey}". Share this key with hosts to receive interview invitations.`,
      type: "status_update",
    });
  } catch (notifErr) {
    console.warn("Welcome notification creation warning:", notifErr.message);
  }

  // Auto-initialize Activity log in MongoDB
  try {
    await Activity.create({
      userId: user._id,
      action: "USER_ONBOARDED",
      details: `New user onboarded with Candidate Key: ${candidateKey}`,
    });
  } catch (actErr) {
    console.warn("Activity log creation warning:", actErr.message);
  }

  // Upsert to Stream Video/Chat SDKs
  upsertStreamUser({
    id: clerkId.toString(),
    name: user.name,
    image: user.profileImage,
  }).catch((err) => console.warn("Async Stream user upsert warning:", err.message));

  return user;
}
