# Gorakhai Corporate Site — PRD

## Original Problem Statement
Build Phase 1 of Gorakhai corporate website with dedicated Supabase project (gorakhai-corporate), Cloudflare Pages deployment, Admin CMS, SEO optimization, and milestone-based implementation. Completely independent from Orchestra IQ/Admin projects.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/radix UI + Framer Motion + react-helmet-async
- **Database**: Supabase PostgreSQL (gorakhai-corporate project) — dedicated, isolated
- **Hosting**: Cloudflare Pages (static SPA build)
- **Source Control**: GitHub (`gorakhai-corporate-site`)
- **CI/CD**: GitHub Actions → `.github/workflows/deploy.yml`

## Repository Structure
```
gorakhai-corporate-site/
├── .github/workflows/deploy.yml      CI/CD
├── docs/
│   ├── SUPABASE_SETUP.md             Full Supabase setup guide
│   ├── CLOUDFLARE_DEPLOY.md          Cloudflare deployment guide
│   └── ADMIN_GUIDE.md                Admin CMS guide
├── frontend/
│   ├── public/
│   │   ├── _redirects                SPA routing for Cloudflare
│   │   ├── robots.txt
│   │   └── sitemap.xml               Static sitemap (12 pages + blog/careers)
│   └── src/
│       ├── admin/                    Admin CMS (Milestone 2)
│       ├── components/
│       │   ├── layout/ (Header, Footer, Layout)
│       │   ├── sections/ (NewsletterForm)
│       │   ├── seo/ (SEOMeta — react-helmet-async)
│       │   └── ui/ (shadcn)
│       ├── constants/ (mockData, testIds)
│       ├── hooks/ (useBlogPosts, useJobListings, useFormSubmit)
│       ├── lib/ (supabaseClient)
│       └── pages/ (12 routes)
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql    All 9 tables + indexes
    │   └── 002_rls_policies.sql      Row Level Security policies
    └── seed/
        └── seed_data.sql             Development seed data
```

## Database Schema (9 Tables)
| Table | Purpose | RLS |
|-------|---------|-----|
| `blog_categories` | Blog taxonomies | Public read |
| `blog_posts` | Blog articles | Public read (published only) |
| `contact_submissions` | Contact/demo requests | Public insert |
| `newsletter_subscribers` | Newsletter list | Public insert |
| `lead_captures` | Product leads | Public insert |
| `job_listings` | Open positions | Public read (open only) |
| `job_applications` | Job applications | Public insert |
| `expert_network_registrations` | Expert applications | Public insert |
| `waitlist_subscribers` | Product waitlist | Public insert |

## Implemented — Milestone 1 (Feb 2026)

### ✅ Pages (12 routes)
- Home, About, Products, Orchestra IQ, Arjun AI
- Blog + BlogPost, Contact, Careers + CareerDetail
- Expert Network, Waitlist (new)

### ✅ SEO
- react-helmet-async for meta tags
- OpenGraph + Twitter Card on all pages
- JSON-LD structured data (Organization, Website, BlogPosting, JobPosting)
- sitemap.xml (static, 25 URLs)
- robots.txt (blocks /admin)

### ✅ Database
- 001_initial_schema.sql — complete schema with 9 tables, indexes, triggers
- 002_rls_policies.sql — full RLS policy setup
- seed_data.sql — dev seed data

### ✅ Documentation
- SUPABASE_SETUP.md — step-by-step Supabase setup
- CLOUDFLARE_DEPLOY.md — full deployment guide
- ADMIN_GUIDE.md — Admin CMS usage guide

### ✅ Foundation
- useBlogPosts, useJobListings, useFormSubmit hooks
- react-helmet-async installed + configured
- Updated .env.example
- GitHub Actions CI/CD (`.github/workflows/deploy.yml`)

## Next — Milestone 2 (Admin CMS)
### Pending User Approval

- [ ] `/admin/login` — Supabase Auth login page
- [ ] `/admin` — Dashboard with stats
- [ ] `/admin/blog` — Blog post CRUD (list, create, edit, delete)
- [ ] `/admin/careers` — Job listings CRUD
- [ ] `/admin/leads` — Contact/lead review + status updates
- [ ] `/admin/newsletter` — Subscriber management + CSV export
- [ ] `/admin/experts` — Expert Network review + approval
- [ ] `/admin/waitlist` — Waitlist management

## Phase 2 Backlog (Post Approval)
- Supabase live data connection (replace mock data)
- Image upload (Supabase Storage)
- Email notifications on form submissions (Resend)
- Blog search + pagination
- Analytics integration

## Environment Variables
```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=   (admin CMS only)
REACT_APP_SITE_URL=https://gorakhai.com
REACT_APP_BACKEND_URL=
```
