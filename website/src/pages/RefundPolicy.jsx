import React from 'react';

const RefundPolicy = () => {
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
                        <h1 className="text-4xl sm:text-5xl font-black text-text-main leading-tight mb-4 tracking-tight">Refund Policy</h1>
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="material-symbols-outlined text-base">calendar_today</span>
                            <span className="text-sm font-medium">Last updated: {today}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <article className="prose prose-slate max-w-none">
                        <div className="space-y-8 text-text-muted leading-8 text-lg">
                            <p>SwitchQR is sold as a subscription service.</p>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Refund window</h2>
                                <p>You may request a refund within 14 days of your initial purchase.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">How refunds work</h2>
                                <p>If you request a refund within the refund window, we will process a full refund to the original payment method.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Renewals</h2>
                                <p>Renewal charges are non-refundable.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">How to request a refund</h2>
                                <p>Email us at <a href="mailto:support@switch-qr.com" className="text-primary hover:underline font-bold">support@switch-qr.com</a> with:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>the email address used for your purchase</li>
                                    <li>the date of purchase</li>
                                    <li>the reason for your request (optional)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Processing time</h2>
                                <p>Approved refunds are typically processed within 5–10 business days, depending on your payment provider.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-main mb-4">Contact</h2>
                                <p>If you have questions about this policy, email <a href="mailto:support@switch-qr.com" className="text-primary hover:underline font-bold">support@switch-qr.com</a>.</p>
                            </section>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default RefundPolicy;
