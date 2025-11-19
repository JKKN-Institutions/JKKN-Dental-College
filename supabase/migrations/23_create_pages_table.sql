-- =====================================================
-- PAGES MODULE - DATABASE SCHEMA
-- =====================================================
-- Purpose: Create pages table for dynamic page management
-- Module: pages
-- Layer: Database
-- =====================================================

-- Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB DEFAULT '{}'::jsonb,
    excerpt TEXT,
    template_type TEXT DEFAULT 'default' CHECK (template_type IN ('default', 'full-width', 'sidebar', 'landing')),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_published ON public.pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON public.pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_template_type ON public.pages(template_type);

-- Add RLS policies
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published pages
CREATE POLICY "Allow public read access to published pages"
    ON public.pages
    FOR SELECT
    USING (is_published = true);

-- Policy: Allow authenticated users to read all pages
CREATE POLICY "Allow authenticated users to read all pages"
    ON public.pages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to create pages
CREATE POLICY "Allow authenticated users to create pages"
    ON public.pages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update pages
CREATE POLICY "Allow authenticated users to update pages"
    ON public.pages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete pages
CREATE POLICY "Allow authenticated users to delete pages"
    ON public.pages
    FOR DELETE
    TO authenticated
    USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_pages_updated_at();

-- Add comment to table
COMMENT ON TABLE public.pages IS 'Stores dynamic pages with rich content and metadata';
