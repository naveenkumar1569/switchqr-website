import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGet } from '../utils/api';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, planInfo } = useAuth();
    const { showError } = useToast();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaignDetails();
    }, [id, token]);

    const fetchCampaignDetails = async () => {
        try {
            const response = await apiGet(`/api/campaigns/${id}`, token);

            if (response.ok) {
                const data = await response.json();
                setCampaign(data);
            } else {
                showError('Failed to load campaign details');
                navigate('/campaigns');
            }
        } catch (error) {
            console.error('Error fetching campaign:', error);
            showError('Error loading campaign details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!campaign) return null;

    // Derived helpers
    const maxScanCount = Math.max(...(campaign.qrs?.map(q => q.scan_count) || [0]), 1);

    // Calculate device percentages
    const mobilePercent = campaign.device_stats?.Mobile || 0;
    const desktopPercent = campaign.device_stats?.Desktop || 0;
    const tabletPercent = campaign.device_stats?.Tablet || 0;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6 text-slate-500 dark:text-slate-400">
                <Link to="/campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 dark:text-white font-medium">{campaign.name}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{campaign.name}</h2>
                        <span className="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-100 dark:border-green-800">Active</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                        Detailed performance overview for this campaign folder. Created on {new Date(campaign.created_at).toLocaleDateString()}.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => navigate(`/qrs/create?campaign_id=${campaign.id}`)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-hover shadow-sm transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Create QR
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Scans */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Scans</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{campaign.total_scans?.toLocaleString()}</span>
                        {/* Mock growth */}
                        {/* Growth data not available */}
                    </div>
                </div>

                {/* Unique Visitors */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Unique Visitors</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{campaign.unique_visitors?.toLocaleString()}</span>
                        {/* Growth data not available */}
                    </div>
                </div>

                {/* Avg Conversion */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Avg. Conversion</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{campaign.avg_conversion || 0}%</span>
                        {/* Growth data not available */}
                    </div>
                </div>

                {/* Total Assets */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Total QR Assets</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{campaign.qr_count}</span>
                        <span className="text-slate-400 text-sm font-medium">In folder</span>
                    </div>
                </div>
            </div>

            {/* Upsell Banner - Only show if not Pro */}
            {planInfo?.plan !== 'pro' && (
                <div className="bg-gradient-to-r from-violet-50 to-white dark:from-slate-800 dark:to-slate-900 border border-violet-100 dark:border-slate-700 rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Unlock Advanced Attribution</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get deep-dive metrics including UTM tracking, user flow analysis, and retargeting pixels.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/billing')}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-primary-hover transition-all shadow-md"
                    >
                        Upgrade to Pro
                    </button>
                </div>
            )}

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Top Performing QRs */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Top Performing QRs</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Scans by Asset (Last 30 Days)</p>
                        </div>

                    </div>

                    <div className="space-y-6">
                        {campaign.qrs && campaign.qrs.slice(0, 5).map((qr) => (
                            <div key={qr.id} className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                                <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-300" title={qr.name}>{qr.name}</span>
                                <div className="h-6 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${maxScanCount > 0 ? (qr.scan_count / maxScanCount) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-right text-slate-900 dark:text-white">{qr.scan_count?.toLocaleString()}</span>
                            </div>
                        ))}
                        {(!campaign.qrs || campaign.qrs.length === 0) && (
                            <p className="text-center text-slate-400 py-8">No QR codes in this campaign yet.</p>
                        )}
                    </div>
                </div>

                {/* Device Split (SVG Donut) */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 p-6 rounded-xl shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Device Split</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Traffic source by OS</p>

                    <div className="relative size-48 mx-auto mb-8">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                            {/* Background */}
                            <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                            {/* Mobile (Primary) */}
                            {mobilePercent > 0 && (
                                <circle
                                    className="stroke-primary transition-all duration-1000 ease-out"
                                    cx="18" cy="18" fill="none" r="16"
                                    strokeWidth="3"
                                    strokeDasharray={`${mobilePercent}, 100`}
                                ></circle>
                            )}
                            {/* Android/Other (Cyan) */}
                            {desktopPercent > 0 && (
                                <circle
                                    className="stroke-sky-400 transition-all duration-1000 ease-out"
                                    cx="18" cy="18" fill="none" r="16"
                                    strokeWidth="3"
                                    strokeDasharray={`${desktopPercent}, 100`}
                                    strokeDashoffset={`-${mobilePercent}`}
                                ></circle>
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{mobilePercent}%</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mobile</span>
                        </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Mobile</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{mobilePercent}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-sky-400"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Desktop</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{desktopPercent}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-slate-300"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Tablet</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{tabletPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geo and List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Geo Distribution */}
                <div className="bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 pb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Geo-Distribution</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Top scanning locations worldwide</p>
                    </div>
                    <div className="h-64 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700">public</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {campaign.geo_stats && campaign.geo_stats.length > 0 ? (
                            campaign.geo_stats.map((geo, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                                        <span>{geo.country}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{geo.count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                                        <div className="h-full bg-primary" style={{ width: `${(geo.count / (campaign.total_scans || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-slate-400 text-sm">No location data available yet</div>
                        )}
                    </div>
                </div>

                {/* QR Performance List Table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1726] border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e1726]">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">QR Performance List</h3>
                        <Link to="/campaigns" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            View All Assets
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white dark:bg-[#1e1726]">
                            <thead>
                                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 font-bold">QR Asset Name</th>
                                    <th className="px-6 py-4 font-bold">Scans</th>
                                    <th className="px-6 py-4 font-bold">Uniques</th>
                                    <th className="px-6 py-4 font-bold">Conversion</th>
                                    <th className="px-6 py-4 font-bold">Trends (7d)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {campaign.qrs && campaign.qrs.map((qr) => (
                                    <tr key={qr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link to={`/qrs/${qr.id}`} className="flex items-center gap-3">
                                                <div className="size-8 bg-violet-50 dark:bg-violet-900/20 text-primary rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-sm">qr_code</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{qr.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate">/r/{qr.short_code}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{qr.scan_count}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {/* We don't track unique per QR in the list summary efficiently yet, using placeholder or maybe scan_count * 0.8 */}
                                            {qr.unique_scans || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-400">0%</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-end gap-1 h-8">
                                                {qr.trend && qr.trend.map((val, idx) => {
                                                    const max = Math.max(...qr.trend, 1);
                                                    const height = Math.max((val / max) * 100, 10);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`w-1.5 rounded-t-sm ${idx >= 4 ? 'bg-primary' : 'bg-violet-200 dark:bg-slate-700'}`}
                                                            style={{ height: `${height}%` }}
                                                            title={`${val} scans`}
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!campaign.qrs || campaign.qrs.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
