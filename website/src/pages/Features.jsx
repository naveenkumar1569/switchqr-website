import React from 'react';

import { Link } from 'react-router-dom';

const CLIENT_APP_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

const Features = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main mb-6 leading-tight md:leading-tight">
                        Everything you need to <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">manage offline campaigns.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Powerful tools to track, edit, and optimize your QR codes in real-time. Stop re-printing, start optimizing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href={`${CLIENT_APP_URL}/register`} className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                            Get Started Free
                        </a>
                        <Link to="/pricing" className="px-8 py-4 bg-white hover:bg-gray-50 text-text-main font-bold rounded-xl border-2 border-gray-200 hover:border-primary/30 transition-all">
                            View Demo
                        </Link>
                    </div>

                    {/* Product Mockup */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="relative w-full aspect-[16/9] max-w-[900px] mx-auto">
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-mockup border border-[#f0ebf7] overflow-hidden flex flex-col">
                                <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white">
                                    <div className="flex gap-2">
                                        <div className="size-3 rounded-full bg-red-400/20 border border-red-400/30"></div>
                                        <div className="size-3 rounded-full bg-amber-400/20 border border-amber-400/30"></div>
                                        <div className="size-3 rounded-full bg-green-400/20 border border-green-400/30"></div>
                                    </div>
                                    <div className="w-24 h-2 bg-gray-100 rounded-full"></div>
                                </div>
                                <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Row 1 */}
                                    {/* Dynamic QR Card */}
                                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">qr_code_2</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">Dynamic QR</p>
                                                <p className="text-[9px] text-text-muted">Edit anytime</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="h-1.5 bg-primary/20 rounded-full w-full"></div>
                                            <div className="h-1.5 bg-primary/20 rounded-full w-3/4"></div>
                                        </div>
                                    </div>

                                    {/* Analytics Card */}
                                    <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-green-600 text-lg">monitoring</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">Analytics</p>
                                                <p className="text-[9px] text-text-muted">Real-time data</p>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between h-12 gap-1">
                                            <div className="flex-1 mockup-gradient-bar opacity-30 rounded-t h-[40%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-50 rounded-t h-[60%]"></div>
                                            <div className="flex-1 mockup-gradient-bar opacity-70 rounded-t h-[80%]"></div>
                                            <div className="flex-1 mockup-gradient-bar rounded-t h-[100%]"></div>
                                        </div>
                                    </div>

                                    {/* A/B Testing Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-blue-600 text-lg">science</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">A/B Testing</p>
                                                <p className="text-[9px] text-text-muted">Optimize results</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 bg-blue-400 rounded-full flex-1"></div>
                                                <span className="text-[9px] font-bold text-blue-600">52%</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 bg-gray-200 rounded-full flex-1"></div>
                                                <span className="text-[9px] font-bold text-gray-400">48%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    {/* Scheduled Redirects Card */}
                                    <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-orange-600 text-lg">schedule</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">Scheduling</p>
                                                <p className="text-[9px] text-text-muted">Auto-redirect</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="size-1.5 rounded-full bg-orange-500"></div>
                                            <div className="h-1.5 bg-orange-100 rounded-full flex-1"></div>
                                            <span className="text-[9px] font-bold text-orange-600">3 active</span>
                                        </div>
                                    </div>

                                    {/* Campaign Management Card */}
                                    <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-xl border border-pink-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-pink-600 text-lg">campaign</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">Campaigns</p>
                                                <p className="text-[9px] text-text-muted">Organize QRs</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="size-6 rounded bg-pink-200/50 border border-pink-300/50"></div>
                                            <div className="size-6 rounded bg-pink-200/50 border border-pink-300/50"></div>
                                            <div className="size-6 rounded bg-pink-200/50 border border-pink-300/50"></div>
                                        </div>
                                    </div>

                                    {/* Custom Branding Card */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-indigo-600 text-lg">palette</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-text-main">Branding</p>
                                                <p className="text-[9px] text-text-muted">Custom design</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="size-4 rounded-full bg-indigo-500"></div>
                                            <div className="size-4 rounded-full bg-purple-500"></div>
                                            <div className="size-4 rounded-full bg-pink-500"></div>
                                            <div className="size-4 rounded-full bg-orange-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic QR Codes Section */}
            <section className="py-20 md:py-32 relative bg-background-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wider">
                                Core Feature
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                                Dynamic QR Codes
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                Create QR codes that you can edit anytime. Change the destination URL without reprinting a single code.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Instant Updates</h4>
                                        <p className="text-text-muted">Change your destination URL in seconds from anywhere</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">No Reprinting</h4>
                                        <p className="text-text-muted">Save thousands on printing costs by updating digitally</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">check_circle</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Unlimited Scans</h4>
                                        <p className="text-text-muted">No limits on how many people can scan your codes</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-main mb-1">QR Code Editor</h3>
                                        <p className="text-xs text-text-muted">Update destination instantly</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-3xl">qr_code_2</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Current Destination</label>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-sm text-primary font-mono">https://example.com/summer-sale</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                        <span className="material-symbols-outlined text-gray-400">arrow_downward</span>
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">New Destination</label>
                                        <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary/30">
                                            <p className="text-sm text-primary font-mono">https://example.com/fall-promo</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors">
                                        Update QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scan Analytics Section */}
            <section className="py-20 md:py-32 bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 w-full">
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-main mb-1">Scan Analytics</h3>
                                        <p className="text-xs text-text-muted">Last 7 days</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-3xl">monitoring</span>
                                </div>
                                <div className="flex items-end justify-between h-48 gap-3 mb-6">
                                    <div className="flex-1 bg-primary/20 rounded-t-lg h-[40%]"></div>
                                    <div className="flex-1 bg-primary/40 rounded-t-lg h-[60%]"></div>
                                    <div className="flex-1 bg-primary/60 rounded-t-lg h-[80%]"></div>
                                    <div className="flex-1 bg-primary rounded-t-lg h-[100%]"></div>
                                    <div className="flex-1 bg-primary/70 rounded-t-lg h-[75%]"></div>
                                    <div className="flex-1 bg-primary/50 rounded-t-lg h-[55%]"></div>
                                    <div className="flex-1 bg-primary/30 rounded-t-lg h-[35%]"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-text-muted mb-1">Total Scans</p>
                                        <p className="text-2xl font-bold text-text-main">2,847</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-text-muted mb-1">Unique Users</p>
                                        <p className="text-2xl font-bold text-text-main">1,923</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-text-muted mb-1">Conversion</p>
                                        <p className="text-2xl font-bold text-green-600">67%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full uppercase tracking-wider">
                                Analytics
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                                Real-Time Scan Tracking
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                See exactly who's scanning your QR codes, when, and from where. Make data-driven decisions with comprehensive analytics.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 text-2xl mt-0.5">analytics</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Location Data</h4>
                                        <p className="text-text-muted">City-level geographic insights</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 text-2xl mt-0.5">devices</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Device Breakdown</h4>
                                        <p className="text-text-muted">iOS, Android, and desktop tracking</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 text-2xl mt-0.5">schedule</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Time Analysis</h4>
                                        <p className="text-text-muted">Peak scanning hours and patterns</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scheduled Redirects Section */}
            <section className="py-20 md:py-32 relative bg-background-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full uppercase tracking-wider">
                                Automation
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                                Scheduled Redirects
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                Set up automatic URL changes based on time and date. Perfect for rotating promotions, event schedules, and seasonal campaigns.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl mt-0.5">event</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Date-Based Rules</h4>
                                        <p className="text-text-muted">Automatically switch URLs on specific dates</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl mt-0.5">access_time</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Time-Based Routing</h4>
                                        <p className="text-text-muted">Different destinations for different times of day</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600 text-2xl mt-0.5">repeat</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Recurring Schedules</h4>
                                        <p className="text-text-muted">Set it once, let it run automatically</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-main mb-1">Schedule Manager</h3>
                                        <p className="text-xs text-text-muted">Upcoming redirects</p>
                                    </div>
                                    <span className="material-symbols-outlined text-blue-600 text-3xl">schedule</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-blue-700 uppercase">Active Now</span>
                                            <span className="size-2 rounded-full bg-blue-600 animate-pulse"></span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Summer Sale Landing</p>
                                        <p className="text-xs text-text-muted">Until Aug 31, 11:59 PM</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Scheduled</span>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Fall Collection Preview</p>
                                        <p className="text-xs text-text-muted">Starts Sep 1, 12:00 AM</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Scheduled</span>
                                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Holiday Campaign</p>
                                        <p className="text-xs text-text-muted">Starts Dec 1, 12:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* A/B Testing Section */}
            <section className="py-20 md:py-32 bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 w-full">
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-main mb-1">A/B Test Results</h3>
                                        <p className="text-xs text-text-muted">Traffic split: 50/50</p>
                                    </div>
                                    <span className="material-symbols-outlined text-purple-600 text-3xl">science</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-purple-700 uppercase">Variant A</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Winner</span>
                                        </div>
                                        <p className="text-sm font-mono text-text-main mb-3">/landing-page-v1</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-text-muted mb-1">Conversion</p>
                                                <p className="text-xl font-bold text-green-600">24.3%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted mb-1">Scans</p>
                                                <p className="text-xl font-bold text-text-main">1,423</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Variant B</span>
                                        </div>
                                        <p className="text-sm font-mono text-text-main mb-3">/landing-page-v2</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-text-muted mb-1">Conversion</p>
                                                <p className="text-xl font-bold text-text-main">18.7%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted mb-1">Scans</p>
                                                <p className="text-xl font-bold text-text-main">1,424</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-bold rounded-full uppercase tracking-wider">
                                Optimization
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                                A/B Testing
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                Split traffic between two destinations to find out which performs better. Optimize your campaigns with data, not guesses.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-purple-600 text-2xl mt-0.5">shuffle</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Traffic Splitting</h4>
                                        <p className="text-text-muted">Distribute scans evenly or with custom ratios</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-purple-600 text-2xl mt-0.5">bar_chart</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Performance Metrics</h4>
                                        <p className="text-text-muted">Track conversion rates for each variant</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-purple-600 text-2xl mt-0.5">emoji_events</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Auto-Winner Selection</h4>
                                        <p className="text-text-muted">Automatically promote the best performer</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign Management Section */}
            <section className="py-20 md:py-32 relative bg-background-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wider">
                                    Organization
                                </span>
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">Pro Plan</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                                Campaign Management
                            </h2>
                            <p className="text-lg text-text-muted leading-relaxed">
                                Organize your QR codes into campaigns for clean, scalable management. Perfect for agencies and teams running multiple projects.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">folder_open</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Campaign Folders</h4>
                                        <p className="text-text-muted">Group QR codes by project, client, or event</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">groups</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Team Collaboration</h4>
                                        <p className="text-text-muted">Share campaigns with team members</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">insights</span>
                                    <div>
                                        <h4 className="font-bold text-text-main">Aggregate Analytics</h4>
                                        <p className="text-text-muted">View performance across entire campaigns</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-main mb-1">My Campaigns</h3>
                                        <p className="text-xs text-text-muted">4 active campaigns</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-3xl">campaign</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-purple-600 text-2xl">folder</span>
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Summer Sale</p>
                                        <p className="text-xs text-text-muted">12 QR codes</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-blue-600 text-2xl">folder</span>
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Product Launch</p>
                                        <p className="text-xs text-text-muted">8 QR codes</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-green-600 text-2xl">folder</span>
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Events 2024</p>
                                        <p className="text-xs text-text-muted">25 QR codes</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 hover:border-orange-400 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-orange-600 text-2xl">folder</span>
                                            <span className="size-2 rounded-full bg-gray-400"></span>
                                        </div>
                                        <p className="text-sm font-bold text-text-main mb-1">Packaging</p>
                                        <p className="text-xs text-text-muted">6 QR codes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl bg-primary text-white p-12 md:p-16 text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h2 className="relative text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Ready to upgrade your QR campaigns?
                        </h2>
                        <p className="relative text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Join thousands of businesses using SwitchQR to create smarter, more flexible marketing campaigns.
                        </p>
                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href={`${CLIENT_APP_URL}/register`} className="w-full sm:w-auto min-w-[160px] cursor-pointer inline-flex items-center justify-center rounded-xl h-14 px-8 bg-white text-primary text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                                Start Free Trial
                            </a>
                        </div>
                        <p className="relative text-sm text-white/60 mt-6">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Features;
