import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

const CallToAction = () => {
    return (
        <section className="bg-slate-50 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl">
                    {/* Decorative Blurs */}
                    <div className="absolute -top-24 -left-24 size-80 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-teal-500/20 blur-3xl" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                            Accelerated Career Growth
                        </span>
                        
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Build a professional resume & master technical interviews
                        </h2>
                        
                        <p className="text-slate-300 text-base leading-relaxed">
                            Join over 100,000 candidates using our unified platform to polish their resumes and ace technical coding screens.
                        </p>

                        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                            <SignInButton mode="modal">
                                <button className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-105 transition-all cursor-pointer">
                                    Get Started Free →
                                </button>
                            </SignInButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
