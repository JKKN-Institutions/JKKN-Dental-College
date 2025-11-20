-- =====================================================
-- FIX PAGES TABLE SCHEMA
-- =====================================================
-- Purpose: Update pages table to match page builder requirements
-- =====================================================

-- Step 1: Add new columns
ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS published_blocks JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS seo_metadata JSONB,
ADD COLUMN IF NOT EXISTS last_saved_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_auto_saved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS auto_added_to_nav BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS navigation_item_id UUID,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Step 2: Migrate existing data
-- Convert is_published to status
UPDATE public.pages
SET status = CASE
    WHEN is_published = true THEN 'published'
    ELSE 'draft'
END
WHERE status IS NULL;

-- Convert content to blocks format
UPDATE public.pages
SET blocks = COALESCE(content, '[]'::jsonb)
WHERE blocks = '[]'::jsonb;

-- Step 3: Add constraint for status
ALTER TABLE public.pages
ADD CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'));

-- Step 4: Create index on status
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON public.pages(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_created_by ON public.pages(created_by);

-- Step 5: Keep old fields for compatibility but mark as deprecated
COMMENT ON COLUMN public.pages.is_published IS 'DEPRECATED: Use status column instead';
COMMENT ON COLUMN public.pages.content IS 'DEPRECATED: Use blocks column instead';

-- Step 6: Update RLS policies
DROP POLICY IF EXISTS "Allow public read access to published pages" ON public.pages;
CREATE POLICY "Allow public read access to published pages"
    ON public.pages
    FOR SELECT
    USING (status = 'published');

-- Add comment
COMMENT ON TABLE public.pages IS 'Stores dynamic pages with page builder blocks';
