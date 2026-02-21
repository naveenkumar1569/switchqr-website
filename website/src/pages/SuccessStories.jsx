import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../data/stories';

const SuccessStories = () => {
    const CLIENT_APP_URL = 'https://app.switch-qr.com';
    const categories = ['All', 'Retail', 'Events', 'Food & Beverage', 'Packaging', 'Marketing', 'Fintech', 'Cloud & Enterprise'];
    const [activeCategory, setActiveCategory] = React.useState('All');

    // Filter stories based on active category
    const filteredStories = activeCategory === 'All'
        ? stories
        : stories.filter(story => story.category === activeCategory);

    // Use the first story as the featured one
    const featuredStory = stories[0];

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background-light pt-20 pb-16 lg:pt-32 lg:pb-24">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-light via-background-light to-background-light"></div>
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Trusted by 10,000+ brands
                    </div>
                    <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl lg:text-6xl mb-6">
                        Marketing Success Stories
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-text-muted">
                        See how leading brands use SwitchQR dynamic codes to bridge the gap between offline assets and online growth.
                    </p>

                    {/* Filter Tabs */}
                    <div className="mt-12 flex justify-center overflow-x-auto pb-4">
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${activeCategory === category
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Story */}
            <section className="bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl border border-gray-100">
                        <div className="flex flex-col lg:flex-row">
                            <div className="relative h-80 lg:h-auto lg:w-1/2 overflow-hidden">
                                <img
                                    src={featuredStory.image}
                                    alt={featuredStory.title}
                                    className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                                />
                                {/* Featured Badge Overlay */}
                                <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">stars</span>
                                    <span className="text-xs font-black uppercase tracking-widest text-text-main">Featured Story</span>
                                </div>
                                {/* Company Logo Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-2xl">{featuredStory.logo || 'monitoring'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-lg tracking-tight leading-none uppercase">{featuredStory.company}</span>
                                        <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase mt-1">{featuredStory.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center p-8 lg:w-1/2 lg:p-14">
                                <h2 className="mb-6 text-3xl font-black leading-[1.1] text-text-main lg:text-4xl tracking-tight">
                                    {featuredStory.title}
                                </h2>
                                <p className="mb-8 text-lg text-text-muted leading-relaxed">
                                    {featuredStory.description}
                                </p>

                                <div className="mb-10 flex items-center gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="size-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                                        <img src={featuredStory.authorImage} alt={featuredStory.author} className="size-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-text-main tracking-tight uppercase">{featuredStory.author}</span>
                                        <span className="text-xs font-bold text-text-muted mt-0.5">{featuredStory.role}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/case-studies/${featuredStory.slug}`}
                                    className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all"
                                >
                                    Read Full Case Study
                                    <span className="material-symbols-outlined">arrow_right_alt</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Study Grid */}
            <section className="bg-gray-50 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <div className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-3">Library</div>
                            <h3 className="text-3xl font-black text-text-main tracking-tight uppercase">Latest Stories</h3>
                        </div>
                        <div className="hidden sm:block relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by industry or brand..."
                                className="pl-11 h-12 w-64 rounded-xl border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStories.map((story) => (
                            <article key={story.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                {/* Card Header / Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={story.image}
                                        alt={story.company}
                                        className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    {/* Company Badge Overlay */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-white/20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                            {story.brandLogo ? (
                                                <img src={story.brandLogo} alt={story.company} className="size-5 object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-primary text-xl font-bold">{story.logo || 'monitoring'}</span>
                                            )}
                                        </div>
                                        <span className="text-xs font-black text-text-main uppercase tracking-tight pr-2">{story.company}</span>
                                    </div>
                                    {/* Static Category Tag */}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/10">
                                        {story.category}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-1 flex-col p-8">
                                    {/* Author Mini-Info */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="size-10 rounded-full overflow-hidden border-2 border-primary/10 bg-gray-50 shrink-0">
                                            <img src={story.authorImage} alt={story.author} className="size-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-text-main uppercase tracking-tight">{story.author}</span>
                                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{story.role.split(',')[0]}</span>
                                        </div>
                                    </div>

                                    <h3 className="mb-4 text-xl font-black leading-tight text-text-main group-hover:text-primary transition-colors">
                                        {story.title}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <Link
                                            to={`/case-studies/${story.slug}`}
                                            className="inline-flex items-center gap-2 text-xs font-black text-text-main uppercase tracking-[0.15em] hover:text-primary transition-colors"
                                        >
                                            View Results
                                            <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="mt-12 flex justify-center">
                        <button className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-bold text-text-main hover:bg-gray-50 transition-colors">
                            Load More Stories
                        </button>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-primary py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
                        Join 10,000+ brands optimizing their offline marketing.
                    </h2>
                    <p className="mb-8 text-lg text-primary-light/90">
                        Start creating dynamic QR codes today and track every scan in real-time. No credit card required.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a href={`${CLIENT_APP_URL}/register`} className="w-full flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105 sm:w-auto">
                            Start Free Trial
                        </a>
                        <a href="mailto:sales@switchqr.com" className="w-full flex items-center justify-center rounded-full border-2 border-primary-light px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                            Talk to Sales
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};


export default SuccessStories;
