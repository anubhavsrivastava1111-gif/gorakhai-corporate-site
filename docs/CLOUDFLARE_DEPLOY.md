# Cloudflare Pages Deployment Guide — Gorakhai Corporate Site

## Repository: `gorakhai-corporate-site`
## Hosting: Cloudflare Pages (Static React SPA)

---

## Prerequisites
- Cloudflare account at [cloudflare.com](https://cloudflare.com)
- GitHub repository access: `gorakhai-corporate-site`
- Supabase project set up (see `docs/SUPABASE_SETUP.md`)
- Custom domain managed through Cloudflare DNS

---

## Step 1: Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages → Pages**
3. Click **Create a project → Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select repository: `gorakhai-corporate-site`

---

## Step 2: Configure Build Settings

When prompted for build configuration, use these exact settings:

| Setting | Value |
|---------|-------|
| **Project name** | `gorakhai-corporate-site` |
| **Production branch** | `main` |
| **Framework preset** | Create React App |
| **Build command** | `cd frontend && yarn build` |
| **Build output directory** | `frontend/build` |
| **Root directory** | `/` (leave blank) |
| **Node.js version** | `20` |

---

## Step 3: Add Environment Variables

In **Cloudflare Pages → Your Project → Settings → Environment Variables**, add:

### Production Environment
| Variable | Value | Notes |
|----------|-------|-------|
| `REACT_APP_SUPABASE_URL` | `https://<ref>.supabase.co` | From Supabase Settings → API |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJ...` | Public anon key — safe for frontend |
| `REACT_APP_SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Admin only — service role key |
| `NODE_VERSION` | `20` | Ensure correct Node version |

### Preview Environment
Same as production but can use a separate Supabase staging project.

> ⚠️ **Security**: Service role key is sensitive. Restrict it to encrypted environment variables in Cloudflare and never commit it to git.

---

## Step 4: SPA Routing Configuration

The `_redirects` file is already configured in `frontend/public/_redirects`:

```
/* /index.html 200
```

This ensures React Router handles all URL routing correctly on Cloudflare Pages. Without this, refreshing on any non-root route returns a 404.

---

## Step 5: Custom Domain Setup

### Connect Your Domain

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `gorakhai.com` (and optionally `www.gorakhai.com`)
4. Cloudflare will automatically configure the DNS CNAME record

### DNS Records (Auto-configured)
Cloudflare adds these automatically:
```
Type  Name  Target
CNAME @     gorakhai-corporate-site.pages.dev
CNAME www   gorakhai-corporate-site.pages.dev
```

### Force HTTPS
- Go to **SSL/TLS → Overview**
- Set mode to **Full (strict)**
- Enable **Always Use HTTPS** redirect

### WWW Redirect (Optional)
Add a Page Rule:
- URL: `www.gorakhai.com/*`
- Setting: Forwarding URL (301)
- Destination: `https://gorakhai.com/$1`

---

## Step 6: Performance Configuration (Recommended)

### Cache Rules
In **Caching → Cache Rules**, add:

```
Rule: Cache static assets
Condition: File extension equals jpg, jpeg, png, gif, css, js, woff2, ico
Action: Cache level = Cache Everything, TTL = 1 month
```

### Cloudflare Settings
Enable these in your zone settings:
- ✅ **Auto Minify** (HTML, CSS, JS)
- ✅ **Brotli** compression
- ✅ **HTTP/2 Push**
- ✅ **Early Hints**
- ✅ **Rocket Loader** (speeds up JS loading)

---

## Step 7: GitHub Actions CI/CD

The workflow at `.github/workflows/deploy.yml` automatically deploys on push to `main`.

### Required GitHub Secrets
Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

| Secret | Value | Where to find |
|--------|-------|---------------|
| `CLOUDFLARE_API_TOKEN` | CF API token | Cloudflare → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | CF Account ID | Cloudflare → Account Home (right sidebar) |
| `REACT_APP_SUPABASE_URL` | Supabase project URL | Supabase → Settings → API |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anon key | Supabase → Settings → API |

### Create Cloudflare API Token
1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Add permission: **Cloudflare Pages → Edit**
5. Set zone resource to your domain
6. Create and copy the token

---

## Step 8: Verify Deployment

1. Push to `main` branch or trigger a manual deploy
2. Check build logs in Cloudflare Pages dashboard
3. Verify at: `https://gorakhai.com`
4. Test key pages:
   - `https://gorakhai.com/` — Home
   - `https://gorakhai.com/products/orchestra-iq`
   - `https://gorakhai.com/blog`
   - `https://gorakhai.com/contact`

---

## Build Optimization

The React build is optimized with:
- **Code splitting** via `React.lazy` — each page loads only when visited
- **Tree shaking** — unused code eliminated
- **Asset compression** — Brotli/gzip via Cloudflare
- **Image optimization** — Cloudflare Polish (enable in Speed → Optimization)

### Expected Build Sizes (approximate)
```
main bundle:    ~200KB (gzipped)
vendor bundle:  ~300KB (gzipped)
page chunks:    ~20-40KB each
Total:          ~600KB first load
```

---

## Preview Deployments

Every pull request automatically gets a preview URL:
```
https://<branch-name>.gorakhai-corporate-site.pages.dev
```

This is useful for reviewing changes before merging to production.

---

## Rollback

To rollback to a previous deployment:
1. Go to **Cloudflare Pages → Deployments**
2. Find the deployment you want to restore
3. Click **···** → **Rollback to this deployment**

Instant rollback with zero downtime.

---

## Monitoring

### Cloudflare Analytics
- **Analytics → Web Analytics**: Traffic, Core Web Vitals, visitors
- **Analytics → Logs**: Request logs, errors

### Uptime Monitoring
Consider adding:
- Cloudflare Health Checks (Notifications → Health Checks)
- External monitoring: Better Uptime, Checkly

---

## Environment Configuration Summary

```
Development  →  http://localhost:3000
               Supabase: Mock mode (no credentials needed)
               
Preview      →  https://<branch>.gorakhai-corporate-site.pages.dev  
               Supabase: Staging project (optional)
               
Production   →  https://gorakhai.com
               Supabase: gorakhai-corporate project (live credentials)
```
