import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Loader2,
  LogOut,
  PhoneOff,
  Clock,
  Sparkles,
  FileText,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import HostRubricAssistant from "../components/HostRubricAssistant";
import RealtimeFeedbackWidget from "../components/RealtimeFeedbackWidget";
import { getSocket } from "../lib/socket";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

export default function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [liveAIData, setLiveAIData] = useState(null);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // Socket.io Real-time Connection & Room Sync
  useEffect(() => {
    if (!id || !user) return;
    const socket = getSocket();

    const userRole = isHost ? "host" : "candidate";
    socket.emit("join_room", {
      roomId: id,
      userRole,
      userId: user.id,
      userName: user.fullName || user.firstName || "Candidate",
    });

    socket.on("code_sync", ({ code: remoteCode, language: remoteLang }) => {
      if (remoteCode !== undefined) setCode(remoteCode);
      if (remoteLang !== undefined) setSelectedLanguage(remoteLang);
    });

    socket.on("live_ai_analysis_update", (analysis) => {
      setLiveAIData(analysis);
    });

    return () => {
      socket.off("code_sync");
      socket.off("live_ai_analysis_update");
    };
  }, [id, user, isHost]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Join session re-entry
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Redirect on completion
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // Update starter code
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage] && !code) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const socket = getSocket();
    socket.emit("code_change", { roomId: id, code: newCode, language: selectedLanguage });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
    const socket = getSocket();
    socket.emit("code_change", { roomId: id, code: starterCode, language: newLang });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // Request live AI observation update
    const socket = getSocket();
    socket.emit("live_ai_analyze_request", {
      roomId: id,
      code,
      language: selectedLanguage,
      problemTitle: session?.problem,
      elapsedMinutes: Math.floor(secondsElapsed / 60),
    });
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this interview session? All candidates will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      <Navbar />

      {/* Main 3-Panel Resizable Layout */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL: Problem Details, Timer, Progress */}
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full bg-slate-50 text-slate-800 flex flex-col border-r border-slate-200/80 overflow-y-auto">
              <div className="p-5 bg-white border-b border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getDifficultyBadgeVariant(session?.difficulty)}>
                    {session?.difficulty || "Easy"}
                  </Badge>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200/60">
                    <Clock className="size-3.5" />
                    <span>{formatTimer(secondsElapsed)}</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {session?.problem || "Loading Problem..."}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Host: {session?.host?.name || "Candidate"} • {session?.participant ? "2/2 Participants" : "1/2 Participant"}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-5 flex-1">
                {problemData?.description && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Problem Context
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {problemData.description.text}
                    </p>
                  </div>
                )}

                {problemData?.examples && problemData.examples.length > 0 && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Test Case Examples
                    </h2>
                    {problemData.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs space-y-1">
                        <div className="flex gap-2">
                          <span className="text-emerald-700 font-bold">Input:</span>
                          <span className="text-slate-800">{ex.input}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-teal-700 font-bold">Output:</span>
                          <span className="text-slate-800">{ex.output}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-emerald-500 transition-colors cursor-col-resize" />

          {/* CENTER PANEL: Video Feed, Code Editor & Terminal */}
          <Panel defaultSize={45} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={45} minSize={25}>
                <div className="h-full bg-slate-950 p-2 overflow-auto">
                  {isInitializingCall ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                      <Loader2 className="size-8 animate-spin text-emerald-500 mb-2" />
                      <p className="text-xs font-semibold">Connecting video feed...</p>
                    </div>
                  ) : !streamClient || !call ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <PhoneOff className="size-8 text-rose-500 mb-2" />
                      <p className="text-sm font-bold text-slate-200">Video Feed Offline</p>
                    </div>
                  ) : (
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-emerald-500 transition-colors cursor-row-resize" />

              <Panel defaultSize={55} minSize={25}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={handleCodeChange}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1.5 bg-slate-800 hover:bg-emerald-500 transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-emerald-500 transition-colors cursor-col-resize" />

          {/* RIGHT PANEL: AI Monitoring Widget, Host Rubric Assistant, Scratchpad */}
          <Panel defaultSize={25} minSize={20}>
            <div className="h-full bg-slate-900 p-4 border-l border-slate-800 flex flex-col gap-4 overflow-y-auto text-slate-200">
              {/* Real-time AI Monitoring Widget */}
              <RealtimeFeedbackWidget liveData={liveAIData} />

              {/* Host Rubric Assistant (Host Only) */}
              {isHost && (
                <HostRubricAssistant
                  sessionId={id}
                  problemTitle={session?.problem}
                  difficulty={session?.difficulty}
                />
              )}

              {/* Candidate Notes Scratchpad */}
              <div className="flex-1 flex flex-col gap-2 min-h-[140px]">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-emerald-400" /> Candidate Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jot down algorithm pseudocode or test edge cases here..."
                  className="flex-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-mono"
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Bottom Controls Bar */}
      <div className="h-14 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={isAudioMuted ? "text-rose-400 bg-rose-500/10" : "text-slate-300"}
          >
            {isAudioMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            <span>{isAudioMuted ? "Unmute Mic" : "Mute Mic"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVideoPaused(!isVideoPaused)}
            className={isVideoPaused ? "text-rose-400 bg-rose-500/10" : "text-slate-300"}
          >
            {isVideoPaused ? <VideoOff className="size-4" /> : <Video className="size-4" />}
            <span>{isVideoPaused ? "Start Camera" : "Pause Camera"}</span>
          </Button>
        </div>

        {isHost && session?.status === "active" && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleEndSession}
            disabled={endSessionMutation.isPending}
          >
            {endSessionMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            <span>End Interview Session</span>
          </Button>
        )}
      </div>
    </div>
  );
}
