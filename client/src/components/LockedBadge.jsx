import React from 'react';
import { useNavigate } from 'react-router-dom';

const LockedBadge = ({ plan = 'pro', children, className = '' }) => {
    const navigate = useNavigate();

    const planLabel = plan.toUpperCase();
    const isStarter = plan.toLowerCase() === 'starter';

    const handleLockedClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/billing');
    };

    return (
        <div
            onClick={handleLockedClick}
            className={`inline-flex items-center gap-1.5 cursor-pointer group/lock transition-all hover:opacity-80 ${className}`}
        >
            {children}
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded px-1.5 py-0.5">
                <span className="material-symbols-outlined text-[10px] text-amber-600 dark:text-amber-400 font-bold">lock</span>
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 tracking-wider">
                    {planLabel}
                </span>
            </div>
        </div>
    );
};

export default LockedBadge;
