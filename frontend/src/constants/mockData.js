export const BLOG_POSTS = [
  {
    id: '1',
    slug: 'orchestra-iq-reduced-ai-costs-fortune-500',
    title: 'How Orchestra IQ Reduced AI Inference Costs by 42% for a Fortune 500 Retailer',
    excerpt: 'A leading retail enterprise was spending millions on AI inference with inconsistent results. Orchestra IQ\'s intelligent routing changed everything.',
    cover_image_url: 'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg',
    author_name: 'Priya Nair',
    author_avatar: 'PN',
    category: 'Case Studies',
    tags: ['Orchestra IQ', 'Cost Optimization', 'Enterprise'],
    read_time_mins: 8,
    published_at: '2025-11-15T09:00:00Z',
    content: `<p>When one of North America's largest retail enterprises approached us with a challenge — $4.2M in annual AI inference spend with variable quality — we knew Orchestra IQ was built exactly for this scenario.</p>
    <h2>The Challenge</h2>
    <p>The company had deployed three different LLM providers across 12 business units, each making independent API calls without coordination. The result: duplicate queries, suboptimal model selection, and no unified observability.</p>
    <h2>The Solution</h2>
    <p>Orchestra IQ's intelligent routing layer was deployed as a unified gateway. The platform's cost intelligence engine learned which models performed best for each query type, automatically routing requests to the optimal provider.</p>
    <h2>The Results</h2>
    <ul><li>42% reduction in AI inference costs within 90 days</li><li>98.7% improvement in response consistency</li><li>Single pane of glass observability across all AI operations</li><li>Complete audit trail for compliance</li></ul>`
  },
  {
    id: '2',
    slug: 'arjun-ai-context-window-architecture',
    title: 'The Architecture Behind Arjun AI\'s Enterprise Context Engine',
    excerpt: 'Understanding how Arjun AI maintains deep organizational context across thousands of simultaneous conversations without compromising privacy or performance.',
    cover_image_url: 'https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg',
    author_name: 'Marcus Chen',
    author_avatar: 'MC',
    category: 'Engineering',
    tags: ['Arjun AI', 'Architecture', 'Engineering'],
    read_time_mins: 12,
    published_at: '2025-11-08T09:00:00Z',
    content: `<p>Building an enterprise AI assistant that truly understands organizational context is one of the hardest problems in applied AI engineering.</p>`
  },
  {
    id: '3',
    slug: 'multi-model-orchestration-future',
    title: 'Multi-Model Orchestration: Why Single-Model AI Deployments Are Becoming Obsolete',
    excerpt: 'As AI capabilities fragment across specialized models, orchestration becomes the competitive moat. Here\'s why forward-thinking enterprises are building orchestration-first.',
    cover_image_url: 'https://images.pexels.com/photos/8124232/pexels-photo-8124232.jpeg',
    author_name: 'Rohan Sharma',
    author_avatar: 'RS',
    category: 'AI Research',
    tags: ['Orchestration', 'Strategy', 'Future of AI'],
    read_time_mins: 7,
    published_at: '2025-10-29T09:00:00Z',
    content: `<p>The era of the single AI model is drawing to a close. What began as a convenience — pick one LLM provider, call their API — is now becoming an architectural liability.</p>`
  },
  {
    id: '4',
    slug: 'enterprise-ai-governance-framework-2025',
    title: 'Building Enterprise AI Governance: A Practitioner\'s Framework for 2025',
    excerpt: 'From policy definition to technical enforcement, here\'s how leading enterprises are building AI governance programs that balance innovation with control.',
    cover_image_url: 'https://images.pexels.com/photos/20752572/pexels-photo-20752572.jpeg',
    author_name: 'Ananya Krishnamurthy',
    author_avatar: 'AK',
    category: 'Enterprise AI',
    tags: ['Governance', 'Compliance', 'Enterprise'],
    read_time_mins: 10,
    published_at: '2025-10-15T09:00:00Z',
    content: `<p>AI governance is no longer optional. With regulators in the EU, UK, and US all moving to define AI accountability frameworks, enterprise leaders need a governance strategy — not just a policy document.</p>`
  },
  {
    id: '5',
    slug: 'arjun-ai-2-multimodal-release',
    title: 'Arjun AI 2.0: Introducing Multi-Modal Document Intelligence',
    excerpt: 'Today we\'re releasing Arjun AI 2.0 with native multi-modal support — understand PDFs, images, spreadsheets, and presentations as naturally as text.',
    cover_image_url: 'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg',
    author_name: 'Priya Nair',
    author_avatar: 'PN',
    category: 'Product Updates',
    tags: ['Arjun AI', 'Product Release', 'Multi-Modal'],
    read_time_mins: 5,
    published_at: '2025-10-01T09:00:00Z',
    content: `<p>Since launching Arjun AI, the most requested feature from enterprise customers has been consistent: "Can it read our documents?" Today, the answer is a definitive yes.</p>`
  },
  {
    id: '6',
    slug: 'shadow-ai-enterprise-risk',
    title: 'The Hidden Costs of Shadow AI: How Enterprise Platforms Eliminate the Risk',
    excerpt: 'Employees are using consumer AI tools for sensitive work. The data exposure risk is real, but the solution isn\'t a ban — it\'s providing a better sanctioned alternative.',
    cover_image_url: 'https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg',
    author_name: 'Marcus Chen',
    author_avatar: 'MC',
    category: 'Enterprise AI',
    tags: ['Security', 'Shadow AI', 'Risk Management'],
    read_time_mins: 6,
    published_at: '2025-09-18T09:00:00Z',
    content: `<p>In a recent survey of enterprise employees, 67% admitted to using consumer AI tools like ChatGPT for work tasks — despite their company having a formal policy against it. The problem isn\'t disobedience. It\'s that the sanctioned alternative isn\'t good enough.</p>`
  }
];

export const JOB_LISTINGS = [
  {
    id: '1',
    slug: 'senior-software-engineer-platform',
    title: 'Senior Software Engineer — Platform',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience_level: 'Senior',
    salary_range: '$180,000 — $240,000',
    description: 'We\'re looking for a Senior Software Engineer to join our Platform team. You\'ll be building the core infrastructure that powers Orchestra IQ — the AI orchestration layer used by enterprise teams worldwide.',
    requirements: [
      '5+ years of software engineering experience',
      'Strong proficiency in Python and/or Go',
      'Experience building distributed systems at scale',
      'Familiarity with LLM APIs (OpenAI, Anthropic, Gemini, etc.)',
      'Experience with Kubernetes, Docker, and cloud infrastructure',
      'Strong understanding of system design and architecture'
    ],
    responsibilities: [
      'Design and build core platform APIs and infrastructure',
      'Own critical reliability and performance initiatives',
      'Collaborate with product team on technical feasibility',
      'Mentor junior engineers and contribute to engineering culture',
      'Participate in on-call rotations for platform health'
    ],
    posted_at: '2025-11-10T00:00:00Z'
  },
  {
    id: '2',
    slug: 'product-manager-orchestra-iq',
    title: 'Product Manager — Orchestra IQ',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience_level: 'Senior',
    salary_range: '$160,000 — $200,000',
    description: 'Lead the product vision and roadmap for Orchestra IQ, our AI orchestration platform. Work directly with enterprise customers to define the future of multi-model AI management.',
    requirements: [
      '4+ years of product management experience',
      'Experience with developer tools or enterprise software',
      'Deep understanding of AI/ML workflows',
      'Excellent written and verbal communication',
      'Data-driven decision making approach'
    ],
    responsibilities: [
      'Own the Orchestra IQ product roadmap',
      'Conduct customer discovery and translate into product requirements',
      'Define and track key product metrics',
      'Work cross-functionally with engineering, design, and sales',
      'Present product strategy to executive stakeholders'
    ],
    posted_at: '2025-11-05T00:00:00Z'
  },
  {
    id: '3',
    slug: 'enterprise-account-executive',
    title: 'Enterprise Account Executive',
    department: 'Sales',
    location: 'New York, NY / Remote',
    type: 'Full-time',
    experience_level: 'Senior',
    salary_range: '$130,000 — $170,000 + Commission',
    description: 'Join our growing Enterprise Sales team and own a book of business targeting Fortune 1000 companies. You\'ll be the primary relationship owner for some of our most strategic accounts.',
    requirements: [
      '5+ years of enterprise B2B SaaS sales experience',
      'Proven track record closing $500K+ ARR deals',
      'Experience selling to technical buyers (CTOs, VPs Engineering)',
      'Familiarity with AI/ML or developer tools',
      'Excellent negotiation and communication skills'
    ],
    responsibilities: [
      'Own and grow a portfolio of enterprise accounts',
      'Lead complex, multi-stakeholder sales cycles',
      'Collaborate with solutions engineering on technical demos',
      'Represent Gorakhai at industry events and conferences',
      'Provide market feedback to product and leadership'
    ],
    posted_at: '2025-11-01T00:00:00Z'
  },
  {
    id: '4',
    slug: 'senior-ai-research-engineer',
    title: 'Senior AI Research Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    experience_level: 'Senior',
    salary_range: '$200,000 — $280,000',
    description: 'Work at the intersection of AI research and production systems. You\'ll be developing novel approaches to model evaluation, routing heuristics, and context management that power our next generation of products.',
    requirements: [
      'PhD or MS in Computer Science, ML, or related field',
      'Research experience with LLMs, transformers, or related areas',
      'Strong Python and ML frameworks experience (PyTorch, JAX)',
      'Experience translating research into production systems',
      'Publications or open source contributions preferred'
    ],
    responsibilities: [
      'Research and prototype novel AI capabilities',
      'Develop evaluation frameworks for model quality',
      'Collaborate with product engineers to ship research to production',
      'Publish findings and represent Gorakhai at conferences',
      'Mentor engineers on ML best practices'
    ],
    posted_at: '2025-10-28T00:00:00Z'
  },
  {
    id: '5',
    slug: 'head-of-design',
    title: 'Head of Design',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience_level: 'Lead',
    salary_range: '$170,000 — $220,000',
    description: 'Lead Gorakhai\'s design function across brand, product, and marketing. You\'ll build and lead a small team of designers while setting the visual language for our growing suite of enterprise products.',
    requirements: [
      '7+ years of design experience, including 2+ in leadership',
      'Strong portfolio in product and/or brand design',
      'Experience with design systems at scale',
      'Proficiency in Figma and design tooling',
      'Experience with B2B enterprise products preferred'
    ],
    responsibilities: [
      'Define and evolve Gorakhai\'s design language',
      'Lead design across product, marketing, and brand',
      'Build and manage a growing design team',
      'Own the design system and component library',
      'Partner with engineering and product leadership'
    ],
    posted_at: '2025-10-20T00:00:00Z'
  },
  {
    id: '6',
    slug: 'customer-success-manager',
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Remote (US)',
    type: 'Full-time',
    experience_level: 'Mid',
    salary_range: '$100,000 — $130,000',
    description: 'Ensure our enterprise customers achieve maximum value from Gorakhai\'s platform. You\'ll be the post-sale relationship owner, driving adoption, expansion, and renewals across a portfolio of strategic accounts.',
    requirements: [
      '3+ years of customer success or account management experience',
      'Experience with enterprise software customers',
      'Strong data analysis and reporting skills',
      'Excellent presentation and communication skills',
      'Technical aptitude to understand AI/software products'
    ],
    responsibilities: [
      'Own a portfolio of 15-25 enterprise accounts',
      'Drive onboarding, adoption, and time-to-value',
      'Lead quarterly business reviews with executive stakeholders',
      'Identify and close expansion opportunities',
      'Be the voice of the customer internally'
    ],
    posted_at: '2025-10-15T00:00:00Z'
  }
];

export const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Rohan Sharma',
    title: 'Co-founder & CEO',
    bio: 'Previously led AI infrastructure at a leading cloud provider. 15 years building enterprise software at scale.',
    initials: 'RS',
    linkedin: '#'
  },
  {
    id: '2',
    name: 'Priya Nair',
    title: 'Co-founder & CTO',
    bio: 'ML researcher turned engineer. PhD from IIT Bombay. Led the AI platform team at a Fortune 50 financial institution.',
    initials: 'PN',
    linkedin: '#'
  },
  {
    id: '3',
    name: 'Marcus Chen',
    title: 'VP Engineering',
    bio: 'Distributed systems architect. Previously scaled infrastructure at two unicorn SaaS companies from Series A to IPO.',
    initials: 'MC',
    linkedin: '#'
  },
  {
    id: '4',
    name: 'Ananya Krishnamurthy',
    title: 'VP Product',
    bio: 'Enterprise product leader with deep expertise in developer tools. Former PM lead at a major cloud AI platform.',
    initials: 'AK',
    linkedin: '#'
  }
];

export const BLOG_CATEGORIES = ['All', 'Case Studies', 'Engineering', 'AI Research', 'Enterprise AI', 'Product Updates'];
export const JOB_DEPARTMENTS = ['All', 'Engineering', 'Product', 'Sales', 'Design', 'Operations'];
