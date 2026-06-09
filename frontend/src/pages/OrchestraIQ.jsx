import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Eye, Zap, Shield, DollarSign, Settings, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const features = [
  { icon: <GitBranch size={20} />, title: 'Multi-Model Routing', desc: 'Intelligently route each query to the optimal AI model based on task type, latency requirements, cost constraints, and quality thresholds.' },
  { icon: <Eye size={20} />, title: 'Real-Time Observability', desc: 'A unified dashboard for every AI interaction across your organization. Track latency, cost, quality scores, and usage patterns in real time.' },
  { icon: <Zap size={20} />, title: 'Workflow Builder', desc: 'Build sophisticated multi-step AI workflows with a visual drag-and-drop interface. No code required for most use cases.' },
  { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'SOC 2 Type II certified. HIPAA ready. Role-based access controls, VPC deployment, and data never leaving your infrastructure.' },
  { icon: <DollarSign size={20} />, title: 'Cost Intelligence', desc: 'Automatic cost optimization that learns from your patterns. Our customers reduce AI spend by 30–50% on average without quality degradation.' },
  { icon: <Settings size={20} />, title: 'API-First Architecture', desc: 'A clean REST and GraphQL API that integrates with your existing stack in minutes. SDKs for Python, Node.js, Go, and Java.' },
];

const useCases = [
  { title: 'Customer Support AI', desc: 'Route support queries to specialized models. Escalate complex issues automatically. Track quality and resolution rates.', industry: 'Retail & E-commerce' },
  { title: 'Financial Analysis', desc: 'Coordinate multiple analytical models for earnings analysis, risk assessment, and regulatory reporting with full audit trails.', industry: 'Financial Services' },
  { title: 'Healthcare Documentation', desc: 'HIPAA-compliant AI workflows for clinical documentation, coding assistance, and patient communication.', industry: 'Healthcare' },
  { title: 'Engineering Copilots', desc: 'Deploy specialized coding assistants, code review workflows, and documentation generation pipelines.', industry: 'Technology' },
];

export default function OrchestraIQ() {
  useEffect(() => {
    document.title = 'Orchestra IQ — AI Orchestration Platform | Gorakhai';
  }, []);

  return (
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#002FA7]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-[#002FA7]/10 border border-[#002FA7]/20 px-3 py-1.5 rounded-full mb-6">
              <Zap size={14} className="text-[#002FA7]" />
              <span className="text-xs text-[#002FA7] font-medium">Orchestra IQ</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
            >
              One Platform.{' '}
              <span className="text-[#002FA7]">Every AI Model.</span>{' '}
              Infinite Possibilities.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-zinc-400 leading-relaxed mb-10">
              Orchestra IQ is the intelligence orchestration layer that sits between your applications and the AI ecosystem. Coordinate, route, monitor, and optimize — with enterprise-grade reliability baked in from day one.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white text-sm font-semibold rounded-md hover:bg-[#003BD1] transition-colors"
              >
                Request a Demo <ArrowRight size={16} />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white text-sm font-medium rounded-md hover:border-zinc-500 transition-colors">
                See Features
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <div className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99.99%', label: 'Uptime SLA' },
              { value: '<100ms', label: 'Routing Overhead' },
              { value: '40%', label: 'Avg. Cost Reduction' },
              { value: '15+', label: 'Model Providers' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="font-heading text-3xl font-bold text-white mb-1">{m.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Platform Features</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Everything you need to orchestrate AI at scale</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-[#002FA7]/30 transition-colors group"
            >
              <div className="text-[#002FA7] mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">How It Works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Three steps to intelligent orchestration</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Connect', desc: 'Point your existing applications to the Orchestra IQ API gateway. Add your AI provider credentials. Takes under 30 minutes.' },
              { step: '02', title: 'Configure', desc: 'Define routing rules, quality thresholds, cost limits, and fallback chains using our visual configurator or YAML config.' },
              { step: '03', title: 'Optimize', desc: 'Orchestra IQ learns from every interaction. Routing intelligence improves automatically. Monitor everything in the dashboard.' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-zinc-950 border border-zinc-800 rounded-xl p-8"
              >
                <div className="font-heading text-5xl font-bold text-zinc-900 mb-4">{step.step}</div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Use Cases</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Trusted across industries</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6"
            >
              <div className="text-xs text-[#002FA7] uppercase tracking-wider font-medium mb-3">{uc.industry}</div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">{uc.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to orchestrate your AI ecosystem?
            </h2>
            <p className="text-zinc-400 mb-8">
              See how Orchestra IQ can reduce your AI costs and improve reliability within 90 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
              >
                Request a Demo <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white text-sm font-medium rounded-md hover:border-zinc-500 transition-colors"
              >
                Compare Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
