import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudRain,
  Code2,
  Compass,
  Copy,
  Cpu,
  FileCheck,
  Flame,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Layers,
  Lock,
  Plus,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { ProjectKitBundle, SensorPinoutGuide, StudentSafetyModule, UserProfile } from '../types';
import { campusStore } from '../services/store';

interface StudentPortalProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: string) => void;
  onBookResource: (resource: any, type: 'equipment' | 'laboratory') => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  onNavigateTab,
  onBookResource,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kits' | 'pinouts' | 'safety' | 'active'>('kits');
  const [selectedKitForOrder, setSelectedKitForOrder] = useState<ProjectKitBundle | null>(null);
  const [kitOrderDate, setKitOrderDate] = useState('2026-11-03');
  const [kitOrderTime, setKitOrderTime] = useState('10:00');
  const [kitOrderHours, setKitOrderHours] = useState(3);
  const [kitOrderPurpose, setKitOrderPurpose] = useState('Capstone project demonstration & prototype assembly');
  const [teamUSNs, setTeamUSNs] = useState('2JI21EC045, 2JI21EC092');

  // Quiz State
  const [quizModule, setQuizModule] = useState<StudentSafetyModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Extension Modal State
  const [extendingBookingId, setExtendingBookingId] = useState<string | null>(null);
  const [extensionHours, setExtensionHours] = useState(2);
  const [extensionReason, setExtensionReason] = useState('Need additional debugging time for I2C bus timing.');

  // Code snippet copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const projectKits = campusStore.getProjectKitBundles();
  const safetyModules = campusStore.getStudentSafetyModules();
  const pinoutGuides = campusStore.getSensorPinoutGuides();
  const userBookings = campusStore.getBookings().filter((b) => b.userId === currentUser.id);
  const activeBorrowedItems = userBookings.filter((b) => ['approved', 'checked_out', 'pending'].includes(b.status));

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBookEntireKit = () => {
    if (!selectedKitForOrder) return;
    const usnArray = teamUSNs.split(',').map((u) => u.trim()).filter(Boolean);
    const result = campusStore.bookProjectKitBundle(
      selectedKitForOrder.id,
      kitOrderDate,
      kitOrderTime,
      kitOrderHours,
      kitOrderPurpose,
      usnArray
    );

    if (result.success) {
      setSelectedKitForOrder(null);
      onNavigateTab('bookings');
    }
  };

  // Sample Level 3 Quiz questions
  const quizQuestions = [
    {
      q: 'What is the required preheat stabilization time before taking calibrated measurements on the MQ-2 Flammable Gas Sensor?',
      options: ['30 seconds', '15-20 minutes', '24 to 48 hours for first use, 5 mins thereafter', 'Instantaneous (0 seconds)'],
      correct: 2,
    },
    {
      q: 'What is the absolute maximum isolation voltage between current conductor and logic pins on the ACS712 current module?',
      options: ['50V DC', '2.1 kVRMS (Galvanic isolation)', '10,000V AC', '12V DC'],
      correct: 1,
    },
    {
      q: 'When using an oscilloscope to probe a live AC-coupled linear power supply, what precaution is vital regarding the probe ground alligator clip?',
      options: [
        'The ground clip must connect to mains Earth ground; never clip to an unreferenced floating high potential',
        'Connect ground clip to any live positive terminal',
        'Remove probe ground clip and leave dangling',
        'Invert oscilloscope power plug',
      ],
      correct: 0,
    },
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score += 33.4;
    });
    const finalScore = Math.min(100, Math.round(score));
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    if (finalScore >= 66 && quizModule) {
      campusStore.completeSafetyQuiz(quizModule.id, finalScore);
    }
  };

  const handleConfirmExtension = () => {
    if (!extendingBookingId) return;
    campusStore.requestBookingExtension(extendingBookingId, extensionHours, extensionReason);
    setExtendingBookingId(null);
  };

  const getKitIcon = (name: string) => {
    switch (name) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-emerald-500" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-green-500" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-teal-500" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-cyan-500" />;
      default:
        return <Cpu className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. STUDENT ACADEMIC IDENTITY & CREDENTIAL SMART CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow & Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {currentUser.name}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {currentUser.studentIdOrEmployeeId || '2JI21EC089'}
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  VTU ACCREDITED
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                Jain College of Engineering Belagavi • Dept. of Electronics &amp; Communication (Hexa-1.0)
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safety Status: {currentUser.safetyTrainingVerified ? 'Level 2/3 Certified' : 'Pending Certification'}</span>
                </span>
                <span>•</span>
                <span>Valid Until: <strong>{currentUser.trainingExpiresAt || '2027-06-30'}</strong></span>
                <span>•</span>
                <span>Completed Orders: <strong>{currentUser.totalBookingsCompleted || userBookings.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">FairShare™ Score</div>
              <div className="text-xl font-black text-emerald-400">96<span className="text-xs text-slate-400">/100</span></div>
              <div className="text-[9px] text-emerald-500 font-medium">Top Priority Tier</div>
            </div>

            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Orders</div>
              <div className="text-xl font-black text-white">{activeBorrowedItems.length}</div>
              <div className="text-[9px] text-slate-400">In Hand / Pending</div>
            </div>

            <div className="text-center px-3">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Project Kits</div>
              <div className="text-xl font-black text-teal-400">6</div>
              <div className="text-[9px] text-teal-500">1-Click Bundles</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('kits')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'kits'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Capstone &amp; Mini-Project Kits (6)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pinouts')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'pinouts'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Sensor Pinouts &amp; Code Hub</span>
        </button>

        <button
          onClick={() => setActiveSubTab('safety')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'safety'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety Certifications &amp; Quizzes (3)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'active'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Checkouts &amp; Extensions ({activeBorrowedItems.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENT: CAPSTONE & MINI-PROJECT KITS */}
      {activeSubTab === 'kits' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Pre-Engineered Capstone &amp; Mini-Project Kits</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reserve all sensors, microcontrollers, cables, and breakout shields in one request for your semester projects.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg font-bold">
              Team Booking Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/50 transition-all group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getKitIcon(kit.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {kit.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        ★ {kit.popularity}% Match
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {kit.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug mt-0.5">
                      {kit.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {kit.targetCourse}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {kit.description}
                  </p>

                  {/* Bundled Equipment List */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1.5 border border-slate-100 dark:border-slate-700/60 text-[11px]">
                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-[10px] uppercase tracking-wider">
                      Included Hardware ({kit.equipmentNames.length} items):
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {kit.equipmentNames.map((name, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Est. Build: <strong>{kit.estimatedHours} Hours</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Schematics Included</span>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedKitForOrder(kit)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Order Entire Project Kit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: SENSOR PINOUTS & CODE HUB */}
      {activeSubTab === 'pinouts' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600" />
              <span>Interactive Sensor Pinout &amp; Quick-Start Code Hub</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified wiring schematics, voltage limits, and Arduino / ESP32 sample code to prevent hardware damage.
            </p>
          </div>

          <div className="space-y-6">
            {pinoutGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {guide.sensorName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                        Voltage: {guide.operatingVoltage}
                      </span>
                      <span>•</span>
                      <span className="font-mono bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded font-bold">
                        Bus: {guide.communicationBus}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const eq = campusStore.getEquipment().find((e) => e.id === guide.equipmentId);
                      if (eq) onBookResource(eq, 'equipment');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Reserve This Sensor</span>
                  </button>
                </div>

                {/* Pinout Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2 font-semibold">Pin Label</th>
                        <th className="py-2 font-semibold">Signal Function</th>
                        <th className="py-2 font-semibold">Wiring &amp; Voltage Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {guide.pinout.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2 font-bold text-emerald-600 dark:text-emerald-400">
                            {p.pin}
                          </td>
                          <td className="py-2 text-slate-800 dark:text-slate-200">
                            {p.function}
                          </td>
                          <td className="py-2 text-slate-500 dark:text-slate-400 font-sans text-[11px]">
                            {p.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Wiring Precautions */}
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Essential Wiring Precautions</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-900/80 dark:text-amber-200/80 space-y-0.5 text-[11px]">
                    {guide.precautions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Sample Code Snippet */}
                <div className="relative">
                  <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2 rounded-t-2xl text-[11px] font-mono">
                    <span>Sample C++ / Arduino Driver Code</span>
                    <button
                      onClick={() => handleCopyCode(guide.id, guide.sampleSnippet)}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === guide.id ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-slate-100 rounded-b-2xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800 border-t-0">
                    <code>{guide.sampleSnippet}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: SAFETY TRAINING & QUIZZES */}
      {activeSubTab === 'safety' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Laboratory Safety Clearances &amp; Certification Quizzes</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Complete short safety modules to unlock high-voltage power supplies, combustible gas sensors, and RF transceivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      {mod.tier}
                    </span>
                    {mod.status === 'passed' ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Certified ({mod.score}%)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Quiz Required
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-[11px] space-y-1 border border-slate-100 dark:border-slate-700/60">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Hardware Unlocked Upon Passing:
                    </div>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
                      {mod.unlocks.map((u, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  {mod.status === 'passed' ? (
                    <div className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-center text-xs font-bold rounded-xl">
                      Completed on {mod.completedAt}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizModule(mod);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Take 3-Question Verification Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: ACTIVE CHECKOUTS & EXTENSIONS */}
      {activeSubTab === 'active' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Active Equipment Custody &amp; Due Dates</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track borrowed sensors and MCU boards, monitor return deadlines, and request custody extensions.
              </p>
            </div>
          </div>

          {activeBorrowedItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No Active Hardware Checked Out
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All your previous equipment orders have been returned and cleared by laboratory technicians.
              </p>
              <button
                onClick={() => setActiveSubTab('kits')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Capstone Kits
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBorrowedItems.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg">
                        ORDER #{booking.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {booking.resourceName}
                    </h3>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Scheduled Window: <strong>{booking.date} • {booking.startTime} - {booking.endTime}</strong> ({booking.durationHours} hrs total)
                    </div>

                    {booking.additionalNotes && (
                      <div className="text-[11px] text-slate-400 italic">
                        {booking.additionalNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setExtendingBookingId(booking.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request Extension (+2h)</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('bookings')}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all w-full sm:w-auto"
                    >
                      View Custody Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ORDER ENTIRE PROJECT KIT MODAL */}
      {selectedKitForOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Capstone Kit Bundle Request
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedKitForOrder.title}
                </h3>
                <div className="text-xs text-slate-400">
                  {selectedKitForOrder.targetCourse}
                </div>
              </div>
              <button
                onClick={() => setSelectedKitForOrder(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Required Hardware ({selectedKitForOrder.equipmentNames.length} items to be reserved):
                </label>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                  {selectedKitForOrder.equipmentNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Pickup Date:
                  </label>
                  <input
                    type="date"
                    value={kitOrderDate}
                    onChange={(e) => setKitOrderDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Start Time:
                  </label>
                  <input
                    type="time"
                    value={kitOrderTime}
                    onChange={(e) => setKitOrderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Duration (Hours):
                </label>
                <select
                  value={kitOrderHours}
                  onChange={(e) => setKitOrderHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={2}>2 Hours (Lab Practical)</option>
                  <option value={3}>3 Hours (Standard)</option>
                  <option value={4}>4 Hours (Extended Session)</option>
                  <option value={6}>6 Hours (Capstone Review)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Project Team Members (USNs):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2JI21EC089, 2JI21EC045, 2JI21EC092"
                  value={teamUSNs}
                  onChange={(e) => setTeamUSNs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  All listed teammates will share academic custody credit upon successful return.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Academic Project Objective:
                </label>
                <textarea
                  rows={2}
                  value={kitOrderPurpose}
                  onChange={(e) => setKitOrderPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedKitForOrder(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBookEntireKit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Bundled Kit Reservation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SAFETY VERIFICATION QUIZ MODAL */}
      {quizModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Safety Certification Examination
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {quizModule.title}
                </h3>
              </div>
              <button
                onClick={() => setQuizModule(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4 text-xs">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {idx + 1}. {q.q}
                    </div>
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`quiz-q-${idx}`}
                            checked={quizAnswers[idx] === optIdx}
                            onChange={() =>
                              setQuizAnswers({
                                ...quizAnswers,
                                [idx]: optIdx,
                              })
                            }
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Quiz &amp; Verify Clearance</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  quizScore >= 66 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-600'
                }`}>
                  {quizScore >= 66 ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {quizScore >= 66 ? 'Safety Clearance Approved!' : 'Review Guidelines & Retry'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    You scored <strong>{quizScore}%</strong> on the assessment.
                  </p>
                </div>

                {quizScore >= 66 ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-2xl">
                    High voltage, RF emission, and gas detection hardware privileges have been activated on your digital student profile.
                  </p>
                ) : (
                  <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/60 p-3 rounded-2xl">
                    Minimum 66% score required. Please re-read the laboratory safety protocols before retrying.
                  </p>
                )}

                <button
                  onClick={() => setQuizModule(null)}
                  className="px-6 py-2 bg-slate-900 text-white dark:bg-emerald-600 text-xs font-bold rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: EXTENSION REQUEST MODAL */}
      {extendingBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Request Custody Extension
                </h3>
                <div className="text-xs text-slate-400">
                  Order Reference: ORD-{extendingBookingId.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setExtendingBookingId(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Additional Custody Hours:
                </label>
                <select
                  value={extensionHours}
                  onChange={(e) => setExtensionHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={1}>+1 Hour Extension</option>
                  <option value={2}>+2 Hours Extension (Recommended)</option>
                  <option value={3}>+3 Hours Extension</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Academic Justification / Notes for Faculty:
                </label>
                <textarea
                  rows={3}
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setExtendingBookingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExtension}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
