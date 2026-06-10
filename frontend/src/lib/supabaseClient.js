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

export async function submitForm(table, data) {
  const endpoint = TABLE_TO_ENDPOINT[table];
  if (endpoint && API_BASE) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Submission failed');
    }
    return await res.json();
  }
  // Fallback: log in dev mode
  console.log(`[DEV MODE] Form submission to "${table}":`, data);
  await new Promise(r => setTimeout(r, 800));
  return { success: true, mock: true };
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
