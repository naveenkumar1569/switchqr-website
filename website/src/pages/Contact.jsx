import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [copied, setCopied] = useState(false);
    const email = 'support@switch-qr.com';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const categories = [
        {
            icon: 'bug_report',
            title: 'Technical Support',
            description: 'Reporting bugs, platform errors, or account access troubleshooting.'
        },
        {
            icon: 'credit_card',
            title: 'Billing & Plans',
            description: 'Questions about invoices, upgrading your plan, or subscription cancellations.'
        },
        {
            icon: 'handshake',
            title: 'Sales & Partnerships',
            description: 'Enterprise deal inquiries, custom domain requirements, and partnerships.'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light">
            <main className="flex-reverse flex-col items-center justify-center flex-1 w-full py-16 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl space-y-12 mx-auto">
                    {/* Hero section */}
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-tight">
                            How can we help?
                        </h1>
                        <p className="text-lg text-text-muted font-medium max-w-2xl mx-auto">
                            We're here for you. Our dedicated support team typically responds to inquiries within 24 hours.
                        </p>
                    </div>

                    {/* Email Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col xl:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="flex flex-col gap-2 z-10 text-center xl:text-left flex-1 min-w-0">
                            <span className="text-sm font-bold uppercase tracking-wider text-text-muted/60">Direct Support Email</span>
                            <a
                                href={`mailto:${email}`}
                                className="text-3xl lg:text-4xl xl:text-[2.75rem] font-black text-primary hover:text-primary-dark transition-colors tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {email}
                            </a>
                            <p className="text-text-muted mt-2">Best for detailed inquiries and attachments.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full xl:w-auto shrink-0">
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-gray-50 hover:bg-gray-100 text-text-main font-bold transition-all active:scale-95 group/copy"
                                title="Copy to clipboard"
                            >
                                <span className={`material-symbols-outlined text-[20px] transition-colors ${copied ? 'text-green-500' : 'group-hover/copy:text-primary'}`}>
                                    {copied ? 'check' : 'content_copy'}
                                </span>
                                <span className="inline">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                            <a
                                href={`mailto:${email}`}
                                className="flex flex-1 xl:flex-none items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold shadow-[0_10px_30px_rgba(107,38,217,0.3)] hover:shadow-[0_15px_35px_rgba(107,38,217,0.4)] transition-all active:scale-95 whitespace-nowrap"
                            >
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                Send Email
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="group p-8 bg-white rounded-3xl border border-gray-100/60 hover:border-primary/30 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main mb-3">{cat.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    {cat.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Footer */}
                    <div className="text-center py-12">
                        <p className="text-text-muted font-medium">
                            Looking for quick answers?
                            <Link
                                to="/coming-soon/faq"
                                className="text-primary font-bold hover:underline hover:text-primary-dark ml-2 inline-flex items-center gap-1 group"
                            >
                                Check our FAQ
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
