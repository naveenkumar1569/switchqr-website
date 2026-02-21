import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogs } from '../data/blogs';

const BlogDetail = () => {
    const { slug } = useParams();
    const blog = blogs.find(b => b.slug === slug);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!blog) {
        return <Navigate to="/blog" replace />;
    }

    const formatText = (text) => {
        if (!text) return '';
        // Replace **text** with <strong>text</strong>
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/20 selection:text-primary min-h-screen">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-200 dark:bg-gray-800">
                <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                ></div>
            </div>

            <main className="relative">
                {/* Blog Header Section */}
                <section className="pt-12 pb-8 px-4 sm:px-6">
                    <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
                        {/* Category Tag */}
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary ring-1 ring-inset ring-primary/20 uppercase tracking-wider">
                            {blog.eyebrow}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                            {blog.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                            {blog.description}
                        </p>

                        {/* Author Meta */}
                        <div className="flex items-center gap-3 mt-4">
                            <img
                                alt={`Portrait of ${blog.author.name}`}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                                src={blog.author.image}
                            />
                            <div className="text-left flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{blog.author.name}</span>
                                <span className="hidden sm:inline text-slate-400">•</span>
                                <span className="text-slate-500 text-sm">{blog.date}</span>
                                <span className="hidden sm:inline text-slate-400">•</span>
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span> {blog.readTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero Image */}
                <section className="px-4 sm:px-6 mb-12">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none bg-gray-100 dark:bg-gray-800">
                            <img
                                alt={blog.title}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                src={blog.image}
                            />
                        </div>
                    </div>
                </section>

                {/* Main Content Layout */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center relative mb-20 text-center lg:text-left">
                    {/* Article Body */}
                    <article className="max-w-[720px] w-full text-lg leading-relaxed text-slate-700 dark:text-slate-300 space-y-10 font-normal">
                        {blog.content.map((item, idx) => {
                            if (item.type === 'paragraph') {
                                return (
                                    <p key={idx} className="relative">
                                        {idx === 0 && (
                                            <span className="font-bold text-4xl lg:text-6xl float-left mr-3 text-primary leading-[1]">
                                                {item.text.charAt(0)}
                                            </span>
                                        )}
                                        <span dangerouslySetInnerHTML={{
                                            __html: formatText(idx === 0 ? item.text.substring(1) : item.text)
                                        }} />
                                    </p>
                                );
                            }
                            if (item.type === 'heading') {
                                return (
                                    <h2 key={idx} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white pt-8 mt-6 mb-2">
                                        {item.text}
                                    </h2>
                                );
                            }
                            if (item.type === 'list') {
                                return (
                                    <ul key={idx} className="space-y-4 list-none pl-2 my-6 text-left">
                                        {item.items.map((listItem, lIdx) => (
                                            <li key={lIdx} className="flex gap-3 items-start">
                                                <span className="material-symbols-outlined text-primary mt-1 text-[20px] shrink-0">check_circle</span>
                                                <span dangerouslySetInnerHTML={{ __html: formatText(listItem) }} />
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            return null;
                        })}

                        {/* Quote Block */}
                        {blog.quote && (
                            <div className="my-10 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg text-left">
                                <p className="text-xl md:text-2xl font-bold text-primary italic leading-snug">
                                    "{blog.quote.text}"
                                </p>
                            </div>
                        )}

                        {/* Pro Tip Box */}
                        {blog.proTip && (
                            <div className="p-6 bg-slate-100 dark:bg-gray-800/50 rounded-xl my-8 border border-slate-200 dark:border-gray-700 text-left">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">lightbulb</span> Pro Tip
                                </h4>
                                <p className="text-base text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
                                    {blog.proTip}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        <div className="pt-8 pb-4 flex flex-wrap gap-2">
                            {blog.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-default">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <hr className="border-slate-200 dark:border-gray-700 my-8" />

                        {/* Simplified Author Bio Box */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700">
                            <img
                                alt={`Author ${blog.author.name}`}
                                className="size-16 rounded-full object-cover ring-4 ring-background-light dark:ring-gray-900"
                                src={blog.author.image}
                            />
                            <div className="text-center sm:text-left">
                                <h4 className="font-bold text-xl text-slate-900 dark:text-white">{blog.author.name}</h4>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar (Right) - Optional Next Post Preview */}
                    <aside className="hidden xl:block w-72 shrink-0">
                        <div className="sticky top-32">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Up Next</h3>
                            <div className="group block p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                                <div className="aspect-video w-full rounded-lg bg-slate-100 dark:bg-gray-700 mb-3 overflow-hidden">
                                    <img alt="Next post preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" />
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
                                    5 Metrics You Should Be Tracking Today
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                    Stop guessing and start measuring. Here are the top 5 KPIs for digital growth.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-800/30 border-t border-slate-100 dark:border-gray-700">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Placeholder Related Cards */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col group cursor-pointer">
                                <div className="overflow-hidden rounded-xl mb-4 aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                                    <div className="w-full h-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl">article</span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Resources</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                                    Coming Soon: More Marketing Insights
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm line-clamp-2">
                                    We're crafting more expert guides and deep-dives. Stay tuned!
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="max-w-[800px] mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic">Ready to modernize your campaigns?</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of marketers using SwitchQR to bridge the gap between offline and online. Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/pricing" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-primary/50 text-center">
                            Get Started for Free
                        </Link>
                        <Link to="/pricing" className="bg-transparent border border-gray-700 hover:border-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-colors text-center">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
