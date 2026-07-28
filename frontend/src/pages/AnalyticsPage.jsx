import React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { Badge } from "../components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  MessageSquare,
  Code2,
  Smile,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
} from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    { title: "Technical Score", score: 92, icon: Code2, color: "emerald", detail: "Top 5% candidate" },
    { title: "Communication Score", score: 88, icon: MessageSquare, color: "emerald", detail: "Clear explanation" },
    { title: "Confidence Score", score: 85, icon: Smile, color: "emerald", detail: "Strong composure" },
    { title: "Completion Rate", score: 96, icon: CheckCircle2, color: "emerald", detail: "24/25 solved" },
  ];

  const scoreTrends = [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 83 },
    { month: "Apr", score: 85 },
    { month: "May", score: 89 },
    { month: "Jun", score: 92 },
  ];

  const strengths = [
    "Algorithmic optimization and time complexity trade-off awareness",
    "Structured problem decomposition and step-by-step thinking",
    "Clean code modularity and intuitive naming conventions",
  ];

  const weaknesses = [
    "Edge case handling for empty inputs and numeric boundary conditions",
    "Pacing during early 10 minutes of live video coding",
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Performance Analytics
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Data-driven insights into your technical competency and interview readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="lg">
              Overall Rank: Senior Engineer Ready
            </Badge>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    {metric.score}%
                  </span>
                </div>
                <h3 className="font-semibold text-slate-700 text-xs">{metric.title}</h3>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{metric.score} / 100</p>
                <div className="mt-3">
                  <Progress value={metric.score} variant="gradient" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{metric.detail}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts & AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Card */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Score Improvement Trend</h2>
                    <p className="text-xs text-slate-500">6-month interview performance trajectory</p>
                  </div>
                </div>

                <Badge variant="emerald">+20% Growth</Badge>
              </div>

              {/* Visual Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
                {scoreTrends.map((st, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-slate-700">{st.score}%</span>
                    <div
                      className="w-full max-w-[40px] bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-xl transition-all duration-500 hover:opacity-90"
                      style={{ height: `${st.score}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-500">{st.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Baseline: 72%</span>
              <span className="font-semibold text-emerald-700">Current Target: 95%</span>
            </div>
          </Card>

          {/* AI Insights Card */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border-none flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
                <Sparkles className="size-4" />
                <span>AI Performance Summary</span>
              </div>

              <h3 className="text-xl font-bold mb-2">Excellent Technical Readiness</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                You possess strong algorithmic intuition and clear code articulation. Candidates with your metrics have a 94% pass rate in FAANG technical interviews.
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-1">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <Target className="size-3.5" /> Recommended Next Action
                  </span>
                  <p className="text-slate-200">Practice 2 Hard Graphs & Dynamic Programming problems to reach 95%+ score.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Updated Today</span>
              <span className="text-emerald-300 font-medium">TalentIQ AI Model v4</span>
            </div>
          </Card>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Key Strengths</h3>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                <AlertCircle className="size-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2.5">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="size-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
