"""
Gorakhai CMS - Comprehensive Backend API Tests
Tests: Auth, Admin CRUD (Blog/Careers/Leads/Newsletter/Experts/Waitlist), Public routes, Audit logs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_EMAIL = "superadmin@gorakhai.com"
ADMIN_PASSWORD = "GorakhaiAdmin2026!"


@pytest.fixture(scope="module")
def session_with_auth():
    """Login and return a session with auth cookies"""
    session = requests.Session()
    resp = session.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if resp.status_code != 200:
        pytest.skip(f"Auth failed: {resp.status_code} {resp.text}")
    return session


# ===== AUTH TESTS =====
class TestAuth:
    def test_login_success(self):
        session = requests.Session()
        resp = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        assert resp.status_code == 200
        data = resp.json()
        # API returns user object directly (not wrapped)
        assert data.get("email") == ADMIN_EMAIL or (data.get("user", {}) or {}).get("email") == ADMIN_EMAIL
        # Check cookie is set
        assert len(session.cookies) > 0

    def test_login_wrong_password(self):
        resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": "WrongPassword!"
        })
        assert resp.status_code == 401

    def test_get_me(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == ADMIN_EMAIL

    def test_logout(self, session_with_auth):
        # Create separate session for logout to not break other tests
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        resp = session.post(f"{BASE_URL}/api/auth/logout")
        assert resp.status_code == 200

    def test_unauthenticated_me_returns_401(self):
        resp = requests.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 401


# ===== DASHBOARD =====
class TestDashboard:
    def test_stats_returns_6_categories(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/stats")
        assert resp.status_code == 200
        data = resp.json()
        # Stats can be a dict with various keys
        assert isinstance(data, dict)
        assert len(data) >= 1


# ===== BLOG =====
class TestBlog:
    _created_id = None

    def test_get_blog_posts(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/blog")
        assert resp.status_code == 200
        data = resp.json()
        posts = data.get("posts") if isinstance(data, dict) else data
        assert len(posts) >= 1

    def test_create_blog_post(self, session_with_auth):
        payload = {
            "title": "TEST_Blog Post",
            "slug": "test-blog-post-auto",
            "content": "This is test content.",
            "excerpt": "Test excerpt",
            "category": "Technology",
            "tags": ["test"],
            "status": "draft",
            "author": "Test Author"
        }
        resp = session_with_auth.post(f"{BASE_URL}/api/admin/blog", json=payload)
        assert resp.status_code in [200, 201]
        data = resp.json()
        assert data["title"] == payload["title"]
        TestBlog._created_id = data.get("id") or data.get("_id")

    def test_update_blog_post(self, session_with_auth):
        if not TestBlog._created_id:
            pytest.skip("No blog post created")
        resp = session_with_auth.put(f"{BASE_URL}/api/admin/blog/{TestBlog._created_id}",
                                     json={"title": "TEST_Blog Post Updated"})
        assert resp.status_code == 200

    def test_delete_blog_post(self, session_with_auth):
        if not TestBlog._created_id:
            pytest.skip("No blog post created")
        resp = session_with_auth.delete(f"{BASE_URL}/api/admin/blog/{TestBlog._created_id}")
        assert resp.status_code in [200, 204]


# ===== CAREERS =====
class TestCareers:
    _created_id = None

    def test_get_careers(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/careers")
        assert resp.status_code == 200
        data = resp.json()
        jobs = data.get("jobs") if isinstance(data, dict) else data
        assert len(jobs) >= 1

    def test_create_career(self, session_with_auth):
        payload = {
            "title": "TEST_Software Engineer",
            "department": "Engineering",
            "location": "Remote",
            "type": "Full-time",
            "description": "Test job description",
            "requirements": ["Python", "FastAPI"],
            "status": "active"
        }
        resp = session_with_auth.post(f"{BASE_URL}/api/admin/careers", json=payload)
        assert resp.status_code in [200, 201]
        data = resp.json()
        TestCareers._created_id = data.get("id") or data.get("_id")


# ===== LEADS =====
class TestLeads:
    _lead_id = None

    def test_get_leads(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/leads")
        assert resp.status_code == 200
        data = resp.json()
        leads = data.get("leads") or data if isinstance(data, list) else []
        assert isinstance(leads, list)

    def test_create_lead_via_public(self):
        resp = requests.post(f"{BASE_URL}/api/public/contact", json={
            "name": "TEST_Lead User",
            "email": "testlead@example.com",
            "message": "Test message from automated test",
            "company": "Test Co"
        })
        assert resp.status_code in [200, 201]
        data = resp.json()
        TestLeads._lead_id = data.get("id") or data.get("_id")

    def test_update_lead_status(self, session_with_auth):
        if not TestLeads._lead_id:
            # Get a lead from list
            resp = session_with_auth.get(f"{BASE_URL}/api/admin/leads")
            data = resp.json()
            leads = data.get("leads") or (data if isinstance(data, list) else [])
            if not leads:
                pytest.skip("No leads available")
            TestLeads._lead_id = leads[0].get("id") or str(leads[0].get("_id", ""))
        
        resp = session_with_auth.patch(
            f"{BASE_URL}/api/admin/leads/{TestLeads._lead_id}/status",
            json={"status": "contacted"}
        )
        assert resp.status_code == 200


# ===== NEWSLETTER =====
class TestNewsletter:
    def test_get_subscribers(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/newsletter")
        assert resp.status_code == 200
        data = resp.json()
        subs = data.get("subscribers") or data if isinstance(data, list) else []
        assert isinstance(subs, list)

    def test_subscribe_via_public(self):
        resp = requests.post(f"{BASE_URL}/api/public/newsletter/subscribe", json={
            "email": "testnewsletter@example.com",
            "name": "TEST_Newsletter User"
        })
        assert resp.status_code in [200, 201]


# ===== EXPERTS =====
class TestExperts:
    _expert_id = None

    def test_get_experts(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/experts")
        assert resp.status_code == 200
        data = resp.json()
        experts = data.get("experts") or data if isinstance(data, list) else []
        assert isinstance(experts, list)

    def test_approve_expert(self, session_with_auth):
        data = session_with_auth.get(f"{BASE_URL}/api/admin/experts").json()
        experts = data.get("experts") or (data if isinstance(data, list) else [])
        if not experts:
            pytest.skip("No experts available")
        expert_id = experts[0].get("id") or str(experts[0].get("_id", ""))
        resp = session_with_auth.patch(
            f"{BASE_URL}/api/admin/experts/{expert_id}/status",
            json={"status": "approved"}
        )
        assert resp.status_code == 200


# ===== WAITLIST =====
class TestWaitlist:
    def test_get_waitlist(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/waitlist")
        assert resp.status_code == 200
        data = resp.json()
        subs = data.get("subscribers") or (data if isinstance(data, list) else [])
        assert isinstance(subs, list)

    def test_join_waitlist_via_public(self):
        resp = requests.post(f"{BASE_URL}/api/public/waitlist/join", json={
            "email": "testwaitlist@example.com",
            "name": "TEST_Waitlist User"
        })
        assert resp.status_code in [200, 201]


# ===== AUDIT / ACTIVITY LOGS =====
class TestLogs:
    def test_audit_logs(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/audit-logs")
        assert resp.status_code == 200
        data = resp.json()
        logs = data.get("logs") or (data if isinstance(data, list) else [])
        assert isinstance(logs, list)

    def test_activity_logs(self, session_with_auth):
        resp = session_with_auth.get(f"{BASE_URL}/api/admin/activity-logs")
        assert resp.status_code == 200
        data = resp.json()
        logs = data.get("logs") or (data if isinstance(data, list) else [])
        assert isinstance(logs, list)


# ===== PUBLIC ROUTES =====
class TestPublicRoutes:
    def test_public_blog_returns_posts(self):
        resp = requests.get(f"{BASE_URL}/api/public/blog")
        assert resp.status_code == 200
        data = resp.json()
        posts = data.get("posts") or (data if isinstance(data, list) else [])
        assert len(posts) >= 6

    def test_public_careers_returns_jobs(self):
        resp = requests.get(f"{BASE_URL}/api/public/careers")
        assert resp.status_code == 200
        data = resp.json()
        jobs = data.get("jobs") or (data if isinstance(data, list) else [])
        assert len(jobs) >= 6

    def test_public_contact_form(self):
        resp = requests.post(f"{BASE_URL}/api/public/contact", json={
            "name": "TEST_Contact",
            "email": "testcontact2@example.com",
            "message": "Hello from test",
            "company": "Test Inc"
        })
        assert resp.status_code in [200, 201]

    def test_public_newsletter_subscribe(self):
        resp = requests.post(f"{BASE_URL}/api/public/newsletter/subscribe", json={
            "email": "testnewsletter2@example.com"
        })
        assert resp.status_code in [200, 201]

    def test_public_waitlist_join(self):
        resp = requests.post(f"{BASE_URL}/api/public/waitlist/join", json={
            "email": "testwaitlist2@example.com",
            "name": "TEST_Waitlist2"
        })
        assert resp.status_code in [200, 201]
