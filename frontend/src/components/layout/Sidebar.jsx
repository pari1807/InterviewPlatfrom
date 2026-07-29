import React from "react";
import { Link, useLocation } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useDbUser } from "../../context/UserContext";
import {
  LayoutDashboard,
  Crown,
  UserCheck,
  Code2,
  History,
  BarChart3,
  Sparkles,
  User,
  Settings,
  X,
} from "lucide-react";

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useUser();
  const { dbUser } = useDbUser();

  const userRole = dbUser?.role;

  const isActive = (path) => {
    if (location.pathname === path) return true;
    if (path === "/dashboard" && (location.pathname === "/host-dashboard" || location.pathname === "/candidate-dashboard")) return true;
    if (path === "/host-dashboard" && location.pathname === "/dashboard") return true;
    if (path === "/candidate-dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && path !== "/host-dashboard" && path !== "/candidate-dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Dynamically tailor the top dashboard link based on the user's role
  const mainDashboardItem =
    userRole === "host"
      ? { label: "Host Dashboard", icon: Crown, path: "/host-dashboard" }
      : userRole === "candidate"
      ? { label: "Candidate Dashboard", icon: UserCheck, path: "/candidate-dashboard" }
      : { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" };

  const navItems = [
    mainDashboardItem,
    { label: "Interview Practice", icon: Code2, path: "/problems" },
    { label: "Previous Interviews", icon: History, path: "/history" },
    { label: "Performance Analytics", icon: BarChart3, path: "/analytics" },
    { label: "AI Feedback", icon: Sparkles, path: "/feedback" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center group py-0.5">
            <img src="/logo.svg" alt="Logo" className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active
                    ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`size-4.5 transition-colors ${
                    active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{item.label}</span>
                {item.label === "AI Feedback" && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-700">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="size-9 rounded-lg object-cover border border-emerald-500/20"
              />
            ) : (
              <div className="size-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.fullName || user?.firstName || (userRole === "host" ? "Host" : "Candidate")}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium truncate capitalize">
                {userRole ? `${userRole} Account` : "PRO Member"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
