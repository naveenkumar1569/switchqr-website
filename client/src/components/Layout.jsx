import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout, planInfo } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-shrink-0 flex flex-col h-full transition-colors duration-200">
                <div className="p-6">
                    <Link to="/" className="inline-block">
                        <img src="/logo.svg" alt="SwitchQR" className="h-10" />
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
                    <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/') ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/campaigns" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/campaigns') ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                        <span>Campaigns</span>
                        {!planInfo?.features?.campaigns && (
                            <span className="ml-auto material-symbols-outlined text-xs text-amber-500">lock</span>
                        )}
                    </Link>
                    <Link to="/qrs/create" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/qrs/create') ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined">qr_code_2</span>
                        <span>Create QR</span>
                    </Link>
                    <Link to="/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/analytics') ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span>Analytics</span>
                    </Link>
                    <Link to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive('/settings') ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-border-light dark:border-border-dark flex flex-col gap-4">
                    {/* Upgrade Banner for Free Users */}
                    {(planInfo?.plan === 'free' || !planInfo?.plan) && (
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Free Plan</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                                You're using the limited free plan. Upgrade to unlock team features.
                            </p>
                            <button
                                onClick={() => window.location.href = '/billing'}
                                className="w-full cursor-pointer items-center justify-center rounded-lg h-9 bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3 px-3 py-2 mt-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold">
                            {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.email || 'User')}
                            </span>
                            <button onClick={logout} className="text-xs text-left text-slate-500 dark:text-slate-400 hover:text-primary">Logout</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 lg:px-8 z-10">
                    <div className="flex-1 max-w-lg">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary">search</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition duration-150 ease-in-out sm:text-sm"
                                placeholder="Search..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Navigate to dashboard with search param
                                        window.location.href = `/?search=${encodeURIComponent(e.target.value)}`;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <Link to="/qrs/create" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Create QR</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
