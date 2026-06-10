import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { JOB_LISTINGS } from '@/constants/mockData';

export function useJobListings({ department = null, status = 'open' } = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        let filtered = JOB_LISTINGS;
        if (department) filtered = filtered.filter(j => j.department === department);
        setJobs(filtered);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('job_listings')
          .select('*')
          .eq('status', status)
          .order('posted_at', { ascending: false });

        if (department) query = query.eq('department', department);

        const { data, error: err } = await query;
        if (err) throw err;
        setJobs(data || []);
      } catch (err) {
        console.error('useJobListings error:', err);
        setError(err.message);
        setJobs(JOB_LISTINGS);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [department, status]);

  return { jobs, loading, error };
}

export function useJobListing(slug) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchJob() {
      setLoading(true);

      if (!isSupabaseConfigured || !supabase) {
        setJob(JOB_LISTINGS.find(j => j.slug === slug) || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('job_listings')
          .select('*')
          .eq('slug', slug)
          .single();

        if (err) throw err;
        setJob(data);
      } catch (err) {
        setError(err.message);
        setJob(JOB_LISTINGS.find(j => j.slug === slug) || null);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [slug]);

  return { job, loading, error };
}
