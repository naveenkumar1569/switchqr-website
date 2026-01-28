import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const CLIENT_APP_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

    const plans = [
        {
            name: 'Free',
            description: 'For hobbyists and personal use.',
            price: '$0',
            priceAnnual: '$0',
            cta: 'Get Started',
            ctaStyle: 'secondary',
            features: [
                '5 Dynamic QR Codes',
                '5 Edit Destination Link',
                'Standard support',
            ],
        },
        {
            name: 'Starter',
            description: 'For creators building an audience.',
            price: '$9',
            priceAnnual: '$7',
            cta: 'Start Free Trial',
            ctaStyle: 'outline',
            features: [
                'Everything in Free, plus:',
                '50 Dynamic QR Codes',
                '100 Edit Destination Link',
                'Basic analytics dashboard',
                'Custom colors & logos',
            ],
        },
        {
            name: 'Pro',
            description: 'For businesses scaling up.',
            price: '$29',
            priceAnnual: '$23',
            cta: 'Get Started',
            ctaStyle: 'primary',
            popular: true,
            features: [
                'Everything in Starter, plus:',
                '1000 Dynamic QR Codes',
                'Unlimited Edit Destination Link',
                'Unlimited Campaigns',
                'Advanced pixel tracking',
                '5 Team seats',
                'Priority email support',
            ],
        },
    ];

    const faqs = [
        {
            question: 'Can I change plans later?',
            answer: 'Absolutely! You can upgrade or downgrade your plan at any time directly from your dashboard. If you upgrade, the new features are available immediately. Prorated charges will apply automatically.',
        },
        {
            question: 'What happens to my QR codes if I cancel?',
            answer: 'If you are on a paid plan and decide to cancel, your Dynamic QR codes will remain active until the end of your billing cycle. After that, they will be paused but not deleted. Static QR codes created on the Free plan will work forever.',
        },
        {
            question: 'Do you offer refunds?',
            answer: 'We offer a 14-day money-back guarantee for all new annual subscriptions. Monthly subscriptions can be cancelled anytime but are non-refundable for the current billing period.',
        },
        {
            question: 'Do I need a credit card to sign up?',
            answer: 'No credit card is required for the Free plan or to start a trial on the Starter plan. We only ask for payment details when you\'re ready to commit to a paid subscription.',
        },
    ];

    const comparisonData = {
        'QR Management': [
            { feature: 'Dynamic QR Codes', free: '5', starter: '50', pro: '1000' },
            { feature: 'Edit Destination Link', free: '5', starter: '100', pro: 'Unlimited' },
            { feature: 'Campaigns', free: '-', starter: '-', pro: 'Unlimited' },
        ],
        'Analytics': [
            { feature: 'Geo-tracking', free: false, starter: 'Basic', pro: 'Precise GPS' },
            { feature: 'Device & OS Stats', free: false, starter: true, pro: true },
            { feature: 'CSV Export', free: false, starter: true, pro: true },
        ],
        'Advanced': [
            { feature: 'A/B Testing', free: false, starter: false, pro: true },
            { feature: 'Smart Scheduling', free: false, starter: 'Limited', pro: 'Unlimited' },
            { feature: 'White Label Branding', free: false, starter: 'Basic Customization', pro: 'Full White Label' },
        ],
    };

    return (
        <>
            {/* Hero Section */}
            <section className="w-full pt-16 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    Simple Pricing
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-main mb-4 leading-tight">
                    Choose the right plan <br className="hidden sm:block" /> for your growth.
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mb-10">
                    Transparent pricing. No hidden fees. Cancel anytime. <br className="hidden sm:block" /> Start focusing on your content, not your bill.
                </p>
                <div className="flex items-center justify-center p-1.5 bg-gray-100 rounded-xl border border-gray-200 relative">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`relative z-10 px-6 py-2.5 text-sm font-bold transition-colors ${!isAnnual ? 'text-text-main bg-white rounded-lg shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`relative z-10 flex items-center gap-2 px-6 py-2.5 text-sm font-bold transition-all ${isAnnual ? 'text-text-main bg-white rounded-lg shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Annual
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-wide">
                            Save 20%
                        </span>
                    </button>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`flex flex-col p-6 lg:p-8 rounded-2xl bg-white border transition-all shadow-sm hover:shadow-md h-full relative ${plan.popular
                                ? 'border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}
                            <div className={`mb-6 ${plan.popular ? 'mt-2' : ''}`}>
                                <h3 className={`text-lg font-bold ${plan.popular ? 'text-primary' : 'text-text-main'}`}>{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-text-main tracking-tight">
                                    {isAnnual ? plan.priceAnnual : plan.price}
                                </span>
                                <span className="text-gray-500 font-medium">/mo</span>
                            </div>
                            <a href={`${CLIENT_APP_URL}/register`}
                                className={`w-full py-3 px-4 text-sm font-bold rounded-xl transition-all mb-8 flex items-center justify-center ${plan.ctaStyle === 'primary'
                                    ? 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg shadow-primary/20'
                                    : plan.ctaStyle === 'outline'
                                        ? 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-text-main'
                                    }`}
                            >
                                {plan.cta}
                            </a>
                            <ul className="flex flex-col gap-4 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                        <span className={fIndex === 0 ? 'font-medium' : ''}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trusted By */}
            <section className="w-full py-12 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Trusted by leading brands worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
                            alt="Spotify"
                            className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg"
                            alt="Slack"
                            className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Dropbox_logo_2017.svg"
                            alt="Dropbox"
                            className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
                            alt="Airbnb"
                            className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg"
                            alt="Shopify"
                            className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform"
                        />
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="w-full py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main mb-4 tracking-tight">Compare Features</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Detailed breakdown of what's included in each plan to help you decide.</p>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-6 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider w-1/3">Features</th>
                                    <th className="py-6 px-6 text-xl font-bold text-text-main text-center w-1/5">Free</th>
                                    <th className="py-6 px-6 text-xl font-bold text-text-main text-center w-1/5">Starter</th>
                                    <th className="py-6 px-6 text-xl font-bold text-primary text-center w-1/5">Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(comparisonData).map(([category, features]) => (
                                    <React.Fragment key={category}>
                                        <tr className="bg-gray-50/30">
                                            <td className="py-3 px-6 text-xs font-extrabold text-gray-400 uppercase tracking-wider" colSpan="4">{category}</td>
                                        </tr>
                                        {features.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 text-gray-700 font-medium">{row.feature}</td>
                                                <td className="py-4 px-6 text-center">
                                                    {typeof row.free === 'boolean' ? (
                                                        row.free ? (
                                                            <span className="material-symbols-outlined text-primary text-xl">check</span>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-300 text-sm">remove</span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-600">{row.free}</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {typeof row.starter === 'boolean' ? (
                                                        row.starter ? (
                                                            <span className="material-symbols-outlined text-primary text-xl">check</span>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-300 text-sm">remove</span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-600">{row.starter}</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {typeof row.pro === 'boolean' ? (
                                                        row.pro ? (
                                                            <span className="material-symbols-outlined text-primary text-xl">check</span>
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-300 text-sm">remove</span>
                                                        )
                                                    ) : (
                                                        <span className="font-bold text-text-main">{row.pro}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="w-full py-24 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-text-main mb-2 tracking-tight">Success Stories</h2>
                            <p className="text-gray-500">See how high-growth companies use SwitchQR.</p>
                        </div>
                        <Link to="/case-studies" className="text-primary font-bold hover:text-primary-dark transition-colors flex items-center gap-1 group">
                            All Stories <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                logo: 'storefront',
                                company: 'RetailX',
                                quote: '"How RetailX increased in-store engagement by 40% using SwitchQR."',
                                description: '"SwitchQR allowed us to track exactly which store locations were driving the most app downloads. The dynamic capabilities meant we could change promos without reprinting signage."',
                                author: 'Sarah Jenkins',
                                role: 'CMO, RetailX',
                            },
                            {
                                logo: 'rocket_launch',
                                company: 'TechFlow',
                                quote: '"We saved 20+ hours per week managing client campaigns."',
                                description: '"The bulk creation tools and API access allowed us to automate QR generation for our 500+ clients. It seamlessly integrated into our existing marketing workflow."',
                                author: 'Mike Ross',
                                role: 'Product Lead, TechFlow',
                            },
                        ].map((story, i) => (
                            <div key={i} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="h-10 mb-6 text-gray-900 font-bold text-xl flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-primary text-3xl">{story.logo}</span>
                                    {story.company}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-text-main mb-4 leading-snug">{story.quote}</h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">{story.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-text-main">{story.author}</div>
                                            <div className="text-xs text-gray-500 font-medium">{story.role}</div>
                                        </div>
                                    </div>
                                    <Link to="/case-studies/retailx" className="text-primary font-bold text-sm hover:underline">View Story</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight mb-2">Frequently Asked Questions</h2>
                    <p className="text-gray-500">Everything you need to know about the product and billing.</p>
                </div>
                <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 hover:bg-gray-50 transition-colors">
                                <h4 className="text-text-main font-semibold text-base">{faq.question}</h4>
                                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 pt-0">
                                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Pricing;
