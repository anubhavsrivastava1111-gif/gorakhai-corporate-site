from dotenv import load_dotenv
from pathlib import Path

# Load .env before any other imports
load_dotenv(Path(__file__).parent / ".env")

import os
import logging
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

from db import init_db, get_db, close_db
from auth import hash_password, verify_password
from storage import get_storage_provider
from routes.auth_routes import router as auth_router
from routes.admin_routes import router as admin_router
from routes.public_routes import router as public_router
from routes.media_routes import admin_router as media_admin_router
from routes.media_routes import public_router as media_public_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Gorakhai CMS API")
api_router = APIRouter(prefix="/api")


# ─── Legacy status-check endpoints (unchanged) ─────────────────────────────

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Gorakhai CMS API v2"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    db = get_db()
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    db = get_db()
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in checks:
        if isinstance(c["timestamp"], str):
            c["timestamp"] = datetime.fromisoformat(c["timestamp"])
    return checks


app.include_router(api_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(public_router)
app.include_router(media_admin_router)
app.include_router(media_public_router)

# CORS — must list explicit origins when credentials=True
_cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Startup ─────────────────────────────────────────────────────────────────

_BLOG_SEED = [
    {
        "title": "How Orchestra IQ Reduced AI Inference Costs by 42% for a Fortune 500 Retailer",
        "slug": "orchestra-iq-reduced-ai-costs-fortune-500",
        "excerpt": "A leading retail enterprise was spending millions on AI inference with inconsistent results. Orchestra IQ's intelligent routing changed everything.",
        "cover_image_url": "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg",
        "author_name": "Priya Nair", "author_avatar": "PN",
        "category": "Case Studies",
        "tags": ["Orchestra IQ", "Cost Optimization", "Enterprise"],
        "read_time_mins": 8,
        "status": "published",
        "published_at": "2025-11-15T09:00:00Z",
        "content": "<p>When one of North America's largest retail enterprises approached us with a challenge — $4.2M in annual AI inference spend with variable quality — we knew Orchestra IQ was built exactly for this scenario.</p><h2>The Challenge</h2><p>The company had deployed three different LLM providers across 12 business units, each making independent API calls without coordination. The result: duplicate queries, suboptimal model selection, and no unified observability.</p><h2>The Results</h2><ul><li>42% reduction in AI inference costs within 90 days</li><li>98.7% improvement in response consistency</li></ul>",
    },
    {
        "title": "The Architecture Behind Arjun AI's Enterprise Context Engine",
        "slug": "arjun-ai-context-window-architecture",
        "excerpt": "Understanding how Arjun AI maintains deep organizational context across thousands of simultaneous conversations without compromising privacy or performance.",
        "cover_image_url": "https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg",
        "author_name": "Marcus Chen", "author_avatar": "MC",
        "category": "Engineering",
        "tags": ["Arjun AI", "Architecture", "Engineering"],
        "read_time_mins": 12,
        "status": "published",
        "published_at": "2025-11-08T09:00:00Z",
        "content": "<p>Building an enterprise AI assistant that truly understands organizational context is one of the hardest problems in applied AI engineering.</p>",
    },
    {
        "title": "Multi-Model Orchestration: Why Single-Model AI Deployments Are Becoming Obsolete",
        "slug": "multi-model-orchestration-future",
        "excerpt": "As AI capabilities fragment across specialized models, orchestration becomes the competitive moat.",
        "cover_image_url": "https://images.pexels.com/photos/8124232/pexels-photo-8124232.jpeg",
        "author_name": "Rohan Sharma", "author_avatar": "RS",
        "category": "AI Research",
        "tags": ["Orchestration", "Strategy", "Future of AI"],
        "read_time_mins": 7,
        "status": "published",
        "published_at": "2025-10-29T09:00:00Z",
        "content": "<p>The era of the single AI model is drawing to a close.</p>",
    },
    {
        "title": "Building Enterprise AI Governance: A Practitioner's Framework for 2025",
        "slug": "enterprise-ai-governance-framework-2025",
        "excerpt": "From policy definition to technical enforcement, here's how leading enterprises are building AI governance programs.",
        "cover_image_url": "https://images.pexels.com/photos/20752572/pexels-photo-20752572.jpeg",
        "author_name": "Ananya Krishnamurthy", "author_avatar": "AK",
        "category": "Enterprise AI",
        "tags": ["Governance", "Compliance", "Enterprise"],
        "read_time_mins": 10,
        "status": "published",
        "published_at": "2025-10-15T09:00:00Z",
        "content": "<p>AI governance is no longer optional.</p>",
    },
    {
        "title": "Arjun AI 2.0: Introducing Multi-Modal Document Intelligence",
        "slug": "arjun-ai-2-multimodal-release",
        "excerpt": "Today we're releasing Arjun AI 2.0 with native multi-modal support.",
        "cover_image_url": "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg",
        "author_name": "Priya Nair", "author_avatar": "PN",
        "category": "Product Updates",
        "tags": ["Arjun AI", "Product Release", "Multi-Modal"],
        "read_time_mins": 5,
        "status": "published",
        "published_at": "2025-10-01T09:00:00Z",
        "content": "<p>Since launching Arjun AI, the most requested feature from enterprise customers has been consistent: 'Can it read our documents?' Today, the answer is a definitive yes.</p>",
    },
    {
        "title": "The Hidden Costs of Shadow AI: How Enterprise Platforms Eliminate the Risk",
        "slug": "shadow-ai-enterprise-risk",
        "excerpt": "Employees are using consumer AI tools for sensitive work. The data exposure risk is real.",
        "cover_image_url": "https://images.pexels.com/photos/1181320/pexels-photo-1181320.jpeg",
        "author_name": "Marcus Chen", "author_avatar": "MC",
        "category": "Enterprise AI",
        "tags": ["Security", "Shadow AI", "Risk Management"],
        "read_time_mins": 6,
        "status": "published",
        "published_at": "2025-09-18T09:00:00Z",
        "content": "<p>In a recent survey, 67% of enterprise employees admitted to using consumer AI tools for work tasks despite company policy.</p>",
    },
]

_JOBS_SEED = [
    {
        "title": "Senior Software Engineer — Platform",
        "slug": "senior-software-engineer-platform",
        "department": "Engineering",
        "location": "San Francisco, CA / Remote",
        "type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$180,000 — $240,000",
        "description": "We're looking for a Senior Software Engineer to join our Platform team building the core infrastructure that powers Orchestra IQ.",
        "requirements": ["5+ years of software engineering experience", "Strong proficiency in Python and/or Go", "Experience building distributed systems at scale", "Familiarity with LLM APIs", "Experience with Kubernetes, Docker, and cloud infrastructure"],
        "responsibilities": ["Design and build core platform APIs and infrastructure", "Own critical reliability and performance initiatives", "Mentor junior engineers", "Participate in on-call rotations"],
        "status": "open",
        "posted_at": "2025-11-10T00:00:00Z",
    },
    {
        "title": "Product Manager — Orchestra IQ",
        "slug": "product-manager-orchestra-iq",
        "department": "Product",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$160,000 — $200,000",
        "description": "Lead the product vision and roadmap for Orchestra IQ, our AI orchestration platform.",
        "requirements": ["4+ years of product management experience", "Experience with developer tools or enterprise software", "Deep understanding of AI/ML workflows"],
        "responsibilities": ["Own the Orchestra IQ product roadmap", "Conduct customer discovery", "Define and track key product metrics"],
        "status": "open",
        "posted_at": "2025-11-05T00:00:00Z",
    },
    {
        "title": "Enterprise Account Executive",
        "slug": "enterprise-account-executive",
        "department": "Sales",
        "location": "New York, NY / Remote",
        "type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$130,000 — $170,000 + Commission",
        "description": "Join our growing Enterprise Sales team targeting Fortune 1000 companies.",
        "requirements": ["5+ years of enterprise B2B SaaS sales", "Proven track record closing $500K+ ARR deals", "Experience selling to technical buyers"],
        "responsibilities": ["Own and grow a portfolio of enterprise accounts", "Lead complex, multi-stakeholder sales cycles"],
        "status": "open",
        "posted_at": "2025-11-01T00:00:00Z",
    },
    {
        "title": "Senior AI Research Engineer",
        "slug": "senior-ai-research-engineer",
        "department": "Engineering",
        "location": "San Francisco, CA / Remote",
        "type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$200,000 — $280,000",
        "description": "Work at the intersection of AI research and production systems.",
        "requirements": ["PhD or MS in CS, ML, or related field", "Research experience with LLMs, transformers", "Strong Python and ML frameworks experience"],
        "responsibilities": ["Research and prototype novel AI capabilities", "Develop evaluation frameworks for model quality"],
        "status": "open",
        "posted_at": "2025-10-28T00:00:00Z",
    },
    {
        "title": "Head of Design",
        "slug": "head-of-design",
        "department": "Design",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "experience_level": "Lead",
        "salary_range": "$170,000 — $220,000",
        "description": "Lead Gorakhai's design function across brand, product, and marketing.",
        "requirements": ["7+ years of design experience, including 2+ in leadership", "Strong portfolio in product and/or brand design", "Experience with design systems at scale"],
        "responsibilities": ["Define and evolve Gorakhai's design language", "Lead design across product, marketing, and brand"],
        "status": "open",
        "posted_at": "2025-10-20T00:00:00Z",
    },
    {
        "title": "Customer Success Manager",
        "slug": "customer-success-manager",
        "department": "Operations",
        "location": "Remote (US)",
        "type": "Full-time",
        "experience_level": "Mid",
        "salary_range": "$100,000 — $130,000",
        "description": "Ensure enterprise customers achieve maximum value from Gorakhai's platform.",
        "requirements": ["3+ years of customer success experience", "Experience with enterprise software customers"],
        "responsibilities": ["Own a portfolio of 15-25 enterprise accounts", "Drive onboarding, adoption, and time-to-value"],
        "status": "open",
        "posted_at": "2025-10-15T00:00:00Z",
    },
]


async def seed_database():
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    # Admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "superadmin@gorakhai.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    existing_admin = await db.admin_users.find_one({"email": admin_email})
    if existing_admin is None:
        await db.admin_users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Super Admin",
            "role": "super_admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
            "last_login": None,
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif admin_password and not verify_password(admin_password, existing_admin.get("password_hash", "")):
        await db.admin_users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password), "updated_at": now}},
        )
        logger.info(f"Updated admin password for: {admin_email}")

    # Blog posts
    if await db.blog_posts.count_documents({}) == 0:
        for post in _BLOG_SEED:
            await db.blog_posts.insert_one({
                **post,
                "author_id": "seed",
                "view_count": 0,
                "created_at": now,
                "updated_at": now,
            })
        logger.info(f"Seeded {len(_BLOG_SEED)} blog posts")

    # Job listings
    if await db.job_listings.count_documents({}) == 0:
        for job in _JOBS_SEED:
            await db.job_listings.insert_one({
                **job,
                "created_at": now,
                "updated_at": now,
            })
        logger.info(f"Seeded {len(_JOBS_SEED)} job listings")

    # Write test credentials file
    creds_path = Path("/app/memory/test_credentials.md")
    if not creds_path.exists():
        creds_path.parent.mkdir(parents=True, exist_ok=True)
    creds_path.write_text(
        f"# Gorakhai CMS Test Credentials\n\n"
        f"## Admin Account\n"
        f"- **Email:** {admin_email}\n"
        f"- **Password:** {admin_password}\n"
        f"- **Role:** super_admin\n\n"
        f"## Endpoints\n"
        f"- POST /api/auth/login\n"
        f"- GET /api/auth/me\n"
        f"- POST /api/auth/logout\n"
        f"- POST /api/auth/refresh\n"
        f"- GET /api/admin/stats\n"
        f"- GET /api/admin/blog\n"
        f"- GET /api/admin/careers\n"
        f"- GET /api/admin/leads\n"
        f"- GET /api/admin/newsletter\n"
        f"- GET /api/admin/experts\n"
        f"- GET /api/admin/waitlist\n"
        f"- GET /api/admin/users\n"
        f"- GET /api/admin/audit-logs\n"
        f"- GET /api/admin/activity-logs\n"
        f"- GET /api/public/blog\n"
        f"- GET /api/public/careers\n"
    )
    logger.info("Wrote test credentials to /app/memory/test_credentials.md")


async def create_indexes():
    db = get_db()
    await db.admin_users.create_index("email", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.job_listings.create_index("slug", unique=True)
    await db.newsletter_subscribers.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.audit_logs.create_index([("created_at", -1)])
    await db.activity_logs.create_index([("created_at", -1)])
    await db.media.create_index([("created_at", -1)])
    await db.media.create_index("context")
    logger.info("MongoDB indexes created")


@app.on_event("startup")
async def startup():
    init_db()
    get_storage_provider()   # initialise + log chosen provider
    await create_indexes()
    await seed_database()
    logger.info("Gorakhai CMS API started")


@app.on_event("shutdown")
async def shutdown():
    close_db()
