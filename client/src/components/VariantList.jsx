import React from 'react';
import VariantCard from './VariantCard';

const VariantList = ({ variants, onUpdate, onDelete, onAdd }) => {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const controlWeight = Math.max(0, 100 - totalWeight);
    const isWeightValid = totalWeight <= 100;

    return (
        <div className="space-y-4">
            {/* Weight Warning - Only show if OVER 100% */}
            {totalWeight > 100 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">warning</span>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                            Total weight cannot exceed 100%
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Current total: {totalWeight}% (reduce by {totalWeight - 100}%)
                        </p>
                    </div>
                </div>
            )}

            {/* Variants */}
            {variants.length > 0 ? (
                <div className="space-y-4">
                    {(() => {
                        const totalScans = variants.reduce((sum, v) => sum + (v.scan_count || 0), 0);
                        const maxScans = Math.max(...variants.map(v => v.scan_count || 0));
                        const leaderId = maxScans > 0 ? variants.find(v => (v.scan_count || 0) === maxScans)?.id : null;

                        return variants.map((variant) => (
                            <VariantCard
                                key={variant.id}
                                variant={variant}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                totalWeight={totalWeight}
                                totalScans={totalScans}
                                isLeader={variant.id === leaderId}
                            />
                        ));
                    })()}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">
                        science
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No variants yet. Add at least 2 to start A/B testing.
                    </p>
                </div>
            )}

            {/* Add Variant Button */}
            <button
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
                <span className="material-symbols-outlined">add</span>
                <span className="font-medium">Add Variant</span>
            </button>

            {/* Traffic Distribution Visualizer */}
            {variants.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Traffic Distribution
                    </h4>
                    <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                        {/* Control (Original URL) */}
                        {controlWeight > 0 && (
                            <div
                                className="bg-slate-400 dark:bg-slate-500 transition-all"
                                style={{ width: `${controlWeight}%` }}
                                title={`Control (Original URL): ${controlWeight}%`}
                            />
                        )}

                        {/* Variants */}
                        {variants.map((variant, index) => {
                            const colors = [
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-purple-500',
                                'bg-amber-500',
                                'bg-pink-500'
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div
                                    key={variant.id}
                                    className={`${color} transition-all`}
                                    style={{ width: `${variant.weight}%` }}
                                    title={`${variant.label || `Variant ${variant.id}`}: ${variant.weight}%`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {/* Control Legend */}
                        {controlWeight > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                    Control - Original URL ({controlWeight}%)
                                </span>
                            </div>
                        )}

                        {/* Variant Legends */}
                        {variants.map((variant, index) => {
                            const colors = [
                                { bg: 'bg-blue-500', text: 'text-blue-500' },
                                { bg: 'bg-green-500', text: 'text-green-500' },
                                { bg: 'bg-purple-500', text: 'text-purple-500' },
                                { bg: 'bg-amber-500', text: 'text-amber-500' },
                                { bg: 'bg-pink-500', text: 'text-pink-500' }
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div key={variant.id} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                        {variant.label || `Variant ${variant.id}`} ({variant.weight}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantList;
