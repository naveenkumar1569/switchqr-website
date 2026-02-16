import React from 'react';
import { Link } from 'react-router-dom';

const LockedOverlay = ({ title, description, requiredPlan = 'pro' }) => {
    const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

    return (
        <div className="absolute inset-0 bg-white/40 dark:bg-surface-dark/40 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-[100] border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-center px-6 max-w-md bg-white/90 dark:bg-surface-dark/90 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>
                <Link
                    to="/billing"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 text-sm font-bold shadow-lg shadow-primary/25"
                >
                    <span>Upgrade to {planLabel}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};

export default LockedOverlay;
