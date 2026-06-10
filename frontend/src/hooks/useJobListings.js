import { useState, useEffect } from 'react';
import { JOB_LISTINGS } from '@/constants/mockData';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export function useJobListings({ department = null, status = 'open' } = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (department && department !== 'All') params.set('department', department);
        const res = await fetch(`${API_BASE}/api/public/careers?${params}`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error('useJobListings error:', err);
        setError(err.message);
        let filtered = JOB_LISTINGS;
        if (department && department !== 'All') filtered = filtered.filter(j => j.department === department);
        setJobs(filtered);
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
      try {
        const res = await fetch(`${API_BASE}/api/public/careers/${slug}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
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
