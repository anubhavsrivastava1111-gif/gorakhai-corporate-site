# Gorakhai Corporate Site — PRD

## Original Problem Statement
Build Phase 1 + Phase 2 (Admin CMS) of Gorakhai corporate website with dedicated Supabase project (gorakhai-corporate), FastAPI backend + MongoDB, Cloudflare Pages deployment, full Admin CMS with roles, audit logging, and milestone-based implementation.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/radix UI + Framer Motion + react-helmet-async
- **Backend**: FastAPI + MongoDB (Motor async) — modular routes
- **Database**: MongoDB (gorakhai_cms) for all CMS data; Supabase optional for public-facing pages
- **Auth**: JWT cookie-based (access_token + refresh_token) using bcrypt + PyJWT
- **Hosting**: Cloudflare Pages (static SPA) + Backend on server

## Repository Structure
```
/app/
├── backend/
│   ├── server.py             Main app, startup seeding, indexes
│   ├── db.py                 MongoDB connection
│   ├── auth.py               JWT utilities, password hashing, get_current_user
│   └── routes/
│       ├── auth_routes.py    POST /api/auth/login|logout|me|refresh
│       ├── admin_routes.py   All admin CRUD + audit logging
│       └── public_routes.py  Public blog/careers/forms
├── frontend/
│   ├── public/
│   │   ├── _redirects
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── admin/
│       │   ├── AdminLayout.jsx         Sidebar + top bar
│       │   ├── ProtectedRoute.jsx      Route guard
│       │   ├── context/AuthContext.jsx Auth state
│       │   └── pages/
│       │       ├── Login.jsx
│       │       ├── Dashboard.jsx
│       │       ├── BlogList.jsx + BlogEditor.jsx
│       │       ├── CareersList.jsx + CareersEditor.jsx
│       │       ├── Leads.jsx
│       │       ├── Newsletter.jsx
│       │       ├── Experts.jsx
│       │       ├── Waitlist.jsx
│       │       ├── ActivityLogs.jsx
│       │       ├── AdminUsers.jsx
│       │       └── ComingSoon.jsx
│       ├── components/
│       │   ├── layout/ (Header, Footer, Layout)
│       │   ├── sections/ (NewsletterForm)
│       │   ├── seo/ (SEOMeta)
│       │   └── ui/ (shadcn)
│       ├── hooks/
│       │   ├── useBlogPosts.js     → backend API + mock fallback
│       │   ├── useJobListings.js   → backend API + mock fallback
│       │   └── useFormSubmit.js    → supabaseClient.submitForm
│       └── lib/
│           ├── api.js              Axios client (withCredentials)
│           └── supabaseClient.js   Form routing to backend API
└── supabase/
    ├── migrations/
    └── seed/
```

## Database Schema (MongoDB — gorakhai_cms)
| Collection | Purpose |
|---|---|
| `admin_users` | CMS admin accounts with roles |
| `blog_posts` | Blog articles (CRUD via admin) |
| `job_listings` | Career postings (CRUD via admin) |
| `contact_submissions` | Leads from contact form |
| `newsletter_subscribers` | Newsletter signups |
| `expert_network_registrations` | Expert applications |
| `waitlist_subscribers` | Product waitlist |
| `job_applications` | Job applications |
| `activity_logs` | User action tracking |
| `audit_logs` | Content change audit trail |
| `login_attempts` | Brute force protection |

## Admin Roles
- **super_admin**: Full access to all features
- **content_admin**: Blog + Careers management
- **community_admin**: Leads + Newsletter + Waitlist management
- **expert_network_admin**: Expert Network management

## Implemented — Milestone 1 (Feb 2026)
### ✅ Pages (12 routes)
- Home, About, Products, Orchestra IQ, Arjun AI
- Blog + BlogPost, Contact, Careers + CareerDetail
- Expert Network, Waitlist

### ✅ SEO
- react-helmet-async, OpenGraph, Twitter Card, JSON-LD
- sitemap.xml (25 URLs), robots.txt (blocks /admin)

### ✅ Database
- 001_initial_schema.sql + 002_rls_policies.sql (Supabase)
- seed_data.sql

### ✅ Documentation
- SUPABASE_SETUP.md, CLOUDFLARE_DEPLOY.md, ADMIN_GUIDE.md

## Implemented — Milestone 2 (Admin CMS — Feb 2026)

### ✅ Backend Auth (JWT Cookie-based)
- POST /api/auth/login (brute force protection, audit log)
- GET /api/auth/me, POST /api/auth/logout, POST /api/auth/refresh
- Role-based access via `require_roles()` dependency
- Bcrypt password hashing, seed Super Admin on startup

### ✅ Admin API Endpoints
- GET /api/admin/stats — dashboard counts (6 categories)
- Blog CRUD: GET/POST /api/admin/blog, GET/PUT/DELETE /api/admin/blog/:id
- Careers CRUD: GET/POST /api/admin/careers, etc.
- Leads: GET /api/admin/leads, PATCH /api/admin/leads/:id/status
- Newsletter: GET /api/admin/newsletter, DELETE /api/admin/newsletter/:id
- Experts: GET /api/admin/experts, PATCH /api/admin/experts/:id/status
- Waitlist: GET /api/admin/waitlist, PATCH /api/admin/waitlist/:id/status
- Admin Users: GET/POST /api/admin/users, PUT/DELETE /api/admin/users/:id
- Logs: GET /api/admin/audit-logs, GET /api/admin/activity-logs

### ✅ Public API Endpoints (single source of truth)
- GET /api/public/blog, GET /api/public/blog/:slug
- GET /api/public/careers, GET /api/public/careers/:slug
- POST /api/public/contact, /api/public/newsletter/subscribe
- POST /api/public/waitlist/join, /api/public/experts/apply, /api/public/careers/apply

### ✅ Audit & Activity Logging
- All write operations log to audit_logs (before/after state + changes diff)
- User actions log to activity_logs
- Login/logout tracked in audit_logs

### ✅ Seed Data
- 6 blog posts seeded on startup (if collection empty)
- 6 job listings seeded on startup (if collection empty)
- Super Admin seeded from ADMIN_EMAIL/ADMIN_PASSWORD env vars

### ✅ Admin Frontend
- /admin/login — standalone login page (dark, Gorakhai branded)
- /admin — protected dashboard with 6 stat cards + recent activity feed
- /admin/blog — blog list + /admin/blog/new + /admin/blog/:id editor
- /admin/careers — careers list + /admin/careers/new + /admin/careers/:id editor
- /admin/leads — lead management with detail panel + status workflow
- /admin/newsletter — subscriber list + CSV export
- /admin/experts — expert applications with approve/reject workflow
- /admin/waitlist — waitlist management + invite/convert workflow
- /admin/users — admin user management (super admin only)
- /admin/activity-logs — full audit trail with change diffs
- Future placeholders (Coming Soon): AI Boardroom, Expert Marketplace, Community, Events, Partner Program

### ✅ Public Hooks Updated
- useBlogPosts.js → reads from /api/public/blog + mock fallback
- useJobListings.js → reads from /api/public/careers + mock fallback
- supabaseClient.js submitForm → routes to backend API endpoints

## Phase 2 Backlog (Post Approval)
- P0: Image upload for blog posts (Supabase Storage or S3)
- P0: Rich text editor for blog content (react-quill or tiptap)
- P1: Email notifications on form submissions (Resend integration)
- P1: AI Boardroom feature (future milestone)
- P1: Human Expert Marketplace (future milestone)
- P2: Community features (future milestone)
- P2: Events management (future milestone)
- P2: Partner Program (future milestone)
- P2: Blog search + pagination on public site
- P2: Analytics integration (Plausible or GA4)
- P2: Cloudflare Pages deployment config + GitHub Actions CI/CD

## Environment Variables
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=gorakhai_cms
CORS_ORIGINS=https://gorakhai-business.preview.emergentagent.com,http://localhost:3000
JWT_SECRET=<64-char hex>
ADMIN_EMAIL=superadmin@gorakhai.com
ADMIN_PASSWORD=<password>
FRONTEND_URL=https://gorakhai-business.preview.emergentagent.com

# Frontend (.env)
REACT_APP_BACKEND_URL=https://gorakhai-business.preview.emergentagent.com
REACT_APP_SUPABASE_URL=<optional>
REACT_APP_SUPABASE_ANON_KEY=<optional>
```
