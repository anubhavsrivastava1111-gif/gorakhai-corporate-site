-- =============================================================================
-- Gorakhai Corporate Site — Database Migration 001
-- Initial Schema
-- Project: gorakhai-corporate (Supabase)
-- Run this first in: Supabase Dashboard > SQL Editor
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =============================================================================
-- UTILITY: updated_at trigger function
-- =============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TABLE 1: blog_categories
-- =============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        UNIQUE NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  color       TEXT        DEFAULT '#002FA7',
  created_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE blog_categories IS 'Blog post categories for the Gorakhai corporate blog';

INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Case Studies',   'case-studies',   'Customer success stories and implementation case studies', '#002FA7'),
  ('Engineering',    'engineering',    'Technical deep-dives from the Gorakhai engineering team',   '#059669'),
  ('AI Research',    'ai-research',    'Original research and analysis on enterprise AI trends',    '#7C3AED'),
  ('Enterprise AI',  'enterprise-ai',  'Frameworks and guidance for enterprise AI adoption',        '#B45309'),
  ('Product Updates','product-updates','Announcements and release notes for Gorakhai products',     '#DC2626'),
  ('Company News',   'company-news',   'Gorakhai company announcements and team updates',           '#0891B2')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- TABLE 2: blog_posts
-- =============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT        NOT NULL,
  slug              TEXT        UNIQUE NOT NULL,
  excerpt           TEXT,
  content           TEXT,
  cover_image_url   TEXT,
  author_name       TEXT        NOT NULL DEFAULT 'Gorakhai Team',
  author_initials   TEXT,
  author_role       TEXT,
  category_id       UUID        REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags              TEXT[]      DEFAULT '{}',
  status            TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
  featured          BOOLEAN     DEFAULT false,
  seo_title         TEXT,
  seo_description   TEXT,
  og_image_url      TEXT,
  read_time_mins    INTEGER     DEFAULT 5,
  view_count        INTEGER     DEFAULT 0,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE blog_posts IS 'Blog articles managed via Admin CMS';
COMMENT ON COLUMN blog_posts.status IS 'draft: hidden, published: public, archived: removed';
COMMENT ON COLUMN blog_posts.featured IS 'Show as featured post on blog index page';

-- =============================================================================
-- TABLE 3: contact_submissions
-- =============================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  company          TEXT,
  job_title        TEXT,
  phone            TEXT,
  subject          TEXT,
  message          TEXT        NOT NULL,
  form_source      TEXT        DEFAULT 'contact'
                   CHECK (form_source IN ('contact', 'demo_request', 'product_page', 'pricing', 'other')),
  product_interest TEXT        CHECK (product_interest IN ('orchestra-iq', 'arjun-ai', 'both', 'general', NULL)),
  status           TEXT        NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),
  assigned_to      TEXT,
  priority         TEXT        DEFAULT 'medium'
                   CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE contact_submissions IS 'Contact form and demo request submissions';

-- =============================================================================
-- TABLE 4: newsletter_subscribers
-- =============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT        UNIQUE NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  source_page         TEXT,
  status              TEXT        NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
  tags                TEXT[]      DEFAULT '{}',
  confirmed           BOOLEAN     DEFAULT false,
  confirmation_token  TEXT        UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  subscribed_at       TIMESTAMPTZ DEFAULT now(),
  confirmed_at        TIMESTAMPTZ,
  unsubscribed_at     TIMESTAMPTZ,
  last_email_sent_at  TIMESTAMPTZ
);

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter email subscriber list';

-- =============================================================================
-- TABLE 5: lead_captures
-- =============================================================================
CREATE TABLE IF NOT EXISTS lead_captures (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  company      TEXT,
  job_title    TEXT,
  company_size TEXT        CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', NULL)),
  use_case     TEXT,
  product      TEXT        CHECK (product IN ('orchestra-iq', 'arjun-ai', 'both', 'general', NULL)),
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  referrer_url TEXT,
  status       TEXT        NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'qualified', 'demo_scheduled', 'converted', 'nurturing', 'lost')),
  score        INTEGER     DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE lead_captures IS 'Product interest and demo request leads';

-- =============================================================================
-- TABLE 6: job_listings
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_listings (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT        NOT NULL,
  slug               TEXT        UNIQUE NOT NULL,
  department         TEXT        NOT NULL,
  location           TEXT        NOT NULL,
  type               TEXT        NOT NULL DEFAULT 'full-time'
                     CHECK (type IN ('full-time', 'part-time', 'contract', 'remote')),
  experience_level   TEXT        CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead', 'director', NULL)),
  description        TEXT,
  requirements       TEXT[]      DEFAULT '{}',
  responsibilities   TEXT[]      DEFAULT '{}',
  nice_to_have       TEXT[]      DEFAULT '{}',
  benefits           TEXT[]      DEFAULT '{}',
  salary_range       TEXT,
  equity_range       TEXT,
  status             TEXT        NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open', 'closed', 'paused', 'draft')),
  remote_ok          BOOLEAN     DEFAULT true,
  urgent             BOOLEAN     DEFAULT false,
  featured           BOOLEAN     DEFAULT false,
  application_count  INTEGER     DEFAULT 0,
  posted_at          TIMESTAMPTZ DEFAULT now(),
  closes_at          TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER job_listings_updated_at
  BEFORE UPDATE ON job_listings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

COMMENT ON TABLE job_listings IS 'Open job positions managed via Admin CMS';

-- =============================================================================
-- TABLE 7: job_applications
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID        REFERENCES job_listings(id) ON DELETE SET NULL,
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT,
  linkedin_url  TEXT,
  portfolio_url TEXT,
  resume_url    TEXT,
  cover_letter  TEXT,
  status        TEXT        NOT NULL DEFAULT 'received'
                CHECK (status IN ('received', 'screening', 'phone_screen', 'technical', 'onsite', 'offer', 'rejected', 'withdrawn')),
  rating        INTEGER     CHECK (rating BETWEEN 1 AND 5),
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE job_applications IS 'Job applications submitted via the Careers page';

-- =============================================================================
-- TABLE 8: expert_network_registrations
-- =============================================================================
CREATE TABLE IF NOT EXISTS expert_network_registrations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT        NOT NULL,
  email            TEXT        UNIQUE NOT NULL,
  company          TEXT,
  job_title        TEXT,
  expertise_areas  TEXT[]      DEFAULT '{}',
  years_experience TEXT,
  linkedin_url     TEXT,
  bio              TEXT,
  availability     TEXT,
  portfolio_url    TEXT,
  referral_source  TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  reviewed_by      TEXT,
  approved_at      TIMESTAMPTZ,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE expert_network_registrations IS 'Applications to join the Gorakhai Expert Network';

-- =============================================================================
-- TABLE 9: waitlist_subscribers
-- =============================================================================
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT,
  company       TEXT,
  job_title     TEXT,
  product       TEXT        CHECK (product IN ('orchestra-iq', 'arjun-ai', 'both', 'general', NULL)),
  source_page   TEXT,
  referral_code TEXT,
  position      INTEGER     GENERATED ALWAYS AS IDENTITY,
  status        TEXT        NOT NULL DEFAULT 'waiting'
                CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE waitlist_subscribers IS 'Product waitlist signups';

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

-- blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug         ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status       ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id  ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured     ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_search       ON blog_posts USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- job_listings
CREATE INDEX IF NOT EXISTS idx_job_listings_slug       ON job_listings(slug);
CREATE INDEX IF NOT EXISTS idx_job_listings_status     ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_department ON job_listings(department);
CREATE INDEX IF NOT EXISTS idx_job_listings_posted_at  ON job_listings(posted_at DESC);

-- contact_submissions
CREATE INDEX IF NOT EXISTS idx_contact_status          ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at      ON contact_submissions(created_at DESC);

-- newsletter_subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_email        ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status       ON newsletter_subscribers(status);

-- lead_captures
CREATE INDEX IF NOT EXISTS idx_leads_status            ON lead_captures(status);
CREATE INDEX IF NOT EXISTS idx_leads_product           ON lead_captures(product);
CREATE INDEX IF NOT EXISTS idx_leads_created_at        ON lead_captures(created_at DESC);

-- job_applications
CREATE INDEX IF NOT EXISTS idx_applications_job_id     ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status     ON job_applications(status);

-- expert_network
CREATE INDEX IF NOT EXISTS idx_experts_status          ON expert_network_registrations(status);
CREATE INDEX IF NOT EXISTS idx_experts_email           ON expert_network_registrations(email);
