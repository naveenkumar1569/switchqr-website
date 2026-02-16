import React from 'react';
import { useNavigate } from 'react-router-dom';

const LockedFeature = ({ feature, requiredPlan, description, className = '' }) => {
    const navigate = useNavigate();

    const planColors = {
        starter: 'text-blue-600 dark:text-blue-400',
        pro: 'text-purple-600 dark:text-purple-400'
    };

    return (
        <div className={`flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-6 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-base mb-1">{feature}</p>
                    {description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={() => navigate('/billing')}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
                <span>Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
        </div>
    );
};

export default LockedFeature;
