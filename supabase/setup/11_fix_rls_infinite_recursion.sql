-- =====================================================
-- FIX: RLS INFINITE RECURSION
-- =====================================================
-- Created: 2025-01-03
-- Purpose: Fix infinite recursion in RLS policies
-- Problem: is_admin() and is_super_admin() functions query profiles table,
--          which triggers RLS policies, which call the functions again
-- Solution: Use SECURITY DEFINER and set search_path to bypass RLS
-- =====================================================

-- Drop existing functions
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.get_user_role();

-- =====================================================
-- FUNCTION: is_admin (FIXED)
-- Purpose: Check if current user is admin or super_admin
-- Security: DEFINER (bypasses RLS to avoid recursion)
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_role IN ('admin', 'super_admin');
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if current user is admin or super_admin (SECURITY DEFINER to avoid RLS recursion)';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- =====================================================
-- FUNCTION: is_super_admin (FIXED)
-- Purpose: Check if current user is super_admin
-- Security: DEFINER (bypasses RLS to avoid recursion)
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_role = 'super_admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

COMMENT ON FUNCTION public.is_super_admin IS 'Returns true if current user is super_admin (SECURITY DEFINER to avoid RLS recursion)';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_super_admin TO authenticated;

-- =====================================================
-- FUNCTION: get_user_role (FIXED)
-- Purpose: Get current user's role
-- Security: DEFINER (bypasses RLS to avoid recursion)
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(v_role, 'user');
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'user';
END;
$$;

COMMENT ON FUNCTION public.get_user_role IS 'Returns current user role (SECURITY DEFINER to avoid RLS recursion)';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- =====================================================
-- VERIFY THE FIX
-- =====================================================
-- Test the functions (should not cause recursion)
SELECT public.is_admin();
SELECT public.is_super_admin();
SELECT public.get_user_role();

-- Show function definitions
SELECT
  proname as function_name,
  prosecdef as is_security_definer,
  provolatile as volatility
FROM pg_proc
WHERE proname IN ('is_admin', 'is_super_admin', 'get_user_role')
  AND pronamespace = 'public'::regnamespace;

-- =====================================================
-- END OF FIX
-- =====================================================
