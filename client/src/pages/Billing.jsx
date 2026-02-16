import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/api';

const Billing = () => {
    const { user, token, planInfo } = useAuth();
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [userEmail, setUserEmail] = useState('');

    // Use plan info from context
    const currentPlan = planInfo?.effectivePlan || 'free';
    const QR_LIMIT = planInfo?.qr_limit || 5;
    const qrCount = planInfo?.qr_count || 0;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await apiGet('/api/users/profile', token);
                if (response.ok) {
                    const data = await response.json();
                    setUserEmail(data.email);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const plans = {
        monthly: {
            free: { price: 0, qrs: 3 },
            starter: { price: 9, qrs: 100 },
            pro: { price: 29, qrs: 1000 }
        },
        yearly: {
            free: { price: 0, qrs: 3 },
            starter: { price: 7, qrs: 100 }, // $7/mo billed annually
            pro: { price: 23, qrs: 1000 }    // $23/mo billed annually
        }
    };

    const currentPlanData = plans[billingPeriod];

    return (
        <div class="flex-1 px-4 md:px-10 lg:px-40 py-10">
            <div className="mx-auto max-w-6xl flex flex-col gap-10">
                {/* Page Heading */}
                <div className="text-center space-y-3">
                    <h1 className="text-[#140f1a] dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">Plans & Pricing</h1>
                    <p className="text-[#6e5393] dark:text-[#a08cb3] text-lg font-normal max-w-2xl mx-auto">Upgrade your QR capabilities with our flexible plans. Choose the perfect plan for your needs.</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center">
                    <div className="inline-flex h-12 items-center rounded-full bg-[#ece8f2] dark:bg-[#2f2b3a] p-1.5 shadow-inner">
                        <label className={`group flex cursor-pointer items-center justify-center rounded-full px-6 py-2 transition-all ${billingPeriod === 'monthly' ? 'bg-white dark:bg-[#4a3b5c] shadow-sm' : ''}`}>
                            <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-[#140f1a] dark:text-white' : 'text-[#6e5393] dark:text-[#a08cb3]'}`}>Monthly</span>
                            <input
                                checked={billingPeriod === 'monthly'}
                                className="sr-only"
                                name="billing_period"
                                type="radio"
                                value="monthly"
                                onChange={() => setBillingPeriod('monthly')}
                            />
                        </label>
                        <label className={`group flex cursor-pointer items-center justify-center rounded-full px-6 py-2 transition-all ${billingPeriod === 'yearly' ? 'bg-white dark:bg-[#4a3b5c] shadow-sm' : ''}`}>
                            <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'yearly' ? 'text-[#140f1a] dark:text-white' : 'text-[#6e5393] dark:text-[#a08cb3]'}`}>Yearly</span>
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary dark:text-[#bca4e6]">Save 20%</span>
                            <input
                                checked={billingPeriod === 'yearly'}
                                className="sr-only"
                                name="billing_period"
                                type="radio"
                                value="yearly"
                                onChange={() => setBillingPeriod('yearly')}
                            />
                        </label>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {/* Free Card */}
                    <div className="relative flex flex-col rounded-2xl border border-[#dad1e5] dark:border-[#2f2b3a] bg-surface-light dark:bg-surface-dark p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[#140f1a] dark:text-white mb-2">Free</h3>
                            <p className="text-[#6e5393] dark:text-[#a08cb3] text-sm mb-4">Forever free for individuals.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-[#140f1a] dark:text-white tracking-tight">$0</span>
                                <span className="text-base font-medium text-[#6e5393] dark:text-[#a08cb3]">/mo</span>
                            </div>
                        </div>
                        <button
                            className={`w-full rounded-xl py-3 text-sm font-bold mb-8 transition-colors ${currentPlan === 'free' ? 'bg-[#ece8f2] dark:bg-[#2f2b3a] text-[#6e5393] dark:text-[#a08cb3] cursor-not-allowed opacity-70' : 'bg-transparent border-2 border-[#dad1e5] dark:border-[#2f2b3a] text-[#6e5393] dark:text-[#a08cb3] hover:bg-[#ece8f2] dark:hover:bg-[#2f2b3a]'}`}
                            disabled={currentPlan === 'free'}
                        >
                            {currentPlan === 'free' ? 'Current Plan' : 'Select Free'}
                        </button>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                3 Dynamic QRs
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                1,000 Scans / Month
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                10 Link Updates
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                7-Day Analytics History
                            </li>
                        </ul>
                    </div>

                    {/* Starter Card */}
                    <div className="relative flex flex-col rounded-2xl border border-[#dad1e5] dark:border-[#2f2b3a] bg-surface-light dark:bg-surface-dark p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[#140f1a] dark:text-white mb-2">Starter</h3>
                            <p className="text-[#6e5393] dark:text-[#a08cb3] text-sm mb-4">Great for hobbyists & side projects.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-[#140f1a] dark:text-white tracking-tight">${currentPlanData.starter.price}</span>
                                <span className="text-base font-medium text-[#6e5393] dark:text-[#a08cb3]">/mo</span>
                            </div>
                            {billingPeriod === 'yearly' && (
                                <p className="text-[10px] text-[#6e5393] dark:text-[#a08cb3] mt-1 font-medium">Billed annually (${currentPlanData.starter.price * 12}/yr)</p>
                            )}
                        </div>
                        <button
                            className={`w-full rounded-xl border-2 mb-8 py-3 text-sm font-bold transition-colors ${currentPlan === 'starter' ? 'bg-[#ece8f2] border-[#ece8f2] dark:bg-[#2f2b3a] dark:border-[#2f2b3a] text-[#6e5393] dark:text-[#a08cb3] cursor-not-allowed opacity-70' : 'border-primary bg-transparent text-primary hover:bg-primary/5 dark:hover:bg-primary/10'}`}
                            disabled={currentPlan === 'starter'}
                        >
                            {currentPlan === 'starter' ? 'Current Plan' : 'Upgrade to Starter'}
                        </button>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                100 Dynamic QRs
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                100,000 Scans / Month
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                500 Link Updates
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                90-Day Analytics History
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                Scheduled Redirects
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                SVG & PDF Downloads
                            </li>
                        </ul>
                    </div>

                    {/* Pro Card (Most Popular) */}
                    <div className="relative flex flex-col rounded-2xl border-2 border-[#6D28D9] bg-surface-light dark:bg-surface-dark p-8 shadow-xl transform scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6D28D9] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[#140f1a] dark:text-white mb-2">Pro</h3>
                            <p className="text-[#6e5393] dark:text-[#a08cb3] text-sm mb-4">For power users and businesses.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-[#140f1a] dark:text-white tracking-tight">${currentPlanData.pro.price}</span>
                                <span className="text-base font-medium text-[#6e5393] dark:text-[#a08cb3]">/mo</span>
                            </div>
                            {billingPeriod === 'yearly' && (
                                <p className="text-[10px] text-[#6e5393] dark:text-[#a08cb3] mt-1 font-medium">Billed annually (${currentPlanData.pro.price * 12}/yr)</p>
                            )}
                        </div>
                        <button
                            className={`w-full rounded-xl py-3 text-sm font-bold mb-8 transition-all shadow-md hover:shadow-lg ${currentPlan === 'pro' ? 'bg-[#ece8f2] dark:bg-[#2f2b3a] text-[#6e5393] dark:text-[#a08cb3] cursor-not-allowed opacity-70 shadow-none hover:shadow-none' : 'bg-primary hover:bg-primary-dark text-white'}`}
                            disabled={currentPlan === 'pro'}
                        >
                            {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                        </button>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                1,000 Dynamic QRs
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                Unlimited Scans & Updates
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                Unlimited Analytics History
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                Branded QR Codes
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                A/B Testing
                            </li>
                            <li className="flex items-start gap-3 text-sm text-[#140f1a] dark:text-white font-medium">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                                Campaign Management
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
                    {/* Current Plan Details */}
                    <div className="lg:col-span-2 rounded-2xl border border-[#dad1e5] dark:border-[#2f2b3a] bg-surface-light dark:bg-surface-dark p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ece8f2] dark:border-[#2f2b3a]">
                            <div>
                                <h3 className="text-lg font-bold text-[#140f1a] dark:text-white">Current Plan</h3>
                                <p className="text-sm text-[#6e5393] dark:text-[#a08cb3]">Your subscription is currently active.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-[#ece8f2] dark:bg-[#2f2b3a] rounded-lg px-4 py-2">
                                <span className={`size-2 rounded-full ${currentPlan === 'free' ? 'bg-green-500' : 'bg-primary'}`}></span>
                                <span className="text-sm font-bold text-[#140f1a] dark:text-white capitalize">{currentPlan} Plan</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs uppercase tracking-wider font-bold text-[#6e5393] dark:text-[#a08cb3] mb-3">Usage Limits</h4>
                                <div className="space-y-6">
                                    {/* Dynamic QRs */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">Dynamic QRs</span>
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">
                                                {qrCount} / {QR_LIMIT}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-[#ece8f2] dark:bg-[#2f2b3a] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${qrCount >= QR_LIMIT ? 'bg-red-500' : 'bg-primary'}`}
                                                style={{ width: `${Math.min((qrCount / QR_LIMIT) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        {qrCount >= QR_LIMIT && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Limit reached! Upgrade to create more QRs.</p>
                                        )}
                                    </div>

                                    {/* Total Scans */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">Total Scans</span>
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">
                                                {planInfo?.scan_count || 0} / {planInfo?.scan_limit || 'Unlimited'}
                                            </span>
                                        </div>
                                        {planInfo?.scan_limit ? (
                                            <div className="h-2 w-full bg-[#ece8f2] dark:bg-[#2f2b3a] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${planInfo.scan_count >= planInfo.scan_limit ? 'bg-red-500' : 'bg-primary'}`}
                                                    style={{ width: `${Math.min((planInfo.scan_count / planInfo.scan_limit) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        ) : (
                                            <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        )}
                                        {planInfo?.scan_limit && planInfo.scan_count >= planInfo.scan_limit && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Scan limit reached! Please upgrade.</p>
                                        )}
                                    </div>

                                    {/* Link Updates */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">Link Updates</span>
                                            <span className="text-sm font-medium text-[#140f1a] dark:text-white">
                                                {planInfo?.link_update_count || 0} / {planInfo?.link_update_limit || 'Unlimited'}
                                            </span>
                                        </div>
                                        {planInfo?.link_update_limit ? (
                                            <div className="h-2 w-full bg-[#ece8f2] dark:bg-[#2f2b3a] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${planInfo.link_update_count >= planInfo.link_update_limit ? 'bg-red-500' : 'bg-primary'}`}
                                                    style={{ width: `${Math.min((planInfo.link_update_count / planInfo.link_update_limit) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        ) : (
                                            <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        )}
                                        {planInfo?.link_update_limit && planInfo.link_update_count >= planInfo.link_update_limit && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Upgrade needed for more link changes.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#6e5393] dark:text-[#a08cb3] mb-1">Next Billing Date</h4>
                                    <p className="text-sm font-medium text-[#140f1a] dark:text-white">
                                        {currentPlan === 'free' ? 'N/A (Free Tier)' : 'Active (Auto-renew)'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#6e5393] dark:text-[#a08cb3] mb-1">Billing Contact</h4>
                                    <p className="text-sm font-medium text-[#140f1a] dark:text-white">{userEmail || 'Loading...'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="rounded-2xl border border-[#dad1e5] dark:border-[#2f2b3a] bg-surface-light dark:bg-surface-dark p-6 md:p-8 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#140f1a] dark:text-white">Payment Method</h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-[#dad1e5] dark:border-[#2f2b3a] rounded-xl bg-[#faf8fb] dark:bg-[#1f1a26]">
                            <span className="material-symbols-outlined text-[#6e5393] dark:text-[#a08cb3] text-4xl mb-2">credit_card</span>
                            <p className="text-sm text-[#6e5393] dark:text-[#a08cb3] mb-4">No payment method added</p>
                            <button className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
