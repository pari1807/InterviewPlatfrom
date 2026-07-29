import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/clerk-react";
import axios, { setClerkToken } from "../lib/axios";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loadingDbUser, setLoadingDbUser] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  /**
   * Fetch and inject Clerk token, then load the MongoDB user profile.
   * This is the single source of truth for all auth state.
   */
  const fetchDbUser = useCallback(async () => {
    if (!clerkUser) {
      setDbUser(null);
      setLoadingDbUser(false);
      return;
    }

    setLoadingDbUser(true);
    setFetchError(null);

    try {
      // 1. Get the Clerk JWT token with a 2s timeout fallback so auth never hangs
      let token = null;
      try {
        const tokenPromise = getToken();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2000));
        token = await Promise.race([tokenPromise, timeoutPromise]);
      } catch (tokenErr) {
        console.warn("[UserContext] getToken warning:", tokenErr.message);
      }

      // 2. Inject token AND user details into axios interceptor
      setClerkToken(token || "session_token", {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || "Candidate User",
        email: clerkUser.primaryEmailAddress?.emailAddress || `${clerkUser.id}@clerk.user`,
        imageUrl: clerkUser.imageUrl || "",
      });

      // 3. Load the MongoDB user profile
      const res = await axios.get("/users/me");
      if (res.data?.user) {
        setDbUser(res.data.user);
      } else {
        throw new Error("Server returned no user data");
      }
    } catch (err) {
      console.error("[UserContext] fetchDbUser failed:", err.message);
      setFetchError(err.message);
    } finally {
      setLoadingDbUser(false);
    }
  }, [clerkUser, getToken]);

  // Run on initial load and whenever the signed-in user changes
  useEffect(() => {
    if (clerkLoaded) {
      fetchDbUser();
    }
  }, [clerkLoaded, fetchDbUser]);

  // Refresh Clerk token every 55 minutes
  useEffect(() => {
    if (!clerkUser) return;

    const refreshInterval = setInterval(async () => {
      try {
        const token = await getToken();
        if (token) {
          setClerkToken(token, {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || "Candidate User",
            email: clerkUser.primaryEmailAddress?.emailAddress || `${clerkUser.id}@clerk.user`,
            imageUrl: clerkUser.imageUrl || "",
          });
        }
      } catch (e) {
        console.warn("[UserContext] Token refresh failed:", e.message);
      }
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [clerkUser, getToken]);

  const value = {
    dbUser,
    loadingDbUser,
    fetchError,
    refetchUser: fetchDbUser,
    setDbUser,
    isHost: dbUser?.role === "host",
    isCandidate: dbUser?.role === "candidate",
    isPending: dbUser?.role === "pending" || (!loadingDbUser && !dbUser),
    candidateKey: dbUser?.candidateKey || dbUser?.candidateId || "",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useDbUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useDbUser must be used within a UserProvider");
  }
  return context;
}
