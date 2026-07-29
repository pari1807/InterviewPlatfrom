import React from 'react';
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Video, Star, CheckCircle2, Sparkles, ShieldCheck, Code2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

const Hero = () => {
  const companyNames = [
    { name: "Google", font: "font-semibold tracking-tighter text-slate-400 text-xl" },
    { name: "Microsoft", font: "font-bold tracking-tight text-slate-400 text-xl" },
    { name: "Amazon", font: "font-extrabold tracking-normal text-slate-400 text-xl" },
    { name: "Meta", font: "font-black tracking-tight text-slate-400 text-xl" },
    { name: "Stripe", font: "font-bold tracking-tighter text-slate-400 text-xl" },
    { name: "Vercel", font: "font-semibold tracking-widest uppercase text-slate-400 text-lg" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-12 lg:px-20 text-slate-950 pt-10 md:pt-16 pb-20 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-300/40 via-teal-200/30 to-indigo-300/30 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Avatars + Star Rating */}
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border border-emerald-200/80 shadow-md mb-6 hover:border-emerald-300 transition-colors">
        <div className="flex -space-x-2.5">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user1" className="size-7 object-cover rounded-full border-2 border-white" />
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user2" className="size-7 object-cover rounded-full border-2 border-white" />
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user3" className="size-7 object-cover rounded-full border-2 border-white" />
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" alt="user4" className="size-7 object-cover rounded-full border-2 border-white" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex text-amber-400 gap-0.5">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-700">
            4.9/5 Rating from 100,000+ Engineers
          </span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-center max-w-5xl text-slate-900 leading-[1.12]">
        Land your dream tech job with <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
          AI Resumes & Live Pair Programming
        </span>
      </h1>

      <p className="max-w-2xl text-center text-base sm:text-lg my-6 text-slate-600 leading-relaxed font-normal">
        Build ATS-optimized resumes with Gemini AI bullet suggestions, then practice real-time technical screens with HD video call and Monaco code execution.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <SignInButton mode="modal">
          <Button variant="emeraldGradient" size="lg" className="rounded-full px-9 h-13 text-base font-bold shadow-xl shadow-emerald-900/25 hover:scale-105 transition-all">
            <span>Get Started Free</span>
            <ArrowRight className="size-5" />
          </Button>
        </SignInButton>

        <SignInButton mode="modal">
          <Button variant="outline" size="lg" className="rounded-full px-9 h-13 text-base font-bold border-slate-300 text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all">
            <Video className="size-5 text-emerald-600" />
            <span>Explore Live Platform</span>
          </Button>
        </SignInButton>
      </div>

      {/* Feature Checkmarks */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700 mb-14">
        <span className="flex items-center gap-1.5 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
          <CheckCircle2 className="size-4 text-emerald-600" /> Free ATS Templates
        </span>
        <span className="flex items-center gap-1.5 bg-teal-50/80 px-3.5 py-1.5 rounded-full border border-teal-200/80">
          <CheckCircle2 className="size-4 text-teal-600" /> HD Live Video & Code Sync
        </span>
        <span className="flex items-center gap-1.5 bg-indigo-50/80 px-3.5 py-1.5 rounded-full border border-indigo-200/80">
          <CheckCircle2 className="size-4 text-indigo-600" /> Gemini AI Evaluations
        </span>
      </div>

      {/* Ultra-Modern Floating Glassmorphic SaaS Hero Showcase */}
      <div className="relative w-full max-w-5xl mx-auto my-4 group">
        {/* Floating AI Badge - Top Left */}
        <div className="absolute -top-5 -left-4 md:-left-8 z-30 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-xl px-4 py-2.5 rounded-2xl animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="size-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Gemini AI Active</p>
            <p className="text-[10px] text-emerald-600 font-semibold">1-Click Content Enhancement</p>
          </div>
        </div>

        {/* Floating ATS Badge - Bottom Right */}
        <div className="absolute -bottom-6 -right-4 md:-right-8 z-30 hidden sm:flex items-center gap-2.5 bg-slate-900 text-white border border-white/20 shadow-2xl px-4.5 py-2.5 rounded-2xl">
          <div className="size-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <ShieldCheck className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">99.4% ATS Compatibility</p>
            <p className="text-[10px] text-emerald-400 font-medium">Recruiter Ready Export</p>
          </div>
        </div>

        {/* Floating Live Code Badge - Top Right */}
        <div className="absolute -top-5 -right-4 md:-right-6 z-30 hidden lg:flex items-center gap-2.5 bg-white/95 backdrop-blur-xl border border-teal-200/90 shadow-xl px-4 py-2.5 rounded-2xl">
          <div className="size-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
            <Code2 className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Monaco Code Editor</p>
            <p className="text-[10px] text-teal-600 font-semibold">Multi-Language Execution</p>
          </div>
        </div>

        {/* Glassmorphic Outer Card Container */}
        <div className="p-3.5 md:p-4 rounded-[2.5rem] bg-gradient-to-b from-white via-slate-100 to-emerald-100/70 shadow-[0_25px_80px_-15px_rgba(16,185,129,0.3)] border border-slate-200/90 backdrop-blur-2xl transition-transform duration-500 group-hover:scale-[1.01]">
          
          {/* Mac Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950 text-slate-400 rounded-t-[1.75rem] border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/90 inline-block shadow-xs" />
              <span className="size-3 rounded-full bg-yellow-500/90 inline-block shadow-xs" />
              <span className="size-3 rounded-full bg-green-500/90 inline-block shadow-xs" />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-1 rounded-full border border-slate-800">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-slate-300 font-medium">talent-iq.app // Unified Career Platform</span>
            </div>

            <span className="text-xs text-emerald-400 font-bold tracking-wide">● SAAS v2.5</span>
          </div>

          {/* Clean Glass Image Frame */}
          <div className="relative overflow-hidden rounded-b-[1.75rem] border-t border-slate-800 bg-slate-950">
            <img
              src="/hero.png"
              alt="TalentIQ SaaS Platform Preview"
              className="w-full h-auto object-cover rounded-b-[1.75rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>

      {/* Modern Companies Marquee Banner */}
      <div className="w-full max-w-4xl text-center space-y-4 pt-10 border-t border-slate-200/80">
        <p className="text-slate-400 uppercase tracking-widest text-[11px] font-extrabold">
          Trusted by candidates & tech teams at leading companies
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 py-2">
          {companyNames.map((c, i) => (
            <span key={i} className={`${c.font} hover:text-emerald-600 transition-colors select-none cursor-default`}>
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
