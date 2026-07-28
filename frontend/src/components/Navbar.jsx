import React from "react";
import { Link, useLocation } from "react-router";
import { Sparkles, BookOpen, LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1">
              Talent <span className="text-emerald-600 font-extrabold">IQ</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium -mt-1">Remote Interview Platform</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/problems"
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              isActive("/problems")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <BookOpen className="size-4 text-emerald-600" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <Link
            to="/dashboard"
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              isActive("/dashboard")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <LayoutDashboard className="size-4 text-emerald-600" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="ml-2 pl-2 border-l border-slate-200">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
