import React from 'react';
import { Sparkles, LayoutGrid, ShieldCheck, WandSparkles } from 'lucide-react';

const Features = () => {
    const featureCards = [
        {
            title: 'Smart resume blocks',
            description: 'Mix experience, skills and achievements into clean sections that stay readable on every screen and every template.',
            icon: LayoutGrid,
            iconTone: 'bg-emerald-600',
            cardTone: 'md:w-[60%] md:h-60 bg-slate-950 text-white rounded-3xl border border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 p-5 flex flex-col md:flex-row gap-5',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
            alt: 'Resume builder workspace',
            textTone: 'text-slate-200',
        },
        {
            title: 'Polished by default',
            description: 'Balanced spacing, modern typography and subtle contrast give every resume a premium feel without extra design work.',
            icon: ShieldCheck,
            iconTone: 'bg-teal-600',
            cardTone: 'md:w-[40%] bg-white rounded-3xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-6 md:pt-7',
            textTone: 'text-slate-600',
        },
        {
            title: 'Guided content writing',
            description: 'Write stronger summaries, sharpen bullet points and keep the voice consistent with AI prompts tailored for job seekers.',
            icon: WandSparkles,
            iconTone: 'bg-emerald-700',
            cardTone: 'md:w-[40%] bg-white rounded-3xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-6 md:pt-7',
            textTone: 'text-slate-600',
        },
        {
            title: 'Fast preview and export',
            description: 'See updates instantly, switch templates quickly and export with confidence when the layout is ready to send.',
            icon: Sparkles,
            iconTone: 'bg-slate-900',
            cardTone: 'md:w-[60%] md:h-60 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_45%,#d1fae5_100%)] rounded-3xl border border-emerald-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 p-5 flex flex-col md:flex-row gap-5',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
            alt: 'Modern resume preview',
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
                    <span className="text-xs tracking-[0.24em] uppercase text-emerald-700 bg-white/80 border border-emerald-200 rounded-full px-6 py-2">Features</span>
                    <h2 className="text-4xl md:text-[42px] font-semibold text-slate-950 mt-6">Everything you need to build a standout resume</h2>
                    <p className="text-base text-slate-600 max-w-2xl mx-auto mt-3">A clean workflow for writing, styling and previewing a resume that feels modern, focused and ready for hiring teams.</p>
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
