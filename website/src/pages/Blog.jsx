import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const categories = ['All Posts', 'Strategy', 'Analytics', 'Use Cases', 'Product Updates'];
    const [activeCategory, setActiveCategory] = React.useState('All Posts');

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Hero Section */}
            <section className="px-6 pt-16 pb-12 lg:px-40 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                        QR Marketing Insights
                    </h1>
                    <p className="text-text-muted dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                        Expert strategies, analytics deep-dives, and product updates to supercharge your QR campaigns.
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3 pt-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex h-10 px-6 items-center justify-center rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-text-main dark:text-gray-300 hover:border-primary/50 hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="px-6 pb-20 lg:px-40">
                <div className="max-w-[1200px] mx-auto">
                    {/* Empty State / Coming Soon */}
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <span className="material-symbols-outlined text-3xl">edit_note</span>
                        </div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">Our blog is coming soon</h2>
                        <p className="text-text-muted dark:text-gray-400 text-center max-w-md">
                            We're busy writing deep-dives and expert guides to help you master QR marketing. Check back soon for our first posts!
                        </p>

                        <div className="mt-10 max-w-md w-full px-6">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 text-center uppercase tracking-wider">Get notified when we launch</h4>
                                <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-grow px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                    <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                        Join Waitlist
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Hidden Mock Sections (for future reference) */}
                    {/* 
                    Featured Post and Blog Grid would go here.
                    The user requested to keep it empty for now.
                    */}
                </div>
            </div>
        </div>
    );
};

export default Blog;
