# Phase A Deployment Guide — GorakhAI Corporate Site
## Cloudflare Pages Frontend Only

**Date prepared:** Feb 2026  
**Scope:** Frontend deployment to Cloudflare Pages. No backend, no database, no R2.

---

## Pre-flight Checklist (Complete Before Starting)

- [ ] You have a [Cloudflare account](https://cloudflare.com) with `gorakhai.com` domain active
- [ ] `gorakhai.com` DNS is managed through Cloudflare (name servers point to Cloudflare)
- [ ] You have a [GitHub account](https://github.com) with the `gorakhai-corporate-site` repository pushed
- [ ] `main` branch contains latest code (this deployment)
- [ ] You have Cloudflare Dashboard access

---

## Step 1 — Create Cloudflare Pages Project (10 min)

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages** in the left sidebar
3. Click **Pages** tab → **Create a project**
4. Click **Connect to Git**
5. Authorise Cloudflare to access your GitHub account
6. Select repository: `gorakhai-corporate-site`
7. Click **Begin setup**

---

## Step 2 — Configure Build Settings (2 min)

Enter these **exact** values — do not change them:

| Setting | Value |
|---|---|
| Project name | `gorakhai-corporate` |
| Production branch | `main` |
| Framework preset | Create React App |
| Build command | `cd frontend && yarn install && yarn build` |
| Build output directory | `frontend/build` |
| Root directory | *(leave completely blank)* |

---

## Step 3 — Add Environment Variables (2 min)

Still on the setup screen, scroll down to **Environment variables (optional)** and add:

| Variable name | Value | Environment |
|---|---|---|
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` | Production |
| `CI` | `false` | Production |
| `GENERATE_SOURCEMAP` | `false` | Production |

> **Why set `REACT_APP_BACKEND_URL` if there is no backend yet?**  
> Setting it now means Phase B (backend activation) requires no redeploy — just start the backend server and it connects automatically. It also ensures forms fail with a clear message rather than silently.

Click **Save and Deploy**.

---

## Step 4 — Wait for First Build (3–5 min)

The build pipeline runs:
```
yarn install → yarn build → deploy to *.pages.dev
```

Watch progress at **Workers & Pages → gorakhai-corporate → Deployments**.

When it shows a green checkmark, your site is live at a temporary URL like:
```
https://gorakhai-corporate.pages.dev
```

---

## Step 5 — Connect gorakhai.com Domain (5 min)

1. In your Cloudflare Pages project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `gorakhai.com` → Continue
4. Cloudflare will automatically add the DNS record. Click **Activate domain**.
5. Repeat for `www.gorakhai.com`:
   - Click **Set up a custom domain** again
   - Enter: `www.gorakhai.com` → Continue
   - When prompted, set as redirect to `https://gorakhai.com`

SSL certificates are **auto-provisioned by Cloudflare**. No action required.

---

## Step 6 — Force HTTPS (2 min)

1. In Cloudflare Dashboard → select the `gorakhai.com` zone (your domain)
2. **SSL/TLS → Overview** → Set to **Full (strict)**
3. **SSL/TLS → Edge Certificates** → **Always Use HTTPS**: toggle ON
4. **SSL/TLS → Edge Certificates** → **Minimum TLS Version**: TLS 1.2

---

## Step 7 — Enable GitHub Actions CI/CD (Optional but Recommended — 5 min)

This enables automatic deploys on every push to `main`. Skip for now if preferred — manual deploys via the Cloudflare Pages UI always work.

**Create Cloudflare API Token:**
1. Cloudflare → **My Profile** (top right) → **API Tokens**
2. Click **Create Token**
3. Use template: **Edit Cloudflare Pages**
4. Permissions: `Cloudflare Pages: Edit`
5. Click **Continue → Create Token**
6. **Copy the token immediately** (shown only once)

**Add GitHub Secrets:**
Go to: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | *(token from above)* |
| `CLOUDFLARE_ACCOUNT_ID` | *(Cloudflare Dashboard → right sidebar → Account ID)* |
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` |

Once added, every push to `main` triggers an automatic deploy.

---

## Phase A Verification Checklist

After deployment, verify each item below.

### Public Pages

| URL | What to check | Expected |
|---|---|---|
| `https://gorakhai.com/` | Homepage loads | Full page with hero, products, blog strip, newsletter form |
| `https://gorakhai.com/about` | About page | Company story, team section |
| `https://gorakhai.com/products` | Products overview | Orchestra IQ + Arjun AI cards |
| `https://gorakhai.com/products/orchestra-iq` | Orchestra IQ detail | Full product page |
| `https://gorakhai.com/products/arjun-ai` | Arjun AI detail | Full product page |
| `https://gorakhai.com/blog` | Blog list | 6 articles from mock data |
| `https://gorakhai.com/blog/orchestra-iq-reduced-ai-costs-fortune-500` | Individual post | Full article content |
| `https://gorakhai.com/blog/arjun-ai-context-window-architecture` | Individual post | Full article content |
| `https://gorakhai.com/careers` | Careers list | 6 job listings from mock data |
| `https://gorakhai.com/careers/senior-software-engineer-platform` | Career detail + apply | Full job description |
| `https://gorakhai.com/contact` | Contact form | Form renders, email addresses visible |
| `https://gorakhai.com/expert-network` | Expert page | Registration form visible |
| `https://gorakhai.com/waitlist` | Waitlist page | Signup form visible |

### Navigation

| Action | Expected |
|---|---|
| Click logo | Returns to homepage |
| Click all header nav links | Each page loads without 404 |
| Refresh any page (e.g. `/blog`) | Page loads — does NOT 404 (confirmed by `_redirects`) |
| Visit unknown URL (e.g. `/doesnotexist`) | Shows 404 or redirects — not blank screen |

### Form Behaviour (Phase A — No Backend Active)

| Form | Action | Expected in Phase A |
|---|---|---|
| Contact / Request a Demo | Fill in and submit | Shows error: *"Our submission system is being activated. Please email hello@gorakhai.com..."* |
| Newsletter (homepage + blog) | Enter email + submit | Shows error: *"Our submission system is being activated..."* |
| Waitlist signup | Fill in and submit | Shows error with Phase A message |
| Expert Network application | Fill in and submit | Shows error with Phase A message |
| Career job application | Fill in and submit | Shows error with Phase A message |
| **No form** | Any submission | **No form shows a false success message** |

> These forms display a clear, honest error directing visitors to email. When Phase B (backend) activates, forms switch to real submission automatically — zero code changes needed.

### SEO & Indexing

| File | URL | Expected |
|---|---|---|
| `robots.txt` | `https://gorakhai.com/robots.txt` | `Allow: /` + `Disallow: /admin/` + `Sitemap:` reference |
| `sitemap.xml` | `https://gorakhai.com/sitemap.xml` | XML with 25 URLs, all pointing to `gorakhai.com` |
| Page `<title>` | Any page | `Gorakhai — Enterprise AI Intelligence` (or page-specific) |
| OG tags | Homepage | `og:title`, `og:description`, `og:type` present |

### SSL / Security

| Check | Expected |
|---|---|
| `https://gorakhai.com` | Padlock visible, no mixed content warnings |
| `http://gorakhai.com` | Redirects to `https://` automatically |
| Admin routes | `https://gorakhai.com/admin` redirects to `/admin/login` (frontend) |
| `https://gorakhai.com/admin/login` | Login form renders but auth fails (no backend — expected in Phase A) |

### Performance (Cloudflare CDN)

| Check | How to verify |
|---|---|
| Response time | Chrome DevTools → Network — first load < 3s |
| Cache headers | Check `cf-cache-status: HIT` on repeat visits |
| Brotli compression | `Content-Encoding: br` header on JS/CSS files |

---

## What Is Live in Phase A

| Feature | Status | Data source |
|---|---|---|
| All 12 public pages | LIVE | React components |
| Blog (6 articles) | LIVE | Hardcoded mock data |
| Careers (6 listings) | LIVE | Hardcoded mock data |
| SEO meta tags | LIVE | react-helmet-async |
| sitemap.xml | LIVE | Static file |
| robots.txt | LIVE | Static file |
| SSL / HTTPS | LIVE | Cloudflare managed |
| CDN (global edge) | LIVE | Cloudflare free tier |
| SPA routing | LIVE | `_redirects` file |

## What Is NOT Active in Phase A

| Feature | Status | Activates in |
|---|---|---|
| Contact / demo request capture | NOT active — shows helpful error | Phase B |
| Newsletter subscriptions | NOT active — shows helpful error | Phase B |
| Waitlist registrations | NOT active — shows helpful error | Phase B |
| Expert applications | NOT active — shows helpful error | Phase B |
| Job applications | NOT active — shows helpful error | Phase B |
| Admin CMS | NOT active | Phase B |
| New blog posts via CMS | NOT active | Phase B |
| Media uploads | NOT active | Phase B |

---

## Phase B Activation (When Ready)

Phase B requires:
1. MongoDB Atlas M0 free cluster (~10 min setup)
2. Railway backend deployment (~15 min setup)

When both are active, **every form on the site connects automatically** — no redeploy of the frontend needed. The `REACT_APP_BACKEND_URL` is already set to `https://api.gorakhai.com` in Cloudflare Pages.

See `docs/DEPLOYMENT.md` for full Phase B instructions.

---

## Cloudflare Performance Settings (Optional — 5 min)

After deploying, apply these in your `gorakhai.com` Cloudflare zone:

**Speed → Optimization:**
- Auto Minify: HTML ✓, CSS ✓, JavaScript ✓
- Brotli: ON
- Rocket Loader: ON

**Caching → Configuration:**
- Caching Level: Standard

These are already included in the Cloudflare free tier.
