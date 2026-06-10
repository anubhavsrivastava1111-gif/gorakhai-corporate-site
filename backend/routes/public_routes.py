import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from db import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/public", tags=["public"])


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _doc_to_dict(doc: dict) -> dict:
    """Convert MongoDB doc to JSON-serializable dict."""
    d = {k: v for k, v in doc.items() if k != "_id"}
    d["id"] = str(doc["_id"])
    return d


# ─── Blog ──────────────────────────────────────────────────────────────────

@router.get("/blog")
async def list_blog_posts(
    page: int = 1,
    limit: int = 20,
    category: Optional[str] = None,
):
    db = get_db()
    query: dict = {"status": "published"}
    if category and category.lower() != "all":
        query["category"] = category
    skip = (page - 1) * limit
    cursor = db.blog_posts.find(query, {"_id": 1, "title": 1, "slug": 1, "excerpt": 1,
        "author_name": 1, "author_avatar": 1, "category": 1, "tags": 1,
        "cover_image_url": 1, "read_time_mins": 1, "published_at": 1, "view_count": 1,
    }).sort("published_at", -1).skip(skip).limit(limit)
    posts = [_doc_to_dict(doc) async for doc in cursor]
    total = await db.blog_posts.count_documents(query)
    return {"posts": posts, "total": total, "page": page, "limit": limit}


@router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    db = get_db()
    doc = await db.blog_posts.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    # Increment view count
    await db.blog_posts.update_one({"_id": doc["_id"]}, {"$inc": {"view_count": 1}})
    return _doc_to_dict(doc)


# ─── Careers ───────────────────────────────────────────────────────────────

@router.get("/careers")
async def list_job_listings(
    page: int = 1,
    limit: int = 20,
    department: Optional[str] = None,
):
    db = get_db()
    query: dict = {"status": "open"}
    if department and department.lower() != "all":
        query["department"] = department
    skip = (page - 1) * limit
    cursor = db.job_listings.find(query).sort("posted_at", -1).skip(skip).limit(limit)
    jobs = [_doc_to_dict(doc) async for doc in cursor]
    total = await db.job_listings.count_documents(query)
    return {"jobs": jobs, "total": total, "page": page, "limit": limit}


@router.get("/careers/{slug}")
async def get_job_listing(slug: str):
    db = get_db()
    doc = await db.job_listings.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Job not found")
    return _doc_to_dict(doc)


# ─── Contact / Leads ───────────────────────────────────────────────────────

class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    subject: Optional[str] = None
    message: str
    source: Optional[str] = "contact_form"


@router.post("/contact")
async def submit_contact(body: ContactFormData):
    db = get_db()
    doc = {
        **body.model_dump(),
        "status": "new",
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = await db.contact_submissions.insert_one(doc)
    return {"success": True, "id": str(result.inserted_id)}


# ─── Newsletter ────────────────────────────────────────────────────────────

class NewsletterSubscribeData(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    source: Optional[str] = "newsletter_form"


@router.post("/newsletter/subscribe")
async def newsletter_subscribe(body: NewsletterSubscribeData):
    db = get_db()
    existing = await db.newsletter_subscribers.find_one({"email": body.email.lower()})
    if existing:
        if existing.get("status") == "unsubscribed":
            await db.newsletter_subscribers.update_one(
                {"_id": existing["_id"]},
                {"$set": {"status": "active", "updated_at": _now()}}
            )
            return {"success": True, "message": "Re-subscribed successfully"}
        return {"success": True, "message": "Already subscribed"}
    doc = {
        "email": body.email.lower(),
        "name": body.name,
        "status": "active",
        "subscribed_at": _now(),
        "source": body.source,
    }
    await db.newsletter_subscribers.insert_one(doc)
    return {"success": True}


# ─── Waitlist ──────────────────────────────────────────────────────────────

class WaitlistJoinData(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    product: Optional[str] = "gorakhai"
    company: Optional[str] = None
    use_case: Optional[str] = None


@router.post("/waitlist/join")
async def waitlist_join(body: WaitlistJoinData):
    db = get_db()
    existing = await db.waitlist_subscribers.find_one({"email": body.email.lower()})
    if existing:
        return {"success": True, "message": "Already on waitlist"}
    doc = {
        "email": body.email.lower(),
        "name": body.name,
        "product": body.product,
        "company": body.company,
        "use_case": body.use_case,
        "status": "waitlisted",
        "created_at": _now(),
    }
    await db.waitlist_subscribers.insert_one(doc)
    return {"success": True}


# ─── Expert Network ────────────────────────────────────────────────────────

class ExpertApplyData(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    expertise_areas: Optional[list] = []
    years_of_experience: Optional[int] = 0
    linkedin_url: Optional[str] = None
    bio: str


@router.post("/experts/apply")
async def expert_apply(body: ExpertApplyData):
    db = get_db()
    existing = await db.expert_network_registrations.find_one({"email": body.email.lower()})
    if existing:
        return {"success": True, "message": "Application already submitted"}
    doc = {
        **body.model_dump(),
        "email": body.email.lower(),
        "status": "pending",
        "reviewed_by": None,
        "reviewed_at": None,
        "notes": None,
        "created_at": _now(),
    }
    await db.expert_network_registrations.insert_one(doc)
    return {"success": True}


# ─── Job Applications ──────────────────────────────────────────────────────

class JobApplicationData(BaseModel):
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None


@router.post("/careers/apply")
async def job_apply(body: JobApplicationData):
    db = get_db()
    doc = {
        **body.model_dump(),
        "email": body.email.lower(),
        "status": "new",
        "created_at": _now(),
    }
    result = await db.job_applications.insert_one(doc)
    return {"success": True, "id": str(result.inserted_id)}
