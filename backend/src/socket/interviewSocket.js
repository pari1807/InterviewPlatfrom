import { Server } from "socket.io";
import { ENV } from "../lib/env.js";
import { monitorLiveInterview } from "../agents/monitoringAgent.js";
import Notification from "../models/Notification.js";

export function setupInterviewSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ENV.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // In-memory room state: roomId -> { host, candidate, code, language, activeQuestionIndex }
  const rooms = new Map();
  // Map userId -> socketId for targeted notifications
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Register socket for a specific userId & clerkId so we can target notifications
    socket.on("register_user", ({ userId, clerkId }) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
        socket.join(`user_${userId}`);
      }
      if (clerkId) {
        userSockets.set(clerkId.toString(), socket.id);
        socket.join(`user_${clerkId}`);
      }
      socket.data.userId = userId || clerkId;
      console.log(`📋 Registered user room for userId=${userId}, clerkId=${clerkId} -> socket ${socket.id}`);
    });

    // Join an interview room
    socket.on("join_room", ({ roomId, userRole, userId, userName }) => {
      socket.join(roomId);
      console.log(`👤 ${userName} (${userRole}) joined room ${roomId}`);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          host: null,
          hostName: null,
          candidate: null,
          candidateName: null,
          code: "",
          language: "javascript",
          activeQuestionIndex: 0,
        });
      }

      const roomData = rooms.get(roomId);

      if (userRole === "host") {
        roomData.host = socket.id;
        roomData.hostName = userName;
      } else {
        roomData.candidate = socket.id;
        roomData.candidateName = userName;
      }

      // Broadcast updated participant status to entire room
      io.to(roomId).emit("room_participants_updated", {
        hasHost: Boolean(roomData.host),
        hasCandidate: Boolean(roomData.candidate),
        hostName: roomData.hostName,
        candidateName: roomData.candidateName,
        participantCount: (roomData.host ? 1 : 0) + (roomData.candidate ? 1 : 0),
      });

      // Send current code state and active question index to the new joiner
      socket.emit("code_sync", { code: roomData.code, language: roomData.language });
      socket.emit("question_switched", { activeQuestionIndex: roomData.activeQuestionIndex || 0 });

      // Notify other participants someone joined
      socket.to(roomId).emit("participant_joined", { userRole, userName });
    });

    // Real-time collaborative code sync
    socket.on("code_change", ({ roomId, code, language }) => {
      if (rooms.has(roomId)) {
        const roomData = rooms.get(roomId);
        roomData.code = code;
        roomData.language = language || roomData.language;
      }
      socket.to(roomId).emit("code_sync", { code, language });
    });

    // Real-time DSA question switch (Question 1 <-> Question 2)
    socket.on("switch_question", ({ roomId, questionIndex, problemTitle }) => {
      if (rooms.has(roomId)) {
        const roomData = rooms.get(roomId);
        roomData.activeQuestionIndex = questionIndex;
      }
      io.to(roomId).emit("question_switched", { activeQuestionIndex: questionIndex, problemTitle });
      console.log(`🔀 Question switched in room ${roomId} to index ${questionIndex} (${problemTitle})`);
    });

    // Live AI monitoring analysis on code run
    socket.on("live_ai_analyze_request", async ({ roomId, code, language, problemTitle, elapsedMinutes }) => {
      try {
        const liveAnalysis = await monitorLiveInterview({ code, language, problemTitle, elapsedMinutes });
        io.to(roomId).emit("live_ai_analysis_update", liveAnalysis);
      } catch (err) {
        console.error("Socket live AI analysis error:", err.message);
      }
    });

    // Host notes sync
    socket.on("host_notes_changed", ({ roomId, hostNotes }) => {
      socket.to(roomId).emit("host_notes_sync", { hostNotes });
    });

    // Typing indicators for chat
    socket.on("typing_start", ({ roomId, userName }) => {
      socket.to(roomId).emit("user_typing", { userName });
    });

    socket.on("typing_stop", ({ roomId }) => {
      socket.to(roomId).emit("user_stopped_typing");
    });

    // Interview lifecycle events
    socket.on("interview_started", ({ roomId }) => {
      io.to(roomId).emit("interview_status", { status: "active" });
    });

    socket.on("interview_ended", ({ roomId }) => {
      io.to(roomId).emit("interview_status", { status: "completed" });
    });

    // Targeted notification delivery
    socket.on("send_notification_to_user", ({ targetUserId, notification }) => {
      if (targetUserId) {
        io.to(`user_${targetUserId}`).emit("new_notification", notification);
        const targetSocketId = userSockets.get(targetUserId.toString());
        if (targetSocketId) {
          io.to(targetSocketId).emit("new_notification", notification);
        }
        console.log(`🔔 Notification sent to user ${targetUserId}`);
      }
    });

    // Handle disconnecting - notify roommates
    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          if (rooms.has(roomId)) {
            const roomData = rooms.get(roomId);
            if (roomData.host === socket.id) {
              roomData.host = null;
              roomData.hostName = null;
            }
            if (roomData.candidate === socket.id) {
              roomData.candidate = null;
              roomData.candidateName = null;
            }

            io.to(roomId).emit("room_participants_updated", {
              hasHost: Boolean(roomData.host),
              hasCandidate: Boolean(roomData.candidate),
              hostName: roomData.hostName,
              candidateName: roomData.candidateName,
              participantCount: (roomData.host ? 1 : 0) + (roomData.candidate ? 1 : 0),
            });
          }

          socket.to(roomId).emit("user_disconnected", { socketId: socket.id });
        }
      }
    });

    socket.on("disconnect", () => {
      if (socket.data.userId) {
        userSockets.delete(socket.data.userId.toString());
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  server._io = io;
  server._userSockets = userSockets;

  return io;
}
