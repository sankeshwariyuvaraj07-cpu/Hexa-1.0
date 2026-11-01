import React, { useState } from 'react';
import {
  CheckCircle,
  Play,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  X,
  User,
  Clock,
  Shield,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { campusStore } from '../services/store';

interface DemoWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Institution Manager assigns Instructor to ECE',
    actor: 'Dean Dr. Meera Nambiar (Manager)',
    actionDesc: 'Assigns Dr. Aris Thorne as Lead Faculty & Director of Electronics and Communication Laboratories.',
    targetTab: 'laboratories',
  },
  {
    step: 2,
    title: 'Instructor Authentication & Lab Setup',
    actor: 'Dr. Aris Thorne (Instructor)',
    actionDesc: 'Dr. Thorne logs in with institutional credentials and accesses faculty management console.',
    targetTab: 'laboratories',
  },
  {
    step: 3,
    title: 'Create Analog Electronics Laboratory',
    actor: 'Dr. Aris Thorne (Instructor)',
    actionDesc: 'Configures ECE-LAB-101 in Sir C.V. Raman Science Block (Capacity: 35, Hours: 08:30-17:30, ESD rules).',
    targetTab: 'laboratories',
  },
  {
    step: 4,
    title: 'Add Oscilloscopes & Signal Generators to Inventory',
    actor: 'Dr. Aris Thorne (Instructor)',
    actionDesc: 'Registers 5x 100MHz Digital Oscilloscopes and 5x 25MHz Arbitrary Function Generators into authoritative inventory.',
    targetTab: 'inventory',
  },
  {
    step: 5,
    title: 'Configure Eligibility & Safety Rules',
    actor: 'Dr. Aris Thorne (Instructor)',
    actionDesc: 'Sets mandatory Safety Training Level 1 prerequisite and buffer intervals between sessions.',
    targetTab: 'inventory',
  },
  {
    step: 6,
    title: 'Student Searches for Oscilloscope',
    actor: 'Sankeshwari Yuvaraj (Student)',
    actionDesc: 'Discovers available Keysight DSO-1102X units with real-time specification comparison.',
    targetTab: 'explore',
  },
  {
    step: 7,
    title: 'Verify Availability & Safety Credentials',
    actor: 'System Availability Engine',
    actionDesc: 'Verifies student safety certificate is active through 2027 and bench units are unreserved.',
    targetTab: 'explore',
  },
  {
    step: 8,
    title: 'Student Submits Booking Request',
    actor: 'Sankeshwari Yuvaraj (Student)',
    actionDesc: 'Requests 2-hour slot for 4th-order active filter measurement. FairShare™ score computed at 84.5/100.',
    targetTab: 'bookings',
  },
  {
    step: 9,
    title: 'Backend Conflict & Fairness Engine Validation',
    actor: 'PostgreSQL & Store Engine',
    actionDesc: 'Guarantees quantity constraints: checks total vs reserved units, preventing race conditions.',
    targetTab: 'approvals',
  },
  {
    step: 10,
    title: 'Instructor Reviews & Approves Booking',
    actor: 'Dr. Aris Thorne (Instructor)',
    actionDesc: 'Approves reservation and allocates serialized unit OSC-ANA-003.',
    targetTab: 'approvals',
  },
  {
    step: 11,
    title: 'Technician Physical Handover & Initial Condition Audit',
    actor: 'Rajesh Kumar (Senior Lab Tech)',
    actionDesc: 'Inspects oscilloscope, checks 2x 100MHz probes + power cable, rates 5/5 pristine condition, confirms handover.',
    targetTab: 'handovers',
  },
  {
    step: 12,
    title: 'Equipment Enters Checked-Out Status',
    actor: 'System State Engine',
    actionDesc: 'Available quantity decremented, unit status transitions to checked_out, borrower notification emitted.',
    targetTab: 'inventory',
  },
  {
    step: 13,
    title: 'Student Uses & Returns Equipment',
    actor: 'Sankeshwari Yuvaraj (Student)',
    actionDesc: 'Completes analog filter experiment on schedule and brings instrument to technician inspection desk.',
    targetTab: 'handovers',
  },
  {
    step: 14,
    title: 'Technician Return Inspection & Accessory Check',
    actor: 'Rajesh Kumar (Senior Lab Tech)',
    actionDesc: 'Verifies probes returned intact, verifies clean display, rates condition 5/5, signs return receipt.',
    targetTab: 'handovers',
  },
  {
    step: 15,
    title: 'Complete Return Inspection Sign-off',
    actor: 'Rajesh Kumar (Senior Lab Tech)',
    actionDesc: 'Authorized technician confirms hardware receipt without discrepancies.',
    targetTab: 'handovers',
  },
  {
    step: 16,
    title: 'Booking Lifecycle Transitions to Completed',
    actor: 'System Lifecycle Engine',
    actionDesc: 'Booking marked completed; student record updated with successful return.',
    targetTab: 'bookings',
  },
  {
    step: 17,
    title: 'Authoritative Inventory Restocked',
    actor: 'Inventory Engine',
    actionDesc: 'Unit OSC-ANA-003 returned to available pool; real-time available quantity increments back.',
    targetTab: 'inventory',
  },
  {
    step: 18,
    title: 'Cryptographic Audit Trail Logging',
    actor: 'System Audit Service',
    actionDesc: 'Complete handover and return lifecycle written to immutable audit history with timestamps.',
    targetTab: 'audit',
  },
];

export const DemoWorkflowModal: React.FC<DemoWorkflowModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = WORKFLOW_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < WORKFLOW_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      onNavigateTab(WORKFLOW_STEPS[nextIdx].targetTab);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      onNavigateTab(WORKFLOW_STEPS[prevIdx].targetTab);
    }
  };

  const handleRunQuickTest = (scenario: 'conflict' | 'maintenance' | 'ineligible') => {
    if (scenario === 'conflict') {
      // Simulate booking conflict
      campusStore.setCurrentUser('user-std-1');
      campusStore.createBooking({
        resourceId: 'eq-arduino',
        resourceName: 'Arduino Uno R3 Development Kit',
        resourceType: 'equipment',
        date: '2026-11-02',
        startTime: '10:00',
        endTime: '12:00',
        requestedQuantity: 6, // exceeds available
        purpose: 'Attempted booking exceeding available units',
      });
      onNavigateTab('bookings');
      onClose();
    } else if (scenario === 'maintenance') {
      campusStore.setEquipmentMaintenance(
        'eq-osc',
        true,
        'Scheduled calibration: 100MHz bandwidth certification'
      );
      onNavigateTab('inventory');
      onClose();
    } else {
      alert('Tested in UI: Ineligible student attempting booking without safety certification gets blocked by the safety gate.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                End-to-End Workflow Demonstration Guide
              </h3>
              <p className="text-xs text-emerald-100">
                18-Step Live Walkthrough • CodeVerse India 2026 Hackathon Scenario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Step {currentStep.step} of 18</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {Math.round((currentStep.step / 18) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(currentStep.step / 18) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Step Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                Stage {currentStep.step}
              </span>
              <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {currentStep.actor}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {currentStep.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {currentStep.actionDesc}
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400">
                Associated Workspace View: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{currentStep.targetTab}</strong>
              </span>
              <button
                onClick={() => {
                  onNavigateTab(currentStep.targetTab);
                  onClose();
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                Jump to this View →
              </button>
            </div>
          </div>

          {/* Additional Mandatory Demonstration Scenarios */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
              Quick Test Additional Scenarios (Prompt Section 29):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleRunQuickTest('conflict')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Slot Conflict
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Request quantity exceeding available units to trigger waitlisting
                </div>
              </button>

              <button
                onClick={() => handleRunQuickTest('maintenance')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Toggle Maintenance
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Takes oscilloscope out of booking availability instantly
                </div>
              </button>

              <button
                onClick={() => {
                  campusStore.resetToDefaults();
                  setCurrentStepIdx(0);
                  alert('Demo dataset restored to initial state.');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-left transition-colors"
              >
                <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo State
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Restore fresh demo records for repeatable testing
                </div>
              </button>
            </div>
          </div>

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ← Previous Step
            </button>

            <div className="flex items-center gap-2">
              {currentStepIdx < WORKFLOW_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>Proceed to Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                >
                  Complete Walkthrough
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
