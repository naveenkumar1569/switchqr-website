import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { stories } from '../data/stories';

const RichText = ({ content }) => {
    if (!content) return null;

    // Split by double newline to identify paragraphs
    const paragraphs = content.split('\n\n');

    return (
        <div className="space-y-4">
            {paragraphs.map((paragraph, index) => {
                // Check if paragraph contains bullet points
                if (paragraph.includes('\n• ')) {
                    const lines = paragraph.split('\n');
                    const intro = lines[0].startsWith('•') ? null : lines[0];
                    const bullets = lines.filter(line => line.trim().startsWith('•'));

                    return (
                        <div key={index}>
                            {intro && <p className="mb-2">{renderBold(intro)}</p>}
                            <ul className="list-disc pl-5 space-y-2">
                                {bullets.map((bullet, i) => (
                                    <li key={i} className="pl-1">
                                        {renderBold(bullet.replace('•', '').trim())}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                return <p key={index}>{renderBold(paragraph)}</p>;
            })}
        </div>
    );
};

const renderBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const CaseStudy = () => {
    const CLIENT_APP_URL = import.meta.env.PROD
        ? 'https://app.switch-qr.com'
        : (import.meta.env.VITE_APP_URL || 'https://app.switch-qr.com');
    const { slug } = useParams();
    const story = stories.find(s => s.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!story) {
        return <Navigate to="/case-studies" replace />;
    }

    return (
        <>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 text-sm">
                    <Link to="/case-studies" className="text-text-muted hover:text-primary">Case Studies</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-text-main font-medium">{story.company}</span>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col gap-8 lg:gap-12 mb-16">
                    <div className="flex flex-col gap-6 max-w-4xl">
                        <div className="inline-flex h-8 w-fit items-center justify-center gap-x-2 rounded-full bg-gray-100 px-4 text-primary font-bold text-xs uppercase tracking-wider">
                            {story.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] text-text-main">
                            {story.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                            {story.description}
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                        <img
                            src={story.heroImage}
                            alt={story.title}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-4 lg:col-start-9 order-1 lg:order-2">
                        <div className="sticky top-24 flex flex-col gap-6">
                            {/* Metrics Card */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    At a Glance Results
                                </h3>
                                <div className="flex flex-col gap-6 divide-y divide-gray-100">
                                    {story.metrics.map((metric, i) => (
                                        <div key={i} className={i === 0 ? "pt-0 pb-2" : i === 1 ? "pt-4 pb-2" : "pt-4"}>
                                            <div className="text-4xl font-black text-primary mb-1">{metric.value}</div>
                                            <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                                            <p className="text-sm text-gray-500 mt-1">{metric.subtext}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Integrations */}
                            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Integrations Used</p>
                                <div className="flex gap-4 flex-wrap">
                                    {story.integrations.map((tool, i) => (
                                        <div key={i} className="h-8 px-3 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200" title={tool}>
                                            {tool}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8 lg:col-start-1 order-2 lg:order-1">
                        <div className="flex flex-col gap-10 text-lg leading-relaxed text-gray-600">
                            {/* The Challenge */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">The Challenge</h2>
                                <div className="text-gray-600 mb-4">
                                    <RichText content={story.challenge} />
                                </div>
                            </section>

                            {/* Quote */}
                            <section className="my-6">
                                <div className="relative rounded-2xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                    <span className="absolute top-8 left-8 text-6xl text-primary/10 font-serif leading-none select-none">"</span>
                                    <div className="relative z-10 flex flex-col gap-6">
                                        <p className="text-xl md:text-2xl font-medium text-text-main italic leading-relaxed">
                                            {story.quote}
                                        </p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                            <div className="size-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                <img
                                                    src={story.authorImage}
                                                    alt={story.author}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text-main">{story.author}</span>
                                                <span className="text-sm text-text-muted">{story.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* The Solution */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">The Solution</h2>
                                <div className="text-gray-600 mb-4">
                                    <RichText content={story.solution} />
                                </div>
                            </section>

                            {/* The Result */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">The Result</h2>
                                <div className="text-gray-600 mb-4">
                                    <RichText content={story.result} />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-[960px] mx-auto px-4 text-center flex flex-col items-center gap-6">
                    <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
                        Ready to see similar results?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl">
                        Join {story.company} and 500+ other brands using SwitchQR to modernize their physical touchpoints.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                        <a href={`${CLIENT_APP_URL}/register`} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-transform">
                            Start your free trial
                        </a>
                        <a href="mailto:sales@switchqr.com" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-background-light border border-gray-200 text-text-main text-base font-bold hover:bg-gray-100 transition-colors">
                            Talk to Sales
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CaseStudy;
