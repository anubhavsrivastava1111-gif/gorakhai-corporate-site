import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Brain, Clock, Zap, Users, GitBranch,
  BookOpen, FileText, Database, CheckSquare, Activity,
} from 'lucide-react';
import SEOMeta from '@/components/seo/SEOMeta';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const LIVE_URL = 'https://orchestriq.gorakhai.com';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

// ─── MODULES ─────────────────────────────────────────────────────────────────
// All descriptions reflect real, confirmed, working features in the live app.
// Screenshot labels indicate exactly what to capture from orchestriq.gorakhai.com.

const MODULES = [
  {
    id: 'boardroom',
    icon: Brain,
    name: 'AI Boardroom',
    group: 'Nerve Suite',
    tagline: 'Every decision, debated from every angle.',
    color: '#14B8A6',
    what: 'Assembles a virtual executive team — CFO, CTO, CMO, CHRO, and up to eight C-suite personas — that debates your specific decision from each function\'s point of view. Personas are built to genuinely disagree. Finance and Growth push back against each other by design.',
    howItWorks: [
      'Select which executives join the room',
      'Describe your decision or question',
      'Each persona responds from their domain — no generic answers',
      'A Chief of Staff synthesises the debate into a CEO-ready recommendation',
      'Drill into any individual executive for a follow-up, or continue with a new question',
    ],
    usedFor: [
      'Should we enter the UAE market next quarter?',
      'Is this hiring plan realistic at our current burn rate?',
      'How should we price the new product tier?',
      'Do we take this partnership or walk away?',
    ],
    benefit: 'Decisions get pressure-tested before you make them, not after. Available in minutes, not the weeks it takes to convene a real advisory board.',
    screenshot: 'CAPTURE: Nerve → Boardroom tab — live debate in progress with 4+ executives responding, synthesis visible below. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'timemachine',
    icon: Clock,
    name: 'Time Machine',
    group: 'Nerve Suite',
    tagline: 'See where each choice leads, before you take it.',
    color: '#8B5CF6',
    what: 'Runs two parallel 12-month business simulations side by side — one for each path you\'re considering. Shows month-by-month revenue, operating cost, cash position, and key events, including second-order consequences you might not have thought to model.',
    howItWorks: [
      'Describe the decision in plain language',
      'A Research Desk gathers current, verified market figures first',
      'Timeline A (do it) and Timeline B (don\'t) run in parallel',
      'Divergence summary, scenario analysis, and a verdict table with confidence %',
      'First 30-day action plan based on the recommended path',
    ],
    usedFor: [
      'Hire 5 engineers now vs. stay lean for another quarter',
      'Raise prices 15% vs. hold and grow volume',
      'Launch in a new city vs. deepen in the current one',
      'Bootstrap through next milestone vs. raise a round now',
    ],
    benefit: 'Replaces gut feeling with a structured, cited, side-by-side view of two futures — including the second-order effects most decision-makers miss.',
    screenshot: 'CAPTURE: Nerve → Time Machine tab — simulation results showing two parallel timelines with monthly tables. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'autopilot',
    icon: Zap,
    name: 'Autopilot',
    group: 'Nerve Suite',
    tagline: 'Always know the next right move.',
    color: '#F59E0B',
    what: 'Scans your company\'s current state, goals, and context, then surfaces the six most critical decisions you should be making right now — ranked by urgency, with the cost of delay calculated per week. Ends with one single most important next step.',
    howItWorks: [
      'One click — no input required beyond your existing company data',
      'Research Desk verifies current market benchmarks before scanning',
      'Six critical decisions surfaced, each with 3 options and a recommendation',
      'Cost of delay per week calculated for every decision',
      'Single most important action this week, stated plainly',
    ],
    usedFor: [
      'What do I prioritise when everything feels equally urgent?',
      'We just lost a major client — where do I start?',
      'I know the destination but I keep stalling on the next step',
      'Weekly decision scan to start every Monday with clarity',
    ],
    benefit: 'Cuts decision fatigue by replacing a list of fifty options with six ranked decisions and one clear action — adapted to your actual situation, not a generic framework.',
    screenshot: 'CAPTURE: Nerve → Autopilot tab — six critical decisions listed with cost-of-delay and the single most important next step highlighted. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'executives',
    icon: Users,
    name: 'Executives & Chat',
    group: 'Executive Layer',
    tagline: 'Your full leadership team, one click away.',
    color: '#3B82F6',
    what: 'An 82-executive AI hierarchy spanning 11 departments — Chairman, CEO, CFO, CTO, COO, CMO, CHRO, CLO, and 74 functional specialists beneath them. Each persona reasons from their specific domain. Chat directly with any one for focused, one-on-one dialogue without convening the full Boardroom.',
    howItWorks: [
      'Browse the sidebar by department — Finance, Tech, HR, Legal, Strategy, and more',
      'Click any executive to open a private chat',
      'They respond in character with their domain\'s specific expertise and credentialing',
      'Cross-consult: ask the CFO after the COO has spoken, with full context retained',
      'Quick Action prompts for every role get you started without a blank page',
    ],
    usedFor: [
      'Ask the CFO to review a specific contract term',
      'Ask the CHRO whether a compensation structure is competitive',
      'Ask the CLO what a regulatory clause actually means',
      'Ask the CTO to spec out a system architecture decision',
    ],
    benefit: 'Get function-specific answers from a dedicated AI per role — not one generic assistant trying to sound like a CFO without the depth of one.',
    screenshot: 'CAPTURE: Chat view with CFO selected — conversation visible with domain-specific financial advice. Sidebar showing department tree. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'flow',
    icon: GitBranch,
    name: 'Flow',
    group: 'Workflow',
    tagline: 'Route any request through the right chain of experts.',
    color: '#10B981',
    what: 'Choose a department workflow — Finance, HR, Legal, Marketing, Strategy, and more. Your request passes through that department\'s actual chain of command, with each level reviewing and building on the previous one before escalating upward. You approve or reject the final output.',
    howItWorks: [
      'Select the workflow category that matches your task',
      'Describe the task in plain language',
      'Accounts Executive → Sr. Accountant → Financial Controller → VP Finance → CFO (for finance — similar chains for each department)',
      'Each level challenges assumptions and adds domain-specific value',
      'Final level delivers a polished, multi-reviewed output with a Capability Brief',
    ],
    usedFor: [
      'Prepare a pro-rata balance sheet for investor review',
      'Draft and review a vendor contract end to end',
      'Build a go-to-market plan through the full marketing hierarchy',
      'Run an HR policy gap analysis through the people chain',
    ],
    benefit: 'Multi-level expert review on any document — without coordinating a single calendar, sending a single email, or waiting on a single person.',
    screenshot: 'CAPTURE: Flow tab → Active view — 6-level finance chain showing each level\'s output stacked, with status badges and escalation arrows. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'tasks',
    icon: CheckSquare,
    name: 'Autonomous Tasks',
    group: 'Automation',
    tagline: 'Queue a task. The entire chain handles it. You approve at the end.',
    color: '#A855F7',
    what: 'Full Phase 3 automation. Describe a task, set a priority, and the system auto-routes it to the right executive chain. Hit Run All — the entire hierarchy processes every queued task level by level, in the background. You only interact at the end: approve, reject, or re-queue.',
    howItWorks: [
      'Add tasks to the queue with priority (High / Medium / Low)',
      'Auto-Route detects the right chain from your task description',
      'Hit Run All — all queued tasks process autonomously',
      'Activity Feed shows live progress: "Level 4 (Financial Controller) complete"',
      'Review queue: see the full chain output, then Approve or Reject',
    ],
    usedFor: [
      'Daily balance sheet snapshot at 11:23 PM every night',
      'Weekly sales pipeline review every Monday morning',
      'Monthly compliance status check across all obligations',
      'Recurring competitor intelligence briefing',
    ],
    benefit: 'The chain runs while you\'re doing something else. You stay in control because nothing is finalised without your explicit approval.',
    screenshot: 'CAPTURE: Auto tab → Dashboard — Activity Feed showing completed levels (Sr. Accountant → CFO), Review (1) badge active, Approve button on final output. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'ledger',
    icon: BookOpen,
    name: 'Ledger',
    group: 'Finance',
    tagline: 'Tell it the transaction. It handles the accounting.',
    color: '#F97316',
    what: 'A full double-entry accounting system with an AI assistant. Describe a transaction in plain language and Ledger makes the correct journal entries automatically, following standard accounting principles. Your chart of accounts, trial balance, P&L, and balance sheet stay current with every entry.',
    howItWorks: [
      'Type a transaction in plain English — "Paid office rent ₹45,000"',
      'AI Assistant posts the correct debit and credit entries',
      'Or use Manual Entry for direct journal control',
      'View Accounts, All Entries, Trial Balance, P&L, and Balance Sheet in real time',
      'All data feeds directly into Autonomous Task chains for finance analysis',
    ],
    usedFor: [
      'Record daily business transactions as they happen',
      'Generate a balance sheet before a meeting with an investor',
      'Track monthly P&L without a dedicated accounting team',
      'Provide real financial data to task chains so they reason from real numbers',
    ],
    benefit: 'Correct, standards-compliant books without needing to know accounting — and real financial data that the rest of the platform can actually use.',
    screenshot: 'CAPTURE: Ledger tab → Balance Sheet view — Assets and Liabilities columns visible with real INR figures, tabs (AI Assistant, Manual Entry, Accounts, Trial Balance, P&L, Balance Sheet). URL: orchestriq.gorakhai.com',
  },
  {
    id: 'pulse',
    icon: Activity,
    name: 'Pulse',
    group: 'Automation',
    tagline: 'Hand off the repetitive work.',
    color: '#06B6D4',
    what: 'An agentic AI layer built specifically for recurring, repetitive tasks — the work that takes time every week but doesn\'t require fresh strategic thinking each time. Pulse handles it, consistently, without being asked again.',
    howItWorks: [
      'Describe the recurring task and its cadence',
      'Pulse agents run it autonomously on schedule',
      'Built on the same AI executive layer — not a basic script runner',
      'Results delivered to your queue for review',
      'Frees up attention for decisions that actually need it',
    ],
    usedFor: [
      'Weekly client status update compilation',
      'Daily cash position summary',
      'Recurring compliance monitoring checks',
      'Automated preparation for recurring team meetings',
    ],
    benefit: 'Reclaim the hours spent on tasks that repeat exactly the same way every time — so your attention goes to the decisions that genuinely need it.',
    screenshot: 'CAPTURE: Pulse tab — agentic task interface showing recurring task configuration. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'studio',
    icon: FileText,
    name: 'Studio',
    group: 'Output',
    tagline: 'Turn any output into a polished document, instantly.',
    color: '#EC4899',
    what: 'Converts any AI output — a Boardroom synthesis, a task chain result, a Time Machine simulation — into a finished PowerPoint or PDF. Upload a sample deck you already like and Studio matches its exact colors, layout, and aspect ratio. Choose from Executive Summary, Investor Deck, Operational Review, and more.',
    howItWorks: [
      'Choose PDF or PowerPoint, then select the document type',
      'Optionally upload a .pptx sample — Studio reads its theme and replicates it',
      'Select which workspace sources to include (Boardroom, Workflows, Time Machine, etc.)',
      'The Presentation Architect synthesises across your full workspace',
      'Quality Engine renders consulting-grade slides with structured archetypes',
    ],
    usedFor: [
      'Export a Boardroom debate as an investor deck',
      'Turn a task chain output into a board-ready report',
      'Generate a client deliverable from a Time Machine simulation',
      'Clone your firm\'s PowerPoint template for any AI output',
    ],
    benefit: 'Skip the step where you manually rebuild AI insight in PowerPoint. From session to polished deck in one click, matching your own visual identity.',
    screenshot: 'CAPTURE: Export Studio modal — PPTX selected, sample style uploaded with color swatches visible, format options (Investor Deck highlighted), Generate button. URL: orchestriq.gorakhai.com',
  },
  {
    id: 'data',
    icon: Database,
    name: 'Data Center',
    group: 'Intelligence',
    tagline: 'One place where your business data lives — and everything else reasons from it.',
    color: '#64748B',
    what: 'A structured store of your company\'s real numbers — revenue, burn rate, team size, pricing, customers, market. Every AI executive, every Boardroom debate, every task chain, and every simulation reads from Data Center first. The more context you add, the more specific every output becomes.',
    howItWorks: [
      'Add data points by category: Financial Income, Balance Sheet, Customer Metrics, Operations, Market, Product',
      'Every chat, Boardroom session, and workflow reads these figures automatically',
      'Finance task chains cross-reference Ledger data against Data Center entries',
      'Update any field any time — the next output reflects it immediately',
      'Export your full workspace including all Data Center entries as a JSON backup',
    ],
    usedFor: [
      'Store monthly revenue, burn rate, and runway',
      'Record team headcount and hiring plan',
      'Add pricing and unit economics so AI uses real numbers',
      'Track the metrics that matter most to your business',
    ],
    benefit: 'Every module reasons from your real numbers — not a generic assumption about a business that sounds like yours.',
    screenshot: 'CAPTURE: Data tab — Data Hub with categorised fields visible (Financial Income, Balance Sheet etc.) with some entries filled in. URL: orchestriq.gorakhai.com',
  },
];

const BENEFITS = [
  {
    icon: '🧠',
    title: 'Boardroom thinking, on demand',
    desc: 'Stop making high-stakes decisions alone. A full virtual C-suite debates every angle — available in minutes, not weeks, and at a fraction of the cost of a real advisory board.',
  },
  {
    icon: '📊',
    title: 'Real numbers, not generic advice',
    desc: 'Ledger, Data Center, and prior decisions feed directly into every chain and simulation. Outputs are specific to your actual business — not a hypothetical one that sounds similar.',
  },
  {
    icon: '⚡',
    title: 'From decision to done',
    desc: 'Debate → simulate → decide → execute → document. One platform covers the full cycle, with each module aware of what the others have already produced.',
  },
  {
    icon: '🔒',
    title: 'Human sign-off on everything',
    desc: 'Every automated chain ends with your explicit approval. Approve, reject, or re-queue. Nothing is finalised without your decision.',
  },
  {
    icon: '💼',
    title: 'Built for founders, not enterprises',
    desc: 'Designed for solo founders, growing teams, and consultants who need the depth of a leadership team without the overhead of building one.',
  },
  {
    icon: '🌏',
    title: 'Location and currency native',
    desc: 'Every recommendation accounts for your actual HQ, regulatory context, and currency. India-specific tax, compliance, and market context built in.',
  },
];

const COMPARISONS = [
  {
    vs: 'vs AI Chatbots',
    point: 'A chatbot gives one voice, reactively, and is only as good as the prompt you write. Orchestra IQ structures the thinking itself — multiple expert perspectives in deliberate tension, persistent business context, and named frameworks instead of a blank box.',
  },
  {
    vs: 'vs Consulting Firms',
    point: 'Consulting is expensive, episodic, and slow. Available only for decisions big enough to justify the fee. Orchestra IQ is instant and continuous — covering the everyday decisions that never get consultant attention but still compound over time.',
  },
  {
    vs: 'vs BI Tools',
    point: 'Business intelligence shows you what already happened. Orchestra IQ reasons about what to do next — a decision and simulation layer, not a reporting layer. It tells you the action, not just the number.',
  },
];

// ─── SCREENSHOT PLACEHOLDER ───────────────────────────────────────────────────
// Replace each instance with an actual screenshot from orchestriq.gorakhai.com.
// Recommended: capture at 1280×720, save to frontend/public/screenshots/,
// and replace the <ScreenshotPlaceholder> with <img src="/screenshots/xxx.png" ... />.

function ScreenshotPlaceholder({ label }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
      {/* Browser chrome */}
      <div className="h-9 bg-zinc-950 border-b border-zinc-800 flex items-center px-3 gap-1.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        <div className="ml-3 flex-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-600 text-[9px] px-2 py-1 font-mono">
          orchestriq.gorakhai.com
        </div>
      </div>
      {/* Placeholder body */}
      <div className="h-64 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
          <span className="text-base">📸</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">{label}</p>
        <p className="text-[10px] text-zinc-700 mt-3">
          Replace with screenshot · Recommended size: 1280 × 720
        </p>
      </div>
    </div>
  );
}

function ModuleIcon({ icon: Icon, size }) {
  return <Icon size={size} />;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function OrchestraIQ() {
  return (
    <>
      <SEOMeta
        title="Orchestra IQ — AI Business Operating System by GorakhAI"
        description="Orchestra IQ is an AI-powered business operating system for entrepreneurs and growing businesses. AI Boardroom, Time Machine, Autopilot, Ledger, autonomous task chains, and more."
        canonicalPath="/products/orchestra-iq"
      />
      <div className="bg-[#050505] text-white">

        {/* ── HERO ── */}
        <section className="relative min-h-[90vh] flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#002FA7]/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
            <motion.div initial="hidden" animate="visible" className="max-w-4xl">
              <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
                GorakhAI · Orchestra IQ
              </motion.p>
              <motion.h1 variants={fadeUp} custom={1} className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                The boardroom<br />
                every founder<br />
                <span className="text-[#002FA7]">deserves.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-zinc-400 leading-relaxed max-w-2xl mb-4">
                An AI-powered business operating system with a full executive hierarchy, scenario simulation, autonomous task chains, integrated double-entry accounting, and intelligent document export.
              </motion.p>
              <motion.p variants={fadeUp} custom={3} className="text-base text-zinc-500 leading-relaxed max-w-2xl mb-10">
                Built for entrepreneurs and growing businesses who need strategic depth — without building a leadership team to get it.
              </motion.p>
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center gap-4">
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
                >
                  Open Orchestra IQ <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-zinc-700 text-white text-sm font-medium rounded-md hover:border-zinc-500 transition-colors"
                >
                  Request a Demo
                </Link>
              </motion.div>
              <motion.p variants={fadeUp} custom={5} className="mt-5 text-xs text-zinc-600">
                Free to start · Bring your own API key · Gemini free tier supported · All data stays in your browser
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── MODULE GRID OVERVIEW ── */}
        <section className="py-16 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">The Platform</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Ten modules. One operating system.
              </h2>
              <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
                Each module solves a specific business problem. All of them share the same context — your Ledger data feeds your task chains, your Boardroom decisions inform your Autopilot, your task outputs export straight to Studio.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MODULES.map((m, i) => (
                <motion.a
                  key={m.id}
                  href={`#${m.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-zinc-950 border border-zinc-900 rounded-xl p-4 hover:border-zinc-700 transition-all cursor-pointer no-underline"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="mb-3" style={{ color: m.color }}><ModuleIcon icon={m.icon} size={18} /></div>
                  <div className="text-xs font-bold text-white mb-1 leading-tight">{m.name}</div>
                  <div className="text-[10px] text-zinc-600 leading-relaxed font-mono">{m.group}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── INDIVIDUAL MODULE SECTIONS ── */}
        {MODULES.map((mod, idx) => (
          <section
            key={mod.id}
            id={mod.id}
            className={`py-24 border-t border-zinc-900 scroll-mt-16 ${idx % 2 === 1 ? 'bg-zinc-950/40' : ''}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Screenshot — alternates sides */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={idx % 2 === 1 ? 'order-last lg:order-first' : ''}
                >
                  <ScreenshotPlaceholder label={mod.screenshot} />

                  {/* Module tag under screenshot */}
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-1 rounded"
                      style={{ background: `${mod.color}12`, color: mod.color }}
                    >
                      <ModuleIcon icon={mod.icon} size={14} />
                      <span>{mod.group}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600">orchestriq.gorakhai.com</span>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                    {mod.name}
                  </h2>
                  <p className="text-lg font-medium mb-5" style={{ color: mod.color }}>
                    {mod.tagline}
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {mod.what}
                  </p>

                  {/* How it works */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">How it works</p>
                    <ol className="space-y-2">
                      {mod.howItWorks.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ background: `${mod.color}18`, color: mod.color }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Used for */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 mb-5">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Used for</p>
                    <ul className="space-y-2">
                      {mod.usedFor.map((u, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0 mt-2"
                            style={{ background: mod.color }}
                          />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefit callout */}
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ background: `${mod.color}08`, border: `1px solid ${mod.color}22` }}
                  >
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: mod.color }}>✦</span>
                    <p className="text-sm leading-relaxed" style={{ color: mod.color }}>
                      {mod.benefit}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        {/* ── HOW MODULES CONNECT ── */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-12"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Connected Intelligence</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                All modules share the same context.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Every module reads from Data Center — your real business numbers, prior decisions, and approved outputs. A finance task chain sees your actual Ledger figures before it starts. A Strategy Boardroom references Time Machine simulations already run. Outputs from one module feed into the next, without you repeating yourself.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  from: 'Ledger',
                  fromColor: '#F97316',
                  to: 'Autonomous Tasks',
                  toColor: '#A855F7',
                  desc: 'Finance task chains read your actual balance sheet and posted transactions before starting — so the Sr. Accountant knows your real Cash balance, not a generic assumption.',
                },
                {
                  from: 'Boardroom',
                  fromColor: '#14B8A6',
                  to: 'Studio',
                  toColor: '#EC4899',
                  desc: 'Export any debate as an investor deck or board report, matching your own PowerPoint template\'s exact colors, fonts, and layout.',
                },
                {
                  from: 'Time Machine',
                  fromColor: '#8B5CF6',
                  to: 'Autopilot',
                  toColor: '#F59E0B',
                  desc: 'Scenario simulation outputs inform what Autopilot recommends as your next most critical decision — so the scan accounts for paths already explored.',
                },
                {
                  from: 'Flow',
                  fromColor: '#10B981',
                  to: 'Tasks',
                  toColor: '#A855F7',
                  desc: 'Approved workflow outputs become visible to Autonomous Task chains in the same category, so the next chain builds forward rather than starting from scratch.',
                },
                {
                  from: 'Data Center',
                  fromColor: '#64748B',
                  to: 'All Modules',
                  toColor: '#3B82F6',
                  desc: 'Every AI executive, every Boardroom debate, every task chain, and every simulation reads your real company data first — before responding or reasoning.',
                },
                {
                  from: 'Tasks',
                  fromColor: '#A855F7',
                  to: 'Studio',
                  toColor: '#EC4899',
                  desc: 'Any approved task output can be sent directly to Studio — select the format, upload your template, and download the finished document.',
                },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 text-xs font-mono mb-3">
                    <span className="font-bold" style={{ color: c.fromColor }}>{c.from}</span>
                    <ArrowRight size={10} className="text-zinc-700 flex-shrink-0" />
                    <span className="font-bold" style={{ color: c.toColor }}>{c.to}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Why Orchestra IQ</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                Built for how you actually run a business.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-6"
                >
                  <div className="text-2xl mb-4">{b.icon}</div>
                  <h3 className="font-heading text-sm font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIFFERENTIATORS ── */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">Positioning</p>
              <h2 className="font-heading text-3xl font-bold text-white">What makes it different.</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMPARISONS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-6"
                >
                  <div className="text-xs font-mono text-[#002FA7] font-bold mb-4 pb-3 border-b border-zinc-800">
                    {c.vs}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{c.point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROADMAP TEASER ── */}
        <section className="py-16 border-t border-zinc-900 bg-zinc-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">What's Coming</p>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">The platform keeps growing.</h2>
              <p className="text-sm text-zinc-500">These are planned directions — not current capabilities.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'ERP Integration', desc: 'Connect to existing ERP systems' },
                { label: 'CRM Integration', desc: 'Pull customer and pipeline data' },
                { label: 'Company Secretary', desc: 'CS knowledge and compliance module' },
                { label: 'Industry Personas', desc: 'Sector-tuned executive advisors' },
                { label: 'Expert Marketplace', desc: 'Real human experts on demand' },
                { label: 'Mobile App', desc: 'Native iOS and Android access' },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 opacity-60"
                >
                  <div className="text-xs font-bold text-zinc-400 mb-1">{r.label}</div>
                  <div className="text-[10px] text-zinc-600 leading-relaxed">{r.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-28 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#002FA7]/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Start Today</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Start with Orchestra IQ.
              </h2>
              <p className="text-zinc-400 mb-3 max-w-lg mx-auto text-sm leading-relaxed">
                Free to start. A free Gemini API key gets you the AI Boardroom, Time Machine, and Autopilot immediately — no billing required. Add your own business data and every output gets sharper.
              </p>
              <p className="text-zinc-600 text-xs mb-8 max-w-md mx-auto">
                All data stays in your browser. No account required to start. Bring your own API key.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
                >
                  Open Orchestra IQ <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white text-sm font-medium rounded-md hover:border-zinc-500 transition-colors"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}
