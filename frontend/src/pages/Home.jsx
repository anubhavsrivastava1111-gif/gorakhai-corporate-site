import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Shield, BarChart3, GitBranch, Eye } from 'lucide-react';
import NewsletterForm from '@/components/sections/NewsletterForm';
import SEOMeta, { OrganizationSchema, WebSiteSchema } from '@/components/seo/SEOMeta';
import { HOME } from '@/constants/testIds';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  })
};

const features = [
  { icon: <GitBranch size={20} />, title: 'Multi-Model Orchestration', desc: 'Intelligently route workloads across GPT-4, Claude, Gemini, and custom models with a single API.' },
  { icon: <Shield size={20} />, title: 'Security-First Design', desc: 'Built with encryption in transit, workspace isolation, and on-premise deployment options for organizations that need them.' },
  { icon: <Eye size={20} />, title: 'Real-Time Observability', desc: 'Full visibility into every AI interaction. Latency, cost, quality — all in one pane.' },
  { icon: <Zap size={20} />, title: 'Workflow Automation', desc: 'Build complex multi-step AI workflows with a visual builder. No code required.' },
  { icon: <BarChart3 size={20} />, title: 'Cost Intelligence', desc: 'Automatically routes each task to the most cost-efficient model available, without sacrificing output quality.' },
  { icon: <Brain size={20} />, title: 'Context Memory', desc: 'Persistent organizational context across every session. Arjun AI learns your business.' },
];

const marqueeItems = ['AI Orchestration', 'Enterprise Grade', 'Multi-Model Routing', 'Real-Time Analytics', 'Privacy First', 'On-Premise Deployment', 'API First'];

export default function Home() {
  return (
    <>
      <SEOMeta
        description="Gorakhai builds enterprise AI infrastructure. Orchestra IQ orchestrates your AI ecosystem. Arjun AI amplifies your team."
        canonicalPath="/"
        schema={[OrganizationSchema, WebSiteSchema]}
      />
    <div className="bg-[#050505] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#002FA7]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6"
            >
              Enterprise AI Infrastructure
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              The Intelligence{' '}
              <span className="text-[#002FA7]">Infrastructure</span>{' '}
              Layer for Tomorrow's Enterprise
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-zinc-400 leading-relaxed max-w-2xl mb-10"
            >
              Orchestra IQ orchestrates your AI ecosystem. Arjun AI amplifies your team.
              Together, they transform how your organization thinks, decides, and operates.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/products"
                data-testid={HOME.heroCta}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
              >
                Explore Our Platform <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                data-testid={HOME.heroDemoCta}
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-zinc-700 text-white text-sm font-medium rounded-md hover:border-zinc-500 transition-colors"
              >
                Schedule a Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-zinc-900 py-4 overflow-hidden bg-zinc-950/50">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-8 text-xs uppercase tracking-[0.2em] text-zinc-600 font-mono">
              <span className="w-1 h-1 bg-[#002FA7] rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Our Platforms</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Two platforms. One vision.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Orchestra IQ Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-8 hover:border-zinc-600 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#002FA7]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#002FA7]/10 border border-[#002FA7]/20 rounded-lg mb-6">
                <Zap size={18} className="text-[#002FA7]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Orchestra IQ</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                An AI-powered business operating system with a full executive hierarchy, scenario simulation, autonomous task chains, integrated accounting, and intelligent document export. Built for entrepreneurs and growing businesses.
              </p>
              <ul className="space-y-2 mb-8">
                {['AI Boardroom & executive hierarchy', 'Time Machine scenario simulation', 'Autonomous task chains', 'Integrated double-entry Ledger'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-1 h-1 bg-[#002FA7] rounded-full" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <Link
                  to="/products/orchestra-iq"
                  className="inline-flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all"
                >
                  See all features <ArrowRight size={14} />
                </Link>
                  <a
                  href="https://orchestriq.gorakhai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#002FA7] hover:underline"
                >
                  Open live app <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Arjun AI Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-8 hover:border-zinc-600 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-700/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg mb-6">
                <Brain size={18} className="text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Arjun AI</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Precision intelligence for the modern enterprise. Arjun AI connects to your systems, understands your context, and delivers accurate, compliant responses at scale.
              </p>
              <ul className="space-y-2 mb-8">
                {['Enterprise knowledge base', '100+ integrations', 'Multi-modal processing', 'On-premise deployment'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/products/arjun-ai"
                className="inline-flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all"
              >
                Explore Arjun AI <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Platform Capabilities</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Built for enterprise scale</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors"
            >
              <div className="text-zinc-500 mb-4">{feature.icon}</div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#002FA7]/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Get Started</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your AI operations?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              See how Gorakhai can bring your AI tools, workflows, and team into one coordinated system.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
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
                Explore Products
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-heading text-xl font-semibold text-white mb-2">Stay at the edge of enterprise AI</h3>
          <p className="text-sm text-zinc-500 mb-6">Research, product updates, and frameworks from the Gorakhai team.</p>
          <NewsletterForm />
          <p className="text-xs text-zinc-700 mt-3">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
    </>
  );
}
