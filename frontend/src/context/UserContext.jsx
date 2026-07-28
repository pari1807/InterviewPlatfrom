import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/clerk-react";
import axios, { setClerkToken } from "../lib/axios";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loadingDbUser, setLoadingDbUser] = useState(true);

  const fetchDbUser = async () => {
    if (!clerkUser) {
      setDbUser(null);
      setLoadingDbUser(false);
      return;
    }

    try {
      // Securely fetch Clerk JWT and attach to all subsequent axios requests
      const token = await getToken();
      if (token) {
        setClerkToken(token);
      }

      const res = await axios.get("/users/me");
      if (res.data?.user) {
        setDbUser(res.data.user);
      }
    } catch (err) {
      console.log("UserContext error fetching /users/me:", err.message);
    } finally {
      setLoadingDbUser(false);
    }
  };

  useEffect(() => {
    if (clerkLoaded) {
      fetchDbUser();
    }
  }, [clerkUser?.id, clerkLoaded]);

  // Provide a reliable way for other hooks (like useCreateSession) to ensure headers exist
  useEffect(() => {
    const attachToken = async () => {
      if (clerkUser) {
        const token = await getToken();
        if (token) {
          setClerkToken(token);
        }
      }
    };
    attachToken();
  }, [clerkUser?.id]);

  const value = {
    dbUser,
    loadingDbUser,
    refetchUser: fetchDbUser,
    setDbUser,
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
