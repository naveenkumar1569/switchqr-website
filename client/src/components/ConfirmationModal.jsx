import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white [#1e1629] rounded-2xl shadow-2xl border border-gray-100  overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-600  ' : 'bg-primary/10 text-primary'}`}>
                            <span className="material-symbols-outlined text-2xl">
                                {isDanger ? 'warning' : 'info'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900  mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600  leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 [#130d1b]/50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100 ">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700  hover:bg-gray-100 :bg-white/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all ${isDanger
                            ? 'bg-red-600 hover:bg-red-700  :bg-red-600'
                            : 'bg-primary hover:bg-primary-hover'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
