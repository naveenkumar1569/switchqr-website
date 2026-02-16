import React from 'react';
import { Link } from 'react-router-dom';

const LockedOverlay = ({ title, description, requiredPlan = 'pro' }) => {
    const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

    return (
        <div className="absolute inset-0 bg-slate-500/[0.03] dark:bg-slate-900/[0.03] backdrop-blur-[12px] rounded-2xl flex flex-col items-center justify-center z-[50] overflow-hidden group">
            {/* Subtle inner reflection/glare effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative text-center px-6 max-w-sm backdrop-blur-md bg-white/40 dark:bg-slate-900/40 p-8 rounded-[2rem] shadow-2xl border border-white/40 dark:border-slate-700/30 transition-all duration-500 hover:scale-[1.02]">
                {/* Lock icon with a soft glow */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-5 relative group-hover:scale-110 transition-transform">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="material-symbols-outlined text-primary text-2xl relative z-10">lock</span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-snug">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 mb-6 font-medium px-2">{description}</p>

                <Link
                    to="/billing"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] text-sm font-bold"
                >
                    <span>Upgrade to {planLabel}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};

export default LockedOverlay;
