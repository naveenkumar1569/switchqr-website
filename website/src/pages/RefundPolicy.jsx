import React from 'react';

const RefundPolicy = () => {
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
                        <span>Last updated: February 18, 2026</span>
                    </div>
                </header>

                {/* Main Content */}
                <article className="prose-custom max-w-none prose prose-slate dark:prose-invert">
                    {/* Introduction */}
                    <section className="mb-12">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            SwitchQR subscriptions are billed and managed through Paddle, our Merchant of Record. Paddle handles all payments, invoicing, and refunds in accordance with their consumer terms.
                        </p>
                    </section>

                    {/* 14-Day Money-Back Guarantee */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">verified</span>
                            14-Day Money-Back Guarantee
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We offer a <strong>14-day money-back guarantee</strong> for first-time subscription purchases. If you are not satisfied with SwitchQR, you may request a full refund within 14 days of your initial purchase.
                        </p>
                    </section>

                    {/* Refund Processing */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            Refund Processing
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            All refund requests are processed through Paddle and issued to the original payment method used at checkout. Processing times may vary depending on your financial institution.
                        </p>
                    </section>

                    {/* Subscription Renewals */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">autorenew</span>
                            Subscription Renewals
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                SwitchQR subscriptions renew automatically at the end of each billing period. You may cancel your subscription at any time through your account settings to prevent future charges.
                            </p>
                            <p>
                                Refund requests for renewal payments are handled in accordance with Paddle's refund policy and consumer protection requirements.
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
                            To request a refund, please contact Paddle directly through your purchase receipt or contact Paddle support at:
                        </p>
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-8 mb-8">
                            <div className="space-y-6">
                                {/* Paddle Support */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">support_agent</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Paddle Support</h3>
                                    </div>
                                    <a className="text-primary font-bold hover:underline" href="https://www.paddle.net/support" target="_blank" rel="noopener noreferrer">
                                        https://www.paddle.net/support
                                    </a>
                                </div>

                                <hr className="border-primary/10" />

                                {/* SwitchQR Support */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">contact_support</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">SwitchQR Support</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 mb-2">
                                        Alternatively, you may contact SwitchQR support at:
                                    </p>
                                    <a className="text-primary font-bold hover:underline" href="mailto:support@switch-qr.com">
                                        support@switch-qr.com
                                    </a>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        We will assist you in initiating the refund process with Paddle where applicable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Merchant of Record */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">gavel</span>
                            Merchant of Record
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                All transactions are processed by Paddle, who acts as the Merchant of Record for SwitchQR. Refunds are governed by Paddle's Consumer Terms, available at:
                            </p>
                            <a className="text-primary font-bold hover:underline block" href="https://www.paddle.com/legal/invoiced-consumer-terms" target="_blank" rel="noopener noreferrer">
                                https://www.paddle.com/legal/invoiced-consumer-terms
                            </a>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
};

export default RefundPolicy;
