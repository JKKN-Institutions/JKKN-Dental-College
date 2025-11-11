-- =====================================================
-- ACTIVITIES MODULE - COMPLETE DATABASE SCHEMA
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
COMMENT ON COLUMN public.activities.slug IS 'URL-friendly unique identifier (auto-generated from title)';
COMMENT ON COLUMN public.activities.status IS 'Activity status: planned, ongoing, or completed';
COMMENT ON COLUMN public.activities.category IS 'Activity category: environment, education, community, healthcare, infrastructure, or cultural';
COMMENT ON COLUMN public.activities.progress IS 'Completion percentage (0-100)';
COMMENT ON COLUMN public.activities.is_published IS 'Whether the activity is visible to public';

-- =====================================================
-- TABLE: activity_metrics (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_metrics (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Data Fields
  metric_key TEXT NOT NULL CHECK (length(trim(metric_key)) > 0 AND length(metric_key) <= 100),
  metric_value TEXT NOT NULL CHECK (length(trim(metric_value)) > 0 AND length(metric_value) <= 100),

  -- Display Order
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activity_metrics IS 'Key-value metrics for activities (e.g., "Trees Planted": "5,000")';
COMMENT ON COLUMN public.activity_metrics.display_order IS 'Order for displaying metrics (lower numbers first)';

-- =====================================================
-- TABLE: activity_impact_stats (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_impact_stats (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Data Fields
  label TEXT NOT NULL CHECK (length(trim(label)) > 0 AND length(label) <= 100),
  value TEXT NOT NULL CHECK (length(trim(value)) > 0 AND length(value) <= 100),
  icon TEXT CHECK (length(icon) <= 50),

  -- Display Order
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activity_impact_stats IS 'Impact statistics with icons (e.g., label: "People Impacted", value: "10,000+", icon: "Users")';
COMMENT ON COLUMN public.activity_impact_stats.icon IS 'Lucide icon name (e.g., "TreePine", "Users", "Heart")';

-- =====================================================
-- TABLE: activity_gallery (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_gallery (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Data Fields
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT CHECK (length(alt_text) <= 255),

  -- Display Order
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Timestamp
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activity_gallery IS 'Gallery images for activities with captions';
COMMENT ON COLUMN public.activity_gallery.alt_text IS 'Alternative text for accessibility';

-- =====================================================
-- TABLE: activity_testimonials (One-to-Many)
-- =====================================================
CREATE TABLE public.activity_testimonials (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Author Fields
  author_name TEXT NOT NULL CHECK (length(trim(author_name)) > 0 AND length(author_name) <= 100),
  author_role TEXT CHECK (length(author_role) <= 100),
  author_avatar_url TEXT,

  -- Content
  content TEXT NOT NULL CHECK (length(trim(content)) > 0),

  -- Display Order
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activity_testimonials IS 'Testimonials from people involved in activities';

-- =====================================================
-- TABLE: activity_relations (Many-to-Many Self-Join)
-- =====================================================
CREATE TABLE public.activity_relations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  related_activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,

  -- Relation Type
  relation_type TEXT DEFAULT 'related' NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT activity_relations_no_self_reference CHECK (activity_id != related_activity_id),
  CONSTRAINT activity_relations_unique_pair UNIQUE (activity_id, related_activity_id)
);

COMMENT ON TABLE public.activity_relations IS 'Many-to-many relationships between activities';
COMMENT ON COLUMN public.activity_relations.relation_type IS 'Type of relation (default: "related")';

-- =====================================================
-- INDEXES
-- =====================================================

-- Activities table indexes
CREATE INDEX idx_activities_slug ON public.activities(slug);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_category ON public.activities(category);
CREATE INDEX idx_activities_is_published ON public.activities(is_published);
CREATE INDEX idx_activities_activity_date ON public.activities(activity_date DESC);
CREATE INDEX idx_activities_created_by ON public.activities(created_by);
CREATE INDEX idx_activities_display_order ON public.activities(display_order);
CREATE INDEX idx_activities_status_published ON public.activities(status, is_published);

-- Child tables indexes (for efficient joins)
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

-- Enable RLS on all tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_relations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: activities table
-- =====================================================

-- Policy: Public can view published activities
CREATE POLICY "Public can view published activities"
  ON public.activities
  FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users with view permission can view all activities
CREATE POLICY "Users with permission can view all activities"
  ON public.activities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            -- Check role permissions
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'view' = 'true')
            OR
            -- Check custom permissions
            (profiles.custom_permissions->'activities'->>'view' = 'true')
          )
        )
      )
    )
  );

-- Policy: Users with create permission can insert activities
CREATE POLICY "Users with permission can create activities"
  ON public.activities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'create' = 'true')
            OR (profiles.custom_permissions->'activities'->>'create' = 'true')
          )
        )
      )
    )
  );

-- Policy: Users with update permission can update activities
CREATE POLICY "Users with permission can update activities"
  ON public.activities
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- Policy: Users with delete permission can delete activities
CREATE POLICY "Users with permission can delete activities"
  ON public.activities
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'delete' = 'true')
            OR (profiles.custom_permissions->'activities'->>'delete' = 'true')
          )
        )
      )
    )
  );

-- =====================================================
-- RLS POLICIES: Child tables (inherit from parent)
-- =====================================================

-- Metrics: Public can view if parent activity is published
CREATE POLICY "Public can view metrics of published activities"
  ON public.activity_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_metrics.activity_id
      AND activities.is_published = true
    )
  );

CREATE POLICY "Users with permission can manage metrics"
  ON public.activity_metrics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      JOIN public.profiles ON profiles.id = auth.uid()
      WHERE activities.id = activity_metrics.activity_id
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- Impact Stats: Same pattern
CREATE POLICY "Public can view stats of published activities"
  ON public.activity_impact_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_impact_stats.activity_id
      AND activities.is_published = true
    )
  );

CREATE POLICY "Users with permission can manage stats"
  ON public.activity_impact_stats
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      JOIN public.profiles ON profiles.id = auth.uid()
      WHERE activities.id = activity_impact_stats.activity_id
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- Gallery: Same pattern
CREATE POLICY "Public can view gallery of published activities"
  ON public.activity_gallery
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_gallery.activity_id
      AND activities.is_published = true
    )
  );

CREATE POLICY "Users with permission can manage gallery"
  ON public.activity_gallery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      JOIN public.profiles ON profiles.id = auth.uid()
      WHERE activities.id = activity_gallery.activity_id
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- Testimonials: Same pattern
CREATE POLICY "Public can view testimonials of published activities"
  ON public.activity_testimonials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_testimonials.activity_id
      AND activities.is_published = true
    )
  );

CREATE POLICY "Users with permission can manage testimonials"
  ON public.activity_testimonials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      JOIN public.profiles ON profiles.id = auth.uid()
      WHERE activities.id = activity_testimonials.activity_id
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- Relations: Same pattern
CREATE POLICY "Public can view relations of published activities"
  ON public.activity_relations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      WHERE activities.id = activity_relations.activity_id
      AND activities.is_published = true
    )
  );

CREATE POLICY "Users with permission can manage relations"
  ON public.activity_relations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.activities
      JOIN public.profiles ON profiles.id = auth.uid()
      WHERE activities.id = activity_relations.activity_id
      AND profiles.status = 'active'
      AND (
        profiles.role_type = 'super_admin'
        OR (
          profiles.role_type = 'custom_role'
          AND (
            (profiles.roles IS NOT NULL AND profiles.roles->'permissions'->'activities'->>'update' = 'true')
            OR (profiles.custom_permissions->'activities'->>'update' = 'true')
          )
        )
      )
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Generate slug from title
CREATE OR REPLACE FUNCTION generate_activity_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug: lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'activity';
  END IF;

  final_slug := base_slug;

  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.activities WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION update_activity_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate slug if not provided or empty
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    NEW.slug := generate_activity_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update updated_at timestamp on activities
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-generate slug on insert
CREATE TRIGGER auto_generate_activity_slug
  BEFORE INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_slug();

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert a sample activity for testing (uncomment if needed)
/*
INSERT INTO public.activities (
  title,
  slug,
  status,
  category,
  description,
  vision_text,
  hero_image_url,
  progress,
  impact,
  activity_date,
  is_published,
  meta_title,
  meta_description
) VALUES (
  'Green Campus Initiative',
  'green-campus-initiative',
  'ongoing',
  'environment',
  'A comprehensive environmental sustainability program aimed at making our campus carbon-neutral by 2030.',
  'We envision a future where our campus serves as a model for environmental sustainability.',
  '/images/activities/green-campus.jpg',
  65,
  '5,000+ Trees Planted',
  '2024-01-15',
  true,
  'Green Campus Initiative - JKKN',
  'Join our mission to create a sustainable, carbon-neutral campus through tree plantation and green initiatives.'
);
*/

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION generate_activity_slug IS 'Generates a URL-friendly unique slug from activity title';
COMMENT ON FUNCTION update_activity_slug IS 'Trigger function to auto-generate slug on insert if not provided';

-- =====================================================
-- SCHEMA VERSION
-- =====================================================

COMMENT ON TABLE public.activities IS 'Activities Module v1.0 - Complete schema for JKKN Centenary Activities';
