import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            quote: 'I went from a plain draft to a resume that felt ready for interviews in minutes. The layout is clean and the guidance is easy to follow.',
            name: 'Ava Patel',
            role: 'Software engineer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop',
        },
        {
            quote: 'The builder keeps everything organized. I could rewrite my summary, swap a template and preview the result without getting lost.',
            name: 'Marcus Lee',
            role: 'Product designer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=240&auto=format&fit=crop',
        },
        {
            quote: 'It feels modern without being flashy. That balance matters when you want a resume to look sharp and still stay professional.',
            name: 'Nora Ahmed',
            role: 'Marketing manager',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=240&auto=format&fit=crop',
        },
        {
            quote: 'I liked how quickly I could move from content to final version. The sections are simple, but the output feels premium.',
            name: 'Daniel Wong',
            role: 'Frontend developer',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=240&auto=format&fit=crop',
        },
        {
            quote: 'The AI prompts helped me turn weak bullet points into stronger results-focused lines. That saved me a lot of time.',
            name: 'Sofia Martinez',
            role: 'UX designer',
            image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=240&auto=format&fit=crop',
        },
        {
            quote: 'Everything feels aligned with the rest of the site. The section is polished, but still lightweight and easy to use.',
            name: 'Noah Kim',
            role: 'Startup founder',
            image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=240&auto=format&fit=crop',
        },
    ];

    const rows = [testimonials.slice(0, 3), testimonials.slice(3, 6)];

    const renderStars = () => (
        <div className="flex gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M11.48 3.499a.57.57 0 0 1 1.04 0l2.2 4.77 5.22.66c.45.06.63.61.31.93l-3.78 3.69.92 5.19c.08.46-.4.82-.8.59l-4.66-2.46-4.66 2.46c-.4.23-.88-.13-.8-.59l.92-5.19-3.78-3.69c-.32-.32-.14-.87.31-.93l5.22-.66z" />
                </svg>
            ))}
        </div>
    );

    return (
        <>
            <style>
                {`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes scrollReverse {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .animate-scroll { animation: scroll 20s linear infinite; }
                    .animate-scroll-reverse { animation: scrollReverse 20s linear infinite; }
                `}
            </style>
            <section id="testimonials" className="relative overflow-hidden py-20 px-4 bg-[radial-gradient(circle_at_top,#ecfdf5_0%,#f8fafc_45%,#e2e8f0_100%)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                <div className="absolute -top-24 left-1/4 size-72 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-teal-200/40 blur-3xl" />

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 mb-3">
                            <span className="text-xs tracking-[0.24em] uppercase text-emerald-700 font-bold">Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-semibold text-slate-950 mb-4">
                            What resume builders are saying
                        </h2>
                        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                            Short feedback from people using the resume builder to write faster, design better and ship a stronger final version.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="relative overflow-hidden rounded-3xl">
                                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

                                <div className={`flex gap-6 ${rowIndex === 0 ? 'animate-scroll' : 'animate-scroll-reverse'}`}>
                                    {[...row, ...row].map((testimonial, index) => (
                                        <article
                                            key={`${testimonial.name}-${index}`}
                                            className="shrink-0 w-[320px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {renderStars()}
                                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                                {testimonial.quote}
                                            </p>
                                            <div className="mt-6 flex items-center gap-3">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="size-11 rounded-2xl object-cover ring-2 ring-emerald-100"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-950">{testimonial.name}</p>
                                                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Testimonials;
