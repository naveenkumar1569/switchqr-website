import React, { useState } from 'react';
import ScheduleRuleCard from './ScheduleRuleCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { normalizeUrl, validateUrl } from '../utils/urlHelpers';

const ScheduleList = ({ schedules, onUpdate, onDelete, onAdd }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        destination_url: '',
        start_time: '',
        end_time: '',
        label: '',
        recurrence_type: 'once',
        recurrence_days: [],
        recurrence_end_date: ''
    });

    const handleAdd = () => {
        // Validate URL before adding
        if (!validateUrl(newSchedule.destination_url)) {
            alert('Please enter a valid URL (http:// or https://).');
            return;
        }
        let scheduleData;

        if (newSchedule.recurrence_type === 'once') {
            // One-time schedule: use full datetime
            scheduleData = {
                destination_url: normalizeUrl(newSchedule.destination_url),
                start_time: new Date(newSchedule.start_time).toISOString(),
                end_time: newSchedule.end_time ? new Date(newSchedule.end_time).toISOString() : null,
                label: newSchedule.label,
                recurrence_type: 'once'
            };
        } else {
            // Recurring schedule: use time-only format (HH:MM) with selected days
            const startTime = newSchedule.start_time ? new Date(newSchedule.start_time).toTimeString().slice(0, 5) : '';
            const endTime = newSchedule.end_time ? new Date(newSchedule.end_time).toTimeString().slice(0, 5) : null;

            scheduleData = {
                destination_url: normalizeUrl(newSchedule.destination_url),
                start_time: startTime,
                end_time: endTime,
                label: newSchedule.label,
                recurrence_type: 'weekly',
                recurrence_days: JSON.stringify(newSchedule.recurrence_days),
                recurrence_end_date: newSchedule.recurrence_end_date || null
            };
        }

        onAdd(scheduleData);

        setNewSchedule({
            destination_url: '',
            start_time: '',
            end_time: '',
            label: '',
            recurrence_type: 'once',
            recurrence_days: [],
            recurrence_end_date: ''
        });
        setShowAddModal(false);
    };

    // Get current active schedules
    const activeSchedules = schedules.filter(s => s.is_active);

    // Get others that might be caught in between
    const otherSchedules = schedules.filter(s =>
        !s.is_active &&
        (!s.recurrence_type || s.recurrence_type === 'once') &&
        !(new Date(s.start_time) > new Date()) &&
        !(s.end_time && new Date(s.end_time) < new Date())
    );

    // Separate one-time and recurring schedules
    const oneTimeSchedules = schedules.filter(s => !s.recurrence_type || s.recurrence_type === 'once');
    const recurringSchedules = schedules.filter(s => s.recurrence_type && s.recurrence_type !== 'once');

    // Get upcoming one-time schedules (future start time)
    const upcomingSchedules = oneTimeSchedules
        .filter(s => new Date(s.start_time) > new Date())
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    // Get past one-time schedules
    const pastSchedules = oneTimeSchedules
        .filter(s => s.end_time && new Date(s.end_time) < new Date())
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    return (
        <div className="space-y-4">
            {/* Active Schedules */}
            {activeSchedules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Active Now
                    </h4>
                    <div className="space-y-3">
                        {activeSchedules.map((schedule) => (
                            <ScheduleRuleCard
                                key={schedule.id}
                                schedule={schedule}
                                isActive={true}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Schedules (Hidden logic fix) */}
            {otherSchedules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Other Scheduled
                    </h4>
                    <div className="space-y-3">
                        {otherSchedules.map((schedule) => (
                            <ScheduleRuleCard
                                key={schedule.id}
                                schedule={schedule}
                                isActive={false}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Schedules */}
            {upcomingSchedules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Upcoming Changes
                    </h4>
                    <div className="space-y-3">
                        {upcomingSchedules.map((schedule) => (
                            <ScheduleRuleCard
                                key={schedule.id}
                                schedule={schedule}
                                isActive={false}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recurring Schedules */}
            {recurringSchedules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Recurring Schedules
                    </h4>
                    <div className="space-y-3">
                        {recurringSchedules.map((schedule) => (
                            <ScheduleRuleCard
                                key={schedule.id}
                                schedule={schedule}
                                isActive={false}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Schedules */}
            {pastSchedules.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                        Past Schedules
                    </h4>
                    <div className="space-y-3">
                        {pastSchedules.slice(0, 3).map((schedule) => (
                            <ScheduleRuleCard
                                key={schedule.id}
                                schedule={schedule}
                                isActive={false}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {schedules.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">
                        schedule
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No schedules yet. Add your first schedule to start time-based routing.
                    </p>
                </div>
            )}

            {/* Add Schedule Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
                <span className="material-symbols-outlined">add</span>
                <span className="font-medium">Add Schedule</span>
            </button>

            {/* Add Schedule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Add Schedule</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Schedule Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                    Schedule Type
                                </label>
                                <div className="flex gap-3">
                                    <label className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all cursor-pointer ${newSchedule.recurrence_type === 'once'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="scheduleType"
                                            checked={newSchedule.recurrence_type === 'once'}
                                            onChange={() => setNewSchedule({ ...newSchedule, recurrence_type: 'once', recurrence_days: [] })}
                                            className="sr-only"
                                        />
                                        <span className="flex items-center justify-center">One-time</span>
                                    </label>
                                    <label className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all cursor-pointer ${newSchedule.recurrence_type !== 'once'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="scheduleType"
                                            checked={newSchedule.recurrence_type !== 'once'}
                                            onChange={() => setNewSchedule({ ...newSchedule, recurrence_type: 'weekly', recurrence_days: [] })}
                                            className="sr-only"
                                        />
                                        <span className="flex items-center justify-center">Recurring</span>
                                    </label>
                                </div>
                            </div>

                            {/* Day Selection (only for recurring) */}
                            {newSchedule.recurrence_type !== 'once' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                        Repeat On
                                    </label>
                                    <div className="grid grid-cols-7 gap-2">
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    const days = newSchedule.recurrence_days.includes(day)
                                                        ? newSchedule.recurrence_days.filter(d => d !== day)
                                                        : [...newSchedule.recurrence_days, day];
                                                    setNewSchedule({ ...newSchedule, recurrence_days: days });
                                                }}
                                                className={`px-2 py-3 rounded-lg text-xs font-bold transition-all ${newSchedule.recurrence_days.includes(day)
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {day.slice(0, 3).toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                    Schedule Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g., Launch Special"
                                    value={newSchedule.label}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, label: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                    Destination URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="example.com"
                                    value={newSchedule.destination_url}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, destination_url: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                        Start {newSchedule.recurrence_type === 'once' ? 'Date & Time' : 'Time'}
                                    </label>
                                    <DatePicker
                                        selected={newSchedule.start_time ? new Date(newSchedule.start_time) : null}
                                        onChange={(date) => setNewSchedule({ ...newSchedule, start_time: date ? date.toISOString() : '' })}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat={newSchedule.recurrence_type === 'once' ? "dd/MM/yyyy h:mm aa" : "h:mm aa"}
                                        showTimeSelectOnly={newSchedule.recurrence_type !== 'once'}
                                        minDate={newSchedule.recurrence_type === 'once' ? new Date() : null}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        placeholderText={newSchedule.recurrence_type === 'once' ? "Select date and time" : "Select time"}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                        End {newSchedule.recurrence_type === 'once' ? 'Date & Time' : 'Time'}
                                    </label>
                                    <DatePicker
                                        selected={newSchedule.end_time ? new Date(newSchedule.end_time) : null}
                                        onChange={(date) => setNewSchedule({ ...newSchedule, end_time: date ? date.toISOString() : '' })}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat={newSchedule.recurrence_type === 'once' ? "dd/MM/yyyy h:mm aa" : "h:mm aa"}
                                        showTimeSelectOnly={newSchedule.recurrence_type !== 'once'}
                                        minDate={newSchedule.recurrence_type === 'once' ? new Date() : null}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        placeholderText={newSchedule.recurrence_type === 'once' ? "Select date and time (optional)" : "Select time (optional)"}
                                    />
                                </div>
                            </div>

                            {/* Recurrence End Date (only for recurring) */}
                            {newSchedule.recurrence_type !== 'once' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                        End Recurrence (Optional)
                                    </label>
                                    <DatePicker
                                        selected={newSchedule.recurrence_end_date ? new Date(newSchedule.recurrence_end_date) : null}
                                        onChange={(date) => setNewSchedule({ ...newSchedule, recurrence_end_date: date ? date.toISOString() : '' })}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        placeholderText="dd/mm/yyyy"
                                        minDate={new Date()}
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                                        Leave empty to repeat indefinitely
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={!newSchedule.destination_url || !newSchedule.start_time || (newSchedule.recurrence_type !== 'once' && newSchedule.recurrence_days.length === 0)}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleList;
