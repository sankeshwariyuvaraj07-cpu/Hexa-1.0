import { createClient } from '@supabase/supabase-js';
import { Booking } from '../types';

// Supabase project credentials provided for nozotfhooeqhetjhtjmr
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://nozotfhooeqhetjhtjmr.supabase.co';
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_iTyeorcUrU5Ge__kECIcqw_ulcueuEX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseSyncState {
  status: 'connected' | 'syncing' | 'error' | 'disconnected' | 'table_pending';
  lastSyncedAt: string | null;
  errorMessage: string | null;
  totalSynced: number;
}

// SQL Schema for user reference or instant copy
export const SUPABASE_BOOKINGS_TABLE_SQL = `-- Run this in Supabase Dashboard -> SQL Editor (Project: nozotfhooeqhetjhtjmr)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL,
    resource_name TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    user_email TEXT NOT NULL,
    department_id TEXT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration_hours NUMERIC DEFAULT 1,
    requested_quantity INTEGER DEFAULT 1,
    purpose TEXT,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority_score NUMERIC,
    priority_explanation TEXT,
    approved_by TEXT,
    approved_at TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    raw_data JSONB
);

-- Enable RLS and allow public anon access for this demo/app
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on bookings" ON public.bookings;
CREATE POLICY "Allow anon all on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Maps application Booking object to Supabase database row representation
 */
export function mapBookingToSupabaseRow(booking: Booking) {
  return {
    id: booking.id,
    resource_id: booking.resourceId,
    resource_name: booking.resourceName,
    resource_type: booking.resourceType,
    user_id: booking.userId,
    user_name: booking.userName,
    user_role: booking.userRole,
    user_email: booking.userEmail,
    department_id: booking.departmentId || null,
    date: booking.date,
    start_time: booking.startTime,
    end_time: booking.endTime,
    duration_hours: booking.durationHours,
    requested_quantity: booking.requestedQuantity,
    purpose: booking.purpose,
    additional_notes: booking.additionalNotes || null,
    status: booking.status,
    priority_score: booking.priority?.score ?? 50,
    priority_explanation: booking.priority?.explanation ?? '',
    approved_by: booking.approvedBy || null,
    approved_at: booking.approvedAt || null,
    rejection_reason: booking.rejectionReason || null,
    created_at: booking.createdAt || new Date().toISOString(),
    raw_data: booking,
  };
}

/**
 * Maps Supabase database row back to application Booking object
 */
export function mapSupabaseRowToBooking(row: any): Booking {
  if (row.raw_data && typeof row.raw_data === 'object' && row.raw_data.id) {
    return {
      ...row.raw_data,
      status: row.status || row.raw_data.status,
      rejectionReason: row.rejection_reason || row.raw_data.rejectionReason,
    };
  }

  return {
    id: row.id,
    resourceId: row.resource_id,
    resourceName: row.resource_name,
    resourceType: row.resource_type || 'equipment',
    userId: row.user_id,
    userName: row.user_name,
    userRole: row.user_role || 'student',
    userEmail: row.user_email,
    departmentId: row.department_id || 'dept-ece',
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    durationHours: Number(row.duration_hours) || 1,
    requestedQuantity: Number(row.requested_quantity) || 1,
    purpose: row.purpose || '',
    additionalNotes: row.additional_notes || undefined,
    status: row.status || 'pending',
    priority: {
      score: Number(row.priority_score) || 50,
      recentUsageFactor: 25,
      waitingTimeFactor: 15,
      bookingNeedFactor: 10,
      explanation: row.priority_explanation || 'Restored from Supabase',
    },
    createdAt: row.created_at || new Date().toISOString(),
    approvedBy: row.approved_by || undefined,
    approvedAt: row.approved_at || undefined,
    rejectionReason: row.rejection_reason || undefined,
  };
}

/**
 * Probe connection to user's Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  tableExists: boolean;
  message: string;
}> {
  const start = performance.now();
  try {
    const { data, error } = await supabase.from('bookings').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // 42P01 is PostgreSQL code for relation does not exist
      if (error.code === '42P01' || error.message.includes('relation "public.bookings" does not exist') || error.message.includes('does not exist')) {
        return {
          connected: true,
          latencyMs,
          tableExists: false,
          message: 'Connected to Supabase endpoint, but the "bookings" table needs to be created in your SQL Editor.',
        };
      }
      return {
        connected: false,
        latencyMs,
        tableExists: false,
        message: `Supabase returned error: ${error.message} (${error.code || 'unknown'})`,
      };
    }

    return {
      connected: true,
      latencyMs,
      tableExists: true,
      message: `Successfully connected to Supabase project nozotfhooeqhetjhtjmr (Found ${data ? data.length : 0} probe record).`,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs,
      tableExists: false,
      message: err?.message || 'Network error attempting to reach Supabase project.',
    };
  }
}

/**
 * Save or update a booking appointment in Supabase
 */
export async function saveBookingToSupabase(booking: Booking): Promise<{
  success: boolean;
  error?: string;
  tablePending?: boolean;
}> {
  try {
    const row = mapBookingToSupabaseRow(booking);
    const { error } = await supabase.from('bookings').upsert(row, { onConflict: 'id' });

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.bookings" does not exist') || error.message.includes('does not exist')) {
        console.warn('Supabase "bookings" table does not exist yet. Please create it using the provided SQL snippet.', error);
        return { success: false, tablePending: true, error: 'Table "bookings" not yet created in Supabase.' };
      }
      console.error('Error saving booking to Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync booking to Supabase:', err);
    return { success: false, error: err?.message || 'Failed to sync with Supabase cloud.' };
  }
}

/**
 * Cancel or update a booking in Supabase
 */
export async function cancelBookingInSupabase(bookingId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        rejection_reason: `Cancelled by user: ${reason}`,
      })
      .eq('id', bookingId);

    if (error) {
      console.warn('Error cancelling booking in Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to cancel booking in Supabase:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch all bookings saved in Supabase
 */
export async function fetchBookingsFromSupabase(): Promise<{
  success: boolean;
  bookings: Booking[];
  error?: string;
  tablePending?: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { success: false, bookings: [], tablePending: true, error: 'Table "bookings" not created yet.' };
      }
      return { success: false, bookings: [], error: error.message };
    }

    const bookings = (data || []).map(mapSupabaseRowToBooking);
    return { success: true, bookings };
  } catch (err: any) {
    return { success: false, bookings: [], error: err?.message || 'Fetch error' };
  }
}

/**
 * Bulk upload local bookings to Supabase
 */
export async function syncAllBookingsToSupabase(bookings: Booking[]): Promise<{
  syncedCount: number;
  error?: string;
  tablePending?: boolean;
}> {
  if (!bookings || bookings.length === 0) {
    return { syncedCount: 0 };
  }

  try {
    const rows = bookings.map(mapBookingToSupabaseRow);
    const { data, error } = await supabase.from('bookings').upsert(rows, { onConflict: 'id' });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { syncedCount: 0, tablePending: true, error: error.message };
      }
      return { syncedCount: 0, error: error.message };
    }

    return { syncedCount: bookings.length };
  } catch (err: any) {
    return { syncedCount: 0, error: err?.message };
  }
}
