import React, { useState } from 'react';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';

const VariantCard = ({ variant, onUpdate, onDelete, totalWeight, totalScans, isLeader }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedVariant, setEditedVariant] = useState({
        destination_url: variant.destination_url,
        weight: variant.weight,
        label: variant.label || ''
    });

    const handleSave = () => {
        // Validate URL before saving
        if (!validateUrl(editedVariant.destination_url)) {
            alert('Please enter a valid URL (http:// or https://).');
            return;
        }
        // Normalize URL before saving
        const normalizedVariant = {
            ...editedVariant,
            destination_url: normalizeUrl(editedVariant.destination_url)
        };
        onUpdate(variant.id, normalizedVariant);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedVariant({
            destination_url: variant.destination_url,
            weight: variant.weight,
            label: variant.label || ''
        });
        setIsEditing(false);
    };

    const scanShare = totalScans > 0 ? Math.round(((variant.scan_count || 0) / totalScans) * 100) : 0;

    return (
        <div className={`group relative rounded-2xl p-5 transition-all border ${isLeader ? 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/30 shadow-sm'}`}>
            {isLeader && (
                <div className="absolute -top-3 left-4 px-2 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                    Leader
                </div>
            )}

            {isEditing ? (
                /* Editing Mode */
                <div className="space-y-4">
                    {/* Label */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                            Variant Name
                        </label>
                        <input
                            type="text"
                            value={editedVariant.label}
                            onChange={(e) => setEditedVariant({ ...editedVariant, label: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="e.g., Long Form"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                            Destination URL
                        </label>
                        <input
                            type="text"
                            value={editedVariant.destination_url}
                            onChange={(e) => setEditedVariant({ ...editedVariant, destination_url: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="example.com"
                        />
                    </div>

                    {/* Weight Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Traffic Weight
                            </label>
                            <span className="text-sm font-bold text-primary">
                                {editedVariant.weight}%
                            </span>
                        </div>
                        <style>{`
                            .custom-slider::-webkit-slider-thumb {
                                appearance: none;
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                background: rgb(124, 58, 237);
                                cursor: pointer;
                                border: 3px solid white;
                                shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            .custom-slider::-moz-range-thumb {
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                background: rgb(124, 58, 237);
                                cursor: pointer;
                                border: 3px solid white;
                                shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                        `}</style>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={editedVariant.weight}
                            onChange={(e) => setEditedVariant({ ...editedVariant, weight: parseInt(e.target.value) })}
                            className="custom-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, rgb(124, 58, 237) 0%, rgb(124, 58, 237) ${editedVariant.weight}%, rgb(226, 232, 240) ${editedVariant.weight}%, rgb(226, 232, 240) 100%)`
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Label & Share */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">label</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {variant.label || `Variant ${variant.id}`}
                                </span>
                            </div>
                            {totalScans > 0 && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-tighter uppercase whitespace-nowrap">
                                    {scanShare}% Share
                                </div>
                            )}
                        </div>

                        {/* URL */}
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">link</span>
                            <a
                                href={variant.destination_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline break-all font-mono"
                            >
                                {variant.destination_url}
                            </a>
                        </div>

                        {/* Traffic Weight */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">analytics</span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Traffic Split</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{variant.weight}%</span>
                            </div>
                            <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                <div
                                    className={`absolute top-0 left-0 h-1.5 rounded-full transition-all duration-1000 ${isLeader ? 'bg-indigo-500' : 'bg-primary'}`}
                                    style={{ width: `${variant.weight}%` }}
                                />
                            </div>
                        </div>

                        {/* Scans Count */}
                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">ads_click</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {variant.scan_count || 0}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">scans</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Icons - Right Side */}
                    <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(variant.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantCard;
