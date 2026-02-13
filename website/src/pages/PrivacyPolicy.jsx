import React from 'react';

const PrivacyPolicy = () => {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-background-light text-text-main font-display antialiased min-h-screen">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Page Heading */}
                    <div className="mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black text-text-main leading-tight mb-4 tracking-tight">Privacy Policy</h1>
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="material-symbols-outlined text-base">calendar_today</span>
                            <span className="text-sm font-medium">Last updated: {today}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <article className="prose prose-slate max-w-none">
                        <div className="space-y-8 text-text-muted leading-8">
                            <p className="text-lg">This Privacy Policy explains how SwitchQR (“SwitchQR”, “we”, “us”) collects, uses, and shares information when you use our websites, products, and services (the “Services”).</p>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Information we collect</h2>

                                <h3 className="text-xl font-bold text-text-main mb-2">Account information</h3>
                                <p>When you create an account, we collect information such as your name, email address, and authentication details.</p>

                                <h3 className="text-xl font-bold text-text-main mb-2 mt-6">Usage information</h3>
                                <p>We collect information about how you use the Services, such as pages visited, features used, and actions taken. This may include device and browser information, IP address, and timestamps.</p>

                                <h3 className="text-xl font-bold text-text-main mb-2 mt-6">QR and link data</h3>
                                <p>When you create QR codes and destination URLs, we store the QR configuration and related metadata needed to provide the Services.</p>

                                <h3 className="text-xl font-bold text-text-main mb-2 mt-6">Cookies</h3>
                                <p>We use cookies and similar technologies to operate the Services and improve performance. You can control cookies through your browser settings.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">How we use information</h2>
                                <p>We use information to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>provide and operate the Services</li>
                                    <li>create and manage accounts</li>
                                    <li>process requests and support inquiries</li>
                                    <li>improve product performance and user experience</li>
                                    <li>maintain security and prevent fraud</li>
                                    <li>communicate important product and account updates</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Payments</h2>
                                <p>Payments are processed by our payment partners. We do not store full card details on our servers.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">How we share information</h2>
                                <p>We may share information with:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>service providers who help us run the Services (e.g., hosting, analytics, email delivery, payments)</li>
                                    <li>legal authorities when required by law or to protect rights and safety</li>
                                </ul>
                                <p className="mt-4 font-bold text-text-main italic">We do not sell your personal information.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Data retention</h2>
                                <p>We retain information for as long as needed to provide the Services and meet legal, accounting, and security requirements.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Security</h2>
                                <p>We use reasonable administrative, technical, and organizational measures to protect information. No method of transmission or storage is 100% secure.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">International transfers</h2>
                                <p>Your information may be processed in countries other than your own depending on where our service providers operate.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Your choices</h2>
                                <p>You can:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>update account information in your account settings</li>
                                    <li>request deletion of your account by contacting support@switch-qr.com</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Contact</h2>
                                <p>If you have questions about this Privacy Policy, contact <a href="mailto:support@switch-qr.com" className="text-primary hover:underline font-bold">support@switch-qr.com</a>.</p>
                            </section>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
