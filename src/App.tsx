import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ExploreResources } from './components/ExploreResources';
import { MyBookings } from './components/MyBookings';
import { ApprovalsDashboard } from './components/ApprovalsDashboard';
import { HandoverManager } from './components/HandoverManager';
import { LaboratoryManager } from './components/LaboratoryManager';
import { EquipmentManager } from './components/EquipmentManager';
import { IncidentMaintenanceManager } from './components/IncidentMaintenanceManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AuditLogViewer } from './components/AuditLogViewer';
import { BookingModal } from './components/BookingModal';
import { DemoWorkflowModal } from './components/DemoWorkflowModal';
import { AuthModal } from './components/AuthModal';
import { StudentPortal } from './components/StudentPortal';
import { campusStore } from './services/store';
import { Equipment, Laboratory, UserProfile } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('campusshare_theme') === 'dark';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Booking Modal State
  const [bookingResource, setBookingResource] = useState<{
    resource: Equipment | Laboratory;
    type: 'equipment' | 'laboratory';
  } | null>(null);

  // Demo Runner Modal State
  const [isDemoRunnerOpen, setIsDemoRunnerOpen] = useState(false);

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current reactive user
  const [currentUser, setCurrentUser] = useState<UserProfile>(campusStore.getCurrentUser());

  // Store subscription
  useEffect(() => {
    const unsubscribe = campusStore.subscribe(() => {
      setCurrentUser({ ...campusStore.getCurrentUser() });
    });
    return unsubscribe;
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campusshare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campusshare_theme', 'light');
    }
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenBooking = (
    resource: Equipment | Laboratory,
    type: 'equipment' | 'laboratory'
  ) => {
    setBookingResource({ resource, type });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Toast Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 dark:bg-emerald-950 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 text-xs flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenDemoRunner={() => setIsDemoRunnerOpen(true)}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode);
          setIsAuthOpen(true);
        }}
        onBookResource={handleOpenBooking}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            isDarkMode={isDarkMode}
            onExplore={() => setActiveTab('explore')}
            onListResource={() => setActiveTab('laboratories')}
            onBookResource={handleOpenBooking}
            onOpenStudentHub={() => setActiveTab('student')}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreResources
            currentUser={currentUser}
            onBookResource={handleOpenBooking}
          />
        )}

        {activeTab === 'bookings' && (
          <MyBookings
            currentUser={currentUser}
            onExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'student' && (
          <StudentPortal
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onBookResource={handleOpenBooking}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalsDashboard currentUser={currentUser} />
        )}

        {activeTab === 'handovers' && (
          <HandoverManager currentUser={currentUser} />
        )}

        {activeTab === 'laboratories' && (
          <LaboratoryManager
            currentUser={currentUser}
            onSelectLabForBooking={(lab) => handleOpenBooking(lab, 'laboratory')}
          />
        )}

        {activeTab === 'inventory' && (
          <EquipmentManager
            currentUser={currentUser}
            onSelectEquipmentForBooking={(eq) => handleOpenBooking(eq, 'equipment')}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentMaintenanceManager currentUser={currentUser} />
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'audit' && <AuditLogViewer />}
      </main>

      {/* Booking Modal */}
      {bookingResource && (
        <BookingModal
          resource={bookingResource.resource}
          resourceType={bookingResource.type}
          currentUser={currentUser}
          isOpen={true}
          onClose={() => setBookingResource(null)}
          onSuccess={(id) => {
            showToast(`Reservation submitted successfully (#${id}). You can review its approval state in My Bookings.`);
            setActiveTab('bookings');
          }}
        />
      )}

      {/* Demo Workflow Runner Modal */}
      <DemoWorkflowModal
        isOpen={isDemoRunnerOpen}
        onClose={() => setIsDemoRunnerOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Login & Registration Portal Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          showToast(`Welcome ${user.name}! Authenticated as ${user.role}.`);
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
