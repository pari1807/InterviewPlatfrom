import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { useActiveSessions, useMyRecentSessions } from "../hooks/useSessions";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import HostRubricAssistant from "../components/HostRubricAssistant";
import CandidateIdLookup from "../components/CandidateIdLookup";
import CreateInterviewModal from "../components/CreateInterviewModal";
import ActiveSessions from "../components/ActiveSessions";
import {
  Crown,
  Plus,
  Users,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { PROBLEMS } from "../data/problems";

export default function HostDashboardPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedProblemForRubric, setSelectedProblemForRubric] = useState("Two Sum");

  const { data: activeSessionsData, isLoading: loadingActive } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecent } = useMyRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const problemsList = Object.values(PROBLEMS);

  return (
    <AppLayout onCreateSession={() => setShowCreateModal(true)}>
      <div className="space-y-8 animate-fade-in">
        {/* Host Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Crown className="size-3.5 text-amber-400" />
              <span>Interviewer & Host Control Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Host Interview Management</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Lookup Candidate IDs, schedule interviews, expand evaluation rubrics with AI, and review candidate reports.
            </p>
          </div>

          <Button
            variant="emeraldGradient"
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Plus className="size-5" />
            <span>Schedule Interview</span>
          </Button>
        </div>

        {/* Candidate ID Verification Section */}
        <CandidateIdLookup
          onSelectCandidate={(cand) => {
            setSelectedCandidateId(cand.candidateId);
            setShowCreateModal(true);
          }}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Users className="size-5" />
              </div>
              <Badge variant="emerald">Live Rooms</Badge>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{activeSessions.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Active Candidate Sessions</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{recentSessions.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Completed Evaluations</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <BookOpen className="size-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{problemsList.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Curated Problem Library</p>
          </Card>
        </div>

        {/* AI Host Assistant & Live Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HostRubricAssistant
              problemTitle={selectedProblemForRubric}
              difficulty="Medium"
            />

            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActive}
              isUserInSession={() => false}
            />
          </div>

          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <Layers className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Question Library</h3>
              </div>

              <div className="space-y-3">
                {problemsList.slice(0, 4).map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => setSelectedProblemForRubric(prob.title)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedProblemForRubric === prob.title
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs">{prob.title}</h4>
                      <Badge variant={getDifficultyBadgeVariant(prob.difficulty)} size="sm">
                        {prob.difficulty}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{prob.category}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="mt-6 w-full"
            >
              <span>Schedule Interview</span>
              <ArrowRight className="size-4" />
            </Button>
          </Card>
        </div>

        {/* Create Interview Modal */}
        <CreateInterviewModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          initialCandidateId={selectedCandidateId}
        />
      </div>
    </AppLayout>
  );
}
