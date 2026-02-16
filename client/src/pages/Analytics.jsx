import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchQRAnalytics } from '../utils/analyticsService';
import { calculateChartScale } from '../utils/chartHelpers';
import LockedOverlay from '../components/LockedOverlay';

// Replaced by reusable LockedOverlay component

const Analytics = () => {
    const { id } = useParams();
    const { token, planInfo } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            const data = await fetchQRAnalytics(token, id);
            if (data) {
                setStats(data);
            }
            setLoading(false);
        };

        loadAnalytics();
    }, [id, token]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!stats) return <div className="text-center p-8 text-slate-500">No data found</div>;

    const qr = stats.qr || {};
    const scans = stats.scans || [];
    const analytics = stats.stats || {};

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <span>Analytics</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics for: {qr.name}</h1>
                    <a href={qr.destination_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-md block">{qr.destination_url}</a>
                </div>
                <button className="btn-secondary self-start" onClick={() => window.print()}>
                    <span className="material-symbols-outlined mr-2">print</span>
                    Export Report
                </button>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm sm:col-span-2">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Scans</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{analytics.totalScans || scans.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Chart Widget */}
                    {(() => {
                        // Group scans by date for the chart
                        // Simple aggregation for the last 30 days or based on available data
                        const today = new Date();
                        const dailyCounts = {};

                        // Default to last 7 days if no scans, or range based on data
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date();
                            d.setDate(today.getDate() - i);
                            const key = d.toISOString().split('T')[0];
                            dailyCounts[key] = 0;
                        }

                        scans.forEach(scan => {
                            const key = new Date(scan.scanned_at).toISOString().split('T')[0];
                            if (dailyCounts[key] !== undefined) {
                                dailyCounts[key]++;
                            } else {
                                // If scan is outside default 7 days, we might want to expand range or just ignore for this simple view
                                // For this specific widget upgrade, let's stick to the visible range or basic data
                            }
                        });

                        // If we have stats.scansOverTime from backend, use that. Otherwise use manual aggregation.
                        // The previous QRDetails implementation relied on `stats.scansOverTime`.
                        // Let's check if `analytics` object has it or if we need to derive it.
                        // Assuming `scans` is the list of recent scans.

                        // To match QRDetails visuals exactly, we need an array of { date, count }.
                        // Let's use the aggregated `dailyCounts` for a simple 7-day view or similar.
                        const chartData = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));

                        // Calculate Scale
                        const maxVal = Math.max(...chartData.map(d => d.count), 0);
                        const scale = calculateChartScale(maxVal);
                        const chartMax = scale.max;

                        return (
                            <div className="flex gap-4 h-48 w-full pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                {/* Y-Axis */}
                                <div className="w-8 flex flex-col justify-between text-xs text-slate-400 dark:text-slate-500 font-medium py-1 text-right h-full">
                                    {scale.ticks.map((t, i) => (
                                        <span key={i}>{t.toLocaleString()}</span>
                                    ))}
                                </div>

                                {/* Chart */}
                                <div className="flex-1 flex items-end justify-between gap-2 relative grid-bg rounded-lg border border-slate-50 dark:border-slate-800 px-1">
                                    {chartData.map((day, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 w-full group relative z-10 h-full justify-end">
                                            <div
                                                className="w-full bg-blue-500/20 hover:bg-blue-500/50 rounded-t-sm transition-all relative group-hover:shadow-lg min-h-[4px]"
                                                style={{ height: `${(day.count / chartMax) * 100}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e1726] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl px-3 py-2 pointer-events-none transition-opacity backdrop-blur-sm whitespace-nowrap z-50">
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white text-center leading-none mb-1">
                                                        {day.count}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                                                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 truncate w-full text-center">
                                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                                            </span>
                                        </div>
                                    ))}
                                    {chartData.every(d => d.count === 0) && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                                            No scans in last 7 days
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unique Visitors</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics.uniqueVisitors || 0}</h3>
                </div>
            </section>

            {/* Recent Scans List */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden relative">
                {/* Advanced Analytics Lock Overlay */}
                {(planInfo?.effectivePlan === 'starter' || planInfo?.effectivePlan === 'free' || !planInfo?.effectivePlan) && (
                    <LockedOverlay
                        title="Unlock Advanced Analytics"
                        description="Upgrade to Pro to access full scan history and detailed audience insights."
                    />
                )}
                <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-semibold text-text-dark dark:text-white">Recent Scans</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Device Info</th>
                            </tr>
                        </thead>
                        <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                            {scans.map((scan, index) => (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(scan.scanned_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {scan.city && scan.country
                                            ? `${scan.city}, ${scan.country}`
                                            : scan.country || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {scan.ip_address}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md truncate" title={scan.user_agent}>
                                        {scan.user_agent}
                                    </td>
                                </tr>
                            ))}
                            {scans.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        No scans yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
