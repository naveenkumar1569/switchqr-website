
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchGlobalStats } from '../utils/analyticsService';
import { Link } from 'react-router-dom';

const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode === 'Unknown') return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};

// Locked Feature Overlay Component
const LockedFeature = ({ title, description }) => (
    <div className="absolute inset-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 border border-slate-200 dark:border-slate-700">
        <div className="text-center px-6 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">lock</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
            <Link
                to="/billing"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            >
                <span>Upgrade Pro</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
        </div>
    </div>
);

const GlobalAnalytics = () => {
    const { token, planInfo } = useAuth();
    const [data, setData] = useState({
        totalScans: 0,
        uniqueScans: 0,
        topQr: 'N/A',
        recentScans: [],
        deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
        scansOverTime: [],
        locationStats: [],
        hourlyStats: [],
        hourlyHeatmap: {}
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ type: 'days', value: 30, label: 'Last 30 Days' });
    const [showRangeMenu, setShowRangeMenu] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [graphWidth, setGraphWidth] = useState(800);
    const containerRef = useRef(null);

    // Measure container width for sharp graph rendering
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setGraphWidth(containerRef.current.clientWidth);
            }
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            const stats = await fetchGlobalStats(token, dateRange, customStartDate, customEndDate);
            if (stats) {
                setData(stats);
            }
            setLoading(false);
        };
        loadStats();
    }, [token, dateRange, customStartDate, customEndDate]);

    const handleExport = () => {
        if (!data.recentScans.length) return;
        const headers = ['Date', 'Time', 'QR Name', 'Browser/Device', 'City', 'Country', 'IP Address'];
        const formatCSVRow = (arr) => arr.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        const rows = data.recentScans.map(scan => {
            const dateObj = new Date(scan.timestamp);
            return formatCSVRow([
                dateObj.toLocaleDateString(),
                dateObj.toLocaleTimeString(),
                scan.qr_name,
                scan.user_agent,
                scan.city || 'Unknown',
                scan.country || 'Unknown',
                scan.ip_address
            ]);
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `switchqr_scans_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check if user has access to Analytics tab
    const effectivePlan = planInfo?.effectivePlan || planInfo?.plan || 'free';
    const hasAnalyticsAccess = effectivePlan !== 'free';
    const isProUser = effectivePlan === 'pro';
    const isStarterUser = effectivePlan === 'starter';

    // Block Free users from accessing Analytics entirely - show blurred preview
    if (!hasAnalyticsAccess) {
        return (
            <div className="max-w-7xl w-full mx-auto space-y-8 relative">
                {/* Blurred Content Preview */}
                <div className="blur-sm pointer-events-none select-none">
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Track your QR performance and audience engagement across all campaigns.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    </header>

                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft border border-slate-100/50 dark:border-slate-800">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg mb-4"></div>
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-8 border border-slate-100/50 dark:border-slate-800">
                        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
                        <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-8 border border-slate-100/50 dark:border-slate-800">
                                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(j => (
                                        <div key={j} className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Centered Lock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg border border-slate-200 dark:border-slate-700 pointer-events-auto">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                                <span className="material-symbols-outlined text-primary text-4xl">lock</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Analytics Locked</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">
                                Upgrade to Starter or Pro to unlock detailed analytics, track your QR performance, and understand your audience.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/billing"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md group"
                                >
                                    <span>Upgrade Now</span>
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                                <Link
                                    to="/"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                                >
                                    <span>Back to Dashboard</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading Skeleton
    if (loading) return (
        <div className="max-w-7xl w-full mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-5 w-72 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft border border-slate-100/50 dark:border-slate-800 animate-pulse">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-8 border border-slate-100/50 dark:border-slate-800 animate-pulse">
                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
                <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-8 border border-slate-100/50 dark:border-slate-800 animate-pulse">
                        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Chart calculations
    const maxScans = Math.max(...data.scansOverTime.map(d => d.count), 10);
    const chartHeight = 300;
    const points = data.scansOverTime.map((d, i) => {
        const x = (i / (data.scansOverTime.length - 1 || 1)) * graphWidth;
        const y = chartHeight - ((d.count / maxScans) * (chartHeight - 50));
        return { x, y };
    });

    const pathD = points.length > 1
        ? points.reduce((acc, point, i, arr) => {
            if (i === 0) return `M ${point.x} ${point.y}`;
            const prev = arr[i - 1];
            const cp1x = prev.x + (point.x - prev.x) / 2;
            const cp2x = prev.x + (point.x - prev.x) / 2;
            return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
        }, "")
        : `M 0 ${chartHeight} L ${graphWidth} ${chartHeight}`;

    // Unique Visitor %
    const visitorPercent = data.totalScans > 0 ? Math.round((data.uniqueVisitors / data.totalScans) * 100) : 0;

    // Y-axis labels for chart
    const yAxisLabels = [0, 1, 2, 3, 4].map(i => Math.round(maxScans * (1 - i / 4)));

    // Format hour helper
    const formatHour = (hour) => {
        if (hour === 0) return '12 AM';
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return '12 PM';
        return `${hour - 12} PM`;
    };

    // Heatmap helpers
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    let heatmapMax = 0;
    if (data.hourlyHeatmap) {
        Object.values(data.hourlyHeatmap).forEach(dayData => {
            if (Array.isArray(dayData)) {
                dayData.forEach(count => { if (count > heatmapMax) heatmapMax = count; });
            }
        });
    }

    const getHeatmapOpacity = (value) => {
        if (!value || heatmapMax === 0) return 'bg-primary/5';
        const intensity = value / heatmapMax;
        if (intensity >= 0.9) return 'bg-primary shadow-glow';
        if (intensity >= 0.8) return 'bg-primary/90';
        if (intensity >= 0.7) return 'bg-primary/80';
        if (intensity >= 0.6) return 'bg-primary/70';
        if (intensity >= 0.5) return 'bg-primary/60';
        if (intensity >= 0.4) return 'bg-primary/50';
        if (intensity >= 0.3) return 'bg-primary/40';
        if (intensity >= 0.2) return 'bg-primary/30';
        if (intensity >= 0.1) return 'bg-primary/20';
        return 'bg-primary/10';
    };

    return (
        <div className="max-w-7xl w-full mx-auto space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Track your QR performance and audience engagement across all campaigns.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Picker */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary transition-colors px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300"
                            onClick={() => setShowRangeMenu(!showRangeMenu)}
                        >
                            <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary">calendar_today</span>
                            <span>{dateRange.label}</span>
                            <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
                        </button>
                        {showRangeMenu && (
                            <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 py-1">
                                {[
                                    { type: 'days', value: 7, label: 'Last 7 Days' },
                                    { type: 'days', value: 30, label: 'Last 30 Days' },
                                ].map(opt => (
                                    <button key={opt.label} onClick={() => { setDateRange(opt); setShowRangeMenu(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >{opt.label}</button>
                                ))}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                {[
                                    { type: 'current_month', label: 'Current Month' },
                                    { type: 'last_month', label: 'Last Month' },
                                ].map(opt => (
                                    <button key={opt.label} onClick={() => { setDateRange(opt); setShowRangeMenu(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >{opt.label}</button>
                                ))}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                {[
                                    { type: 'this_year', label: 'This Year' },
                                    { type: 'last_year', label: 'Last Year' },
                                ].map(opt => (
                                    <button key={opt.label} onClick={() => { setDateRange(opt); setShowRangeMenu(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >{opt.label}</button>
                                ))}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <button onClick={() => { setShowCustomRange(true); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >Custom Range...</button>
                            </div>
                        )}
                    </div>
                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium group ${planInfo?.features?.csv_export
                            ? 'bg-primary/5 hover:bg-primary/10 text-primary dark:bg-primary/10 dark:hover:bg-primary/20'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!planInfo?.features?.csv_export}
                    >
                        <span className="material-symbols-outlined text-lg group-hover:translate-y-0.5 transition-transform">download</span>
                        Export
                    </button>
                </div>
            </header>

            {/* Custom Range Modal */}
            {showCustomRange && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowCustomRange(false)}>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Date Range</h3>
                            <button onClick={() => setShowCustomRange(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Start Date</label>
                                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">End Date</label>
                                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowCustomRange(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={() => {
                                    if (customStartDate && customEndDate) {
                                        setDateRange({ type: 'custom', label: `${customStartDate} to ${customEndDate}` });
                                        setShowCustomRange(false);
                                    }
                                }}
                                    disabled={!customStartDate || !customEndDate}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Scans */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow border border-slate-100/50 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
                        </div>
                    </div>
                    <div className="mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">Total Scans</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{data.totalScans.toLocaleString()}</div>
                    <svg className="w-full h-12 sparkline" viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="sparkGrad1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6b26d9" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#6b26d9" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {data.scansOverTime.length > 1 && (() => {
                            const sparkMax = Math.max(...data.scansOverTime.map(d => d.count), 1);
                            const sparkPoints = data.scansOverTime.map((d, i) => {
                                const x = (i / (data.scansOverTime.length - 1)) * 120;
                                const y = 38 - ((d.count / sparkMax) * 36);
                                return `${x},${y}`;
                            }).join(' L ');
                            const lastPoint = data.scansOverTime[data.scansOverTime.length - 1];
                            return (
                                <>
                                    <path d={`M ${sparkPoints}`} stroke="#6b26d9" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                    <path d={`M ${sparkPoints} V 40 H 0 Z`} fill="url(#sparkGrad1)" style={{ opacity: 0.5 }} />
                                </>
                            );
                        })()}
                    </svg>
                </div>

                {/* Unique Visitors */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow border border-slate-100/50 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">person_outline</span>
                        </div>
                    </div>
                    <div className="mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">Unique Visitors</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{data.uniqueVisitors.toLocaleString()}</div>
                    <svg className="w-full h-12 sparkline" viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
                        {data.scansOverTime.length > 1 && (() => {
                            const sparkMax = Math.max(...data.scansOverTime.map(d => d.count), 1);
                            const sparkPoints = data.scansOverTime.map((d, i) => {
                                const x = (i / (data.scansOverTime.length - 1)) * 120;
                                const y = 38 - ((d.count / sparkMax) * 36) + (Math.sin(i * 0.5) * 3);
                                return `${x},${y}`;
                            }).join(' L ');
                            return <path d={`M ${sparkPoints}`} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
                        })()}
                    </svg>
                </div>

                {/* Unique Visitor % */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow border border-slate-100/50 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">touch_app</span>
                        </div>
                    </div>
                    <div className="mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">Unique Visitor %</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{visitorPercent}%</div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${visitorPercent}%` }}></div>
                    </div>
                </div>

                {/* Top Performer */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow border border-slate-100/50 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-xl">star</span>
                        </div>
                    </div>
                    <div>
                        <div className="mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">Top Performer</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
                            {typeof data.topQr === 'object' ? data.topQr?.name : (data.topQr || 'N/A')}
                        </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-primary w-3/4 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Scans Over Time Chart */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-6 md:p-8 border border-slate-100/50 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scans Over Time</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Daily scan volume trends for {dateRange.label.toLowerCase()}</p>
                    </div>
                </div>
                <div className="flex gap-4 h-[300px]">
                    {/* Y Axis Labels */}
                    <div className="w-10 flex flex-col justify-between text-xs text-slate-400 dark:text-slate-500 font-medium py-2 text-right">
                        {yAxisLabels.map((label, i) => (
                            <span key={i}>{label.toLocaleString()}</span>
                        ))}
                    </div>

                    <div className="flex-1 relative grid-bg rounded-lg border border-slate-50 dark:border-slate-800 group" ref={containerRef}>

                        {/* Hover Tooltip */}
                        {hoveredPoint !== null && data.scansOverTime[hoveredPoint] && (
                            <div
                                className="absolute z-30 pointer-events-none transition-all duration-200 ease-out"
                                style={{
                                    left: `${(hoveredPoint / (data.scansOverTime.length - 1 || 1)) * 100}%`,
                                    top: '-12px',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg flex flex-col items-center">
                                    <span className="font-bold">{data.scansOverTime[hoveredPoint].count.toLocaleString()} Scans</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">{data.scansOverTime[hoveredPoint].date}</span>
                                    <div className="w-2 h-2 bg-slate-900 dark:bg-white rotate-45 absolute -bottom-1"></div>
                                </div>
                            </div>
                        )}

                        {/* Vertical Guide Line */}
                        {hoveredPoint !== null && (
                            <div
                                className="absolute top-0 bottom-0 w-[1px] bg-primary/30 border-l border-dashed border-primary/50 pointer-events-none transition-all duration-200 z-10"
                                style={{ left: `${(hoveredPoint / (data.scansOverTime.length - 1 || 1)) * 100}%` }}
                            />
                        )}

                        {/* Chart SVG — Line and Area ONLY. preserveAspectRatio="none" stretches to fill container. */}
                        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${graphWidth} ${chartHeight}`} preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6b26d9" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#6b26d9" stopOpacity="0" />
                                </linearGradient>
                                <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6b26d9" floodOpacity="0.2" />
                                </filter>
                            </defs>

                            {/* Area fill */}
                            {data.scansOverTime.length > 1 && (
                                <path d={`${pathD} V ${chartHeight} H 0 Z`} fill="url(#chartGradient)" />
                            )}

                            {/* Line */}
                            <path d={pathD} fill="none" stroke="#6b26d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke" filter="url(#lineShadow)" />
                        </svg>

                        {/* Dots — HTML divs, always perfect circles, percentage-positioned */}
                        {data.scansOverTime.map((d, i) => {
                            const leftPct = (i / (data.scansOverTime.length - 1 || 1)) * 100;
                            const topPct = (1 - (d.count / maxScans) * ((chartHeight - 50) / chartHeight)) * 100;
                            const isHovered = hoveredPoint === i;
                            return (
                                <div
                                    key={`dot-${i}`}
                                    className={`absolute rounded-full border-2 border-[#6b26d9] bg-white dark:bg-surface-dark pointer-events-none z-20 transition-all duration-200 ${isHovered ? 'w-[10px] h-[10px] shadow-md' : 'w-[8px] h-[8px]'}`}
                                    style={{
                                        left: `${leftPct}%`,
                                        top: `${topPct}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                            );
                        })}

                        {/* Interactive hover zones — HTML divs, pixel-perfect mouse alignment */}
                        {data.scansOverTime.map((d, i) => {
                            const leftPct = (i / (data.scansOverTime.length - 1 || 1)) * 100;
                            const widthPct = 100 / (data.scansOverTime.length || 1);
                            return (
                                <div
                                    key={`hover-${i}`}
                                    className="absolute top-0 bottom-0 cursor-pointer z-10"
                                    style={{
                                        left: `${leftPct - widthPct / 2}%`,
                                        width: `${widthPct}%`
                                    }}
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* X Axis Labels */}
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium mt-4 px-2">
                    {data.scansOverTime.filter((_, i) => {
                        const total = data.scansOverTime.length;
                        let interval = 1;
                        if (total > 14) interval = 2;
                        if (total > 21) interval = 3;
                        if (total > 30) interval = 5;
                        if (total > 60) interval = 10;
                        return i === 0 || i === total - 1 || i % interval === 0;
                    }).map((d, i) => {
                        const dateObj = new Date(d.date + 'T00:00:00');
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                        return <span key={i}>{day} {month}</span>;
                    })}
                </div>
            </div>

            {/* Peak Scanning Times Heatmap */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-6 md:p-8 border border-slate-100/50 dark:border-slate-800 relative">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Peak Scanning Times</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Heatmap of activity by hour and day ({dateRange.label})</p>
                </div>

                {data.hourlyHeatmap && Object.keys(data.hourlyHeatmap).length > 0 ? (
                    <div className="overflow-x-auto pb-2 px-1">
                        <div className="min-w-[700px]">
                            {/* Header Hours */}
                            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '50px repeat(24, 1fr)' }}>
                                <div></div>
                                {hours.map(h => (
                                    h % 3 === 0 ? (
                                        <div key={h} className="text-[10px] text-slate-400 dark:text-slate-500 text-center col-span-3">
                                            {formatHour(h).replace(' ', '')}
                                        </div>
                                    ) : null
                                ))}
                            </div>

                            {/* Days Rows */}
                            <div className="space-y-1.5">
                                {daysOrder.map(day => (
                                    <div key={day} className="grid gap-1 items-center" style={{ gridTemplateColumns: '50px repeat(24, 1fr)' }}>
                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{day}</div>
                                        {hours.map(hour => {
                                            const count = data.hourlyHeatmap[day]?.[hour] || 0;
                                            return (
                                                <div
                                                    key={hour}
                                                    className={`h-8 rounded ${getHeatmapOpacity(count)} transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:z-10 dark:hover:ring-offset-surface-dark cursor-pointer relative group`}
                                                    title={`${day} ${formatHour(hour)}: ${count} scans`}
                                                >
                                                    {/* Tooltip */}
                                                    <div className={`absolute ${day === 'Mon' ? 'top-full mt-2' : 'bottom-full mb-2'} 
                                                        ${hour > 20 ? 'right-0 -translate-x-0' : hour < 4 ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2'} 
                                                        px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg`}>
                                                        <span className="font-bold">{count} scans</span>
                                                        <br />
                                                        <span className="text-slate-400 dark:text-slate-500 text-[10px]">{day} {formatHour(hour)}</span>
                                                        <div className={`w-2 h-2 bg-slate-900 dark:bg-white rotate-45 absolute 
                                                            ${day === 'Mon' ? '-top-1' : '-bottom-1'} 
                                                            ${hour > 20 ? 'right-4 translate-x-1/2' : hour < 4 ? 'left-4 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex justify-end items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
                            <span>Low</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded bg-primary/10"></div>
                                <div className="w-3 h-3 rounded bg-primary/40"></div>
                                <div className="w-3 h-3 rounded bg-primary/70"></div>
                                <div className="w-3 h-3 rounded bg-primary"></div>
                            </div>
                            <span>High</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">grid_on</span>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No scan activity yet</p>
                    </div>
                )}
                {/* Lock overlay for Starter users */}
                {isStarterUser && (
                    <LockedFeature
                        title="Unlock Peak Scanning Times"
                        description="Gain deeper insights with city-level data, OS stats, and browser analytics."
                    />
                )}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Distribution */}
                {/* Device Distribution */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-6 md:p-8 border border-slate-100/50 dark:border-slate-800 flex flex-col justify-between relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Device Distribution ({dateRange.label})</h2>
                        <button className="text-primary hover:bg-primary/5 dark:hover:bg-primary/20 p-1 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-xl">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Mobile (iOS)', icon: 'phone_iphone', value: data.deviceStats?.iOS || 0 },
                            { name: 'Mobile (Android)', icon: 'android', value: data.deviceStats?.Android || 0 },
                            { name: 'Desktop (Web)', icon: 'desktop_windows', value: data.deviceStats?.Desktop || 0 },
                        ].map((device, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base">{device.icon}</span>
                                        {device.name}
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">{device.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${i === 1 ? 'bg-primary/70' : i === 2 ? 'bg-primary/40' : 'bg-primary'} rounded-full`}
                                        style={{ width: `${device.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Dominant OS</div>
                                <div className="text-lg font-bold text-slate-800 dark:text-white">{data.dominantOS || 'N/A'}</div>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Avg Screen</div>
                                <div className="text-lg font-bold text-slate-800 dark:text-white">Unknown</div>
                            </div>
                        </div>
                    </div>
                    {/* Lock overlay for Starter users */}
                    {isStarterUser && (
                        <LockedFeature
                            title="Unlock Device Distribution"
                            description="Gain deeper insights with city-level data, OS stats, and browser analytics."
                        />
                    )}
                </div>

                {/* Top Locations */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-6 md:p-8 border border-slate-100/50 dark:border-slate-800 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Locations ({dateRange.label})</h2>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {data.locationStats && data.locationStats.length > 0 ? (
                            (() => {
                                const top = data.locationStats.slice(0, 4);
                                return top.map((loc, i) => (
                                    <div key={i} className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors -mx-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 relative flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-xl">
                                                {getFlagEmoji(loc.country)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {loc.city !== 'Unknown' ? loc.city : loc.countryName}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {loc.countryName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{loc.count.toLocaleString()}</div>
                                            <div className={`text-xs ${loc.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-medium flex items-center justify-end gap-0.5`}>
                                                <span className="material-symbols-outlined text-[10px]">{loc.trend >= 0 ? 'arrow_upward' : 'arrow_downward'}</span> {Math.abs(loc.trend)}%
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()
                        ) : (
                            <div className="text-center py-10 flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">location_on</span>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No scan locations detected yet</p>
                            </div>
                        )}
                    </div>

                    {data.regionStats && data.regionStats.length > 0 && (
                        <div className="mt-6">
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                {data.regionStats.slice(0, 4).map((reg, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-primary/70' : idx === 2 ? 'bg-primary/40' : 'bg-primary/20'}`}
                                        style={{ width: `${reg.percentage}%` }}
                                        title={`${reg.name}: ${reg.count} scans (${reg.percentage}%)`}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">
                                {data.regionStats.slice(0, 4).map((reg, idx) => (
                                    <span key={idx}>{reg.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Lock overlay for Starter users */}
                    {isStarterUser && (
                        <LockedFeature
                            title="Unlock Top Locations"
                            description="Gain deeper insights with city-level data, OS stats, and browser analytics."
                        />
                    )}
                </div>
            </div>

            {/* Upsell Card */}
            {
                !planInfo?.features?.advanced_analytics && (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden border border-slate-100/50 dark:border-slate-800">
                        <div className="h-32 w-full bg-gradient-to-br from-primary to-indigo-600 relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Unlock attribution</p>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Gain deeper insights with city-level data, OS stats, and browser analytics.
                            </p>
                            <button
                                onClick={() => window.location.href = '/billing'}
                                className="w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex gap-2 group"
                            >
                                <span>Upgrade Pro</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GlobalAnalytics;
