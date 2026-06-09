import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Briefcase } from 'lucide-react';
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
            <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
              {[
                { v: '45+', l: 'Team Members' },
                { v: 'Remote First', l: 'Work Anywhere' },
                { v: '$38M', l: 'Series A' },
              ].map((item) => (
                <div key={item.l}>
                  <span className="font-heading font-bold text-white">{item.v}</span>
                  <span className="ml-1.5 text-zinc-500">{item.l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Why Gorakhai</p>
            <h2 className="font-heading text-3xl font-bold text-white">Built for people who want to matter</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Competitive Compensation', desc: 'Top-of-market salary, meaningful equity, and comprehensive benefits.' },
              { title: 'Remote-First Culture', desc: 'Work from anywhere. Async by default. Results over face time.' },
              { title: 'Frontier Work', desc: 'Solve problems that don\'t have solutions yet. Your work ships to enterprise customers globally.' },
              { title: 'Learning Budget', desc: '$3,000 annual learning budget for courses, conferences, and books.' },
              { title: 'Health & Wellness', desc: 'Full medical, dental, vision. Mental health coverage. Wellness stipend.' },
              { title: 'Mission-Driven', desc: 'We\'re building infrastructure that amplifies human intelligence. The stakes are real.' },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-zinc-950 border border-zinc-900 rounded-xl p-6"
              >
                <h3 className="font-heading text-sm font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
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
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Open Positions</p>
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Current openings</h2>

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
              <Link
                to={`/careers/${job.slug}`}
                data-testid={`${CAREERS.jobCard}-${job.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">{job.department}</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white group-hover:text-zinc-200 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{job.type}</span>
                    {job.salary_range && <span className="flex items-center gap-1"><Briefcase size={11} />{job.salary_range}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all">
                  View Role <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No open roles in this department right now.</div>
        )}

        <div className="mt-12 p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center">
          <p className="text-zinc-400 text-sm mb-2">Don't see the right role?</p>
          <p className="text-zinc-500 text-sm mb-4">We're always interested in exceptional people. Send your resume to <a href="mailto:careers@gorakhai.com" className="text-white hover:text-zinc-300 transition-colors">careers@gorakhai.com</a></p>
        </div>
      </section>
    </div>
  );
}
