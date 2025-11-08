-- =====================================================
-- FIX: Admin Profiles 406 Error
-- =====================================================
-- Purpose: Ensure admin profiles are properly accessible
-- Error: 406 Not Acceptable when fetching admin profiles
-- =====================================================

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'admin_profiles';

-- Check existing policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'admin_profiles';

-- Verify the helper functions work
SELECT
  public.is_admin() as is_admin,
  public.is_super_admin() as is_super_admin,
  public.get_user_type() as user_type;

-- Grant proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.admin_profiles TO authenticated;
GRANT UPDATE ON public.admin_profiles TO authenticated;

-- Ensure anon role can't access (security)
REVOKE ALL ON public.admin_profiles FROM anon;

-- Add a more permissive select policy for debugging (can be removed later)
DROP POLICY IF EXISTS "admin_profiles_select_authenticated" ON public.admin_profiles;

CREATE POLICY "admin_profiles_select_authenticated"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (
  -- Allow if user is viewing their own profile OR if they are an admin
  id = auth.uid() OR (SELECT public.is_admin())
);

COMMENT ON POLICY "admin_profiles_select_authenticated" ON public.admin_profiles IS 'Authenticated users can view their own admin profile or all profiles if they are admin';

-- Verify current user's admin profile exists
DO $$
DECLARE
  v_current_user UUID;
  v_profile_exists BOOLEAN;
BEGIN
  v_current_user := auth.uid();

  IF v_current_user IS NULL THEN
    RAISE NOTICE 'No authenticated user - run this after logging in';
    RETURN;
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.admin_profiles WHERE id = v_current_user
  ) INTO v_profile_exists;

  IF v_profile_exists THEN
    RAISE NOTICE 'Admin profile exists for current user: %', v_current_user;

    -- Show the profile
    RAISE NOTICE 'Profile details:';
    PERFORM * FROM public.admin_profiles WHERE id = v_current_user;
  ELSE
    RAISE WARNING 'No admin profile found for user: %', v_current_user;
    RAISE NOTICE 'User may need to be added to admin_profiles table';
  END IF;
END $$;

-- =====================================================
-- TEST QUERY (Run this after logging in as admin)
-- =====================================================
-- SELECT full_name, role, avatar_url
-- FROM public.admin_profiles
-- WHERE id = auth.uid();
