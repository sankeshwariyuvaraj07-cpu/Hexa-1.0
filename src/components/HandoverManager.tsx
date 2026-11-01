import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  Star,
  CheckSquare,
  Square,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Booking, CheckInOutRecord, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface HandoverManagerProps {
  currentUser: UserProfile;
}

export const HandoverManager: React.FC<HandoverManagerProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'handovers' | 'returns' | 'history'>('handovers');

  // Selected booking for handover modal/form
  const [selectedBookingForHandover, setSelectedBookingForHandover] = useState<Booking | null>(null);
  const [handoverCondition, setHandoverCondition] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [handoverNotes, setHandoverNotes] = useState('Pristine condition. All connectors clean.');
  const [handoverAccessories, setHandoverAccessories] = useState<{ name: string; present: boolean }[]>([
    { name: 'Power / USB Cable', present: true },
    { name: 'Test Probes / Shrouded Leads', present: true },
    { name: 'Quick Reference Manual', present: true },
  ]);

  // Selected booking for return modal/form
  const [selectedBookingForReturn, setSelectedBookingForReturn] = useState<Booking | null>(null);
  const [returnCondition, setReturnCondition] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [returnNotes, setReturnNotes] = useState('Equipment returned in normal working order.');
  const [returnAccessories, setReturnAccessories] = useState<{ name: string; present: boolean }[]>([
    { name: 'Power / USB Cable', present: true },
    { name: 'Test Probes / Shrouded Leads', present: true },
    { name: 'Quick Reference Manual', present: true },
  ]);
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [discrepancyDetails, setDiscrepancyDetails] = useState('');

  const bookings = campusStore.getBookings();
  const checkIns = campusStore.getCheckIns();

  // Filter approved bookings ready for handover
  const readyForHandover = bookings.filter(
    (b) => b.status === 'approved' && b.resourceType === 'equipment'
  );

  // Filter checked out bookings ready for return
  const readyForReturn = bookings.filter(
    (b) => (b.status === 'checked_out' || b.status === 'overdue') && b.resourceType === 'equipment'
  );

  // Pending inspections
  const pendingInspections = bookings.filter(
    (b) => b.status === 'return_pending_inspection'
  );

  const handleExecuteHandover = () => {
    if (!selectedBookingForHandover) return;
    campusStore.checkOutEquipment(selectedBookingForHandover.id, {
      conditionRating: handoverCondition,
      conditionNotes: handoverNotes,
      accessoriesChecked: handoverAccessories,
      staffName: `${currentUser.name} (${currentUser.role})`,
    });
    setSelectedBookingForHandover(null);
  };

  const handleExecuteReturn = () => {
    if (!selectedBookingForReturn) return;
    campusStore.returnEquipment(selectedBookingForReturn.id, {
      conditionRating: returnCondition,
      conditionNotes: returnNotes,
      accessoriesChecked: returnAccessories,
      staffName: `${currentUser.name} (${currentUser.role})`,
      hasDiscrepancy,
      discrepancyDetails,
    });
    setSelectedBookingForReturn(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Equipment Handover &amp; Return Station
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Physical check-in/out, accessory auditing, and before-and-after condition reports.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('handovers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'handovers'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
            <span>Ready for Handover ({readyForHandover.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('returns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'returns'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active Checkouts ({readyForReturn.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            History &amp; Condition Logs
          </button>
        </div>
      </div>

      {/* Pending Inspections Banner if any */}
      {pendingInspections.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {pendingInspections.length} Returned Equipment Flagged for Review
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300">
                A condition discrepancy or damage was recorded. Staff inspection required before returning units to inventory.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const b = pendingInspections[0];
              campusStore.completeInspection(b.id, 'Inspection completed by technician; unit cleared.');
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0"
          >
            Sign-off Inspection
          </button>
        </div>
      )}

      {/* 1. Handovers Tab (Check-Out) */}
      {activeSubTab === 'handovers' && (
        <div className="space-y-4">
          {readyForHandover.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-10 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                No Equipment Pending Pickup
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All approved equipment bookings have been handed over or there are no new requests.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyForHandover.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Approved • Awaiting Pickup
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{b.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {b.resourceName}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div>
                      <strong>Borrower:</strong> {b.userName} ({b.userEmail})
                    </div>
                    <div>
                      <strong>Slot:</strong> {b.date} • {b.startTime} - {b.endTime}
                    </div>
                    {b.allocatedUnitIds && (
                      <div>
                        <strong>Assigned Units:</strong> [{b.allocatedUnitIds.join(', ')}]
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBookingForHandover(b);
                      setHandoverCondition(5);
                    }}
                    className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Perform Physical Handover</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Returns Tab (Check-In) */}
      {activeSubTab === 'returns' && (
        <div className="space-y-4">
          {readyForReturn.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-10 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <CheckCircle className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                No Equipment Currently Checked Out
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All borrowed instruments have been returned.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyForReturn.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        b.status === 'overdue'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {b.status === 'overdue' ? 'Overdue Return' : 'Checked Out (In Use)'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{b.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {b.resourceName}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div>
                      <strong>Borrower:</strong> {b.userName}
                    </div>
                    <div>
                      <strong>Due Time:</strong> {b.date} at {b.endTime}
                    </div>
                    {b.allocatedUnitIds && (
                      <div>
                        <strong>Unit Serial:</strong> [{b.allocatedUnitIds.join(', ')}]
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBookingForReturn(b);
                      setReturnCondition(5);
                      setHasDiscrepancy(false);
                      setDiscrepancyDetails('');
                    }}
                    className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Process Return &amp; Inspect Condition</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. History & Condition Reports Tab */}
      {activeSubTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white">
            Before-and-After Condition Audit Records
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {checkIns.map((rec) => (
              <div key={rec.id} className="p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rec.type === 'handover'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {rec.type.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {rec.resourceName}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Units: [{rec.unitIds.join(', ')}]
                    </span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400">
                    Borrower: <strong>{rec.borrowerName}</strong> • Signed off by {rec.performedBy}
                  </div>

                  <div className="text-slate-500 italic">
                    "{rec.conditionNotes}"
                  </div>

                  {rec.discrepancyReported && (
                    <div className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Discrepancy reported during return inspection
                    </div>
                  )}
                </div>

                {/* Rating Stars & Timestamp */}
                <div className="text-left sm:text-right shrink-0">
                  <div className="flex items-center sm:justify-end gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rec.conditionRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-slate-700 dark:text-slate-300 font-bold ml-1 text-xs">
                      {rec.conditionRating}/5
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {new Date(rec.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {selectedBookingForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span>Record Equipment Handover</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
              <div>
                <strong>Equipment:</strong> {selectedBookingForHandover.resourceName}
              </div>
              <div>
                <strong>Borrower:</strong> {selectedBookingForHandover.userName}
              </div>
              <div>
                <strong>Units:</strong> [{(selectedBookingForHandover.allocatedUnitIds || []).join(', ')}]
              </div>
            </div>

            {/* Condition Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Condition Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setHandoverCondition(r as any)}
                    className="p-1 hover:scale-110 transition-transform text-amber-500"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        r <= handoverCondition ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {handoverCondition === 5 ? '5/5 - Brand New / Pristine' : `${handoverCondition}/5`}
                </span>
              </div>
            </div>

            {/* Accessories Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verified Included Accessories
              </label>
              <div className="space-y-1.5 text-xs">
                {handoverAccessories.map((acc, idx) => (
                  <button
                    key={acc.name}
                    type="button"
                    onClick={() => {
                      const updated = [...handoverAccessories];
                      updated[idx].present = !updated[idx].present;
                      setHandoverAccessories(updated);
                    }}
                    className="flex items-center gap-2 w-full text-left p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {acc.present ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={acc.present ? 'font-medium' : 'line-through text-slate-400'}>
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Handover Inspection Notes
              </label>
              <input
                type="text"
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBookingForHandover(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteHandover}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow"
              >
                Sign &amp; Confirm Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {selectedBookingForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-emerald-500" />
              <span>Process Equipment Return &amp; Inspection</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
              <div>
                <strong>Equipment:</strong> {selectedBookingForReturn.resourceName}
              </div>
              <div>
                <strong>Borrower:</strong> {selectedBookingForReturn.userName}
              </div>
            </div>

            {/* Condition Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Final Return Condition Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReturnCondition(r as any)}
                    className="p-1 hover:scale-110 transition-transform text-amber-500"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        r <= returnCondition ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {returnCondition}/5
                </span>
              </div>
            </div>

            {/* Accessories Verification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Check Returned Accessories
              </label>
              <div className="space-y-1.5 text-xs">
                {returnAccessories.map((acc, idx) => (
                  <button
                    key={acc.name}
                    type="button"
                    onClick={() => {
                      const updated = [...returnAccessories];
                      updated[idx].present = !updated[idx].present;
                      setReturnAccessories(updated);
                      if (!updated[idx].present) setHasDiscrepancy(true);
                    }}
                    className="flex items-center gap-2 w-full text-left p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {acc.present ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={acc.present ? 'font-medium' : 'text-rose-500 font-bold'}>
                      {acc.name} {acc.present ? '(Returned)' : '(MISSING)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discrepancy toggle */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={hasDiscrepancy}
                  onChange={(e) => setHasDiscrepancy(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Flag Damage / Discrepancy for Investigation</span>
              </label>

              {hasDiscrepancy && (
                <textarea
                  rows={2}
                  value={discrepancyDetails}
                  onChange={(e) => setDiscrepancyDetails(e.target.value)}
                  placeholder="Describe damage, missing items, or physical fault detected..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technician Inspection Notes
              </label>
              <input
                type="text"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBookingForReturn(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReturn}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow ${
                  hasDiscrepancy ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {hasDiscrepancy ? 'Report Discrepancy & Flag Review' : 'Complete Return & Restock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
