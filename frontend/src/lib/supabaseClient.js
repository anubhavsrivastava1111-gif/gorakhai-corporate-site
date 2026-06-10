import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export const isSupabaseConfigured =
  !!(supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Map legacy Supabase table names → backend API endpoints
const TABLE_TO_ENDPOINT = {
  contact_submissions: '/api/public/contact',
  newsletter_subscribers: '/api/public/newsletter/subscribe',
  waitlist_subscribers: '/api/public/waitlist/join',
  expert_network_registrations: '/api/public/experts/apply',
  job_applications: '/api/public/careers/apply',
};

// Phase A message shown when backend is not yet active
const PHASE_A_MSG =
  'Our submission system is being activated. For immediate assistance, please email hello@gorakhai.com — we respond within one business day.';

export async function submitForm(table, data) {
  const endpoint = TABLE_TO_ENDPOINT[table];
  if (endpoint && API_BASE) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Submission failed. Please try again.');
      }
      return await res.json();
    } catch (fetchErr) {
      // If it is already a meaningful server error, re-throw as-is
      if (fetchErr.message && fetchErr.message !== 'Failed to fetch' && !(fetchErr instanceof TypeError)) {
        throw fetchErr;
      }
      // Network error — backend not yet reachable (Phase A or server down)
      throw new Error(PHASE_A_MSG);
    }
  }
  // Backend URL not configured — Phase A frontend-only deployment
  throw new Error(PHASE_A_MSG);
}

export async function fetchRows(table, query = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, mock: true };
  }
  let q = supabase.from(table).select('*');
  if (query.eq) {
    Object.entries(query.eq).forEach(([col, val]) => { q = q.eq(col, val); });
  }
  if (query.order) q = q.order(query.order.column, { ascending: query.order.ascending ?? false });
  if (query.limit) q = q.limit(query.limit);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return { data };
}
