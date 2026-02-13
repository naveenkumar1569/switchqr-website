import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 overflow-x-hidden">
                {/* Hero Section */}
                <section className="px-4 md:px-40 flex justify-center py-5">
                    <div className="flex flex-col max-w-[960px] flex-1">
                        <div className="@container">
                            <div className="flex flex-col gap-6 px-4 py-10 md:py-20 lg:flex-row items-center">
                                <div className="flex flex-col gap-6 text-center lg:text-left lg:justify-center flex-1">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-text-main text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl font-display">
                                            Join the <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:top-1/2 after:w-full after:h-1 after:bg-red-500 after:-rotate-3 after:-translate-y-1/2">Team</span> <span className="text-primary italic">AI</span>
                                        </h1>
                                        <h2 className="text-text-muted text-lg font-normal leading-normal max-w-2xl mx-auto lg:mx-0">
                                            Building the future of marketing, one prompt at a time.
                                        </h2>
                                    </div>
                                    <div className="flex justify-center lg:justify-start">
                                        <button className="flex min-w-[160px] cursor-not-allowed items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] opacity-50">
                                            <span className="truncate">View Roles (Closed)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* AI Graphic */}
                                <div className="w-full lg:w-1/2 aspect-square relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl"></div>
                                    <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center border border-primary/10 overflow-hidden" style={{ boxShadow: '0 0 40px -10px rgba(107, 38, 217, 0.3)' }}>
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-16 -translate-y-16"></div>
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 rounded-full translate-x-20 translate-y-20"></div>

                                        <div className="flex flex-col items-center gap-4 relative z-10">
                                            <div className="absolute bottom-0 w-64 h-2 bg-gray-100 rounded-full translate-y-12"></div>

                                            {/* Code/Chat Interface Card */}
                                            <div className="w-32 h-44 bg-gray-50 rounded-xl border-2 border-primary/20 shadow-lg flex flex-col p-3 gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                                                    <div className="size-2 rounded-full bg-emerald-400"></div>
                                                    <div className="size-2 rounded-full bg-amber-400"></div>
                                                </div>
                                                <div className="flex-1 bg-gray-900 rounded-lg p-2 flex flex-col gap-1 overflow-hidden">
                                                    <div className="w-full h-1 bg-emerald-500/40 rounded"></div>
                                                    <div className="w-3/4 h-1 bg-emerald-500/20 rounded"></div>
                                                    <div className="mt-2 flex justify-center gap-4">
                                                        <div className="size-1.5 rounded-full bg-emerald-400"></div>
                                                        <div className="size-1.5 rounded-full bg-emerald-400"></div>
                                                    </div>
                                                    <div className="mt-auto w-full text-[6px] font-mono text-emerald-500/50 truncate">PROMPT_ENGINEERING_V4...</div>
                                                </div>
                                                <div className="h-6 w-full bg-white rounded flex items-center px-1.5 gap-1 shadow-sm border border-gray-200">
                                                    <div className="size-3 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[8px] text-primary">smart_toy</span>
                                                    </div>
                                                    <span className="text-[8px] font-bold text-gray-600">"CHIP" - CEO</span>
                                                </div>
                                            </div>

                                            {/* Floating Icons */}
                                            <div className="flex items-end gap-12 -mt-4">
                                                <div className="relative group">
                                                    <div className="w-6 h-6 bg-primary/10 border border-primary/20 rounded-md relative">
                                                        <div className="absolute -right-1 top-1 w-2 h-3 border-2 border-primary/20 rounded-r-full"></div>
                                                        <div className="w-full h-1/2 bg-[#3c2a1a] rounded-t-sm absolute bottom-0 opacity-40"></div>
                                                    </div>
                                                    <span className="material-symbols-outlined absolute -top-4 left-1 text-primary/40 text-xs">air</span>
                                                </div>
                                                <div className="w-5 h-5 bg-gray-200 rounded-sm relative">
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-emerald-500">
                                                        <span className="material-symbols-outlined text-sm">potted_plant</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute top-6 right-6">
                                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold border border-primary/20">STATUS: PRODUCTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Archived Openings Title */}
                <section className="px-4 md:px-40 flex justify-center">
                    <div className="flex flex-col max-w-[960px] flex-1">
                        <div className="flex items-center justify-between border-l-4 border-primary px-4 py-2 mb-4 bg-primary/5">
                            <h2 className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">Archived Openings</h2>
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">Closed</span>
                        </div>
                    </div>
                </section>

                {/* Job List */}
                <section className="px-4 md:px-40 flex justify-center pb-10">
                    <div className="flex flex-col max-w-[960px] flex-1 gap-1">
                        {[
                            { title: 'Senior Prompt Whisperer', desc: 'Expertise in speaking fluent LLM required.', icon: 'psychology_alt' },
                            { title: 'AI Babysitter', desc: 'Monitoring synthetic personalities 24/7.', icon: 'smart_toy' },
                            { title: 'Human Logic Guard', desc: 'Someone who can stop the AI from refactoring everything every 10 minutes.', icon: 'engineering' }
                        ].map((job, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white px-6 min-h-[88px] py-4 justify-between rounded-lg opacity-60 border border-transparent hover:border-primary/20 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-14">
                                        <span className="material-symbols-outlined text-3xl">{job.icon}</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-text-main text-lg font-bold leading-normal line-clamp-1 font-display">{job.title}</p>
                                        <p className="text-text-muted text-sm font-normal leading-normal line-clamp-2 italic">{job.desc}</p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <div className="flex size-7 items-center justify-center grayscale">
                                        <div className="size-3 rounded-full bg-red-500"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* All Filled Joke */}
                <section className="px-4 md:px-40 flex justify-center py-20 bg-primary/5">
                    <div className="flex flex-col max-w-[960px] flex-1 items-center text-center">
                        <div className="bg-white p-10 md:p-20 rounded-3xl shadow-xl border border-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="material-symbols-outlined text-primary/10 text-[100px] -mr-10 -mt-10">lock</span>
                            </div>
                            <span className="inline-block px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold uppercase tracking-[0.2em] mb-8 font-display">All Positions Filled</span>
                            <p className="text-2xl md:text-3xl text-text-main font-bold mb-6 leading-tight max-w-xl mx-auto font-display">
                                "Sadly, all positions already filled by… the AI."
                            </p>
                            <p className="text-text-muted text-lg italic max-w-md mx-auto">
                                (They don't take coffee breaks, but they do have opinions. Strong ones.)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Message */}
                <section className="px-4 md:px-40 flex justify-center py-20">
                    <div className="flex flex-col max-w-[960px] flex-1 items-center text-center gap-8">
                        <div className="flex flex-col gap-4">
                            <p className="text-text-main text-base font-medium">Actually looking for a human job?</p>
                            <p className="text-text-muted text-sm">Check back in <span className="font-bold text-primary">2030</span>. We might need someone to pull the plug by then.</p>
                        </div>
                        <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline group">
                            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Return to Reality (Homepage)
                        </Link>
                    </div>
                </section>

                <footer className="px-4 md:px-40 flex justify-center py-10 border-t border-gray-100">
                    <div className="flex flex-col max-w-[960px] flex-1 text-center">
                        <p className="text-text-muted text-xs">© 2026 SwitchQR. Operated by 100% locally-sourced synthetic intelligence.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Careers;
