# Gorakhai CMS — Environment Variables Reference

## Backend (`/app/backend/.env`)

### Required — Core

| Variable | Example | Description |
|---|---|---|
| `MONGO_URL` | `mongodb://localhost:27017` | MongoDB connection string. In Docker: `mongodb://mongo:27017`. Atlas: full connection string |
| `DB_NAME` | `gorakhai_cms` | MongoDB database name |
| `JWT_SECRET` | *(64-char hex)* | JWT signing secret. **Generate with:** `python3 -c "import secrets; print(secrets.token_hex(32))"`. **Never commit the production value.** |
| `ADMIN_EMAIL` | `superadmin@gorakhai.com` | Initial super admin email. Created on first startup. |
| `ADMIN_PASSWORD` | `YourSecurePassword123!` | Initial super admin password. **Change immediately after first login.** |
| `CORS_ORIGINS` | `https://gorakhai.com,https://www.gorakhai.com` | Comma-separated list of allowed frontend origins. Wildcard `*` disabled in production. |
| `FRONTEND_URL` | `https://gorakhai.com` | Primary frontend URL. Used for CORS and redirects. |

### Required — Storage

| Variable | Default | Description |
|---|---|---|
| `STORAGE_PROVIDER` | `local` | Storage backend. Options: `local`, `r2`. |
| `UPLOADS_DIR` | `/app/backend/uploads` | Local filesystem path for uploaded files. Must be writable. Use a persistent volume in Docker/production. |
| `COOKIE_SECURE` | `false` | Set to `true` in production. Enables `Secure; SameSite=None` cookies required for cross-origin auth (frontend on gorakhai.com, backend on api.gorakhai.com). |

### Optional — Cloudflare R2 (only if `STORAGE_PROVIDER=r2`)

| Variable | Description |
|---|---|
| `R2_ACCOUNT_ID` | Your Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | R2 bucket name (e.g. `gorakhai-media`) |
| `R2_PUBLIC_URL` | Public base URL for the bucket (e.g. `https://media.gorakhai.com`) |

---

## Frontend (`/app/frontend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `REACT_APP_BACKEND_URL` | **Yes** | `https://api.gorakhai.com` | Full URL of FastAPI backend. No trailing slash. Used for all API calls. |
| `REACT_APP_SUPABASE_URL` | No | `https://xxx.supabase.co` | Supabase project URL. Leave blank to use MongoDB backend only. |
| `REACT_APP_SUPABASE_ANON_KEY` | No | `eyJhbG...` | Supabase anon key. Only needed if using Supabase for public data. |

---

## GitHub Actions Secrets

Set these in your repository: **Settings → Secrets and variables → Actions**

| Secret | Where to find | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create token with "Edit Cloudflare Pages" | `deploy.yml` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar | `deploy.yml` |
| `REACT_APP_BACKEND_URL` | Your production backend URL | `deploy.yml` |
| `REACT_APP_SUPABASE_URL` | Supabase project settings | `deploy.yml` (optional) |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase project settings | `deploy.yml` (optional) |

---

## Environment Setup by Context

### Local Development
```bash
# backend/.env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="gorakhai_cms"
JWT_SECRET="dev_secret_change_in_production"
ADMIN_EMAIL="superadmin@gorakhai.com"
ADMIN_PASSWORD="GorakhaiAdmin2026!"
CORS_ORIGINS="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
STORAGE_PROVIDER="local"
UPLOADS_DIR="./uploads"

# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Docker Compose
```bash
# backend/.env.production
MONGO_URL="mongodb://mongo:27017"   # uses service name
DB_NAME="gorakhai_cms"
JWT_SECRET="<generate-new-64-char-hex>"
ADMIN_EMAIL="admin@gorakhai.com"
ADMIN_PASSWORD="<strong-unique-password>"
CORS_ORIGINS="https://gorakhai.com"
FRONTEND_URL="https://gorakhai.com"
STORAGE_PROVIDER="local"
UPLOADS_DIR="/app/uploads"
```

### Production (Railway / Render)
Set all backend variables above as environment variables in the platform dashboard.
Do not commit `.env.production` to git.
