-- =====================================================
-- RLS POLICIES: User and Admin Profiles
-- =====================================================
-- Created: 2025-01-04
-- Purpose: Row-Level Security policies for separate user and admin tables
-- =====================================================

-- =====================================================
-- USER_PROFILES POLICIES
-- =====================================================

-- Policy: Users can read their own profile
CREATE POLICY "user_profiles_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

COMMENT ON POLICY "user_profiles_select_own" ON public.user_profiles IS 'Users can view their own profile';

-- Policy: Users can update their own profile
CREATE POLICY "user_profiles_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMENT ON POLICY "user_profiles_update_own" ON public.user_profiles IS 'Users can update their own profile';

-- Policy: Users can insert their own profile (on signup)
CREATE POLICY "user_profiles_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

COMMENT ON POLICY "user_profiles_insert_own" ON public.user_profiles IS 'Users can create their own profile on signup';

-- Policy: Admins can read all user profiles
CREATE POLICY "user_profiles_select_admin"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  (SELECT public.is_admin())
);

COMMENT ON POLICY "user_profiles_select_admin" ON public.user_profiles IS 'Admins can view all user profiles';

-- Policy: Super admins can update any user profile (for blocking, etc.)
CREATE POLICY "user_profiles_update_super_admin"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_super_admin())
)
WITH CHECK (
  (SELECT public.is_super_admin())
);

COMMENT ON POLICY "user_profiles_update_super_admin" ON public.user_profiles IS 'Super admins can update any user profile';

-- Policy: Super admins can delete user profiles
CREATE POLICY "user_profiles_delete_super_admin"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
  (SELECT public.is_super_admin())
);

COMMENT ON POLICY "user_profiles_delete_super_admin" ON public.user_profiles IS 'Super admins can delete user profiles';

-- =====================================================
-- ADMIN_PROFILES POLICIES
-- =====================================================

-- Policy: Admins can read their own profile
CREATE POLICY "admin_profiles_select_own"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

COMMENT ON POLICY "admin_profiles_select_own" ON public.admin_profiles IS 'Admins can view their own profile';

-- Policy: Admins can read other admin profiles (for collaboration)
CREATE POLICY "admin_profiles_select_all_admins"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (
  (SELECT public.is_admin())
);

COMMENT ON POLICY "admin_profiles_select_all_admins" ON public.admin_profiles IS 'Admins can view all admin profiles';

-- Policy: Admins can update their own basic info only
CREATE POLICY "admin_profiles_update_own_basic"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  AND (SELECT public.is_admin())
)
WITH CHECK (
  id = auth.uid()
  AND (SELECT public.is_admin())
  -- Prevent non-super_admins from changing their own role or critical fields
  AND (
    (SELECT public.is_super_admin())
    OR (
      -- Regular admins can only update these fields:
      role = (SELECT role FROM public.admin_profiles WHERE id = auth.uid())
      AND status = (SELECT status FROM public.admin_profiles WHERE id = auth.uid())
    )
  )
);

COMMENT ON POLICY "admin_profiles_update_own_basic" ON public.admin_profiles IS 'Admins can update their own basic info but not role or status';

-- Policy: Super admins can insert new admin profiles
CREATE POLICY "admin_profiles_insert_super_admin"
ON public.admin_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT public.is_super_admin())
);

COMMENT ON POLICY "admin_profiles_insert_super_admin" ON public.admin_profiles IS 'Only super admins can create new admin accounts';

-- Policy: Super admins can update any admin profile
CREATE POLICY "admin_profiles_update_super_admin"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_super_admin())
)
WITH CHECK (
  (SELECT public.is_super_admin())
);

COMMENT ON POLICY "admin_profiles_update_super_admin" ON public.admin_profiles IS 'Super admins can update any admin profile including roles';

-- Policy: Super admins can delete admin profiles
CREATE POLICY "admin_profiles_delete_super_admin"
ON public.admin_profiles
FOR DELETE
TO authenticated
USING (
  (SELECT public.is_super_admin())
  AND id != auth.uid()  -- Prevent deleting own account
);

COMMENT ON POLICY "admin_profiles_delete_super_admin" ON public.admin_profiles IS 'Super admins can delete admin profiles (except their own)';

-- =====================================================
-- UPDATE OTHER TABLES TO USE NEW FUNCTIONS
-- =====================================================

-- Drop old policies that used old functions
DROP POLICY IF EXISTS "announcements_select_all" ON public.announcements;
DROP POLICY IF EXISTS "announcements_insert_admin" ON public.announcements;
DROP POLICY IF EXISTS "announcements_update_admin" ON public.announcements;
DROP POLICY IF EXISTS "announcements_delete_super_admin" ON public.announcements;

-- Recreate announcements policies
CREATE POLICY "announcements_select_all"
ON public.announcements
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "announcements_insert_admin"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT public.is_admin())
);

CREATE POLICY "announcements_update_admin"
ON public.announcements
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_admin())
)
WITH CHECK (
  (SELECT public.is_admin())
);

CREATE POLICY "announcements_delete_super_admin"
ON public.announcements
FOR DELETE
TO authenticated
USING (
  (SELECT public.is_super_admin())
);

-- =====================================================
-- CONTENT_SECTIONS POLICIES (Update to use new functions)
-- =====================================================

DROP POLICY IF EXISTS "content_sections_select_published" ON public.content_sections;
DROP POLICY IF EXISTS "content_sections_select_admin" ON public.content_sections;
DROP POLICY IF EXISTS "content_sections_insert_admin" ON public.content_sections;
DROP POLICY IF EXISTS "content_sections_update_admin" ON public.content_sections;
DROP POLICY IF EXISTS "content_sections_delete_super_admin" ON public.content_sections;

CREATE POLICY "content_sections_select_published"
ON public.content_sections
FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "content_sections_select_admin"
ON public.content_sections
FOR SELECT
TO authenticated
USING (
  (SELECT public.is_admin())
);

CREATE POLICY "content_sections_insert_admin"
ON public.content_sections
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT public.is_admin())
);

CREATE POLICY "content_sections_update_admin"
ON public.content_sections
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_admin())
)
WITH CHECK (
  (SELECT public.is_admin())
);

CREATE POLICY "content_sections_delete_super_admin"
ON public.content_sections
FOR DELETE
TO authenticated
USING (
  (SELECT public.is_super_admin())
);

-- =====================================================
-- CONTACT_SUBMISSIONS POLICIES (Update to use new functions)
-- =====================================================

DROP POLICY IF EXISTS "contact_submissions_select_own" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_select_admin" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_insert_authenticated" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_update_admin" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_delete_super_admin" ON public.contact_submissions;

CREATE POLICY "contact_submissions_select_own"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (submitted_by = auth.uid());

CREATE POLICY "contact_submissions_select_admin"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (
  (SELECT public.is_admin())
);

CREATE POLICY "contact_submissions_insert_authenticated"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "contact_submissions_update_admin"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_admin())
)
WITH CHECK (
  (SELECT public.is_admin())
);

CREATE POLICY "contact_submissions_delete_super_admin"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (
  (SELECT public.is_super_admin())
);

-- =====================================================
-- ACTIVITY_LOGS POLICIES (Update to use new functions)
-- =====================================================

DROP POLICY IF EXISTS "activity_logs_select_own" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_select_admin" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_authenticated" ON public.activity_logs;

CREATE POLICY "activity_logs_select_own"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "activity_logs_select_admin"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (
  (SELECT public.is_admin())
);

CREATE POLICY "activity_logs_insert_authenticated"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'RLS Policies Created Successfully';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'User Profiles Policies: 6';
  RAISE NOTICE 'Admin Profiles Policies: 7';
  RAISE NOTICE 'Updated Other Table Policies: 15+';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✅ All RLS policies applied';
END $$;

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
