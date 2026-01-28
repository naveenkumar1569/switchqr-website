import React from 'react';
import { useNavigate } from 'react-router-dom';

const LockedFeature = ({ feature, requiredPlan, description, className = '' }) => {
    const navigate = useNavigate();

    const planColors = {
        starter: 'text-blue-600 dark:text-blue-400',
        pro: 'text-purple-600 dark:text-purple-400'
    };

    return (
        <div className={`flex flex-col gap-4 rounded-xl bg-amber-50 p-4 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm ring-1 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/30">
                    <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">{feature}</p>
                    {description && (
                        <p className="text-xs text-amber-800 dark:text-amber-200/80 mt-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={() => navigate('/billing')}
                className="w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-colors"
            >
                Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
            </button>
        </div>
    );
};

export default LockedFeature;
