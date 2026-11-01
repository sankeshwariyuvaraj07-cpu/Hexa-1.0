import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  X,
  Server,
  ShieldCheck,
  Activity,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { campusStore } from '../services/store';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_BOOKINGS_TABLE_SQL,
  testSupabaseConnection,
} from '../services/supabase';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    latencyMs: number;
    tableExists: boolean;
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const syncState = campusStore.getSupabaseSyncState();
  const bookingsCount = campusStore.getBookings().length;

  useEffect(() => {
    if (isOpen && !testResult) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setSyncFeedback(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        connected: false,
        latencyMs: 0,
        tableExists: false,
        message: e?.message || 'Connection failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await campusStore.syncWithSupabase();
      setSyncFeedback(res.message);
      // Re-test connection to refresh status
      const test = await testSupabaseConnection();
      setTestResult(test);
    } catch (e: any) {
      setSyncFeedback(e?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_BOOKINGS_TABLE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Supabase Cloud Storage
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  PostgreSQL Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Project ID: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">nozotfhooeqhetjhtjmr</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              testResult?.connected
                ? testResult.tableExists
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {testResult?.connected ? (
                testResult.tableExists ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                )
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  {testResult?.connected
                    ? testResult.tableExists
                      ? 'Live Supabase Connection Established'
                      : 'Endpoint Connected — Table Setup Notice'
                    : 'Supabase Offline or Connecting...'}
                  {testResult?.latencyMs ? (
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50">
                      {testResult.latencyMs}ms ping
                    </span>
                  ) : null}
                </div>
                <p className="text-xs opacity-90 mt-1">
                  {testResult?.message ||
                    'Connecting to https://nozotfhooeqhetjhtjmr.supabase.co with supplied publishable API key.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Testing...' : 'Test Ping'}
              </button>
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <ArrowUpDown className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>

          {syncFeedback && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Connection Overview Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Storage Target</span>
                <Server className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white truncate">
                public.bookings
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                PostgreSQL Relational Table
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Total Bookings</span>
                <Layers className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {bookingsCount} Active / Past Records
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Auto-synced on create/cancel
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Auth Protocol</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white truncate">
                Anon Publishable Key
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3" /> Valid credentials loaded
              </div>
            </div>
          </div>

          {/* Configured Keys Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Supabase Credentials
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1">API Endpoint URL</label>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                  {SUPABASE_URL}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-500 dark:text-slate-400">Publishable API Key</label>
                  <button
                    onClick={copyKey}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey ? 'Copied' : 'Copy Key'}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                  {SUPABASE_ANON_KEY}
                </div>
              </div>
            </div>
          </div>

          {/* SQL Setup Helper */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                  Supabase Database Table Setup (SQL)
                </h3>
              </div>
              <button
                onClick={copySql}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If you haven't created the <code className="text-emerald-300 font-mono">public.bookings</code> table yet, open your{' '}
              <a
                href="https://supabase.com/dashboard/project/nozotfhooeqhetjhtjmr/sql/new"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Supabase SQL Editor <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and paste this script:
            </p>

            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-40 leading-relaxed select-all">
              {SUPABASE_BOOKINGS_TABLE_SQL}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded-b-3xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-emerald-500" />
            Automatic real-time sync with user's Supabase account
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
