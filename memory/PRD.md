# GorakhAI Corporate Site — PRD

## Original Problem Statement
Build a production-grade corporate site for GorakhAI with a public-facing marketing presence (Milestone 1) and a full Admin CMS (Milestone 2). Architecture uses React frontend, FastAPI backend, MongoDB, JWT authentication, Cloudflare Pages deployment, and a milestone-based implementation plan. Supabase and Resend are explicitly deferred to a future milestone.

---

## Architecture

- **Frontend**: React 19 + Tailwind CSS + shadcn/radix UI + Framer Motion + react-helmet-async
- **Backend**: FastAPI + MongoDB (Motor async) — modular routes under `/backend/routes/`
- **Database**: MongoDB (`gorakhai_cms`) via Motor async driver
- **Auth**: JWT cookie-based (access_token + refresh_token), bcrypt, brute-force protection
- **Rich Text**: TipTap v3 editor with full toolbar, image insert, tables, code blocks
- **Media**: Storage abstraction layer (local filesystem default, Cloudflare R2 ready)
- **Hosting**: Cloudflare Pages (frontend) + Railway/Render (backend)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`, `backend-ci.yml`)

---

## Repository Structure

```
/app/
├── .github/
│   └── workflows/
│       ├── deploy.yml          CI/CD: React build → Cloudflare Pages (Node 20)
│       └── backend-ci.yml      CI: Python lint + pytest on backend changes
├── backend/
│   ├── server.py               FastAPI app, startup seeding, indexes
│   ├── db.py                   MongoDB connection via Motor
│   ├── auth.py                 JWT utilities, bcrypt, get_current_user, require_roles
│   ├── storage.py              StorageProvider abstraction (LocalStorage + R2Storage stub)
│   └── routes/
│       ├── auth_routes.py      POST /api/auth/login|logout|me|refresh
│       ├── admin_routes.py     All admin CRUD + audit logging
│       ├── public_routes.py    Public blog/careers/forms
│       └── media_routes.py     POST /api/admin/media/upload, GET /api/media/:filename
│   ├── Dockerfile              Production container (non-root user, healthcheck)
│   ├── requirements.txt        Python dependencies (incl. aiofiles, python-multipart)
│   ├── .env.example            Template for production env vars
│   └── tests/                  pytest test files
├── frontend/
│   ├── public/
│   │   ├── _redirects          SPA routing for Cloudflare Pages
│   │   ├── robots.txt
│   │   └── sitemap.xml         25 URLs
│   └── src/
│       ├── admin/
│       │   ├── AdminLayout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── context/AuthContext.jsx
│       │   └── pages/
│       │       ├── Login.jsx, Dashboard.jsx
│       │       ├── BlogList.jsx, BlogEditor.jsx   (TipTap editor)
│       │       ├── CareersList.jsx, CareersEditor.jsx
│       │       ├── Leads.jsx, Newsletter.jsx
│       │       ├── Experts.jsx, Waitlist.jsx
│       │       ├── ActivityLogs.jsx, AdminUsers.jsx
│       │       └── ComingSoon.jsx
│       ├── components/
│       │   ├── editor/         TipTapEditor.jsx, EditorToolbar.jsx, tiptap.css
│       │   ├── layout/         Header, Footer, Layout
│       │   ├── sections/       NewsletterForm
│       │   └── seo/            SEOMeta
│       ├── hooks/
│       │   ├── useBlogPosts.js   → /api/public/blog
│       │   ├── useJobListings.js → /api/public/careers
│       │   └── useFormSubmit.js  → backend API forms
│       └── lib/
│           ├── api.js            Axios client (withCredentials, 401 refresh interceptor)
│           └── supabaseClient.js Form routing to backend API
├── docker-compose.yml
└── docs/
    ├── DEPLOYMENT.md           Full production deployment guide (non-technical)
    ├── CLOUDFLARE_DEPLOY.md    Cloudflare Pages specific setup
    ├── ENV_VARS.md             All environment variables documented
    └── ADMIN_GUIDE.md          Admin CMS user guide
```

---

## Database Schema (MongoDB — `gorakhai_cms`)

| Collection | Purpose |
|---|---|
| `admin_users` | CMS admin accounts with roles |
| `blog_posts` | Blog articles (TipTap HTML content) |
| `job_listings` | Career postings |
| `contact_submissions` | Leads from contact form |
| `newsletter_subscribers` | Newsletter signups |
| `expert_network_registrations` | Expert applications |
| `waitlist_subscribers` | Product waitlist |
| `job_applications` | Job applications |
| `media` | Uploaded file metadata (provider-agnostic) |
| `activity_logs` | User action tracking |
| `audit_logs` | Content change audit trail (before/after diffs) |
| `login_attempts` | Brute force protection |

---

## Admin Roles

| Role | Access |
|---|---|
| `super_admin` | Full access to all features and admin user management |
| `content_admin` | Blog + Careers management |
| `community_admin` | Leads + Newsletter + Waitlist management |
| `expert_network_admin` | Expert Network management |

---

## ✅ Milestone 1 — Public Site (Completed Feb 2026)

### Pages (12 routes)
- Home, About, Products, Orchestra IQ, Arjun AI
- Blog (list + post), Contact, Careers (list + detail)
- Expert Network, Waitlist

### SEO
- react-helmet-async, OpenGraph, Twitter Card, JSON-LD structured data
- sitemap.xml (25 URLs), robots.txt (blocks /admin)

### Documentation
- SUPABASE_SETUP.md, CLOUDFLARE_DEPLOY.md (initial), ADMIN_GUIDE.md

---

## ✅ Milestone 2 Phase 1 — Admin CMS Backend & Frontend (Completed Feb 2026)

### Backend Auth (JWT Cookie-based)
- `POST /api/auth/login` — brute force protection (5 attempts / 15 min), audit log
- `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/auth/refresh`
- Role-based access via `require_roles()` FastAPI dependency
- Bcrypt password hashing; Super Admin seeded on startup from env vars
- Cookie security: env-configurable (`COOKIE_SECURE=true` → `Secure; SameSite=None`)

### Admin API Endpoints
- `GET /api/admin/stats` — dashboard counts (6 categories)
- Blog CRUD: `GET|POST /api/admin/blog`, `GET|PUT|DELETE /api/admin/blog/:id`
- Careers CRUD: `GET|POST /api/admin/careers`, `GET|PUT|DELETE /api/admin/careers/:id`
- Leads: `GET /api/admin/leads`, `PATCH /api/admin/leads/:id/status`
- Newsletter: `GET /api/admin/newsletter`, `DELETE /api/admin/newsletter/:id`
- Experts: `GET /api/admin/experts`, `PATCH /api/admin/experts/:id/status`
- Waitlist: `GET /api/admin/waitlist`, `PATCH /api/admin/waitlist/:id/status`
- Admin Users: `GET|POST /api/admin/users`, `PUT|DELETE /api/admin/users/:id`
- Logs: `GET /api/admin/audit-logs`, `GET /api/admin/activity-logs`

### Public API Endpoints
- `GET /api/public/blog`, `GET /api/public/blog/:slug`
- `GET /api/public/careers`, `GET /api/public/careers/:slug`
- `POST /api/public/contact`, `POST /api/public/newsletter/subscribe`
- `POST /api/public/waitlist/join`, `POST /api/public/experts/apply`, `POST /api/public/careers/apply`

### Audit & Activity Logging
- All write operations log to `audit_logs` (before/after state + change diff)
- User actions log to `activity_logs`
- Login/logout tracked in `audit_logs`

### Seed Data
- 6 blog posts seeded on startup (if collection empty)
- 6 job listings seeded on startup (if collection empty)
- Super Admin seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars

### Admin Frontend
- `/admin/login` — standalone login page (dark, GorakhAI branded)
- `/admin` — protected dashboard with 6 stat cards + recent activity feed
- `/admin/blog` — blog list + `/admin/blog/new` + `/admin/blog/:id` TipTap editor
- `/admin/careers` — careers list + editor
- `/admin/leads` — lead management with detail panel + status workflow
- `/admin/newsletter` — subscriber list + CSV export
- `/admin/experts` — expert applications with approve/reject workflow
- `/admin/waitlist` — waitlist management + invite workflow
- `/admin/users` — admin user management (super admin only)
- `/admin/activity-logs` — full audit trail with change diffs
- Future placeholders (Coming Soon): AI Boardroom, Expert Marketplace, Community, Events, Partner Program

---

## ✅ Milestone 2 Phase 2 — Rich Text, Media & Deployment (Completed Feb 2026)

### TipTap Rich Text Editor
- Full toolbar: Bold, Italic, Underline, Headings (H1–H3), Lists, Blockquote
- Code blocks with syntax highlighting (lowlight)
- Tables (insert, resize)
- Link insertion with validation
- Text alignment (left/center/right)
- Image insert modal — upload to backend media API or insert by URL
- Character count display
- Placeholder text for empty editor
- CSS: `/frontend/src/components/editor/tiptap.css`

### Media Upload API
- `POST /api/admin/media/upload` — multipart, 10MB limit, image/PDF types
- `GET /api/admin/media` — paginated media library
- `DELETE /api/admin/media/:id` — delete with storage cleanup
- `GET /api/media/:filename` — public file serving

### Storage Abstraction Layer (`/backend/storage.py`)
- `StorageProvider` ABC — uniform `save()`, `delete()`, `public_url()` interface
- `LocalStorage` — filesystem under `UPLOADS_DIR`, async via `aiofiles`
- `R2Storage` — Cloudflare R2 stub via boto3 (activated by `STORAGE_PROVIDER=r2`)
- Factory: `get_storage_provider()` singleton — no code changes needed to swap providers

### Deployment Infrastructure
- `backend/Dockerfile` — Python 3.11-slim, non-root user, health check, 2 workers
- `docker-compose.yml` — MongoDB + Backend + persistent volumes
- `.github/workflows/deploy.yml` — React build (Node 20) → Cloudflare Pages on push to `main`
- `.github/workflows/backend-ci.yml` — Python lint (ruff) + pytest on backend changes
- `docs/DEPLOYMENT.md` — comprehensive non-technical founder deployment guide
- `docs/CLOUDFLARE_DEPLOY.md` — Cloudflare Pages specific setup (updated, Supabase refs removed)
- `docs/ENV_VARS.md` — all environment variables documented including `COOKIE_SECURE`
- `backend/.env.example` — production template

---

## ✅ Claude Handover Package (Feb 2026)

Generated `docs/CLAUDE_HANDOVER.md` — 1,428 lines, all 15 sections.
Covers: Executive summary, full repo architecture, all API endpoints with payloads,
all DB collections with fields, auth architecture, env vars table, step-by-step
deployment instructions, known issues, full roadmap P0–P3, Claude continuation
instructions, content audit (placeholder/mock inventory), and project health scores.

---

## ✅ Phase A — Cloudflare Pages Deployment Readiness (Feb 2026)

### Form Behaviour Fixed for Phase A
All 5 public-facing forms updated to surface a clear, actionable error message
when the backend is not yet active. No form returns a false success state.

Files changed:
- `src/lib/supabaseClient.js` — throws `PHASE_A_MSG` instead of `{ success: true, mock: true }`
- `src/pages/Contact.jsx` — captures `err.message`, displays it
- `src/pages/ExpertNetwork.jsx` — captures `err.message`, displays it
- `src/pages/CareerDetail.jsx` — captures `err.message`, displays it
- `src/pages/Waitlist.jsx` — surfaces `errorMsg` from `useFormSubmit`
- `src/components/sections/NewsletterForm.jsx` — captures `err.message`, displays it

### Deployment docs
- `docs/PHASE_A_DEPLOYMENT.md` — full step-by-step guide for non-technical founder

### What needs to happen before going live
1. **MongoDB Atlas** — create free M0 cluster, get connection string
2. **Railway/Render** — deploy backend with production env vars (see `docs/DEPLOYMENT.md`)
3. **GitHub Secrets** — `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `REACT_APP_BACKEND_URL`
4. **Cloudflare Pages** — connect GitHub repo, configure build settings, add custom domain
5. **DNS** — point `api.gorakhai.com` → Railway, `gorakhai.com` → Cloudflare Pages

---

## Prioritised Backlog

### P1 — Next Sprint
- [ ] Execute production deployment (user action — see `docs/DEPLOYMENT.md`)
- [ ] Add Railway persistent volume for media uploads (`/app/uploads`)

### P2 — After Launch
- [ ] Cloudflare R2 media storage activation (architecture already built)
- [ ] Email notifications on form submissions (Resend integration — user deferred)
- [ ] Blog search + pagination on public site
- [ ] Analytics integration (Plausible or GA4 — Cloudflare Web Analytics is free)

### P3 — Future Milestones
- [ ] AI Boardroom feature
- [ ] Human Expert Marketplace
- [ ] Community features
- [ ] Events management
- [ ] Partner Program
- [ ] Supabase integration (user deferred)

---

## Environment Variables

See `docs/ENV_VARS.md` for full documentation.

### Key production variables

```bash
# backend/.env.production
MONGO_URL="mongodb+srv://..."       # MongoDB Atlas connection string
DB_NAME="gorakhai_cms"
JWT_SECRET="<64-char hex>"          # python3 -c "import secrets; print(secrets.token_hex(32))"
ADMIN_EMAIL="you@gorakhai.com"
ADMIN_PASSWORD="<strong-password>"
CORS_ORIGINS="https://gorakhai.com,https://www.gorakhai.com"
FRONTEND_URL="https://gorakhai.com"
STORAGE_PROVIDER="local"            # change to "r2" when ready
UPLOADS_DIR="/app/uploads"
COOKIE_SECURE="true"                # REQUIRED for cross-origin cookie auth in production

# frontend — set in Cloudflare Pages UI or GitHub Secrets
REACT_APP_BACKEND_URL=https://api.gorakhai.com
CI=false
GENERATE_SOURCEMAP=false
```
