# Gorakhai Corporate Site — Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                      │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
   ┌───────▼──────────┐     ┌─────────▼──────────┐
   │  Cloudflare Pages│     │  Backend Server     │
   │  gorakhai.com    │     │  api.gorakhai.com   │
   │  (React SPA)     │     │  (FastAPI + MongoDB)│
   └──────────────────┘     └─────────────────────┘
                                      │
                             ┌────────▼────────┐
                             │    MongoDB       │
                             │  gorakhai_cms    │
                             └─────────────────┘
```

---

## Part 1: Frontend — Cloudflare Pages

### Prerequisites
- A Cloudflare account (free tier)
- Your GitHub repository connected to Cloudflare Pages

### Step 1: Create Cloudflare Pages project

1. Go to **Cloudflare Dashboard → Pages → Create a project**
2. Connect your GitHub account and select the `gorakhai-corporate` repository
3. Configure the build settings:

| Setting | Value |
|---|---|
| **Project name** | `gorakhai-corporate` |
| **Production branch** | `main` |
| **Framework preset** | Create React App |
| **Build command** | `cd frontend && yarn install && yarn build` |
| **Build output directory** | `frontend/build` |
| **Root directory** | `/` (leave blank) |

### Step 2: Add environment variables in Cloudflare Pages

In **Settings → Environment Variables**, add:

| Variable | Environment | Value |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Production | `https://api.gorakhai.com` |
| `REACT_APP_SUPABASE_URL` | Production | *(optional — Supabase project URL)* |
| `REACT_APP_SUPABASE_ANON_KEY` | Production | *(optional — Supabase anon key)* |
| `CI` | Production | `false` |
| `GENERATE_SOURCEMAP` | Production | `false` |

### Step 3: Custom domain

1. Go to **Pages → gorakhai-corporate → Custom domains**
2. Add `gorakhai.com` and `www.gorakhai.com`
3. Cloudflare auto-provisions SSL

### Step 4: GitHub Actions CI/CD (automated deploys)

Add these secrets to your GitHub repository (**Settings → Secrets → Actions**):

| Secret | Where to find |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Pages" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Right sidebar → Account ID |
| `REACT_APP_BACKEND_URL` | Your production backend URL |

Once configured, every push to `main` triggers a deploy automatically.

---

## Part 2: Backend — Deployment Options

The FastAPI backend requires a persistent server (Cloudflare Pages is static-only).

### Option A — Railway (Recommended, easiest)

1. Create account at [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub** → select your repo
3. Set **Root directory** to `backend`
4. Railway auto-detects Python and uses the Dockerfile
5. Add a **MongoDB** plugin in Railway (or use MongoDB Atlas free tier)
6. Set environment variables (see ENV_VARS.md)
7. Configure custom domain: `api.gorakhai.com` → your Railway deployment

### Option B — Render (Free tier available)

1. Create account at [render.com](https://render.com)
2. **New Web Service → Connect GitHub**
3. Set **Root directory** to `backend`, **Build command** to `pip install -r requirements.txt`
4. **Start command**: `uvicorn server:app --host 0.0.0.0 --port 8001`
5. Add environment variables
6. Free MongoDB: use [MongoDB Atlas M0 free tier](https://www.mongodb.com/atlas/database)

### Option C — VPS / Docker (Full control)

1. SSH into your server
2. Clone repository: `git clone https://github.com/your-org/gorakhai-corporate.git`
3. Copy and configure environment:
   ```bash
   cp backend/.env.example backend/.env.production
   nano backend/.env.production
   ```
4. Start services:
   ```bash
   docker compose up -d
   ```
5. Configure Nginx reverse proxy (see below)
6. SSL with Certbot: `certbot --nginx -d api.gorakhai.com`

#### Nginx config (api.gorakhai.com)
```nginx
server {
    server_name api.gorakhai.com;
    
    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Uploads — increase for media files
        client_max_body_size 15M;
    }
}
```

---

## Part 3: Production Deployment Checklist

### Pre-launch

- [ ] Backend `.env.production` created from `ENV_VARS.md` — all values set
- [ ] MongoDB running and accessible from backend
- [ ] `MONGO_URL` points to production MongoDB
- [ ] `JWT_SECRET` is a unique 64-char random hex (NOT the dev value)
  ```bash
  python3 -c "import secrets; print(secrets.token_hex(32))"
  ```
- [ ] `ADMIN_PASSWORD` changed from default `GorakhaiAdmin2026!`
- [ ] `CORS_ORIGINS` set to exact frontend domain (e.g. `https://gorakhai.com`)
- [ ] `UPLOADS_DIR` points to a persistent volume (not ephemeral filesystem)
- [ ] `STORAGE_PROVIDER=local` (or `r2` if Cloudflare R2 configured)
- [ ] Backend health check passes: `curl https://api.gorakhai.com/api/`
- [ ] Uploads directory exists and is writable: `ls -la /app/uploads`

### DNS (Cloudflare)

- [ ] `gorakhai.com` A/CNAME → Cloudflare Pages
- [ ] `www.gorakhai.com` → Cloudflare Pages (redirect to apex)
- [ ] `api.gorakhai.com` A → backend server IP
- [ ] SSL active on all domains

### Security

- [ ] Backend CORS allows only `https://gorakhai.com`
- [ ] JWT_SECRET is unique and not committed to git
- [ ] `.env.production` is in `.gitignore`
- [ ] Admin password changed post-deployment
- [ ] `uploads/` directory not directly browseable (backend serves via API)

### Post-launch

- [ ] Log in to admin at `https://gorakhai.com/admin` — confirm dashboard loads
- [ ] Create a test blog post with TipTap editor — publish and view on `/blog`
- [ ] Upload a cover image — confirm it appears on the post
- [ ] Submit a contact form — confirm it appears in `/admin/leads`
- [ ] Subscribe to newsletter — confirm in `/admin/newsletter`
- [ ] Verify audit logs populate in `/admin/activity-logs`

---

## Part 4: Media Storage Migration (Local → Cloudflare R2)

When you're ready to upgrade from local filesystem to R2:

1. Create an R2 bucket in Cloudflare Dashboard
2. Create an R2 API token with **Object Read & Write** permissions
3. Update backend `.env`:
   ```
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_key_id
   R2_SECRET_ACCESS_KEY=your_secret
   R2_BUCKET_NAME=gorakhai-media
   R2_PUBLIC_URL=https://media.gorakhai.com
   ```
4. Install boto3: `pip install boto3`
5. Restart backend — new uploads go to R2 automatically
6. Migrate existing files:
   ```bash
   # Upload existing local files to R2
   aws s3 sync ./uploads s3://gorakhai-media \
     --endpoint-url https://<account_id>.r2.cloudflarestorage.com
   ```
7. Update `stored_ref` URLs in MongoDB `media` collection (one-time migration script)

**No application code changes required.** The `StorageProvider` abstraction handles it all.
