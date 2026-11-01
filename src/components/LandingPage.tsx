import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Boxes,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  GraduationCap,
  HeartPulse,
  Layers,
  Lock,
  MapPin,
  Radio,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { ThreeLaboratoryScene } from './ThreeLaboratoryScene';
import { campusStore } from '../services/store';
import { Equipment, Laboratory } from '../types';

interface LandingPageProps {
  isDarkMode: boolean;
  onExplore: () => void;
  onListResource: () => void;
  onBookResource: (resource: Equipment | Laboratory, type: 'equipment' | 'laboratory') => void;
  onOpenStudentHub?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isDarkMode,
  onExplore,
  onListResource,
  onBookResource,
  onOpenStudentHub,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all-sensors');

  const allEquipment = campusStore.getEquipment();
  const laboratories = campusStore.getLaboratories();
  const activeInstruments = allEquipment.length;

  // Sensor equipment filter
  const sensors = allEquipment.filter(
    (e) => e.category === 'Sensor & Transducer' || e.name.toLowerCase().includes('sensor')
  );

  // Embedded & MCU equipment
  const embeddedBoards = allEquipment.filter(
    (e) => e.category === 'Development Board' || e.laboratoryId === 'lab-embedded'
  );

  // Dynamic filter for top search box
  const searchResults = allEquipment.filter((item) => {
    const matchesText =
      heroSearch.trim() === '' ||
      item.name.toLowerCase().includes(heroSearch.toLowerCase()) ||
      item.model.toLowerCase().includes(heroSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(heroSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(heroSearch.toLowerCase());

    if (activeQuickFilter === 'all-sensors') {
      return matchesText && (item.category === 'Sensor & Transducer' || item.name.toLowerCase().includes('sensor'));
    }
    if (activeQuickFilter === 'embedded') {
      return matchesText && item.category === 'Development Board';
    }
    if (activeQuickFilter === 'measurement') {
      return matchesText && (item.category === 'Oscilloscope' || item.category === 'Communication Tester' || item.category === 'Digital Multimeter');
    }
    return matchesText;
  });

  const faqs = [
    {
      q: 'How does the FairShare™ allocation algorithm prevent resource hoarding?',
      a: 'FairShare™ computes a transparent priority score (0–100) using 50% recent borrowing history, 30% waiting notice time, and 20% academic necessity (e.g., capstone milestones, exam practicals). Eligible students with infrequent recent usage are prioritized, and waiting lists are automatically promoted when cancellations occur.',
    },
    {
      q: 'How are physical handovers and condition reports verified?',
      a: 'Before equipment leaves the laboratory, an authorized technician audits accessories (test probes, cables, power leads) and records a baseline 5-star condition rating. Upon return, a matching inspection is conducted. If damage or missing parts are reported, both records are preserved for faculty investigation without automatic algorithmic penalties.',
    },
    {
      q: 'Can students access laboratories without safety training?',
      a: 'No. CampusShare enforces prerequisite safety training (e.g. ESD protection, high-voltage precautions, cleanroom etiquette). Students lacking certified safety clearance are guided to required training modules before booking requests can be submitted.',
    },
    {
      q: 'Can instructors configure operating hours and booking duration limits?',
      a: 'Yes. Instructors have full administrative authority over their assigned laboratories, setting opening days, operating hours, maximum booking durations (1–4 hours), buffer times between reservations, and supervisor presence rules.',
    },
    {
      q: 'Is CampusShare limited to Electronics & Communication departments?',
      a: 'No. While our primary deployment showcases Jain College of Engineering Belagavi (JCE Belagavi) ECE laboratories & Embedded Systems Suites by Hexa-1.0 Team, the platform supports multiple departments (Computer Science, Mechanical Engineering, Biotechnology) with configurable categories and institutional policies.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 0. CONFIDENTIAL INSTITUTIONAL SECURITY STRIP */}
      <div className="glass-panel rounded-2xl p-3 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
          </span>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>CONFIDENTIAL INSTITUTIONAL ASSET REGISTRY</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                VTU TIER-3
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Jain College of Engineering Belagavi • Dept. of Electronics &amp; Communication (Hexa-1.0)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>256-BIT AUDIT CHAIN ACTIVE</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            HASH: 8f4e...9a0c
          </span>
        </div>
      </div>

      {/* 1. SEARCH OPTION AT THE VERY FIRST (User requirement: "keep search option at the frist") */}
      <section className="glass-card-elevated rounded-3xl p-6 sm:p-8 space-y-5 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background tech glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Instant Hardware &amp; Sensor Discovery Terminal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Find &amp; Book Any Laboratory Equipment, Sensor, or MCU Board
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search 30+ serialized instruments, microcontrollers, environmental probes, and biosensors at JCE Belagavi.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-emerald-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Type sensor or equipment name (e.g. Ultrasonic HC-SR04, DHT22, ESP32, MPU6050, Oscilloscope, Logic Analyzer)..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500/40 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium shadow-inner"
          />
          {heroSearch && (
            <button
              onClick={() => setHeroSearch('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Quick Categories:
          </span>
          <button
            onClick={() => setActiveQuickFilter('all-sensors')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeQuickFilter === 'all-sensors'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>All Sensors &amp; Modules ({sensors.length})</span>
          </button>
          <button
            onClick={() => setActiveQuickFilter('embedded')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeQuickFilter === 'embedded'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Embedded MCU Boards ({embeddedBoards.length})</span>
          </button>
          <button
            onClick={() => setActiveQuickFilter('measurement')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeQuickFilter === 'measurement'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Oscilloscopes &amp; Analyzers</span>
          </button>
          <button
            onClick={() => setActiveQuickFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeQuickFilter === 'all'
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            View All ({allEquipment.length})
          </button>
        </div>

        {/* Live Search Results Carousel / Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Matching Available Hardware ({searchResults.length})</span>
              <span className="text-[10px] text-emerald-500 font-mono">Live Inventory</span>
            </span>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Open Full Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchResults.slice(0, 8).map((eq) => (
              <div
                key={eq.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-bold">
                      {eq.inventoryCode}
                    </span>
                    <span className="font-semibold text-slate-400">
                      {eq.availableQuantity} of {eq.totalQuantity} units
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
                    {eq.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {eq.description}
                  </p>

                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    Location: <strong className="text-slate-600 dark:text-slate-300">{eq.laboratoryName}</strong>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onBookResource(eq, 'equipment')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Book Order Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Hero Presentation with 3D Workbench */}
      <section className="relative pt-2">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Jain College of Engineering Belagavi • Electronics &amp; Communication</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Make Every Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">Count.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover, share, and manage laboratory equipment, sensors, and development suites across departments. Strict custody lifecycle with zero hoardings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <span>Explore All Resources</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenStudentHub && (
              <button
                onClick={onOpenStudentHub}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
              >
                <span>Student Hub &amp; Capstone Kits</span>
                <GraduationCap className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onListResource}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2"
            >
              <span>Browse Laboratories</span>
            </button>
          </div>
        </div>

        {/* 3D Scene Viewport with mouse parallax */}
        <div className="max-w-5xl mx-auto">
          <ThreeLaboratoryScene isDarkMode={isDarkMode} />
        </div>
      </section>

      {/* 3. DEDICATED SENSORS & TRANSDUCERS SUITE (User requirement: "keep the all sensor equipment") */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>Embedded Systems &amp; IoT Laboratory (Room R-210)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Complete Sensor &amp; Transducer Suite ({sensors.length} Modules)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Precision calibrated environmental, motion, ultrasonic, biomedical, and electrical transducers available for capstone and lab research at JCE Belagavi.
            </p>
          </div>

          <button
            onClick={onExplore}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Filter by Sensors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                    {sensor.inventoryCode}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {sensor.availableQuantity} Available
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug">
                    {sensor.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Model: {sensor.model}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {sensor.description}
                </p>

                {/* Included Accessories & Pinout specs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-[11px] space-y-1.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    Included Harness &amp; Accessories:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {sensor.accessoriesIncluded.join(' • ')}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div>
                    Limit: <strong>{sensor.minBookingDurationHours}-{sensor.maxBookingDurationHours} hrs</strong>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {sensor.trainingRequirement}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onBookResource(sensor, 'equipment')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Book Sensor Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How CampusShare Works Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How CampusShare Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            From search to return, an accountable end-to-end custody lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black text-base flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Discover &amp; Check Rules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Search real-time sensor inventory and lab schedules. Verify prerequisite safety modules and available bench capacity.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-black text-base flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              FairShare™ Scheduling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent priority scoring prevents monopolization. Overlap engines guarantee no double bookings or race conditions.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-base flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Inspected Handover
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lab technicians verify borrower credentials, inspect included probes/leads, and record an initial 5-star condition report.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-base flex items-center justify-center">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Return &amp; Audit Trail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Return condition is checked against the handover audit. Clean equipment is restocked automatically in the database.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CONFIDENTIAL ACADEMIC GOVERNANCE & VTU CLEARANCE */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            Confidential Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Trust, Safety &amp; Prerequisite Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Delicate RF instruments, high-voltage test supplies, and precision sensor arrays cannot be handed out without verified competence. CampusShare verifies institutional safety training and faculty approval before confirming bookings.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Mandatory Safety Level 1 certification gates student requests</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Independent technician condition inspection at every return</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Role-Based Access Control: Students cannot self-assign faculty privileges</span>
            </div>
          </div>
        </div>

        {/* Visual Badge Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-40 h-40 text-emerald-400" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 font-bold">JCE-BELAGAVI-VERIFIED</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">AUTH-LEVEL-03 • RESTRICTED</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">Borrower Identity &amp; Clearance</div>
            <div className="text-base font-bold text-white">Sankeshwari Yuvaraj (USN: 2JG22EC089)</div>
            <div className="text-xs text-emerald-400">ECE Final Year • Safety Clearance Level 2 Passed</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl text-xs space-y-1 border border-slate-700/60">
            <div className="text-slate-400 text-[10px]">Authorizing Faculty / Lab In-Charge</div>
            <div className="font-bold text-slate-200">Dr. Aris Thorne (ECE Lab Director)</div>
            <div className="text-[11px] text-slate-400">
              Approved for Embedded Systems Suite • Room R-210
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about resource allocation, safety rules, and custody.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-4 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-3"
              >
                <span>{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
            C
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">CampusShare</span>
          <span className="text-emerald-600 font-semibold">• Hexa-1.0 Team</span>
        </div>

        <div>
          Jain College of Engineering Belagavi • Electronics and Communication Engineering Department
        </div>

        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
          CONFIDENTIAL INSTITUTIONAL DEPLOYMENT • VTU COMPLIANT
        </div>
      </footer>
    </div>
  );
};
