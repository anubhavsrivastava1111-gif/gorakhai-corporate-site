# Gorakhai Corporate Site — Phase 1

## Original Problem Statement
Build Phase 1 of the Gorakhai corporate website — enterprise AI technology company. Must be deployable via Cloudflare, integrated with Supabase, mobile responsive, SEO optimized, and enterprise-grade UI/UX.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/radix UI + Framer Motion
- **Database**: Supabase (PostgreSQL) — mock mode for development
- **Hosting**: Cloudflare Pages (static SPA build)
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions → Cloudflare Pages auto-deploy

## Design System
- **Theme**: Dark Swiss Brutalist (inspired by Anthropic, Linear, Vercel)
- **Background**: #050505
- **Accent**: #002FA7 (Klein Blue)
- **Fonts**: Outfit (headings) + Inter (body)
- **Components**: shadcn/radix UI + custom Tailwind

## Implemented (Phase 1 — Completed Feb 2026)

### Pages
- [x] **Home** (`/`) — Hero, stats, product cards, features grid, CTA, newsletter
- [x] **About** (`/about`) — Mission, values bento grid, team, stats, CTA
- [x] **Products Hub** (`/products`) — Product overview with code demo widget
- [x] **Orchestra IQ** (`/products/orchestra-iq`) — Full feature deep-dive
- [x] **Arjun AI** (`/products/arjun-ai`) — Feature showcase, integrations, deployment
- [x] **Blog** (`/blog`) — Featured post, category filter, post grid
- [x] **Blog Post** (`/blog/:slug`) — Full article, author, related posts
- [x] **Contact** (`/contact`) — Contact form + lead capture, info panel
- [x] **Careers** (`/careers`) — Job listings, department filter, benefits
- [x] **Career Detail** (`/careers/:slug`) — Job description + application form
- [x] **Expert Network** (`/expert-network`) — Intro, benefits, multi-select registration form

### Components
- [x] Header with sticky glass effect, Products dropdown, mobile hamburger menu
- [x] Footer with 4-column layout and social links
- [x] NewsletterForm component (reusable)
- [x] Layout wrapper with ScrollToTop

### Database (Supabase Schema)
- `blog_posts` — Blog content management
- `contact_submissions` — Contact/lead capture forms
- `newsletter_subscribers` — Newsletter signups
- `lead_captures` — Product lead capture
- `job_listings` — Career opportunities
- `job_applications` — Job applications
- `expert_network_registrations` — Expert registrations

### Mock Data
- 6 realistic blog posts (Case Studies, Engineering, AI Research, Enterprise AI, Product Updates)
- 6 job listings (Engineering, Product, Sales, Design, Operations)
- 4 leadership team members

### Deployment
- Cloudflare Pages build config: `cd frontend && yarn build`
- Build output: `frontend/build`
- SPA routing: `public/_redirects` (`/* /index.html 200`)
- GitHub Actions CI/CD: `.github/workflows/deploy.yml`

## Environment Variables Required
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_BACKEND_URL=https://your-backend-url
```
GitHub Secrets needed for CI/CD:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Phase 2 Backlog (P0/P1/P2)

### P0 — Required for Production
- [ ] Add actual Supabase credentials (env vars)
- [ ] Create Supabase tables + RLS policies (SQL migrations in `/supabase/migrations/`)
- [ ] Set up Cloudflare Pages project + domain
- [ ] Configure DNS on Cloudflare

### P1 — Important Features
- [ ] Admin CMS dashboard (blog post editor, job listings manager)
- [ ] Newsletter email delivery (Resend or SendGrid integration)
- [ ] Contact form email notifications
- [ ] Sitemap.xml auto-generation
- [ ] Analytics (Plausible or GA4 via Cloudflare Workers)
- [ ] Dark/Light mode toggle

### P2 — Nice to Have
- [ ] Blog search functionality
- [ ] Blog RSS feed
- [ ] Video testimonials section
- [ ] Pricing page
- [ ] Documentation/Knowledge Base
- [ ] Customer case study pages
- [ ] Cookie consent banner (GDPR)

## Test Results
- Testing Agent Pass Rate: 96%
- All 11 pages: PASS
- Navigation: PASS
- Forms (mock mode): PASS
- Mobile responsiveness: PASS
- SEO titles: PASS
