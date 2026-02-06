
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/api';

const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode === 'Unknown') return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};

const GlobalAnalytics = () => {
    const { token, planInfo } = useAuth();
    const [data, setData] = useState({
        totalScans: 0,
        uniqueScans: 0,
        topQr: 'N/A',
        recentScans: [],
        deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
        scansOverTime: [],
        locationStats: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ type: 'days', value: 7, label: 'Last 7 Days' });
    const [showRangeMenu, setShowRangeMenu] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [graphWidth, setGraphWidth] = useState(800);
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const containerRef = useRef(null);

    // Measure container width for sharp graph rendering
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setGraphWidth(containerRef.current.clientWidth);
            }
        };

        // Initial measurement
        updateWidth();

        // Resize observer for robust updates
        const observer = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Helper function to get date range parameters
    const getDateRangeParams = () => {
        const now = new Date();
        let startDate, endDate;

        switch (dateRange.type) {
            case 'days':
                return `days=${dateRange.value}`;

            case 'current_month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = now;
                break;

            case 'last_month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;

            case 'this_year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = now;
                break;

            case 'last_year':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                break;

            case 'custom':
                if (customStartDate && customEndDate) {
                    return `start=${customStartDate}&end=${customEndDate}`;
                }
                return 'days=7'; // fallback

            default:
                return 'days=7';
        }

        // Format dates as YYYY-MM-DD
        const formatDate = (d) => d.toISOString().split('T')[0];
        return `start=${formatDate(startDate)}&end=${formatDate(endDate)}`;
    };

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const params = getDateRangeParams();
                const response = await apiGet(`/api/stats?${params}`, token);

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
    }, [token, dateRange, customStartDate, customEndDate]);

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

    const maxScans = Math.max(...data.scansOverTime.map(d => d.count), 10);
    const points = data.scansOverTime.map((d, i) => {
        const x = (i / (data.scansOverTime.length - 1 || 1)) * graphWidth;
        const y = 200 - ((d.count / maxScans) * 150);
        return { x, y };
    });

    // Generate smooth cubic bezier path
    const pathD = points.length > 1
        ? points.reduce((acc, point, i, arr) => {
            if (i === 0) return `M ${point.x} ${point.y}`;
            const prev = arr[i - 1];
            const cp1x = prev.x + (point.x - prev.x) / 2;
            const cp2x = prev.x + (point.x - prev.x) / 2;
            return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
        }, "")
        : `M 0 200 L ${graphWidth} 200`; // Flat line if no data

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
                            <span>{dateRange.label}</span>
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </button>
                        {showRangeMenu && (
                            <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10 py-1">
                                <button
                                    onClick={() => { setDateRange({ type: 'days', value: 7, label: 'Last 7 Days' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => { setDateRange({ type: 'days', value: 30, label: 'Last 30 Days' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Last 30 Days
                                </button>
                                <div className="border-t border-border-light dark:border-border-dark my-1"></div>
                                <button
                                    onClick={() => { setDateRange({ type: 'current_month', label: 'Current Month' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Current Month
                                </button>
                                <button
                                    onClick={() => { setDateRange({ type: 'last_month', label: 'Last Month' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Last Month
                                </button>
                                <div className="border-t border-border-light dark:border-border-dark my-1"></div>
                                <button
                                    onClick={() => { setDateRange({ type: 'this_year', label: 'This Year' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    This Year
                                </button>
                                <button
                                    onClick={() => { setDateRange({ type: 'last_year', label: 'Last Year' }); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Last Year
                                </button>
                                <div className="border-t border-border-light dark:border-border-dark my-1"></div>
                                <button
                                    onClick={() => { setShowCustomRange(true); setShowRangeMenu(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Custom Range...
                                </button>
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
                    >
                        <span className="material-symbols-outlined text-[20px] mr-2">download</span>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Custom Range Modal */}
            {showCustomRange && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowCustomRange(false)}>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 max-w-md w-full border border-border-light dark:border-border-dark shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-dark dark:text-white">Custom Date Range</h3>
                            <button onClick={() => setShowCustomRange(false)} className="text-text-subtle hover:text-text-dark dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-dark dark:text-white mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark dark:text-white mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowCustomRange(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-text-dark dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (customStartDate && customEndDate) {
                                            const label = `${customStartDate} to ${customEndDate}`;
                                            setDateRange({ type: 'custom', label });
                                            setShowCustomRange(false);
                                        }
                                    }}
                                    disabled={!customStartDate || !customEndDate}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Scans */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-main dark:text-white text-sm font-medium">Total Scans</p>
                        <span className="material-symbols-outlined text-text-muted dark:text-gray-400 text-[20px]">qr_code_scanner</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-main dark:text-white text-2xl font-bold leading-none">{data.totalScans.toLocaleString()}</p>
                    </div>
                </div>
                {/* Unique Scans */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-main dark:text-white text-sm font-medium">Unique Scans</p>
                        <span className="material-symbols-outlined text-text-muted dark:text-gray-400 text-[20px]">person_outline</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-main dark:text-white text-2xl font-bold leading-none">{data.uniqueScans.toLocaleString()}</p>
                    </div>
                </div>
                {/* Scan Rate */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-main dark:text-white text-sm font-medium">Scan Rate</p>
                        <span className="material-symbols-outlined text-text-muted dark:text-gray-400 text-[20px]">trending_up</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-main dark:text-white text-2xl font-bold leading-none">
                            {data.totalScans > 0 ? Math.round((data.uniqueScans / data.totalScans) * 100) : 0}%
                        </p>
                    </div>
                </div>
                {/* Top QR */}
                <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-text-main dark:text-white text-sm font-medium">Top Performing QR</p>
                        <span className="material-symbols-outlined text-text-muted dark:text-gray-400 text-[20px]">emoji_events</span>
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-text-main dark:text-white text-xl font-bold leading-none truncate">
                            {typeof data.topQr === 'object' ? data.topQr?.name : (data.topQr || 'N/A')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-text-main dark:text-white text-lg font-bold">Scans over time</h3>
                        <p className="text-text-muted dark:text-gray-400 text-sm">Visualizing scan frequency for {dateRange.label.toLowerCase()}.</p>
                    </div>
                </div>
                <div className="relative w-full h-[250px]" ref={containerRef}>
                    {/* Vertical Hover Guide Line */}
                    {hoveredPoint !== null && (
                        <div
                            className="absolute top-0 bottom-[50px] w-[1px] bg-[#6D28D9]/20 pointer-events-none transition-all duration-300 ease-out"
                            style={{ left: `${(hoveredPoint / (data.scansOverTime.length - 1 || 1)) * 100}%` }}
                        />
                    )}

                    {/* Hover Tooltip */}
                    {hoveredPoint !== null && data.scansOverTime[hoveredPoint] && (
                        <div
                            className="absolute z-20 pointer-events-none transition-all duration-300 ease-out"
                            style={{
                                left: `${(hoveredPoint / (data.scansOverTime.length - 1 || 1)) * 100}%`,
                                top: '10px',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="bg-white dark:bg-[#1e1726] border-l-4 border-[#6D28D9] rounded-lg shadow-xl px-4 py-3 flex flex-col min-w-[140px] border border-slate-200/50 dark:border-white/5">
                                <div className="text-[10px] font-black text-[#6e5393] dark:text-gray-400 uppercase tracking-widest mb-1 leading-none">
                                    {data.scansOverTime[hoveredPoint].date}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#140f1a] dark:text-white/80">Scans:</span>
                                    <span className="font-black text-[#6D28D9]">
                                        {data.scansOverTime[hoveredPoint].count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${graphWidth} 250`} preserveAspectRatio="none" style={{ shapeRendering: 'geometricPrecision' }}>
                        {/* Grid Lines - Neutral light gray #F1F5F9 */}
                        {[0, 50, 100, 150, 200].map(y => (
                            <line key={y} stroke="#F1F5F9" className="dark:stroke-white/5" strokeWidth="1" x1="0" x2={graphWidth} y1={y} y2={y} vectorEffect="non-scaling-stroke" />
                        ))}

                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Curved Path Area */}
                        {data.scansOverTime.length > 1 && (
                            <path
                                d={`${pathD} V 250 H 0 Z`}
                                fill="url(#chartGradient)"
                                vectorEffect="non-scaling-stroke"
                            />
                        )}

                        {/* Curved Line Path - 2px Solid #6D28D9 */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#6D28D9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            className="transition-all duration-300"
                        />

                        {/* Invisible hover areas */}
                        {data.scansOverTime.map((d, i) => {
                            const x = (i / (data.scansOverTime.length - 1 || 1)) * graphWidth;
                            const width = graphWidth / (data.scansOverTime.length || 1);
                            return (
                                <rect
                                    key={`hover-${i}`}
                                    x={x - width / 2}
                                    y="0"
                                    width={width}
                                    height="200"
                                    fill="transparent"
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                />
                            );
                        })}

                        {/* Dots for Data Points - 4px radius, 2px stroke */}
                        {data.scansOverTime.map((d, i) => {
                            const x = (i / (data.scansOverTime.length - 1 || 1)) * graphWidth;
                            const y = 200 - ((d.count / maxScans) * 150);
                            const isHovered = hoveredPoint === i;
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    fill="white"
                                    r={isHovered ? "5" : "4"}
                                    stroke="#6D28D9"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    className="dark:fill-[#181220] transition-all duration-300"
                                />
                            );
                        })}

                        {/* X-Axis Labels */}
                        {data.scansOverTime.map((d, i) => {
                            const totalPoints = data.scansOverTime.length;
                            const x = (i / (totalPoints - 1 || 1)) * graphWidth;

                            // Determine skip interval based on total points
                            // Goal: Show max ~8-10 labels
                            let interval = 1;
                            if (totalPoints > 14) interval = 2;
                            if (totalPoints > 21) interval = 3;
                            if (totalPoints > 30) interval = 5; // For 30 days, show ~6 labels
                            if (totalPoints > 60) interval = 10;

                            // Always show first and last, otherwise respect interval
                            const isFirst = i === 0;
                            const isLast = i === totalPoints - 1;
                            const shouldShow = isFirst || isLast || (i % interval === 0);

                            if (!shouldShow) return null;

                            // Format date as "5 Feb"
                            const dateObj = new Date(d.date + 'T00:00:00');
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                            const label = `${day} ${month}`;

                            const textAnchor = isFirst ? "start" : isLast ? "end" : "middle";

                            return (
                                <text
                                    key={`label-${i}`}
                                    x={x}
                                    y="235"
                                    fill="currentColor"
                                    className="text-[10px] font-medium text-text-muted dark:text-gray-400"
                                    textAnchor={textAnchor}
                                >
                                    {label}
                                </text>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Device Split Chart */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm p-6">
                    <h3 className="text-text-main dark:text-white text-lg font-bold mb-6">Device Split</h3>
                    <div className="flex items-center justify-center flex-1 mb-6">
                        <div className="relative size-44 transition-all duration-300">
                            <svg className="size-full rotate-[-90deg]" viewBox="-5 -5 46 46">
                                {/* Background Track */}
                                <path
                                    className="text-gray-100 dark:text-gray-800/40"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="7"
                                ></path>
                                {/* Mobile Segment - #6D28D9 */}
                                <path
                                    className="cursor-pointer"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#6D28D9"
                                    strokeDasharray={`${data.deviceStats?.Mobile || 0}, 100`}
                                    strokeWidth={hoveredSegment === 'mobile' ? 9 : 7}
                                    strokeLinecap="butt"
                                    style={{
                                        opacity: hoveredSegment === 'mobile' || !hoveredSegment ? 1 : 0.4,
                                        transition: 'all 0.3s ease-out',
                                        filter: hoveredSegment === 'mobile' ? 'drop-shadow(0 0 4px rgba(109, 40, 217, 0.4))' : 'none'
                                    }}
                                    onMouseEnter={() => setHoveredSegment('mobile')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                ></path>
                                {/* Tablet - #8B5CF6 */}
                                <path
                                    className="cursor-pointer"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#8B5CF6"
                                    strokeDasharray={`${data.deviceStats?.Tablet || 0}, 100`}
                                    strokeDashoffset={`-${data.deviceStats?.Mobile || 0}`}
                                    strokeWidth={hoveredSegment === 'tablet' ? 9 : 7}
                                    strokeLinecap="butt"
                                    style={{
                                        opacity: hoveredSegment === 'tablet' || !hoveredSegment ? 1 : 0.4,
                                        transition: 'all 0.3s ease-out',
                                        filter: hoveredSegment === 'tablet' ? 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))' : 'none'
                                    }}
                                    onMouseEnter={() => setHoveredSegment('tablet')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                ></path>
                                {/* Desktop - #C084FC */}
                                <path
                                    className="cursor-pointer"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#C084FC"
                                    strokeDasharray={`${data.deviceStats?.Desktop || 0}, 100`}
                                    strokeDashoffset={`-${(data.deviceStats?.Mobile || 0) + (data.deviceStats?.Tablet || 0)}`}
                                    strokeWidth={hoveredSegment === 'desktop' ? 9 : 7}
                                    strokeLinecap="butt"
                                    style={{
                                        opacity: hoveredSegment === 'desktop' || !hoveredSegment ? 1 : 0.4,
                                        transition: 'all 0.3s ease-out',
                                        filter: hoveredSegment === 'desktop' ? 'drop-shadow(0 0 4px rgba(192, 132, 252, 0.4))' : 'none'
                                    }}
                                    onMouseEnter={() => setHoveredSegment('desktop')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                ></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none transition-all duration-300 gap-1">
                                {hoveredSegment ? (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted dark:text-gray-400">
                                            {hoveredSegment}
                                        </span>
                                        <span className="text-2xl font-black text-[#6D28D9] dark:text-primary-light leading-none">
                                            {data.deviceStats?.[hoveredSegment.charAt(0).toUpperCase() + hoveredSegment.slice(1)] || 0}%
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-3xl font-black text-text-main dark:text-white leading-none">
                                            {data.totalScans.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted dark:text-gray-400 leading-tight">
                                            Total Scans
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            { name: 'Mobile', color: '#6D28D9' },
                            { name: 'Tablet', color: '#8B5CF6' },
                            { name: 'Desktop', color: '#C084FC' }
                        ].map((device) => (
                            <div key={device.name} className="flex justify-between items-center text-sm group cursor-pointer" onMouseEnter={() => setHoveredSegment(device.name.toLowerCase())} onMouseLeave={() => setHoveredSegment(null)}>
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: device.color }}></div>
                                    <span className="text-text-main dark:text-white font-medium group-hover:text-[#6D28D9] dark:group-hover:text-primary-light transition-colors">{device.name}</span>
                                </div>
                                <span className="text-text-muted dark:text-gray-400 font-bold">{data.deviceStats?.[device.name] || 0}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Locations */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm p-6">
                    <h3 className="text-text-main dark:text-white text-lg font-bold mb-6">Top Locations</h3>
                    <div className="flex flex-col gap-5">
                        {data.locationStats && data.locationStats.length > 0 ? (
                            (() => {
                                const top = data.locationStats.slice(0, 5);
                                const total = data.totalScans || 1;

                                return top.map((loc, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl" title={loc.countryName}>{getFlagEmoji(loc.country)}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-text-main dark:text-white font-bold leading-none">
                                                        {loc.countryName}
                                                    </span>
                                                    <span className="text-[10px] text-text-muted dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                                        {loc.city !== 'Unknown' ? loc.city : 'Various Cities'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-black text-[#6D28D9] dark:text-primary-light">
                                                    {loc.count.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-text-muted dark:text-gray-400 font-bold uppercase">
                                                    {Math.round((loc.count / total) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-neutral-border/30 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-[#6D28D9] h-1.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(loc.count / total) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ));
                            })()
                        ) : (
                            <div className="text-center py-10 flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted dark:text-gray-600 text-4xl">location_on</span>
                                <p className="text-text-muted dark:text-gray-500 text-sm font-medium">No scan locations detected yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upsell Card */}
                {!planInfo?.features?.advanced_analytics && (
                    <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-neutral-border dark:border-border-dark shadow-sm overflow-hidden h-full">
                        <div className="h-32 w-full bg-gradient-to-br from-primary to-indigo-600 relative">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                                    <p className="text-text-main dark:text-white text-lg font-bold leading-tight">Unlock attribution</p>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed">
                                    Gain deeper insights with city-level data, OS stats, and browser analytics.
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/billing'}
                                className="w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex gap-2 group"
                            >
                                <span>Upgrade Pro</span>
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
