import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Menu, Search, Plus, Bell, Copy, Check, Crown, UserCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import NotificationDrawer from "../NotificationDrawer";
import toast from "react-hot-toast";

export function TopHeader({ onOpenSidebar, onCreateSession, userRole, candidateId }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCandidateId = () => {
    if (!candidateId) return;
    navigator.clipboard.writeText(candidateId);
    setCopied(true);
    toast.success("Candidate ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between">
        {/* Left section - Hamburger & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open Sidebar"
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 w-64 lg:w-80 text-sm text-slate-500 focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <Search className="size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate ID, problems..."
              className="bg-transparent border-none outline-none text-slate-800 text-xs sm:text-sm w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right section - Role, Candidate ID Badge, Notifications, User Button */}
        <div className="flex items-center gap-3">
          {/* Candidate ID Pill */}
          {candidateId && (
            <div
              onClick={handleCopyCandidateId}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-xs font-bold cursor-pointer hover:bg-emerald-100/80 transition-all"
              title="Click to copy Candidate ID"
            >
              <span>{candidateId}</span>
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-emerald-600" />}
            </div>
          )}

          {/* Application Role Badge */}
          {userRole && (
            <Badge variant={userRole === "host" ? "warning" : "emerald"} size="sm" className="hidden sm:inline-flex uppercase">
              {userRole === "host" ? (
                <>
                  <Crown className="size-3" /> HOST
                </>
              ) : (
                <>
                  <UserCheck className="size-3" /> CANDIDATE
                </>
              )}
            </Badge>
          )}

          {onCreateSession && (
            <Button
              variant="emeraldGradient"
              size="sm"
              onClick={onCreateSession}
              className="hidden sm:inline-flex"
            >
              <Plus className="size-4" />
              <span>Schedule Interview</span>
            </Button>
          )}

          {/* Notification Bell Trigger */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="pl-2 border-l border-slate-200/80 flex items-center">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
