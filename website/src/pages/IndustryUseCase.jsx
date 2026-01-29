
import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { industries } from '../data/industries';

const TimelineModule = ({ feature }) => (
    <div className="flex flex-col gap-4">
        {feature.items.map((item, index) => (
            <div key={index} className="grid grid-cols-[48px_1fr] gap-x-4">
                <div className="flex flex-col items-center gap-1">
                    <div className={`p-2 rounded-full ${item.active ? 'bg-primary text-white ring-4 ring-primary/10' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    {index !== feature.items.length - 1 && (
                        <div className="w-[2px] bg-primary/20 h-16"></div>
                    )}
                </div>
                <div className="flex flex-col py-2">
                    <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${item.active ? 'text-primary' : 'text-text-main'}`}>
                            {item.title}
                        </p>
                        {item.active && (
                            <span className="bg-primary/10 text-primary text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Active Now</span>
                        )}
                    </div>
                    <p className="text-text-muted text-base">
                        <span className="font-mono text-xs font-bold mr-2 uppercase tracking-wide opacity-70">{item.time}</span>
                        {item.description}
                    </p>
                </div>
            </div>
        ))}
    </div>
);

const ABTestModule = ({ feature }) => (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
            {feature.experiment.variants.map((variant, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className={`h-2 w-full absolute top-0 left-0 ${variant.color}`}></div>
                    <div className="text-xs font-bold uppercase text-gray-400 mb-1">{variant.name}</div>
                    <div className="text-lg font-bold text-text-main mb-2">{variant.label}</div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-text-main">{variant.value}</span>
                        <span className="text-xs font-medium text-gray-500 mb-1">Conv.</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">trending_up</span>
            <div>
                <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Winner Found</p>
                <p className="text-green-700 font-medium">Variant B showed <strong>{feature.experiment.lift}</strong> better conversion.</p>
            </div>
        </div>
    </div>
);

const AnalyticsModule = ({ feature }) => (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
            {feature.stats.map((stat, index) => (
                <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary/60 text-xl mb-1">{stat.icon}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">{stat.label}</span>
                    <span className="text-lg font-black text-text-main">{stat.value}</span>
                </div>
            ))}
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl text-white relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white/5">public</span>
            <div className="relative z-10">
                <p className="text-xs font-bold text-white/60 uppercase mb-2">Real-Time Activity</p>
                <div className="flex gap-2">
                    {feature.map_data.active_regions.map((region, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-sm font-bold animate-pulse">
                            {region}
                        </span>
                    ))}
                </div>
                <p className="mt-4 text-sm text-white/80">{feature.map_data.highlight}</p>
            </div>
        </div>
    </div>
);

const IndustryUseCase = () => {
    const { slug } = useParams();
    const industry = industries[slug];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!industry) {
        return <Navigate to="/" replace />;
    }

    const { hero, benefits, feature, testimonial } = industry;

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <div className="px-6 md:px-20 lg:px-40 py-12 md:py-20">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col gap-10 lg:flex-row items-center">
                            <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8 justify-center">
                                <div className="flex flex-col gap-4">
                                    <span className="text-primary font-bold tracking-widest text-xs uppercase">{hero.eyebrow}</span>
                                    <h1 className="text-text-main text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                        {hero.title}
                                    </h1>
                                    <p className="text-text-muted text-lg md:text-xl font-normal leading-relaxed">
                                        {hero.subtitle}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        Create your first QR
                                    </button>
                                    <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 border-2 border-gray-200 text-text-main text-lg font-bold hover:bg-gray-50 transition-colors">
                                        View Demo
                                    </button>
                                </div>

                                {/* Placement Tags */}
                                {industry.placement && (
                                    <div className="flex flex-col gap-3 pt-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Where to place QRs:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {industry.placement.map((place, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                                    {place}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={hero.image}
                                        alt={industry.name + " Use Case"}
                                        className="aspect-[4/3] w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Benefits Section */}
                <div className="bg-white py-20 px-6 md:px-20 lg:px-40 border-y border-gray-100">
                    <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
                        <div className="flex flex-col gap-4 text-center items-center">
                            <h2 className="text-text-main text-3xl md:text-4xl font-black tracking-tight max-w-[800px]">
                                {benefits.title}
                            </h2>
                            <p className="text-text-muted text-lg max-w-[700px]">
                                {benefits.subtitle}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {benefits.items.map((item, index) => (
                                <div key={index} className="group flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-8 hover:border-primary/50 transition-colors">
                                    <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-text-main text-xl font-bold">{item.title}</h3>
                                        <p className="text-text-muted text-base leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Advanced Features */}
                        {industry.advanced && (
                            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                                <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">verified</span>
                                    Pro Features
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {industry.advanced.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                                            <span className="text-text-main font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature Integration Section */}
                <div className="py-24 px-6 md:px-20 lg:px-40 bg-gray-50">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="flex flex-col gap-8">
                                <h2 className="text-text-main text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                    {feature.title}
                                </h2>
                                <p className="text-text-muted text-lg">
                                    {feature.subtitle}
                                </p>

                                {/* Dynamic Content based on Feature Type */}
                                {feature.type === 'timeline' && <TimelineModule feature={feature} />}
                                {feature.type === 'ab_test' && <div className="hidden lg:block"><ABTestModule feature={feature} /></div>}
                                {feature.type === 'analytics' && <div className="hidden lg:block"><AnalyticsModule feature={feature} /></div>}

                                {/* Mobile Fallback for non-timeline modules to ensure content visibility */}
                                {feature.type !== 'timeline' && <div className="lg:hidden block"><TimelineModule feature={{
                                    items: [
                                        { title: 'Step 1: Setup', description: 'Configure your campaign', icon: 'settings', time: 'Day 1' },
                                        { title: 'Step 2: Launch', description: 'Distribute your QRs', icon: 'rocket_launch', time: 'Day 2', active: true },
                                        { title: 'Step 3: Track', description: 'Monitor results in real-time', icon: 'analytics', time: 'Always On' }
                                    ]
                                }} /></div>}

                            </div>

                            {/* Feature Visual/Mockup */}
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                        <h4 className="font-bold text-lg text-text-main">
                                            {feature.type === 'timeline' ? 'Smart Redirect Rules' :
                                                feature.type === 'ab_test' ? 'Optimization Engine' : 'Live Dashboard'}
                                        </h4>
                                        <span className="material-symbols-outlined text-primary">settings</span>
                                    </div>

                                    {/* Render the module here too for the "mockup" feel, or a simplified version */}
                                    <div className="space-y-4">
                                        {feature.type === 'timeline' ? (
                                            <>
                                                <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-gray-400">schedule</span>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-500 uppercase">Current Time</p>
                                                            <p className="font-medium text-text-main">{feature.demo.time}</p>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined text-gray-300">arrow_forward_ios</span>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border-l-4 border-primary shadow-sm bg-primary/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">link</span>
                                                        <div>
                                                            <p className="text-xs font-bold text-primary uppercase">Redirecting To</p>
                                                            <p className="font-medium text-text-main">{feature.demo.url}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : feature.type === 'ab_test' ? (
                                            <ABTestModule feature={feature} />
                                        ) : (
                                            <AnalyticsModule feature={feature} />
                                        )}
                                    </div>

                                    {feature.type === 'timeline' && (
                                        <div className="pt-4 flex flex-col items-center">
                                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                                                <img
                                                    src={feature.demo.image}
                                                    alt="Demo QR Code"
                                                    className="w-40 h-40"
                                                />
                                            </div>
                                            <p className="text-center mt-4 text-sm text-text-muted italic">"Scan to see magic in action"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How to Use Guide */}
                <div className="py-24 px-6 md:px-20 lg:px-40 bg-white">
                    <div className="max-w-[1000px] mx-auto">
                        <h2 className="text-text-main text-3xl md:text-4xl font-black tracking-tight text-center mb-16">Simple 3-Step Setup</h2>
                        <div className="grid md:grid-cols-3 gap-12 relative">
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gray-100 -z-10"></div>
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/30 z-10">1</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-text-main">Create One QR</h4>
                                    <p className="text-text-muted">Generate a single dynamic QR code for your specific use case.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/30 z-10">2</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-text-main">Set Your Rules</h4>
                                    <p className="text-text-muted">Choose when and where your QR code should redirect.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/30 z-10">3</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-text-main">Track & Optimize</h4>
                                    <p className="text-text-muted">Monitor scans in real-time and update rules instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Section */}
                <div className="py-24 px-6 md:px-20 lg:px-40 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-[960px] mx-auto">
                        <div className="bg-white rounded-[2.5rem] p-12 lg:p-16 border border-gray-100 shadow-xl relative overflow-hidden">
                            <span className="material-symbols-outlined absolute top-10 left-10 text-9xl text-primary/5 pointer-events-none">format_quote</span>
                            <div className="relative z-10 flex flex-col items-center text-center gap-10">
                                <h3 className="text-2xl lg:text-3xl font-bold leading-relaxed italic text-text-main">
                                    "{testimonial.quote}"
                                </h3>
                                <div className="flex flex-col items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="size-16 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                    <div>
                                        <p className="font-black text-text-main text-lg">{testimonial.author}</p>
                                        <p className="text-primary font-medium">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="py-24 px-6 md:px-20 lg:px-40 bg-primary text-white">
                    <div className="max-w-[1280px] mx-auto text-center flex flex-col items-center gap-8">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">Ready to upgrade your workflow?</h2>
                        <p className="text-white/80 text-lg md:text-xl max-w-[600px]">
                            Join hundreds of businesses like yours that have switched to dynamic, intelligent QR codes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                            <button className="bg-white text-primary px-10 py-5 rounded-xl font-black text-xl hover:scale-105 transition-transform shadow-2xl cursor-pointer">
                                Create your first dynamic QR
                            </button>
                        </div>
                        <p className="text-white/60 text-sm">No credit card required for basic setup.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IndustryUseCase;
