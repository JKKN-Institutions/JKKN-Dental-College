-- =====================================================
-- ACTIVITIES MODULE - COMPLETE DATABASE SCHEMA (FIXED RLS)
-- =====================================================
-- Purpose: Manage JKKN Centenary Activities with full CRUD
-- Features: Activities, Metrics, Stats, Gallery, Testimonials, Relations
-- Created: 2025-01-11
-- =====================================================

-- =====================================================
-- CLEANUP: Drop existing tables if they exist
-- =====================================================
DROP TABLE IF EXISTS public.activity_relations CASCADE;
DROP TABLE IF EXISTS public.activity_testimonials CASCADE;
DROP TABLE IF EXISTS public.activity_gallery CASCADE;
DROP TABLE IF EXISTS public.activity_impact_stats CASCADE;
DROP TABLE IF EXISTS public.activity_metrics CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS generate_activity_slug CASCADE;
DROP FUNCTION IF EXISTS update_activity_slug CASCADE;
DROP FUNCTION IF EXISTS check_activity_permission CASCADE;

-- =====================================================
-- HELPER FUNCTION: Check Activity Permission
-- =====================================================
CREATE OR REPLACE FUNCTION check_activity_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_type TEXT;
  user_role_id UUID;
  user_status TEXT;
  role_perms JSONB;
  custom_perms JSONB;
BEGIN
  -- Get user info
  SELECT role_type, role_id, status, custom_permissions
  INTO user_role_type, user_role_id, user_status, custom_perms
  FROM public.profiles
  WHERE id = user_id;

  -- User must exist and be active
  IF user_role_type IS NULL OR user_status != 'active' THEN
    RETURN FALSE;
  END IF;

  -- Super admin has all permissions
  IF user_role_type = 'super_admin' THEN
    RETURN TRUE;
  END IF;

  -- Check custom permissions first (they override role permissions)
  IF custom_perms IS NOT NULL AND custom_perms->'activities'->>(permission_name) = 'true' THEN
    RETURN TRUE;
  END IF;

  -- Check role permissions (if user has a role)
  IF user_role_type = 'custom_role' AND user_role_id IS NOT NULL THEN
    SELECT permissions INTO role_perms
    FROM public.roles
    WHERE id = user_role_id;

    IF role_perms IS NOT NULL AND role_perms->'activities'->>(permission_name) = 'true' THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- No permissions found
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_activity_permission IS 'Checks if user has specific permission for activities module';

-- =====================================================
-- TABLE: activities (Main Table)
-- =====================================================
CREATE TABLE public.activities (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Fields
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),
  category TEXT NOT NULL CHECK (category IN ('environment', 'education', 'community', 'healthcare', 'infrastructure', 'cultural')),

  -- Content Fields
  description TEXT NOT NULL,
  vision_text TEXT,

  -- Media
  hero_image_url TEXT NOT NULL,

  -- Progress & Impact
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  impact TEXT CHECK (length(impact) <= 100),

  -- Dates
  activity_date DATE,

  -- Publishing
  is_published BOOLEAN DEFAULT false NOT NULL,
  display_order INTEGER DEFAULT 0,

  -- SEO
  meta_title TEXT CHECK (length(meta_title) <= 60),
  meta_description TEXT CHECK (length(meta_description) <= 160),

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT activities_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT activities_description_not_empty CHECK (length(trim(description)) > 0),
  CONSTRAINT activities_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

COMMENT ON TABLE public.activities IS 'Main activities table for JKKN Centenary Activities';

-- =====================================================
-- TABLE: activity_metrics (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL CHECK (length(trim(metric_key)) > 0 AND length(metric_key) <= 100),
  metric_value TEXT NOT NULL CHECK (length(trim(metric_value)) > 0 AND length(metric_value) <= 100),
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: activity_impact_stats (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (length(trim(label)) > 0 AND length(label) <= 100),
  value TEXT NOT NULL CHECK (length(trim(value)) > 0 AND length(value) <= 100),
  icon TEXT CHECK (length(icon) <= 50),
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: activity_gallery (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT CHECK (length(alt_text) <= 255),
  display_order INTEGER DEFAULT 0 NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: activity_testimonials (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL CHECK (length(trim(author_name)) > 0 AND length(author_name) <= 100),
  author_role TEXT CHECK (length(author_role) <= 100),
  author_avatar_url TEXT,
  content TEXT NOT NULL CHECK (length(trim(content)) > 0),
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: activity_relations (Many-to-Many Self-Join)
-- =====================================================
CREATE TABLE public.activity_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  related_activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  relation_type TEXT DEFAULT 'related' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT activity_relations_no_self_reference CHECK (activity_id != related_activity_id),
  CONSTRAINT activity_relations_unique_pair UNIQUE (activity_id, related_activity_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_activities_slug ON public.activities(slug);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_category ON public.activities(category);
CREATE INDEX idx_activities_is_published ON public.activities(is_published);
CREATE INDEX idx_activities_activity_date ON public.activities(activity_date DESC);
CREATE INDEX idx_activities_created_by ON public.activities(created_by);
CREATE INDEX idx_activities_display_order ON public.activities(display_order);
CREATE INDEX idx_activities_status_published ON public.activities(status, is_published);

CREATE INDEX idx_activity_metrics_activity_id ON public.activity_metrics(activity_id);
CREATE INDEX idx_activity_metrics_activity_display ON public.activity_metrics(activity_id, display_order);
CREATE INDEX idx_activity_impact_stats_activity_id ON public.activity_impact_stats(activity_id);
CREATE INDEX idx_activity_impact_stats_activity_display ON public.activity_impact_stats(activity_id, display_order);
CREATE INDEX idx_activity_gallery_activity_id ON public.activity_gallery(activity_id);
CREATE INDEX idx_activity_gallery_activity_display ON public.activity_gallery(activity_id, display_order);
CREATE INDEX idx_activity_testimonials_activity_id ON public.activity_testimonials(activity_id);
CREATE INDEX idx_activity_testimonials_activity_display ON public.activity_testimonials(activity_id, display_order);
CREATE INDEX idx_activity_relations_activity_id ON public.activity_relations(activity_id);
CREATE INDEX idx_activity_relations_related_id ON public.activity_relations(related_activity_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_relations ENABLE ROW LEVEL SECURITY;

-- Activities policies
CREATE POLICY "Public can view published activities"
  ON public.activities FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all activities"
  ON public.activities FOR SELECT
  USING (check_activity_permission(auth.uid(), 'view'));

CREATE POLICY "Admins can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (check_activity_permission(auth.uid(), 'create'));

CREATE POLICY "Admins can update activities"
  ON public.activities FOR UPDATE
  USING (check_activity_permission(auth.uid(), 'update'));

CREATE POLICY "Admins can delete activities"
  ON public.activities FOR DELETE
  USING (check_activity_permission(auth.uid(), 'delete'));

-- Child tables policies
CREATE POLICY "Public can view metrics of published activities"
  ON public.activity_metrics FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.activities WHERE activities.id = activity_metrics.activity_id AND activities.is_published = true));

CREATE POLICY "Admins can manage metrics"
  ON public.activity_metrics FOR ALL
  USING (check_activity_permission(auth.uid(), 'update'));

CREATE POLICY "Public can view stats of published activities"
  ON public.activity_impact_stats FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.activities WHERE activities.id = activity_impact_stats.activity_id AND activities.is_published = true));

CREATE POLICY "Admins can manage stats"
  ON public.activity_impact_stats FOR ALL
  USING (check_activity_permission(auth.uid(), 'update'));

CREATE POLICY "Public can view gallery of published activities"
  ON public.activity_gallery FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.activities WHERE activities.id = activity_gallery.activity_id AND activities.is_published = true));

CREATE POLICY "Admins can manage gallery"
  ON public.activity_gallery FOR ALL
  USING (check_activity_permission(auth.uid(), 'update'));

CREATE POLICY "Public can view testimonials of published activities"
  ON public.activity_testimonials FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.activities WHERE activities.id = activity_testimonials.activity_id AND activities.is_published = true));

CREATE POLICY "Admins can manage testimonials"
  ON public.activity_testimonials FOR ALL
  USING (check_activity_permission(auth.uid(), 'update'));

CREATE POLICY "Public can view relations of published activities"
  ON public.activity_relations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.activities WHERE activities.id = activity_relations.activity_id AND activities.is_published = true));

CREATE POLICY "Admins can manage relations"
  ON public.activity_relations FOR ALL
  USING (check_activity_permission(auth.uid(), 'update'));

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_activity_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  IF base_slug = '' THEN
    base_slug := 'activity';
  END IF;

  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM public.activities WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_activity_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    NEW.slug := generate_activity_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER auto_generate_activity_slug
  BEFORE INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_slug();

COMMENT ON TABLE public.activities IS 'Activities Module v1.0 - Complete schema for JKKN Centenary Activities';
