-- =====================================================
-- HERO SECTIONS TABLE
-- =====================================================
-- Purpose: Store hero section content for the homepage
-- Features: Single active hero, version control, media management
-- =====================================================

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS public.hero_sections CASCADE;

-- Create hero_sections table
CREATE TABLE public.hero_sections (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content Fields
  title TEXT NOT NULL DEFAULT 'JKKN Institution',
  tagline TEXT NOT NULL DEFAULT 'Empowering Excellence, Inspiring Innovation',
  news_ticker_text TEXT DEFAULT 'Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available',

  -- Call-to-Action Buttons
  primary_cta_text TEXT NOT NULL DEFAULT 'Apply Now',
  primary_cta_link TEXT DEFAULT '/admissions',
  secondary_cta_text TEXT NOT NULL DEFAULT 'Explore Campus',
  secondary_cta_link TEXT DEFAULT '/campus',

  -- Media Assets
  video_url TEXT DEFAULT '/videos/campus-video.mp4',
  poster_image_url TEXT DEFAULT '/images/campus-poster.jpg',

  -- Status & Ordering
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT hero_sections_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT hero_sections_tagline_not_empty CHECK (length(trim(tagline)) > 0)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for finding active hero
CREATE INDEX idx_hero_sections_is_active ON public.hero_sections(is_active) WHERE is_active = true;

-- Index for ordering
CREATE INDEX idx_hero_sections_display_order ON public.hero_sections(display_order);

-- Index for created_by lookups
CREATE INDEX idx_hero_sections_created_by ON public.hero_sections(created_by);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view active hero sections
CREATE POLICY "Public can view active hero sections"
  ON public.hero_sections
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can view all hero sections
CREATE POLICY "Admins can view all hero sections"
  ON public.hero_sections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role IN ('admin', 'super_admin')
      AND admin_profiles.status = 'active'
    )
  );

-- Policy: Admins can create hero sections
CREATE POLICY "Admins can create hero sections"
  ON public.hero_sections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role IN ('admin', 'super_admin')
      AND admin_profiles.status = 'active'
    )
  );

-- Policy: Admins can update hero sections
CREATE POLICY "Admins can update hero sections"
  ON public.hero_sections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role IN ('admin', 'super_admin')
      AND admin_profiles.status = 'active'
    )
  );

-- Policy: Super admins can delete hero sections
CREATE POLICY "Super admins can delete hero sections"
  ON public.hero_sections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role = 'super_admin'
      AND admin_profiles.status = 'active'
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update updated_at timestamp
CREATE TRIGGER update_hero_sections_updated_at
  BEFORE UPDATE ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Ensure only one active hero section
-- =====================================================

CREATE OR REPLACE FUNCTION ensure_single_active_hero()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated row is being set to active
  IF NEW.is_active = true THEN
    -- Deactivate all other hero sections
    UPDATE public.hero_sections
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Ensure only one active hero
CREATE TRIGGER ensure_single_active_hero_trigger
  BEFORE INSERT OR UPDATE OF is_active ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_hero();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default hero section
INSERT INTO public.hero_sections (
  title,
  tagline,
  news_ticker_text,
  primary_cta_text,
  primary_cta_link,
  secondary_cta_text,
  secondary_cta_link,
  video_url,
  poster_image_url,
  is_active,
  display_order
) VALUES (
  'JKKN Institution',
  'Empowering Excellence, Inspiring Innovation',
  'Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available | Early Bird Discount Available',
  'Apply Now',
  '/admissions',
  'Explore Campus',
  '/campus',
  '/videos/campus-video.mp4',
  '/images/campus-poster.jpg',
  true,
  1
);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.hero_sections IS 'Stores hero section content for the homepage';
COMMENT ON COLUMN public.hero_sections.is_active IS 'Only one hero section can be active at a time';
COMMENT ON COLUMN public.hero_sections.display_order IS 'Future feature: allows multiple heroes with ordering';
COMMENT ON COLUMN public.hero_sections.news_ticker_text IS 'Scrolling news text at the top of hero section';
