import React, { useState, useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import CandidateIdLookup from "../components/CandidateIdLookup";
import CreateInterviewModal from "../components/CreateInterviewModal";
import ActiveSessions from "../components/ActiveSessions";
import {
  Crown,
  Plus,
  Users,
  CheckCircle2,
  BookOpen,
  Search,
  Loader2,
  UserCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { useActiveSessions, useMyRecentSessions } from "../hooks/useSessions";
import axios from "../lib/axios";

// Candidate card in the host directory
function CandidateCard({ candidate, onSchedule }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300/60 hover:shadow-md transition-all flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {candidate.profileImage ? (
          <img
            src={candidate.profileImage}
            alt={candidate.name}
            className="size-10 rounded-xl object-cover border border-slate-200/60 shrink-0"
          />
        ) : (
          <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
            {candidate.name?.charAt(0) || "C"}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{candidate.name}</p>
          <p className="text-xs text-slate-500 truncate">{candidate.email}</p>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono text-[10px] font-bold">
              <UserCheck className="size-2.5" />
              {candidate.candidateId}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="emeraldGradient"
        size="sm"
        onClick={() => onSchedule(candidate)}
        className="shrink-0"
      >
        <Plus className="size-3.5" />
        <span className="hidden sm:inline">Schedule</span>
      </Button>
    </div>
  );
}

export default function HostDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [candidatePage, setCandidatePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const { data: activeSessionsData, isLoading: loadingActive } = useActiveSessions();
  const { data: recentSessionsData } = useMyRecentSessions();
  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const problemsList = Object.values(PROBLEMS);

  const fetchCandidates = async (search = "", page = 1) => {
    setLoadingCandidates(true);
    try {
      const res = await axios.get(`/users/candidates?search=${encodeURIComponent(search)}&page=${page}&limit=8`);
      setCandidates(res.data.candidates || []);
      setTotalCandidates(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Error fetching candidates:", err.message);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchCandidates(candidateSearch, candidatePage);
  }, [candidatePage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidatePage(1);
      fetchCandidates(candidateSearch, 1);
    }, 350);
    return () => clearTimeout(timer);
  }, [candidateSearch]);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidateId(candidate.candidateId);
    setShowCreateModal(true);
  };

  return (
    <AppLayout onCreateSession={() => setShowCreateModal(true)}>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Crown className="size-3.5 text-amber-400" />
              <span>Interviewer & Host Control Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Host Dashboard</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Browse and search registered candidates, schedule interviews, and manage your evaluation workflow.
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Users className="size-5" />
              </div>
              <Badge variant="emerald">Live</Badge>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{activeSessions.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Active Sessions</p>
          </Card>

          <Card className="p-5">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 mb-3 inline-block">
              <CheckCircle2 className="size-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{recentSessions.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Completed Interviews</p>
          </Card>

          <Card className="p-5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 mb-3 inline-block">
              <UserCheck className="size-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{totalCandidates}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Registered Candidates</p>
          </Card>
        </div>

        {/* ─── Candidate Directory ────────────────────────────── */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <UserCheck className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Candidate Directory</h2>
                <p className="text-xs text-slate-500">Browse all registered candidates and schedule interviews</p>
              </div>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, or CAND-ID..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Candidate grid */}
          {loadingCandidates ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="size-5 animate-spin text-emerald-500" />
              <span className="text-sm">Loading candidates...</span>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <UserCheck className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold text-slate-600">No candidates found</p>
              <p className="text-xs mt-1">
                {candidateSearch ? `No results for "${candidateSearch}"` : "No candidates have registered yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  onSchedule={handleSelectCandidate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Showing {candidates.length} of {totalCandidates} candidates
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCandidatePage((p) => Math.max(1, p - 1))}
                  disabled={candidatePage === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-slate-500">
                  {candidatePage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCandidatePage((p) => Math.min(totalPages, p + 1))}
                  disabled={candidatePage === totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Candidate ID Lookup */}
        <CandidateIdLookup
          onSelectCandidate={(cand) => {
            setSelectedCandidateId(cand.candidateId);
            setShowCreateModal(true);
          }}
        />

        {/* Active Sessions */}
        <ActiveSessions
          sessions={activeSessions}
          isLoading={loadingActive}
          isUserInSession={() => false}
        />

        {/* Schedule Interview Modal */}
        <CreateInterviewModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCandidateId("");
          }}
          initialCandidateId={selectedCandidateId}
        />
      </div>
    </AppLayout>
  );
}
