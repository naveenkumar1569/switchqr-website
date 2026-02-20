
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { industries } from '../data/industries';

/* ─── Feature sub-modules for other industry types ─── */

const ABTestModule = ({ feature }) => (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
            {feature.experiment.variants.map((variant, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className={`h-2 w-full absolute top-0 left-0 ${variant.color}`} />
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
                        <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-sm font-bold animate-pulse">{region}</span>
                    ))}
                </div>
                <p className="mt-4 text-sm text-white/80">{feature.map_data.highlight}</p>
            </div>
        </div>
    </div>
);


/* ═══════════════════════════════════════════════════════════════
   IndustryUseCase — Template for all /industries/:slug pages
   ═══════════════════════════════════════════════════════════════ */

const IndustryUseCase = () => {
    const CLIENT_APP_URL = 'https://app.switch-qr.com';
    const { slug } = useParams();
    const industry = industries[slug];

    useEffect(() => { window.scrollTo(0, 0); }, [slug]);

    if (!industry) return <Navigate to="/" replace />;

    const { hero, placementSection, benefits, advanced, feature, lifecycle, setup, testimonial } = industry;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-1">

                {/* ═══════ 1. HERO ═══════ */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3ff] via-[#f5f3ff] to-white -z-10" />
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
                            {/* Left copy */}
                            <div className="flex-1 space-y-6 w-full lg:max-w-[45%]">
                                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                                    {hero.eyebrow}
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-text-main leading-[1.12] tracking-tight">
                                    {hero.title}
                                </h1>
                                <p className="text-base text-text-muted leading-relaxed">
                                    {hero.subtitle}
                                </p>
                                {hero.description && (
                                    <p className="text-base text-text-muted leading-relaxed">
                                        {hero.description}
                                    </p>
                                )}
                                <div className="flex flex-row items-center gap-3 pt-2">
                                    <a href={`${CLIENT_APP_URL}/register`}
                                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all whitespace-nowrap">
                                        {hero.cta || 'Get started free'}
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </a>
                                    <a href={`${CLIENT_APP_URL}/register`}
                                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 text-text-main font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                                        {hero.secondaryCta || 'View demo'}
                                    </a>
                                </div>
                            </div>
                            {/* Right image */}
                            <div className="flex-1 w-full lg:max-w-[55%] flex flex-col gap-6 pt-8 lg:pt-0">
                                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                                    <img
                                        src={hero.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&h=1200&fit=crop'}
                                        alt={industry.name}
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                </div>
                                {hero.highlight && (
                                    <p className="text-sm font-semibold text-text-main text-center px-4">
                                        {hero.highlight}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════ 2. PLACEMENT SECTION ═══════ */}
                {placementSection && (
                    <section className="bg-gray-50/70 border-y border-gray-100">
                        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 lg:py-20">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                    {placementSection.title}
                                </h2>
                                {placementSection.subtitle && (
                                    <p className="mt-3 text-text-muted">{placementSection.subtitle}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {placementSection.items.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                                        <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-text-main leading-tight">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            {placementSection.footer && (
                                <p className="mt-10 text-center text-text-muted text-sm font-medium italic">
                                    {placementSection.footer}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* ═══════ 3. BENEFITS ═══════ */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                        <div className="text-center mb-14 max-w-3xl mx-auto space-y-3">
                            <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                {benefits.title}
                            </h2>
                            {benefits.subtitle && (
                                <p className="text-text-muted leading-relaxed">{benefits.subtitle}</p>
                            )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {benefits.items.map((item, i) => (
                                <div key={i} className="group flex flex-col gap-5 p-8 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-200">
                                    <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-text-main text-lg">{item.title}</h3>
                                        <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ 4. ADVANCED CAPABILITIES ═══════ */}
                {advanced && (
                    <section className="bg-gray-50/70 border-y border-gray-100">
                        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                            <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
                                <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                    {advanced.title}
                                </h2>
                                {advanced.subtitle && (
                                    <p className="text-text-muted">{advanced.subtitle}</p>
                                )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {advanced.items.map((item, i) => {
                                    return (
                                        <div key={i} className="flex flex-col gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/20 transition-colors">
                                            <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xl">star</span>
                                            </div>
                                            <div>
                                                <p className="text-text-main font-bold text-lg mb-1">{item.title}</p>
                                                {item.description && (
                                                    <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {advanced.footer && (
                                <p className="mt-10 text-center text-gray-400 text-sm font-medium italic">
                                    {advanced.footer}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* ═══════ 5. FEATURE / OPTIMIZATION ═══════ */}
                {feature && (
                    <section className="bg-white border-b border-gray-50">
                        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Left: heading */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                            {feature.title}
                                        </h2>
                                        <p className="text-text-muted leading-relaxed">{feature.subtitle}</p>
                                    </div>

                                    {/* Timeline rendering (if embedded in feature) */}
                                    {feature.type === 'timeline' && (
                                        <div className="space-y-0 pt-2">
                                            {feature.items.map((item, i) => (
                                                <div key={i} className="flex gap-5">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${item.active
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                            : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                                        </div>
                                                        {i < feature.items.length - 1 && (
                                                            <div className="w-px flex-1 my-1 bg-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className={`${i < feature.items.length - 1 ? 'pb-8' : ''}`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {item.active && (
                                                                <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-1">Active Now</span>
                                                            )}
                                                        </div>
                                                        <p className="font-bold text-text-main">{item.title}</p>
                                                        <p className="text-sm text-text-muted mt-0.5">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right: interactive demo card or feature module */}
                                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-6">
                                    {feature.type === 'timeline' && feature.demo && (
                                        <>
                                            <div className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-4">
                                                <span>Live Redirect</span>
                                                <span className="flex items-center gap-1.5 text-green-600">
                                                    <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                                                    Active
                                                </span>
                                            </div>
                                            <div className="w-full space-y-3 text-sm">
                                                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100">
                                                    <span className="text-gray-500 font-medium">Phase</span>
                                                    <span className="font-bold text-text-main">{feature.demo.time}</span>
                                                </div>
                                                <div className="flex items-center justify-between px-4 py-3 bg-primary/5 rounded-xl border border-primary/15">
                                                    <span className="text-primary font-medium">Destination</span>
                                                    <span className="font-bold text-primary">{feature.demo.url}</span>
                                                </div>
                                            </div>
                                            <img src={feature.demo.image} alt="QR Code"
                                                className="w-36 h-36 rounded-xl border border-gray-100" />
                                            <p className="text-xs text-gray-400 text-center">Scan to experience adaptive redirects</p>
                                        </>
                                    )}
                                    {feature.type === 'ab_test' && <ABTestModule feature={feature} />}
                                    {feature.type === 'analytics' && <AnalyticsModule feature={feature} />}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══════ 6. LIFECYCLE ═══════ */}
                {lifecycle && (
                    <section className="bg-gray-50/40 border-b border-gray-100">
                        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                            <div className="text-center mb-16 max-w-3xl mx-auto space-y-3">
                                <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">
                                    {lifecycle.title}
                                </h2>
                                {lifecycle.subtitle && (
                                    <p className="text-text-muted leading-relaxed">{lifecycle.subtitle}</p>
                                )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-12 relative">
                                <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-[2px] bg-gray-100" />
                                {lifecycle.items.map((item, i) => (
                                    <div key={i} className="relative flex flex-col items-center text-center gap-6">
                                        <div className="size-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center relative z-10 shadow-sm">
                                            <span className="material-symbols-outlined text-2xl font-bold">{item.icon}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-text-main text-lg uppercase tracking-wider">{item.title}</h3>
                                            <p className="text-text-muted text-sm leading-relaxed max-w-[240px]">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══════ 7. SETUP ═══════ */}
                <section className="bg-white">
                    <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 lg:py-28">
                        <h2 className="text-center text-2xl md:text-3xl font-black text-text-main tracking-tight mb-14">
                            {setup?.title || 'Simple Setup in Minutes'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 relative">
                            {/* Connecting Line background for desktop */}
                            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                            {(setup?.items || setup?.steps || [
                                { title: 'Create your QR code', description: 'Generate a dynamic QR for your use case.' },
                                { title: 'Set redirect rules', description: 'Define destinations and optional scheduling.' },
                                { title: 'Monitor and optimize', description: 'Track scans and update anytime.' }
                            ]).map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-5 relative z-10">
                                    <div className="size-16 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-primary/5 text-primary font-black text-2xl flex items-center justify-center group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 rounded-2xl scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                                        <span className="relative z-10">{i + 1}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-text-main text-lg">{step.title}</h4>
                                        <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ 8. TESTIMONIAL ═══════ */}
                <section className="bg-[#faf9ff] border-y border-gray-100">
                    <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 lg:py-24 text-center">
                        <span className="material-symbols-outlined text-primary/15 text-6xl mb-4">format_quote</span>
                        <blockquote className="text-xl md:text-2xl font-bold text-text-main leading-snug">
                            "{testimonial.quote}"
                        </blockquote>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <img
                                src={testimonial.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces'}
                                alt={testimonial.author}
                                className="size-10 rounded-full object-cover ring-2 ring-primary/10"
                            />
                            <div className="text-left">
                                <p className="text-text-main font-bold text-sm">{testimonial.author}</p>
                                <p className="text-text-muted text-xs">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════ 9. FINAL CTA ═══════ */}
                <section className="bg-primary relative overflow-hidden">
                    <div className="absolute -top-32 -left-32 size-80 bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-32 -right-32 size-80 bg-white/10 rounded-full blur-[100px]" />
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 lg:py-24 text-center relative z-10 flex flex-col items-center gap-8">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                            Trusted by Teams Worldwide
                        </h2>
                        <p className="text-white/70 max-w-lg">
                            Start creating dynamic QR codes today and track every scan in real-time.
                        </p>
                        <a href={`${CLIENT_APP_URL}/register`}
                            className="px-10 py-4 rounded-xl bg-white text-primary font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl">
                            Create your first dynamic QR
                        </a>
                        <p className="text-white/50 text-xs">No credit card required.</p>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default IndustryUseCase;
