import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const CLIENT_APP_URL = 'https://app.switch-qr.com';

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300 min-h-screen">
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                {/* Document Header */}
                <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Refund Policy
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-sm">event</span>
                        <span>Last updated: {today}</span>
                    </div>
                </header>

                {/* Main Content Section */}
                <article className="prose-custom max-w-none prose prose-slate dark:prose-invert">
                    {/* Introduction */}
                    <section className="mb-12">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            At SwitchQR, we strive to provide the best possible service to our customers. We understand that circumstances change, and we want to ensure our refund process is as transparent and straightforward as possible. This policy outlines the conditions under which refunds may be issued for our SaaS subscriptions.
                        </p>
                    </section>

                    {/* Refund Window */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">history</span>
                            Refund Window
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                We offer a <strong>14-day money-back guarantee</strong> for all new subscriptions. If you are not satisfied with SwitchQR for any reason, you are eligible for a full refund within the first 14 days of your initial purchase.
                            </p>
                            <p>
                                Please note that this initial 14-day window applies only to the first payment of a new subscription plan and does not apply to subsequent renewal payments.
                            </p>
                        </div>
                    </section>

                    {/* How Refunds Work */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            How Refunds Work
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                Once a refund request is approved, the funds will be credited back to the original payment method used during the transaction. Please be aware of the following:
                            </p>
                            <ul className="list-none space-y-3 mb-6">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                    <span>Refunds typically take <strong>5 to 10 business days</strong> to appear on your statement, depending on your financial institution.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                    <span>We do not provide pro-rated refunds for partial months of service if you cancel outside of the initial 14-day window.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                    <span>Any transaction fees incurred by the payment processor are generally non-refundable.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Renewals */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">autorenew</span>
                            Renewals
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                Subscriptions are set to renew automatically to ensure uninterrupted service. You can disable auto-renewal at any time through your Account Settings.
                            </p>
                            <p>
                                Requests for refunds on automatic renewals will be considered on a case-by-case basis and must be submitted within 48 hours of the renewal charge. We recommend canceling your subscription at least 24 hours before the renewal date to avoid unwanted charges.
                            </p>
                        </div>
                    </section>

                    {/* How to Request a Refund */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">mail</span>
                            How to Request a Refund
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-300">
                            To initiate a refund request, please send an email to our support team. To help us process your request quickly, please include the following information:
                        </p>
                        {/* Information Callout Box */}
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-8 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary">contact_support</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
                            </div>
                            <p className="mb-6 text-slate-700 dark:text-slate-300">
                                Send your request to: <a className="text-primary font-bold hover:underline" href="mailto:support@switch-qr.com">support@switch-qr.com</a>
                            </p>
                            <div className="space-y-4">
                                <p className="text-sm uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Required Details:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-3 bg-white dark:bg-background-dark p-3 rounded-lg border border-primary/10">
                                        <span className="material-symbols-outlined text-primary">alternate_email</span>
                                        <span className="text-sm font-medium">Account Email Address</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white dark:bg-background-dark p-3 rounded-lg border border-primary/10">
                                        <span className="material-symbols-outlined text-primary">calendar_today</span>
                                        <span className="text-sm font-medium">Date of Transaction</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white dark:bg-background-dark p-3 rounded-lg border border-primary/10">
                                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                                        <span className="text-sm font-medium">Order ID or Invoice Number</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white dark:bg-background-dark p-3 rounded-lg border border-primary/10">
                                        <span className="material-symbols-outlined text-primary">help_outline</span>
                                        <span className="text-sm font-medium">Reason for Refund</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Exceptions */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">gavel</span>
                            Exceptions
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            SwitchQR reserves the right to deny refund requests if we detect patterns of abuse or fraudulent activity associated with your account. Accounts terminated due to violations of our Terms of Service are not eligible for refunds.
                        </p>
                    </section>
                </article>
            </main>
        </div>
    );
};

export default RefundPolicy;
