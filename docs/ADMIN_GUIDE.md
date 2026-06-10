# Admin CMS Guide — Gorakhai Corporate Site

## Overview

The Admin CMS is accessible at `/admin` and requires authentication via Supabase Auth.

It provides management interfaces for:
- Blog posts and categories
- Job listings management
- Contact submission review
- Lead management
- Newsletter subscriber management
- Expert Network application review

---

## Access

**URL**: `https://gorakhai.com/admin`
**Login**: Email + password via Supabase Auth

### Creating Admin Users

1. Go to your Supabase dashboard → **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter admin email + strong password
4. The user can now log in at `/admin/login`

> Admin users are authenticated via Supabase Auth. No additional role setup required — all authenticated users have full admin access via RLS policies.

---

## Blog Management (`/admin/blog`)

### Creating a Blog Post
1. Click **New Post**
2. Fill in: Title, Slug (auto-generated), Excerpt, Category, Tags
3. Write content using the rich text editor
4. Set Cover Image URL (upload to Supabase Storage → blog-images bucket)
5. Configure SEO: Title, Description, OG Image
6. Set status to **Published** and add **Published At** date
7. Click **Save**

### Blog Post Fields
| Field | Required | Notes |
|-------|----------|-------|
| Title | Yes | Main article headline |
| Slug | Yes | URL-safe identifier (auto-generated) |
| Excerpt | No | Short description for blog cards |
| Content | No | HTML content |
| Cover Image URL | No | Full URL from Supabase Storage |
| Category | No | Select from categories |
| Tags | No | Comma-separated |
| Status | Yes | draft / published / archived |
| Featured | No | Show as featured on blog index |
| Published At | Yes (for publishing) | Must be set to show publicly |
| SEO Title | No | Overrides title for search engines |
| SEO Description | No | Meta description (150-160 chars) |
| Read Time | No | Estimated read time in minutes |

---

## Careers Management (`/admin/careers`)

### Creating a Job Listing
1. Click **New Job**
2. Fill in all required fields
3. Set status to **Open** to show on careers page
4. Click **Save**

### Job Listing Fields
| Field | Required | Notes |
|-------|----------|-------|
| Title | Yes | Job title |
| Slug | Yes | URL-safe (auto-generated) |
| Department | Yes | Engineering / Product / Sales / Design / Operations |
| Location | Yes | City or "Remote" |
| Type | Yes | full-time / part-time / contract / remote |
| Experience Level | No | junior / mid / senior / lead / director |
| Description | No | Role overview |
| Requirements | No | One per line |
| Responsibilities | No | One per line |
| Salary Range | No | e.g., "$180,000 — $240,000" |
| Status | Yes | draft / open / paused / closed |

---

## Lead Management (`/admin/leads`)

View-only dashboard for contact submissions and lead captures.

**Statuses:**
- `new` — Not yet reviewed
- `contacted` — First contact made
- `qualified` — Qualified as a real lead
- `demo_scheduled` — Demo scheduled
- `converted` — Became a customer
- `lost` — Did not convert

Update status and add notes directly in the admin dashboard.

---

## Newsletter Management (`/admin/newsletter`)

- View all subscribers with subscription date and source page
- Filter by status (active / unsubscribed / bounced)
- Export subscriber list as CSV

**Subscriber Statuses:**
- `active` — Receiving emails
- `unsubscribed` — Opted out
- `bounced` — Email bounced
- `complained` — Marked as spam

---

## Expert Network Review (`/admin/experts`)

Review and approve Expert Network applications.

**Application Statuses:**
- `pending` — Awaiting review
- `approved` — Accepted into the network
- `rejected` — Application declined
- `active` — Active network member
- `inactive` — No longer active

---

## Security Notes

1. **Service Role Key**: The admin CMS uses the Supabase service role key for admin operations. This key bypasses RLS policies. Never expose it in frontend JavaScript that's accessible to public users.

2. **Admin Route Protection**: All `/admin/*` routes check for a valid Supabase Auth session. Unauthenticated users are redirected to `/admin/login`.

3. **Audit Trail**: All admin actions (creating/updating/deleting records) are logged with the admin user's email and timestamp.
