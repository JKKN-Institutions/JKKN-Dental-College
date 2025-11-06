-- =====================================================
-- TEMPORARY DEVELOPMENT RLS POLICIES
-- =====================================================
-- Purpose: Temporarily allow all authenticated users to access data
-- Usage: Run this in Supabase SQL Editor for DEVELOPMENT ONLY
-- WARNING: NEVER use this in production!
-- =====================================================

-- Drop existing restrictive policies temporarily
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

-- Create temporary permissive policy for profiles SELECT
CREATE POLICY "profiles_select_all_dev"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Temporary policy for profiles UPDATE (all authenticated users)
CREATE POLICY "profiles_update_all_dev"
ON public.profiles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Temporary policy for profiles INSERT (for testing)
CREATE POLICY "profiles_insert_all_dev"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- TO RESTORE PRODUCTION POLICIES:
-- Run the original 03_policies.sql file
-- =====================================================

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
