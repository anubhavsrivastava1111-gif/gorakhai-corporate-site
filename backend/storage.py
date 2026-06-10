"""
Storage abstraction layer for Gorakhai CMS media files.

Architecture:
    StorageProvider  (abstract interface)
    ├── LocalStorage  (default — filesystem under UPLOADS_DIR)
    └── R2Storage     (stub — activate by setting STORAGE_PROVIDER=r2 in .env
                       and providing R2_* credentials; no code rewrite required)

Swapping providers: change STORAGE_PROVIDER env var + add R2 credentials.
All callers use get_storage_provider() — they never import a concrete class.
"""

from __future__ import annotations

import os
import uuid
import logging
import mimetypes
from abc import ABC, abstractmethod
from pathlib import Path
from datetime import datetime, timezone

import aiofiles

logger = logging.getLogger(__name__)


# ─── Base interface ────────────────────────────────────────────────────────────

class StorageProvider(ABC):
    """Minimal interface every storage backend must implement."""

    @abstractmethod
    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        """Persist *data* and return the public URL (or path) of the stored file."""

    @abstractmethod
    async def delete(self, stored_ref: str) -> None:
        """Remove the file identified by *stored_ref* (URL or key)."""

    @abstractmethod
    def public_url(self, stored_ref: str) -> str:
        """Return the HTTP URL that browsers can fetch directly."""


# ─── Local filesystem ──────────────────────────────────────────────────────────

class LocalStorage(StorageProvider):
    """Stores files under UPLOADS_DIR and serves them via /api/media/:filename."""

    def __init__(self, uploads_dir: Path):
        self.uploads_dir = uploads_dir
        self.uploads_dir.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        dest = self.uploads_dir / filename
        async with aiofiles.open(dest, "wb") as f:
            await f.write(data)
        # stored_ref = the filename alone (provider-agnostic key)
        return filename

    async def delete(self, stored_ref: str) -> None:
        target = self.uploads_dir / stored_ref
        if target.exists():
            target.unlink()

    def public_url(self, stored_ref: str) -> str:
        # Routed through the FastAPI backend
        return f"/api/media/{stored_ref}"


# ─── Cloudflare R2 stub ────────────────────────────────────────────────────────

class R2Storage(StorageProvider):
    """
    Cloudflare R2 provider — NOT active in this deployment.

    To activate:
        1. Set STORAGE_PROVIDER=r2 in backend/.env
        2. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
           R2_BUCKET_NAME, R2_PUBLIC_URL to backend/.env
        3. Run:  pip install boto3

    No application code changes are needed.
    """

    def __init__(self):
        try:
            import boto3  # type: ignore
            self._client = boto3.client(
                "s3",
                endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
                aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
                aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
                region_name="auto",
            )
            self._bucket = os.environ["R2_BUCKET_NAME"]
            self._public_base = os.environ["R2_PUBLIC_URL"].rstrip("/")
        except ImportError:
            raise RuntimeError(
                "boto3 is not installed. Run: pip install boto3  "
                "then set STORAGE_PROVIDER=r2 in .env"
            )

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self._client.put_object(
                Bucket=self._bucket,
                Key=filename,
                Body=data,
                ContentType=content_type,
            ),
        )
        return filename

    async def delete(self, stored_ref: str) -> None:
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self._client.delete_object(Bucket=self._bucket, Key=stored_ref),
        )

    def public_url(self, stored_ref: str) -> str:
        return f"{self._public_base}/{stored_ref}"


# ─── Factory ───────────────────────────────────────────────────────────────────

_provider: StorageProvider | None = None


def get_storage_provider() -> StorageProvider:
    """Return the singleton storage provider configured via STORAGE_PROVIDER env var."""
    global _provider
    if _provider is not None:
        return _provider

    provider_name = os.environ.get("STORAGE_PROVIDER", "local").lower()

    if provider_name == "r2":
        logger.info("Storage: Cloudflare R2")
        _provider = R2Storage()
    else:
        uploads_dir = Path(
            os.environ.get("UPLOADS_DIR", Path(__file__).parent / "uploads")
        )
        logger.info(f"Storage: LocalStorage → {uploads_dir}")
        _provider = LocalStorage(uploads_dir)

    return _provider


# ─── Utility helpers ───────────────────────────────────────────────────────────

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf",
}
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def generate_unique_filename(original_filename: str) -> str:
    """Return a UUID-prefixed filename that preserves the original extension."""
    suffix = Path(original_filename).suffix.lower() or ".bin"
    return f"{uuid.uuid4().hex}{suffix}"


def get_content_type(filename: str) -> str:
    ct, _ = mimetypes.guess_type(filename)
    return ct or "application/octet-stream"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
