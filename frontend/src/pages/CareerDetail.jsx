import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { JOB_LISTINGS } from '@/constants/mockData';
import { submitForm } from '@/lib/supabaseClient';

export default function CareerDetail() {
  const { slug } = useParams();
  const job = JOB_LISTINGS.find(j => j.slug === slug);

  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', portfolio: '', coverLetter: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) document.title = `${job.title} — Careers at Gorakhai`;
  }, [job]);

  if (!job) return <Navigate to="/careers" replace />;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      await submitForm('job_applications', {
        job_id: job.id,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        linkedin_url: form.linkedin,
        portfolio_url: form.portfolio,
        cover_letter: form.coverLetter,
        created_at: new Date().toISOString()
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const inputCls = (err) => `w-full px-4 py-2.5 bg-zinc-900 border rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#002FA7] transition-colors ${err ? 'border-red-500' : 'border-zinc-800 focus:border-[#002FA7]'}`;

  return (
    <div className="bg-[#050505] text-white">
      {/* BACK */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> All Open Roles
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Job Details */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full mb-4 inline-block">{job.department}</span>
              <h1 className="font-heading text-4xl font-bold text-white leading-tight mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
                <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />{job.type}</span>
                {job.salary_range && <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.salary_range}</span>}
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-lg font-bold text-white mb-3">About the Role</h2>
                  <p className="text-zinc-400 leading-relaxed text-sm">{job.description}</p>
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-white mb-3">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="w-1.5 h-1.5 bg-[#002FA7] rounded-full mt-1.5 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-white mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-zinc-400">
                        <CheckCircle2 size={14} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-heading text-lg font-bold text-white mb-5">Apply for this role</h2>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
                    <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-white mb-2">Application submitted!</h3>
                    <p className="text-sm text-zinc-400">We'll review your application and reach out within 5 business days.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Full Name *</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" className={inputCls(errors.name)} />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" className={inputCls(errors.email)} />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Phone</label>
                      <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">LinkedIn URL</label>
                      <input value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="linkedin.com/in/..." className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Portfolio / GitHub</label>
                      <input value={form.portfolio} onChange={e => setForm(p => ({ ...p, portfolio: e.target.value }))} placeholder="github.com/..." className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Cover Letter (optional)</label>
                      <textarea value={form.coverLetter} onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))} rows={4} placeholder="Tell us why you want to join Gorakhai..." className={`${inputCls()} resize-none`} />
                    </div>
                    {status === 'error' && <p className="text-xs text-red-400">Something went wrong. Please try again.</p>}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (<><span>Submit Application</span><ArrowRight size={14} /></>)}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
