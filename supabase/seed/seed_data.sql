-- =============================================================================
-- Gorakhai Corporate Site — Seed Data
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql
-- Development data only — DO NOT run in production
-- =============================================================================

-- =============================================================================
-- Blog Posts (6 sample articles)
-- =============================================================================
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, author_name, author_initials, author_role, tags, status, featured, read_time_mins, published_at, category_id)
SELECT 
  'How Orchestra IQ Reduced AI Inference Costs by 42% for a Fortune 500 Retailer',
  'orchestra-iq-reduced-ai-costs-fortune-500',
  'A leading retail enterprise was spending millions on AI inference with inconsistent results. Orchestra IQ''s intelligent routing changed everything.',
  '<p>When one of North America''s largest retail enterprises approached us with a challenge — $4.2M in annual AI inference spend with variable quality — we knew Orchestra IQ was built exactly for this scenario.</p><h2>The Challenge</h2><p>The company had deployed three different LLM providers across 12 business units, each making independent API calls without coordination. The result: duplicate queries, suboptimal model selection, and no unified observability.</p><h2>The Solution</h2><p>Orchestra IQ''s intelligent routing layer was deployed as a unified gateway. The platform''s cost intelligence engine learned which models performed best for each query type.</p><h2>Results</h2><ul><li>42% reduction in AI inference costs within 90 days</li><li>98.7% improvement in response consistency</li><li>Single pane of glass observability across all AI operations</li></ul>',
  'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg',
  'Priya Nair',
  'PN',
  'Co-founder & CTO',
  ARRAY['Orchestra IQ', 'Cost Optimization', 'Enterprise'],
  'published',
  true,
  8,
  now() - INTERVAL '7 days',
  (SELECT id FROM blog_categories WHERE slug = 'case-studies')
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'orchestra-iq-reduced-ai-costs-fortune-500');

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, author_name, author_initials, author_role, tags, status, featured, read_time_mins, published_at, category_id)
SELECT
  'The Architecture Behind Arjun AI''s Enterprise Context Engine',
  'arjun-ai-context-window-architecture',
  'Understanding how Arjun AI maintains deep organizational context across thousands of simultaneous conversations without compromising privacy or performance.',
  '<p>Building an enterprise AI assistant that truly understands organizational context is one of the hardest problems in applied AI engineering.</p><h2>The Core Challenge</h2><p>Enterprise conversations require context that spans months of organizational history, hundreds of internal documents, and dozens of integrated systems — simultaneously.</p><h2>Our Approach</h2><p>We built a hierarchical context management system that prioritizes relevance over recency, ensuring the most contextually important information is always available at inference time.</p>',
  'https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg',
  'Marcus Chen',
  'MC',
  'VP Engineering',
  ARRAY['Arjun AI', 'Architecture', 'Engineering'],
  'published',
  false,
  12,
  now() - INTERVAL '14 days',
  (SELECT id FROM blog_categories WHERE slug = 'engineering')
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'arjun-ai-context-window-architecture');

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, author_name, author_initials, author_role, tags, status, featured, read_time_mins, published_at, category_id)
SELECT
  'Multi-Model Orchestration: Why Single-Model AI Deployments Are Becoming Obsolete',
  'multi-model-orchestration-future',
  'As AI capabilities fragment across specialized models, orchestration becomes the competitive moat. Here''s why forward-thinking enterprises are building orchestration-first.',
  '<p>The era of the single AI model is drawing to a close. What began as a convenience — pick one LLM provider, call their API — is now becoming an architectural liability.</p><h2>The Fragmentation Reality</h2><p>Today, the best model for code generation is different from the best model for document analysis, which is different again from the best model for customer conversation. No single model wins every category.</p>',
  'https://images.pexels.com/photos/8124232/pexels-photo-8124232.jpeg',
  'Rohan Sharma',
  'RS',
  'Co-founder & CEO',
  ARRAY['Orchestration', 'Strategy', 'Future of AI'],
  'published',
  false,
  7,
  now() - INTERVAL '21 days',
  (SELECT id FROM blog_categories WHERE slug = 'ai-research')
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'multi-model-orchestration-future');

-- =============================================================================
-- Job Listings (6 sample open roles)
-- =============================================================================
INSERT INTO job_listings (title, slug, department, location, type, experience_level, description, requirements, responsibilities, salary_range, status, remote_ok, posted_at)
SELECT
  'Senior Software Engineer — Platform',
  'senior-software-engineer-platform',
  'Engineering',
  'San Francisco, CA / Remote',
  'full-time',
  'senior',
  'We''re looking for a Senior Software Engineer to join our Platform team. You''ll be building the core infrastructure that powers Orchestra IQ.',
  ARRAY[
    '5+ years of software engineering experience',
    'Strong proficiency in Python and/or Go',
    'Experience building distributed systems at scale',
    'Familiarity with LLM APIs',
    'Experience with Kubernetes and cloud infrastructure'
  ],
  ARRAY[
    'Design and build core platform APIs and infrastructure',
    'Own critical reliability and performance initiatives',
    'Collaborate with product team on technical feasibility',
    'Mentor junior engineers'
  ],
  '$180,000 — $240,000',
  'open',
  true,
  now() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM job_listings WHERE slug = 'senior-software-engineer-platform');

INSERT INTO job_listings (title, slug, department, location, type, experience_level, description, requirements, responsibilities, salary_range, status, remote_ok, posted_at)
SELECT
  'Product Manager — Orchestra IQ',
  'product-manager-orchestra-iq',
  'Product',
  'San Francisco, CA',
  'full-time',
  'senior',
  'Lead the product vision and roadmap for Orchestra IQ, our AI orchestration platform.',
  ARRAY[
    '4+ years of product management experience',
    'Experience with developer tools or enterprise software',
    'Deep understanding of AI/ML workflows',
    'Excellent written and verbal communication'
  ],
  ARRAY[
    'Own the Orchestra IQ product roadmap',
    'Conduct customer discovery and translate into requirements',
    'Define and track key product metrics',
    'Work cross-functionally with engineering, design, and sales'
  ],
  '$160,000 — $200,000',
  'open',
  false,
  now() - INTERVAL '14 days'
WHERE NOT EXISTS (SELECT 1 FROM job_listings WHERE slug = 'product-manager-orchestra-iq');

INSERT INTO job_listings (title, slug, department, location, type, experience_level, description, requirements, responsibilities, salary_range, status, remote_ok, posted_at)
SELECT
  'Enterprise Account Executive',
  'enterprise-account-executive',
  'Sales',
  'New York, NY / Remote',
  'full-time',
  'senior',
  'Join our Enterprise Sales team and own a Fortune 1000 book of business.',
  ARRAY[
    '5+ years of enterprise B2B SaaS sales experience',
    'Proven track record closing $500K+ ARR deals',
    'Experience selling to technical buyers',
    'Excellent negotiation skills'
  ],
  ARRAY[
    'Own and grow a portfolio of enterprise accounts',
    'Lead complex multi-stakeholder sales cycles',
    'Collaborate with solutions engineering on demos',
    'Represent Gorakhai at industry events'
  ],
  '$130,000 — $170,000 + Commission',
  'open',
  true,
  now() - INTERVAL '21 days'
WHERE NOT EXISTS (SELECT 1 FROM job_listings WHERE slug = 'enterprise-account-executive');

INSERT INTO job_listings (title, slug, department, location, type, experience_level, description, requirements, responsibilities, salary_range, status, remote_ok, posted_at)
SELECT
  'Senior AI Research Engineer',
  'senior-ai-research-engineer',
  'Engineering',
  'San Francisco, CA / Remote',
  'full-time',
  'senior',
  'Work at the intersection of AI research and production systems.',
  ARRAY[
    'PhD or MS in Computer Science, ML, or related field',
    'Research experience with LLMs or transformers',
    'Strong Python and ML frameworks experience',
    'Experience translating research into production systems'
  ],
  ARRAY[
    'Research and prototype novel AI capabilities',
    'Develop evaluation frameworks for model quality',
    'Collaborate with product engineers to ship to production',
    'Publish findings and represent Gorakhai at conferences'
  ],
  '$200,000 — $280,000',
  'open',
  true,
  now() - INTERVAL '28 days'
WHERE NOT EXISTS (SELECT 1 FROM job_listings WHERE slug = 'senior-ai-research-engineer');

-- =============================================================================
-- Sample contact submission (for admin CMS testing)
-- =============================================================================
INSERT INTO contact_submissions (full_name, email, company, job_title, product_interest, message, form_source, status)
SELECT 'Sample Lead', 'sample@example.com', 'Acme Corp', 'VP Engineering', 'orchestra-iq', 'We are interested in Orchestra IQ for our enterprise AI deployment. Please get in touch.', 'contact', 'new'
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions WHERE email = 'sample@example.com');

-- =============================================================================
-- Sample newsletter subscriber
-- =============================================================================
INSERT INTO newsletter_subscribers (email, first_name, source_page, confirmed)
SELECT 'sample@newsletter.com', 'Sample', '/blog', true
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'sample@newsletter.com');
