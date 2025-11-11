-- =====================================================
-- ACTIVITY CATEGORIES MODULE
-- =====================================================
-- Purpose: Manage activity categories dynamically
-- Created: 2025-01-11
-- =====================================================

-- =====================================================
-- TABLE: activity_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_categories (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Fields
  name TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0 AND length(name) <= 50),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT CHECK (length(description) <= 500),

  -- Visual Fields
  icon TEXT CHECK (length(icon) <= 50), -- Lucide icon name
  color TEXT CHECK (color ~ '^#[0-9A-Fa-f]{6}$'), -- Hex color code

  -- Ordering & Status
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.activity_categories IS 'Dynamic categories for JKKN Centenary Activities';

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_activity_categories_slug ON public.activity_categories(slug);
CREATE INDEX idx_activity_categories_is_active ON public.activity_categories(is_active);
CREATE INDEX idx_activity_categories_display_order ON public.activity_categories(display_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;

-- Public can view active categories
CREATE POLICY "Public can view active categories"
  ON public.activity_categories FOR SELECT
  USING (is_active = true);

-- Admins can view all categories
CREATE POLICY "Admins can view all categories"
  ON public.activity_categories FOR SELECT
  USING (check_activity_permission(auth.uid(), 'view'));

-- Admins can create categories
CREATE POLICY "Admins can create categories"
  ON public.activity_categories FOR INSERT
  WITH CHECK (check_activity_permission(auth.uid(), 'create'));

-- Admins can update categories
CREATE POLICY "Admins can update categories"
  ON public.activity_categories FOR UPDATE
  USING (check_activity_permission(auth.uid(), 'update'));

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON public.activity_categories FOR DELETE
  USING (check_activity_permission(auth.uid(), 'delete'));

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-generate slug from name
CREATE OR REPLACE FUNCTION generate_category_slug(category_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(trim(category_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  IF base_slug = '' THEN
    base_slug := 'category';
  END IF;

  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM public.activity_categories WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE OR REPLACE FUNCTION update_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    NEW.slug := generate_category_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_category_slug
  BEFORE INSERT ON public.activity_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_category_slug();

-- =====================================================
-- TRIGGER: Update timestamp
-- =====================================================
CREATE TRIGGER update_activity_categories_updated_at
  BEFORE UPDATE ON public.activity_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Insert default categories
-- =====================================================
INSERT INTO public.activity_categories (name, slug, description, icon, color, display_order, is_active)
VALUES
  ('Environment', 'environment', 'Environmental sustainability and green initiatives', 'leaf', '#10B981', 1, true),
  ('Education', 'education', 'Educational programs and academic initiatives', 'graduation-cap', '#3B82F6', 2, true),
  ('Community', 'community', 'Community service and social welfare programs', 'users', '#8B5CF6', 3, true),
  ('Healthcare', 'healthcare', 'Healthcare services and medical initiatives', 'heart', '#EF4444', 4, true),
  ('Infrastructure', 'infrastructure', 'Infrastructure development and facility improvements', 'building', '#F59E0B', 5, true),
  ('Cultural', 'cultural', 'Cultural events and heritage preservation', 'music', '#EC4899', 6, true)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE public.activity_categories IS 'Activity Categories Module v1.0 - Dynamic category management';
