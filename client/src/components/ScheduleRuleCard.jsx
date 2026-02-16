import React, { useState } from 'react';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';

const ScheduleRuleCard = ({ schedule, isActive, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSchedule, setEditedSchedule] = useState({
        destination_url: schedule.destination_url,
        start_time: schedule.start_time,
        end_time: schedule.end_time || '',
        label: schedule.label || ''
    });

    const handleSave = () => {
        // Validate URL before saving
        if (!validateUrl(editedSchedule.destination_url)) {
            alert('Please enter a valid URL (http:// or https://).');
            return;
        }
        // Normalize URL before saving
        const normalizedSchedule = {
            ...editedSchedule,
            destination_url: normalizeUrl(editedSchedule.destination_url)
        };
        onUpdate(schedule.id, normalizedSchedule);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedSchedule({
            destination_url: schedule.destination_url,
            start_time: schedule.start_time,
            end_time: schedule.end_time || '',
            label: schedule.label || ''
        });
        setIsEditing(false);
    };

    // Format time only (HH:MM AM/PM)
    const formatTime = (utcString) => {
        if (!utcString) return '';
        const date = new Date(utcString);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format datetime for input
    const formatDateTimeForInput = (utcString) => {
        if (!utcString) return '';
        const date = new Date(utcString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Convert local datetime to UTC
    const convertToUTC = (localDateTimeString) => {
        if (!localDateTimeString) return null;
        return new Date(localDateTimeString).toISOString();
    };

    // Calculate time until start
    const getTimeUntilStart = () => {
        const now = new Date();
        const start = new Date(schedule.start_time);
        const diff = start - now;

        if (diff < 0) return null; // Already started

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `Starts in ${hours}h${minutes}m`;
        } else {
            return `Starts in ${minutes}m`;
        }
    };

    const now = new Date();
    const startTime = new Date(schedule.start_time);
    const endTime = schedule.end_time ? new Date(schedule.end_time) : null;

    const isPast = endTime && endTime < now;
    const isFuture = startTime > now;
    const isCurrentlyActive = isActive;

    // Determine status
    let status = null;
    if (isPast) {
        status = { text: 'Ended', color: 'text-slate-400' };
    } else if (isCurrentlyActive) {
        status = { text: 'Active Now', color: 'text-primary', badge: true };
    } else if (isFuture) {
        const timeUntil = getTimeUntilStart();
        status = { text: timeUntil, color: 'text-slate-500' };
    }

    return (
        <div className={`group relative rounded-2xl p-5 transition-all ${isCurrentlyActive
            ? 'bg-primary/5 border-2 border-primary shadow-sm'
            : isPast
                ? 'bg-slate-50  border border-slate-100 '
                : 'bg-white  border border-slate-200  hover:border-primary/30'
            }`}>
            {isEditing ? (
                /* Editing Mode */
                <div className="space-y-4">
                    {/* Label */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500  mb-2">
                            Schedule Name
                        </label>
                        <input
                            type="text"
                            value={editedSchedule.label}
                            onChange={(e) => setEditedSchedule({ ...editedSchedule, label: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm font-medium border border-slate-300  rounded-lg bg-white  text-slate-900  focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="e.g., Lunch Special"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500  mb-2">
                            Destination URL
                        </label>
                        <input
                            type="text"
                            value={editedSchedule.destination_url}
                            onChange={(e) => setEditedSchedule({ ...editedSchedule, destination_url: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm border border-slate-300  rounded-lg bg-white  text-slate-900  font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="example.com"
                        />
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500  mb-2">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeForInput(editedSchedule.start_time)}
                                onChange={(e) => setEditedSchedule({
                                    ...editedSchedule,
                                    start_time: convertToUTC(e.target.value)
                                })}
                                className="w-full px-3 py-2 text-sm border border-slate-300  rounded-lg bg-white  text-slate-900  focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500  mb-2">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeForInput(editedSchedule.end_time)}
                                onChange={(e) => setEditedSchedule({
                                    ...editedSchedule,
                                    end_time: e.target.value ? convertToUTC(e.target.value) : null
                                })}
                                className="w-full px-3 py-2 text-sm border border-slate-300  rounded-lg bg-white  text-slate-900  focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300  text-slate-700  font-semibold hover:bg-slate-50 :bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                        {/* Label */}
                        {schedule.label && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">label</span>
                                <span className="text-sm font-semibold text-slate-900  truncate">{schedule.label}</span>
                            </div>
                        )}

                        {/* URL */}
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">link</span>
                            <a
                                href={schedule.destination_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline break-all font-mono"
                            >
                                {schedule.destination_url}
                            </a>
                        </div>

                        {/* Time Info */}
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">schedule</span>
                            <div className="text-sm text-slate-600 ">
                                {schedule.recurrence_type && schedule.recurrence_type !== 'once' ? (
                                    // Recurring schedule display
                                    <div className="space-y-1">
                                        <div className="font-semibold">
                                            {formatTime(schedule.start_time)}
                                            {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                                        </div>
                                        <div className="text-xs text-slate-500 ">
                                            {schedule.recurrence_days ? (
                                                <>
                                                    Repeats on {JSON.parse(schedule.recurrence_days).map(day =>
                                                        day.charAt(0).toUpperCase() + day.slice(1, 3)
                                                    ).join(', ')}
                                                </>
                                            ) : (
                                                'Repeats daily'
                                            )}
                                            {schedule.recurrence_end_date && (
                                                <> until {new Date(schedule.recurrence_end_date).toLocaleDateString()}</>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // One-time schedule display
                                    <>
                                        <div className="font-semibold">
                                            {new Date(schedule.start_time).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-xs text-slate-500 ">
                                            {formatTime(schedule.start_time)}
                                            {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Status Badge & Scans */}
                        <div className="flex items-center gap-4 pt-1">
                            {status && (
                                <>
                                    {status.badge && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                            {status.text}
                                        </span>
                                    )}
                                    {!status.badge && (
                                        <span className={`text-xs font-medium ${status.color}`}>
                                            {status.text}
                                        </span>
                                    )}
                                </>
                            )}

                            <div className="flex items-center gap-1.5 ml-auto">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">ads_click</span>
                                <span className="text-sm font-bold text-slate-700 ">
                                    {schedule.scan_count || 0}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">scans</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Icons - Right Side */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(schedule.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 :bg-red-900/10 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleRuleCard;
