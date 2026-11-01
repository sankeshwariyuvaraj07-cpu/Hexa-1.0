import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Wrench,
  X,
  AlertTriangle,
  Info,
  Clock,
  Shield,
  Layers,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Equipment, EquipmentCategory, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface EquipmentManagerProps {
  currentUser: UserProfile;
  onSelectEquipmentForBooking?: (equipment: Equipment) => void;
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({
  currentUser,
  onSelectEquipmentForBooking,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEqDetails, setSelectedEqDetails] = useState<Equipment | null>(null);

  // Form State for Adding Equipment
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('Oscilloscope');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [inventoryCode, setInventoryCode] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(5);
  const [laboratoryId, setLaboratoryId] = useState('lab-analog');
  const [minHours, setMinHours] = useState(1);
  const [maxHours, setMaxHours] = useState(4);
  const [accessoriesText, setAccessoriesText] = useState('Power Cable, Test Leads, Calibration Manual');
  const [trainingRequirement, setTrainingRequirement] = useState('Standard Lab Safety Module');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  );

  const equipmentList = campusStore.getEquipment();
  const laboratories = campusStore.getLaboratories();

  const isStaff = ['instructor', 'technician', 'manager', 'admin'].includes(currentUser.role);

  // Calculations
  const totalUnitsAll = equipmentList.reduce((sum, e) => sum + e.totalQuantity, 0);
  const availableUnitsAll = equipmentList.reduce((sum, e) => sum + e.availableQuantity, 0);
  const reservedUnitsAll = equipmentList.reduce((sum, e) => sum + e.reservedQuantity, 0);
  const checkedOutUnitsAll = equipmentList.reduce((sum, e) => sum + e.checkedOutQuantity, 0);
  const maintenanceUnitsAll = equipmentList.reduce((sum, e) => sum + e.maintenanceQuantity, 0);

  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.inventoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || eq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    const lab = laboratories.find((l) => l.id === laboratoryId);

    campusStore.addEquipment({
      name,
      category,
      model,
      manufacturer,
      description,
      institutionId: 'inst-abc',
      departmentId: lab ? lab.departmentId : 'dept-ece',
      departmentName: lab ? lab.departmentName : 'Electronics & Communication',
      laboratoryId,
      laboratoryName: lab ? lab.name : 'Analog Electronics Laboratory',
      inventoryCode,
      totalQuantity: Number(totalQuantity),
      minBookingDurationHours: Number(minHours),
      maxBookingDurationHours: Number(maxHours),
      eligibilityRequirement: 'Verified Institutional Students',
      trainingRequirement,
      requiresSupervision: false,
      requiresInstructorApproval: true,
      currentCondition: 'Excellent',
      isUnderMaintenance: false,
      depositAmount: 0,
      responsibleStaffName: currentUser.name,
      isPublished: true,
      photoUrl,
      accessoriesIncluded: accessoriesText.split(',').map((s) => s.trim()),
    });

    setShowAddModal(false);
  };

  const handleToggleMaintenance = (eq: Equipment) => {
    campusStore.setEquipmentMaintenance(
      eq.id,
      !eq.isUnderMaintenance,
      eq.isUnderMaintenance ? undefined : 'Scheduled routine calibration & safety check'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Equipment Inventory &amp; Asset Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track total quantities, individual serial codes, active checkouts, and maintenance status.
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Equipment</span>
          </button>
        )}
      </div>

      {/* Real-time Inventory Quantity Cards (Prompt Section 8 requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Total Registered Units</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalUnitsAll}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across all laboratories</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Available Now</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {availableUnitsAll}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ready for booking</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-amber-500 font-medium">Reserved</div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {reservedUnitsAll}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved future slots</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-blue-500 font-medium">Checked Out</div>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {checkedOutUnitsAll}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active with borrowers</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] text-rose-500 font-medium">In Maintenance</div>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {maintenanceUnitsAll}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Calibration / Repair</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search equipment by name, code or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0 scrollbar-none">
          {['all', 'Oscilloscope', 'Function Generator', 'Digital Multimeter', 'Power Supply', 'Development Board', 'Trainer Kit', '3D Printer'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Equipment &amp; Model</th>
                <th className="p-4">Lab Location</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Available</th>
                <th className="p-4 text-center">Reserved</th>
                <th className="p-4 text-center">In Use</th>
                <th className="p-4 text-center">Maint</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEquipment.map((eq) => (
                <tr
                  key={eq.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={eq.photoUrl}
                        alt={eq.name}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {eq.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {eq.inventoryCode} • {eq.model}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    <div className="font-medium">{eq.laboratoryName}</div>
                    <div className="text-[10px] text-slate-400">{eq.departmentName}</div>
                  </td>

                  <td className="p-4 text-center font-bold text-slate-800 dark:text-slate-200">
                    {eq.totalQuantity}
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {eq.availableQuantity}
                    </span>
                  </td>

                  <td className="p-4 text-center text-amber-600 dark:text-amber-400 font-medium">
                    {eq.reservedQuantity}
                  </td>

                  <td className="p-4 text-center text-blue-600 dark:text-blue-400 font-medium">
                    {eq.checkedOutQuantity}
                  </td>

                  <td className="p-4 text-center text-rose-600 dark:text-rose-400 font-medium">
                    {eq.maintenanceQuantity}
                  </td>

                  <td className="p-4 text-center">
                    {eq.isUnderMaintenance ? (
                      <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        Under Maintenance
                      </span>
                    ) : eq.availableQuantity > 0 ? (
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        Operational
                      </span>
                    ) : (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        Fully Booked
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEqDetails(eq)}
                        className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                      >
                        Units
                      </button>

                      {onSelectEquipmentForBooking && !eq.isUnderMaintenance && (
                        <button
                          onClick={() => onSelectEquipmentForBooking(eq)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm"
                        >
                          Book
                        </button>
                      )}

                      {isStaff && (
                        <button
                          onClick={() => handleToggleMaintenance(eq)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            eq.isUnderMaintenance
                              ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                              : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                          }`}
                          title={eq.isUnderMaintenance ? 'Restore from maintenance' : 'Schedule maintenance'}
                        >
                          <Wrench className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unit Level Serial Breakdown Modal */}
      {selectedEqDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {selectedEqDetails.inventoryCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedEqDetails.name} — Unit Serial Registry
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedEqDetails.laboratoryName} • Model: {selectedEqDetails.model}
                </div>
              </div>
              <button
                onClick={() => setSelectedEqDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Individual Serial Units Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Unit Tag</th>
                    <th className="p-3">Hardware Serial</th>
                    <th className="p-3">Physical Condition</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Storage Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedEqDetails.units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {unit.unitCode}
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        {unit.serialNumber}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            unit.condition === 'Excellent'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : unit.condition === 'Good'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {unit.condition}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            unit.status === 'available'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                              : unit.status === 'checked_out'
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                              : unit.status === 'reserved'
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300'
                          }`}
                        >
                          {unit.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {unit.storageLocation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-[11px] text-slate-500">
                Accessories included: {selectedEqDetails.accessoriesIncluded.join(', ')}
              </div>
              <button
                onClick={() => setSelectedEqDetails(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-600" />
                <span>Register Equipment into Inventory</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Digital Storage Oscilloscope 100MHz"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {[
                      'Oscilloscope',
                      'Function Generator',
                      'Digital Multimeter',
                      'Power Supply',
                      'Development Board',
                      'Trainer Kit',
                      '3D Printer',
                      'Computer Workstation',
                      'Communication Tester',
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Model / Series</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. DSO-1102X"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Keysight / Tektronix"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Inventory Prefix</label>
                  <input
                    type="text"
                    required
                    value={inventoryCode}
                    onChange={(e) => setInventoryCode(e.target.value)}
                    placeholder="e.g. OSC-ECE"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Laboratory</label>
                  <select
                    value={laboratoryId}
                    onChange={(e) => setLaboratoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {laboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name} ({lab.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Total Quantity to Register</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description &amp; Specifications</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bandwidth, sampling rate, accessories, or safety requirements..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Included Accessories (comma-separated)</label>
                <input
                  type="text"
                  value={accessoriesText}
                  onChange={(e) => setAccessoriesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-500"
                >
                  Generate Units &amp; Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
