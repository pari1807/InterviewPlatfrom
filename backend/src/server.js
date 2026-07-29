import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import resumeAiRoutes from "./routes/resumeAiRoutes.js";
import { setupInterviewSocket } from "./socket/interviewSocket.js";

const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

// middleware
app.use(express.json());

// Dynamic CORS configuration allowing all development origins & custom Clerk headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // In development or local/forwarded port setup, echo request origin to allow credentials
      return callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-clerk-user-id",
      "x-clerk-user-name",
      "x-clerk-user-email",
      "x-clerk-user-image",
    ],
  })
);

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/resume-ai", resumeAiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running", aiEnabled: Boolean(ENV.GEMINI_API_KEY) });
});

// Setup Socket.io real-time engine
const io = setupInterviewSocket(server);
app.set("io", io);

// Production distribution serving
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    server.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
