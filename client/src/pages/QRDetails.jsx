import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';
import VariantList from '../components/VariantList';
import LockedFeature from '../components/LockedFeature';
import ScheduleList from '../components/ScheduleList';
import ConfirmationModal from '../components/ConfirmationModal';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

const QRDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, planInfo } = useAuth();
    const { showSuccess, showError } = useToast();
    const [qr, setQr] = useState(null);
    const [stats, setStats] = useState({
        totalScans: 0,
        uniqueScans: 0,
        scansOverTime: [],
        deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
        recentScans: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(7);
    const [showRangeMenu, setShowRangeMenu] = useState(false);

    // Rename State
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const [renaming, setRenaming] = useState(false);

    // Edit State
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editUrl, setEditUrl] = useState('');
    const [editCampaignId, setEditCampaignId] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // A/B Testing State
    const [abTestingEnabled, setAbTestingEnabled] = useState(false);
    const [variants, setVariants] = useState([]);
    const [loadingVariants, setLoadingVariants] = useState(false);

    // Scheduling State
    const [schedulingEnabled, setSchedulingEnabled] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);

    // Delete Confirmation State
    const [deleteVariantConfirmation, setDeleteVariantConfirmation] = useState({ isOpen: false, variantId: null });
    const [deleteScheduleConfirmation, setDeleteScheduleConfirmation] = useState({ isOpen: false, scheduleId: null });

    // Download State
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [downloadSize, setDownloadSize] = useState('1024');

    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = React.useRef(null);

    const isBrandingUnlocked = planInfo?.features?.branding;

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);
        }
    };

    // Fetch campaigns for dropdown
    useEffect(() => {
        if (token && planInfo?.features?.campaigns) {
            apiGet('/api/campaigns', token)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch campaigns');
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) setCampaigns(data);
                })
                .catch(err => console.error('Error fetching campaigns:', err));
        }
    }, [token, planInfo]);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch QR Details
                const qrRes = await apiGet(`/api/qrs/${id}`, token);
                if (qrRes.ok) {
                    const qrData = await qrRes.json();
                    setQr(qrData);
                    setEditUrl(qrData.destination_url);
                    setEditCampaignId(qrData.campaign_id || '');

                    // Check if we should auto-enable edit mode
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('edit') === 'true') {
                        setIsEditing(true);
                    }
                } else {
                    console.error('Failed to fetch QR details');
                }

                // Always fetch Variants and Schedules - backend handles authorization
                // This ensures data loads even if planInfo hasn't loaded yet
                fetchVariants();
                fetchSchedules();

                // Fetch Stats
                const statsRes = await apiGet(`/api/stats/${id}?days=${dateRange}`, token);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                } else {
                    const errText = await statsRes.text();
                    console.error('Failed to fetch stats:', errText);
                    // Stats will use default empty values
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchData();
        }
    }, [id, token, dateRange]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!qr) return <div className="p-8 text-center text-red-500">QR Code not found.</div>;

    // Helper for chart scaling
    const maxCount = Math.max(...stats.scansOverTime.map(d => d.count), 5);

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalCampaignId = editCampaignId;

            // Handle inline campaign creation
            if (isCreatingCampaign && planInfo?.features?.campaigns) {
                if (!newCampaignName.trim()) {
                    showError('Campaign Name Required');
                    setSaving(false);
                    return;
                }

                try {
                    const campaignRes = await apiPost('/api/campaigns', { name: newCampaignName }, token);

                    if (!campaignRes.ok) {
                        throw new Error('Failed to create campaign');
                    }

                    const newCampaign = await campaignRes.json();
                    finalCampaignId = newCampaign.id;
                    // Update local campaigns list
                    setCampaigns([...campaigns, newCampaign]);
                    showSuccess(`Campaign "${newCampaign.name}" created`);
                } catch (err) {
                    console.error('Campaign creation failed:', err);
                    showError('Failed to create campaign');
                    setSaving(false);
                    return;
                }
            }

            // Validate URL before saving
            if (!validateUrl(editUrl)) {
                showError('Please enter a valid URL (http:// or https://)');
                setSaving(false);
                return;
            }

            // Normalize URL (add https:// if missing)
            const normalizedUrl = normalizeUrl(editUrl);

            const response = await apiPut(`/api/qrs/${id}`, {
                destination_url: normalizedUrl,
                campaign_id: finalCampaignId
            }, token);

            if (response.ok) {
                const updatedCampaignName = isCreatingCampaign
                    ? newCampaignName
                    : campaigns.find(c => c.id === Number(finalCampaignId))?.name || qr.campaign_name;

                setQr({
                    ...qr,
                    destination_url: normalizedUrl,
                    campaign_id: finalCampaignId,
                    campaign_name: updatedCampaignName
                });
                setIsEditing(false);
                setIsCreatingCampaign(false);
                setNewCampaignName('');
                showSuccess('QR details updated successfully');
            } else {
                showError('Failed to update details');
            }
        } catch (error) {
            showError('An error occurred while updating details');
        } finally {
            setSaving(false);
        }
    };

    const handleRenameSave = async () => {
        if (!renameValue.trim()) return;
        setRenaming(true);
        try {
            const response = await apiPut(`/api/qrs/${id}`, { name: renameValue }, token);

            if (response.ok) {
                setQr({ ...qr, name: renameValue });
                setIsRenaming(false);
                showSuccess('QR renamed successfully');
            } else {
                showError('Failed to rename QR');
            }
        } catch (error) {
            showError('An error occurred while renaming');
        } finally {
            setRenaming(false);
        }
    };

    // A/B Testing Functions
    async function fetchVariants() {
        setLoadingVariants(true);
        try {
            const response = await apiGet(`/api/qrs/${id}/variants`, token);

            if (response.ok) {
                const data = await response.json();
                setVariants(data.variants || []);
                setAbTestingEnabled(data.ab_testing_enabled || false);
            } else {
                console.error('❌ Failed to fetch variants, status:', response.status);
            }
        } catch (error) {
            console.error('❌ Error fetching variants:', error);
        } finally {
            setLoadingVariants(false);
        }
    }

    const handleToggleABTesting = async () => {
        try {
            // Use standard PUT endpoint to update QR
            const response = await apiPut(`/api/qrs/${id}`, { ab_testing_enabled: !abTestingEnabled }, token);

            if (response.ok) {
                const data = await response.json();
                setAbTestingEnabled(data.ab_testing_enabled);
                // Also update local QR state to reflect change
                setQr(prev => ({ ...prev, ab_testing_enabled: data.ab_testing_enabled }));
                showSuccess(data.ab_testing_enabled ? 'A/B Testing Enabled' : 'A/B Testing Disabled');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to toggle A/B testing');
            }
        } catch (error) {
            console.error('Error toggling A/B testing:', error);
            showError('Error toggling A/B testing');
        }
    };

    const handleAddVariant = async () => {
        try {
            const response = await apiPost(`/api/qrs/${id}/variants`, {
                destination_url: 'https://example.com',
                weight: 50,
                label: `Variant ${variants.length + 1}`
            }, token);

            if (response.ok) {
                const newVariant = await response.json();
                setVariants([...variants, newVariant]);
                showSuccess('Variant added');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to add variant');
            }
        } catch (error) {
            console.error('Error adding variant:', error);
            showError('Error adding variant');
        }
    };

    const handleUpdateVariant = async (variantId, updates) => {
        try {
            const response = await apiPut(`/api/qrs/${id}/variants/${variantId}`, updates, token);

            if (response.ok) {
                const updatedVariant = await response.json();
                setVariants(variants.map(v => v.id === variantId ? updatedVariant : v));
                showSuccess('Variant updated');
            } else {
                showError('Failed to update variant');
            }
        } catch (error) {
            console.error('Error updating variant:', error);
            showError('Error updating variant');
        }
    };

    const handleDeleteVariant = (variantId) => {
        setDeleteVariantConfirmation({ isOpen: true, variantId });
    };

    const confirmDeleteVariant = async () => {
        const variantId = deleteVariantConfirmation.variantId;
        setDeleteVariantConfirmation({ isOpen: false, variantId: null });

        try {
            const response = await apiDelete(`/api/qrs/${id}/variants/${variantId}`, token);

            if (response.ok) {
                setVariants(variants.filter(v => v.id !== variantId));
                showSuccess('Variant deleted');

                // If less than 2 variants, disable A/B testing
                if (variants.length <= 2 && abTestingEnabled) {
                    setAbTestingEnabled(false);
                }
            } else {
                showError('Failed to delete variant');
            }
        } catch (error) {
            console.error('Error deleting variant:', error);
            showError('Error deleting variant');
        }
    };

    // Scheduling Functions
    async function fetchSchedules() {
        setLoadingSchedules(true);
        try {
            const response = await apiGet(`/api/qrs/${id}/schedules`, token);

            if (response.ok) {
                const data = await response.json();
                setSchedules(data.schedules || []);
                setSchedulingEnabled(data.scheduling_enabled || false);
            } else {
                console.error('❌ Failed to fetch schedules, status:', response.status);
            }
        } catch (error) {
            console.error('❌ Error fetching schedules:', error);
        } finally {
            setLoadingSchedules(false);
        }
    }

    const handleToggleScheduling = async () => {
        try {
            // Use standard PUT endpoint
            const response = await apiPut(`/api/qrs/${id}`, { scheduling_enabled: !schedulingEnabled }, token);

            if (response.ok) {
                const data = await response.json();
                setSchedulingEnabled(data.scheduling_enabled);
                setQr(prev => ({ ...prev, scheduling_enabled: data.scheduling_enabled }));

                // If scheduling enabled, logic might auto-disable AB testing if backend enforces it? 
                // Backend qrs.supabase.js doesn't auto-disable, but they might be mutually exclusive in UI logic?
                // Backend: scheduling takes priority, but both can be true.

                showSuccess(data.scheduling_enabled ? 'Scheduling Enabled' : 'Scheduling Disabled');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to toggle scheduling');
            }
        } catch (error) {
            console.error('Error toggling scheduling:', error);
            showError('Error toggling scheduling');
        }
    };

    const handleAddSchedule = async (scheduleData) => {
        try {
            const response = await apiPost(`/api/qrs/${id}/schedules`, scheduleData, token);

            if (response.ok) {
                // Refetch all schedules to ensure UI is in sync with server
                await fetchSchedules();

                showSuccess('Schedule added');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to add schedule');
            }
        } catch (error) {
            console.error('Error adding schedule:', error);
            showError('Error adding schedule');
        }
    };

    const handleUpdateSchedule = async (scheduleId, updates) => {
        try {
            const response = await apiPut(`/api/qrs/${id}/schedules/${scheduleId}`, updates, token);

            if (response.ok) {
                // Refetch all schedules to ensure UI is in sync with server
                await fetchSchedules();
                showSuccess('Schedule updated');
            } else {
                const error = await response.json();
                showError(error.error || 'Failed to update schedule');
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
            showError('Error updating schedule');
        }
    };

    const handleDeleteSchedule = (scheduleId) => {
        setDeleteScheduleConfirmation({ isOpen: true, scheduleId });
    };

    const confirmDeleteSchedule = async () => {
        const scheduleId = deleteScheduleConfirmation.scheduleId;
        setDeleteScheduleConfirmation({ isOpen: false, scheduleId: null });

        try {
            const response = await apiDelete(`/api/qrs/${id}/schedules/${scheduleId}`, token);

            if (response.ok) {
                // Refetch all schedules to ensure UI is in sync with server
                await fetchSchedules();
                showSuccess('Schedule deleted');
            } else {
                showError('Failed to delete schedule');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            showError('Error deleting schedule');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-slate-500">
                <ol className="flex items-center gap-2">
                    <li><Link to="/" className="hover:text-primary transition-colors">Dashboard</Link></li>
                    <li className="flex items-center"><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li><Link to="/" className="hover:text-primary transition-colors">My QRs</Link></li>
                    <li className="flex items-center"><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
                    <li className="text-slate-900 dark:text-white font-medium">{qr.name}</li>
                </ol>
            </nav>

            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        {isRenaming ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="text-3xl font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-1 w-full max-w-md shadow-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameSave();
                                        if (e.key === 'Escape') setIsRenaming(false);
                                    }}
                                />
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleRenameSave}
                                        disabled={renaming}
                                        className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[24px]">check</span>
                                    </button>
                                    <button
                                        onClick={() => setIsRenaming(false)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[24px]">close</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{qr.name}</h2>
                                <button
                                    onClick={() => {
                                        setRenameValue(qr.name);
                                        setIsRenaming(true);
                                    }}
                                    className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${qr.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-800'}`}>
                            <span className={`size-1.5 rounded-full ${qr.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                            {qr.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-slate-500">Created {new Date(qr.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold shadow-sm shadow-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">link</span>
                            Edit Destination
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setIsEditing(false); setEditUrl(qr.destination_url); }}
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Row - At Top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Scans */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                    <div className="flex items-start justify-between">
                        <span className="text-slate-500 text-sm font-medium">Total Scans</span>
                        <span className="p-1.5 rounded-md bg-purple-50 text-primary dark:bg-primary/10">
                            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                        </span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalScans}</span>
                        <span className="text-xs text-slate-400 ml-2">Lifetime scans</span>
                    </div>
                </div>

                {/* Unique IPs */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500 text-sm font-medium">Unique IPs</span>
                            <span className="material-symbols-outlined text-slate-400 text-[14px] cursor-help" title="Count of distinct IP addresses. Users on shared networks are counted as one.">
                                help_outline
                            </span>
                        </div>
                        <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[20px]">person_outline</span>
                        </span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.uniqueScans}</span>
                    </div>
                </div>

                {/* Top Location */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                    <div className="flex items-start justify-between">
                        <span className="text-slate-500 text-sm font-medium">Top Location</span>
                        <span className="p-1.5 rounded-md bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                            <span className="material-symbols-outlined text-[20px]">public</span>
                        </span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white truncate block">
                            {stats.topLocation || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Edit Details */}
                <div className="lg:col-span-7 space-y-6">
                    {/* QR Details Card */}
                    <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <h3 className="font-bold text-slate-900 dark:text-white">QR Details</h3>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                    title="Edit Details"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Destination URL */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Destination URL</label>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="example.com"
                                        />

                                        {/* Campaign Selection in Edit Mode */}
                                        {planInfo?.features?.campaigns && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Campaign</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                                                        className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 uppercase tracking-wider"
                                                    >
                                                        {isCreatingCampaign ? (
                                                            <>
                                                                <span className="material-symbols-outlined text-[12px]">list</span>
                                                                Select Existing
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="material-symbols-outlined text-[12px]">add</span>
                                                                Create New
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {isCreatingCampaign ? (
                                                    <div className="animate-fadeIn">
                                                        <input
                                                            className="w-full rounded-lg border border-primary bg-primary/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary transition-shadow"
                                                            placeholder="Enter new campaign name..."
                                                            type="text"
                                                            value={newCampaignName}
                                                            onChange={(e) => setNewCampaignName(e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCampaignDropdownOpen(!isCampaignDropdownOpen)}
                                                            className="w-full relative rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 pr-10 text-left text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900"
                                                        >
                                                            <span className={`block truncate ${!editCampaignId ? 'text-slate-400' : ''}`}>
                                                                {editCampaignId && Array.isArray(campaigns)
                                                                    ? campaigns.find(c => c.id === Number(editCampaignId))?.name || 'Select a Campaign...'
                                                                    : 'Select a Campaign...'}
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                                                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isCampaignDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                                            </span>
                                                        </button>

                                                        {isCampaignDropdownOpen && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setIsCampaignDropdownOpen(false)}></div>
                                                                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-100 dark:border-slate-700">
                                                                    {Array.isArray(campaigns) && campaigns.length > 0 ? (
                                                                        campaigns.map((camp) => (
                                                                            <button
                                                                                key={camp.id}
                                                                                type="button"
                                                                                className={`relative w-full cursor-pointer select-none py-2.5 pl-4 pr-9 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${Number(editCampaignId) === camp.id
                                                                                    ? 'bg-primary/5 text-primary font-medium'
                                                                                    : 'text-slate-900 dark:text-white'
                                                                                    }`}
                                                                                onClick={() => {
                                                                                    setEditCampaignId(camp.id);
                                                                                    setIsCampaignDropdownOpen(false);
                                                                                }}
                                                                            >
                                                                                <span className="block truncate">{camp.name}</span>
                                                                                {Number(editCampaignId) === camp.id && (
                                                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                                                                        <span className="material-symbols-outlined text-[20px]">check</span>
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                        ))
                                                                    ) : null}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 justify-end mt-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditUrl(qr.destination_url);
                                                    setEditCampaignId(qr.campaign_id || '');
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">link</span>
                                        <a
                                            href={qr.destination_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline truncate flex-1"
                                        >
                                            {qr.destination_url}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Campaign Display (Only shown when not editing) */}
                            {!isEditing && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Campaign</label>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">folder</span>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {qr.campaign_name || 'No Campaign'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Summary Widget */}
                    <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Performance Summary</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Avg. Daily Scans</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{Math.round((stats?.totalScans || 0) / 30)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Peak Day Scans</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    {(stats?.scansOverTime && stats.scansOverTime.length > 0)
                                        ? Math.max(...stats.scansOverTime.map(d => d?.scans || 0))
                                        : 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Unique Ratio</span>
                                    <span className="material-symbols-outlined text-slate-400 text-[12px] cursor-help" title="Percentage of scans from unique IPs">
                                        help_outline
                                    </span>
                                </div>
                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {(stats?.totalScans || 0) > 0 ? Math.round(((stats?.uniqueScans || 0) / stats.totalScans) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: QR Preview & Actions (Sticky) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-6 z-30">
                        {/* QR Preview & Download Card */}
                        <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {/* QR Preview Section */}
                            <div className="p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 rounded-t-xl">
                                <div className="relative p-4 bg-white rounded-xl shadow-sm">
                                    <img
                                        alt="QR Code"
                                        className="size-48 object-contain"
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${import.meta.env.VITE_API_BASE_URL}/r/${qr.short_code}`)}`}
                                    />
                                    {/* Logo Overlay */}
                                    {logoPreview && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-1">
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Download Section */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Download Options</h4>

                                {/* Format Selection */}
                                <div className="flex gap-2 mb-3">
                                    {['png', 'svg', 'pdf'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => {
                                                if (format !== 'png' && !planInfo?.features?.svg_pdf_downloads) {
                                                    navigate('/billing');
                                                    return;
                                                }
                                                setDownloadFormat(format);
                                            }}
                                            className={`flex-1 text-xs font-medium px-3 py-2 rounded transition-all uppercase flex items-center justify-center gap-1 ${downloadFormat === format
                                                ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {format}
                                            {format !== 'png' && !planInfo?.features?.svg_pdf_downloads && <span className="material-symbols-outlined text-[10px]">lock</span>}
                                        </button>
                                    ))}
                                </div>

                                {/* PNG Size Dropdown */}
                                {downloadFormat === 'png' && (
                                    <div className="relative mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                                            className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 pl-4 pr-10 text-left text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        >
                                            <span className="block truncate">Size: {downloadSize} x {downloadSize} px</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform duration-200 ${isSizeDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                            </span>
                                        </button>

                                        {isSizeDropdownOpen && (
                                            <div className="absolute z-[100] mt-2 w-full overflow-hidden rounded-xl bg-white dark:bg-[#1e1726] py-1 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                                                {['256', '512', '1024', '2048'].map((size) => (
                                                    <div
                                                        key={size}
                                                        className={`relative cursor-pointer select-none py-3 pl-4 pr-9 transition-colors ${downloadSize === size
                                                            ? 'bg-primary/5 text-primary font-semibold'
                                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                            }`}
                                                        onClick={() => {
                                                            setDownloadSize(size);
                                                            setIsSizeDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className="block truncate">{size} x {size} px</span>
                                                        {downloadSize === size && (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Download Button */}
                                <button
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                                    onClick={async () => {
                                        if (downloadFormat !== 'png' && !planInfo?.features?.svg_pdf_downloads) {
                                            navigate('/billing');
                                            return;
                                        }

                                        try {
                                            let apiFormat = downloadFormat === 'svg' ? 'svg' : 'png';
                                            let extension = downloadFormat;
                                            let sizeParam = downloadFormat === 'png' ? `${downloadSize}x${downloadSize}` : '1024x1024';

                                            const encodedData = encodeURIComponent(`${import.meta.env.VITE_API_BASE_URL}/r/${qr.short_code}`);
                                            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${sizeParam}&data=${encodedData}&format=${apiFormat}`;

                                            const response = await fetch(url);
                                            const blob = await response.blob();
                                            const blobUrl = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = blobUrl;
                                            link.download = `qrcode.${extension}`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(blobUrl);

                                            showSuccess(`QR downloaded as ${downloadFormat.toUpperCase()}`);
                                        } catch (e) {
                                            console.error('Download failed', e);
                                            showError('Download failed');
                                        }
                                    }}
                                >
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    Download {downloadFormat.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6">
                {/* Chart Card */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Scan Performance</h3>
                            <p className="text-sm text-slate-500">Total scans over the last {dateRange} days</p>
                        </div>
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                                onClick={() => setShowRangeMenu(!showRangeMenu)}
                            >
                                <span>Last {dateRange} Days</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {showRangeMenu && (
                                <div className="absolute top-full mt-2 right-0 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1">
                                    <button onClick={() => { setDateRange(7); setShowRangeMenu(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700">7 Days</button>
                                    <button onClick={() => { setDateRange(30); setShowRangeMenu(false); }} className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700">30 Days</button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="h-64 w-full flex items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 relative pt-10">
                        {stats.scansOverTime.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group relative z-10 h-full justify-end">
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary/50 rounded-t-sm transition-all relative group-hover:shadow-lg"
                                    style={{ height: `${(day.count / maxCount) * 100}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e1726] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl px-4 py-3 pointer-events-none transition-opacity backdrop-blur-sm whitespace-nowrap">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {day.count}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {day.count === 1 ? 'scan' : 'scans'}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 truncate w-full text-center">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </div>
                        ))}
                        {stats.scansOverTime.length === 0 && <div className="w-full text-center text-slate-400 absolute top-1/2">No scan data for this period</div>}
                    </div>
                </div>

                {/* Detailed Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Device Types */}
                    <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Device Types</h4>
                        <div className="space-y-3">
                            {Object.entries(stats.deviceStats).map(([device, percent]) => {
                                // Backend already returns percentages, use them directly
                                let color = 'bg-primary';
                                if (device === 'Desktop') color = 'bg-blue-400';
                                if (device === 'Tablet') color = 'bg-emerald-400';

                                return (
                                    <div key={device}>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                                                    {device === 'Mobile' ? 'smartphone' : device === 'Desktop' ? 'computer' : 'tablet_mac'}
                                                </span>
                                                <span className="text-slate-600 dark:text-slate-300">{device}</span>
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">{percent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1">
                                            <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Scans Table */}
                    <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[400px]">
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Scans</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-5 py-3 font-medium text-slate-500">Time</th>
                                        <th className="px-5 py-3 font-medium text-slate-500">Device</th>
                                        <th className="px-5 py-3 font-medium text-slate-500">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.recentScans.map((scan, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                {new Date(scan.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                                    <span className="material-symbols-outlined text-[16px] text-slate-400">devices</span>
                                                    {scan.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{scan.location || 'Unknown'}</td>
                                        </tr>
                                    ))}
                                    {stats.recentScans.length === 0 && (
                                        <tr><td colSpan="3" className="px-5 py-8 text-center text-slate-400">No recent scans</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Widgets Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* Scheduled Redirects Section */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">schedule</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Scheduled Redirects</h3>
                        </div>
                        {planInfo?.features?.scheduling && (
                            <label
                                className="relative inline-flex items-center cursor-pointer"
                                title={abTestingEnabled ? "Disable A/B testing to use scheduling" : "Enable Scheduled Redirects"}
                            >
                                <input
                                    type="checkbox"
                                    checked={schedulingEnabled}
                                    onChange={handleToggleScheduling}
                                    disabled={abTestingEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                            </label>
                        )}
                    </div>

                    {
                        planInfo?.features?.scheduling ? (
                            <>
                                {abTestingEnabled && (
                                    <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">warning</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                    Disable A/B testing to use scheduled redirects
                                                </p>
                                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                                    Scheduling and A/B testing cannot be active at the same time
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {schedulingEnabled && (
                                    <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">info</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    This QR changes destination based on time
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                    Redirects are selected in real-time based on current date/time
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ScheduleList
                                    schedules={schedules}
                                    onUpdate={handleUpdateSchedule}
                                    onDelete={handleDeleteSchedule}
                                    onAdd={handleAddSchedule}
                                />
                            </>
                        ) : (
                            <LockedFeature
                                feature="Scheduled Redirects"
                                requiredPlan="starter"
                                description="Automatically change destination at specific times. Perfect for time-limited campaigns and product launches."
                            />
                        )}
                </div>

                {/* A/B Testing Section */}
                <div className="bg-white dark:bg-[#1e1726] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">science</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">A/B Destination Testing</h3>
                        </div>
                        {planInfo?.features?.ab_testing && (
                            <label
                                className="relative inline-flex items-center cursor-pointer"
                                title={schedulingEnabled ? "Disable scheduling to use A/B testing" : "Enable A/B Destination Testing"}
                            >
                                <input
                                    type="checkbox"
                                    checked={abTestingEnabled}
                                    onChange={handleToggleABTesting}
                                    disabled={schedulingEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                            </label>
                        )}
                    </div>

                    {
                        planInfo?.features?.ab_testing ? (
                            <>
                                {abTestingEnabled && (
                                    <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">info</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    This QR routes traffic to multiple destinations
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                    Each scan is randomly assigned to a variant based on configured weights
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <VariantList
                                    variants={variants}
                                    onUpdate={handleUpdateVariant}
                                    onDelete={handleDeleteVariant}
                                    onAdd={handleAddVariant}
                                />
                            </>
                        ) : (
                            <LockedFeature
                                feature="A/B Destination Testing"
                                requiredPlan="pro"
                                description="Test multiple landing pages with one QR code. Route traffic by weight and measure performance."
                            />
                        )}
                </div>
            </div>

            {/* Variant Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteVariantConfirmation.isOpen}
                onClose={() => setDeleteVariantConfirmation({ isOpen: false, variantId: null })}
                onConfirm={confirmDeleteVariant}
                title="Delete Variant"
                message="Are you sure you want to delete this variant? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />

            {/* Schedule Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteScheduleConfirmation.isOpen}
                onClose={() => setDeleteScheduleConfirmation({ isOpen: false, scheduleId: null })}
                onConfirm={confirmDeleteSchedule}
                title="Delete Schedule"
                message="Are you sure you want to delete this schedule? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default QRDetails;
