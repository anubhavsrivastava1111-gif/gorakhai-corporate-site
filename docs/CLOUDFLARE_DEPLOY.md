# Cloudflare Pages Deployment Guide — GorakhAI Corporate Site

## Repository: `gorakhai-corporate-site`
## Hosting: Cloudflare Pages (Static React SPA — Free Forever)

---

## Prerequisites
- Cloudflare account at [cloudflare.com](https://cloudflare.com)
- GitHub repository containing this codebase
- Backend already deployed at `api.gorakhai.com` (see `DEPLOYMENT.md`)

---

## Step 1: Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages → Pages**
3. Click **Create a project → Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select repository: `gorakhai-corporate-site`

---

## Step 2: Configure Build Settings

Use these **exact** settings:

| Setting | Value |
|---------|-------|
| **Project name** | `gorakhai-corporate` |
| **Production branch** | `main` |
| **Framework preset** | Create React App |
| **Build command** | `cd frontend && yarn install && yarn build` |
| **Build output directory** | `frontend/build` |
| **Root directory** | *(leave blank)* |
| **Node.js version** | `20` |

---

## Step 3: Add Environment Variables

In **Cloudflare Pages → Your Project → Settings → Environment Variables**:

### Production Environment

| Variable | Value | Required? |
|----------|-------|-----------|
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` | **Yes** |
| `CI` | `false` | Yes (prevents build failures on warnings) |
| `GENERATE_SOURCEMAP` | `false` | Recommended (reduces build size) |
| `REACT_APP_SUPABASE_URL` | *(leave blank for now)* | No — future use |
| `REACT_APP_SUPABASE_ANON_KEY` | *(leave blank for now)* | No — future use |

> **Note:** `REACT_APP_BACKEND_URL` is baked into the JavaScript bundle at build time. It must point to your live backend URL. After changing this variable, trigger a new deploy.

---

## Step 4: SPA Routing

The `_redirects` file is already configured at `frontend/public/_redirects`:

```
/* /index.html 200
```

This ensures React Router handles all URL routing. Without this, refreshing on any route (e.g. `/admin/login`) returns a 404.

---

## Step 5: Custom Domain Setup

### Connect Your Domain

1. In Cloudflare Pages → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `gorakhai.com`
4. Cloudflare automatically configures the DNS CNAME record

### Add www redirect

1. Add `www.gorakhai.com` as a second custom domain
2. Set it to redirect to `https://gorakhai.com` (301)

### Force HTTPS

- **SSL/TLS → Overview** → Set mode to **Full (strict)**
- **SSL/TLS → Edge Certificates** → **Always Use HTTPS**: ON

---

## Step 6: GitHub Actions CI/CD

The workflow at `.github/workflows/deploy.yml` automatically deploys on every push to `main`.

### Required GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

| Secret | Where to find |
|--------|---------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token (use "Edit Cloudflare Pages" template) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` |

### Create Cloudflare API Token

1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Pages**
4. Ensure permission: `Cloudflare Pages: Edit`
5. Create and copy the token (shown only once)

---

## Step 7: Verify Deployment

1. Push to `main` or click **Manage Deployments → Retry deployment**
2. Check build logs in Cloudflare Pages dashboard
3. Once complete, test these URLs:
   - `https://gorakhai.com/` — Homepage
   - `https://gorakhai.com/blog` — Blog list
   - `https://gorakhai.com/admin/login` — Admin CMS
   - `https://gorakhai.com/products/orchestra-iq` — Product page

---

## Performance (Cloudflare Free Tier)

Enable these in your Cloudflare zone settings:

- **Speed → Optimization → Auto Minify**: HTML, CSS, JS ✅
- **Speed → Optimization → Brotli**: ON ✅
- **Speed → Optimization → Rocket Loader**: ON ✅
- **Caching → Configuration → Cache Level**: Standard ✅

### Cache Rules for Static Assets

In **Caching → Cache Rules**, add:

```
Rule: Cache static assets
Condition: File extension matches jpg, jpeg, png, gif, css, js, woff2, ico
Action: Cache level = Cache Everything, TTL = 30 days
```

---

## Preview Deployments

Every pull request automatically gets a preview URL:
```
https://<branch-name>.gorakhai-corporate.pages.dev
```

This lets you review design changes before merging to production.

---

## Rollback

To rollback to a previous deployment:
1. Go to **Cloudflare Pages → Deployments**
2. Find the deployment you want to restore
3. Click **···** → **Rollback to this deployment**

Instant rollback. Zero downtime.

---

## Monitoring

### Cloudflare Analytics
- **Analytics → Web Analytics**: Traffic, Core Web Vitals, top pages, visitors
- **Security → Events**: Bot traffic, WAF activity

### Uptime Monitoring (Optional)
- Cloudflare Notifications → Health Checks → Add check on `https://gorakhai.com`
- External: Better Uptime, Checkly (both have free tiers)

---

## Environment Summary

```
Development  →  http://localhost:3000
               Backend: http://localhost:8001

Production   →  https://gorakhai.com
               Backend: https://api.gorakhai.com
```
