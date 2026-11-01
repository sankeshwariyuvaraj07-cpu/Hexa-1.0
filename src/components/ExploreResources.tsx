import React, { useState } from 'react';
import {
  Boxes,
  Building2,
  Calendar,
  Clock,
  Filter,
  Grid,
  List,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Equipment, Laboratory, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface ExploreResourcesProps {
  currentUser: UserProfile;
  onBookResource: (resource: Equipment | Laboratory, type: 'equipment' | 'laboratory') => void;
}

export const ExploreResources: React.FC<ExploreResourcesProps> = ({
  currentUser,
  onBookResource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'equipment' | 'laboratory'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [labFilter, setLabFilter] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const equipment = campusStore.getEquipment();
  const laboratories = campusStore.getLaboratories();

  // Dynamically collect unique categories from equipment
  const categories = [
    'all',
    ...Array.from(new Set(equipment.map((eq) => eq.category))).sort(),
  ];

  // Filter Equipment
  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.laboratoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    const matchesLab = labFilter === 'all' || eq.laboratoryId === labFilter;
    const matchesAvail = !onlyAvailable || (eq.availableQuantity > 0 && !eq.isUnderMaintenance);
    return matchesSearch && matchesCategory && matchesLab && matchesAvail;
  });

  // Filter Laboratories
  const filteredLaboratories = laboratories.filter((lab) => {
    const matchesSearch =
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLab = labFilter === 'all' || lab.id === labFilter;
    const matchesAvail = !onlyAvailable || (lab.isAvailable && lab.isPublished);
    return matchesSearch && matchesLab && matchesAvail;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Explore Laboratories &amp; Equipment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search authorized college facilities, verify prerequisite certifications, and reserve time slots.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters Controls */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by instrument name, laboratory code, model (e.g. Oscilloscope, Arduino, R-104)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setTypeFilter('equipment')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                typeFilter === 'equipment'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Instruments Only ({filteredEquipment.length})
            </button>
            <button
              onClick={() => setTypeFilter('laboratory')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                typeFilter === 'laboratory'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Laboratories Only ({filteredLaboratories.length})
            </button>
          </div>

          {/* Availability Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Available Units Only</span>
          </label>
        </div>

        {/* Laboratory Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">
            Laboratory:
          </span>
          <button
            onClick={() => setLabFilter('all')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              labFilter === 'all'
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Facilities
          </button>
          {laboratories.map((lab) => (
            <button
              key={lab.id}
              onClick={() => setLabFilter(lab.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                labFilter === lab.id
                  ? 'bg-teal-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lab.name}
            </button>
          ))}
        </div>

        {/* Category Pills (Only if equipment included) */}
        {typeFilter !== 'laboratory' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 pb-1 scrollbar-none">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">
              Hardware:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Hardware' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Results Section */}
      {(typeFilter === 'all' || typeFilter === 'equipment') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              <span>Laboratory Instruments &amp; Development Kits ({filteredEquipment.length})</span>
            </h2>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-3'
            }
          >
            {filteredEquipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={eq.photoUrl}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {eq.inventoryCode}
                    </div>
                    <div className="absolute top-3 right-3">
                      {eq.isUnderMaintenance ? (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Under Maintenance
                        </span>
                      ) : eq.availableQuantity > 0 ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {eq.availableQuantity} of {eq.totalQuantity} Available
                        </span>
                      ) : (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Fully Reserved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {eq.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        {eq.name}
                      </h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Model: {eq.model} • {eq.manufacturer}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {eq.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{eq.laboratoryName}</span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {eq.minBookingDurationHours}-{eq.maxBookingDurationHours} hrs limit
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    disabled={eq.isUnderMaintenance}
                    onClick={() => onBookResource(eq, 'equipment')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      eq.isUnderMaintenance
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{eq.availableQuantity > 0 ? 'Reserve Equipment' : 'Join Waiting List'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Laboratories Results Section */}
      {(typeFilter === 'all' || typeFilter === 'laboratory') && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Laboratories &amp; Specialized Workspaces ({filteredLaboratories.length})</span>
            </h2>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-3'
            }
          >
            {filteredLaboratories.map((lab) => (
              <div
                key={lab.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
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
                      Capacity: {lab.capacity}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {lab.name}
                      </h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>{lab.buildingName}, {lab.floor} ({lab.roomNumber})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {lab.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{lab.operatingHours.start} - {lab.operatingHours.end}</span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {lab.bookingDurationLimits.maxHours}h max
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onBookResource(lab, 'laboratory')}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Reserve Laboratory Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
