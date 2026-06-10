"""
Media management routes.

Endpoints:
    POST   /api/admin/media/upload       Upload a file (admin only)
    GET    /api/admin/media              List media library (admin only)
    GET    /api/admin/media/:id          Get single media record (admin only)
    PATCH  /api/admin/media/:id          Update alt text / metadata (admin only)
    DELETE /api/admin/media/:id          Delete file + metadata (admin only)
    GET    /api/media/:filename          Serve stored file (public, cached)
"""

import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from bson import ObjectId

from db import get_db
from auth import get_current_user
from storage import (
    get_storage_provider,
    generate_unique_filename,
    get_content_type,
    ALLOWED_MIME_TYPES,
    MAX_UPLOAD_SIZE_BYTES,
    now_iso,
)

logger = logging.getLogger(__name__)

admin_router = APIRouter(prefix="/api/admin/media", tags=["media-admin"])
public_router = APIRouter(prefix="/api/media", tags=["media-public"])


# ─── Helpers ───────────────────────────────────────────────────────────────────

def _doc(doc: dict) -> dict:
    d = {k: v for k, v in doc.items() if k != "_id"}
    d["id"] = str(doc["_id"])
    return d


# ─── Upload ────────────────────────────────────────────────────────────────────

@admin_router.post("/upload", status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    context: Optional[str] = Form(None),  # e.g. "blog_cover", "blog_content", "expert_photo"
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    storage = get_storage_provider()

    # Validate mime type
    content_type = file.content_type or get_content_type(file.filename or "")
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {content_type}. Allowed: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    # Read and validate size
    data = await file.read()
    if len(data) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_UPLOAD_SIZE_BYTES // (1024*1024)} MB.",
        )

    # Generate unique filename and persist
    unique_name = generate_unique_filename(file.filename or "upload")
    stored_ref = await storage.save(data, unique_name, content_type)
    public_url = storage.public_url(stored_ref)

    # Store metadata
    meta = {
        "filename": unique_name,
        "original_filename": file.filename or unique_name,
        "stored_ref": stored_ref,          # provider-agnostic key for future migration
        "url": public_url,
        "content_type": content_type,
        "size_bytes": len(data),
        "alt_text": alt_text or "",
        "context": context or "general",  # semantic tag for media library filtering
        "storage_provider": type(storage).__name__,
        "uploaded_by": current_user["email"],
        "uploaded_by_id": current_user["_id"],
        "created_at": now_iso(),
    }
    result = await db.media.insert_one(meta)
    meta["id"] = str(result.inserted_id)
    meta.pop("_id", None)

    logger.info(f"Media uploaded: {unique_name} by {current_user['email']}")
    return meta


# ─── List media library ────────────────────────────────────────────────────────

@admin_router.get("")
async def list_media(
    page: int = 1,
    limit: int = 30,
    context: Optional[str] = None,
    content_type_prefix: Optional[str] = None,  # e.g. "image"
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    query: dict = {}
    if context:
        query["context"] = context
    if content_type_prefix:
        query["content_type"] = {"$regex": f"^{content_type_prefix}"}

    skip = (page - 1) * limit
    cursor = db.media.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items = [_doc(d) async for d in cursor]
    total = await db.media.count_documents(query)
    return {"items": items, "total": total, "page": page, "limit": limit}


# ─── Get single ───────────────────────────────────────────────────────────────

@admin_router.get("/{media_id}")
async def get_media(media_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    try:
        doc = await db.media.find_one({"_id": ObjectId(media_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid media ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Media not found")
    return _doc(doc)


# ─── Update metadata ──────────────────────────────────────────────────────────

class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None
    context: Optional[str] = None


@admin_router.patch("/{media_id}")
async def update_media(
    media_id: str,
    body: MediaUpdate,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    try:
        oid = ObjectId(media_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid media ID")
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await db.media.update_one({"_id": oid}, {"$set": updates})
    updated = await db.media.find_one({"_id": oid})
    return _doc(updated)


# ─── Delete ───────────────────────────────────────────────────────────────────

@admin_router.delete("/{media_id}", status_code=204)
async def delete_media(
    media_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    storage = get_storage_provider()
    try:
        oid = ObjectId(media_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid media ID")
    doc = await db.media.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Media not found")

    # Delete from storage
    await storage.delete(doc["stored_ref"])
    # Delete metadata
    await db.media.delete_one({"_id": oid})
    logger.info(f"Media deleted: {doc['filename']} by {current_user['email']}")


# ─── Public file serving ──────────────────────────────────────────────────────

@public_router.get("/{filename}")
async def serve_media(filename: str):
    """
    Serve locally-stored media files.
    For R2/cloud storage, this endpoint will redirect to the CDN URL instead.
    """
    storage = get_storage_provider()

    # For cloud providers, redirect to CDN URL
    provider_name = type(storage).__name__
    if provider_name != "LocalStorage":
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=storage.public_url(filename))

    # Local: serve from filesystem
    from storage import LocalStorage
    uploads_dir = storage.uploads_dir  # type: ignore[union-attr]
    file_path = uploads_dir / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    content_type = get_content_type(filename)
    return FileResponse(
        path=str(file_path),
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
