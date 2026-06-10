# GorakhAI Corporate Site — Production Deployment Guide

> **Audience:** Non-technical founder / first-time deployer  
> **Status:** Deployment-ready. Follow this guide top-to-bottom.  
> **Last updated:** Feb 2026

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC INTERNET                         │
└──────────┬──────────────────────────────┬───────────────────────┘
           │                              │
   ┌───────▼──────────┐         ┌─────────▼────────────┐
   │  Cloudflare Pages│         │  Backend Server       │
   │  gorakhai.com    │  calls  │  api.gorakhai.com     │
   │  (React SPA)     │────────▶│  (FastAPI + MongoDB)  │
   └──────────────────┘  HTTPS  └──────────────────────┘
                                          │
                                 ┌────────▼────────┐
                                 │   MongoDB Atlas  │
                                 │   (free tier)    │
                                 └─────────────────┘
```

**Two parts to deploy:**
1. **Frontend** → Cloudflare Pages (100% free, zero configuration)
2. **Backend** → Railway or Render (starts at ~$5/month) + MongoDB Atlas (free)

---

## Cost Summary

| Service | Plan | Monthly Cost |
|---|---|---|
| Cloudflare Pages (frontend) | Free Forever | **$0** |
| Cloudflare DNS + SSL + CDN | Free | **$0** |
| MongoDB Atlas | M0 Free Cluster | **$0** |
| Railway (backend) | Hobby Plan | **~$5** |
| **Total minimum** | | **~$5/month** |

> **Cloudflare Free Tier:** 100% compatible. Frontend, DNS, SSL, and CDN are all free. If you add Cloudflare R2 for media storage later, the free tier covers 10GB storage and 1M operations/month — well above early-stage needs.

> **Domain:** If you already own `gorakhai.com` managed through Cloudflare, no additional cost. Domain registration (~$10–15/year) is separate.

---

## Pre-Deployment Checklist

Complete each item before starting the deploy steps.

### GitHub
- [ ] Repository is pushed to GitHub (e.g. `github.com/your-org/gorakhai-corporate-site`)
- [ ] `main` branch contains latest code

### Secrets you will generate yourself
- [ ] **JWT Secret** — run this in your terminal and copy the output:
  ```bash
  python3 -c "import secrets; print(secrets.token_hex(32))"
  ```
  Example output: `a7f2c3d...` (64 hex characters)
- [ ] **Admin password** — choose a strong password (12+ chars, mixed case, numbers, symbols)  
  Example: `Gorakhai#Launch2026`

### Accounts to create (all free)
- [ ] [Cloudflare account](https://cloudflare.com) — add your domain `gorakhai.com`
- [ ] [MongoDB Atlas account](https://mongodb.com/atlas) — create free M0 cluster
- [ ] [Railway account](https://railway.app) — connect your GitHub

---

## Part 1: MongoDB Atlas (Database — Free)

**Time: 10 minutes**

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → **Try Free**
2. Create an organisation and project named `gorakhai`
3. Click **Create a deployment** → choose **M0 Free** (512 MB, always free)
4. Choose a cloud provider (AWS or Google) and a region close to your users (e.g., US East)
5. Name the cluster: `gorakhai-production`
6. **Security → Database Access** → Add a new database user:
   - Username: `gorakhai-app`
   - Password: generate a strong password → **copy and save it**
   - Role: `Atlas admin`
7. **Security → Network Access** → Add IP address → **Allow access from anywhere** (`0.0.0.0/0`)
   > This is required so your backend server can connect. Railway/Render use dynamic IPs.
8. **Connect → Connect your application** → Driver: Python 3.6+ → copy the connection string:
   ```
   mongodb+srv://gorakhai-app:<password>@gorakhai-production.xxxxx.mongodb.net/gorakhai_cms
   ```
   Replace `<password>` with the database user password from step 6.

---

## Part 2: Backend on Railway

**Time: 15 minutes**

### 2a. Create Railway project

1. Go to [railway.app](https://railway.app) → Log in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select `gorakhai-corporate-site` → Railway detects the Dockerfile automatically
4. Set **Root directory** to `backend`

### 2b. Set environment variables in Railway

In **Railway → Your Service → Variables**, add every variable below:

| Variable | Value | Notes |
|---|---|---|
| `MONGO_URL` | `mongodb+srv://gorakhai-app:<password>@...mongodb.net/gorakhai_cms` | From Atlas step 8 |
| `DB_NAME` | `gorakhai_cms` | |
| `JWT_SECRET` | *(your 64-char hex from pre-deploy checklist)* | Never commit this |
| `ADMIN_EMAIL` | `your-email@gorakhai.com` | Your admin login email |
| `ADMIN_PASSWORD` | *(your strong password)* | Change immediately after first login |
| `CORS_ORIGINS` | `https://gorakhai.com,https://www.gorakhai.com` | Must match your Cloudflare domain exactly |
| `FRONTEND_URL` | `https://gorakhai.com` | |
| `STORAGE_PROVIDER` | `local` | Change to `r2` when ready for Cloudflare R2 |
| `UPLOADS_DIR` | `/app/uploads` | |
| `COOKIE_SECURE` | `true` | **Required for production cross-origin auth** |

> **COOKIE_SECURE=true** is critical. Without it, the admin panel login will not work in production because cookies won't be sent across domains.

### 2c. Configure custom domain on Railway

1. In Railway → **Settings → Domains** → **Add Custom Domain**
2. Enter: `api.gorakhai.com`
3. Railway gives you a CNAME record to add to Cloudflare DNS (e.g., `abc.up.railway.app`)
4. In Cloudflare DNS, add:
   ```
   Type: CNAME
   Name: api
   Target: abc.up.railway.app
   Proxy: DNS only (grey cloud) — NOT proxied
   ```
   > Use DNS-only for the API subdomain so Railway handles SSL directly.

### 2d. Verify backend is live

```bash
curl https://api.gorakhai.com/api/
# Expected: {"message": "Gorakhai CMS API v2"}
```

---

## Part 3: Frontend on Cloudflare Pages

**Time: 10 minutes**

### 3a. Create Cloudflare Pages project

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages → Pages → Create a project → Connect to Git**
3. Authorise Cloudflare to access your GitHub account
4. Select repository: `gorakhai-corporate-site`

### 3b. Configure build settings

Use these **exact** values:

| Setting | Value |
|---|---|
| **Project name** | `gorakhai-corporate` |
| **Production branch** | `main` |
| **Framework preset** | Create React App |
| **Build command** | `cd frontend && yarn install && yarn build` |
| **Build output directory** | `frontend/build` |
| **Root directory** | *(leave blank)* |

### 3c. Add environment variables in Cloudflare Pages

In **Settings → Environment variables → Production**:

| Variable | Value |
|---|---|
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` |
| `CI` | `false` |
| `GENERATE_SOURCEMAP` | `false` |

> Note: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are optional and can be left blank until Supabase integration is needed.

### 3d. Connect custom domain

1. In Cloudflare Pages → **Custom domains → Set up a custom domain**
2. Add `gorakhai.com`
3. Add `www.gorakhai.com` → set to redirect to `gorakhai.com`
4. Cloudflare auto-provisions SSL certificates

### 3e. Force HTTPS

In Cloudflare **SSL/TLS → Overview** → Mode: **Full (strict)**  
In **SSL/TLS → Edge Certificates** → **Always Use HTTPS**: ON

---

## Part 4: GitHub Actions CI/CD (Automated Deploys)

After initial setup, every push to `main` triggers an automatic deploy.

### 4a. Add GitHub Secrets

Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions → New repository secret**

Add these 3 secrets:

| Secret Name | Value | Where to find |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | CF API token | See step 4b below |
| `CLOUDFLARE_ACCOUNT_ID` | CF Account ID | Cloudflare Dashboard → right sidebar |
| `REACT_APP_BACKEND_URL` | `https://api.gorakhai.com` | Your backend domain |

### 4b. Create Cloudflare API Token

1. In Cloudflare → **My Profile → API Tokens → Create Token**
2. Use template: **Edit Cloudflare Pages**
3. Permissions: `Cloudflare Pages: Edit`
4. Account Resources: Include your account
5. Click **Continue to summary → Create Token**
6. Copy the token immediately (shown only once)

### 4c. Verify CI/CD is working

1. Push a small change to `main` branch
2. Go to **GitHub → Actions** tab → you should see the workflow running
3. Once complete, your changes are live at `gorakhai.com`

---

## Part 5: Post-Launch Verification

Run through this checklist after deployment:

### Connectivity
- [ ] `https://gorakhai.com` loads the homepage
- [ ] `https://api.gorakhai.com/api/` returns `{"message":"Gorakhai CMS API v2"}`
- [ ] All public pages load: `/blog`, `/contact`, `/careers`

### Admin CMS
- [ ] Navigate to `https://gorakhai.com/admin/login`
- [ ] Log in with your `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- [ ] Dashboard shows stats cards and recent activity
- [ ] Create a test blog post with the TipTap editor — set status to Published
- [ ] View the published post at `https://gorakhai.com/blog`
- [ ] Upload a cover image — confirm it displays on the blog post

### Forms
- [ ] Submit the contact form at `/contact` — appears in `/admin/leads`
- [ ] Subscribe to newsletter — appears in `/admin/newsletter`

### Security
- [ ] Change admin password in `/admin/users` after first login
- [ ] Confirm admin routes return 401 when not logged in:
  ```bash
  curl https://api.gorakhai.com/api/admin/stats
  # Expected: {"detail": "Not authenticated"}
  ```

---

## Part 6: Media Storage — Important Note

When using `STORAGE_PROVIDER=local` on Railway, uploaded media files are stored in Railway's ephemeral filesystem. This means:

- **Files survive redeploys** only if Railway has a persistent volume attached
- On Railway Hobby plan, add a **Volume** in the service settings:
  - Mount path: `/app/uploads`
  - Size: 1 GB (sufficient for early stage)
  - Cost: ~$0.25/GB/month

**Recommended long-term:** Switch to Cloudflare R2 for persistent, CDN-backed media storage. The backend architecture is already built for this — just set `STORAGE_PROVIDER=r2` and add R2 credentials. See `DEPLOYMENT.md Part 7` below.

---

## Part 7: Media Storage Migration to Cloudflare R2 (When Ready)

Cloudflare R2 free tier: **10 GB storage + 1M operations/month**

1. In Cloudflare Dashboard → **R2 Object Storage → Create bucket**
   - Bucket name: `gorakhai-media`
2. Go to **R2 → API tokens → Create API token** with `Object Read & Write` on `gorakhai-media`
3. Update Railway environment variables:
   ```
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=<your cloudflare account id>
   R2_ACCESS_KEY_ID=<from R2 token>
   R2_SECRET_ACCESS_KEY=<from R2 token>
   R2_BUCKET_NAME=gorakhai-media
   R2_PUBLIC_URL=https://media.gorakhai.com
   ```
4. In Cloudflare R2 → **gorakhai-media → Settings → Custom Domains** → connect `media.gorakhai.com`
5. Restart the backend — all new uploads go to R2 automatically

> **No code changes required.** The `StorageProvider` abstraction handles the switch.

---

## Rollback

**Frontend:** Cloudflare Pages → Deployments → find previous deploy → **···** → Rollback  
**Backend:** Railway → Deployments → select previous → Redeploy

---

## Alternative: Render (Free Tier)

If you want to avoid any monthly cost initially, Render has a free tier:

| Feature | Free Tier |
|---|---|
| Web Service | 750 hours/month |
| Cold start | Yes (~30s after 15min inactivity) |
| Custom domain | Yes |
| Persistent disk | No (need paid plan for persistence) |

**Setup on Render:**
1. [render.com](https://render.com) → New Web Service → Connect GitHub
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn server:app --host 0.0.0.0 --port 8001`
5. Add all environment variables (same as Railway list above)

> **Note:** Free tier has cold starts. First request after inactivity takes ~30 seconds. Not recommended for production but fine for testing.
