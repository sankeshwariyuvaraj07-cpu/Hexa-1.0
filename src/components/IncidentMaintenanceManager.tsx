import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  ShieldAlert,
  Wrench,
  X,
  FileText,
  User,
  Calendar,
  Send,
} from 'lucide-react';
import { Incident, MaintenanceRecord, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface IncidentMaintenanceManagerProps {
  currentUser: UserProfile;
}

export const IncidentMaintenanceManager: React.FC<IncidentMaintenanceManagerProps> = ({
  currentUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incidents' | 'maintenance'>('incidents');
  const [showReportModal, setShowReportModal] = useState(false);
  const [resolvingIncident, setResolvingIncident] = useState<Incident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Report Incident Form
  const [category, setCategory] = useState<Incident['category']>('Damaged Equipment');
  const [resourceId, setResourceId] = useState('eq-osc');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Incident['severity']>('medium');

  const incidents = campusStore.getIncidents();
  const maintenance = campusStore.getMaintenance();
  const equipment = campusStore.getEquipment();

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipment.find((e) => e.id === resourceId);

    campusStore.reportIncident({
      category,
      resourceId,
      resourceName: eq ? eq.name : 'Laboratory Equipment',
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      description,
      severity,
      assignedReviewer: 'Dr. Aris Thorne',
    });

    setShowReportModal(false);
    setDescription('');
  };

  const handleConfirmResolve = () => {
    if (!resolvingIncident) return;
    campusStore.resolveIncident(
      resolvingIncident.id,
      resolutionNotes || 'Inspected by staff; repairs executed and issue resolved.'
    );
    setResolvingIncident(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Incident Management &amp; Equipment Maintenance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track equipment condition discrepancies, safety alerts, and scheduled calibration tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveSubTab('incidents')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'incidents'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Incident Tickets ({incidents.filter((i) => i.status !== 'Resolved').length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('maintenance')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'maintenance'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span>Maintenance Logs ({maintenance.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Incidents Sub-tab */}
      {activeSubTab === 'incidents' && (
        <div className="grid grid-cols-1 gap-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      inc.status === 'Resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : inc.status === 'Under Review'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {inc.status}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      inc.severity === 'critical'
                        ? 'bg-rose-600 text-white'
                        : inc.severity === 'high'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {inc.severity} Severity
                  </span>

                  <span className="font-mono text-xs text-slate-400">
                    {inc.ticketNumber}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {inc.category} — {inc.resourceName}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  {inc.description}
                </p>

                {inc.reviewerNotes && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Resolution: {inc.reviewerNotes}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Reported by: <strong>{inc.reporterName}</strong> ({inc.reporterRole})</span>
                  <span>•</span>
                  <span>Assigned Reviewer: {inc.assignedReviewer}</span>
                  <span>•</span>
                  <span>{new Date(inc.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {inc.status !== 'Resolved' && (
                <button
                  onClick={() => setResolvingIncident(inc)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Resolve Ticket</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Sub-tab */}
      {activeSubTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenance.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {m.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-slate-400">#{m.id}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {m.equipmentName}
              </h3>

              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <div><strong>Task:</strong> {m.taskDescription}</div>
                {m.findings && <div className="mt-1"><strong>Findings:</strong> {m.findings}</div>}
                {m.actionsTaken && <div className="mt-1"><strong>Action:</strong> {m.actionsTaken}</div>}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Technician: <strong>{m.assignedStaff}</strong></span>
                <span>Scheduled: {m.startDate} to {m.expectedEndDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Log Incident / Damage Report</span>
            </h3>

            <form onSubmit={handleReportIncident} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {[
                    'Damaged Equipment',
                    'Missing Components',
                    'Late Return',
                    'Safety Concern',
                    'Unauthorized Usage',
                    'Scheduling Conflict',
                    'Equipment Malfunction',
                  ].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Impacted Resource</label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.name} ({eq.inventoryCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="low">Low (Minor cosmetic or cosmetic scratch)</option>
                  <option value="medium">Medium (Missing accessory, late return)</option>
                  <option value="high">High (Instrument malfunction, broken connector)</option>
                  <option value="critical">Critical (Electrical hazard, burnt component)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Incident Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details of visible defect, missing cables, or safety hazard..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-rose-600 text-white rounded-xl shadow hover:bg-rose-500"
                >
                  File Incident Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Resolve Incident: {resolvingIncident.ticketNumber}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record action taken by laboratory staff to close this ticket:
            </p>

            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Replaced faulty BNC ground collar with spare part from inventory. Bench tested clean."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingIncident(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
