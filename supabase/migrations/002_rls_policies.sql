-- =============================================================================
-- Gorakhai Corporate Site — Database Migration 002
-- Row Level Security (RLS) Policies
-- Run AFTER 001_initial_schema.sql
-- =============================================================================

-- =============================================================================
-- ENABLE RLS on all tables
-- =============================================================================
ALTER TABLE blog_categories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures                ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications             ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_network_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_subscribers         ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- DROP existing policies before recreating (idempotent)
-- =============================================================================
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- =============================================================================
-- blog_categories: Public SELECT, authenticated CRUD
-- =============================================================================
CREATE POLICY "public_read_blog_categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "admin_all_blog_categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- blog_posts: Public SELECT for published only, authenticated CRUD
-- =============================================================================
CREATE POLICY "public_read_published_posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "admin_all_blog_posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- contact_submissions: Public INSERT, authenticated SELECT/UPDATE/DELETE
-- =============================================================================
CREATE POLICY "public_insert_contact"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_read_contacts"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update_contacts"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_delete_contacts"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- newsletter_subscribers: Public INSERT, authenticated full access
-- =============================================================================
CREATE POLICY "public_subscribe_newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_all_newsletter"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow subscribers to unsubscribe by token (no auth needed)
CREATE POLICY "public_unsubscribe_by_token"
  ON newsletter_subscribers FOR UPDATE
  USING (true)
  WITH CHECK (status = 'unsubscribed');

-- =============================================================================
-- lead_captures: Public INSERT, authenticated full access
-- =============================================================================
CREATE POLICY "public_insert_leads"
  ON lead_captures FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_all_leads"
  ON lead_captures FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- job_listings: Public SELECT for open jobs, authenticated CRUD
-- =============================================================================
CREATE POLICY "public_read_open_jobs"
  ON job_listings FOR SELECT
  USING (status = 'open');

CREATE POLICY "admin_all_jobs"
  ON job_listings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- job_applications: Public INSERT, authenticated full access
-- =============================================================================
CREATE POLICY "public_submit_application"
  ON job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_all_applications"
  ON job_applications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- expert_network_registrations: Public INSERT, authenticated full access
-- =============================================================================
CREATE POLICY "public_register_expert"
  ON expert_network_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_all_experts"
  ON expert_network_registrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- waitlist_subscribers: Public INSERT, authenticated full access
-- =============================================================================
CREATE POLICY "public_join_waitlist"
  ON waitlist_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_all_waitlist"
  ON waitlist_subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- ADMIN USER SETUP
-- Create admin user via Supabase Auth Dashboard or CLI:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Click "Add user" → Enter admin email + strong password
--   3. The user will be authenticated with auth.role() = 'authenticated'
--
-- For CLI: supabase auth create-user --email admin@gorakhai.com --password <STRONG_PASSWORD>
-- =============================================================================
