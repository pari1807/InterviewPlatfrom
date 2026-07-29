import React from "react";
import Banner from "../modules/resume/components/Home/Banner";
import Hero from "../modules/resume/components/Home/Hero";
import Features from "../modules/resume/components/Home/Features";
import Testimonials from "../modules/resume/components/Home/Testimonials";
import CallToAction from "../modules/resume/components/Home/CallToAction";
import Footer from "../modules/resume/components/Home/Footer";
import { Link } from "react-router";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Video, Code2, Users, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 1. Top Announcement Banner from ResumeBuilder */}
      <Banner />

      {/* 2. Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group py-0.5">
            <img src="/logo.svg" alt="TalentIQ Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button variant="emeraldGradient" size="md">
                <span>Get Started</span>
                <ArrowRight className="size-4" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section from ResumeBuilder */}
      <Hero />

      {/* 4. Module 1 Showcase: Remote Technical Interview Platform */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs tracking-[0.24em] uppercase text-emerald-700 bg-white/80 border border-emerald-200 rounded-full px-6 py-2">
            Module 1 — Remote Interview Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 pt-2">
            Realistic Technical Screens & Live Video Calls
          </h2>
          <p className="text-slate-600 text-base">
            Conducted in HD video with Monaco multi-language code execution and Gemini AI analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl transition-all rounded-3xl border border-slate-200 bg-white">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Video className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">HD Video & Audio Call</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Crystal clear real-time video streaming powered by Stream SDK for candidate communication.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-all rounded-3xl border border-slate-200 bg-white">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center">
              <Code2 className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Monaco Code Editor</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Real-time pair programming code editor with instant multi-language execution via Piston.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-all rounded-3xl border border-slate-200 bg-white">
            <div className="size-14 mx-auto mb-6 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Users className="size-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Peer & Host Collaboration</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Seamless candidate key scheduling, interactive chat, and live interview monitoring.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Module 2 Showcase: AI Resume Builder (Features.jsx Bento-Grid from ResumeBuilder) */}
      <Features />

      {/* 6. Testimonials from ResumeBuilder (Infinite Animated Scrolling) */}
      <Testimonials />

      {/* 7. Call To Action from ResumeBuilder */}
      <CallToAction />

      {/* 8. Footer from ResumeBuilder */}
      <Footer />
    </div>
  );
}
