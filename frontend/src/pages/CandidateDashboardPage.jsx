import React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import PerformanceTrendChart from "../components/charts/PerformanceTrendChart";
import SkillRadarChart from "../components/charts/SkillRadarChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import {
  Code2,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Upload,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Link } from "react-router";

export default function CandidateDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Performance Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track your interview scores, coding progression, and AI-driven skill readiness.
            </p>
          </div>

          <Link to="/problems">
            <Button variant="emeraldGradient" size="md">
              <Code2 className="size-4" />
              <span>Practice Problems</span>
            </Button>
          </Link>
        </div>

        {/* Chart.js Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coding Quality & Performance Trend Line Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Score Improvement Trajectory</h2>
                  <p className="text-xs text-slate-500">Live AI evaluation ratings over time</p>
                </div>
              </div>

              <Badge variant="emerald">Live Chart.js</Badge>
            </div>

            <PerformanceTrendChart />
          </Card>

          {/* Skill Radar Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
                  <Award className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Skill Competency Radar</h2>
                  <p className="text-xs text-slate-500">Multidimensional score breakdown</p>
                </div>
              </div>
            </div>

            <SkillRadarChart />
          </Card>
        </div>

        {/* Lower Row: Category Pie Chart & AI Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Solved Problems by Topic</h2>
                <p className="text-xs text-slate-500">Distribution across algorithmic domains</p>
              </div>
            </div>

            <CategoryPieChart />
          </Card>

          {/* AI Career & Resume Suggestions Card */}
          <Card className="p-6 bg-gradient-to-br from-emerald-950 to-slate-900 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-3">
                <Sparkles className="size-4" />
                <span>AI Candidate Optimizer</span>
              </div>

              <h3 className="text-xl font-bold mb-2">Resume & Profile Insights</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Your technical scores place you in the top 8% of full-stack candidates. Upload your updated resume to auto-match with target job specs.
              </p>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-white">Upload Candidate Resume</p>
                  <p className="text-[11px] text-slate-300">PDF, DOCX format accepted</p>
                </div>

                <Button variant="emeraldGradient" size="sm">
                  <Upload className="size-4" />
                  <span>Upload</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-300">
                <Flame className="size-4" /> 5-Day Practice Streak
              </span>
              <span>Updated Live</span>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
