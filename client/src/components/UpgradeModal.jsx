import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, message, title = "Upgrade Required" }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        navigate('/billing');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-surface-light  rounded-2xl shadow-2xl border border-gray-200  overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary to-purple-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">lock</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-slate-700  text-base leading-relaxed mb-6">
                        {message}
                    </p>

                    {/* Features teaser */}
                    <div className="bg-primary/5  rounded-lg p-4 mb-6 border border-primary/20">
                        <p className="text-sm font-semibold text-primary  mb-2">Upgrade to unlock:</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-600 ">
                                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                Up to 100 active QR codes (Starter)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-600 ">
                                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                Advanced analytics & insights
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-600 ">
                                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                Custom branding & logos
                            </li>
                        </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300  text-slate-700  font-semibold hover:bg-gray-50 :bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpgrade}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>View Plans</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
