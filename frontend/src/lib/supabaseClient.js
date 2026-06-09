import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  !!(supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function submitForm(table, data) {
  if (!isSupabaseConfigured || !supabase) {
    console.log(`[DEV MODE] Form submission to "${table}":`, data);
    await new Promise(r => setTimeout(r, 800));
    return { success: true, mock: true };
  }
  const { error } = await supabase.from(table).insert(data);
  if (error) throw new Error(error.message);
  return { success: true };
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
