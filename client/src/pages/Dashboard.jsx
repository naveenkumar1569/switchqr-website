import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { apiGet, apiPost, apiPut, apiDelete, getShortCodeUrl } from '../utils/api';

const Dashboard = () => {
    const { token, planInfo } = useAuth();
    const navigate = useNavigate();
    const { showWarning, showSuccess, showError } = useToast();
    const [qrs, setQrs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, qrId: null });
    const itemsPerPage = 10;

    const fetchQrs = async () => {
        try {
            // Enforce plan limits first
            try {
                await apiPost('/api/plan/enforce-limits', {}, token);
            } catch (err) {
                console.error('Error enforcing plan limits:', err);
            }

            // Then fetch QRs
            const response = await apiGet('/api/qrs', token);
            if (response.ok) {
                const data = await response.json();
                setQrs(data);
            }
        } catch (error) {
            console.error('Failed to fetch QRs', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await apiGet('/api/stats', token);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    useEffect(() => {
        fetchQrs();
        fetchStats();
    }, [token]);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    const filteredQrs = useMemo(() => {
        return qrs.filter(qr => {
            const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                qr.destination_url.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all' || qr.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [qrs, searchQuery, filterStatus]);
    // Pagination
    const totalPages = Math.ceil(filteredQrs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQrs = filteredQrs.slice(startIndex, endIndex);

    const activeQrs = qrs.filter(qr => qr.status === 'active').length;

    const handleToggleStatus = async (qrId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';

        // If trying to resume (activate) a paused QR, check if we're at the limit
        if (newStatus === 'active') {
            if (!planInfo) {
                showError('Please wait while we load your plan details.');
                return;
            }

            const activeQRs = qrs.filter(qr => qr.status === 'active');
            const QR_LIMIT = planInfo.qr_limit;

            if (activeQRs.length >= QR_LIMIT) {
                showWarning(`You have ${activeQRs.length} active QR codes. Please pause another QR or upgrade to activate more.`, {
                    title: 'Upgrade Required',
                    action: {
                        label: 'View Plans',
                        onClick: () => navigate('/billing')
                    },
                    duration: 0 // Don't auto-dismiss
                });
                return;
            }
        }

        try {
            const response = await apiPut(`/api/qrs/${qrId}`, { status: newStatus }, token);

            if (response.ok) {
                setQrs(qrs.map(qr => qr.id === qrId ? { ...qr, status: newStatus } : qr));
                setOpenMenuId(null);
            }
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    const handleDeleteClick = (qrId) => {
        setDeleteConfirmation({ isOpen: true, qrId });
        setOpenMenuId(null);
    };

    const handleConfirmDelete = async () => {
        const { qrId } = deleteConfirmation;
        if (!qrId) return;

        try {
            const response = await apiDelete(`/api/qrs/${qrId}`, token);

            if (response.ok) {
                setQrs(qrs.filter(qr => qr.id !== qrId));
                showSuccess('QR Code deleted successfully');
            } else {
                showError('Failed to delete QR code');
            }
        } catch (error) {
            console.error('Failed to delete QR', error);
            showError('An error occurred while deleting');
        } finally {
            setDeleteConfirmation({ isOpen: false, qrId: null });
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, qrId: null })}
                onConfirm={handleConfirmDelete}
                title="Delete QR Code"
                message="Are you sure you want to delete this QR code? This action cannot be undone and the QR code will stop working immediately."
                confirmText="Delete"
                isDanger={true}
            />
            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total QRs */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined">qr_code_2</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total QRs</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{qrs.length}</h3>
                </div>

                {/* Total Scans */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">bar_chart</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Scans</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalScans || 0}</h3>
                    </div>
                </div>

                {/* Active QRs */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active QRs</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{activeQrs}</h3>
                </div>

                {/* Top Campaign */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <span className="material-symbols-outlined">star</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Campaign</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 truncate" title={stats?.topQr?.name || 'N/A'}>
                        {stats?.topQr?.name || 'N/A'}
                    </h3>
                </div>
            </section>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                <div className="relative w-full sm:w-96">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search QRs..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1625] text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1625] transition-colors text-text-subtle text-sm font-medium ${filterStatus !== 'all' ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            Filter
                            {filterStatus !== 'all' && (
                                <span className="ml-1 bg-primary text-white text-[10px] px-1.5 rounded-full capitalize">{filterStatus}</span>
                            )}
                        </button>

                        {filterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <div className="p-1">
                                    <button
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${filterStatus === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-text-subtle hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        onClick={() => { setFilterStatus('all'); setFilterOpen(false); }}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${filterStatus === 'active' ? 'bg-primary/10 text-primary font-medium' : 'text-text-subtle hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        onClick={() => { setFilterStatus('active'); setFilterOpen(false); }}
                                    >
                                        Active
                                    </button>
                                    <button
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${filterStatus === 'paused' ? 'bg-primary/10 text-primary font-medium' : 'text-text-subtle hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        onClick={() => { setFilterStatus('paused'); setFilterOpen(false); }}
                                    >
                                        Paused
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors text-sm font-medium ${planInfo?.features?.csv_export
                            ? 'hover:bg-gray-50 dark:hover:bg-[#1a1625] text-text-subtle'
                            : 'opacity-50 cursor-not-allowed text-gray-400'
                            }`}
                        disabled={!planInfo?.features?.csv_export}
                        title={!planInfo?.features?.csv_export ? 'CSV Export requires Pro plan' : 'Export QR codes to CSV'}
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export CSV
                        {!planInfo?.features?.csv_export && (
                            <span className="material-symbols-outlined text-amber-500 text-[16px]">lock</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">QR Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/4">Destination URL</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scans</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Scanned</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                            {paginatedQrs.map(qr => (
                                <tr key={qr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/qrs/${qr.id}`} className="flex items-center group-hover:text-primary transition-colors">
                                            <div className="flex-shrink-0 h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                <span className="material-symbols-outlined text-slate-400 text-[20px] group-hover:text-primary">qr_code</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary">{qr.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Created: {new Date(qr.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 group/url">
                                            <div className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{qr.destination_url}</div>
                                            <button
                                                className="text-slate-400 hover:text-primary opacity-0 group-hover/url:opacity-100 transition-opacity"
                                                onClick={() => navigator.clipboard.writeText(qr.destination_url)}
                                                title="Copy URL"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                            </button>
                                        </div>
                                        <a href={getShortCodeUrl(qr.short_code)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary block mt-1">
                                            {getShortCodeUrl(qr.short_code)}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${qr.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800'
                                            : qr.status === 'paused'
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                            }`}>
                                            {qr.status === 'active' ? 'Active' : qr.status === 'paused' ? 'Paused' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                                        {qr.scan_count || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {qr.last_scanned ? new Date(qr.last_scanned).toLocaleString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === qr.id ? null : qr.id)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>

                                            {openMenuId === qr.id && (
                                                <div className="absolute right-0 bottom-full mb-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={() => handleToggleStatus(qr.id, qr.status)}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {qr.status === 'active' ? 'pause' : 'play_arrow'}
                                                        </span>
                                                        {qr.status === 'active' ? 'Pause' : 'Resume'}
                                                    </button>
                                                    <Link
                                                        to={`/qrs/${qr.id}?edit=true`}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                        onClick={() => setOpenMenuId(null)}
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        Edit Destination
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(qr.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredQrs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery ? 'No QR codes match your search.' : 'No QR codes found. Create one to get started.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredQrs.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredQrs.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-border-light dark:border-border-dark rounded-md text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || filteredQrs.length === 0}
                            className="px-3 py-1 border border-border-light dark:border-border-dark rounded-md text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
