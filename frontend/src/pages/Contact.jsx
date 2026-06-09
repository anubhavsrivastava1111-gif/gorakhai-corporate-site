import { useState } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, Phone, MapPin, ArrowRight, Linkedin, Twitter } from 'lucide-react';
import { submitForm } from '@/lib/supabaseClient';
import { CONTACT } from '@/constants/testIds';

const interests = ['Orchestra IQ', 'Arjun AI', 'Both Platforms', 'Enterprise Pricing', 'Technical Integration', 'General Inquiry'];

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us — Gorakhai';
  }, []);

  const [form, setForm] = useState({ name: '', email: '', company: '', jobTitle: '', interest: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setStatus('loading');
    try {
      await submitForm('contact_submissions', {
        full_name: form.name,
        email: form.email,
        company: form.company,
        job_title: form.jobTitle,
        product_interest: form.interest,
        message: form.message,
        form_source: 'contact',
        created_at: new Date().toISOString()
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        data-testid={CONTACT[`${key}Input`] || `contact-input-${key}`}
        className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#002FA7] transition-colors ${errors[key] ? 'border-red-500' : 'border-zinc-800 focus:border-[#002FA7]'}`}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Contact</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
            Let's build<br />
            <span className="text-[#002FA7]">intelligence</span> together.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Tell us about your use case and we'll show you how Gorakhai can transform your AI operations.
          </p>
        </motion.div>
      </section>

      {/* CONTACT FORM + INFO */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8">
              <h2 className="font-heading text-xl font-bold text-white mb-6">Request a Demo</h2>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    data-testid={CONTACT.successMessage}
                    className="py-12 text-center"
                  >
                    <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={28} className="text-green-400" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">Message sent</h3>
                    <p className="text-zinc-400 text-sm">We'll be in touch within one business day.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field('Full Name *', 'name', 'text', 'Jane Smith')}
                      {field('Work Email *', 'email', 'email', 'jane@company.com')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field('Company', 'company', 'text', 'Acme Corp')}
                      {field('Job Title', 'jobTitle', 'text', 'VP Engineering')}
                    </div>

                    {/* Interest */}
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Area of Interest</label>
                      <select
                        value={form.interest}
                        onChange={(e) => setForm(p => ({ ...p, interest: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7] transition-colors"
                      >
                        <option value="">Select an option</option>
                        {interests.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                        data-testid={CONTACT.messageInput}
                        placeholder="Tell us about your use case, current AI infrastructure, and what you're looking to achieve..."
                        rows={4}
                        className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#002FA7] transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-zinc-800 focus:border-[#002FA7]'}`}
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
                    )}

                    <button
                      type="submit"
                      data-testid={CONTACT.submitButton}
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><span>Send Message</span> <ArrowRight size={15} /></>
                      )}
                    </button>

                    <p className="text-xs text-zinc-600 text-center">
                      We typically respond within one business day.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-600 mb-0.5">General Inquiries</div>
                    <a href="mailto:hello@gorakhai.com" className="text-sm text-zinc-300 hover:text-white transition-colors">hello@gorakhai.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-600 mb-0.5">Enterprise Sales</div>
                    <a href="mailto:enterprise@gorakhai.com" className="text-sm text-zinc-300 hover:text-white transition-colors">enterprise@gorakhai.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-600 mb-0.5">Headquarters</div>
                    <div className="text-sm text-zinc-300">548 Market St, Suite 29000<br />San Francisco, CA 94104</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Other Inquiries</h3>
              <div className="space-y-3">
                {[
                  { label: 'Press & Media', email: 'press@gorakhai.com' },
                  { label: 'Partnerships', email: 'partners@gorakhai.com' },
                  { label: 'Security Issues', email: 'security@gorakhai.com' },
                  { label: 'Customer Support', email: 'support@gorakhai.com' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{item.label}</span>
                    <a href={`mailto:${item.email}`} className="text-xs text-zinc-400 hover:text-white transition-colors">{item.email}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
              <h3 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wider">Follow Us</h3>
              <div className="flex gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-md text-sm text-zinc-400 hover:text-white transition-colors">
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-md text-sm text-zinc-400 hover:text-white transition-colors">
                  <Twitter size={14} /> Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
