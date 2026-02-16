import React from 'react';
import VariantCard from './VariantCard';

const VariantList = ({ variants, controlWeight, controlScanCount, mainUrl, onUpdate, onDelete, onAdd }) => {
    // Total weight including control should be 100
    const totalWeight = variants.reduce((sum, v) => sum + (v.is_enabled !== false ? v.weight : 0), 0) + controlWeight;
    const isWeightValid = totalWeight <= 100;

    // Virtual Control Object
    const controlVariant = {
        id: 'control',
        name: 'Control (Original URL)',
        destination_url: mainUrl,
        weight: controlWeight,
        scan_count: controlScanCount,
        is_enabled: true
    };

    return (
        <div className="space-y-4">
            {/* Weight Warning */}
            {!isWeightValid && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50  border border-amber-200 ">
                    <span className="material-symbols-outlined text-amber-600  text-xl">warning</span>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900 ">
                            Total weight exceeds 100%
                        </p>
                        <p className="text-xs text-amber-700  mt-1">
                            Current total: {totalWeight}% (Control: {controlWeight}%, Variants: {totalWeight - controlWeight}%)
                        </p>
                    </div>
                </div>
            )}

            {/* Variants + Control */}
            <div className="space-y-4">
                {(() => {
                    const allActive = [controlVariant, ...variants.filter(v => v.is_enabled !== false)];
                    const totalScans = variants.reduce((sum, v) => sum + (v.scan_count || 0), 0) + controlScanCount;
                    const maxScans = allActive.length > 0
                        ? Math.max(...allActive.map(v => v.scan_count || 0))
                        : 0;
                    const leaderId = maxScans > 0
                        ? allActive.find(v => (v.scan_count || 0) === maxScans)?.id
                        : null;

                    return (
                        <>
                            {/* Control Card Always First */}
                            <VariantCard
                                key="control"
                                variant={controlVariant}
                                onUpdate={onUpdate}
                                onDelete={() => { }} // Cannot delete control
                                totalWeight={totalWeight}
                                totalScans={totalScans}
                                isLeader={leaderId === 'control'}
                                isControl={true}
                            />

                            {/* Divider if there are variants */}
                            {variants.length > 0 && <div className="border-t border-slate-100  my-2" />}

                            {/* Variant Cards */}
                            {variants.map((variant) => (
                                <VariantCard
                                    key={variant.id}
                                    variant={variant}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    totalWeight={totalWeight}
                                    totalScans={totalScans}
                                    isLeader={variant.id === leaderId}
                                />
                            ))}
                        </>
                    );
                })()}
            </div>

            {/* Add Variant Button */}
            <button
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200  rounded-xl text-slate-600  hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
                <span className="material-symbols-outlined">add</span>
                <span className="font-medium">Add Variant</span>
            </button>

            {/* Traffic Distribution Visualizer */}
            <div className="mt-6 p-4 bg-slate-50  rounded-xl">
                <h4 className="text-xs font-bold text-slate-500  uppercase tracking-wide mb-3">
                    Traffic Distribution
                </h4>
                <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 ">
                    {/* Control Legend in Bar */}
                    {controlWeight > 0 && (
                        <div
                            className="bg-slate-500 transition-all border-r border-white/10"
                            style={{ width: `${controlWeight}%` }}
                            title={`Control (Original URL): ${controlWeight}%`}
                        />
                    )}

                    {/* Variants in Bar */}
                    {variants.map((variant, index) => {
                        const isEnabled = variant.is_enabled !== false;
                        if (!isEnabled) return null;

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
                                className={`${color} transition-all border-r border-white/10`}
                                style={{ width: `${variant.weight}%` }}
                                title={`${variant.name || variant.label || `Variant ${variant.id}`}: ${variant.weight}%`}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                    {/* Control Legend Item */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-500" />
                        <span className="text-xs text-slate-600  font-bold">
                            Control ({controlWeight}%)
                        </span>
                    </div>

                    {/* Variant Legend Items */}
                    {variants.map((variant, index) => {
                        const isEnabled = variant.is_enabled !== false;
                        const colors = [
                            { bg: 'bg-blue-500', text: 'text-blue-500' },
                            { bg: 'bg-green-500', text: 'text-green-500' },
                            { bg: 'bg-purple-500', text: 'text-purple-500' },
                            { bg: 'bg-amber-500', text: 'text-amber-500' },
                            { bg: 'bg-pink-500', text: 'text-pink-500' }
                        ];
                        const color = colors[index % colors.length];

                        return (
                            <div key={variant.id} className={`flex items-center gap-2 ${!isEnabled ? 'opacity-50' : ''}`}>
                                <div className={`w-3 h-3 rounded-full ${isEnabled ? color.bg : 'bg-slate-300'}`} />
                                <span className="text-xs text-slate-600  font-medium">
                                    {variant.name || variant.label || `Variant ${variant.id}`} ({isEnabled ? variant.weight : 0}%)
                                    {!isEnabled && <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">Disabled</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export default VariantList;
