import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created successfully!");
      // Invalidate active sessions so dashboards refresh immediately
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myActiveSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });
};

export const useActiveSessions = (options = {}) => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
    staleTime: 10_000,
    ...options,
  });
};

export const useMyRecentSessions = (options = {}) => {
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
    staleTime: 30_000,
    ...options,
  });
};

// NEW: My active sessions — so host can rejoin meetings they left
export const useMyActiveSessions = (options = {}) => {
  return useQuery({
    queryKey: ["myActiveSessions"],
    queryFn: sessionApi.getMyActiveSessions,
    staleTime: 10_000,
    refetchInterval: 15_000, // Poll every 15s to catch status changes
    ...options,
  });
};

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5_000,
  });
};

export const useJoinSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => {
      toast.success("Joined session successfully!");
      queryClient.invalidateQueries({ queryKey: ["myActiveSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      toast.success("Session ended successfully!");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myActiveSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });
};
