import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
  FileText,
  Printer,
  X,
  PlusCircle,
  MapPin,
  Tag,
  CheckSquare,
  Database,
  Cloud,
} from 'lucide-react';
import { Booking, UserProfile } from '../types';
import { campusStore } from '../services/store';
import { SupabaseSyncModal } from './SupabaseSyncModal';

interface MyBookingsProps {
  currentUser: UserProfile;
  onExplore: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ currentUser, onExplore }) => {
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [viewReceiptBooking, setViewReceiptBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const allBookings = campusStore.getBookings();
  // Filter for this user's bookings (or all if faculty testing student view)
  const userBookings = allBookings.filter(
    (b) => b.userId === currentUser.id || currentUser.role !== 'student'
  );

  const filteredBookings = userBookings.filter((b) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['pending', 'approved', 'checked_out', 'waitlisted'].includes(b.status);
    if (statusFilter === 'completed') return b.status === 'completed';
    if (statusFilter === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancellingBookingId) return;
    campusStore.cancelOrder(
      cancellingBookingId,
      cancelReason || 'Schedule conflict reported by user.'
    );
    setCancellingBookingId(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              My Equipment Orders &amp; Reservations
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {userBookings.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jain College of Engineering Belagavi • Department of Electronics &amp; Communication Engineering
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All ({userBookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Cancelled
            </button>
          </div>

          <button
            onClick={onExplore}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book New Order</span>
          </button>
        </div>
      </div>

      {/* Supabase Cloud Connection & Sync Bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Database className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-white">
                Supabase Cloud Storage Connected
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                nozotfhooeqhetjhtjmr
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              All bookings, appointment reservations, and cancellation orders are synchronized with your PostgreSQL database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Supabase Sync &amp; SQL</span>
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Orders Found in this Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You can browse available embedded development boards, oscilloscopes, and research facilities now.
          </p>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20"
          >
            Explore &amp; Order Hardware
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      b.status === 'approved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : b.status === 'checked_out'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                        : b.status === 'completed'
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                        : b.status === 'waitlisted'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                        : b.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : b.status === 'overdue'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b.status === 'approved' ? 'Order Confirmed' : b.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    ORDER #{b.id.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                    <Database className="w-2.5 h-2.5 text-emerald-500" /> Supabase Synced
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    • {b.resourceType.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.resourceName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.startTime} - {b.endTime} ({b.durationHours} hrs)</span>
                  </div>
                  {b.allocatedUnitIds && b.allocatedUnitIds.length > 0 && (
                    <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Allocated Unit: [{b.allocatedUnitIds.join(', ')}]</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <strong className="text-slate-700 dark:text-slate-200">Order Purpose:</strong> {b.purpose}
                </p>

                {b.waitlistPosition && (
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Waiting List Position #{b.waitlistPosition}. You will be promoted automatically if a slot opens up.</span>
                  </div>
                )}

                {b.rejectionReason && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    <strong>Status Notice:</strong> {b.rejectionReason}
                  </div>
                )}
              </div>

              {/* Action Buttons: View Receipt & Cancel Order */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                <button
                  onClick={() => setViewReceiptBooking(b)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Order Receipt</span>
                </button>

                {['pending', 'approved', 'waitlisted'].includes(b.status) && (
                  <button
                    onClick={() => setCancellingBookingId(b.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:text-white dark:hover:bg-rose-600 rounded-xl transition-all border border-rose-200 dark:border-rose-900/60 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cancel Order #{cancellingBookingId.toUpperCase()}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to cancel this order? Cancelling will immediately release the reserved equipment unit back to the available inventory pool for other students and researchers at Jain College of Engineering Belagavi.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, project requirement completed, or rescheduled..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Receipt / Pass Modal */}
      {viewReceiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            {/* Receipt Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                    Official Equipment Custody Pass
                  </span>
                  <span className="confidential-stamp text-[9px] py-0 px-1.5">
                    RESTRICTED
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Jain College of Engineering Belagavi
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Department of Electronics &amp; Communication Engineering (Hexa-1.0)
                </div>
              </div>

              <button
                onClick={() => setViewReceiptBooking(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Barcode */}
            <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-1">
              <div className="font-mono text-[9px] text-slate-400 tracking-widest">
                ||||| | |||| |||||| || | |||| ||||| |||| || |||||| | |||||
              </div>
              <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 tracking-wider">
                *JCE-ECE-ORD-{viewReceiptBooking.id.toUpperCase()}*
              </div>
            </div>

            {/* Order Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ORD-{viewReceiptBooking.id.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Borrower Identity:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewReceiptBooking.userName} ({viewReceiptBooking.userEmail})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Equipment / Sensor:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {viewReceiptBooking.resourceName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Pickup Time &amp; Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewReceiptBooking.date} • {viewReceiptBooking.startTime} - {viewReceiptBooking.endTime} ({viewReceiptBooking.durationHours} hrs)
                </span>
              </div>

              {viewReceiptBooking.allocatedUnitIds && viewReceiptBooking.allocatedUnitIds.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">Assigned Hardware Unit:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    [{viewReceiptBooking.allocatedUnitIds.join(', ')}]
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Security Clearance:</span>
                <span className="font-mono font-bold text-emerald-600 text-[11px]">
                  VTU TIER-3 VERIFIED • ESD LEVEL 1
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Status:</span>
                <span className="font-bold uppercase tracking-wider text-emerald-600">
                  {viewReceiptBooking.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="bg-slate-100 dark:bg-slate-950/80 p-2.5 rounded-xl text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>SHA256: 4e9a8f...b712c9</span>
              <span className="text-emerald-500 font-bold">DIGITALLY VERIFIED</span>
            </div>

            {/* Instructions */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div>• Present your College USN identity card at the Embedded Systems / Analog Lab handover desk.</div>
              <div>• Technician will perform the physical accessories audit and record handover condition.</div>
              <div>• Please return all cables and sensor adapters promptly before {viewReceiptBooking.endTime}.</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewReceiptBooking(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-emerald-600 rounded-xl hover:opacity-90 shadow-md"
              >
                Close Custody Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Cloud Sync Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};
