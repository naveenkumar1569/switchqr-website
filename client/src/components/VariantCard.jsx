import React, { useState } from 'react';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';

const VariantCard = ({ variant, onUpdate, onDelete, totalWeight }) => {
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

    const trafficPercentage = variant.percentage_of_traffic || 0;

    return (
        <div className="group relative rounded-2xl p-5 transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/30">
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
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            .custom-slider::-moz-range-thumb {
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                background: rgb(124, 58, 237);
                                cursor: pointer;
                                border: 3px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
                    <div className="flex-1 min-w-0 space-y-2.5">
                        {/* Label */}
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">label</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {variant.label || `Variant ${variant.id}`}
                            </span>
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
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">analytics</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Traffic Weight
                                    </span>
                                    <span className="text-sm font-bold text-primary">
                                        {variant.weight}%
                                    </span>
                                </div>
                                <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="absolute top-0 left-0 bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${variant.weight}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        {variant.scan_count > 0 && (
                            <div className="flex items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500">bar_chart</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {variant.scan_count} scans
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        ({trafficPercentage}%)
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Icons - Right Side */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
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
