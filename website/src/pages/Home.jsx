import React from 'react';
import { Link } from 'react-router-dom';
import { industries } from '../data/industries';

const Home = () => {
    const problems = [
        {
            icon: 'print',
            title: 'Expensive Reprinting',
            description: 'A single typo or link change means reprinting thousands of flyers, packaging, or cards.',
        },
        {
            icon: 'lock',
            title: 'Locked Links',
            description: "Static QRs are tied to one URL forever. You can't update campaigns seasonally.",
        },
        {
            icon: 'bar_chart',
            title: 'Zero Analytics',
            description: 'Blind marketing. You never know who scanned, where they were, or what device they used.',
        },
        {
            icon: 'schedule',
            title: 'Slow Updates',
            description: 'Launching a new landing page? You have to wait for new printed materials to arrive.',
        },
    ];

    const solutions = [
        {
            icon: 'alt_route',
            title: 'Dynamic Redirects',
            description: 'Change the destination URL instantly from your dashboard. Point to your website today and your Instagram tomorrow.',
        },
        {
            icon: 'monitoring',
            title: 'Real-time Analytics',
            description: 'Visualize your success. Track total scans, unique visitors, city-level location data, and device types instantly.',
        },
        {
            icon: 'tune',
            title: 'Smart Optimization',
            description: 'Run A/B tests by splitting traffic between two destinations. Schedule changes to happen automatically at specific times.',
        },
    ];

    const useCases = Object.values(industries);

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                        <div className="flex-1 text-center lg:text-left space-y-8 z-10">
                            <h1 className="text-text-main text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                                Change QR destinations <span className="text-primary">anytime.</span>
                            </h1>
                            <p className="text-text-main/80 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Stop reprinting marketing materials. Manage all your QR campaigns, track scans, and redirect users instantly from one dynamic dashboard.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <button className="flex items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white text-base font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5">
                                    Get Started Free
                                </button>
                                <button className="flex items-center justify-center rounded-xl h-12 px-8 bg-white border border-[#dad1e5] hover:border-primary/50 text-text-main text-base font-bold transition-all">
                                    <span className="mr-2 material-symbols-outlined text-[20px]">play_circle</span>
                                    See How It Works
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="relative w-full aspect-[4/3] max-w-[640px] mx-auto lg:ml-auto">
                                <div className="absolute inset-0 bg-white rounded-2xl shadow-mockup border border-[#f0ebf7] overflow-hidden flex flex-col">
                                    <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white">
                                        <div className="flex gap-2">
                                            <div className="size-3 rounded-full bg-red-400/20 border border-red-400/30"></div>
                                            <div className="size-3 rounded-full bg-amber-400/20 border border-amber-400/30"></div>
                                            <div className="size-3 rounded-full bg-green-400/20 border border-green-400/30"></div>
                                        </div>
                                        <div className="w-24 h-2 bg-gray-100 rounded-full"></div>
                                    </div>
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h4 className="text-sm font-bold text-text-main">Campaign Analytics</h4>
                                                <p className="text-[11px] text-text-secondary">Scan activity over the last 30 days</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="size-2 rounded-full bg-primary"></div>
                                                <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between h-32 gap-3 px-2">
                                            <div className="flex-1 mockup-gradient-bar opacity-20 rounded-t-md h-[40%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-40 rounded-t-md h-[70%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-30 rounded-t-md h-[55%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-60 rounded-t-md h-[85%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-50 rounded-t-md h-[65%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-80 rounded-t-md h-[95%]"></div>
                                            <div className="flex-1 mockup-gradient-bar rounded-t-md h-[100%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-70 rounded-t-md h-[80%]"></div>
                                        </div>
                                        <div className="mt-4 flex justify-between px-2">
                                            <div className="w-6 h-1 bg-gray-100 rounded-full"></div>
                                            <div className="w-6 h-1 bg-gray-100 rounded-full"></div>
                                            <div className="w-6 h-1 bg-gray-100 rounded-full"></div>
                                            <div className="w-6 h-1 bg-gray-100 rounded-full"></div>
                                            <div className="w-6 h-1 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 bg-white rounded-xl shadow-xl border border-[#f0ebf7] p-5 transition-transform hover:-translate-y-16 duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Preview</span>
                                        <span className="material-symbols-outlined text-primary text-sm">qr_code_2</span>
                                    </div>
                                    <div className="aspect-square bg-[#f8f6fb] rounded-lg mb-4 flex items-center justify-center p-4">
                                        <div className="w-full h-full border-2 border-dashed border-primary/20 rounded flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary/40 text-4xl">qr_code_2</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                                        <div className="w-2/3 h-2 bg-gray-50 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="absolute -right-4 bottom-12 w-56 bg-white rounded-xl shadow-xl border border-[#f0ebf7] p-5 transition-transform hover:translate-x-4 duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-lg">campaign</span>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-text-main">Summer Sale</div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full bg-green-500"></span>
                                                <span className="text-[9px] font-medium text-green-600 uppercase tracking-tight">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-text-secondary">Total Scans</span>
                                            <span className="text-[11px] font-bold text-text-main">1,284</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-primary rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-[10px] text-text-secondary">CTR</span>
                                            <span className="text-[11px] font-bold text-green-600">+12.4%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
                            The Challenge
                        </span>
                        <h2 className="text-text-main text-3xl md:text-4xl font-bold mb-4">The Problem with Static QRs</h2>
                        <p className="text-text-muted text-lg">
                            Traditional QR codes are permanent. Once printed, you can't change where they point, leading to wasted budget and missed opportunities.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {problems.map((problem, index) => (
                            <div
                                key={index}
                                className="flex flex-col p-6 rounded-xl border border-gray-100 bg-background-light hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="size-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 mb-4">
                                    <span className="material-symbols-outlined">{problem.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-text-main mb-2">{problem.title}</h3>
                                <p className="text-sm text-text-muted">{problem.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                            The Solution
                        </span>
                        <h2 className="text-text-main text-3xl md:text-4xl font-bold mb-4">Complete Control Over Your Campaigns</h2>
                        <p className="text-text-muted text-lg">
                            SwitchQR gives you the power to adapt in real-time. Never reprint a QR code again.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutions.map((solution, index) => (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20"
                            >
                                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-4xl">{solution.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-3">{solution.title}</h3>
                                <p className="text-text-muted leading-relaxed">{solution.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 bg-white border-t border-gray-100 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-text-main text-3xl font-bold mb-2">Built for every industry</h2>
                            <p className="text-text-muted">See how different businesses use SwitchQR.</p>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {useCases.map((useCase, index) => (
                            <Link
                                to={`/industries/${useCase.slug}`}
                                key={index}
                                className="snap-start shrink-0 w-[85vw] sm:w-[360px] flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div
                                    className="h-48 w-full relative overflow-hidden flex items-center justify-center"
                                    style={{ background: useCase.gradient }}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                    <span className="material-symbols-outlined text-white/20 text-[120px] absolute -right-4 -bottom-8 rotate-12 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                                        {useCase.icon}
                                    </span>
                                    <div className="relative z-10 size-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-4xl drop-shadow-md">{useCase.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3 text-primary font-bold text-xs uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">{useCase.icon}</span>
                                        {useCase.name}
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">{useCase.hero.title}</h3>
                                    <p className="text-sm text-text-muted">{useCase.hero.subtitle.substring(0, 80)}...</p>
                                    <div className="mt-4 flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                        Explore Use Case <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl bg-primary text-white p-12 md:p-16 text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h2 className="relative text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Ready to take control of your QR codes?
                        </h2>
                        <p className="relative text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Join 10,000+ marketers using SwitchQR to run smarter, measurable campaigns.
                        </p>
                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white text-primary text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                                Start Free
                            </button>
                        </div>
                        <p className="relative text-sm text-white/60 mt-6">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
