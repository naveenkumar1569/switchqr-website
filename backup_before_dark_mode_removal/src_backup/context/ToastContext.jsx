import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', options = {}) => {
        const id = Date.now();
        const toast = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            title: options.title,
            description: options.description,
            action: options.action,
            duration: options.duration || 5000,
        };

        setToasts(prev => [...prev, toast]);

        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, options) => {
        return showToast(message, 'success', options);
    }, [showToast]);

    const showError = useCallback((message, options) => {
        return showToast(message, 'error', options);
    }, [showToast]);

    const showWarning = useCallback((message, options) => {
        return showToast(message, 'warning', options);
    }, [showToast]);

    const showInfo = useCallback((message, options) => {
        return showToast(message, 'info', options);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { type, message, title, description, action } = toast;

    const styles = {
        success: {
            bg: 'bg-white dark:bg-[#231b2e]',
            iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
            icon: 'check_circle',
            border: 'border-gray-100 dark:border-gray-700/50'
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-500/10',
            iconBg: 'text-red-600 dark:text-red-400',
            icon: 'error',
            border: 'border-red-100 dark:border-red-500/20',
            textColor: 'text-red-900 dark:text-red-200',
            descColor: 'text-red-700 dark:text-red-300/80'
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            iconBg: 'bg-white text-amber-600 shadow-sm ring-1 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/30',
            icon: 'warning',
            border: 'border-amber-200 dark:border-amber-500/20',
            textColor: 'text-amber-900 dark:text-amber-100',
            descColor: 'text-amber-800 dark:text-amber-200/80'
        },
        info: {
            bg: 'bg-primary/5 dark:bg-primary/10',
            iconBg: 'bg-white shadow-sm ring-1 ring-black/5 dark:bg-primary/20 dark:ring-primary/20 text-primary',
            icon: 'auto_awesome',
            border: 'border-primary/10 dark:border-primary/20',
            textColor: 'text-gray-900 dark:text-white',
            descColor: 'text-gray-600 dark:text-gray-300'
        }
    };

    const style = styles[type] || styles.success;

    return (
        <div className={`flex items-center gap-4 rounded-xl ${style.bg} p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border ${style.border} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}>
                <span className="material-symbols-outlined">{style.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                {title && <p className={`font-medium text-sm ${style.textColor || 'text-[#140e1b] dark:text-white'}`}>{title}</p>}
                <p className={`${title ? 'text-xs mt-0.5' : 'font-medium text-sm'} ${style.descColor || 'text-gray-500 dark:text-gray-400'} truncate`}>
                    {description || message}
                </p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-2 text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                    >
                        {action.label}
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
            >
                <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
    );
};
