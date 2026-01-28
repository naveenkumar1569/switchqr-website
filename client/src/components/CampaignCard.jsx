import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CampaignCard = ({ campaign, onRename, onDelete }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const colors = [
        { bg: 'bg-primary/10', text: 'text-primary' },
        { bg: 'bg-blue-500/10', text: 'text-blue-500' },
        { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
        { bg: 'bg-amber-500/10', text: 'text-amber-500' },
        { bg: 'bg-purple-500/10', text: 'text-purple-500' }
    ];

    // Use campaign ID to consistently pick a color
    const colorIndex = campaign.id % colors.length;
    const color = colors[colorIndex];

    // Calculate max value for sparkline scaling
    const maxValue = Math.max(...(campaign.recent_scans_7d || [1]), 1);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6 cursor-pointer relative overflow-visible"
        >
            {/* Menu Button */}
            <div className="absolute top-4 right-4 z-10">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className={`p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${showMenu ? 'opacity-100 bg-slate-100 dark:bg-slate-800' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onRename(campaign);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Rename
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onDelete(campaign);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className={`size-12 rounded-xl ${color.bg} flex items-center justify-center ${color.text}`}>
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1" title={campaign.name}>
                        {campaign.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 border-y border-slate-50 dark:border-slate-800 py-4">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">QR Codes</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{campaign.qr_count}</p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                        {campaign.total_scans >= 1000
                            ? `${(campaign.total_scans / 1000).toFixed(1)}k`
                            : campaign.total_scans}
                    </p>
                </div>
            </div>

            {/* Sparkline */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scan Activity (7d)</p>
                <div className="h-12 w-full flex items-end gap-1">
                    {(campaign.recent_scans_7d || [0, 0, 0, 0, 0, 0, 0]).map((value, index) => {
                        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        const isToday = index === 6;
                        return (
                            <div
                                key={index}
                                className={`flex-1 rounded-t-sm transition-all ${isToday
                                    ? color.text.replace('text-', 'bg-')
                                    : color.text.replace('text-', 'bg-') + '/20'
                                    }`}
                                style={{ height: `${Math.max(height, 5)}%` }}
                                title={`${value} scans`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
