import React from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

const Blog = () => {
    const categories = ['All Posts', 'Strategy', 'Analytics', 'Use Cases', 'Product Updates'];
    const [activeCategory, setActiveCategory] = React.useState('All Posts');

    const filteredBlogs = activeCategory === 'All Posts'
        ? blogs
        : blogs.filter(b => b.category === activeCategory);

    // For the mock layout, let's assume the first one is featured
    const featuredBlog = blogs[0];
    const otherBlogs = filteredBlogs.filter(b => b.id !== featuredBlog?.id);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
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

                    {blogs.length > 0 ? (
                        <>
                            {/* Featured Post */}
                            {activeCategory === 'All Posts' && featuredBlog && (
                                <div className="mb-16 group">
                                    <Link to={`/blog/${featuredBlog.slug}`} className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                        <div className="lg:w-7/12 h-64 lg:h-auto overflow-hidden relative">
                                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                alt={featuredBlog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                src={featuredBlog.image}
                                            />
                                        </div>
                                        <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">{featuredBlog.category}</span>
                                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{featuredBlog.readTime}</span>
                                            </div>
                                            <h2 className="text-2xl lg:text-3xl font-bold text-text-main dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                                                {featuredBlog.title}
                                            </h2>
                                            <p className="text-text-muted dark:text-gray-400 mb-8 line-clamp-3">
                                                {featuredBlog.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <img alt={featuredBlog.author.name} className="size-10 rounded-full object-cover border-2 border-white dark:border-gray-700" src={featuredBlog.author.image} />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-text-main dark:text-white">{featuredBlog.author.name}</span>
                                                        <span className="text-xs text-text-muted">{featuredBlog.date}</span>
                                                    </div>
                                                </div>
                                                <span className="flex items-center justify-center size-10 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">arrow_forward</span>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Blog Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {otherBlogs.map((blog) => (
                                    <article key={blog.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                        <Link to={`/blog/${blog.slug}`} className="flex flex-col h-full">
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    src={blog.image}
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider shadow-sm border border-gray-100 dark:border-gray-700">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-text-muted dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                                    {blog.description}
                                                </p>
                                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <img alt={blog.author.name} className="size-8 rounded-full object-cover" src={blog.author.image} />
                                                        <span className="text-xs font-medium text-text-main dark:text-gray-300">{blog.author.name}</span>
                                                    </div>
                                                    <span className="text-xs text-text-muted font-medium">{blog.date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}

                                {/* Empty State for Other Categories if no blogs */}
                                {otherBlogs.length === 0 && activeCategory !== 'All Posts' && (
                                    <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-text-muted">More {activeCategory} posts coming soon!</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Total Empty State */
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <span className="material-symbols-outlined text-3xl">edit_note</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-3">Our blog is coming soon</h2>
                            <p className="text-text-muted dark:text-gray-400 text-center max-w-md">
                                We're busy writing deep-dives and expert guides to help you master QR marketing. Check back soon for our first posts!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;
