import React from 'react';

const PrivacyPolicy = () => {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300 min-h-screen">
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                {/* Document Header */}
                <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-sm">event</span>
                        <span>Last updated: February 13, 2026</span>
                    </div>
                </header>

                {/* Main Content Section */}
                <article className="prose-custom max-w-none prose prose-slate dark:prose-invert">
                    {/* Introduction */}
                    <section className="mb-12">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            This Privacy Policy explains how SwitchQR (“SwitchQR”, “we”, “us”) collects, uses, and shares information when you use our websites, products, and services (the “Services”).
                        </p>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Information we collect */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">database</span>
                            Information we collect
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Account information</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    When you create an account, we collect information such as your name, email address, and authentication details.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Usage information</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    We collect information about how you use the Services, such as pages visited, features used, and actions taken. This may include device information, browser type, IP address, and timestamps.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">QR and link data</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    When you create QR codes and destination URLs, we store the QR configuration and related metadata needed to provide the Services.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Cookies</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    We use cookies and similar technologies to operate and improve the Services. You can control cookies through your browser settings.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* How we use information */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">settings_suggest</span>
                            How we use information
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 dark:text-slate-300">
                            {[
                                { icon: 'lan', text: 'Provide, operate, and maintain the Services' },
                                { icon: 'manage_accounts', text: 'Create and manage user accounts' },
                                { icon: 'support_agent', text: 'Respond to support requests' },
                                { icon: 'trending_up', text: 'Improve performance and reliability' },
                                { icon: 'security', text: 'Detect and prevent fraud or abuse' },
                                { icon: 'campaign', text: 'Communicate important service info' },
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 bg-white dark:bg-background-dark p-4 rounded-xl border border-primary/10 shadow-sm shadow-primary/5">
                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                    <span className="text-sm font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Payments */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">payments</span>
                            Payments
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                Payments are processed by third-party payment providers, including <strong>Paddle.com</strong>. Paddle acts as the Merchant of Record and may collect and process personal and payment information in accordance with their Privacy Policy.
                            </p>
                            <p className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 italic text-sm">
                                SwitchQR does not store full credit card numbers or payment details.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* How we share information */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">share</span>
                            How we share information
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p>We may share information with:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Service providers that support hosting, infrastructure, analytics, email delivery, and payment processing</li>
                                <li>Legal authorities when required by law</li>
                                <li>Parties necessary to protect the security and integrity of the Services</li>
                            </ul>
                            <p className="mt-6 font-bold text-primary italic">We do not sell personal information.</p>
                        </div>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Data retention */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">timer</span>
                            Data retention
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            We retain personal information for as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and enforce agreements.
                        </p>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Security */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">verified_user</span>
                            Security
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            We implement reasonable administrative, technical, and organizational safeguards to protect personal information. However, no system is completely secure.
                        </p>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* International transfers */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">public</span>
                            International transfers
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Your information may be processed in countries other than your own, including where our service providers operate.
                        </p>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Your rights and choices */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">checklist_rtl</span>
                            Your rights and choices
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>Update your account information at any time</li>
                            <li>Request deletion of your account by contacting support@switch-qr.com</li>
                            <li>Control cookies through browser settings</li>
                        </ul>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-24 mb-12"></div>

                    {/* Contact Section */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">contact_page</span>
                            Contact
                        </h2>
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-8">
                            <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">
                                If you have questions about this Privacy Policy, contact:
                            </p>
                            <a
                                href="mailto:support@switch-qr.com"
                                className="inline-flex items-center gap-3 text-2xl font-bold text-primary hover:underline group"
                            >
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">mail</span>
                                support@switch-qr.com
                            </a>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
