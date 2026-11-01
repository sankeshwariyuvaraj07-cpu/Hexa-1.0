import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  Layers,
  LogOut,
  Moon,
  Play,
  RotateCcw,
  Shield,
  Sun,
  User,
  Users,
  Wrench,
  X,
  Search,
  Lock,
  ChevronRight,
  Cpu,
  Database,
} from 'lucide-react';
import { Equipment, Laboratory, UserProfile, UserRole } from '../types';
import { DEMO_USERS, campusStore } from '../services/store';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenDemoRunner: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onBookResource?: (resource: Equipment | Laboratory, type: 'equipment' | 'laboratory') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenDemoRunner,
  onOpenAuth,
  onBookResource,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifications = campusStore.getNotifications();
  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const pendingApprovalsCount = campusStore
    .getBookings()
    .filter((b) => b.status === 'pending').length;

  const allEquipment = campusStore.getEquipment();
  const allLabs = campusStore.getLaboratories();

  const searchResults = globalSearch.trim().length > 0
    ? {
        sensors: allEquipment.filter(e => 
          (e.category === 'Sensor & Transducer' || e.name.toLowerCase().includes('sensor')) &&
          (e.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
           e.model.toLowerCase().includes(globalSearch.toLowerCase()) || 
           e.description.toLowerCase().includes(globalSearch.toLowerCase()))
        ).slice(0, 5),
        equipment: allEquipment.filter(e => 
          e.category !== 'Sensor & Transducer' && !e.name.toLowerCase().includes('sensor') &&
          (e.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
           e.model.toLowerCase().includes(globalSearch.toLowerCase()) || 
           e.category.toLowerCase().includes(globalSearch.toLowerCase()))
        ).slice(0, 4),
        labs: allLabs.filter(l => 
          l.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
          l.code.toLowerCase().includes(globalSearch.toLowerCase()) ||
          l.roomNumber.toLowerCase().includes(globalSearch.toLowerCase())
        ).slice(0, 2),
      }
    : null;

  const totalResultsCount = searchResults
    ? searchResults.sensors.length + searchResults.equipment.length + searchResults.labs.length
    : 0;

  const handleRoleChange = (role: UserRole) => {
    campusStore.setCurrentUser(role);
    setShowRoleMenu(false);
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'explore', label: 'Explore Resources' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'student', label: 'Student Hub', badge: 'Kits & Safety' },
    {
      id: 'approvals',
      label: 'Approvals',
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      instructorOnly: true,
    },
    { id: 'handovers', label: 'Handovers & Returns' },
    { id: 'laboratories', label: 'Laboratories' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'audit', label: 'Audit Trail' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      {/* Top confidential institution & security clearance bar */}
      <div className="bg-slate-950 text-white text-[10px] px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wider text-emerald-400 uppercase">
            RESTRICTED ASSET PORTAL
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 font-semibold hidden sm:inline">
            Jain College of Engineering Belagavi (JCE Belagavi)
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline">
            Dept. of Electronics &amp; Communication (Hexa-1.0)
          </span>
          <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
            CONFIDENTIAL • TIER-3 CUSTODY
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoRunner}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] transition-colors shadow-sm"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Interactive Demo (18 Steps)</span>
          </button>
          <span className="text-slate-400 hidden lg:inline">
            Active: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Campus<span className="text-emerald-600 dark:text-emerald-400">Share</span>
            </div>
            <div className="text-[9px] tracking-wider uppercase text-slate-500 dark:text-slate-400 font-semibold -mt-1">
              JCE Belagavi • Lab Portal
            </div>
          </div>
        </div>

        {/* Prominent Global Search Bar (Positioned FIRST before nav links) */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all sensors, MCU boards & equipment (e.g. Ultrasonic, ESP32, DSO)..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-12 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
            />
            {globalSearch ? (
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-2.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded border border-slate-300 dark:border-slate-600">
                /
              </span>
            )}
          </div>

          {/* Live Search Popup Menu */}
          {isSearchOpen && searchResults && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-3 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Search Results ({totalResultsCount} found)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Live Hardware Catalog
                </span>
              </div>

              {totalResultsCount === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching sensor or hardware found for &quot;{globalSearch}&quot;.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Sensor Matches */}
                  {searchResults.sensors.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>Sensors &amp; Transducers ({searchResults.sensors.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.sensors.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-700/60 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {item.model} • {item.availableQuantity} available
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                if (onBookResource) {
                                  onBookResource(item, 'equipment');
                                } else {
                                  setActiveTab('explore');
                                }
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1"
                            >
                              <span>Reserve</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Equipment Matches */}
                  {searchResults.equipment.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                        Instruments &amp; Embedded Boards ({searchResults.equipment.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.equipment.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-100 dark:border-slate-700/60 transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {item.category} • {item.laboratoryName}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                if (onBookResource) {
                                  onBookResource(item, 'equipment');
                                } else {
                                  setActiveTab('explore');
                                }
                              }}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1"
                            >
                              <span>Reserve</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Laboratory Matches */}
                  {searchResults.labs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                        Laboratories ({searchResults.labs.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.labs.map((lab) => (
                          <div
                            key={lab.id}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-700/60 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white">
                                {lab.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {lab.code} • Room {lab.roomNumber} ({lab.buildingName})
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                setActiveTab('explore');
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors"
                            >
                              View Lab
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Supabase Cloud Connection Indicator */}
          <button
            onClick={() => setActiveTab('bookings')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
            title="Supabase Cloud Storage: Connected (nozotfhooeqhetjhtjmr)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline text-[10px] font-mono tracking-tight font-bold">
              Supabase: nozotfhooeqhetjhtjmr
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Notifications
                    </span>
                    {unreadNotifs.length > 0 && (
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => campusStore.markAllNotificationsAsRead()}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          campusStore.markNotificationAsRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setShowNotifMenu(false);
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.isRead
                            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100 font-medium border-l-2 border-emerald-500'
                        }`}
                      >
                        <div className="font-semibold text-xs mb-0.5">{n.title}</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Login / Register Quick Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>

          {/* User Profile & Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                  {currentUser.role}
                </div>
              </div>
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      {currentUser.studentIdOrEmployeeId}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentUser.departmentName}
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      onOpenAuth('register');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Register New Student / Faculty Account</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sign In with Different USN / Email</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                    Or Switch Verified Demo Persona:
                  </div>

                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {DEMO_USERS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleRoleChange(u.role)}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{u.role}</div>
                          </div>
                        </div>
                        {currentUser.id === u.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] px-2">
                  <button
                    onClick={() => {
                      if (confirm('Reset all demo bookings, inventory, and laboratories to defaults?')) {
                        campusStore.resetToDefaults();
                        setShowRoleMenu(false);
                      }
                    }}
                    className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Data
                  </button>
                  <span className="text-slate-400 font-mono text-[9px]">JCE Belagavi • Hexa-1.0</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="xl:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto text-xs scrollbar-none bg-slate-50 dark:bg-slate-900/60">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
