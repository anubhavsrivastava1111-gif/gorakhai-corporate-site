import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { JOB_LISTINGS, JOB_DEPARTMENTS } from '@/constants/mockData';
import { CAREERS } from '@/constants/testIds';

export default function Careers() {
  useEffect(() => { document.title = 'Careers — Gorakhai'; }, []);

  const [activeDept, setActiveDept] = useState('All');
  const filtered = activeDept === 'All' ? JOB_LISTINGS : JOB_LISTINGS.filter(j => j.department === activeDept);

  return (
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">Careers</p>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Build the future of{' '}
              <span className="text-[#002FA7]">intelligence.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              We're a team of engineers, researchers, and product thinkers working on problems that will define how enterprises operate in the AI era.
            </p>
          </motion.div>
        </div>
      </section>

      {/* JOBS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Positions</p>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">Past openings</h2>
          <p className="text-sm text-zinc-500 mb-6">These roles have been filled. We are not actively hiring at this time.</p>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2" data-testid={CAREERS.departmentFilter}>
            {JOB_DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeDept === dept ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                data-testid={`${CAREERS.jobCard}-${job.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-xl p-6 opacity-60 cursor-not-allowed"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">{job.department}</span>
                    <span className="text-xs text-emerald-600 border border-emerald-900 bg-emerald-950 px-2 py-0.5 rounded-full font-medium">✓ Already Hired</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-zinc-400 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{job.type}</span>
                    {job.salary_range && <span className="flex items-center gap-1"><Briefcase size={11} />{job.salary_range}</span>}
                  </div>
                </div>
                <div className="text-xs text-zinc-600 font-medium">Position filled</div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No roles in this department.</div>
        )}

        <div className="mt-12 p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center">
          <p className="text-zinc-400 text-sm mb-2">Interested in future opportunities?</p>
          <p className="text-zinc-500 text-sm">Send your resume to <a href="mailto:careers@gorakhai.com" className="text-white hover:text-zinc-300 transition-colors">careers@gorakhai.com</a> and we'll reach out when roles open up.</p>
        </div>
      </section>
    </div>
  );
}
