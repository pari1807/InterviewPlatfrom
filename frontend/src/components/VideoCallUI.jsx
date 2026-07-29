import React, { useState } from "react";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2, MessageSquare, Users, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { Button } from "./ui/Button";

export default function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <Loader2 className="size-10 animate-spin text-emerald-500 mb-3" />
        <p className="text-sm font-semibold">Joining video call room...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video bg-slate-950 p-3 rounded-2xl border border-slate-800">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Participants count badge & Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-white">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-emerald-400" />
            <span className="font-semibold text-xs">
              {participantCount} {participantCount === 1 ? "Candidate" : "Candidates"}
            </span>
          </div>

          {chatClient && channel && (
            <Button
              variant={isChatOpen ? "emeraldGradient" : "ghost"}
              size="sm"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={isChatOpen ? "" : "text-slate-300 hover:text-white"}
            >
              <MessageSquare className="size-3.5" />
              <span>Chat</span>
            </Button>
          )}
        </div>

        {/* Video Grid Layout */}
        <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800">
          <SpeakerLayout />
        </div>

        {/* Call Controls Bar */}
        <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* Side Chat Overlay Drawer */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
                <h3 className="font-bold text-xs flex items-center gap-2">
                  <MessageSquare className="size-4 text-emerald-400" />
                  <span>Session Chat</span>
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
