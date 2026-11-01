import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  Database,
} from 'lucide-react';
import { Equipment, Laboratory, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface BookingModalProps {
  resource: Equipment | Laboratory;
  resourceType: 'equipment' | 'laboratory';
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  resource,
  resourceType,
  currentUser,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Default tomorrow
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [date, setDate] = useState(tomorrowStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState(
    'Capstone Project: Real-time hardware prototyping and sensor characterization.'
  );
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time conflict check
  const conflictInfo = campusStore.checkConflicts(
    resource.id,
    resourceType,
    date,
    startTime,
    endTime,
    quantity
  );

  // Real-time FairShare Priority
  const priority = campusStore.calculatePriority(currentUser.id, date, purpose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = campusStore.createBooking({
      resourceId: resource.id,
      resourceName: resource.name,
      resourceType,
      date,
      startTime,
      endTime,
      requestedQuantity: resourceType === 'equipment' ? quantity : 1,
      purpose,
      additionalNotes,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to submit booking');
      return;
    }

    if (res.booking) {
      onSuccess(res.booking.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {resourceType}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reserve Resource
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {resource.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* User & Safety Status */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500"
              />
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser.studentIdOrEmployeeId} • {currentUser.departmentName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety Certified</span>
            </div>
          </div>

          {/* Date & Time selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {['08:30', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity (For Equipment) */}
          {resourceType === 'equipment' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requested Quantity (Total units: {(resource as Equipment).totalQuantity})
              </label>
              <input
                type="number"
                min="1"
                max={(resource as Equipment).totalQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full sm:w-32 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Purpose & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose of Usage <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Explain the experiment, academic course requirement, or capstone milestone..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Additional Requirements or Accessories Needed
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. 10X attenuation probe, extra breadboard jumper leads"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Availability Status Card */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              conflictInfo.hasConflict
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            {conflictInfo.hasConflict ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <div>
              <div className="font-bold">
                {conflictInfo.hasConflict ? 'High Demand: Waitlist Queue' : 'Timeslot Confirmed Available'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">
                {conflictInfo.hasConflict
                  ? `${conflictInfo.reason}. If you submit, your request will be placed in the FairShare Waiting List and automatically reconsidered if any cancellation occurs.`
                  : `${conflictInfo.availableUnitsRemaining} unit(s) ready for allocation. Awaiting instructor review.`}
              </div>
            </div>
          </div>

          {/* FairShare Allocation Priority Engine Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>FairShare™ Allocation Engine</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                Score: {priority.score} / 100
              </div>
            </div>

            {/* Score Factors */}
            <div className="grid grid-cols-3 gap-2 text-[11px] mb-2 pt-1 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-slate-400">Past Usage (50%)</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {priority.recentUsageFactor} / 50
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-slate-400">Notice Time (30%)</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {priority.waitingTimeFactor} / 30
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-slate-400">Academic Need (20%)</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {priority.bookingNeedFactor} / 20
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {priority.explanation}
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Saves directly to Supabase (<code className="font-mono">nozotfhooeqhetjhtjmr</code>)</span>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{conflictInfo.hasConflict ? 'Join Waiting List' : 'Submit Booking Request'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
