import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Brain } from 'lucide-react';
import SEOMeta from '@/components/seo/SEOMeta';
import { useFormSubmit } from '@/hooks/useFormSubmit';

const products = [
  { id: 'orchestra-iq', name: 'Orchestra IQ', desc: 'AI orchestration platform for multi-model deployments', icon: <Zap size={20} className="text-[#002FA7]" /> },
  { id: 'arjun-ai', name: 'Arjun AI', desc: 'Enterprise AI assistant with deep organizational context', icon: <Brain size={20} className="text-white" /> },
  { id: 'both', name: 'Both Platforms', desc: 'Early access to the complete Gorakhai platform suite', icon: null },
];

export default function Waitlist() {
  const { submit, status } = useFormSubmit('waitlist_subscribers');
  const [form, setForm] = useState({ email: '', name: '', company: '', jobTitle: '', product: '', sourcePage: '/waitlist' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Join the Waitlist — Gorakhai';
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid work email required';
    if (!form.product) e.product = 'Please select a product';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await submit({
      email: form.email,
      full_name: form.name,
      company: form.company,
      job_title: form.jobTitle,
      product: form.product,
      source_page: form.sourcePage
    });
  };

  const inputCls = (err) => `w-full px-4 py-2.5 bg-zinc-900 border rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#002FA7] transition-colors ${err ? 'border-red-500' : 'border-zinc-800 focus:border-[#002FA7]'}`;

  return (
    <>
      <SEOMeta
        title="Join the Waitlist"
        description="Get early access to Orchestra IQ and Arjun AI — enterprise AI platforms built for the modern organization."
        canonicalPath="/waitlist"
      />

      <div className="bg-[#050505] text-white min-h-screen">
        {/* HERO */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#002FA7]/8 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#002FA7]/10 border border-[#002FA7]/20 px-3 py-1.5 rounded-full text-xs text-[#002FA7] font-medium mb-6">
                Limited Early Access
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
                Get early access to<br />
                <span className="text-[#002FA7]">enterprise AI</span> that works.
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-4">
                Join the waitlist for Orchestra IQ and Arjun AI. We're onboarding enterprise teams in cohorts — get in line now.
              </p>
              <p className="text-sm text-zinc-600">
                Currently onboarding cohort 4 of 50 organizations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FORM */}
        <section className="pb-32 max-w-xl mx-auto px-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} className="text-green-400" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">You're on the list</h3>
                  <p className="text-zinc-400 text-sm">We'll reach out when your cohort opens. Expect to hear from us within 2 weeks.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white mb-1">Request early access</h2>
                    <p className="text-sm text-zinc-500 mb-6">No commitment. We'll follow up to schedule an onboarding call.</p>
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">Which product are you interested in? *</label>
                    <div className="space-y-2">
                      {products.map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setForm(prev => ({ ...prev, product: p.id }))}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                            form.product === p.id
                              ? 'bg-[#002FA7]/10 border-[#002FA7]/40'
                              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <div className="mt-0.5">{p.icon}</div>
                          <div>
                            <div className="text-sm font-medium text-white">{p.name}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{p.desc}</div>
                          </div>
                          {form.product === p.id && (
                            <div className="ml-auto w-4 h-4 bg-[#002FA7] rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.product && <p className="text-xs text-red-400 mt-1">{errors.product}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Work Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" className={inputCls(errors.email)} />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Full Name</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" className={inputCls()} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Company</label>
                      <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Job Title</label>
                      <input value={form.jobTitle} onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder="VP Engineering" className={inputCls()} />
                    </div>
                  </div>

                  {status === 'error' && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><span>Join the Waitlist</span><ArrowRight size={14} /></>
                    )}
                  </button>

                  <p className="text-xs text-zinc-600 text-center">
                    We only use your email to contact you about early access. No spam.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  );
}
