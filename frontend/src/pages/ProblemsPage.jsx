import React, { useState } from "react";
import { Link } from "react-router";
import { PROBLEMS } from "../data/problems";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Badge, getDifficultyBadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Search, ChevronRight, Code2, BookOpen, Layers } from "lucide-react";

export default function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      activeTab === "all" || problem.difficulty.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview Practice Problems
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Curated data structures and algorithm challenges designed for technical screens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-xs">
              {problems.length} Challenges Available
            </span>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {["all", "easy", "medium", "hard"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-white text-emerald-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </Card>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Link key={problem.id} to={`/problem/${problem.id}`} className="block">
              <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center font-bold shrink-0">
                    <Code2 className="size-6" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                        {problem.title}
                      </h2>
                      <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-100">
                        {problem.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                      {problem.description?.text}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-end">
                  <Button variant="emeraldGhost" size="sm">
                    <span>Solve Challenge</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Summary Footer */}
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Problems</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{problems.length}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase">Easy</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{easyCount}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 font-semibold uppercase">Medium</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{mediumCount}</p>
            </div>
            <div>
              <p className="text-xs text-rose-600 font-semibold uppercase">Hard</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{hardCount}</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
