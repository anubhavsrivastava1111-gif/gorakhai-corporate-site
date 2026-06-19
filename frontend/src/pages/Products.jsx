import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, CheckCircle2 } from 'lucide-react';
import SEOMeta from '@/components/seo/SEOMeta';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Products() {
  return (
    <>
      <SEOMeta title="Products" description="Orchestra IQ and Arjun AI — purpose-built AI platforms for the modern enterprise." canonicalPath="/products" />
    <div className="bg-[#050505] text-white">

      {/* HERO */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
            Our Platforms
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
          >
            Two platforms.{' '}
            <span className="text-[#002FA7]">One vision.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-zinc-400 leading-relaxed">
            Orchestra IQ and Arjun AI are purpose-built for how modern enterprises operate — coordinated, context-aware, and always enterprise-grade.
          </motion.p>
        </motion.div>
      </section>

      {/* ORCHESTRA IQ */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-[#002FA7]/10 border border-[#002FA7]/20 px-3 py-1.5 rounded-full mb-6">
                  <Zap size={14} className="text-[#002FA7]" />
                  <span className="text-xs text-[#002FA7] font-medium">Orchestra IQ</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  The AI Business Operating System
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Orchestra IQ is an AI-powered business operating system for entrepreneurs and growing businesses. A full executive hierarchy debates your decisions, simulates outcomes, runs autonomous task chains, keeps the books, and exports everything to a polished document — all in one place.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'AI Boardroom — full C-suite debates your decisions',
                    'Time Machine — simulate two futures side by side',
                    'Autopilot — surfaces your six most critical decisions',
                    'Flow — routes requests through the full executive chain',
                    'Ledger — double-entry accounting with AI posting',
                    'Studio — export any output as PDF or PowerPoint'
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                      <CheckCircle2 size={16} className="text-[#002FA7] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/orchestra-iq"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002FA7] text-white text-sm font-medium rounded-md hover:bg-[#003BD1] transition-colors"
                >
                  Explore Orchestra IQ <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>

            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-2 text-xs text-zinc-600 font-mono">orchestriq.gorakhai.com</span>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                      <span className="text-xs font-medium text-zinc-300">AI Boardroom</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span className="text-xs font-medium text-zinc-300">Time Machine</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-xs font-medium text-zinc-300">Autopilot</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      <span className="text-xs font-medium text-zinc-300">Flow</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      <span className="text-xs font-medium text-zinc-300">Ledger</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                      <span className="text-xs font-medium text-zinc-300">Studio</span>
                    </div>
                  </div>
                  
                    href="https://orchestriq.gorakhai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-zinc-100 transition-colors w-full justify-center"
                  >
                    Open Orchestra IQ — free to start <ArrowRight size={13} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ARJUN AI */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Brain size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Arjun AI</div>
                    <div className="text-xs text-zinc-500">Connected to: Salesforce, Jira, Confluence</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-xs text-zinc-500">Active</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { role: 'user', text: 'What are the top 3 reasons we lost deals last quarter?' },
                    { role: 'arjun', text: 'Based on 47 closed-lost opportunities in Salesforce and call recordings in Gong:\n\n1. Pricing (34%) — 16 deals lost to competitors with lower entry price points\n2. Missing feature: SSO/SAML integration (28%) — primarily in Enterprise segment\n3. Evaluation timeline mismatch (18%) — procurement cycles extending beyond evaluation period\n\nWant me to pull the Jira tickets filed for the SSO integration?' }
                  ].map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'arjun' && (
                        <div className="w-6 h-6 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain size={12} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-sm rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                      }`}>
                        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full mb-6">
                  <Brain size={14} className="text-white" />
                  <span className="text-xs text-zinc-300 font-medium">Arjun AI</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  The Enterprise AI Assistant
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Named for legendary precision. Arjun AI connects to your systems, understands your organizational context, and delivers accurate answers with a complete audit trail.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Connects to 100+ enterprise tools',
                    'Persistent organizational memory',
                    'Multi-modal document processing',
                    'Team-specific AI personas',
                    'Complete compliance audit trail',
                    'On-premise deployment available'
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                      <CheckCircle2 size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/arjun-ai"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-100 transition-colors"
                >
                  Explore Arjun AI <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY GORAKHAI */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Why Gorakhai</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Built different by design</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Enterprise First', desc: 'Every architecture decision is made for enterprise scale, compliance, and reliability — not retrofitted later.' },
              { title: 'Model Agnostic', desc: 'We work with every major AI provider. No lock-in. Best model for every job, every time.' },
              { title: 'Fully Observable', desc: 'Every AI decision is logged, traceable, and explainable. Meet your compliance requirements on day one.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-8"
              >
                <h3 className="font-heading text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl font-bold text-white mb-4">See both platforms in action</h2>
          <p className="text-zinc-400 mb-8">Schedule a personalized demo with our solutions team.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
          >
            Request a Demo <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

    </div>
    </>
  );
}
