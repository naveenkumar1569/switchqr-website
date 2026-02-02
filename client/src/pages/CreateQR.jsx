
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';
import { apiGet, apiPost } from '../utils/api';
import VariantList from '../components/VariantList';

const CreateQR = () => {
    const navigate = useNavigate();
    const { token, planInfo } = useAuth();
    const { showWarning, showError, showInfo, showSuccess } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        destination_url: '',
        color: '#7426d9',
        campaign_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [utmOpen, setUtmOpen] = useState(true);
    const [activeCustomizationTab, setActiveCustomizationTab] = useState('design');
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [downloadSize, setDownloadSize] = useState('512');
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [urlError, setUrlError] = useState('');
    const [utmData, setUtmData] = useState({
        source: '',
        medium: '',
        campaign: ''
    });
    const [abTestingEnabled, setAbTestingEnabled] = useState(false);
    const [scanTrackingEnabled, setScanTrackingEnabled] = useState(true);
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');

    const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = React.useRef(null);

    // Inline A/B Testing State
    const [pendingVariants, setPendingVariants] = useState([]);

    const isBrandingUnlocked = planInfo?.features?.branding;

    const handleAddVariant = () => {
        const newVariant = {
            id: Date.now(),
            destination_url: '',
            weight: 50,
            label: `Variant ${pendingVariants.length + 1}`
        };
        setPendingVariants([...pendingVariants, newVariant]);
    };

    const handleUpdateVariant = (id, updates) => {
        setPendingVariants(pendingVariants.map(v => v.id === id ? { ...v, ...updates } : v));
    };

    const handleDeleteVariant = (id) => {
        setPendingVariants(pendingVariants.filter(v => v.id !== id));
    };

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
                .catch(err => console.error('[CreateQR] Failed to fetch campaigns', err));
        }
    }, [token, planInfo]);

    // Check for campaign_id in URL
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const campaignId = params.get('campaign_id');
            if (campaignId) {
                setFormData(prev => ({ ...prev, campaign_id: Number(campaignId) }));
            }
        } catch (e) {
            console.error('[CreateQR] Error parsing URL params:', e);
        }
    }, []);

    const handleUtmChange = (e) => {
        setUtmData({ ...utmData, [e.target.name]: e.target.value });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (e.target.id === 'destination_url') setUrlError('');
    };

    // Bind color picker specifically
    const handleColorChange = (e) => {
        setFormData({ ...formData, color: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        // Validate URL before submission
        if (formData.destination_url && !validateUrl(formData.destination_url)) {
            setUrlError('Please enter a valid URL');
            showError('Invalid URL', { description: 'Please check the Destination URL format.' });
            return;
        }

        // Validate A/B variants if enabled
        if (abTestingEnabled && pendingVariants.length > 0) {
            const totalWeight = pendingVariants.reduce((sum, v) => sum + (v.weight || 0), 0);
            if (totalWeight > 100) {
                showError('Invalid A/B Configuration', { description: 'Total variant weight cannot exceed 100%.' });
                return;
            }

            // Check for valid URLs in variants
            for (const v of pendingVariants) {
                if (v.destination_url && !validateUrl(v.destination_url)) {
                    showError('Invalid Variant URL', { description: `Invalid URL in ${v.label || 'variant'}` });
                    return;
                }
            }
        }

        if (!token) {
            showError('Authentication Required', { description: 'You are not logged in. Please log in again.' });
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            // Use plan info from context with safe defaults for graceful degradation
            // This ensures QR creation never blocks on plan loading
            const QR_LIMIT = planInfo?.qr_limit ?? 5; // Default to free tier limit
            const currentCount = planInfo?.qr_count ?? 0;
            const planName = planInfo?.plan ?? 'free';

            // Show info if using degraded defaults
            if (!planInfo) {
                showInfo('Creating with default limits', {
                    description: 'Plan info unavailable. Using free tier limits.'
                });
            }

            if (currentCount >= QR_LIMIT) {
                setLoading(false);
                showWarning('Limit Reached', {
                    description: `You've reached the limit of ${QR_LIMIT} active QR codes on the ${planName.charAt(0).toUpperCase() + planName.slice(1)} plan. Please pause an existing QR or upgrade to create more.`,
                    action: {
                        label: 'Upgrade Plan',
                        onClick: () => navigate('/billing')
                    },
                    duration: 8000
                });
                return;
            }

            // Normalize the destination URL (add https:// if missing)
            let finalDestinationUrl = normalizeUrl(formData.destination_url);
            const utmParams = new URLSearchParams();
            if (utmData.source) utmParams.append('utm_source', utmData.source);
            if (utmData.medium) utmParams.append('utm_medium', utmData.medium);
            if (utmData.campaign) utmParams.append('utm_campaign', utmData.campaign);

            const queryString = utmParams.toString();
            if (queryString) {
                // Check if URL already has query params
                finalDestinationUrl += (finalDestinationUrl.includes('?') ? '&' : '?') + queryString;
            }

            let finalCampaignId = formData.campaign_id || null;

            // Handle inline campaign creation
            if (isCreatingCampaign && planInfo?.features?.campaigns) {
                if (!newCampaignName.trim()) {
                    setLoading(false);
                    showError('Campaign Name Required', { description: 'Please enter a name for the new campaign.' });
                    return;
                }

                try {
                    const campaignRes = await apiPost('/api/campaigns', { name: newCampaignName }, token);

                    if (!campaignRes.ok) {
                        const errData = await campaignRes.json();
                        throw new Error(errData.error || 'Failed to create campaign');
                    }

                    const newCampaign = await campaignRes.json();
                    finalCampaignId = newCampaign.id;
                    showSuccess('Campaign Created', { description: `"${newCampaign.name}" has been created.` });

                } catch (err) {
                    setLoading(false);
                    console.error('Campaign creation failed:', err);
                    showError('Campaign Creation Failed', { description: err.message });
                    return;
                }
            }

            const payload = {
                name: formData.name,
                destination_url: finalDestinationUrl,
                color: formData.color,
                campaign_id: finalCampaignId,
                ab_testing_enabled: abTestingEnabled // Send flag directly on creation
            };


            const response = await apiPost('/api/qrs', payload, token);

            if (response.ok) {
                const responseData = await response.json();

                // If A/B Testing was enabled, configure variants (flag already set in POST)
                if (abTestingEnabled) {
                    try {
                        // Removed redundant toggle call


                        // Create configured variants
                        if (pendingVariants.length > 0) {
                            for (const variant of pendingVariants) {
                                if (variant.destination_url) {
                                    await apiPost(`/api/qrs/${responseData.id}/variants`, {
                                        destination_url: normalizeUrl(variant.destination_url),
                                        weight: variant.weight,
                                        label: variant.label
                                    }, token);
                                }
                            }
                        }

                        showSuccess('QR Created & A/B Testing Configured');
                    } catch (err) {
                        console.error('Failed to enable A/B testing', err);
                        showInfo('QR Created', { description: 'Could not enable A/B testing fully. Please check details.' });
                    }
                } else {
                    showSuccess('QR Created Successfully');
                }

                navigate(`/qrs/${responseData.id}`); // Redirect to details page instead of dashboard for better flow
            } else if (response.status === 403 || response.status === 401) {
                showError('Session Expired', { description: 'Your session has expired. Please log in again.' });
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const responseData = await response.json().catch(() => ({}));
                console.error('Failed to create QR:', responseData);
                showError('Creation Failed', { description: responseData.error || 'Unknown error occurred' });
            }
        } catch (error) {
            console.error('Error creating QR:', error);
            showError('Application Error', { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-dark dark:text-white tracking-tight">Create Dynamic QR</h1>
                <p className="mt-2 text-text-subtle dark:text-gray-400">Configure your new dynamic QR code details and customize its appearance.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Column: Configuration Form */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Basic Details Card */}
                    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
                        <div className="border-b border-border-light dark:border-border-dark px-6 py-4">
                            <h2 className="text-lg font-semibold text-text-dark dark:text-white">Basic Details</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* QR Name */}
                            <div>
                                <label className="block text-sm font-medium text-text-dark dark:text-gray-200 mb-1" htmlFor="name">Internal Name</label>
                                <input
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2d2438] px-4 py-2.5 text-text-dark dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-shadow"
                                    id="name"
                                    placeholder="e.g. Summer Sale Poster A"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Destination URL */}
                            <div>
                                <label className="block text-sm font-medium text-text-dark dark:text-gray-200 mb-1" htmlFor="destination_url">Destination URL</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">link</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border ${urlError ? 'border-error bg-error/5 text-error focus:border-error focus:ring-error' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2d2438] text-text-dark dark:text-white focus:border-primary focus:ring-primary'} pl-10 pr-4 py-2.5 placeholder-gray-400 sm:text-sm transition-all`}
                                        id="destination_url"
                                        placeholder="example.com"
                                        type="text"
                                        value={formData.destination_url}
                                        onChange={handleChange}
                                        onBlur={(e) => {
                                            if (e.target.value && !validateUrl(e.target.value)) {
                                                setUrlError('Please enter a valid URL');
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                {urlError && <p className="mt-1 text-xs text-error font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {urlError}</p>}
                            </div>
                            {/* Campaign Dropdown - Pro Only */}
                            {planInfo?.features?.campaigns && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-medium text-text-dark dark:text-gray-200" htmlFor="campaign_id">Campaign</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                                        >
                                            {isCreatingCampaign ? (
                                                <>
                                                    <span className="material-symbols-outlined text-[14px]">list</span>
                                                    Select Existing
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                                    Create New
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {isCreatingCampaign ? (
                                        <div className="animate-fadeIn">
                                            <input
                                                className="w-full rounded-lg border border-primary bg-primary/5 px-4 py-2.5 text-text-dark dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-shadow"
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
                                                className="w-full relative rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2d2438] px-4 py-2.5 pr-10 text-left text-text-dark dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all shadow-sm hover:bg-gray-50 dark:hover:bg-[#352b42]"
                                            >
                                                <span className={`block truncate ${!formData.campaign_id ? 'text-gray-400' : ''}`}>
                                                    {formData.campaign_id && Array.isArray(campaigns)
                                                        ? campaigns.find(c => c.id === formData.campaign_id)?.name || 'Select a Campaign...'
                                                        : 'Select a Campaign...'}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isCampaignDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                                </span>
                                            </button>

                                            {isCampaignDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setIsCampaignDropdownOpen(false)}></div>
                                                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-[#2d2438] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-100 dark:border-gray-700">
                                                        {Array.isArray(campaigns) && campaigns.length > 0 ? (
                                                            campaigns.map((camp) => (
                                                                <button
                                                                    key={camp.id}
                                                                    type="button"
                                                                    className={`relative w-full cursor-pointer select-none py-2.5 pl-4 pr-9 text-left hover:bg-gray-50 dark:hover:bg-[#352b42] transition-colors ${formData.campaign_id === camp.id
                                                                        ? 'bg-primary/5 text-primary font-medium'
                                                                        : 'text-text-dark dark:text-white'
                                                                        }`}
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, campaign_id: camp.id });
                                                                        setIsCampaignDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className="block truncate">{camp.name}</span>
                                                                    {formData.campaign_id === camp.id && (
                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="py-2.5 px-4 text-gray-400 italic text-sm text-center">No active campaigns found</div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Advanced Options Card */}
                    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm overflow-hidden">
                        {/* UTM Accordion Header */}
                        <button
                            type="button"
                            className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-[#352b42] transition-colors group"
                            onClick={() => setUtmOpen(!utmOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">tune</span>
                                <span className="text-sm font-semibold text-text-dark dark:text-white">UTM Builder & Tracking</span>
                            </div>
                            <span className={`material-symbols-outlined text-gray-400 transition-transform ${utmOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {utmOpen && (
                            <div className="px-6 pb-6 pt-2 border-t border-border-light dark:border-border-dark">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-text-subtle mb-1">Source</label>
                                        <input
                                            name="source"
                                            value={utmData.source}
                                            onChange={handleUtmChange}
                                            className="w-full rounded-md border-gray-200 dark:border-gray-600 bg-[#f9fafb] dark:bg-[#2d2438] px-3 py-2 text-xs text-text-dark dark:text-white focus:border-primary focus:ring-primary"
                                            placeholder="google"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-subtle mb-1">Medium</label>
                                        <input
                                            name="medium"
                                            value={utmData.medium}
                                            onChange={handleUtmChange}
                                            className="w-full rounded-md border-gray-200 dark:border-gray-600 bg-[#f9fafb] dark:bg-[#2d2438] px-3 py-2 text-xs text-text-dark dark:text-white focus:border-primary focus:ring-primary"
                                            placeholder="cpc"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-subtle mb-1">Campaign</label>
                                        <input
                                            name="campaign"
                                            value={utmData.campaign}
                                            onChange={handleUtmChange}
                                            className="w-full rounded-md border-gray-200 dark:border-gray-600 bg-[#f9fafb] dark:bg-[#2d2438] px-3 py-2 text-xs text-text-dark dark:text-white focus:border-primary focus:ring-primary"
                                            placeholder="summer_sale"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {/* Scan Tracking Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-text-dark dark:text-white">Scan Tracking</span>
                                            <span className="text-xs text-text-subtle">Capture device, location, and time data.</span>
                                        </div>
                                        <div className="relative flex items-center">
                                            <input
                                                className="peer sr-only"
                                                id="toggle-tracking"
                                                name="toggle"
                                                type="checkbox"
                                                checked={scanTrackingEnabled}
                                                onChange={(e) => setScanTrackingEnabled(e.target.checked)}
                                            />
                                            <label
                                                htmlFor="toggle-tracking"
                                                className={`relative inline-flex h-6 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${scanTrackingEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                            >
                                                <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${scanTrackingEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                            </label>
                                        </div>
                                    </div>
                                    {/* A/B Testing Toggle (Pro Feature) */}
                                    <div
                                        onClick={() => {
                                            if (planInfo?.features?.ab_testing) {
                                                setAbTestingEnabled(!abTestingEnabled);
                                            } else {
                                                navigate('/billing');
                                            }
                                        }}
                                        className={`flex items-center justify-between transition-all cursor-pointer ${!planInfo?.features?.ab_testing
                                            ? 'p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#352b42]/50 opacity-80 hover:border-primary/50 hover:bg-primary/5'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-text-dark dark:text-white">A/B Testing</span>
                                                {!planInfo?.features?.ab_testing && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase">Pro</span>}
                                                {!planInfo?.features?.ab_testing && <span className="material-symbols-outlined text-xs text-gray-400">lock</span>}
                                            </div>
                                            <span className="text-xs text-text-subtle">Split traffic between two destination URLs.</span>
                                        </div>

                                        <div className={`relative flex items-center ${!planInfo?.features?.ab_testing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <input
                                                className="peer sr-only"
                                                type="checkbox"
                                                checked={abTestingEnabled}
                                                readOnly
                                                disabled={!planInfo?.features?.ab_testing}
                                            />
                                            <div
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${!planInfo?.features?.ab_testing
                                                    ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed'
                                                    : abTestingEnabled ? 'bg-primary cursor-pointer' : 'bg-slate-200 dark:bg-slate-700 cursor-pointer'
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${abTestingEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                                                ></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inline Variant Configuration */}
                                    {abTestingEnabled && planInfo?.features?.ab_testing && (
                                        <div className="mt-6 border-t border-dashed border-gray-200 dark:border-gray-700 pt-6 animate-fadeIn">
                                            <h3 className="text-sm font-semibold text-text-dark dark:text-white mb-4">Experimental Variants</h3>
                                            <VariantList
                                                variants={pendingVariants}
                                                onAdd={handleAddVariant}
                                                onUpdate={handleUpdateVariant}
                                                onDelete={handleDeleteVariant}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                        )}
                    </div>
                </div>

                {/* Right Column: Preview & Customization */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="sticky top-6 flex flex-col gap-6">
                        {/* Preview Card */}
                        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-md overflow-hidden flex flex-col h-full">
                            {/* Design Tab Header */}
                            <div className="flex border-b border-border-light dark:border-border-dark">
                                <div className="flex-1 py-3 text-sm font-medium text-primary border-b-2 border-primary bg-primary/5 text-center">
                                    Design
                                </div>
                            </div>
                            {/* QR Display Area */}
                            <div className="flex-1 flex items-center justify-center bg-[#faf8fb] dark:bg-[#251e2e] p-8 min-h-[300px]">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                    {/* QR Code Placeholder with Real Data if available, else Mock Image */}
                                    <div className="relative w-48 h-48 bg-white" data-alt="QR Code Preview">
                                        <img
                                            alt="QR Code Preview"
                                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-90"
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formData.destination_url || 'https://example.com')}&color=${formData.color.replace('#', '')}`}
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
                            </div>
                            {/* Customization Controls */}
                            <div className="p-6 border-t border-border-light dark:border-border-dark space-y-5 bg-white dark:bg-surface-dark">
                                {/* Color Picker */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-text-subtle mb-3">Brand Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            className="h-10 w-10 cursor-pointer rounded border-0 p-0"
                                            type="color"
                                            value={formData.color}
                                            onChange={handleColorChange}
                                        />
                                        <div className="flex-1">
                                            <input
                                                className="w-full rounded-md border-gray-200 dark:border-gray-600 bg-[#f9fafb] dark:bg-[#2d2438] px-3 py-2 text-sm text-text-dark dark:text-white focus:border-primary uppercase font-mono"
                                                type="text"
                                                value={formData.color}
                                                onChange={handleColorChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        {['#000000', '#2563eb', '#7426d9', '#22c55e', '#ef4444'].map((c) => (
                                            <button
                                                type="button"
                                                key={c}
                                                className={`w-6 h-6 rounded-full hover:scale-110 transition-transform ring-1 ring-offset-2 ring-transparent hover:ring-gray-300 ${formData.color === c ? 'ring-primary ring-2' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => setFormData({ ...formData, color: c })}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                {/* Logo Upload */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-text-subtle">Center Logo</label>
                                        {!isBrandingUnlocked && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-800">
                                                <span className="material-symbols-outlined text-[10px]">lock</span> PRO
                                            </span>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />

                                    <div
                                        onClick={() => {
                                            if (isBrandingUnlocked) {
                                                fileInputRef.current?.click();
                                            } else {
                                                navigate('/billing');
                                            }
                                        }}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-lg p-4 text-center transition-all ${logoPreview
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-primary/50 hover:bg-primary/5'
                                            }`}
                                    >
                                        {!isBrandingUnlocked && (
                                            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button type="button" className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm hover:bg-primary-hover">Unlock Feature</button>
                                            </div>
                                        )}

                                        {logoPreview ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 relative mb-2">
                                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain rounded shadow-sm" />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setLogoPreview(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                                    >
                                                        <span className="material-symbols-outlined text-[10px] block">close</span>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-primary font-medium">Logo Uploaded</p>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-gray-400 text-3xl mb-1">cloud_upload</span>
                                                <p className="text-xs text-text-subtle">Drop logo here or click to upload</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                        disabled={loading}
                                    >
                                        <span>{loading ? 'Creating...' : 'Save & Activate'}</span>
                                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-400">
                            By creating this QR, you agree to our <Link to="/terms" className="underline hover:text-primary">Terms of Service</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateQR;
