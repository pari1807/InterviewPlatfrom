import React from "react";
import { Link } from "react-router";
import { SignInButton } from "@clerk/clerk-react";
import {
  Sparkles,
  ArrowRight,
  Video,
  Code2,
  Users,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1">
                Talent <span className="text-emerald-600 font-extrabold">IQ</span>
              </span>
              <span className="text-xs text-emerald-700 font-medium -mt-1">
                Remote Interview SaaS
              </span>
            </div>
          </Link>

          <SignInButton mode="modal">
            <Button variant="emeraldGradient" size="md">
              <span>Get Started</span>
              <ArrowRight className="size-4" />
            </Button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="emerald" size="lg" className="inline-flex">
              <Zap className="size-4 text-emerald-600" />
              <span>Real-time Pair Programming & AI Coaching</span>
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Master Technical <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Remote Interviews
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The premier platform for collaborative coding interviews. Practice live video pair programming with peers, receive AI analytics, and ace technical screens.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <SignInButton mode="modal">
                <Button variant="emeraldGradient" size="lg">
                  <span>Start Free Trial</span>
                  <ArrowRight className="size-5" />
                </Button>
              </SignInButton>

              <SignInButton mode="modal">
                <Button variant="outline" size="lg">
                  <Video className="size-5 text-emerald-600" />
                  <span>Watch Platform Demo</span>
                </Button>
              </SignInButton>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> Live HD Video & Chat
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> Monaco Code Editor
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> Multi-Language Sandbox
              </span>
            </div>
          </div>

          {/* Right Image Display */}
          <div className="relative">
            <div className="p-2 rounded-3xl bg-gradient-to-b from-slate-200 to-emerald-100 shadow-2xl border border-slate-200">
              <img
                src="/hero.png"
                alt="TalentIQ Interview Platform"
                className="rounded-2xl w-full h-auto object-cover border border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">10,000+</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Active Candidates</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">50,000+</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Mock Interviews Conducted</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">99.9%</p>
            <p className="text-xs font-medium text-slate-500 mt-1">System Uptime</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">94%</p>
            <p className="text-xs font-medium text-slate-500 mt-1">FAANG Pass Rate</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="emerald">Platform Capabilities</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything You Need to Ace Coding Screens
          </h2>
          <p className="text-slate-600 text-sm">
            Purpose-built tools for realistic technical interview preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Video className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">HD Video & Audio Call</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Crystal clear video streaming powered by Stream SDK for natural candidate communication.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center">
              <Code2 className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Monaco Code Editor</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Real-time pair programming code editor with syntax highlighting and instant compilation via Piston.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Users className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Peer Collaboration</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Instant 1-on-1 interview creation with open room invitations and interactive text chat.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
