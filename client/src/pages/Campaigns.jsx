import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CampaignCard from '../components/CampaignCard';
import LockedFeature from '../components/LockedFeature';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

const Campaigns = () => {
    const navigate = useNavigate();
    const { token, planInfo } = useAuth();
    const { showSuccess, showError } = useToast();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [creating, setCreating] = useState(false);

    // Edit/Rename State
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [renaming, setRenaming] = useState(false);

    useEffect(() => {
        if (planInfo?.features?.campaigns) {
            fetchCampaigns();
        } else {
            setLoading(false);
        }
    }, [planInfo]);

    const fetchCampaigns = async () => {
        try {
            const response = await apiGet('/api/campaigns', token);

            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            } else {
                showError('Failed to load campaigns');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            showError('Error loading campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();

        if (!newCampaignName.trim()) {
            showError('Please enter a campaign name');
            return;
        }

        setCreating(true);

        try {
            const response = await apiPost('/api/campaigns', { name: newCampaignName.trim() }, token);

            if (response.ok) {
                const newCampaign = await response.json();
                setCampaigns([newCampaign, ...campaigns]);
                setNewCampaignName('');
                setShowCreateModal(false);
                showSuccess('Campaign created successfully');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            showError('Error creating campaign');
        } finally {
            setCreating(false);
        }
    };

    const handleRenameCampaign = async (e) => {
        e.preventDefault();

        if (!renameValue.trim()) {
            showError('Please enter a campaign name');
            return;
        }

        setRenaming(true);

        try {
            const response = await apiPut(`/api/campaigns/${editingCampaign.id}`, { name: renameValue.trim() }, token);

            if (response.ok) {
                const updated = await response.json();
                setCampaigns(campaigns.map(c => c.id === updated.id ? { ...c, name: updated.name } : c));
                setShowRenameModal(false);
                setEditingCampaign(null);
                setRenameValue('');
                showSuccess('Campaign renamed successfully');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to rename campaign');
            }
        } catch (error) {
            console.error('Error renaming campaign:', error);
            showError('Error renaming campaign');
        } finally {
            setRenaming(false);
        }
    };

    const handleDeleteCampaign = async (campaign) => {
        if (!confirm(`Are you sure you want to delete "${campaign.name}"? QR codes in this campaign will be preserved but unassigned.`)) {
            return;
        }

        try {
            const response = await apiDelete(`/api/campaigns/${campaign.id}`, token);

            if (response.ok) {
                setCampaigns(campaigns.filter(c => c.id !== campaign.id));
                showSuccess('Campaign deleted');
            } else {
                showError('Failed to delete campaign');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            showError('Error deleting campaign');
        }
    };

    const openRenameModal = (campaign) => {
        setEditingCampaign(campaign);
        setRenameValue(campaign.name);
        setShowRenameModal(true);
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Free plan - show locked state with blurred preview
    if (!planInfo?.features?.campaigns) {
        return (
            <div className="fixed inset-0 z-[100] bg-background-light overflow-hidden">
                {/* Custom CSS for this view */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .grid-bg {
                        background-size: 40px 40px;
                        background-image:
                            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
                    }
                    .locked-overlay {
                        backdrop-filter: blur(8px);
                        background-color: rgba(255, 255, 255, 0.4);
                    }
                `}} />

                {/* Blurred Content Preview */}
                <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 select-none pointer-events-none filter blur-[4px] opacity-70">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-none">
                                Campaign Folders
                            </h2>
                            <p className="text-slate-500 mt-2 text-lg">
                                Organize and track your dynamic QR initiatives across regions and teams.
                            </p>
                        </div>
                        <div className="h-12 w-44 bg-primary rounded-xl"></div>
                    </header>

                    {/* Search Placeholder */}
                    <div className="mb-8">
                        <div className="h-12 w-full max-w-md bg-white rounded-xl border border-slate-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[20px] p-6 shadow-soft border border-slate-100/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <span className="material-symbols-outlined text-primary text-2xl">folder</span>
                                    </div>
                                    <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="h-6 w-40 bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
                                <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-4 mt-6">
                                    <div className="h-10 bg-slate-50 rounded"></div>
                                    <div className="h-10 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100/50 mt-8">
                        <div className="h-[200px] w-full grid-bg rounded-lg border border-slate-50 relative flex items-center justify-center">
                            <div className="text-slate-300 font-bold text-xl uppercase tracking-widest">Global Analytics Preview</div>
                        </div>
                    </div>
                </div>

                {/* Overlaid Locked Interface */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 locked-overlay">
                    <div className="bg-white max-w-md w-full rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-8 md:p-10 text-center relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/5 mb-8 relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                <span className="material-symbols-outlined text-primary text-4xl font-light relative">lock</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                Unlock Global Insights
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-10 text-base">
                                Campaign folders, location deep-dives, and advanced analytics are only available on <span className="font-semibold text-slate-900">Starter</span> and <span className="font-semibold text-slate-900">Pro</span> plans.
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to="/billing"
                                    className="block w-full bg-primary hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-glow active:scale-[0.98]"
                                >
                                    Upgrade to Starter
                                </Link>
                                <Link to="/billing" className="block text-slate-500 hover:text-primary font-medium text-sm transition-colors py-2">
                                    Compare Plans
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">Secure Professional Billing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl">
                {/* Page Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-5 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 w-44 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                </div>

                {/* Search Skeleton */}
                <div className="mb-8">
                    <div className="h-12 w-full max-w-md bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                </div>

                {/* Section Title Skeleton */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                </div>

                {/* Campaign Cards Skeleton Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm animate-pulse">
                            <div className="flex flex-col gap-4">
                                <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                                <div>
                                    <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-y border-slate-50 dark:border-slate-800 py-4 mt-6">
                                <div>
                                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                    <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                    <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        Campaign Folders
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Organize and track your dynamic QR initiatives across regions and teams.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                >
                    <span className="material-symbols-outlined">add</span>
                    Create Campaign
                </button>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white placeholder-slate-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Search folders by name..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {searchQuery ? 'Search Results' : 'Your Campaigns'}
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500">
                        {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'Folder' : 'Folders'}
                    </span>
                </h3>
            </div>

            {/* Campaigns Grid */}
            {filteredCampaigns.length === 0 ? (
                <div className="text-center py-16">
                    <div className="size-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-slate-400">folder_off</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {searchQuery ? 'No campaigns found' : 'No campaigns yet'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        {searchQuery
                            ? 'Try a different search term'
                            : 'Create your first campaign to organize your QR codes'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create Your First Campaign
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map(campaign => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onRename={openRenameModal}
                            onDelete={handleDeleteCampaign}
                        />
                    ))}

                    {/* Create New Card */}
                    <div
                        onClick={() => setShowCreateModal(true)}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[300px]"
                    >
                        <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">Create New Folder</p>
                            <p className="text-sm">Categorize your next launch</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create Campaign</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateCampaign}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                                    placeholder="e.g. Summer Sale 2024"
                                    value={newCampaignName}
                                    onChange={(e) => setNewCampaignName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !newCampaignName.trim()}
                                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {creating ? 'Creating...' : 'Create Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rename Campaign Modal */}
            {showRenameModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Rename Folder</h3>
                            <button
                                onClick={() => setShowRenameModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleRenameCampaign}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Folder Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                                    placeholder="e.g. Summer Sale 2024"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRenameModal(false)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={renaming || !renameValue.trim()}
                                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {renaming ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
