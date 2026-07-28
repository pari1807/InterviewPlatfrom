import { requireAuth } from "@clerk/express";
import { syncOrCreateUser } from "../services/userService.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const auth = req.auth();
      const clerkId = auth?.userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // Extract basic user info from Clerk session claims without external API calls
      const claims = auth?.sessionClaims || {};
      const name = `${claims.firstName || claims.first_name || ""} ${claims.lastName || claims.last_name || ""}`.trim() || claims.name || "Candidate User";
      const email = claims.primaryEmailAddress || claims.email || claims.email_address || `${clerkId}@clerk.user`;
      const profileImage = claims.imageUrl || claims.image_url || claims.picture || "";

      // Automatically sync or onboard user in MongoDB instantly
      const user = await syncOrCreateUser(clerkId, { name, email, profileImage });

      // Attach user object to request
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error during authentication sync" });
    }
  },
];
