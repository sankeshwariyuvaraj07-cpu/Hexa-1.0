import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  User,
  Calendar,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { Booking, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface ApprovalsDashboardProps {
  currentUser: UserProfile;
  onRefresh?: () => void;
}

export const ApprovalsDashboard: React.FC<ApprovalsDashboardProps> = ({ currentUser }) => {
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'all'>('pending');

  const bookings = campusStore.getBookings();
  const filteredBookings = bookings.filter((b) =>
    filterStatus === 'pending' ? b.status === 'pending' || b.status === 'waitlisted' : true
  );

  const handleApprove = (bookingId: string) => {
    campusStore.approveBooking(bookingId, currentUser.name);
  };

  const handleRejectConfirm = () => {
    if (!rejectingBookingId) return;
    campusStore.rejectBooking(
      rejectingBookingId,
      rejectionReason || 'Scheduling constraint or prerequisite documentation required.',
      currentUser.name
    );
    setRejectingBookingId(null);
    setRejectionReason('');
  };

  const isInstructorOrStaff = ['instructor', 'technician', 'manager', 'admin'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Instructor Approvals &amp; Allocation Center
            </h1>
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {bookings.filter((b) => b.status === 'pending').length} Awaiting Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review lab and instrument requests with explainable FairShare™ scores and conflict analysis.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Pending Queue ({bookings.filter((b) => b.status === 'pending' || b.status === 'waitlisted').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {!isInstructorOrStaff && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            You are logged in as a <strong>Student</strong>. In production, only Instructors, Technicians, and Department Managers can approve reservations. Switch roles in the top-right menu to test faculty actions.
          </div>
        </div>
      )}

      {/* Bookings Queue */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Queue Clear!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No pending booking requests awaiting faculty review. All student submissions have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => {
            const isPending = b.status === 'pending';
            const isWaitlist = b.status === 'waitlisted';

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Request Info */}
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        b.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : b.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : b.status === 'waitlisted'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                          : b.status === 'checked_out'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{b.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      • {b.resourceType.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {b.resourceName}
                  </h3>

                  {/* Student details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{b.userName}</span>
                      <span className="text-slate-400">({b.userRole})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.startTime} - {b.endTime} ({b.durationHours} hrs)</span>
                    </div>

                    {b.resourceType === 'equipment' && (
                      <div className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
                        Qty: {b.requestedQuantity}
                      </div>
                    )}
                  </div>

                  {/* Purpose text */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-200">Stated Purpose:</strong> {b.purpose}
                    {b.additionalNotes && (
                      <span className="block mt-1 text-slate-500">
                        <strong>Notes:</strong> {b.additionalNotes}
                      </span>
                    )}
                  </p>

                  {/* Allocated units or rejection reason */}
                  {b.allocatedUnitIds && b.allocatedUnitIds.length > 0 && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Assigned Units: [{b.allocatedUnitIds.join(', ')}]
                    </div>
                  )}

                  {b.rejectionReason && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      Decline Reason: {b.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Right: FairShare Priority Score & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  {/* FairShare badge */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 text-left lg:text-right min-w-[200px]">
                    <div className="flex items-center lg:justify-end gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>FairShare™ Priority</span>
                    </div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {b.priority.score} / 100
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      {b.priority.explanation}
                    </div>
                  </div>

                  {/* Action Buttons for Instructor */}
                  {(isPending || isWaitlist) && (
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectingBookingId(b.id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Decline Reservation Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide a clear academic or scheduling reason for the borrower:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Laboratory is scheduled for faculty exam grading at this hour; please choose an afternoon slot."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-500"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
