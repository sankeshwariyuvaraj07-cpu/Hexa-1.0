import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
  Wrench,
  X,
  CheckCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Laboratory, UserProfile } from '../types';
import { campusStore, DEMO_DEPARTMENTS } from '../services/store';

interface LaboratoryManagerProps {
  currentUser: UserProfile;
  onSelectLabForBooking?: (lab: Laboratory) => void;
}

export const LaboratoryManager: React.FC<LaboratoryManagerProps> = ({
  currentUser,
  onSelectLabForBooking,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLabDetails, setSelectedLabDetails] = useState<Laboratory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-ece');
  const [buildingName, setBuildingName] = useState('Sir C.V. Raman Science Block');
  const [floor, setFloor] = useState('1st Floor');
  const [roomNumber, setRoomNumber] = useState('R-108');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [operatingStart, setOperatingStart] = useState('08:30');
  const [operatingEnd, setOperatingEnd] = useState('17:30');
  const [minHours, setMinHours] = useState(1);
  const [maxHours, setMaxHours] = useState(4);
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [eligibleGroups, setEligibleGroups] = useState('ECE 2nd-4th Year, Research Scholars');
  const [safetyRequirements, setSafetyRequirements] = useState('ESD Wristband, Safety Goggles');
  const [trainingRequired, setTrainingRequired] = useState('Basic Laboratory Safety Module 1');
  const [supervisionRequired, setSupervisionRequired] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  );

  const laboratories = campusStore.getLaboratories();
  const equipment = campusStore.getEquipment();
  const bookings = campusStore.getBookings();

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDept = DEMO_DEPARTMENTS.find((d) => d.id === departmentId);

    campusStore.createLaboratory({
      name,
      code,
      institutionId: 'inst-abc',
      departmentId,
      departmentName: selectedDept ? selectedDept.name : 'Engineering',
      buildingName,
      floor,
      roomNumber,
      description,
      capacity: Number(capacity),
      openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      operatingHours: { start: operatingStart, end: operatingEnd },
      bookingDurationLimits: { minHours: Number(minHours), maxHours: Number(maxHours) },
      bufferMinutesBetweenReservations: Number(bufferMinutes),
      eligibleStudentGroups: eligibleGroups.split(',').map((s) => s.trim()),
      safetyRequirements: safetyRequirements.split(',').map((s) => s.trim()),
      trainingRequired,
      supervisionRequired,
      approvalRequired,
      usageRestrictions: 'Adhere to institutional laboratory guidelines.',
      labManagerId: currentUser.id,
      labManagerName: currentUser.name,
      photoUrl,
    });

    setShowCreateModal(false);
  };

  const isStaff = ['instructor', 'technician', 'manager', 'admin'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Institutional Laboratories &amp; Research Centers
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {laboratories.length} Laboratories
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse facilities, view operating schedules, check assigned equipment inventory, or reserve lab spaces.
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Laboratory</span>
          </button>
        )}
      </div>

      {/* Grid of Laboratories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laboratories.map((lab) => {
          const labEquipment = equipment.filter((eq) => eq.laboratoryId === lab.id);
          const labBookings = bookings.filter((b) => b.resourceId === lab.id && b.status === 'approved');

          return (
            <div
              key={lab.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={lab.photoUrl}
                    alt={lab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {lab.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Cap: {lab.capacity} Students
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {lab.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{lab.buildingName}, {lab.floor} ({lab.roomNumber})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lab.description}
                  </p>

                  {/* Schedule & Guidelines Badge */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{lab.operatingHours.start} - {lab.operatingHours.end}</span>
                    </div>
                    <span>•</span>
                    <div>
                      {labEquipment.length} Registered Instruments
                    </div>
                  </div>

                  {/* Safety requirement tag */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      <strong>Prerequisite:</strong> {lab.trainingRequired}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedLabDetails(lab)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  View Details &amp; Equipment
                </button>

                {onSelectLabForBooking && (
                  <button
                    onClick={() => onSelectLabForBooking(lab)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Reserve Facility
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lab Details Modal */}
      {selectedLabDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {selectedLabDetails.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedLabDetails.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedLabDetails.departmentName} • {selectedLabDetails.buildingName}, {selectedLabDetails.roomNumber}
                </div>
              </div>
              <button
                onClick={() => setSelectedLabDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedLabDetails.description}
            </p>

            {/* Spec grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px]">Student Capacity</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{selectedLabDetails.capacity} benches</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px]">Operating Hours</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{selectedLabDetails.operatingHours.start} - {selectedLabDetails.operatingHours.end}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px]">Max Duration</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{selectedLabDetails.bookingDurationLimits.maxHours} hours/slot</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px]">Supervision</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{selectedLabDetails.supervisionRequired ? 'Mandatory' : 'Optional'}</div>
              </div>
            </div>

            {/* Assigned Equipment */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Assigned Equipment in this Laboratory ({equipment.filter((e) => e.laboratoryId === selectedLabDetails.id).length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {equipment
                  .filter((e) => e.laboratoryId === selectedLabDetails.id)
                  .map((eq) => (
                    <div
                      key={eq.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{eq.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{eq.inventoryCode} • Model: {eq.model}</div>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          {eq.availableQuantity} of {eq.totalQuantity} Avail
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Safety & Restrictions */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <div><strong>Safety Directives:</strong> {selectedLabDetails.safetyRequirements.join(', ')}</div>
              <div><strong>Permitted User Groups:</strong> {selectedLabDetails.eligibleStudentGroups.join(', ')}</div>
              <div><strong>Lab Supervisor:</strong> {selectedLabDetails.labManagerName}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLabDetails(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Laboratory Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Register New Laboratory Facility</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLab} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Laboratory Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Microwave & Optical Systems Lab"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Laboratory Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. ECE-LAB-304"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {DEMO_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Building</label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Room Number &amp; Floor</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description &amp; Research Focus</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of bench setup, supported courses, and equipment available..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Capacity (Students)</label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={operatingStart}
                    onChange={(e) => setOperatingStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={operatingEnd}
                    onChange={(e) => setOperatingEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Buffer (Minutes)</label>
                  <input
                    type="number"
                    value={bufferMinutes}
                    onChange={(e) => setBufferMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Eligible Student Groups</label>
                  <input
                    type="text"
                    value={eligibleGroups}
                    onChange={(e) => setEligibleGroups(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Mandatory Training Requirement</label>
                  <input
                    type="text"
                    value={trainingRequired}
                    onChange={(e) => setTrainingRequired(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supervisionRequired}
                    onChange={(e) => setSupervisionRequired(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Instructor Supervision Required</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={approvalRequired}
                    onChange={(e) => setApprovalRequired(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Booking Requires Faculty Approval</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-500"
                >
                  Create Laboratory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
