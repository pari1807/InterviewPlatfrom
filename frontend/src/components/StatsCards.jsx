import React from "react";
import { Users, CheckCircle2, TrendingUp, Flame, Award } from "lucide-react";
import { Card } from "./ui/Card";

export default function StatsCards({ activeSessionsCount = 0, recentSessionsCount = 0 }) {
  const stats = [
    {
      title: "Live Sessions",
      value: activeSessionsCount,
      subtitle: "Active peer rooms",
      icon: Users,
      badge: "LIVE NOW",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    },
    {
      title: "Total Completed",
      value: recentSessionsCount,
      subtitle: "+3 from last week",
      icon: CheckCircle2,
      iconBg: "bg-teal-50 text-teal-600 border border-teal-200/60",
    },
    {
      title: "Average Score",
      value: recentSessionsCount > 0 ? "92%" : "N/A",
      subtitle: "Top 10% candidate rank",
      icon: Award,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    },
    {
      title: "Practice Streak",
      value: "5 Days",
      subtitle: "Personal best record!",
      icon: Flame,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
                <Icon className="size-5" />
              </div>
              {stat.badge && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-pulse">
                  {stat.badge}
                </span>
              )}
            </div>

            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-1">{stat.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtitle}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
