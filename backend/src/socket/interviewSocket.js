import { Server } from "socket.io";
import { ENV } from "../lib/env.js";
import { monitorLiveInterview } from "../agents/monitoringAgent.js";

export function setupInterviewSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ENV.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    socket.on("join_room", ({ roomId, userRole, userId, userName }) => {
      socket.join(roomId);
      console.log(`👤 ${userName} (${userRole}) joined room ${roomId}`);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, { host: null, candidate: null, code: "", language: "javascript" });
      }

      const roomData = rooms.get(roomId);
      if (userRole === "host") roomData.host = socket.id;
      if (userRole === "candidate") roomData.candidate = socket.id;

      // Broadcast room participant update
      io.to(roomId).emit("room_participants_updated", {
        hasHost: Boolean(roomData.host),
        hasCandidate: Boolean(roomData.candidate),
      });

      // Send initial code to new joiner
      socket.emit("code_sync", { code: roomData.code, language: roomData.language });
    });

    socket.on("code_change", ({ roomId, code, language }) => {
      if (rooms.has(roomId)) {
        const roomData = rooms.get(roomId);
        roomData.code = code;
        roomData.language = language || roomData.language;
      }
      // Broadcast updated code to other participants in room
      socket.to(roomId).emit("code_sync", { code, language });
    });

    socket.on("live_ai_analyze_request", async ({ roomId, code, language, problemTitle, elapsedMinutes }) => {
      try {
        const liveAnalysis = await monitorLiveInterview({ code, language, problemTitle, elapsedMinutes });
        io.to(roomId).emit("live_ai_analysis_update", liveAnalysis);
      } catch (err) {
        console.error("Socket live AI analysis error:", err.message);
      }
    });

    socket.on("host_notes_changed", ({ roomId, hostNotes }) => {
      socket.to(roomId).emit("host_notes_sync", { hostNotes });
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("user_disconnected", { socketId: socket.id });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
