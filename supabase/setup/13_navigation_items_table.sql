-- =====================================================
-- NAVIGATION ITEMS TABLE SETUP
-- =====================================================
-- Purpose: Create navigation_items table with RLS policies
-- Module: navigation
-- Usage: Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create navigation_items table
CREATE TABLE IF NOT EXISTS public.navigation_items (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Navigation Data
  label VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(100),
  target VARCHAR(10) NOT NULL DEFAULT '_self' CHECK (target IN ('_self', '_blank')),

  -- Hierarchy
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  depth INTEGER NOT NULL DEFAULT 0,

  -- Visibility
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,

  -- Access Control
  requires_auth BOOLEAN NOT NULL DEFAULT false,
  allowed_roles TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id
  ON public.navigation_items(parent_id);

CREATE INDEX IF NOT EXISTS idx_navigation_items_display_order
  ON public.navigation_items(display_order);

CREATE INDEX IF NOT EXISTS idx_navigation_items_is_active
  ON public.navigation_items(is_active);

CREATE INDEX IF NOT EXISTS idx_navigation_items_depth
  ON public.navigation_items(depth);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_navigation_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_navigation_items_updated_at
  ON public.navigation_items;

CREATE TRIGGER trigger_update_navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_navigation_items_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow public read access to active navigation items"
  ON public.navigation_items;
DROP POLICY IF EXISTS "Allow authenticated users full access"
  ON public.navigation_items;

-- 6. Create RLS Policies

-- Public users can view active navigation items
CREATE POLICY "Allow public read access to active navigation items"
  ON public.navigation_items
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can do everything (for admin panel)
CREATE POLICY "Allow authenticated users full access"
  ON public.navigation_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Insert seed data (default navigation items)
INSERT INTO public.navigation_items (label, url, icon, target, parent_id, display_order, depth, is_active, is_featured, requires_auth)
VALUES
  -- Top-level items (depth 0)
  ('Home', '#hero', 'HiHome', '_self', NULL, 0, 0, true, false, false),
  ('About', '#about', 'HiInformationCircle', '_self', NULL, 1, 0, true, false, false),
  ('News', '#news', 'HiNewspaper', '_self', NULL, 2, 0, true, false, false),
  ('Institutions', '#institutions', 'HiAcademicCap', '_self', NULL, 3, 0, true, false, false),
  ('Why JKKN', '#why-choose', 'HiStar', '_self', NULL, 4, 0, true, false, false),
  ('Campus Life', '#life-at-jkkn', 'HiPhotograph', '_self', NULL, 5, 0, true, false, false),
  ('Placements', '#recruiters', 'HiBriefcase', '_self', NULL, 6, 0, true, false, false),
  ('Alumni', '#alumni', 'HiUserGroup', '_self', NULL, 7, 0, true, false, false),
  ('Contact Us', '#contact', 'HiMail', '_self', NULL, 8, 0, true, false, false)
ON CONFLICT DO NOTHING;

-- 8. Grant permissions
GRANT ALL ON public.navigation_items TO authenticated;
GRANT SELECT ON public.navigation_items TO anon;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- You can now:
-- 1. View navigation items in your admin panel at /admin/content/navigation
-- 2. Add, edit, delete, and reorder navigation items
-- 3. Create nested submenus by setting parent_id
-- 4. Control visibility with is_active flag
-- =====================================================
