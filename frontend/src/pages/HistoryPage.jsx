import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useMyRecentSessions } from "../hooks/useSessions";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Calendar,
  Building2,
  Briefcase,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Loader2,
} from "lucide-react";

export default function HistoryPage() {
  const { data: recentSessionsData, isLoading } = useMyRecentSessions();
  const sessions = recentSessionsData?.sessions || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.host?.name && s.host.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      s.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || s.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage) || 1;
  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review all your previous coding interviews, scores, and feedback history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-xs">
              Total Recorded: {sessions.length}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by problem or host..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
        </Card>

        {/* History Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-10 animate-spin text-emerald-600" />
          </div>
        ) : paginatedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSessions.map((session, index) => (
              <Card key={session._id || index} className="p-6 flex flex-col justify-between">
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold">
                        <Code2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base truncate">
                          {session.problem}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="size-3 text-slate-400" />
                          <span>Technical Interview Session</span>
                        </p>
                      </div>
                    </div>

                    <Badge variant={getDifficultyBadgeVariant(session.difficulty)}>
                      {session.difficulty}
                    </Badge>
                  </div>

                  {/* Interview details list */}
                  <div className="space-y-2 text-xs text-slate-600 my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Briefcase className="size-3.5" /> Target Role:
                      </span>
                      <span className="font-semibold text-slate-800">Software Engineer</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="size-3.5" /> Duration:
                      </span>
                      <span className="font-semibold text-slate-800">45 Minutes</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Award className="size-3.5" /> AI Score:
                      </span>
                      <span className="font-bold text-emerald-600">92 / 100</span>
                    </div>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <CheckCircle2 className="size-4" />
                    <span>Completed</span>
                  </span>

                  <span className="text-slate-400 text-[11px]">
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="size-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Calendar className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No interview history found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or complete a new interview session.</p>
          </Card>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
