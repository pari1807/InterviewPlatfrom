import React, { useEffect } from "react";
import {
  ParticipantView,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff, Wifi } from "lucide-react";

// Individual 16:9 video tile for a single participant
function VideoTile({ participant, label, isLocal }) {
  const isSpeaking = participant?.isSpeaking;
  const hasVideo = Boolean(participant?.videoStream);
  const hasAudio = Boolean(participant?.audioStream);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-slate-900 border-2 transition-all duration-200 shadow-md ${
        isSpeaking
          ? "border-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-400/40"
          : "border-slate-800"
      }`}
      style={{ aspectRatio: "16/9", width: "100%" }}
    >
      {participant ? (
        <ParticipantView
          participant={participant}
          trackType="videoTrack"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // Placeholder avatar when participant hasn't joined yet
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 gap-2 p-4">
          <div className="size-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shadow-inner">
            <span className="text-xl font-extrabold text-slate-400">
              {label?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400">Waiting for {label} to join...</p>
          <span className="text-[10px] text-slate-500 font-mono">Status: Room Idle</span>
        </div>
      )}

      {/* Speaking ring pulse */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400 animate-pulse pointer-events-none" />
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white text-xs font-bold truncate max-w-[120px] sm:max-w-[140px]">
            {participant?.name || label || "Participant"}
          </span>
          {isLocal && (
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
              YOU
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasAudio ? (
            <Mic className="size-3 text-emerald-400" />
          ) : (
            <MicOff className="size-3 text-rose-400" />
          )}
          {hasVideo ? (
            <Video className="size-3 text-emerald-400" />
          ) : (
            <VideoOff className="size-3 text-rose-400" />
          )}
        </div>
      </div>
    </div>
  );
}

// Main video panel: shows local + remote participant in 16:9 tiles
export default function InterviewVideoPanel({ isHost }) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const localParticipant = participants.find((p) => p.isLocalParticipant);
  const remoteParticipant = participants.find((p) => !p.isLocalParticipant) || null;

  const localLabel = isHost ? "Host" : "Candidate";
  const remoteLabel = isHost ? "Candidate" : "Host";

  // Diagnostic WebRTC participant logger
  useEffect(() => {
    console.log("📹 [WebRTC Participants Update]", {
      total: participants.length,
      local: localParticipant
        ? { id: localParticipant.userId, name: localParticipant.name, hasVideo: Boolean(localParticipant.videoStream), hasAudio: Boolean(localParticipant.audioStream) }
        : null,
      remote: remoteParticipant
        ? { id: remoteParticipant.userId, name: remoteParticipant.name, hasVideo: Boolean(remoteParticipant.videoStream), hasAudio: Boolean(remoteParticipant.audioStream) }
        : null,
    });
  }, [participants]);

  return (
    <div className="flex flex-col gap-3 h-full p-3 overflow-y-auto">
      {/* Local video tile */}
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
          <span>{localLabel} (You)</span>
          <span className="text-[9px] text-emerald-400 font-mono">Connected</span>
        </p>
        <VideoTile participant={localParticipant || null} label={localLabel} isLocal={true} />
      </div>

      {/* Remote video tile */}
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
          <span>{remoteLabel}</span>
          <span className={`text-[9px] font-mono ${remoteParticipant ? "text-emerald-400" : "text-amber-400"}`}>
            {remoteParticipant ? "Live Feed" : "Waiting"}
          </span>
        </p>
        <VideoTile participant={remoteParticipant} label={remoteLabel} isLocal={false} />
      </div>

      {/* Peer Connection Status */}
      <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className={`size-2 rounded-full ${localParticipant ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
          <span className="text-xs font-bold text-slate-300">
            {participants.length}/2 Participants Connected
          </span>
          <span className={`size-2 rounded-full ${remoteParticipant ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
        </div>
        <p className="text-[10px] text-slate-500 font-medium">
          {remoteParticipant
            ? "WebRTC Peer Connection Established"
            : "Waiting for candidate to join room"}
        </p>
      </div>
    </div>
  );
}
