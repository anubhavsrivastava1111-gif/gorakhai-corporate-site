import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Users, Lightbulb, Globe, TrendingUp } from 'lucide-react';
import { submitForm } from '@/lib/supabaseClient';
import { EXPERT_NETWORK } from '@/constants/testIds';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const benefits = [
  { icon: <TrendingUp size={20} />, title: 'Shape AI\'s Enterprise Future', desc: 'Collaborate with Gorakhai\'s product and research teams to define the next generation of enterprise AI infrastructure.' },
  { icon: <Users size={20} />, title: 'Exclusive Network Access', desc: 'Connect with 200+ AI practitioners, CTOs, and industry leaders across financial services, healthcare, technology, and beyond.' },
  { icon: <Lightbulb size={20} />, title: 'Early Product Access', desc: 'Get exclusive previews of new products and features before public release. Your feedback shapes what we build.' },
  { icon: <Globe size={20} />, title: 'Speaking & Publishing', desc: 'Opportunities to co-author research, speak at industry events, and establish thought leadership with Gorakhai\'s platform.' },
];

const expertiseAreas = [
  'LLM / Foundation Models', 'Enterprise AI Architecture', 'AI Safety & Alignment',
  'ML Engineering', 'Data Engineering', 'AI Product Management',
  'Financial Services AI', 'Healthcare AI', 'Legal Tech AI',
  'AI Governance & Compliance', 'NLP / RAG Systems', 'AI Infrastructure'
];

export default function ExpertNetwork() {
  useEffect(() => { document.title = 'Expert Network — Gorakhai'; }, []);

  const [form, setForm] = useState({
    name: '', email: '', company: '', expertise: [], yearsExp: '', linkedin: '', bio: '', availability: ''
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const toggleExpertise = (area) => {
    setForm(p => ({
      ...p,
      expertise: p.expertise.includes(area)
        ? p.expertise.filter(a => a !== area)
        : [...p.expertise, area]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.expertise.length === 0) e.expertise = 'Select at least one area';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      await submitForm('expert_network_registrations', {
        full_name: form.name,
        email: form.email,
        company: form.company,
        expertise_areas: form.expertise,
        years_experience: form.yearsExp,
        linkedin_url: form.linkedin,
        bio: form.bio,
        availability: form.availability,
        created_at: new Date().toISOString()
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const inputCls = (err) => `w-full px-4 py-2.5 bg-zinc-900 border rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#002FA7] transition-colors ${err ? 'border-red-500' : 'border-zinc-800 focus:border-[#002FA7]'}`;

  return (
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[300px] bg-[#002FA7]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">Expert Network</motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
            >
              Join the minds<br />
              shaping enterprise{' '}
              <span className="text-[#002FA7]">AI.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-zinc-400 leading-relaxed mb-8">
              The Gorakhai Expert Network is a curated community of AI practitioners, researchers, and industry leaders who collaborate with us to build the future of enterprise intelligence.
            </motion.p>
            <motion.a
              variants={fadeUp}
              custom={3}
              href="#register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white text-sm font-semibold rounded-md hover:bg-[#003BD1] transition-colors"
            >
              Apply to Join <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">What Is It</p>
                <h2 className="font-heading text-3xl font-bold text-white mb-4">A network built on expertise, not titles</h2>
                <p className="text-zinc-400 leading-relaxed">
                  We don't care about credentials. We care about depth of knowledge and commitment to advancing enterprise AI.
                  Our Expert Network connects 200+ practitioners who are actively building, deploying, or governing AI systems at scale.
                </p>
              </motion.div>
            </div>
            <div className="md:col-span-7">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: '200+', l: 'Active Experts' },
                  { v: '18', l: 'Industries' },
                  { v: '40+', l: 'Countries' },
                  { v: 'Quarterly', l: 'Roundtable Events' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 text-center"
                  >
                    <div className="font-heading text-3xl font-bold text-white mb-1">{item.v}</div>
                    <div className="text-xs text-zinc-500">{item.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Benefits</p>
          <h2 className="font-heading text-3xl font-bold text-white">What you gain</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-8"
            >
              <div className="text-[#002FA7] mb-4">{b.icon}</div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHO WE'RE LOOKING FOR */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Criteria</p>
            <h2 className="font-heading text-3xl font-bold text-white">Who we're looking for</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Practitioners with Depth', desc: 'You\'re actively working with AI systems — not just talking about them. You have hands-on experience deploying, evaluating, or governing AI at scale.' },
              { title: 'Independent Thinkers', desc: 'You have strong opinions informed by real experience. You\'re willing to challenge assumptions, including ours.' },
              { title: 'Collaborative by Nature', desc: 'You believe collective intelligence beats individual genius. You\'re generous with knowledge and engaged in community.' },
              { title: 'Enterprise Focus', desc: 'Your work involves AI in organizational, institutional, or industrial contexts — not just consumer applications.' }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-4">
                <CheckCircle2 size={18} className="text-[#002FA7] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Apply</p>
          <h2 className="font-heading text-3xl font-bold text-white">Express your interest</h2>
          <p className="text-zinc-500 text-sm mt-2">We review applications on a rolling basis and respond within 2 weeks.</p>
        </motion.div>

        <div className="max-w-2xl">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                  <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">Application received</h3>
                  <p className="text-zinc-400">We'll review your application and reach out within 2 weeks. Welcome to the network.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  data-testid={EXPERT_NETWORK.registerForm}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Full Name *</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Jane Smith" className={inputCls(errors.name)} />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Work Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" className={inputCls(errors.email)} />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Organization</label>
                      <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company or Institution" className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Years of Experience</label>
                      <select value={form.yearsExp} onChange={e => setForm(p => ({ ...p, yearsExp: e.target.value }))} className={inputCls()}>
                        <option value="">Select</option>
                        {['1-3 years', '3-5 years', '5-10 years', '10+ years'].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">LinkedIn URL</label>
                    <input value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="linkedin.com/in/..." className={inputCls()} />
                  </div>

                  {/* Expertise Areas */}
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">Areas of Expertise * <span className="text-zinc-700">(select all that apply)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {expertiseAreas.map((area) => (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleExpertise(area)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            form.expertise.includes(area)
                              ? 'bg-[#002FA7] border-[#002FA7] text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                    {errors.expertise && <p className="text-xs text-red-400 mt-2">{errors.expertise}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Brief Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Tell us about your work with AI systems and what you're most passionate about..." className={`${inputCls()} resize-none`} />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Availability for Collaboration</label>
                    <select value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))} className={inputCls()}>
                      <option value="">Select</option>
                      {['Ad-hoc / As needed', '1-2 hours/month', '4-8 hours/month', '8+ hours/month'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>

                  {status === 'error' && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}

                  <button
                    type="submit"
                    data-testid={EXPERT_NETWORK.submitButton}
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
      </section>
    </div>
  );
}
