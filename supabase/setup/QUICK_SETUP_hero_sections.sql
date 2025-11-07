-- =====================================================
-- QUICK SETUP: HERO SECTIONS TABLE (For Testing)
-- =====================================================
-- Copy and paste this entire file into Supabase SQL Editor
-- URL: https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new
-- =====================================================

-- Step 1: Create helper function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Drop and recreate table
DROP TABLE IF EXISTS public.hero_sections CASCADE;

CREATE TABLE public.hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'JKKN Institution',
  tagline TEXT NOT NULL DEFAULT 'Empowering Excellence, Inspiring Innovation',
  news_ticker_text TEXT DEFAULT 'Breaking News: Admissions Open for Academic Year 2025-2026',
  primary_cta_text TEXT NOT NULL DEFAULT 'Apply Now',
  primary_cta_link TEXT DEFAULT '/admissions',
  secondary_cta_text TEXT NOT NULL DEFAULT 'Explore Campus',
  secondary_cta_link TEXT DEFAULT '/campus',
  video_url TEXT DEFAULT '/videos/campus-video.mp4',
  poster_image_url TEXT DEFAULT '/images/campus-poster.jpg',
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT hero_sections_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT hero_sections_tagline_not_empty CHECK (length(trim(tagline)) > 0)
);

-- Step 3: Create indexes
CREATE INDEX idx_hero_sections_is_active ON public.hero_sections(is_active) WHERE is_active = true;
CREATE INDEX idx_hero_sections_display_order ON public.hero_sections(display_order);
CREATE INDEX idx_hero_sections_created_by ON public.hero_sections(created_by);

-- Step 4: Enable RLS with permissive policies (FOR TESTING ONLY)
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active heroes
CREATE POLICY "Anyone can view active heroes"
  ON public.hero_sections
  FOR SELECT
  USING (is_active = true);

-- Allow all operations for service role (admin panel access during testing)
CREATE POLICY "Allow all for service role"
  ON public.hero_sections
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 5: Add triggers
CREATE TRIGGER update_hero_sections_updated_at
  BEFORE UPDATE ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Ensure only one active hero
CREATE OR REPLACE FUNCTION ensure_single_active_hero()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.hero_sections
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_hero_trigger
  BEFORE INSERT OR UPDATE OF is_active ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_hero();

-- Step 7: Insert sample data
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
  'JKKN Dental College',
  'Empowering Excellence in Dental Education',
  'Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available',
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
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Refresh your browser at: http://localhost:3000/admin/content/hero-sections
-- 2. You should now see the hero sections module working
-- =====================================================

-- ⚠️ IMPORTANT FOR PRODUCTION:
-- The RLS policy "Allow all for service role" is permissive for testing.
-- Replace it with proper admin-only policies before deploying to production.
-- See: supabase/setup/12_hero_sections_table.sql for production-ready policies
-- =====================================================
