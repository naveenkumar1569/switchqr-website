import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchQRAnalytics } from '../utils/analyticsService';

const Analytics = () => {
    const { id } = useParams();
    const { token } = useAuth();
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
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">bar_chart</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Scans</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics.totalScans || scans.length}</h3>
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
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
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
