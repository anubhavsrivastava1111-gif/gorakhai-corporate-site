# Gorakhai CMS Auth Testing Playbook

## Step 1: MongoDB Verification
```
mongosh
use gorakhai_cms
db.admin_users.find({role: "super_admin"}).pretty()
db.admin_users.findOne({role: "super_admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist.

## Step 2: API Testing
```bash
# Login
curl -c /tmp/cookies.txt -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@gorakhai.com","password":"GorakhaiAdmin2026!"}'

# Check session
curl -b /tmp/cookies.txt http://localhost:8001/api/auth/me

# Get stats
curl -b /tmp/cookies.txt http://localhost:8001/api/admin/stats

# Logout
curl -b /tmp/cookies.txt -X POST http://localhost:8001/api/auth/logout
```

## Step 3: Public Routes
```bash
curl http://localhost:8001/api/public/blog
curl http://localhost:8001/api/public/careers
```
