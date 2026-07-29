import React from 'react';
import { Sparkles, LayoutGrid, ShieldCheck, WandSparkles, CheckCircle2, Code2 } from 'lucide-react';

const Features = () => {
    const featureCards = [
        {
            title: 'AI Resume Builder',
            description: 'Mix experience, skills and achievements into clean sections with real-time A4 PDF preview and AI bullet enhancement.',
            icon: LayoutGrid,
            iconTone: 'bg-emerald-600',
            cardTone: 'md:w-[60%] md:h-60 bg-slate-950 text-white rounded-3xl border border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 p-5 flex flex-col md:flex-row gap-5',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
            alt: 'Resume builder workspace',
            textTone: 'text-slate-200',
        },
        {
            title: 'ATS Resume Analyzer',
            description: 'Puter AI engine evaluates keyword coverage, formatting compliance, and job description match scores in real-time.',
            icon: ShieldCheck,
            iconTone: 'bg-teal-600',
            cardTone: 'md:w-[40%] bg-white rounded-3xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-6 md:pt-7',
            textTone: 'text-slate-600',
        },
        {
            title: 'Puter.js Cloud Sync',
            description: 'Individual ATS reports, score history, and PDF images persist securely in Puter KV and Cloud Storage.',
            icon: WandSparkles,
            iconTone: 'bg-emerald-700',
            cardTone: 'md:w-[40%] bg-white rounded-3xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-6 md:pt-7',
            textTone: 'text-slate-600',
        },
        {
            title: 'Remote Interview Platform',
            description: 'Monaco code editor, Stream HD video calling, live Piston execution, and host rubrics in one collaborative workspace.',
            icon: Code2,
            iconTone: 'bg-slate-900',
            cardTone: 'md:w-[60%] md:h-60 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_45%,#d1fae5_100%)] rounded-3xl border border-emerald-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 p-5 flex flex-col md:flex-row gap-5',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
            alt: 'Modern pair programming workspace',
            textTone: 'text-slate-600',
        },
    ];

    const SmartBlocksIcon = featureCards[0].icon;
    const PolishedIcon = featureCards[1].icon;
    const GuidedWritingIcon = featureCards[2].icon;
    const ExportIcon = featureCards[3].icon;

    return (
        <section id="features" className="bg-[radial-gradient(circle_at_top,#ecfdf5_0%,#f8fafc_45%,#e2e8f0_100%)] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-9">
                    <span className="text-xs tracking-[0.24em] uppercase text-emerald-700 bg-white/80 border border-emerald-200 rounded-full px-6 py-2">Flowix Platform</span>
                    <h2 className="text-4xl md:text-[42px] font-semibold text-slate-950 mt-6">3 Powerful SaaS Pillars in One Unified Platform</h2>
                    <p className="text-base text-slate-600 max-w-2xl mx-auto mt-3">From building ATS-optimized resumes and analyzing job match scores to conducting live remote technical pair programming interviews.</p>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Row 1 */}
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className={featureCards[0].cardTone}>
                            <img src={featureCards[0].image} alt={featureCards[0].alt} className="w-full h-48 md:h-full md:w-[45%] object-cover rounded-2xl" />
                            <div className="flex flex-col mt-2">
                                <div className={`size-11 ${featureCards[0].iconTone} rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg shadow-emerald-950/20`}>
                                    <SmartBlocksIcon size={22} />
                                </div>
                                <h3 className="text-sm font-semibold text-white">{featureCards[0].title}</h3>
                                <p className={`text-sm/6 mt-2.5 ${featureCards[0].textTone}`}>{featureCards[0].description}</p>
                            </div>
                        </div>

                        <div className={featureCards[1].cardTone}>
                            <div className={`size-11 ${featureCards[1].iconTone} rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg shadow-teal-950/15`}>
                                <PolishedIcon size={22} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-950">{featureCards[1].title}</h3>
                            <p className={`text-sm mt-2.5 ${featureCards[1].textTone}`}>{featureCards[1].description}</p>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className={featureCards[2].cardTone}>
                            <div className={`size-11 ${featureCards[2].iconTone} rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg shadow-emerald-950/10`}>
                                <GuidedWritingIcon size={22} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-950">{featureCards[2].title}</h3>
                            <p className={`text-sm mt-2.5 ${featureCards[2].textTone}`}>{featureCards[2].description}</p>
                        </div>

                        <div className={featureCards[3].cardTone}>
                            <img src={featureCards[3].image} alt={featureCards[3].alt} className="w-full h-48 md:h-full md:w-[45%] object-cover rounded-2xl" />
                            <div className="flex flex-col mt-2">
                                <div className={`size-11 ${featureCards[3].iconTone} rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg shadow-slate-900/20`}>
                                    <ExportIcon size={22} />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">{featureCards[3].title}</h3>
                                <p className={`text-sm/6 mt-2.5 ${featureCards[3].textTone}`}>{featureCards[3].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
