
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/api';

const GlobalAnalytics = () => {
    const { token, planInfo } = useAuth();
    const [data, setData] = useState({
        totalScans: 0,
        uniqueScans: 0,
        topQr: 'N/A',
        recentScans: [],
        deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
        scansOverTime: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(7);
    const [showRangeMenu, setShowRangeMenu] = useState(false);

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const response = await apiGet(`/api/stats?days=${dateRange}`, token);

                if (response.ok) {
                    const stats = await response.json();
                    setData(stats);
                }
            } catch (error) {
                console.error('Failed to fetch global stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalStats();
    }, [token, dateRange]);

    const handleExport = () => {
        if (!data.recentScans.length) return;

        const headers = ['Date', 'QR Name', 'Device', 'Location', 'IP'];
        const rows = data.recentScans.map(scan => [
            new Date(scan.timestamp).toLocaleString(),
            scan.qr_name,
            scan.user_agent,
            scan.location || 'Unknown',
            scan.ip_address
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `switchqr_stats_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Calculate chart points (simple normalization for demo)
    const maxScans = Math.max(...data.scansOverTime.map(d => d.count), 10);
    const chartPoints = data.scansOverTime.map((d, i) => {
        const x = (i / (data.scansOverTime.length - 1 || 1)) * 800;
        const y = 200 - ((d.count / maxScans) * 150); // Scale to fit 200px height
        return `${x} ${y}`; // Keep it simple line graph
    }).join(' L ');

    // Construct SVG Path
    const pathD = data.scansOverTime.length > 1
        ? `M ${chartPoints}`
        : 'M 0 200 L 800 200'; // Flat line if no data

    return (
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-text-dark dark:text-white text-3xl md:text-4xl font-black tracking-tight">Analytics</h2>
                    <p className="text-text-subtle dark:text-gray-400 text-base">Track your QR code performance across all campaigns.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Picker */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 h-10 px-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-dark dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setShowRangeMenu(!showRangeMenu)}
                        >
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                            <span>Last {dateRange} Days</span>
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </button>
                        {showRangeMenu && (
                            <div className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10 py-1">
                                <button onClick={() => { setDateRange(7); setShowRangeMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800">Last 7 Days</button>
                                <button onClick={() => { setDateRange(30); setShowRangeMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800">Last 30 Days</button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleExport}
                        className={`flex items-center justify-center h-10 px-4 rounded-lg text-sm font-bold transition-colors ${planInfo?.features?.csv_export
                            ? 'bg-[#ece8f2] dark:bg-primary/20 text-text-dark dark:text-white hover:bg-[#e2ddec] dark:hover:bg-primary/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!planInfo?.features?.csv_export}
                        title={!planInfo?.features?.csv_export ? 'Export requires Pro plan' : 'Export data to CSV'}
                    >
                        <span className="material-symbols-outlined text-[20px] mr-2">download</span>
                        <span>Export</span>
                        {!planInfo?.features?.csv_export && (
                            <span className="material-symbols-outlined text-amber-500 text-[16px] ml-1">lock</span>
                        )}
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-dark dark:text-white text-sm font-medium">Total Scans</p>
                        <span className="material-symbols-outlined text-text-subtle text-[20px]">qr_code_scanner</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-dark dark:text-white text-2xl font-bold leading-none">{data.totalScans}</p>
                    </div>
                </div>
                {/* Card 2 - Unique IPs */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                            <p className="text-text-dark dark:text-white text-sm font-medium">Unique IPs</p>
                            <span className="material-symbols-outlined text-text-subtle text-[16px] cursor-help" title="Count of distinct IP addresses. Note: Users on different networks count separately, and users on shared networks are counted as one.">
                                help_outline
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-text-subtle text-[20px]">person_outline</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-dark dark:text-white text-2xl font-bold leading-none">{data.uniqueScans}</p>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-dark dark:text-white text-sm font-medium">Top Performing QR</p>
                        <span className="material-symbols-outlined text-text-subtle text-[20px]">emoji_events</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-dark dark:text-white text-xl font-bold leading-none truncate">{data.topQr}</p>
                    </div>
                </div>
                {/* Card 4 - Unique Ratio */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                            <p className="text-text-dark dark:text-white text-sm font-medium">Unique Ratio</p>
                            <span className="material-symbols-outlined text-text-subtle text-[16px] cursor-help" title="Percentage of scans from unique IPs">
                                help_outline
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-text-subtle text-[20px]">trending_up</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-dark dark:text-white text-2xl font-bold leading-none">
                            {data.totalScans > 0 ? Math.round((data.uniqueScans / data.totalScans) * 100) : 0}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-text-dark dark:text-white text-lg font-bold">Scans over time</h3>
                        <p className="text-text-subtle dark:text-gray-400 text-sm">Visualizing scan frequency over the last {dateRange} days.</p>
                    </div>
                </div>
                <div className="relative w-full h-[250px]">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 250">
                        {/* Grid Lines */}
                        <line stroke="#e5e7eb" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" className="dark:stroke-gray-700"></line>
                        <line stroke="#e5e7eb" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" className="dark:stroke-gray-700"></line>

                        {/* Dynamic Path */}
                        <path d={pathD} fill="none" stroke="#7426d9" strokeLinecap="round" strokeWidth="3"></path>

                        {/* Dots for Data Points */}
                        {data.scansOverTime.map((d, i) => {
                            const x = (i / (data.scansOverTime.length - 1 || 1)) * 800;
                            const y = 200 - ((d.count / maxScans) * 150);
                            return (
                                <circle key={i} cx={x} cy={y} fill="currentColor" r="4" stroke="#7426d9" strokeWidth="2" className="text-white dark:text-[#2d2438]">
                                    <title>{d.date}: {d.count} scans</title>
                                </circle>
                            );
                        })}
                    </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs text-text-subtle dark:text-gray-400 font-medium px-2">
                    {data.scansOverTime.map((d, i) => (
                        <span key={i}>{d.date.slice(5)}</span>
                    ))}
                    {data.scansOverTime.length === 0 && <span>No data for this period</span>}
                </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Device Split Chart */}
                <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6 h-full">
                    <h3 className="text-text-dark dark:text-white text-lg font-bold mb-6">Device Split</h3>
                    <div className="flex items-center justify-center flex-1 mb-6">
                        <div className="relative size-40">
                            {/* Simple donut chart - approximate logic for visualization */}
                            <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                {/* Mobile Segment */}
                                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${data.deviceStats?.Mobile || 0}, 100`} strokeWidth="8"></path>
                                {/* Tablet */}
                                <path className="text-primary/60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${data.deviceStats?.Tablet || 0}, 100`} strokeDashoffset={`-${data.deviceStats?.Mobile || 0}`} strokeWidth="8"></path>
                                {/* Desktop */}
                                <path className="text-primary/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${data.deviceStats?.Desktop || 0}, 100`} strokeDashoffset={`-${(data.deviceStats?.Mobile || 0) + (data.deviceStats?.Tablet || 0)}`} strokeWidth="8"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold text-text-dark dark:text-white">Total</span>
                                <span className="text-sm text-text-subtle dark:text-gray-400">Devices</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary"></div>
                                <span className="text-text-dark dark:text-white font-medium">Mobile</span>
                            </div>
                            <span className="text-text-subtle dark:text-gray-400">{data.deviceStats?.Mobile}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary/60"></div>
                                <span className="text-text-dark dark:text-white font-medium">Tablet</span>
                            </div>
                            <span className="text-text-subtle dark:text-gray-400">{data.deviceStats?.Tablet}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary/30"></div>
                                <span className="text-text-dark dark:text-white font-medium">Desktop</span>
                            </div>
                            <span className="text-text-subtle dark:text-gray-400">{data.deviceStats?.Desktop}%</span>
                        </div>
                    </div>
                </div>

                {/* Top Locations */}
                <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-text-dark dark:text-white text-lg font-bold">Top Locations</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">location_on</span>
                        <p className="text-text-subtle text-sm">Location data coming soon</p>
                    </div>
                </div>

                {/* Upsell Card - Only show for Free users */}
                {planInfo?.plan === 'free' && (
                    <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden h-full">
                        {/* Image Section */}
                        <div className="h-32 w-full bg-cover bg-center relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                            <div className="w-full h-full bg-primary/20 backdrop-blur-[1px] absolute inset-0"></div>
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                                    <p className="text-text-dark dark:text-white text-lg font-bold leading-tight">Unlock advanced attribution</p>
                                </div>
                                <p className="text-text-subtle dark:text-gray-400 text-sm font-normal leading-relaxed">
                                    Gain deeper insights with city-level data, detailed operating system stats, and browser analytics.
                                </p>
                            </div>
                            <button className="w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover transition-all flex gap-2 group">
                                <span>Upgrade to Starter</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalAnalytics;
