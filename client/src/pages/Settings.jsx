import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGet, apiPut } from '../utils/api';

const Settings = () => {
    const { user, token, planInfo, refreshPlan } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        jobTitle: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiGet('/api/users/profile', token);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        email: data.email || '',
                        jobTitle: data.job_title || '',
                        bio: data.bio || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiPut('/api/users/profile', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                job_title: formData.jobTitle,
                bio: formData.bio
            }, token);

            if (response.ok) {
                showSuccess('Profile updated successfully!');
            } else {
                const error = await response.json();
                showError(`Failed to update profile: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('An error occurred while updating your profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePlanChange = async (newPlan) => {
        if (!confirm(`Are you sure you want to force switch your plan to ${newPlan.toUpperCase()}?`)) return;

        try {
            const response = await apiPut('/api/plan', { plan: newPlan }, token);

            if (response.ok) {
                await refreshPlan();
                showSuccess(`Successfully switched to ${newPlan} plan`);
            } else {
                showError('Failed to switch plan');
            }
        } catch (error) {
            console.error('Error switching plan:', error);
            showError('Error switching plan');
        }
    };

    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">Account Settings</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                    Manage your personal details, workspace preferences, and security settings.
                </p>
            </div>

            {/* Tabs & Content Container */}
            <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-800 px-2 sm:px-6 bg-gray-50/50 dark:bg-gray-900/20">
                    <div className="flex items-end gap-6 overflow-x-auto no-scrollbar">
                        {/* Active Tab */}
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'profile' ? 'font-bold' : 'font-medium'} tracking-wide`}>Profile</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'notifications' ? 'font-bold' : 'font-medium'}`}>Notifications</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'billing' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'billing' ? 'font-bold' : 'font-medium'}`}>Billing</span>
                        </button>
                    </div>
                </div>

                {/* Active Tab Content: Profile */}
                {activeTab === 'profile' && (
                    <div className="p-6 sm:p-8 flex flex-col gap-8">
                        {/* Section: Avatar */}
                        <div className="flex flex-col gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Profile</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">This information will be displayed on your public profile.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="relative h-20 w-20 rounded-full border-2 border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[40px]">person</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Change</button>
                                        <button className="inline-flex items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Remove</button>
                                    </div>
                                    <p className="text-xs text-slate-400">Recommended: 400x400px. JPG or PNG.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Form */}
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="first-name">First name</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 sm:text-sm sm:leading-6"
                                            id="first-name"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="last-name">Last name</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 sm:text-sm sm:leading-6"
                                            id="last-name"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="email">Email address</label>
                                    <div className="mt-2 relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 sm:text-sm sm:leading-6"
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This email will be used for account notifications.</p>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="job-title">Job Title</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 sm:text-sm sm:leading-6"
                                            id="job-title"
                                            type="text"
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="bio">Bio</label>
                                    <div className="mt-2">
                                        <textarea
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 sm:text-sm sm:leading-6"
                                            id="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Brief description for your profile. URLs are hyperlinked.</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-x-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                                <button className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-primary transition-colors" type="button">Cancel</button>
                                <button
                                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* DEV ONLY: Admin Plan Override - Disabled in production */}
                {import.meta.env.DEV && user?.email === 'naveenkumar085@gmail.com' && activeTab === 'profile' && (
                    <div className="p-6 sm:p-8 flex flex-col gap-6 border-t border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">lock_open</span>
                                Developer Plan Override
                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">DEV ONLY</span>
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Force set your account plan for testing purposes. This feature is disabled in production.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {['free', 'starter', 'pro'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePlanChange(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 capitalize transition-all ${(planInfo?.effectivePlan || 'free') === p
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-6 sm:p-8">
                        <p className="text-slate-500">Notification settings coming soon...</p>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Plan</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your subscription and billing details.</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-violet-50 dark:bg-violet-900/30 px-3 py-1 text-sm font-bold text-primary ring-1 ring-inset ring-violet-700/10 dark:ring-violet-500/30 capitalize">
                                {planInfo?.effectivePlan || 'Free'} Plan
                            </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary">credit_card</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Billing Portal</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">View invoices, update payment methods, and change plans.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/billing')}
                                className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Manage Subscription
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-1 items-start">
                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Next Invoice</span>
                                <span className="text-slate-900 dark:text-white font-medium">Automatic renewal enabled</span>
                            </div>
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-1 items-start">
                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Payment Method</span>
                                <span className="text-slate-900 dark:text-white font-medium">•••• •••• •••• 4242</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Settings;
