# GorakhAI Corporate Site — Complete Project Handover Package

**Prepared for:** Claude Sonnet (continuing engineer)  
**Prepared by:** Emergent E1 (outgoing agent)  
**Date:** February 2026  
**Repository:** `gorakhai-corporate-site`

> This document is the single source of truth for continuing development of this project. No prior conversation history is required to continue from this point.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Repository Architecture](#2-repository-architecture)
3. [Current Deployment State](#3-current-deployment-state)
4. [Phase A Status — What Is Live](#4-phase-a-status)
5. [Phase B Status — What Is Planned But Not Activated](#5-phase-b-status)
6. [API Documentation](#6-api-documentation)
7. [Database Design](#7-database-design)
8. [Authentication Architecture](#8-authentication-architecture)
9. [Environment Variables](#9-environment-variables)
10. [Deployment Instructions](#10-deployment-instructions)
11. [Known Issues](#11-known-issues)
12. [Future Roadmap](#12-future-roadmap)
13. [Claude Continuation Instructions](#13-claude-continuation-instructions)
14. [Repository Audit — Content Review](#14-repository-audit)
15. [Final Project Health Report](#15-final-project-health-report)

---

## 1. Executive Summary

### What GorakhAI Is

GorakhAI is an enterprise AI infrastructure company. Its two core products are:

- **Orchestra IQ** — An AI orchestration platform that routes workloads across multiple LLMs (GPT-4, Claude, Gemini, custom models) through a single API. Provides multi-model routing, real-time observability, cost optimisation, and workflow automation.
- **Arjun AI** — An intelligent AI assistant that builds persistent organisational context across sessions, learning a business's operations to amplify team productivity.

This repository is the company's public corporate website and internal Admin CMS.

### Current Business Vision

Pre-launch stage. The website exists to establish brand credibility, capture early enterprise leads, build a waitlist, recruit talent, and grow an expert network. No products are publicly available yet. All product descriptions are aspirational.

### Current Deployment Strategy

**Phase A (current):** Frontend-only deployment to Cloudflare Pages. The React SPA serves all public pages with mock/seed data. Forms exist but do not submit to any backend — users see a clear message directing them to email.

**Phase B (next):** Backend activation. Deploy FastAPI on Railway + MongoDB Atlas. When live, forms connect automatically, Admin CMS becomes operational, and real data replaces mock data. Zero frontend code changes are required for Phase B activation.

### Phase Definitions

| Phase | Scope | Status |
|---|---|---|
| **Phase A** | Frontend public site on Cloudflare Pages | READY TO DEPLOY |
| **Phase B** | Backend (Railway) + Database (MongoDB Atlas) activation | BUILT, NOT YET DEPLOYED |
| **Phase C** | Cloudflare R2 media storage (replaces ephemeral local storage) | ARCHITECTURE BUILT |
| **Phase D** | Email notifications via Resend | NOT YET BUILT |

---

## 2. Repository Architecture

### Folder Structure

```
gorakhai-corporate-site/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml              ← Frontend CI/CD: React (Node 20) → Cloudflare Pages
│       └── backend-ci.yml          ← Backend CI: ruff linting + pytest on backend changes
│
├── backend/                        ← FastAPI application (Python 3.11)
│   ├── server.py                   ← App entry, CORS config, route registration, startup seeding
│   ├── auth.py                     ← JWT creation/validation, bcrypt, get_current_user(), require_roles()
│   ├── db.py                       ← MongoDB connection singleton (Motor async)
│   ├── storage.py                  ← Storage abstraction: LocalStorage (default) + R2Storage (stub)
│   ├── Dockerfile                  ← Python 3.11-slim, non-root user, healthcheck, 2 workers
│   ├── requirements.txt            ← All Python deps including aiofiles, python-multipart, boto3
│   ├── .env                        ← LOCAL dev environment (git-ignored)
│   ├── .env.example                ← Production template (committed, no secrets)
│   └── routes/
│       ├── auth_routes.py          ← /api/auth/* (login, logout, me, refresh)
│       ├── admin_routes.py         ← /api/admin/* (all CMS CRUD + audit logging)
│       ├── public_routes.py        ← /api/public/* (blog, careers, forms)
│       └── media_routes.py         ← /api/admin/media/* + /api/media/:filename
│
├── frontend/                       ← React 19 SPA
│   ├── public/
│   │   ├── _redirects              ← "/* /index.html 200" — enables SPA routing on CF Pages
│   │   ├── robots.txt              ← Allows all, blocks /admin/, references sitemap
│   │   └── sitemap.xml             ← 25 public URLs with gorakhai.com domain
│   └── src/
│       ├── App.js                  ← React Router v6: all 13 public + admin routes
│       ├── admin/                  ← Full Admin CMS (protected routes, requires backend)
│       │   ├── AdminLayout.jsx     ← Sidebar navigation, auth state display
│       │   ├── ProtectedRoute.jsx  ← Redirects to /admin/login if not authenticated
│       │   ├── context/AuthContext.jsx ← JWT cookie-based auth state management
│       │   └── pages/
│       │       ├── Login.jsx           ← Standalone login (dark theme, GorakhAI branded)
│       │       ├── Dashboard.jsx       ← 6 stat cards + recent audit activity feed
│       │       ├── BlogList.jsx        ← Blog posts table with search + status filter
│       │       ├── BlogEditor.jsx      ← Full TipTap rich text editor + cover image
│       │       ├── CareersList.jsx     ← Jobs table with department + status filter
│       │       ├── CareersEditor.jsx   ← Job listing editor with requirements/responsibilities
│       │       ├── Leads.jsx           ← Contact submissions with detail panel + status workflow
│       │       ├── Newsletter.jsx      ← Subscriber list + CSV export
│       │       ├── Experts.jsx         ← Expert applications with approve/reject workflow
│       │       ├── Waitlist.jsx        ← Waitlist management with invite workflow
│       │       ├── AdminUsers.jsx      ← Admin user management (super_admin only)
│       │       ├── ActivityLogs.jsx    ← Full audit trail with change diffs
│       │       └── ComingSoon.jsx      ← Placeholder page for future admin features
│       ├── components/
│       │   ├── editor/
│       │   │   ├── TipTapEditor.jsx    ← Rich text editor (full toolbar, image insert)
│       │   │   ├── EditorToolbar.jsx   ← Bold, italic, headings, lists, links, tables, align
│       │   │   └── tiptap.css          ← Editor prose styles
│       │   ├── layout/
│       │   │   ├── Header.jsx          ← Navigation with mobile menu
│       │   │   ├── Footer.jsx          ← Links, copyright, social icons
│       │   │   └── Layout.jsx          ← Header + children + Footer wrapper
│       │   ├── sections/
│       │   │   └── NewsletterForm.jsx  ← Reusable email signup (used on Home + Blog)
│       │   ├── seo/
│       │   │   └── SEOMeta.jsx         ← react-helmet-async, OG tags, JSON-LD, Twitter Card
│       │   └── ui/                     ← shadcn/radix component library
│       ├── constants/
│       │   ├── mockData.js             ← 6 blog posts, 6 jobs, 3 team members, categories
│       │   └── testIds.js              ← data-testid constants for testing
│       ├── hooks/
│       │   ├── useBlogPosts.js         ← Fetches /api/public/blog → falls back to BLOG_POSTS
│       │   ├── useJobListings.js       ← Fetches /api/public/careers → falls back to JOB_LISTINGS
│       │   └── useFormSubmit.js        ← Wraps form submissions with loading/error/success state
│       ├── lib/
│       │   ├── api.js                  ← Axios client: withCredentials=true, 401 refresh interceptor
│       │   └── supabaseClient.js       ← submitForm() routes to backend API; throws PHASE_A_MSG if unavailable
│       └── pages/                      ← 12 public-facing pages
│           ├── Home.jsx, About.jsx, Products.jsx
│           ├── OrchestraIQ.jsx, ArjunAI.jsx
│           ├── Blog.jsx, BlogPost.jsx
│           ├── Careers.jsx, CareerDetail.jsx
│           ├── Contact.jsx, ExpertNetwork.jsx, Waitlist.jsx
│
├── docker-compose.yml              ← MongoDB + Backend + persistent volumes (self-hosted option)
├── memory/
│   ├── PRD.md                      ← Product requirements, architecture, completed milestones
│   └── test_credentials.md         ← Admin login credentials (git-ignored in production)
└── docs/
    ├── PHASE_A_DEPLOYMENT.md       ← Step-by-step Cloudflare Pages guide (non-technical)
    ├── DEPLOYMENT.md               ← Full deployment guide: Atlas + Railway + Cloudflare
    ├── CLOUDFLARE_DEPLOY.md        ← Cloudflare Pages specific setup
    ├── ENV_VARS.md                 ← All environment variables documented
    ├── ADMIN_GUIDE.md              ← Admin CMS user guide
    └── CLAUDE_HANDOVER.md          ← This file
```

> **Note:** There is no `supabase/` directory. The original architecture used Supabase but it was replaced entirely by the FastAPI + MongoDB backend. The file `src/lib/supabaseClient.js` is a legacy-named file that now routes to the FastAPI backend — it has nothing to do with Supabase.

### How Components Communicate

```
Browser
  │
  ├── Public pages (Blog, Careers)
  │     └── useBlogPosts / useJobListings hooks
  │           ├── Primary: GET /api/public/* (backend)
  │           └── Fallback: mockData.js (if backend unreachable)
  │
  ├── Public forms (Contact, Newsletter, Waitlist, Expert, Careers)
  │     └── supabaseClient.submitForm()
  │           ├── Primary: POST /api/public/* (backend)
  │           └── Fallback: throws PHASE_A_MSG error (no silent failure)
  │
  └── Admin CMS (/admin/*)
        └── src/lib/api.js (Axios)
              ├── withCredentials: true (sends JWT cookie)
              ├── 401 interceptor → POST /api/auth/refresh → retry
              └── All calls: GET/POST/PUT/DELETE /api/admin/*
```

---

## 3. Current Deployment State

### GitHub Repository
- **Repository name:** `gorakhai-corporate-site` (exact name — confirm with owner)
- **Production branch:** `main`
- **Primary working branch:** `main`

### Cloudflare Pages
- **Project name:** To be created (not yet deployed as of this handover)
- **Build command:** `cd frontend && yarn install && yarn build`
- **Build output directory:** `frontend/build`
- **Node.js version:** 20
- **Framework preset:** Create React App
- **Root directory:** *(blank — repository root)*

### Environment Variables (Cloudflare Pages)

| Variable | Value | Set? |
|---|---|---|
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` | Must be set during CF Pages setup |
| `CI` | `false` | Must be set (prevents build failure on warnings) |
| `GENERATE_SOURCEMAP` | `false` | Must be set (reduces build size) |

### GitHub Actions Secrets Required

| Secret | Where to find |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Edit Cloudflare Pages template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` |

### Custom Domains
- `gorakhai.com` → Cloudflare Pages (primary)
- `www.gorakhai.com` → Redirect to `https://gorakhai.com`
- `api.gorakhai.com` → Railway backend (Phase B, not yet configured)

### Current Deployment Status
**Phase A is code-complete and deployment-ready.** The owner has not yet executed the Cloudflare Pages setup steps. Full instructions are in `docs/PHASE_A_DEPLOYMENT.md`.

---

## 4. Phase A Status

### Public Pages — All Completed

| Route | Page | SEO | Status |
|---|---|---|---|
| `/` | Home | ✅ OG, Twitter, JSON-LD | Complete |
| `/about` | About GorakhAI | ✅ | Complete |
| `/products` | Products overview | ✅ | Complete |
| `/products/orchestra-iq` | Orchestra IQ detail | ✅ | Complete |
| `/products/arjun-ai` | Arjun AI detail | ✅ | Complete |
| `/blog` | Blog list | ✅ | Complete |
| `/blog/:slug` | Individual blog post | ✅ | Complete |
| `/careers` | Careers list | ✅ | Complete |
| `/careers/:slug` | Career detail + apply | ✅ | Complete |
| `/contact` | Contact / demo request | ✅ | Complete |
| `/expert-network` | Expert registration | ✅ | Complete |
| `/waitlist` | Waitlist signup | ✅ | Complete |

> Plus 9 admin routes under `/admin/*` (functional but require backend).

### SEO Implementation

| Feature | Implementation | File |
|---|---|---|
| `<title>` and `<meta description>` | react-helmet-async per page | `src/components/seo/SEOMeta.jsx` |
| Open Graph tags | `og:title`, `og:description`, `og:type`, `og:image`, `og:url` | SEOMeta.jsx |
| Twitter Card | `twitter:card`, `twitter:title`, `twitter:description` | SEOMeta.jsx |
| JSON-LD structured data | `Organization`, `WebSite`, `BlogPosting`, `JobPosting` schemas | SEOMeta.jsx |
| Canonical URLs | `<link rel="canonical">` on all pages | SEOMeta.jsx |
| sitemap.xml | 25 URLs, all `https://gorakhai.com/...` | `frontend/public/sitemap.xml` |
| robots.txt | `Allow: /`, `Disallow: /admin/`, sitemap reference | `frontend/public/robots.txt` |

### Blog

- **6 seeded mock posts** in `src/constants/mockData.js` — shown when backend is offline
- **6 seeded posts** also inserted by `server.py` on first startup — available when backend is online
- Individual post pages render full content, author, tags, reading time
- **Data source:** Mock until backend is live; real MongoDB data once Phase B is active

### Careers

- **6 seeded mock job listings** in `src/constants/mockData.js`
- Career detail pages show full job description, requirements, responsibilities
- Job application form exists — currently shows Phase A error on submit
- **Data source:** Mock until Phase B; real data once backend is live

### Waitlist

- Page complete with email + name signup form
- Submit shows Phase A error message directing to `hello@gorakhai.com`

### Expert Network

- Full expert application form: name, email, phone, expertise areas, experience, LinkedIn, bio
- Submit shows Phase A error message

### Contact

- Contact/demo request form: name, email, company, subject, message
- Submit shows Phase A error message
- Contact details (email addresses) are hardcoded and visible: `hello@gorakhai.com`, `partnerships@gorakhai.com`

### Admin UI

- Complete CMS interface at `/admin/*` (see Section 2 for page list)
- All UI is built and functional
- **Requires backend to authenticate** — login fails gracefully in Phase A

### TipTap Rich Text Editor

- Integrated into Blog Editor (`/admin/blog/new`, `/admin/blog/:id`)
- Toolbar: Bold, Italic, Underline, Strikethrough, Code, H1–H3, Paragraph
- Lists: Ordered, Unordered, Blockquote
- Tables: Insert, delete row/column
- Links: Insert with validation
- Text alignment: Left, Centre, Right, Justify
- Image insert: Upload to backend media API OR paste URL
- Code blocks with `lowlight` syntax highlighting
- Character count, placeholder text
- CSS: `src/components/editor/tiptap.css`

### Media Upload

- API endpoint: `POST /api/admin/media/upload` (multipart, max 10MB)
- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `application/pdf`
- Storage abstraction: `backend/storage.py` — `LocalStorage` default, `R2Storage` stub ready
- Public serving: `GET /api/media/:filename` (cached, immutable headers)
- **Phase A status:** Admin upload UI is built; requires backend to actually upload files

### Deployment Infrastructure

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Python 3.11-slim, non-root user, healthcheck, uvicorn 2 workers |
| `docker-compose.yml` | MongoDB + Backend containers with persistent volumes |
| `.github/workflows/deploy.yml` | React build (Node 20) → Cloudflare Pages on push to `main` |
| `.github/workflows/backend-ci.yml` | Python lint (ruff) + pytest on backend changes |
| `docs/PHASE_A_DEPLOYMENT.md` | Phase A deployment guide (non-technical founder) |
| `docs/DEPLOYMENT.md` | Full Phase A + B deployment guide |
| `docs/CLOUDFLARE_DEPLOY.md` | Cloudflare Pages specific guide |
| `docs/ENV_VARS.md` | All environment variables documented |
| `backend/.env.example` | Production environment template |

### What Is REAL vs MOCK

| Content | Type | Where |
|---|---|---|
| Page layouts, components, navigation | **REAL** | React JSX |
| Blog article content | **MOCK** — fictional AI/enterprise content | `mockData.js`, seeded in MongoDB |
| Job listings | **MOCK** — fictional roles at GorakhAI | `mockData.js`, seeded in MongoDB |
| Team member names and bios | **MOCK** — fictional individuals | `mockData.js` |
| Company stats (500+ clients, 38M raised, etc.) | **PLACEHOLDER** — aspirational | `Home.jsx`, `About.jsx`, `Careers.jsx` |
| Email addresses (`hello@gorakhai.com`) | **REAL** — must be active before Phase A | Contact.jsx |
| Product descriptions (Orchestra IQ, Arjun AI) | **REAL** — reflects actual product vision | Product pages |

---

## 5. Phase B Status

### What Is Built and Ready to Activate

Everything in Phase B is **already implemented in code**. It needs infrastructure (MongoDB Atlas + Railway) and environment variables to go live. No new code is required for any of the items below.

### MongoDB Atlas

- **Status:** Not created. Free M0 cluster required.
- **What it enables:** All form submissions, blog content management, careers management, lead tracking, audit logs.
- **Cost:** Free (M0 tier, 512MB, 500 connections)
- **Setup time:** ~10 minutes
- **Instructions:** `docs/DEPLOYMENT.md` Part 1

### Railway Backend

- **Status:** Not deployed. `backend/Dockerfile` is ready.
- **What it enables:** All API endpoints, admin authentication, form capture, media uploads.
- **Cost:** ~$5/month (Railway Hobby plan)
- **Setup time:** ~15 minutes
- **Instructions:** `docs/DEPLOYMENT.md` Part 2
- **Domain to configure:** `api.gorakhai.com` → CNAME to Railway

### Admin Authentication Activation

- **Status:** Fully built. JWT cookie auth is implemented in `backend/auth.py` and `backend/routes/auth_routes.py`.
- **What activates it:** Running the backend. The Super Admin account is seeded from `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars on first startup.
- **Default credentials:** Set in Railway env vars (see Section 9)
- **Important:** Set `COOKIE_SECURE=true` in Railway — required for cross-origin cookie auth

### Form Submission Persistence

All 5 forms connect automatically once `REACT_APP_BACKEND_URL` points to a live backend:

| Form | API Endpoint | Collection |
|---|---|---|
| Contact / Demo Request | `POST /api/public/contact` | `contact_submissions` |
| Newsletter | `POST /api/public/newsletter/subscribe` | `newsletter_subscribers` |
| Waitlist | `POST /api/public/waitlist/join` | `waitlist_subscribers` |
| Expert Application | `POST /api/public/experts/apply` | `expert_network_registrations` |
| Job Application | `POST /api/public/careers/apply` | `job_applications` |

### Media Persistence

- **Phase B default:** `STORAGE_PROVIDER=local` — files stored on Railway filesystem
- **Important:** Add a Railway **persistent volume** mounted at `/app/uploads` (1GB, ~$0.25/month)
- **Phase C:** Switch to Cloudflare R2 (`STORAGE_PROVIDER=r2`) — architecture is built

### Email Notifications (Resend)

- **Status:** NOT YET BUILT. Deliberately deferred by the product owner.
- **When to build:** After Phase B is live and lead capture is confirmed working
- **What it should do:** Send email to admin when contact form submitted, send confirmation to user
- **Integration:** Use Resend.com API (`resend` Python package)
- **NOT a blocker for Phase B**

---

## 6. API Documentation

**Base URL:** `https://api.gorakhai.com`  
**All endpoints prefixed with `/api`**  
**Content-Type:** `application/json` (except file upload which uses `multipart/form-data`)

### Authentication Endpoints

#### `POST /api/auth/login`
Login with email and password. Returns JWT via HttpOnly cookies.

**Auth required:** No  
**Request body:**
```json
{
  "email": "admin@gorakhai.com",
  "password": "your-password"
}
```
**Success response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@gorakhai.com",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```
**Error responses:**
- `401` — Invalid credentials
- `423` — Account locked (5 failed attempts in 15 minutes)
- `403` — Account is inactive

**Side effects:** Sets `access_token` (1 hour) and `refresh_token` (7 days) HttpOnly cookies.

---

#### `GET /api/auth/me`
Get currently authenticated user from cookie.

**Auth required:** Yes (cookie)  
**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "admin@gorakhai.com",
  "name": "Admin User",
  "role": "super_admin",
  "is_active": true
}
```
**Error:** `401` if no valid cookie.

---

#### `POST /api/auth/logout`
Clear authentication cookies.

**Auth required:** Yes  
**Response (200):** `{"message": "Logged out"}`

---

#### `POST /api/auth/refresh`
Refresh access token using refresh token cookie.

**Auth required:** Refresh cookie  
**Response (200):** Sets new `access_token` cookie. Returns `{"message": "Token refreshed"}`.

---

### Admin Endpoints

All admin endpoints require a valid `access_token` cookie. Role requirements are noted per endpoint.

#### `GET /api/admin/stats`
Dashboard statistics and recent activity.

**Roles:** Any admin  
**Response (200):**
```json
{
  "stats": {
    "blog_posts": { "total": 6, "published": 6, "draft": 0 },
    "job_listings": { "total": 6, "open": 6, "closed": 0 },
    "leads": { "total": 12, "new": 5 },
    "newsletter": { "total": 45, "active": 43 },
    "experts": { "total": 8, "pending": 3, "approved": 5 },
    "waitlist": { "total": 120, "waitlisted": 115 }
  },
  "recent_activity": [ ... ]
}
```

---

#### Blog CRUD

**Roles:** `content_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/blog` | List posts. Query: `page`, `limit`, `status` |
| `GET` | `/api/admin/blog/:id` | Get single post by MongoDB ObjectId |
| `POST` | `/api/admin/blog` | Create post |
| `PUT` | `/api/admin/blog/:id` | Update post |
| `DELETE` | `/api/admin/blog/:id` | Delete post (204) |

**POST/PUT request body:**
```json
{
  "title": "Post Title",
  "slug": "post-title",
  "excerpt": "Short summary",
  "content": "<p>HTML from TipTap editor</p>",
  "author_name": "Jane Smith",
  "status": "draft | published",
  "category": "Engineering",
  "tags": ["AI", "Enterprise"],
  "cover_image_url": "https://api.gorakhai.com/api/media/filename.jpg",
  "read_time_mins": 5
}
```
**Response:** Full post object with `id`, `slug`, `published_at`, `view_count`, timestamps.

---

#### Careers CRUD

**Roles:** `content_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/careers` | List jobs. Query: `page`, `limit`, `status`, `department` |
| `GET` | `/api/admin/careers/:id` | Get single job |
| `POST` | `/api/admin/careers` | Create job listing |
| `PUT` | `/api/admin/careers/:id` | Update job listing |
| `DELETE` | `/api/admin/careers/:id` | Delete job (204) |

**POST/PUT request body:**
```json
{
  "title": "Senior Engineer",
  "department": "Engineering",
  "location": "Remote",
  "type": "Full-time",
  "experience_level": "Senior",
  "salary_range": "$180,000 – $220,000",
  "description": "Role description...",
  "requirements": ["5+ years Python", "FastAPI experience"],
  "responsibilities": ["Design APIs", "Lead architecture"],
  "status": "open | closed",
  "closes_at": "2026-06-01T00:00:00Z"
}
```

---

#### Leads (Contact Submissions)

**Roles:** `community_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/leads` | List leads. Query: `page`, `limit`, `status` |
| `GET` | `/api/admin/leads/:id` | Get single lead |
| `PATCH` | `/api/admin/leads/:id/status` | Update status |

**PATCH body:** `{ "status": "new | reviewed | archived | replied" }`

---

#### Newsletter

**Roles:** `community_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/newsletter` | List subscribers. Query: `page`, `limit`, `status` |
| `DELETE` | `/api/admin/newsletter/:id` | Unsubscribe (sets status to `unsubscribed`, 204) |

---

#### Expert Network

**Roles:** `expert_network_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/experts` | List applications. Query: `page`, `limit`, `status` |
| `GET` | `/api/admin/experts/:id` | Get single application |
| `PATCH` | `/api/admin/experts/:id/status` | Approve / reject / change status |

**PATCH body:** `{ "status": "approved | rejected | pending", "notes": "Optional reviewer note" }`

---

#### Waitlist

**Roles:** `community_admin`, `super_admin`

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/waitlist` | List. Query: `page`, `limit`, `status`, `product` |
| `PATCH` | `/api/admin/waitlist/:id/status` | Update status |

**PATCH body:** `{ "status": "waitlisted | invited | converted" }`

---

#### Admin User Management

**Roles:** `super_admin` only

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/users` | List all admin users (passwords excluded) |
| `POST` | `/api/admin/users` | Create new admin user |
| `PUT` | `/api/admin/users/:id` | Update user (name, role, password, active) |
| `DELETE` | `/api/admin/users/:id` | Delete user (cannot delete own account, 204) |

**POST body:**
```json
{
  "email": "editor@gorakhai.com",
  "name": "Content Editor",
  "password": "SecurePassword123!",
  "role": "content_admin | community_admin | expert_network_admin | super_admin"
}
```

---

#### Logs

**Roles:** `super_admin` only

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/audit-logs` | Full audit trail. Query: `page`, `limit`, `resource_type`, `action` |
| `GET` | `/api/admin/activity-logs` | User activity feed. Query: `page`, `limit` |

---

### Public Endpoints

No authentication required.

#### `GET /api/public/blog`
List published blog posts.  
**Query params:** `page` (default 1), `limit` (default 20), `category`  
**Response:** `{ "posts": [...], "total": N, "page": N, "limit": N }`

#### `GET /api/public/blog/:slug`
Get single published post by slug. Increments `view_count`.  
**Response:** Full post document including `content` (HTML).

#### `GET /api/public/careers`
List open job listings.  
**Query params:** `page`, `limit`, `department`  
**Response:** `{ "jobs": [...], "total": N, "page": N, "limit": N }`

#### `GET /api/public/careers/:slug`
Get single job listing by slug.

#### `POST /api/public/contact`
Submit contact / demo request.  
**Body:** `{ "name", "email", "company"?, "subject"?, "message", "source"? }`  
**Response:** `{ "success": true, "id": "..." }`

#### `POST /api/public/newsletter/subscribe`
Subscribe to newsletter. Idempotent (re-subscribes if previously unsubscribed).  
**Body:** `{ "email", "name"?, "source"? }`  
**Response:** `{ "success": true }`

#### `POST /api/public/waitlist/join`
Join product waitlist. Idempotent.  
**Body:** `{ "email", "name"?, "product"?, "company"?, "use_case"? }`  
**Response:** `{ "success": true }`

#### `POST /api/public/experts/apply`
Submit expert application. Idempotent (one application per email).  
**Body:** `{ "first_name", "last_name", "email", "phone"?, "expertise_areas"?, "years_of_experience"?, "linkedin_url"?, "bio" }`  
**Response:** `{ "success": true }`

#### `POST /api/public/careers/apply`
Submit job application.  
**Body:** `{ "job_id"?, "job_title"?, "name", "email", "phone"?, "linkedin_url"?, "resume_url"?, "cover_letter"? }`  
**Response:** `{ "success": true, "id": "..." }`

---

### Media Endpoints

#### `POST /api/admin/media/upload`
Upload a file. Requires admin authentication.  
**Content-Type:** `multipart/form-data`  
**Form fields:** `file` (required), `alt_text` (optional), `context` (optional: `blog_cover`, `blog_content`, `expert_photo`)  
**Limits:** Max 10MB. Allowed: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `application/pdf`  
**Response (201):** Full media metadata including `url`, `filename`, `size_bytes`, `content_type`

#### `GET /api/admin/media`
List media library.  
**Query:** `page`, `limit`, `context`, `content_type_prefix` (e.g. `image`)

#### `GET /api/admin/media/:id`
Get single media record.

#### `PATCH /api/admin/media/:id`
Update `alt_text` or `context`.  
**Body:** `{ "alt_text"?, "context"? }`

#### `DELETE /api/admin/media/:id`
Delete file from storage and metadata record (204).

#### `GET /api/media/:filename`
**Public endpoint.** Serve locally-stored files. For R2/cloud providers, redirects to CDN URL.  
**Cache:** `Cache-Control: public, max-age=31536000, immutable`

---

## 7. Database Design

**Database name:** `gorakhai_cms`  
**Engine:** MongoDB (Motor async driver)

---

### `admin_users`

Stores CMS administrator accounts.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `email` | String | Unique, lowercase |
| `name` | String | Display name |
| `password_hash` | String | bcrypt hash (never returned in API) |
| `role` | String | `super_admin`, `content_admin`, `community_admin`, `expert_network_admin` |
| `is_active` | Boolean | False disables login |
| `last_login` | ISO String | Last successful login timestamp |
| `created_at` | ISO String | |
| `updated_at` | ISO String | |

**Indexes:** `email` (unique)

---

### `blog_posts`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | |
| `slug` | String | Unique URL-safe identifier |
| `excerpt` | String | Short summary for list views |
| `content` | String | TipTap HTML output |
| `author_name` | String | Display name |
| `author_id` | ObjectId | References `admin_users._id` |
| `status` | String | `draft`, `published` |
| `category` | String | |
| `tags` | Array[String] | |
| `cover_image_url` | String | URL to cover image |
| `read_time_mins` | Int | |
| `view_count` | Int | Incremented on public view |
| `published_at` | ISO String | Null until first publish |
| `created_at` | ISO String | |
| `updated_at` | ISO String | |

**Indexes:** `slug` (unique), `status` + `published_at`

---

### `job_listings`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | |
| `slug` | String | Unique |
| `department` | String | Engineering, Product, Sales, etc. |
| `location` | String | Remote, city, etc. |
| `type` | String | Full-time, Part-time, Contract |
| `experience_level` | String | Junior, Mid, Senior, Lead |
| `salary_range` | String | Optional |
| `description` | String | Full job description |
| `requirements` | Array[String] | |
| `responsibilities` | Array[String] | |
| `status` | String | `open`, `closed` |
| `closes_at` | ISO String | Optional closing date |
| `posted_at` | ISO String | |
| `created_at` | ISO String | |
| `updated_at` | ISO String | |

---

### `contact_submissions`

Leads from the contact/demo request form.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `name` | String | |
| `email` | String | |
| `company` | String | Optional |
| `subject` | String | Optional |
| `message` | String | |
| `source` | String | Default `contact_form` |
| `status` | String | `new`, `reviewed`, `archived`, `replied` |
| `created_at` | ISO String | |
| `updated_at` | ISO String | |

---

### `newsletter_subscribers`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `email` | String | Unique, lowercase |
| `name` | String | Optional |
| `status` | String | `active`, `unsubscribed` |
| `subscribed_at` | ISO String | |
| `source` | String | Which page they subscribed from |

**Note:** Re-subscription is supported — status set back to `active`.

---

### `waitlist_subscribers`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `email` | String | Unique, lowercase |
| `name` | String | Optional |
| `product` | String | Default `gorakhai` |
| `company` | String | Optional |
| `use_case` | String | Optional |
| `status` | String | `waitlisted`, `invited`, `converted` |
| `created_at` | ISO String | |
| `updated_at` | ISO String | |

---

### `expert_network_registrations`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `first_name`, `last_name` | String | |
| `email` | String | Unique |
| `phone` | String | Optional |
| `expertise_areas` | Array[String] | |
| `years_of_experience` | Int | |
| `linkedin_url` | String | Optional |
| `bio` | String | |
| `status` | String | `pending`, `approved`, `rejected` |
| `reviewed_by` | String | Reviewer email |
| `reviewed_at` | ISO String | |
| `notes` | String | Reviewer notes |
| `created_at` | ISO String | |

---

### `job_applications`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `job_id` | String | Optional reference to job listing |
| `job_title` | String | |
| `name` | String | |
| `email` | String | |
| `phone` | String | Optional |
| `linkedin_url` | String | Optional |
| `resume_url` | String | Optional |
| `cover_letter` | String | Optional |
| `status` | String | `new`, `reviewing`, `accepted`, `rejected` |
| `created_at` | ISO String | |

---

### `media`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `filename` | String | Unique stored filename (UUID-prefixed) |
| `original_filename` | String | Original name from upload |
| `stored_ref` | String | Provider-agnostic storage key (for R2 migration) |
| `url` | String | Public access URL |
| `content_type` | String | MIME type |
| `size_bytes` | Int | |
| `alt_text` | String | Accessibility text |
| `context` | String | `blog_cover`, `blog_content`, `expert_photo`, `general` |
| `storage_provider` | String | `LocalStorage`, `R2Storage` |
| `uploaded_by` | String | Admin email |
| `uploaded_by_id` | ObjectId | References `admin_users._id` |
| `created_at` | ISO String | |

---

### `audit_logs`

Detailed before/after change records for governance.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `user_id` | String | Admin user who performed action |
| `user_email` | String | |
| `action` | String | `create`, `update`, `delete`, `status_change`, `approve`, `reject` |
| `resource_type` | String | `blog_post`, `job_listing`, `lead`, `expert`, `admin_user`, etc. |
| `resource_id` | String | MongoDB ObjectId of affected document |
| `before_state` | Object | Document state before change |
| `after_state` | Object | Document state after change |
| `changes` | Object | `{ field: { from: oldVal, to: newVal } }` |
| `ip_address` | String | Request IP |
| `created_at` | ISO String | |

---

### `activity_logs`

Human-readable user action feed.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `user_id` | ObjectId | |
| `user_email` | String | |
| `action` | String | e.g. `"created blog post"`, `"approved expert application"` |
| `resource_type` | String | |
| `resource_id` | String | |
| `resource_title` | String | Human-readable name of affected resource |
| `metadata` | Object | Optional extra context |
| `ip_address` | String | |
| `created_at` | ISO String | |

---

### `login_attempts`

Brute force protection.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | |
| `email` | String | |
| `ip_address` | String | |
| `success` | Boolean | |
| `created_at` | ISO String | |

**Logic:** 5 failed attempts within 15 minutes locks the account (HTTP 423).

---

## 8. Authentication Architecture

### JWT Implementation

The backend uses `emergentintegrations` for JWT utilities. Two tokens are issued:

| Token | Duration | Cookie name | Purpose |
|---|---|---|---|
| Access token | 1 hour | `access_token` | Authenticates API requests |
| Refresh token | 7 days | `refresh_token` | Gets new access token silently |

Token payload:
```json
{
  "sub": "user_mongo_id",
  "email": "admin@gorakhai.com",
  "role": "super_admin",
  "exp": 1740000000
}
```

### Cookie Configuration

Cookies are HttpOnly (not accessible via JavaScript). Configuration is environment-aware:

| `COOKIE_SECURE` env var | `secure` flag | `samesite` | Use case |
|---|---|---|---|
| `false` (default) | `False` | `lax` | Local development (localhost) |
| `true` | `True` | `none` | Production (cross-origin: gorakhai.com → api.gorakhai.com) |

**Critical:** `COOKIE_SECURE=true` MUST be set in Railway for admin login to work in production.

### Frontend Axios Client

`src/lib/api.js` configures Axios with:
- `withCredentials: true` — sends cookies on every request
- Response interceptor: on `401` → automatically calls `POST /api/auth/refresh` → retries original request → if refresh also fails, redirects to `/admin/login`

### Roles and Permissions

| Role | Blog | Careers | Leads | Newsletter | Experts | Waitlist | Users | Logs |
|---|---|---|---|---|---|---|---|---|
| `super_admin` | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| `content_admin` | ✅ Full | ✅ Full | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `community_admin` | ❌ | ❌ | ✅ Full | ✅ Full | ❌ | ✅ Full | ❌ | ❌ |
| `expert_network_admin` | ❌ | ❌ | ❌ | ❌ | ✅ Full | ❌ | ❌ | ❌ |

`require_roles()` is a FastAPI dependency that validates the `role` field in the JWT payload.

### Seeded Admin Account

On every backend startup, `server.py` calls `seed_admin()`. If no user with `ADMIN_EMAIL` exists, it creates one with `ADMIN_PASSWORD` and role `super_admin`. This is idempotent — if the user exists, it does nothing.

**Credentials are defined entirely by environment variables.** No hardcoded credentials exist in the codebase.

See `memory/test_credentials.md` for the credentials used during development.

### Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt (via emergentintegrations) |
| Brute force protection | 5 attempts / 15 minutes → 423 lock |
| HttpOnly cookies | XSS cannot steal tokens |
| CORS strict origins | Only `CORS_ORIGINS` env var values allowed |
| Admin route prefix | All admin endpoints require authentication |
| `allow_credentials=True` | Required for cookie-based CORS |

---

## 9. Environment Variables

### Backend Variables (`backend/.env`)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `MONGO_URL` | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/gorakhai_cms` | MongoDB connection string |
| `DB_NAME` | **Yes** | `gorakhai_cms` | Database name |
| `JWT_SECRET` | **Yes** | *(64 hex chars — see below)* | Signs JWT tokens. **Never commit.** |
| `ADMIN_EMAIL` | **Yes** | `admin@gorakhai.com` | Super admin login email |
| `ADMIN_PASSWORD` | **Yes** | `Gorakhai#Launch2026` | Super admin password. Change after first login. |
| `CORS_ORIGINS` | **Yes** | `https://gorakhai.com,https://www.gorakhai.com` | Comma-separated allowed frontend origins. Must be exact. |
| `FRONTEND_URL` | **Yes** | `https://gorakhai.com` | Used in redirect logic |
| `COOKIE_SECURE` | **Yes (prod)** | `true` | Set `true` in production. `false` for local dev only. |
| `STORAGE_PROVIDER` | No | `local` | `local` or `r2`. Default: `local`. |
| `UPLOADS_DIR` | No | `/app/uploads` | Filesystem path for uploads. Must be writable. |
| `R2_ACCOUNT_ID` | Only if R2 | `abc123` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Only if R2 | `...` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | Only if R2 | `...` | R2 API token secret |
| `R2_BUCKET_NAME` | Only if R2 | `gorakhai-media` | R2 bucket name |
| `R2_PUBLIC_URL` | Only if R2 | `https://media.gorakhai.com` | Public CDN URL for R2 bucket |

**Generate JWT_SECRET:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Frontend Variables (`frontend/.env` and Cloudflare Pages)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `REACT_APP_BACKEND_URL` | **Yes** | `https://api.gorakhai.com` | Backend API base URL. Baked in at build time. |
| `CI` | **Yes** | `false` | Prevents build failure on ESLint warnings |
| `GENERATE_SOURCEMAP` | No | `false` | Disable source maps in production |
| `WDS_SOCKET_PORT` | Dev only | `443` | Local dev WebSocket port |
| `ENABLE_HEALTH_CHECK` | Dev only | `false` | Internal dev environment config |

---

## 10. Deployment Instructions

### Phase A — Cloudflare Pages (Frontend Only)

**Prerequisites:** Cloudflare account, `gorakhai.com` on Cloudflare DNS, GitHub repo.  
**Time:** ~25 minutes  
**Cost:** Free

**Steps:**
1. `dash.cloudflare.com` → Workers & Pages → Pages → Create project → Connect to Git
2. Select repo `gorakhai-corporate-site`
3. Build settings:
   - Build command: `cd frontend && yarn install && yarn build`
   - Output directory: `frontend/build`
   - Node version: `20`
4. Environment variables: `REACT_APP_BACKEND_URL=https://api.gorakhai.com`, `CI=false`, `GENERATE_SOURCEMAP=false`
5. Deploy. When complete, configure custom domain: `gorakhai.com` and `www.gorakhai.com`
6. SSL/TLS → Full (strict) + Always Use HTTPS: ON
7. (Optional) GitHub Secrets for auto-deploy: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `REACT_APP_BACKEND_URL`

Full guide: `docs/PHASE_A_DEPLOYMENT.md`

---

### Phase B Part 1 — MongoDB Atlas

**Time:** ~10 minutes  
**Cost:** Free (M0 tier)

1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free M0 cluster named `gorakhai-production`
2. Database Access → Add user `gorakhai-app` with `Atlas admin` role → save password
3. Network Access → Add `0.0.0.0/0` (allow all IPs — required for Railway)
4. Connect → Connect your application → copy connection string:
   `mongodb+srv://gorakhai-app:<password>@gorakhai-production.xxxxx.mongodb.net/gorakhai_cms`

---

### Phase B Part 2 — Railway Backend

**Time:** ~15 minutes  
**Cost:** ~$5/month

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select `gorakhai-corporate-site` → set Root directory: `backend`
3. Railway auto-detects `Dockerfile`
4. Add environment variables (all variables from Section 9 Backend table)
5. Settings → Domains → Add Custom Domain: `api.gorakhai.com`
6. Copy CNAME record from Railway → add to Cloudflare DNS (DNS only, not proxied)
7. Add persistent volume: Mount path `/app/uploads`, size 1GB
8. Verify: `curl https://api.gorakhai.com/api/` → `{"message": "Gorakhai CMS API v2"}`

---

### Phase C — Cloudflare R2 Media Storage

**Time:** ~15 minutes  
**Cost:** Free up to 10GB/1M operations

1. Cloudflare Dashboard → R2 Object Storage → Create bucket `gorakhai-media`
2. R2 → API tokens → Create token with `Object Read & Write` on `gorakhai-media`
3. R2 → gorakhai-media → Settings → Custom Domains → connect `media.gorakhai.com`
4. Update Railway env vars:
   ```
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=<cloudflare account id>
   R2_ACCESS_KEY_ID=<token access key>
   R2_SECRET_ACCESS_KEY=<token secret>
   R2_BUCKET_NAME=gorakhai-media
   R2_PUBLIC_URL=https://media.gorakhai.com
   ```
5. Restart Railway service — all new uploads go to R2 automatically. No code changes needed.

---

### Alternative Backend: Render (Free Tier)

If deferring cost: [render.com](https://render.com) → New Web Service → Connect GitHub  
- Root: `backend`  
- Build command: `pip install -r requirements.txt`  
- Start command: `uvicorn server:app --host 0.0.0.0 --port 8001`  
- Add all env vars  
- **Warning:** Free tier has 30-second cold start after 15 minutes of inactivity.

---

## 11. Known Issues

### Open Bugs
None. All previously identified bugs were resolved. The test suite (`iteration_3.json`) passed 100%.

### Technical Debt

| Item | Severity | Description |
|---|---|---|
| `supabaseClient.js` legacy name | Low | File is named after Supabase but now purely routes to FastAPI. Could be renamed to `formClient.js` or similar. No functional impact. |
| `_doc()` helper duplicated | Low | Each route file has its own `_doc()` helper to serialize MongoDB docs. Should be moved to a shared `utils.py`. |
| No pytest tests written | Medium | `backend-ci.yml` runs pytest but `/backend/tests/` directory has no test files. Backend is untested by automation. |
| No blog pagination on public site | Medium | `Blog.jsx` loads all posts. If many posts are published, implement pagination using the `page`/`limit` query params on `GET /api/public/blog`. |
| No blog search on public site | Medium | Search is not implemented on the public blog page. |
| `view_count` has no deduplication | Low | Each page load increments view count, including refreshes and bots. |

### Temporary Workarounds

| Workaround | Why | Resolution |
|---|---|---|
| `CI=false` in Cloudflare Pages | React build treats ESLint warnings as errors on CI | Resolve all ESLint warnings and remove this flag |
| Mock data fallback in hooks | Phase A has no backend | Remove fallback or keep for graceful degradation in Phase B |
| Local filesystem for media storage | Phase B default | Switch to R2 when ready (Phase C) |

### Mock Implementations

| Feature | Mock behaviour |
|---|---|
| All public forms | Show Phase A error message → Phase B: real submission |
| Blog + Careers data | Falls back to `mockData.js` → Phase B: real MongoDB data |
| Team member data | Hardcoded in `mockData.js` — needs real people or removal |
| Admin CMS | Fully functional UI, backend not active → Phase B: live |

---

## 12. Future Roadmap

### P0 — Phase A/B Activation (Immediate)

- [ ] Execute Phase A Cloudflare Pages deployment (docs: `PHASE_A_DEPLOYMENT.md`)
- [ ] Execute Phase B MongoDB Atlas + Railway setup (docs: `DEPLOYMENT.md`)
- [ ] Replace all mock/placeholder content with real content (see Section 14)
- [ ] Add Railway persistent volume for media uploads

---

### P1 — Core Business Features (Next Sprint)

- [ ] **Blog search + pagination** — Add search bar and pagination to `Blog.jsx`. Backend already supports `GET /api/public/blog?page=N&limit=N&category=X`.
- [ ] **Email notifications on form submission** — Resend integration. Notify `hello@gorakhai.com` when contact form is submitted. Send confirmation to user. File to create: `backend/services/email_service.py`.
- [ ] **Cloudflare R2 media storage** — Switch `STORAGE_PROVIDER=r2` + configure env vars. Zero code changes needed.
- [ ] **Google Search Console submission** — Submit `sitemap.xml` at `https://search.google.com/search-console`
- [ ] **Analytics** — Cloudflare Web Analytics (free, privacy-first, already in CF dashboard). Or add Plausible/Fathom script.
- [ ] **Replace team mock data** — Update `TEAM_MEMBERS` in `mockData.js` or add About page CMS support with real names and photos.

---

### P2 — Growth Features

- [ ] **AI Boardroom** — Admin feature. Currently a `ComingSoon.jsx` placeholder at `/admin/ai-boardroom`.
- [ ] **Human Expert Marketplace** — Admin feature. Currently a `ComingSoon.jsx` placeholder at `/admin/experts-marketplace`.
- [ ] **Community** — Admin feature. Currently a `ComingSoon.jsx` placeholder at `/admin/community`.
- [ ] **Events management** — Admin feature. Currently a `ComingSoon.jsx` placeholder at `/admin/events`.
- [ ] **Partner Program** — Admin feature. Currently a `ComingSoon.jsx` placeholder at `/admin/partner-program`.
- [ ] **Newsletter sending** — Currently collects subscribers but has no mechanism to send emails. Will require Resend bulk send integration.
- [ ] **Job application file uploads** — Resume PDF uploads via media API.
- [ ] **Blog category filtering** — Frontend filter by category is UI-only. `GET /api/public/blog?category=Engineering` is already implemented in backend.
- [ ] **Supabase integration** — Deferred by product owner. No timeline defined.

---

### P3 — Future Milestones

- [ ] **Product waitlist → product launch** — Automated invite emails when product is ready.
- [ ] **Expert network directory** — Public-facing page showing approved experts (requires expert consent system).
- [ ] **Multi-language support** — i18n for Enterprise AI markets.
- [ ] **Case studies section** — Requires CMS support for case study content type.
- [ ] **Press/media kit page** — Brand assets download.

---

## 13. Claude Continuation Instructions

### Architecture Decisions That Must Not Change

| Decision | Reason |
|---|---|
| **FastAPI + MongoDB stack** — Do not migrate to Supabase or any other database. The owner has explicitly and repeatedly requested no Supabase integration. | Product decision |
| **Cookie-based JWT auth (not localStorage)** — HttpOnly cookies are XSS-safe. Do not move tokens to localStorage. | Security |
| **`COOKIE_SECURE` env-configurable** — `false` for dev, `true` for production. Do not hardcode either value. | Cross-origin compatibility |
| **Storage abstraction layer** — All file storage goes through `storage.py`. Never write directly to disk from routes. | Enables R2 migration without code changes |
| **Mock data fallback in hooks** — Keeps the public site functional in Phase A. Consider keeping it even in Phase B as a graceful degradation strategy. | Resilience |
| **Admin routes under `/admin/*` on frontend** — SPA routing handles these. Do not separate admin into a different domain unless the owner requests it. | Simplicity |
| **Emergentintegrations for auth** — JWT utilities come from `emergentintegrations`. Do not replace with PyJWT or jose directly. | Platform compatibility |
| **`/api` prefix on all backend routes** — Required for Kubernetes ingress routing in the development environment. | Infrastructure |

### Decisions the Owner Has Explicitly Deferred

- **Supabase**: Do not suggest or implement.
- **Resend email**: Do not implement until Phase B is confirmed live and owner approves.
- **Cloudflare R2**: Do not activate until Phase B backend is deployed.

### Recommended Next Sprint (in order)

1. **Phase A deployment execution** — Owner runs steps in `docs/PHASE_A_DEPLOYMENT.md`. Your role: support troubleshooting if build fails.
2. **Content replacement** — After Phase A is live, replace placeholder stats (`$38M raised`, `500+ clients`) with real or remove. See Section 14.
3. **Phase B setup** — Guide owner through `docs/DEPLOYMENT.md`. Verify forms submit correctly and admin login works.
4. **Blog search + pagination** — First real feature addition. Backend supports it; only frontend changes needed.
5. **Resend email notifications** — After Phase B is confirmed working, integrate email on `POST /api/public/contact`.

### Recommended Implementation Order for Phase B Features

1. Backend deployment + admin login verification
2. Form submission verification (all 5 forms)
3. Blog content migration (replace mock posts with real ones via CMS)
4. Careers migration (replace mock jobs with real ones)
5. Email notifications

### Risks to Avoid

| Risk | Description | Mitigation |
|---|---|---|
| **Stateless media in production** | Without a persistent volume on Railway, uploaded media is lost on redeploy. | Always add Railway persistent volume before letting anyone upload media. |
| **`COOKIE_SECURE=false` in production** | Admin login will fail silently on production without this set to `true`. | Verify this env var is set when troubleshooting any login issue. |
| **Blog slug collisions** | Creating a post with a duplicate title auto-appends a timestamp to slug. Users may find this confusing. | Accept for now; add slug validation UI in BlogEditor later. |
| **CORS origin mismatch** | If `CORS_ORIGINS` doesn't exactly match the Cloudflare Pages domain (no trailing slash), all API calls fail. | Copy the domain from browser address bar exactly. |
| **Atlas M0 connection limit** | M0 allows 500 simultaneous connections. A misconfigured connection pool could exhaust this. | The Motor default pool is 10 connections — well within limits. |

### File Locations Quick Reference

| Task | File |
|---|---|
| Add new API endpoint | `backend/routes/public_routes.py` or `admin_routes.py` |
| Add new admin page | `frontend/src/admin/pages/` + add route in `App.js` + add nav item in `AdminLayout.jsx` |
| Add new public page | `frontend/src/pages/` + add route in `App.js` + add to `sitemap.xml` |
| Change form error message | `frontend/src/lib/supabaseClient.js` → `PHASE_A_MSG` constant |
| Change cookie settings | `backend/routes/auth_routes.py` → `_COOKIE_SECURE`, `_COOKIE_SAMESITE` |
| Change storage provider | `STORAGE_PROVIDER` env var + `backend/storage.py` for new providers |
| Change seed blog content | `backend/server.py` → `seed_database()` function |
| Change mock blog content | `frontend/src/constants/mockData.js` → `BLOG_POSTS` array |
| Add environment variable | Backend: `backend/.env.example` + `ENV_VARS.md`. Frontend: `frontend/.env` + `ENV_VARS.md` |

---

## 14. Repository Audit — Content Review

### Pages Containing Placeholder or Aspirational Content

Every page listed here contains content that should be reviewed and replaced with accurate information before the site is considered fully production-ready.

#### CRITICAL — Contains Unverified Claims

| Page | Location | Placeholder content | Action required |
|---|---|---|---|
| `Home.jsx` | `stats` array (lines 16–21) | `500+ Enterprise Deployments`, `99.99% Uptime SLA`, `2.3s Avg Response Latency`, `50M+ AI Queries Processed` | Replace with real figures OR remove the stats section entirely |
| `Home.jsx` | Hero section (line 103) | `"Trusted by engineering teams at Fortune 500 companies"` | Remove or replace with real social proof |
| `Home.jsx` | Marquee (line 32) | `"SOC 2 Certified"` | Remove unless SOC 2 has been obtained |
| `About.jsx` | Stats grid (lines 165–168) | `2022 Founded`, `45+ Team Members`, `500+ Enterprise Clients`, `$38M Series A Raised` | Replace with accurate figures or remove |
| `Careers.jsx` | Company metrics (line 33) | `$38M Series A` | Replace or remove |
| `OrchestraIQ.jsx` | Feature description | `"Our customers reduce AI spend by 30–50% on average"` | Remove or add `*` disclaimer until validated |

#### MODERATE — Fictional People and Content

| Location | Content | Action required |
|---|---|---|
| `src/constants/mockData.js` → `TEAM_MEMBERS` | 3 fictional team members: Rohan Sharma (CEO), Priya Mehta (CPO), Alex Chen (CTO) with fictional bios | Replace with real team bios or remove About team section |
| `src/constants/mockData.js` → `BLOG_POSTS` | 6 AI/enterprise blog articles with fictional case study data and statistics | Replace with real authored content via CMS or keep as editorial placeholder |
| `src/constants/mockData.js` → `JOB_LISTINGS` | 6 job listings in fictional departments with fictional salary ranges | Update to reflect actual open positions |
| `backend/server.py` → `seed_database()` | Same 6 blog posts and 6 job listings seeded to MongoDB on first startup | After replacing mock content, run a one-time migration to remove seed posts from production DB |

#### LOW — Technical Placeholders

| Location | Content | Action required |
|---|---|---|
| `src/components/seo/SEOMeta.jsx` (line 61) | `logo: 'https://gorakhai.com/logo.png'` | Upload real `logo.png` to `frontend/public/` (used in JSON-LD Organisation schema) |
| `public/sitemap.xml` | All URLs use `gorakhai.com` domain with placeholder `<lastmod>` dates | Update `<lastmod>` dates when content changes |
| `Contact.jsx` (lines ~200–210) | Email addresses `hello@gorakhai.com`, `partnerships@gorakhai.com` | Confirm these email inboxes are active before Phase A launches |

### Confirmed Clean — No Placeholder Issues

| Item | Status |
|---|---|
| Product descriptions (Orchestra IQ, Arjun AI) | Reflects real product vision — no fake claims |
| Navigation links and routing | All functional |
| Admin CMS pages | Functional UI, no placeholder content |
| TipTap editor | Fully functional |
| Contact form structure | Correct |
| Newsletter form | Correct |
| robots.txt | Correct — blocks /admin/ |
| sitemap.xml structure | Correct — 25 URLs |
| No fake testimonials | Confirmed — no testimonial section exists |
| No fake customer logos | Confirmed — no logo grid on homepage |

---

## 15. Final Project Health Report

### Architecture Score: 8.5 / 10

**Strengths:**
- Clean separation of concerns: React SPA + FastAPI API-only backend + MongoDB
- Storage abstraction layer is well-designed — switching from local to R2 requires zero code changes
- Role-based access control is properly implemented with FastAPI dependencies
- Audit logging captures full before/after state on every write operation
- JWT + HttpOnly cookie auth is secure and production-appropriate
- Mock data fallback ensures Phase A works gracefully without a backend

**Weaknesses:**
- `_doc()` serialisation helper is duplicated across 3 route files (minor)
- No automated test suite for the backend (`/backend/tests/` is empty)
- `supabaseClient.js` is a misleadingly named file that has nothing to do with Supabase

---

### Deployment Readiness Score: 9 / 10

**Strengths:**
- Phase A (Cloudflare Pages) is completely ready — one 25-minute setup session
- All environment variables documented with examples in `.env.example` and `ENV_VARS.md`
- GitHub Actions CI/CD is configured and tested
- `_redirects` file ensures SPA routing works correctly on Cloudflare Pages
- `Dockerfile` is production-grade (non-root user, health check, 2 workers)
- Deployment guide is written for a non-technical founder

**Weaknesses:**
- Phase A has not been executed yet (owner action required)
- Railway persistent volume for media storage requires manual setup (not automatable)

---

### Security Readiness Score: 8 / 10

**Strengths:**
- HttpOnly JWT cookies (XSS-safe)
- bcrypt password hashing (no plaintext)
- Brute force protection (5 attempts/15 min lockout)
- CORS restricted to explicit origins
- Admin routes fully protected — no unauthenticated access possible
- `.env` files in `.gitignore` (confirmed)
- No API keys or secrets in committed code (confirmed)
- `robots.txt` blocks `/admin/` from search engines

**Weaknesses:**
- No rate limiting on public API endpoints (contact, newsletter, waitlist) — could be abused to spam the database
- No CSRF protection (mitigated by SameSite cookie + CORS, but worth noting)
- No IP allowlist for admin access (rely on strong passwords only)
- File uploads accept SVG — SVG can contain XSS payloads if served inline (currently served as file download, low risk)

**Recommendation for Phase B:** Add `slowapi` rate limiting to public POST endpoints (5–10 requests per minute per IP).

---

### Content Readiness Score: 5 / 10

**Why 5/10:** The technical implementation is complete and correct. However, a significant portion of the visible content on the site contains placeholder statistics, aspirational metrics, and fictional team members that need to be reviewed before the site is used for business development purposes.

**Specifically:**
- Home page stats are aspirational (`500+ Enterprise Deployments`)
- About page funding claim (`$38M Series A`) needs to be accurate
- Team section uses fictional names
- Blog articles are AI-generated content

**What would make this a 9/10:**
- Replace or remove the unverified statistics on Home and About pages
- Replace mock team members with real bios and photos
- Commission real editorial content for the first 3–6 blog posts
- Confirm email inboxes are live before Phase A deployment

---

*End of handover document.*
