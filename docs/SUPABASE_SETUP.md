# Supabase Setup Guide — Gorakhai Corporate Site

## Project: `gorakhai-corporate` (Dedicated Supabase Project)

> This Supabase project is completely independent from Orchestra IQ and Orchestra IQ Admin.

---

## Prerequisites
- Supabase account at [supabase.com](https://supabase.com)
- Access to the `gorakhai-corporate-site` GitHub repository

---

## Step 1: Create the Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Set the following:
   - **Organization**: Select your org
   - **Name**: `gorakhai-corporate`
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users (recommend `us-east-1` or `eu-west-1`)
4. Click **Create new project** — takes ~2 minutes to provision

---

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:

```
Project URL:      https://<your-project-ref>.supabase.co
anon public key:  eyJ...    (safe for frontend use)
service_role key: eyJ...    (NEVER expose to frontend — backend/admin only)
```

3. Add to your `.env.local` file (copy from `.env.example`):

```bash
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...your-anon-key...

# Admin CMS only — never commit this to git
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role...
```

---

## Step 3: Run Database Migrations

Run migrations in order in the **Supabase SQL Editor** (Dashboard → SQL Editor → New Query):

### Migration 1: Initial Schema
Copy and paste contents of `supabase/migrations/001_initial_schema.sql`

This creates:
- `blog_categories` — Blog post categories
- `blog_posts` — Blog articles
- `contact_submissions` — Contact form data
- `newsletter_subscribers` — Newsletter list
- `lead_captures` — Product leads
- `job_listings` — Open positions
- `job_applications` — Job applications
- `expert_network_registrations` — Expert applications
- `waitlist_subscribers` — Product waitlist

### Migration 2: Row Level Security
Copy and paste contents of `supabase/migrations/002_rls_policies.sql`

This configures:
- Public can read published blog posts and open jobs
- Public can INSERT into all form submission tables
- Authenticated admin users have full CRUD access

### Migration 3: Seed Data (Development Only)
For development testing, copy and paste `supabase/seed/seed_data.sql`
> ⚠️ Do NOT run seed data in production — it inserts test records

---

## Step 4: Create Admin User

The Admin CMS requires a Supabase Auth user.

**Option A — Via Dashboard:**
1. Go to **Authentication → Users**
2. Click **Add user** → **Create new user**
3. Enter: `admin@gorakhai.com` + strong password
4. The user can now log in at `/admin/login`

**Option B — Via Supabase CLI:**
```bash
supabase auth admin create-user \
  --email admin@gorakhai.com \
  --password <STRONG_PASSWORD> \
  --email-confirm
```

---

## Step 5: Configure Storage Buckets

For blog cover images and resume uploads:

1. Go to **Storage → New bucket**
2. Create these buckets:

| Bucket Name     | Public | Purpose                     |
|-----------------|--------|-----------------------------|
| `blog-images`   | Yes    | Blog post cover images      |
| `team-avatars`  | Yes    | Team member profile photos  |
| `resumes`       | No     | Job application resumes     |

**Storage Policies for `blog-images` and `team-avatars`:**
```sql
-- Allow public reads
CREATE POLICY "Public can read blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated uploads
CREATE POLICY "Admin can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');
```

---

## Step 6: Environment Variables Reference

### Frontend (Cloudflare Pages / Local Dev)

```bash
# Required
REACT_APP_SUPABASE_URL=https://<ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...

# Optional (Admin CMS — add as Cloudflare Pages env var, restricted access)
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Cloudflare Pages Environment Variables
Add in: **Cloudflare Pages → Your Project → Settings → Environment Variables**

| Variable | Environment | Value |
|----------|-------------|-------|
| `REACT_APP_SUPABASE_URL` | Production + Preview | Your Supabase URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Production + Preview | Your anon key |
| `REACT_APP_SUPABASE_SERVICE_ROLE_KEY` | Production only | Your service role key |

---

## Step 7: Verify Setup

Run this query in Supabase SQL Editor to verify tables exist:
```sql
SELECT table_name, row_security 
FROM information_schema.tables 
LEFT JOIN pg_tables ON pg_tables.tablename = tables.table_name
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- `blog_categories`
- `blog_posts`
- `contact_submissions`
- `expert_network_registrations`
- `job_applications`
- `job_listings`
- `lead_captures`
- `newsletter_subscribers`
- `waitlist_subscribers`

---

## Troubleshooting

**Problem**: Forms not submitting in production
- Check: Supabase URL and anon key are set in Cloudflare Pages env vars
- Check: RLS policies allow public INSERT (`002_rls_policies.sql` was run)

**Problem**: Admin login not working
- Verify user was created in Supabase Auth → Users
- Check: `REACT_APP_SUPABASE_SERVICE_ROLE_KEY` is set for admin routes

**Problem**: Blog posts not showing
- Verify posts have `status = 'published'` AND `published_at <= now()`
- RLS policy only shows published posts with valid `published_at`

---

## Database Schema Reference

See `supabase/migrations/001_initial_schema.sql` for the complete schema with all column definitions, constraints, and indexes.
