import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TermsOfService = () => {
    const { token } = useAuth();
    const [activeSection, setActiveSection] = useState('terms-1');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        const sections = document.querySelectorAll('section[id^="terms-"]');
        sections.forEach((section) => observer.observe(section));

        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const navLinkClass = (id) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeSection === id
            ? 'bg-primary/10 text-primary font-bold'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium'
        }`;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="inline-block">
                                <img src="/logo.svg" alt="SwitchQR" className="h-9" />
                            </Link>

                        </div>
                        <div className="flex items-center gap-4">
                            <Link to={token ? "/" : "/login"} className="hidden sm:inline-flex text-sm font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-white">
                                {token ? 'Dashboard' : 'Log In'}
                            </Link>
                            <Link to="#" className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-sm">Get Started</Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sticky Left Sidebar */}
                    <aside className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">On this page</h1>
                                <nav className="flex flex-col gap-1">
                                    <a className={navLinkClass('terms-1')} href="#terms-1">
                                        <span>1. Introduction</span>
                                    </a>
                                    <a className={navLinkClass('terms-2')} href="#terms-2">
                                        <span>2. Account Responsibility</span>
                                    </a>
                                    <a className={navLinkClass('terms-3')} href="#terms-3">
                                        <span>3. Acceptable Use</span>
                                    </a>
                                    <a className={navLinkClass('terms-4')} href="#terms-4">
                                        <span>4. QR Destinations</span>
                                    </a>
                                    <a className={navLinkClass('terms-5')} href="#terms-5">
                                        <span>5. Analytics & Accuracy</span>
                                    </a>
                                    <a className={navLinkClass('terms-6')} href="#terms-6">
                                        <span>6. Scheduled Redirects</span>
                                    </a>
                                    <a className={navLinkClass('terms-7')} href="#terms-7">
                                        <span>7. Subscription & Billing</span>
                                    </a>
                                    <a className={navLinkClass('terms-8')} href="#terms-8">
                                        <span>8. Service Availability</span>
                                    </a>
                                    <a className={navLinkClass('terms-9')} href="#terms-9">
                                        <span>9. Data & Privacy</span>
                                    </a>
                                    <a className={navLinkClass('terms-10')} href="#terms-10">
                                        <span>10. Intellectual Property</span>
                                    </a>
                                    <a className={navLinkClass('terms-11')} href="#terms-11">
                                        <span>11. Termination</span>
                                    </a>
                                    <a className={navLinkClass('terms-12')} href="#terms-12">
                                        <span>12. Limitation of Liability</span>
                                    </a>
                                    <a className={navLinkClass('terms-13')} href="#terms-13">
                                        <span>13. Indemnification</span>
                                    </a>
                                    <a className={navLinkClass('terms-14')} href="#terms-14">
                                        <span>14. Changes to Terms</span>
                                    </a>
                                    <a className={navLinkClass('terms-15')} href="#terms-15">
                                        <span>15. Contact</span>
                                    </a>
                                </nav>
                            </div>

                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:w-3/4 max-w-3xl">
                        {/* Page Heading */}
                        <div className="mb-10">
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">Terms of Service</h1>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                <span className="text-sm font-medium">Effective Date: January 18, 2026</span>
                            </div>
                        </div>

                        {/* Action Panel / Agreement Notice */}
                        <div className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">Agreement of Terms</p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    By accessing or using the SwitchQR website, dashboard, QR code services, and all related products, you agree to be bound by these Terms.
                                </p>
                            </div>
                        </div>

                        {/* Section Contents */}
                        <article className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-400 leading-8 mb-8">
                                These Terms of Service (“Terms”) govern your access to and use of the SwitchQR website, dashboard, QR code services, redirect services, analytics features, and all related products and services (collectively, the “Service”).
                                By creating a QR code, creating an account, or using the Service in any way, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
                            </p>

                            <section className="mb-12 scroll-mt-24" id="terms-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">1</span>
                                    What SwitchQR Provides
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>SwitchQR allows users to generate QR codes that redirect through SwitchQR servers to destination URLs specified by the user. The Service may also provide scan analytics such as time, device type, and approximate location.</p>
                                    <p>SwitchQR does not host, control, or review the content of destination websites.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-2">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">2</span>
                                    Account Responsibility
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>You are responsible for:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Maintaining the confidentiality of your login credentials</li>
                                        <li>All activity that occurs under your account</li>
                                        <li>Ensuring your use of the Service complies with these Terms and applicable laws</li>
                                    </ul>
                                    <p>You must notify us immediately if you believe your account has been compromised. We are not responsible for losses caused by unauthorized account access resulting from your failure to protect your credentials.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-3">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">3</span>
                                    Acceptable Use
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>You agree not to use SwitchQR for any unlawful, harmful, or abusive purpose, including but not limited to:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Phishing, scams, or deceptive practices</li>
                                        <li>Distribution of malware or harmful software</li>
                                        <li>Violations of intellectual property rights</li>
                                        <li>Promoting illegal products or services</li>
                                        <li>Circumventing security systems or abusing infrastructure</li>
                                    </ul>
                                    <p>We reserve the right to suspend or permanently disable any QR code or account that violates these rules, with or without prior notice.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">4</span>
                                    Responsibility for QR Destinations
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>You are solely responsible for:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>The content of destination URLs</li>
                                        <li>The legality and accuracy of information on those pages</li>
                                        <li>Compliance with advertising, privacy, and consumer protection laws</li>
                                    </ul>
                                    <p>SwitchQR is not responsible for damages, claims, or disputes arising from where your QR codes redirect users.</p>
                                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-primary italic">
                                        If someone gets mad, sues, or complains because of what your QR links to, that problem belongs to you, not us.
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-5">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">5</span>
                                    Analytics and Accuracy
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>Analytics provided by SwitchQR are based on technical signals such as IP addresses and user-agent data and are provided on a best-effort basis.</p>
                                    <p>You acknowledge that:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Scan counts may not be perfectly accurate</li>
                                        <li>Location and device detection may be approximate or incorrect</li>
                                        <li>VPNs, privacy tools, and network behavior can affect results</li>
                                    </ul>
                                    <p>SwitchQR makes no guarantees regarding analytics accuracy or completeness. Analytics are informational only and should not be relied upon as the sole basis for business decisions.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">6</span>
                                    Scheduled Redirects and A/B Testing
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>If your subscription plan includes scheduled redirects or A/B testing:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>You are responsible for configuring correct URLs, schedules, and routing settings</li>
                                        <li>Routing behavior is automated based on your configuration</li>
                                        <li>SwitchQR is not responsible for business losses caused by configuration errors or unexpected traffic behavior</li>
                                    </ul>
                                    <p>We do not guarantee perfect traffic distribution in A/B testing, only reasonable approximation based on routing logic.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-7">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">7</span>
                                    Subscription Plans and Billing
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>Some features require a paid subscription. By subscribing, you agree that:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Fees are billed in advance</li>
                                        <li>Payments are non-refundable except where required by law</li>
                                        <li>Plan limits are enforced at the system level</li>
                                        <li>Downgrading plans may restrict features or access to data</li>
                                    </ul>
                                    <p>We reserve the right to modify pricing and plans with reasonable advance notice. Failure to pay may result in suspension or termination of service.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">8</span>
                                    Service Availability
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>We strive to keep the Service available, but we do not guarantee uninterrupted or error-free operation. Service interruptions may occur due to maintenance, infrastructure issues, network failures, or third-party service outages.</p>
                                    <p>SwitchQR is not liable for damages resulting from downtime, failed redirects, or delayed responses.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-9">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">9</span>
                                    Data and Privacy
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>We collect limited technical and account information necessary to operate the Service, including IP-based location data, device and browser data, scan timestamps, and account details. We do not sell personal data.</p>
                                    <p>Details about data handling are provided in our Privacy Policy. You are responsible for ensuring your own legal compliance regarding data collection and user consent related to your campaigns.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-10">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">10</span>
                                    Intellectual Property
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>All software, branding, designs, and technology related to SwitchQR are owned by SwitchQR or its licensors. You receive a limited, non-exclusive, non-transferable right to use the Service in accordance with these Terms.</p>
                                    <p>You retain ownership of your QR labels, destination URLs, and campaign metadata. But you grant SwitchQR permission to process and store this data solely to provide the Service.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-11">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">11</span>
                                    Termination
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>We may suspend or terminate your account or QR codes if you violate these Terms, abuse the Service, or fail to pay applicable fees. You may stop using the Service at any time.</p>
                                    <p>After termination: QR codes may stop redirecting, analytics access may be removed, and data may be deleted according to our retention policies. We are not responsible for losses resulting from termination.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-12">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">12</span>
                                    Limitation of Liability
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>To the maximum extent permitted by law, SwitchQR is not liable for lost revenue or profits, lost business opportunities, campaign failures, incorrect analytics, or destination website issues.</p>
                                    <p>Our total liability shall not exceed the amount you paid to SwitchQR in the previous 12 months.</p>
                                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-primary italic">
                                        If you are on the Free plan, our liability is limited to zero. Yes, zero. That’s how free services survive.
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-13">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">13</span>
                                    Indemnification
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>You agree to defend and indemnify SwitchQR from any claims, damages, losses, or expenses arising from: Your QR code destinations, Your marketing content, or Your violation of laws or regulations.</p>
                                    <p>In simple terms: if your campaign causes trouble, you handle it, not us.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-14">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">14</span>
                                    Changes to These Terms
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>We may update these Terms from time to time. If we make material changes, we will update the effective date and may notify you through the Service or email. Continued use of the Service after changes means you accept the updated Terms.</p>
                                </div>
                            </section>

                            <section className="mb-12 scroll-mt-24" id="terms-15">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary text-sm font-bold">15</span>
                                    Contact
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-8">
                                    <p>If you have questions about these Terms, contact us at:</p>
                                    <p><strong>Email:</strong> support@switchqr.com</p>
                                    <p><strong>Company Name:</strong> SwitchQR</p>
                                </div>
                            </section>

                        </article>

                        {/* Footer Section */}
                        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <Link to="/" className="inline-block mb-2">
                                        <img src="/logo.svg" alt="SwitchQR" className="h-9" />
                                    </Link>
                                    <p className="text-sm text-slate-500">© 2026 SwitchQR Technologies Inc. All rights reserved.</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>

            {/* Scroll to Top Button */}
            <a href="#" className="fixed bottom-8 right-8 z-50 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary transition-all active:scale-95">
                <span className="material-symbols-outlined">arrow_upward</span>
            </a>
        </div>
    );
};

export default TermsOfService;
