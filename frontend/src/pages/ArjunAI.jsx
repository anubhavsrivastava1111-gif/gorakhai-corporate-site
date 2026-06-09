import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Database, Layers, Lock, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const features = [
  { icon: <Database size={20} />, title: 'Contextual Knowledge Engine', desc: 'Train Arjun on your proprietary documents, databases, wikis, and communication channels. Answers grounded in your organization\'s truth.' },
  { icon: <Layers size={20} />, title: '100+ Enterprise Integrations', desc: 'Native connectors for Salesforce, Jira, Confluence, Slack, Teams, ServiceNow, SAP, and 90+ more enterprise systems.' },
  { icon: <FileText size={20} />, title: 'Multi-Modal Intelligence', desc: 'Process text, PDFs, spreadsheets, presentations, images, and voice inputs. Arjun understands your documents as naturally as text.' },
  { icon: <Lock size={20} />, title: 'Privacy-First Architecture', desc: 'On-premise deployment available. Data processing stays within your infrastructure. Zero data retention by default on cloud deployment.' },
  { icon: <MessageSquare size={20} />, title: 'Team-Specific Personas', desc: 'Create specialized Arjun instances for Sales, Engineering, Finance, HR — each with domain-specific knowledge and communication style.' },
  { icon: <Brain size={20} />, title: 'Compliance Audit Trail', desc: 'Every interaction logged, timestamped, and attributable. SOC 2, HIPAA, GDPR, and FedRAMP compliance built in.' },
];

const integrations = [
  'Salesforce', 'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'ServiceNow',
  'Workday', 'SAP', 'Zendesk', 'HubSpot', 'Notion', 'Google Workspace'
];

export default function ArjunAI() {
  useEffect(() => {
    document.title = 'Arjun AI — Enterprise AI Assistant | Gorakhai';
  }, []);

  return (
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-zinc-700/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full mb-6">
              <Brain size={14} className="text-white" />
              <span className="text-xs text-zinc-300 font-medium">Arjun AI</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
            >
              Precision Intelligence.{' '}
              <span className="text-zinc-400">Legendary</span>{' '}
              Reliability.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-zinc-400 leading-relaxed mb-8">
              Named for the precision of the legendary archer. Arjun AI connects to your enterprise systems, builds deep organizational context, and delivers accurate answers that your teams can depend on — every time.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
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

      {/* METRICS */}
      <div className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '100+', label: 'Enterprise Integrations' },
              { value: '94%', label: 'Response Accuracy' },
              { value: '3s', label: 'Avg. Response Time' },
              { value: 'On-Prem', label: 'Deployment Available' },
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
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Capabilities</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Intelligence that understands your organization</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="text-zinc-400 mb-4 group-hover:text-white transition-colors">{f.icon}</div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Integrations</p>
            <h2 className="font-heading text-2xl font-bold text-white">Connects to the tools your team already uses</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {integrations.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                {tool}
              </motion.div>
            ))}
            <div className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-600">
              + 88 more
            </div>
          </div>
        </div>
      </section>

      {/* DEPLOYMENT */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Cloud Deployment',
              desc: 'Get started in minutes. Managed infrastructure, automatic updates, 99.99% SLA. Ideal for most enterprise teams.',
              features: ['5-minute setup', 'Automatic scaling', 'SOC 2 / HIPAA compliant', 'Zero data retention option'],
              highlight: false
            },
            {
              title: 'On-Premise Deployment',
              desc: 'Full control. Deploy within your VPC or private data center. Data never leaves your infrastructure.',
              features: ['Data sovereignty guaranteed', 'Custom model fine-tuning', 'Dedicated support', 'Air-gapped environments'],
              highlight: true
            }
          ].map((option, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-zinc-950 border rounded-xl p-8 ${option.highlight ? 'border-zinc-600' : 'border-zinc-900'}`}
            >
              {option.highlight && (
                <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs text-white mb-4">
                  Recommended for regulated industries
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-white mb-3">{option.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">{option.desc}</p>
              <ul className="space-y-2">
                {option.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle2 size={14} className="text-zinc-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Experience precision intelligence
            </h2>
            <p className="text-zinc-400 mb-8">
              See how Arjun AI transforms knowledge work at your organization with a personalized demo.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
            >
              Request a Demo <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
