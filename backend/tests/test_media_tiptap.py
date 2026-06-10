"""
Media upload/serve/list/delete API tests + public blog regression
"""
import pytest
import requests
import os
import io
from pathlib import Path

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


@pytest.fixture(scope="module")
def auth_token():
    resp = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "superadmin@gorakhai.com",
        "password": "GorakhaiAdmin2026!"
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    return resp.cookies


@pytest.fixture(scope="module")
def session(auth_token):
    s = requests.Session()
    s.cookies.update(auth_token)
    return s


# ─── Health ────────────────────────────────────────────────────────────────────

def test_health():
    resp = requests.get(f"{BASE_URL}/api/")
    assert resp.status_code == 200
    data = resp.json()
    assert "message" in data
    print(f"Health: {data['message']}")


# ─── Media Upload ──────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def uploaded_media(session):
    """Upload a test PNG and return the media record."""
    # Create a minimal 1x1 PNG in memory
    png_bytes = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00'
        b'\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        )
    files = {"file": ("test_image.png", io.BytesIO(png_bytes), "image/png")}
    data = {"context": "TEST_media", "alt_text": "Test upload"}
    resp = session.post(f"{BASE_URL}/api/admin/media/upload", files=files, data=data)
    assert resp.status_code == 201, f"Upload failed: {resp.text}"
    return resp.json()


def test_upload_returns_metadata(uploaded_media):
    m = uploaded_media
    assert "id" in m
    assert "filename" in m
    assert "url" in m
    assert "content_type" in m
    assert m["content_type"] == "image/png"
    assert m["context"] == "TEST_media"
    print(f"Uploaded: {m['filename']} -> {m['url']}")


def test_upload_reject_non_image(session):
    files = {"file": ("test.txt", io.BytesIO(b"hello world"), "text/plain")}
    resp = session.post(f"{BASE_URL}/api/admin/media/upload", files=files)
    assert resp.status_code == 415, f"Expected 415, got {resp.status_code}: {resp.text}"


def test_upload_reject_oversized(session):
    # 11MB fake data
    big_data = b"x" * (11 * 1024 * 1024)
    files = {"file": ("big.png", io.BytesIO(big_data), "image/png")}
    resp = session.post(f"{BASE_URL}/api/admin/media/upload", files=files)
    assert resp.status_code == 413, f"Expected 413, got {resp.status_code}"


# ─── Media Serve ───────────────────────────────────────────────────────────────

def test_serve_uploaded_file(uploaded_media):
    url_path = uploaded_media["url"]  # e.g. /api/media/filename.png
    full_url = f"{BASE_URL}{url_path}"
    resp = requests.get(full_url)
    assert resp.status_code == 200, f"Serve failed: {resp.status_code}"
    assert "image" in resp.headers.get("content-type", "")
    print(f"Served OK: {full_url}")


# ─── Media List ────────────────────────────────────────────────────────────────

def test_list_media(session, uploaded_media):
    resp = session.get(f"{BASE_URL}/api/admin/media")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1
    ids = [item["id"] for item in data["items"]]
    assert uploaded_media["id"] in ids
    print(f"Media list total: {data['total']}")


# ─── Media Metadata ────────────────────────────────────────────────────────────

def test_get_media_by_id(session, uploaded_media):
    media_id = uploaded_media["id"]
    resp = session.get(f"{BASE_URL}/api/admin/media/{media_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == media_id
    assert data["filename"] == uploaded_media["filename"]


# ─── Media Delete ─────────────────────────────────────────────────────────────

def test_delete_media(session, uploaded_media):
    media_id = uploaded_media["id"]
    filename = uploaded_media["filename"]

    resp = session.delete(f"{BASE_URL}/api/admin/media/{media_id}")
    assert resp.status_code == 204, f"Delete failed: {resp.status_code} {resp.text}"

    # Verify removed from DB
    get_resp = session.get(f"{BASE_URL}/api/admin/media/{media_id}")
    assert get_resp.status_code == 404

    # Verify file removed from filesystem
    file_path = Path(f"/app/backend/uploads/{filename}")
    assert not file_path.exists(), f"File still exists on disk: {file_path}"
    print(f"Deleted: {filename}")


# ─── File on filesystem ────────────────────────────────────────────────────────

def test_uploads_dir_exists():
    uploads_dir = Path("/app/backend/uploads")
    assert uploads_dir.exists(), "uploads/ directory does not exist"
    print(f"Uploads dir exists: {uploads_dir}")


# ─── Public Blog Regression ───────────────────────────────────────────────────

def test_public_blog_returns_posts():
    resp = requests.get(f"{BASE_URL}/api/public/blog")
    assert resp.status_code == 200
    data = resp.json()
    assert "posts" in data or isinstance(data, list) or "items" in data
    print(f"Public blog response keys: {list(data.keys()) if isinstance(data, dict) else 'list'}")
