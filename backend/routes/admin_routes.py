import re
import logging
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from db import get_db
from auth import get_current_user, require_roles, hash_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])


# ─── Helpers ───────────────────────────────────────────────────────────────

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _convert(v):
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, dict):
        return {k: _convert(val) for k, val in v.items()}
    if isinstance(v, list):
        return [_convert(i) for i in v]
    return v


def _doc(doc: dict) -> dict:
    d = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        d[k] = _convert(v)
    d["id"] = str(doc["_id"])
    return d


def _slug(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")


def _get_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


async def _audit(db, user: dict, action: str, resource_type: str,
                 resource_id: Optional[str] = None, before=None, after=None,
                 changes=None, ip: Optional[str] = None):
    await db.audit_logs.insert_one({
        "user_id": str(user["_id"]),
        "user_email": user["email"],
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "before_state": before,
        "after_state": after,
        "changes": changes,
        "ip_address": ip,
        "created_at": _now(),
    })


async def _activity(db, user: dict, action: str, resource_type: str,
                    resource_id: Optional[str] = None, resource_title: Optional[str] = None,
                    metadata=None, ip: Optional[str] = None):
    await db.activity_logs.insert_one({
        "user_id": user["_id"],
        "user_email": user["email"],
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "resource_title": resource_title,
        "metadata": metadata,
        "ip_address": ip,
        "created_at": _now(),
    })


# ─── Dashboard Stats ────────────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    db = get_db()
    stats = {
        "blog_posts": {
            "total": await db.blog_posts.count_documents({}),
            "published": await db.blog_posts.count_documents({"status": "published"}),
            "draft": await db.blog_posts.count_documents({"status": "draft"}),
        },
        "job_listings": {
            "total": await db.job_listings.count_documents({}),
            "open": await db.job_listings.count_documents({"status": "open"}),
            "closed": await db.job_listings.count_documents({"status": "closed"}),
        },
        "leads": {
            "total": await db.contact_submissions.count_documents({}),
            "new": await db.contact_submissions.count_documents({"status": "new"}),
        },
        "newsletter": {
            "total": await db.newsletter_subscribers.count_documents({}),
            "active": await db.newsletter_subscribers.count_documents({"status": "active"}),
        },
        "experts": {
            "total": await db.expert_network_registrations.count_documents({}),
            "pending": await db.expert_network_registrations.count_documents({"status": "pending"}),
            "approved": await db.expert_network_registrations.count_documents({"status": "approved"}),
        },
        "waitlist": {
            "total": await db.waitlist_subscribers.count_documents({}),
            "waitlisted": await db.waitlist_subscribers.count_documents({"status": "waitlisted"}),
        },
    }
    # Recent audit log entries
    cursor = db.audit_logs.find({}).sort("created_at", -1).limit(10)
    recent_activity = [_doc(d) async for d in cursor]
    return {"stats": stats, "recent_activity": recent_activity}


# ─── Blog Posts ─────────────────────────────────────────────────────────────

class BlogPostCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: str
    content: str
    author_name: Optional[str] = None
    status: str = "draft"
    category: Optional[str] = None
    tags: List[str] = []
    cover_image_url: Optional[str] = None
    read_time_mins: Optional[int] = 5


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author_name: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    cover_image_url: Optional[str] = None
    read_time_mins: Optional[int] = None


content_roles = require_roles("content_admin", "super_admin")


@router.get("/blog")
async def admin_list_blog(
    page: int = 1, limit: int = 20, status: Optional[str] = None,
    current_user: dict = Depends(content_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    skip = (page - 1) * limit
    cursor = db.blog_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = [_doc(d) async for d in cursor]
    total = await db.blog_posts.count_documents(query)
    return {"posts": posts, "total": total, "page": page, "limit": limit}


@router.get("/blog/{post_id}")
async def admin_get_blog_post(post_id: str, current_user: dict = Depends(content_roles)):
    db = get_db()
    try:
        doc = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _doc(doc)


@router.post("/blog", status_code=201)
async def admin_create_blog_post(
    body: BlogPostCreate, request: Request, current_user: dict = Depends(content_roles)
):
    db = get_db()
    slug = body.slug or _slug(body.title)
    # Ensure unique slug
    existing = await db.blog_posts.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{int(datetime.now(timezone.utc).timestamp())}"

    doc = {
        **body.model_dump(),
        "slug": slug,
        "author_name": body.author_name or current_user.get("name", "Admin"),
        "author_id": current_user["_id"],
        "view_count": 0,
        "published_at": _now() if body.status == "published" else None,
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = await db.blog_posts.insert_one(doc)
    post_id = str(result.inserted_id)
    ip = _get_ip(request)
    await _audit(db, current_user, "create", "blog_post", post_id, after=_doc({**doc, "_id": result.inserted_id}), ip=ip)
    await _activity(db, current_user, "created blog post", "blog_post", post_id, body.title, ip=ip)
    doc["_id"] = result.inserted_id
    return _doc(doc)


@router.put("/blog/{post_id}")
async def admin_update_blog_post(
    post_id: str, body: BlogPostUpdate, request: Request,
    current_user: dict = Depends(content_roles),
):
    db = get_db()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    existing = await db.blog_posts.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = _now()

    # Handle publish_at
    if updates.get("status") == "published" and not existing.get("published_at"):
        updates["published_at"] = _now()

    # Handle slug uniqueness
    if "slug" in updates and updates["slug"] != existing.get("slug"):
        dupe = await db.blog_posts.find_one({"slug": updates["slug"], "_id": {"$ne": oid}})
        if dupe:
            raise HTTPException(status_code=409, detail="Slug already exists")

    changes = {k: {"from": existing.get(k), "to": v} for k, v in updates.items() if k != "updated_at"}
    await db.blog_posts.update_one({"_id": oid}, {"$set": updates})
    ip = _get_ip(request)
    await _audit(db, current_user, "update", "blog_post", post_id, before=_doc(existing), changes=changes, ip=ip)
    await _activity(db, current_user, "updated blog post", "blog_post", post_id, existing.get("title"), ip=ip)
    updated = await db.blog_posts.find_one({"_id": oid})
    return _doc(updated)


@router.delete("/blog/{post_id}", status_code=204)
async def admin_delete_blog_post(
    post_id: str, request: Request, current_user: dict = Depends(content_roles)
):
    db = get_db()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    existing = await db.blog_posts.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.blog_posts.delete_one({"_id": oid})
    ip = _get_ip(request)
    await _audit(db, current_user, "delete", "blog_post", post_id, before=_doc(existing), ip=ip)
    await _activity(db, current_user, "deleted blog post", "blog_post", post_id, existing.get("title"), ip=ip)


# ─── Job Listings ───────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    department: str
    location: str
    type: str = "Full-time"
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    description: str
    requirements: List[str] = []
    responsibilities: List[str] = []
    status: str = "open"
    closes_at: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    status: Optional[str] = None
    closes_at: Optional[str] = None


@router.get("/careers")
async def admin_list_careers(
    page: int = 1, limit: int = 20, status: Optional[str] = None,
    department: Optional[str] = None, current_user: dict = Depends(content_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    if department:
        query["department"] = department
    skip = (page - 1) * limit
    cursor = db.job_listings.find(query).sort("created_at", -1).skip(skip).limit(limit)
    jobs = [_doc(d) async for d in cursor]
    total = await db.job_listings.count_documents(query)
    return {"jobs": jobs, "total": total, "page": page, "limit": limit}


@router.get("/careers/{job_id}")
async def admin_get_career(job_id: str, current_user: dict = Depends(content_roles)):
    db = get_db()
    try:
        doc = await db.job_listings.find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Job not found")
    return _doc(doc)


@router.post("/careers", status_code=201)
async def admin_create_career(
    body: JobCreate, request: Request, current_user: dict = Depends(content_roles)
):
    db = get_db()
    slug = body.slug or _slug(body.title)
    existing = await db.job_listings.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{int(datetime.now(timezone.utc).timestamp())}"

    doc = {
        **body.model_dump(),
        "slug": slug,
        "posted_at": _now(),
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = await db.job_listings.insert_one(doc)
    job_id = str(result.inserted_id)
    ip = _get_ip(request)
    await _audit(db, current_user, "create", "job_listing", job_id, after=doc, ip=ip)
    await _activity(db, current_user, "created job listing", "job_listing", job_id, body.title, ip=ip)
    doc["_id"] = result.inserted_id
    return _doc(doc)


@router.put("/careers/{job_id}")
async def admin_update_career(
    job_id: str, body: JobUpdate, request: Request,
    current_user: dict = Depends(content_roles),
):
    db = get_db()
    try:
        oid = ObjectId(job_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    existing = await db.job_listings.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Job not found")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = _now()
    changes = {k: {"from": existing.get(k), "to": v} for k, v in updates.items() if k != "updated_at"}
    await db.job_listings.update_one({"_id": oid}, {"$set": updates})
    ip = _get_ip(request)
    await _audit(db, current_user, "update", "job_listing", job_id, before=_doc(existing), changes=changes, ip=ip)
    await _activity(db, current_user, "updated job listing", "job_listing", job_id, existing.get("title"), ip=ip)
    updated = await db.job_listings.find_one({"_id": oid})
    return _doc(updated)


@router.delete("/careers/{job_id}", status_code=204)
async def admin_delete_career(
    job_id: str, request: Request, current_user: dict = Depends(content_roles)
):
    db = get_db()
    try:
        oid = ObjectId(job_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    existing = await db.job_listings.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Job not found")
    await db.job_listings.delete_one({"_id": oid})
    ip = _get_ip(request)
    await _audit(db, current_user, "delete", "job_listing", job_id, before=_doc(existing), ip=ip)
    await _activity(db, current_user, "deleted job listing", "job_listing", job_id, existing.get("title"), ip=ip)


# ─── Leads / Contact Submissions ───────────────────────────────────────────

community_roles = require_roles("community_admin", "super_admin")


class LeadStatusUpdate(BaseModel):
    status: str  # new | reviewed | archived | replied


@router.get("/leads")
async def admin_list_leads(
    page: int = 1, limit: int = 20, status: Optional[str] = None,
    current_user: dict = Depends(community_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    skip = (page - 1) * limit
    cursor = db.contact_submissions.find(query).sort("created_at", -1).skip(skip).limit(limit)
    leads = [_doc(d) async for d in cursor]
    total = await db.contact_submissions.count_documents(query)
    return {"leads": leads, "total": total, "page": page, "limit": limit}


@router.get("/leads/{lead_id}")
async def admin_get_lead(lead_id: str, current_user: dict = Depends(community_roles)):
    db = get_db()
    try:
        doc = await db.contact_submissions.find_one({"_id": ObjectId(lead_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _doc(doc)


@router.patch("/leads/{lead_id}/status")
async def admin_update_lead_status(
    lead_id: str, body: LeadStatusUpdate, request: Request,
    current_user: dict = Depends(community_roles),
):
    db = get_db()
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.contact_submissions.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Lead not found")
    old_status = existing.get("status")
    await db.contact_submissions.update_one(
        {"_id": oid}, {"$set": {"status": body.status, "updated_at": _now()}}
    )
    ip = _get_ip(request)
    await _audit(db, current_user, "status_change", "lead", lead_id,
                 changes={"status": {"from": old_status, "to": body.status}}, ip=ip)
    await _activity(db, current_user, f"changed lead status to {body.status}", "lead",
                    lead_id, existing.get("email"), ip=ip)
    updated = await db.contact_submissions.find_one({"_id": oid})
    return _doc(updated)


# ─── Newsletter Subscribers ─────────────────────────────────────────────────

@router.get("/newsletter")
async def admin_list_newsletter(
    page: int = 1, limit: int = 50, status: Optional[str] = None,
    current_user: dict = Depends(community_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    skip = (page - 1) * limit
    cursor = db.newsletter_subscribers.find(query).sort("subscribed_at", -1).skip(skip).limit(limit)
    subscribers = [_doc(d) async for d in cursor]
    total = await db.newsletter_subscribers.count_documents(query)
    return {"subscribers": subscribers, "total": total, "page": page, "limit": limit}


@router.delete("/newsletter/{sub_id}", status_code=204)
async def admin_remove_newsletter(
    sub_id: str, request: Request, current_user: dict = Depends(community_roles)
):
    db = get_db()
    try:
        oid = ObjectId(sub_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.newsletter_subscribers.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    await db.newsletter_subscribers.update_one(
        {"_id": oid}, {"$set": {"status": "unsubscribed", "updated_at": _now()}}
    )
    ip = _get_ip(request)
    await _audit(db, current_user, "status_change", "newsletter_subscriber", sub_id,
                 changes={"status": {"from": existing.get("status"), "to": "unsubscribed"}}, ip=ip)


# ─── Expert Network ──────────────────────────────────────────────────────────

expert_roles = require_roles("expert_network_admin", "super_admin")


class ExpertStatusUpdate(BaseModel):
    status: str  # approved | rejected | pending
    notes: Optional[str] = None


@router.get("/experts")
async def admin_list_experts(
    page: int = 1, limit: int = 20, status: Optional[str] = None,
    current_user: dict = Depends(expert_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    skip = (page - 1) * limit
    cursor = db.expert_network_registrations.find(query).sort("created_at", -1).skip(skip).limit(limit)
    experts = [_doc(d) async for d in cursor]
    total = await db.expert_network_registrations.count_documents(query)
    return {"experts": experts, "total": total, "page": page, "limit": limit}


@router.get("/experts/{expert_id}")
async def admin_get_expert(expert_id: str, current_user: dict = Depends(expert_roles)):
    db = get_db()
    try:
        doc = await db.expert_network_registrations.find_one({"_id": ObjectId(expert_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Expert not found")
    return _doc(doc)


@router.patch("/experts/{expert_id}/status")
async def admin_update_expert_status(
    expert_id: str, body: ExpertStatusUpdate, request: Request,
    current_user: dict = Depends(expert_roles),
):
    db = get_db()
    try:
        oid = ObjectId(expert_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.expert_network_registrations.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Expert not found")
    old_status = existing.get("status")
    updates = {
        "status": body.status,
        "reviewed_by": current_user["email"],
        "reviewed_at": _now(),
    }
    if body.notes is not None:
        updates["notes"] = body.notes
    await db.expert_network_registrations.update_one({"_id": oid}, {"$set": updates})
    action = "approve" if body.status == "approved" else "reject" if body.status == "rejected" else "status_change"
    ip = _get_ip(request)
    await _audit(db, current_user, action, "expert", expert_id,
                 before=_doc(existing), changes={"status": {"from": old_status, "to": body.status}}, ip=ip)
    name = f"{existing.get('first_name', '')} {existing.get('last_name', '')}".strip()
    await _activity(db, current_user, f"{action}d expert application", "expert",
                    expert_id, name, ip=ip)
    updated = await db.expert_network_registrations.find_one({"_id": oid})
    return _doc(updated)


# ─── Waitlist ────────────────────────────────────────────────────────────────

class WaitlistStatusUpdate(BaseModel):
    status: str  # waitlisted | invited | converted


@router.get("/waitlist")
async def admin_list_waitlist(
    page: int = 1, limit: int = 50, status: Optional[str] = None,
    product: Optional[str] = None, current_user: dict = Depends(community_roles),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    if product:
        query["product"] = product
    skip = (page - 1) * limit
    cursor = db.waitlist_subscribers.find(query).sort("created_at", -1).skip(skip).limit(limit)
    subscribers = [_doc(d) async for d in cursor]
    total = await db.waitlist_subscribers.count_documents(query)
    return {"subscribers": subscribers, "total": total, "page": page, "limit": limit}


@router.patch("/waitlist/{sub_id}/status")
async def admin_update_waitlist_status(
    sub_id: str, body: WaitlistStatusUpdate, request: Request,
    current_user: dict = Depends(community_roles),
):
    db = get_db()
    try:
        oid = ObjectId(sub_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.waitlist_subscribers.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    old_status = existing.get("status")
    await db.waitlist_subscribers.update_one(
        {"_id": oid}, {"$set": {"status": body.status, "updated_at": _now()}}
    )
    ip = _get_ip(request)
    await _audit(db, current_user, "status_change", "waitlist_subscriber", sub_id,
                 changes={"status": {"from": old_status, "to": body.status}}, ip=ip)
    updated = await db.waitlist_subscribers.find_one({"_id": oid})
    return _doc(updated)


# ─── Admin Users (Super Admin only) ─────────────────────────────────────────

super_only = require_roles("super_admin")


class AdminUserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str  # content_admin | community_admin | expert_network_admin | super_admin


class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


@router.get("/users")
async def admin_list_users(current_user: dict = Depends(super_only)):
    db = get_db()
    cursor = db.admin_users.find({}, {"password_hash": 0})
    users = [_doc(d) async for d in cursor]
    return {"users": users}


@router.post("/users", status_code=201)
async def admin_create_user(
    body: AdminUserCreate, request: Request, current_user: dict = Depends(super_only)
):
    db = get_db()
    email = body.email.lower()
    existing = await db.admin_users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="User with this email already exists")
    doc = {
        "email": email,
        "name": body.name,
        "password_hash": hash_password(body.password),
        "role": body.role,
        "is_active": True,
        "created_at": _now(),
        "updated_at": _now(),
        "last_login": None,
    }
    result = await db.admin_users.insert_one(doc)
    user_id = str(result.inserted_id)
    ip = _get_ip(request)
    await _audit(db, current_user, "create", "admin_user", user_id,
                 after={"email": email, "name": body.name, "role": body.role}, ip=ip)
    await _activity(db, current_user, "created admin user", "admin_user", user_id, body.name, ip=ip)
    return {"id": user_id, "email": email, "name": body.name, "role": body.role, "is_active": True}


@router.put("/users/{user_id}")
async def admin_update_user(
    user_id: str, body: AdminUserUpdate, request: Request,
    current_user: dict = Depends(super_only),
):
    db = get_db()
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.admin_users.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    updates = {k: v for k, v in body.model_dump().items() if v is not None and k != "password"}
    if body.password:
        updates["password_hash"] = hash_password(body.password)
    updates["updated_at"] = _now()
    await db.admin_users.update_one({"_id": oid}, {"$set": updates})
    ip = _get_ip(request)
    await _audit(db, current_user, "update", "admin_user", user_id, ip=ip)
    updated = await db.admin_users.find_one({"_id": oid}, {"password_hash": 0})
    return _doc(updated)


@router.delete("/users/{user_id}", status_code=204)
async def admin_delete_user(
    user_id: str, request: Request, current_user: dict = Depends(super_only)
):
    db = get_db()
    if user_id == current_user["_id"]:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")
    existing = await db.admin_users.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    await db.admin_users.delete_one({"_id": oid})
    ip = _get_ip(request)
    await _audit(db, current_user, "delete", "admin_user", user_id, ip=ip)


# ─── Audit & Activity Logs ───────────────────────────────────────────────────

@router.get("/audit-logs")
async def admin_audit_logs(
    page: int = 1, limit: int = 50, resource_type: Optional[str] = None,
    action: Optional[str] = None, current_user: dict = Depends(super_only),
):
    db = get_db()
    query = {}
    if resource_type:
        query["resource_type"] = resource_type
    if action:
        query["action"] = action
    skip = (page - 1) * limit
    cursor = db.audit_logs.find(query).sort("created_at", -1).skip(skip).limit(limit)
    logs = [_doc(d) async for d in cursor]
    total = await db.audit_logs.count_documents(query)
    return {"logs": logs, "total": total, "page": page, "limit": limit}


@router.get("/activity-logs")
async def admin_activity_logs(
    page: int = 1, limit: int = 50, current_user: dict = Depends(super_only),
):
    db = get_db()
    skip = (page - 1) * limit
    cursor = db.activity_logs.find({}).sort("created_at", -1).skip(skip).limit(limit)
    logs = [_doc(d) async for d in cursor]
    total = await db.activity_logs.count_documents({})
    return {"logs": logs, "total": total, "page": page, "limit": limit}
