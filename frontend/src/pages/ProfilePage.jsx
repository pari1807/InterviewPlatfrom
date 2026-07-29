import React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { User, Mail, Calendar, Shield, Award, CheckCircle2, Code2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account credentials and candidate portfolio.</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="size-24 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-md"
              />
            ) : (
              <div className="size-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900">{user?.fullName || "Candidate User"}</h2>
                <Badge variant="emerald">PRO Candidate</Badge>
              </div>

              <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="size-4 text-slate-400" />
                <span>{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</span>
              </p>

              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="size-3.5 text-emerald-600" /> Verified Clerk Auth
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" /> Member since 2026
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Candidate Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 text-center">
            <div className="p-2.5 size-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mb-2">
              <Code2 className="size-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">24</p>
            <p className="text-xs font-semibold text-slate-500">Problems Solved</p>
          </Card>

          <Card className="p-5 text-center">
            <div className="p-2.5 size-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mb-2">
              <Award className="size-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">92%</p>
            <p className="text-xs font-semibold text-slate-500">Average AI Score</p>
          </Card>

          <Card className="p-5 text-center">
            <div className="p-2.5 size-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mb-2">
              <CheckCircle2 className="size-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">12</p>
            <p className="text-xs font-semibold text-slate-500">Live Peer Interviews</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
