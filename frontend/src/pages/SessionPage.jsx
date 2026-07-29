import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Loader2,
  PhoneOff,
  Clock,
  Sparkles,
  FileText,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Copy,
  Check,
  LogOut,
  Users,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import HostRubricAssistant from "../components/HostRubricAssistant";
import RealtimeFeedbackWidget from "../components/RealtimeFeedbackWidget";
import InterviewVideoPanel from "../components/InterviewVideoPanel";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";

import useStreamClient from "../hooks/useStreamClient";
import {
  StreamCall,
  StreamVideo,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Channel, Chat, MessageInput, MessageList, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

// ─── Bottom Control Bar (connected to Stream SDK) ─────────────────────────────
function InterviewControls({ isHost, onEndSession }) {
  const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();
  const { microphone, isMute: isAudioMuted } = useMicrophoneState();
  const { camera, isMute: isVideoPaused } = useCameraState();
  const { screenShare, isScreenShareEnabled } = useScreenShareState();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-16 bg-slate-950 border-t border-slate-800 px-4 lg:px-6 flex items-center justify-between shrink-0 gap-2">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => microphone.toggle()}
          title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
          className={`group flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium ${
            isAudioMuted
              ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {isAudioMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          <span className="hidden sm:inline">{isAudioMuted ? "Unmute" : "Mute"}</span>
        </button>

        <button
          onClick={() => camera.toggle()}
          title={isVideoPaused ? "Start Camera" : "Stop Camera"}
          className={`group flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium ${
            isVideoPaused
              ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {isVideoPaused ? <VideoOff className="size-4" /> : <Video className="size-4" />}
          <span className="hidden sm:inline">{isVideoPaused ? "Camera Off" : "Camera"}</span>
        </button>

        <button
          onClick={() => screenShare.toggle()}
          title={isScreenShareEnabled ? "Stop Screen Share" : "Share Screen"}
          className={`group flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium ${
            isScreenShareEnabled
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <MonitorUp className="size-4" />
          <span className="hidden sm:inline">{isScreenShareEnabled ? "Sharing" : "Share"}</span>
        </button>
      </div>

      {/* Center: Copy interview link */}
      <button
        onClick={handleCopyId}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 text-xs font-medium transition-all"
        title="Copy interview link"
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
        <span>{copied ? "Copied!" : "Copy Link"}</span>
      </button>

      {/* Right: End interview */}
      {isHost && (
        <Button
          variant="danger"
          size="sm"
          onClick={onEndSession}
          className="shrink-0"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">End Interview</span>
        </Button>
      )}
    </div>
  );
}

// ─── Right Sidebar Tabs ────────────────────────────────────────────────────────
function RightSidebar({ isHost, sessionId, problemTitle, difficulty, liveAIData, chatClient, channel }) {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "ai", label: "AI", icon: Sparkles },
    ...(isHost ? [{ id: "notes", label: "Notes", icon: FileText }] : []),
    ...(!isHost ? [{ id: "scratchpad", label: "Notes", icon: FileText }] : []),
  ];

  return (
    <div className="h-full bg-slate-900 flex flex-col border-l border-slate-800">
      {/* Tab bar */}
      <div className="flex border-b border-slate-800 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && (
          <div className="h-full flex flex-col">
            {chatClient && channel ? (
              <Chat client={chatClient} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                  <Window>
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                </Channel>
              </Chat>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 p-4">
                <MessageSquare className="size-8 opacity-40" />
                <p className="text-xs font-semibold">Chat initializing...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="p-3 overflow-y-auto h-full">
            <RealtimeFeedbackWidget liveData={liveAIData} />
          </div>
        )}

        {activeTab === "notes" && isHost && (
          <div className="p-3 overflow-y-auto h-full">
            <HostRubricAssistant
              sessionId={sessionId}
              problemTitle={problemTitle}
              difficulty={difficulty}
            />
          </div>
        )}

        {activeTab === "scratchpad" && !isHost && (
          <div className="p-3 h-full flex flex-col gap-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Candidate Scratchpad
            </label>
            <textarea
              placeholder="Pseudocode, edge cases, notes..."
              className="flex-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Top Header Bar ────────────────────────────────────────────────────────────
function InterviewHeader({ session, activeProblemTitle, activeDifficulty, secondsElapsed, isHost }) {
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isOverTime = session?.durationMinutes && secondsElapsed > session.durationMinutes * 60;

  return (
    <div className="h-14 bg-slate-950 border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between shrink-0 gap-4">
      {/* Left: Active Problem info */}
      <div className="flex items-center gap-3 min-w-0">
        <Badge variant={getDifficultyBadgeVariant(activeDifficulty)} size="sm">
          {activeDifficulty || "Medium"}
        </Badge>
        <h1 className="text-sm font-bold text-slate-100 truncate">
          {activeProblemTitle || session?.problem || "Interview Session"}
        </h1>
        {session?.secondaryProblem && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
            2 DSA Questions Mode
          </span>
        )}
      </div>

      {/* Right: Timer + Participants */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="size-3.5" />
          <span>{isHost ? "Host" : "Candidate"}</span>
          <span className={`size-2 rounded-full ${session?.participant ? "bg-emerald-500" : "bg-slate-600"}`} />
          <span className={`size-2 rounded-full ${session?.host ? "bg-emerald-500" : "bg-slate-600"}`} />
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs border ${
            isOverTime
              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
              : "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
          }`}
        >
          <Clock className="size-3.5" />
          <span>{formatTimer(secondsElapsed)}</span>
          {session?.durationMinutes && (
            <span className="text-slate-500">/ {session.durationMinutes}m</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Session Page Inner ────────────────────────────────────────────────────
function SessionPageInner({ session, isHost, isParticipant, id, chatClient, channel }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [liveAIData, setLiveAIData] = useState(null);

  // 2 DSA Questions Management
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const questionList = [
    { title: session?.problem, difficulty: session?.difficulty || "medium" },
    ...(session?.secondaryProblem
      ? [{ title: session.secondaryProblem, difficulty: session.secondaryDifficulty || "medium" }]
      : []),
  ];

  const currentQuestion = questionList[activeQuestionIndex] || questionList[0];

  const problemData = currentQuestion?.title
    ? Object.values(PROBLEMS).find((p) => p.title === currentQuestion.title)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  const endSessionMutation = useEndSession();

  // Socket.io setup & question sync
  useEffect(() => {
    if (!id || !user) return;
    const socket = getSocket();

    socket.emit("register_user", { userId: user.id });

    socket.emit("join_room", {
      roomId: id,
      userRole: isHost ? "host" : "candidate",
      userId: user.id,
      userName: user.fullName || user.firstName || "Participant",
    });

    socket.on("code_sync", ({ code: remoteCode, language: remoteLang }) => {
      if (remoteCode !== undefined) setCode(remoteCode);
      if (remoteLang !== undefined) setSelectedLanguage(remoteLang);
    });

    socket.on("question_switched", ({ activeQuestionIndex: newIdx, problemTitle }) => {
      if (newIdx !== undefined) {
        setActiveQuestionIndex(newIdx);
        if (!isHost) {
          toast.success(`Active Problem switched to Question ${newIdx + 1}: "${problemTitle || 'Updated Problem'}"`);
        }
      }
    });

    socket.on("live_ai_analysis_update", (analysis) => {
      setLiveAIData(analysis);
    });

    // Real-time interview session completion listener for Candidate & Host
    socket.on("interview_status", ({ status }) => {
      if (status === "completed") {
        toast.success("Interview session has been completed! Redirecting to Dashboard...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1200);
      }
    });

    return () => {
      socket.off("code_sync");
      socket.off("question_switched");
      socket.off("live_ai_analysis_update");
      socket.off("interview_status");
    };
  }, [id, user, isHost, navigate]);

  // Update starter code when active question or language changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [activeQuestionIndex, selectedLanguage, problemData?.title]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect on completion
  useEffect(() => {
    if (session?.status === "completed") {
      navigate("/dashboard", { replace: true });
    }
  }, [session?.status, navigate]);

  const handleSwitchQuestion = (idx) => {
    setActiveQuestionIndex(idx);
    const targetQ = questionList[idx];
    const socket = getSocket();

    socket.emit("switch_question", {
      roomId: id,
      questionIndex: idx,
      problemTitle: targetQ?.title,
    });

    // Update starter code for new problem
    const newProblemData = targetQ?.title
      ? Object.values(PROBLEMS).find((p) => p.title === targetQ.title)
      : null;
    const starter = newProblemData?.starterCode?.[selectedLanguage] || "";
    setCode(starter);
    setOutput(null);

    socket.emit("code_change", { roomId: id, code: starter, language: selectedLanguage });
  };

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

    const socket = getSocket();
    socket.emit("live_ai_analyze_request", {
      roomId: id,
      code,
      language: selectedLanguage,
      problemTitle: currentQuestion?.title,
      elapsedMinutes: Math.floor(secondsElapsed / 60),
    });
  };

  const handleEndSession = () => {
    if (confirm("End this interview session? Both participants will be disconnected.")) {
      const socket = getSocket();
      socket.emit("interview_ended", { roomId: id });
      endSessionMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Interview ended successfully.");
          navigate("/dashboard", { replace: true });
        },
      });
    }
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Header */}
      <InterviewHeader
        session={session}
        activeProblemTitle={currentQuestion?.title}
        activeDifficulty={currentQuestion?.difficulty}
        secondsElapsed={secondsElapsed}
        isHost={isHost}
      />

      {/* Main 3-Panel Layout */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL: Participant Videos */}
          <Panel defaultSize={20} minSize={16} maxSize={28}>
            <div className="h-full bg-slate-900 flex flex-col border-r border-slate-800">
              <div className="px-3 pt-3 pb-2 shrink-0">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Participants
                </p>
              </div>
              <div className="flex-1 overflow-hidden">
                <InterviewVideoPanel isHost={isHost} />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-slate-800 hover:bg-emerald-500/60 transition-colors cursor-col-resize" />

          {/* CENTER PANEL: Problem Switcher + Editor + Terminal */}
          <Panel defaultSize={55} minSize={40}>
            <PanelGroup direction="vertical">
              {/* Problem Description with 2 DSA Questions Switcher */}
              <Panel defaultSize={35} minSize={18} maxSize={50}>
                <div className="h-full bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
                  {/* 2 DSA Questions Selector Bar */}
                  {questionList.length > 1 && (
                    <div className="p-2 bg-slate-200/80 border-b border-slate-300 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 flex-1">
                        {questionList.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSwitchQuestion(idx)}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              activeQuestionIndex === idx
                                ? "bg-white text-emerald-800 shadow-xs border border-emerald-300 ring-2 ring-emerald-500/20"
                                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                            }`}
                          >
                            <span className={`size-4 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                              activeQuestionIndex === idx ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="truncate max-w-[140px]">{q.title}</span>
                            <Badge variant={getDifficultyBadgeVariant(q.difficulty)} size="sm" className="text-[9px] py-0 px-1">
                              {q.difficulty}
                            </Badge>
                          </button>
                        ))}
                      </div>

                      {isHost && (
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 shrink-0 px-1">
                          <ArrowRightLeft className="size-3 text-emerald-600" /> Host Question Switcher
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Question Content */}
                  <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    {problemData?.description && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Problem Statement (Question {activeQuestionIndex + 1})
                          </h2>
                          <Badge variant={getDifficultyBadgeVariant(currentQuestion?.difficulty)}>
                            {currentQuestion?.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {problemData.description.text}
                        </p>
                      </div>
                    )}

                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Examples
                        </h2>
                        <div className="space-y-2">
                          {problemData.examples.map((ex, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs"
                            >
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
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-px bg-slate-800 hover:bg-emerald-500/60 transition-colors cursor-row-resize" />

              {/* Code Editor */}
              <Panel defaultSize={45} minSize={25}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={handleCodeChange}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-px bg-slate-800 hover:bg-emerald-500/60 transition-colors cursor-row-resize" />

              {/* Terminal Output */}
              <Panel defaultSize={20} minSize={12}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-px bg-slate-800 hover:bg-emerald-500/60 transition-colors cursor-col-resize" />

          {/* RIGHT PANEL: Chat / AI / Notes Tabs */}
          <Panel defaultSize={25} minSize={18} maxSize={35}>
            <RightSidebar
              isHost={isHost}
              sessionId={id}
              problemTitle={currentQuestion?.title}
              difficulty={currentQuestion?.difficulty}
              liveAIData={liveAIData}
              chatClient={chatClient}
              channel={channel}
            />
          </Panel>
        </PanelGroup>
      </div>

      {/* Bottom Controls */}
      <InterviewControls
        isHost={isHost}
        onEndSession={handleEndSession}
      />
    </div>
  );
}

// ─── Session Page (loading + Stream wrapper) ───────────────────────────────────
export default function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, {
      onSuccess: refetch,
      onError: () => navigate("/dashboard"),
    });
  }, [session, user, loadingSession, isHost, isParticipant]);

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession
  );

  if (loadingSession || (!session && !loadingSession)) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="size-10 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold">Loading interview session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-3">
        <PhoneOff className="size-10 text-rose-500" />
        <p className="text-base font-bold text-white">Session not found</p>
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-slate-400">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (isInitializingCall) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="size-10 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold">Connecting to video call...</p>
        <p className="text-xs text-slate-500">Establishing secure peer connection</p>
      </div>
    );
  }

  if (!streamClient || !call) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-3">
        <PhoneOff className="size-10 text-rose-500" />
        <p className="text-base font-bold text-white">Unable to connect to video call</p>
        <p className="text-xs text-slate-500">Please check camera/microphone permissions and refresh.</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="text-slate-200">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <SessionPageInner
          session={session}
          isHost={isHost}
          isParticipant={isParticipant}
          id={id}
          chatClient={chatClient}
          channel={channel}
        />
      </StreamCall>
    </StreamVideo>
  );
}
