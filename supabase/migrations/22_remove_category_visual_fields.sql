-- =====================================================
-- REMOVE ICON AND COLOR FROM ACTIVITY CATEGORIES
-- =====================================================
-- Purpose: Remove visual fields (icon, color) from activity_categories table
-- Created: 2025-01-11
-- =====================================================

-- Drop columns
ALTER TABLE public.activity_categories DROP COLUMN IF EXISTS icon;
ALTER TABLE public.activity_categories DROP COLUMN IF EXISTS color;

COMMENT ON TABLE public.activity_categories IS 'Activity Categories Module v1.1 - Removed visual fields';
