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



    return (
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900  md:text-4xl">Account Settings</h1>
                <p className="text-base text-slate-500  max-w-2xl">
                    Manage your personal details, workspace preferences, and security settings.
                </p>
            </div>

            {/* Tabs & Content Container */}
            <div className="flex flex-col bg-surface-light  rounded-xl border border-gray-200  shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200  px-2 sm:px-6 bg-gray-50/50 ">
                    <div className="flex items-end gap-6 overflow-x-auto no-scrollbar">
                        {/* Active Tab */}
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-500  hover:border-gray-300 :border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'profile' ? 'font-bold' : 'font-medium'} tracking-wide`}>Profile</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-slate-500  hover:border-gray-300 :border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'notifications' ? 'font-bold' : 'font-medium'}`}>Notifications</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`relative flex items-center gap-2 pb-4 pt-5 border-b-[2px] ${activeTab === 'billing' ? 'border-primary text-primary' : 'border-transparent text-slate-500  hover:border-gray-300 :border-gray-600'} transition-all`}
                        >
                            <span className={`text-sm ${activeTab === 'billing' ? 'font-bold' : 'font-medium'}`}>Billing</span>
                        </button>
                    </div>
                </div>

                {/* Active Tab Content: Profile */}
                {activeTab === 'profile' && (
                    <div className="p-6 sm:p-8 flex flex-col gap-8">
                        {/* Section: Avatar */}
                        <div className="flex flex-col gap-6 border-b border-gray-100  pb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 ">Public Profile</h3>
                                <p className="text-sm text-slate-500 ">This information will be displayed on your public profile.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="relative h-20 w-20 rounded-full border-2 border-gray-100  overflow-hidden shadow-sm bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[40px]">person</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button className="inline-flex items-center justify-center rounded-lg bg-white  px-3 py-2 text-sm font-semibold text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 :bg-gray-700">Change</button>
                                        <button className="inline-flex items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 :bg-red-900/20">Remove</button>
                                    </div>
                                    <p className="text-xs text-slate-400">Recommended: 400x400px. JPG or PNG.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Form */}
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 " htmlFor="first-name">First name</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                                            id="first-name"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 " htmlFor="last-name">Last name</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                                            id="last-name"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 " htmlFor="email">Email address</label>
                                    <div className="mt-2 relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 ">This email will be used for account notifications.</p>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 " htmlFor="job-title">Job Title</label>
                                    <div className="mt-2">
                                        <input
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                                            id="job-title"
                                            type="text"
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 " htmlFor="bio">Bio</label>
                                    <div className="mt-2">
                                        <textarea
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                                            id="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 ">Brief description for your profile. URLs are hyperlinked.</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-x-4 border-t border-gray-100  pt-6">
                                <button className="text-sm font-semibold leading-6 text-slate-900  hover:text-primary transition-colors" type="button">Cancel</button>
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

                {activeTab === 'notifications' && (
                    <div className="p-6 sm:p-8">
                        <p className="text-slate-500">Notification settings coming soon...</p>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100  pb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 ">Subscription Plan</h3>
                                <p className="text-sm text-slate-500 ">Manage your subscription and billing details.</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-violet-50  px-3 py-1 text-sm font-bold text-primary ring-1 ring-inset ring-violet-700/10  capitalize">
                                {planInfo?.effectivePlan || 'Free'} Plan
                            </span>
                        </div>

                        <div className="bg-slate-50  rounded-xl p-6 border border-slate-100  flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white  rounded-lg flex items-center justify-center shadow-sm border border-slate-100 ">
                                    <span className="material-symbols-outlined text-primary">credit_card</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 ">Billing Portal</h4>
                                    <p className="text-sm text-slate-500 ">View invoices, update payment methods, and change plans.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/billing')}
                                className="w-full sm:w-auto px-6 py-2.5 bg-white  border border-slate-200  rounded-lg text-slate-700  font-bold hover:bg-slate-50 :bg-slate-700 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Manage Subscription
                            </button>
                        </div>

                        <div className="p-4 rounded-xl border border-dashed border-slate-200 flex items-start gap-3 text-sm text-slate-500">
                            <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">info</span>
                            <span>Your payment method, next invoice date, and billing history are managed securely through the Billing Portal. Click <strong>Manage Subscription</strong> above to view them.</span>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Settings;
