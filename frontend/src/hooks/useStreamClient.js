import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // Track if initialization has been attempted to avoid double-init
  const initialized = useRef(false);

  useEffect(() => {
    // Only init once session data is loaded and we have a callId
    if (!session?.callId || loadingSession) return;
    // Skip completed sessions
    if (session.status === "completed") {
      setIsInitializingCall(false);
      return;
    }
    // Prevent double initialization
    if (initialized.current) return;
    initialized.current = true;

    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      try {
        console.log(`📹 [Stream Init] Requesting token for session.callId: ${session.callId}`);
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        console.log(`📹 [Stream Init] Stream Token retrieved for userId: ${userId} (${userName})`);

        // Initialize Stream Video client
        const client = await initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          token
        );
        setStreamClient(client);

        // Create call reference
        videoCall = client.call("default", session.callId);

        // Join call — create: true allows the first joiner to create it, idempotent for re-joins
        console.log(`📹 [Stream Init] Joining video call room: ${session.callId}`);
        await videoCall.join({ create: true });
        console.log(`✅ [Stream Init] Successfully joined call room: ${session.callId}`);

        // Explicitly enable camera and microphone tracks so they are published to remote peers over WebRTC
        try {
          console.log(`🎥 [Stream Init] Enabling camera track for ${userName}...`);
          await videoCall.camera.enable();
          console.log(`✅ [Stream Init] Camera track published`);
        } catch (camErr) {
          console.warn(`⚠️ [Stream Init] Camera track warning (hardware lock/permission): ${camErr.message}`);
        }

        try {
          console.log(`🎙️ [Stream Init] Enabling microphone track for ${userName}...`);
          await videoCall.microphone.enable();
          console.log(`✅ [Stream Init] Microphone track published`);
        } catch (micErr) {
          console.warn(`⚠️ [Stream Init] Microphone track warning: ${micErr.message}`);
        }

        setCall(videoCall);

        // Initialize Stream Chat
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        if (!chatClientInstance.userID) {
          await chatClientInstance.connectUser(
            { id: userId, name: userName, image: userImage },
            token
          );
        }
        setChatClient(chatClientInstance);

        // Watch the chat channel for this session
        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
        console.log(`💬 [Stream Init] Chat channel connected for room: ${session.callId}`);
      } catch (error) {
        console.error("❌ Error initializing Stream call:", error);
        toast.error("Failed to connect to video call. Please refresh the page.");
      } finally {
        setIsInitializingCall(false);
      }
    };

    initCall();

    // Cleanup on unmount
    return () => {
      (async () => {
        try {
          if (videoCall) {
            console.log(`🔌 [Stream Cleanup] Leaving call: ${session.callId}`);
            await videoCall.leave().catch(() => {});
          }
          if (chatClientInstance) await chatClientInstance.disconnectUser().catch(() => {});
          await disconnectStreamClient().catch(() => {});
        } catch (e) {
          console.warn("Stream cleanup warning (non-fatal):", e.message);
        }
      })();
    };
  }, [session?.callId, session?.status, loadingSession]);

  return { streamClient, call, chatClient, channel, isInitializingCall };
}

export default useStreamClient;
