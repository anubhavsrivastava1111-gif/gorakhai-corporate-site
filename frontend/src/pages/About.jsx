import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Globe, Lightbulb, Lock, Heart } from 'lucide-react';
import SEOMeta from '@/components/seo/SEOMeta';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const values = [
  { icon: <Target size={20} />, title: 'Precision Over Volume', desc: 'We build for accuracy and reliability. Enterprise teams depend on our platforms for critical decisions.' },
  { icon: <Users size={20} />, title: 'People First', desc: 'AI should amplify human intelligence, not replace it. We build with humans at the center.' },
  { icon: <Lock size={20} />, title: 'Trust as Infrastructure', desc: 'Security, privacy, and compliance are not features — they are the foundation of everything we build.' },
  { icon: <Globe size={20} />, title: 'Global by Default', desc: 'Enterprise intelligence knows no borders. We build platforms that work across regions, languages, and industries.' },
  { icon: <Lightbulb size={20} />, title: 'Research-Driven', desc: 'We stay ahead of the curve by investing deeply in AI research and translating it into production-ready systems.' },
  { icon: <Heart size={20} />, title: 'Customer Obsession', desc: 'Our customers\' success is our only measure of success. Every decision starts with the customer outcome.' },
];

export default function About() {
  return (
    <>
      <SEOMeta
        title="About Us"
        description="Learn about Gorakhai's mission to make enterprise AI reliable, observable, and scalable. Meet the team building the future of AI infrastructure."
        canonicalPath="/about"
      />
    <div className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
            About Gorakhai
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
          >
            Precision meets{' '}
            <span className="text-[#002FA7]">intelligence.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-zinc-400 leading-relaxed"
          >
            We're building the AI infrastructure layer that empowers the world's leading organizations to operate at the speed and precision that the modern era demands.
          </motion.p>
        </motion.div>
      </section>

      {/* MISSION */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Our Mission</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                  Make enterprise AI reliable, observable, and scalable.
                </h2>
              </motion.div>
            </div>
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4 text-zinc-400 leading-relaxed"
              >
                <p>
                  GorakhAI was founded by Anubhav Srivastava after watching his own businesses struggle from the same root cause: critical decisions made without access to the kind of strategic guidance larger organizations take for granted.
                </p>
                <p>
                  We built Orchestra IQ and Arjun AI to close that gap — an AI Boardroom, a Time Machine for scenario planning, and an Autopilot for day-to-day execution, designed for how growing businesses actually operate.
                </p>
                <p>
                  We're early. The platform is in active development, built in the open with the entrepreneurs and small teams it's meant to serve.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">What We Stand For</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Our values</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6"
            >
              <div className="text-[#002FA7] mb-4">{value.icon}</div>
              <h3 className="font-heading text-base font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Founder</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Meet the founder</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 md:p-10 max-w-3xl"
          >
            <div className="w-12 h-12 bg-[#002FA7]/10 border border-[#002FA7]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="font-heading font-bold text-[#002FA7] text-sm">AS</span>
            </div>
            <h3 className="font-heading font-semibold text-white mb-0.5">Anubhav Srivastava</h3>
            <p className="text-xs text-zinc-500 mb-4">Founder, GorakhAI</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              GorakhAI is named after Gorakhpur, Uttar Pradesh, the city where Anubhav was born. After two of his own ventures failed — including a restaurant business hit hard by COVID-19 — he realized the problem wasn't effort or vision, but a lack of access to the kind of strategic guidance usually reserved for companies with dedicated in-house teams. That experience became the foundation for GorakhAI: AI-powered tools built to give entrepreneurs and growing businesses better information for the decisions that matter most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-white mb-4">We're hiring</h2>
          <p className="text-zinc-400 mb-8">
            Join a team building infrastructure that powers the next generation of enterprise intelligence.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
          >
            View Open Roles <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
    </>
  );
}
