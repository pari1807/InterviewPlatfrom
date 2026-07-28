import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

// Helper function to generate unique candidate ID (e.g. CAND-8X2P91)
function generateCandidateId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "CAND-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // Find user in MongoDB by clerk ID
      let user = await User.findOne({ clerkId });

      // JIT Auto-Creation if user not in MongoDB (fixes local dev webhook issue)
      if (!user) {
        console.log(`🔄 JIT Syncing user for clerkId: ${clerkId}`);
        let name = "Candidate User";
        let email = `${clerkId}@clerk.user`;
        let profileImage = "";

        try {
          // Fetch full profile from Clerk API
          const clerkUser = await clerkClient.users.getUser(clerkId);
          name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Candidate User";
          email = clerkUser.emailAddresses[0]?.emailAddress || email;
          profileImage = clerkUser.imageUrl || "";
        } catch (e) {
          console.log("Could not fetch Clerk user profile details, using defaults:", e.message);
        }

        const candidateId = generateCandidateId();

        user = await User.create({
          clerkId,
          email,
          name,
          profileImage,
          role: "pending",
          candidateId,
        });

        // Sync with Stream Video / Chat SDK
        try {
          await upsertStreamUser({
            id: clerkId.toString(),
            name: user.name,
            image: user.profileImage,
          });
        } catch (streamErr) {
          console.log("Stream user upsert non-critical error:", streamErr.message);
        }
      }

      // Guarantee candidateId exists for older MongoDB records
      if (!user.candidateId) {
        user.candidateId = generateCandidateId();
        await user.save();
      }

      // Attach user object to request
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
