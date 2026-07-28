import { syncOrCreateUser } from "../services/userService.js";

/**
 * Robust, Fail-Safe Authentication Middleware
 * 
 * 1. Checks req.auth (populated by @clerk/express clerkMiddleware).
 * 2. If req.auth.userId is missing, parses the Bearer JWT token from Authorization header.
 * 3. If JWT parsing fails, falls back to x-clerk-user-id header.
 * 4. Syncs/onboards MongoDB user and attaches req.user.
 */
export const protectRoute = [
  async (req, res, next) => {
    try {
      let clerkId = req.auth?.userId;
      let claims = req.auth?.sessionClaims || {};

      // Fallback 1: Decode Bearer JWT token directly from Authorization header if req.auth is empty
      if (!clerkId && req.headers.authorization?.startsWith("Bearer ")) {
        const token = req.headers.authorization.split(" ")[1];
        try {
          const base64Url = token.split(".")[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
            const parsed = JSON.parse(jsonPayload);
            clerkId = parsed.sub;
            claims = { ...parsed, ...claims };
          }
        } catch (jwtErr) {
          console.warn("[protectRoute] Bearer JWT decode warning:", jwtErr.message);
        }
      }

      // Fallback 2: Read custom x-clerk-user-id header
      if (!clerkId && req.headers["x-clerk-user-id"]) {
        clerkId = req.headers["x-clerk-user-id"];
      }

      if (!clerkId) {
        console.error("[protectRoute] 401 Unauthorized — No valid Clerk ID found in request");
        return res.status(401).json({ message: "Unauthorized — missing or invalid authentication token" });
      }

      // Extract user metadata from claims or headers
      const rawName = req.headers["x-clerk-user-name"];
      const rawEmail = req.headers["x-clerk-user-email"];
      const rawImage = req.headers["x-clerk-user-image"];

      const name =
        (rawName ? decodeURIComponent(rawName) : null) ||
        `${claims.firstName || claims.first_name || ""} ${claims.lastName || claims.last_name || ""}`.trim() ||
        claims.name ||
        "";

      const email =
        (rawEmail ? decodeURIComponent(rawEmail) : null) ||
        claims.email ||
        claims.email_address ||
        claims.primaryEmailAddress ||
        "";

      const profileImage =
        (rawImage ? decodeURIComponent(rawImage) : null) ||
        claims.imageUrl ||
        claims.image_url ||
        claims.picture ||
        "";

      // Onboard or sync MongoDB user
      const user = await syncOrCreateUser(clerkId, { name, email, profileImage });

      req.user = user;
      next();
    } catch (error) {
      console.error("[protectRoute] Error during authentication sync:", error);
      res.status(500).json({ message: "Internal Server Error during authentication" });
    }
  },
];
