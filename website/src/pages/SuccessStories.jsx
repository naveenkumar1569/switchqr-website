import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../data/stories';

const SuccessStories = () => {
    const categories = ['All', 'Retail', 'Events', 'Food & Beverage', 'Packaging'];
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
                    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex flex-col lg:flex-row">
                            <div className="relative h-64 lg:h-auto lg:w-1/2 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
                                <img
                                    src={featuredStory.image}
                                    alt={featuredStory.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-main shadow-sm lg:hidden">
                                    Featured Story
                                </div>
                            </div>
                            <div className="flex flex-col justify-center p-8 lg:w-1/2 lg:p-12">
                                <div className="mb-4 hidden lg:flex items-center gap-3">
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Featured Story</span>
                                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-text-muted">{featuredStory.category}</span>
                                </div>
                                <h2 className="mb-4 text-3xl font-bold leading-tight text-text-main lg:text-4xl">
                                    {featuredStory.title}
                                </h2>
                                <p className="mb-8 text-lg text-text-muted line-clamp-3">
                                    {featuredStory.description}
                                </p>
                                <div className="mb-8 grid grid-cols-2 gap-6 border-y border-gray-100 py-6">
                                    <div>
                                        <div className="text-3xl font-black text-primary">{featuredStory.metrics[0].value}</div>
                                        <div className="text-sm font-medium text-text-muted">{featuredStory.metrics[0].label}</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-primary">{featuredStory.metrics[1].value}</div>
                                        <div className="text-sm font-medium text-text-muted">{featuredStory.metrics[1].label}</div>
                                    </div>
                                </div>
                                <Link
                                    to={`/case-studies/${featuredStory.slug}`}
                                    className="inline-flex items-center gap-2 font-bold text-primary transition-colors hover:text-primary-dark"
                                >
                                    Read Full Story
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Study Grid */}
            <section className="bg-gray-50 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-text-main">Latest Stories</h3>
                            <p className="mt-1 text-text-muted">Explore how different industries are innovating.</p>
                        </div>
                        <div className="hidden sm:block relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder="Search stories..."
                                className="pl-10 rounded-full border-gray-200 bg-white py-2 pr-4 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStories.map((story) => (
                            <article key={story.id} className="card-hover group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={story.image}
                                        alt={story.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur">
                                            {story.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="mb-2 text-xl font-bold leading-tight text-text-main">
                                        {story.title}
                                    </h3>
                                    <p className="mb-4 flex-1 text-sm text-text-muted">
                                        {story.description}
                                    </p>
                                    <Link
                                        to={`/case-studies/${story.slug}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary-dark"
                                    >
                                        Read Story
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Link>
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
                        <button className="w-full rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105 sm:w-auto">
                            Start Free Trial
                        </button>
                        <button className="w-full rounded-full border-2 border-primary-light px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                            Talk to Sales
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SuccessStories;
