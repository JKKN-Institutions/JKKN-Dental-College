# Hero Sections Table Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create the Table

1. **Open Supabase SQL Editor**:
   👉 [Click here to open SQL Editor](https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new)

2. **Copy the SQL below** and paste it into the SQL Editor

3. **Click "Run"** to execute

### Step 2: SQL to Execute

```sql
-- =====================================================
-- HERO SECTIONS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.hero_sections CASCADE;

-- Create hero_sections table
CREATE TABLE public.hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'JKKN Institution',
  tagline TEXT NOT NULL DEFAULT 'Empowering Excellence, Inspiring Innovation',
  news_ticker_text TEXT DEFAULT 'Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available',
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
  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  CONSTRAINT hero_sections_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT hero_sections_tagline_not_empty CHECK (length(trim(tagline)) > 0)
);

-- Create indexes
CREATE INDEX idx_hero_sections_is_active ON public.hero_sections(is_active) WHERE is_active = true;
CREATE INDEX idx_hero_sections_display_order ON public.hero_sections(display_order);
CREATE INDEX idx_hero_sections_created_by ON public.hero_sections(created_by);

-- Enable RLS
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active hero sections
CREATE POLICY "Anyone can view active hero sections"
  ON public.hero_sections
  FOR SELECT
  USING (is_active = true);

-- Policy: Service role can do everything (for admin panel during testing)
CREATE POLICY "Service role full access"
  ON public.hero_sections
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update trigger
CREATE TRIGGER update_hero_sections_updated_at
  BEFORE UPDATE ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one active hero
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
```

### Step 3: Verify

After running the SQL, refresh your Next.js app at:
`http://localhost:3000/admin/content/hero-sections`

## Troubleshooting

### Error: "relation 'update_updated_at_column' does not exist"

If you get an error about `update_updated_at_column`, run this first:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then run the hero_sections table SQL again.

### Error: "admin_profiles" does not exist

The table has a foreign key to `admin_profiles`. If that table doesn't exist, either:

1. Create the admin_profiles table first, OR
2. Remove the foreign key references temporarily

## Production Security

**⚠️ IMPORTANT**: The SQL above includes a permissive policy for testing:

```sql
CREATE POLICY "Service role full access"
  ON public.hero_sections
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

Before deploying to production, replace this with proper admin-only policies from:
`supabase/setup/12_hero_sections_table.sql`
