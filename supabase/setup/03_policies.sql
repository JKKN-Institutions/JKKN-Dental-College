-- =====================================================
-- JKKN ADMIN PANEL - RLS POLICIES
-- =====================================================
-- Created: 2025-01-03
-- Purpose: Row-Level Security policies for all tables
-- Performance: All policies use indexed columns and wrapped functions
-- Security: All policies specify target roles explicitly
-- =====================================================

-- =====================================================
-- PROFILES TABLE RLS POLICIES
-- Performance: Indexed on id, role
-- =====================================================

-- SELECT: Users can view own profile, admins can view all
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- UPDATE: Users can update own profile, admins can update all
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_admin"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only super admins can delete profiles
CREATE POLICY "profiles_delete_super_admin"
ON public.profiles
FOR DELETE
TO authenticated
USING ((SELECT public.is_super_admin()));

-- =====================================================
-- ANNOUNCEMENTS TABLE RLS POLICIES
-- Performance: Indexed on is_active
-- =====================================================

-- SELECT: Anyone can view active announcements, admins can view all
CREATE POLICY "announcements_select_active"
ON public.announcements
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "announcements_select_admin"
ON public.announcements
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Only admins can create announcements
CREATE POLICY "announcements_insert_admin"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update announcements
CREATE POLICY "announcements_update_admin"
ON public.announcements
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only admins can delete announcements
CREATE POLICY "announcements_delete_admin"
ON public.announcements
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- =====================================================
-- CONTENT_SECTIONS TABLE RLS POLICIES
-- Performance: Indexed on section_key, is_published
-- =====================================================

-- SELECT: Anyone can view published content, admins can view all
CREATE POLICY "content_sections_select_published"
ON public.content_sections
FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "content_sections_select_admin"
ON public.content_sections
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Only admins can create content sections
CREATE POLICY "content_sections_insert_admin"
ON public.content_sections
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update content sections
CREATE POLICY "content_sections_update_admin"
ON public.content_sections
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only super admins can delete content sections
CREATE POLICY "content_sections_delete_super_admin"
ON public.content_sections
FOR DELETE
TO authenticated
USING ((SELECT public.is_super_admin()));

-- =====================================================
-- BENEFITS TABLE RLS POLICIES
-- Performance: Indexed on is_active
-- =====================================================

-- SELECT: Anyone can view active benefits, admins can view all
CREATE POLICY "benefits_select_active"
ON public.benefits
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "benefits_select_admin"
ON public.benefits
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Only admins can create benefits
CREATE POLICY "benefits_insert_admin"
ON public.benefits
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update benefits
CREATE POLICY "benefits_update_admin"
ON public.benefits
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only admins can delete benefits
CREATE POLICY "benefits_delete_admin"
ON public.benefits
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- =====================================================
-- STATISTICS TABLE RLS POLICIES
-- Performance: Indexed on is_active
-- =====================================================

-- SELECT: Anyone can view active statistics, admins can view all
CREATE POLICY "statistics_select_active"
ON public.statistics
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "statistics_select_admin"
ON public.statistics
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Only admins can create statistics
CREATE POLICY "statistics_insert_admin"
ON public.statistics
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update statistics
CREATE POLICY "statistics_update_admin"
ON public.statistics
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only admins can delete statistics
CREATE POLICY "statistics_delete_admin"
ON public.statistics
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- =====================================================
-- CAMPUS_VIDEOS TABLE RLS POLICIES
-- Performance: Indexed on is_active
-- =====================================================

-- SELECT: Anyone can view active videos, admins can view all
CREATE POLICY "campus_videos_select_active"
ON public.campus_videos
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "campus_videos_select_admin"
ON public.campus_videos
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Only admins can upload videos
CREATE POLICY "campus_videos_insert_admin"
ON public.campus_videos
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update videos
CREATE POLICY "campus_videos_update_admin"
ON public.campus_videos
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only admins can delete videos
CREATE POLICY "campus_videos_delete_admin"
ON public.campus_videos
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- =====================================================
-- CONTACT_SUBMISSIONS TABLE RLS POLICIES
-- Performance: Indexed on email, submitted_by
-- =====================================================

-- SELECT: Users can view own submissions, admins can view all
CREATE POLICY "contact_submissions_select_own"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (
  submitted_by = (SELECT auth.uid())
  OR email = (SELECT email FROM public.profiles WHERE id = (SELECT auth.uid()))
);

CREATE POLICY "contact_submissions_select_admin"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Anyone can submit inquiries
CREATE POLICY "contact_submissions_insert_authenticated"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: Only admins can update submissions
CREATE POLICY "contact_submissions_update_admin"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only super admins can delete submissions
CREATE POLICY "contact_submissions_delete_super_admin"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING ((SELECT public.is_super_admin()));

-- =====================================================
-- ACTIVITY_LOGS TABLE RLS POLICIES
-- Performance: Indexed on user_id
-- =====================================================

-- SELECT: Users can view own logs, admins can view all
CREATE POLICY "activity_logs_select_own"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "activity_logs_select_admin"
ON public.activity_logs
FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- INSERT: Authenticated users can create logs
CREATE POLICY "activity_logs_insert_authenticated"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: No one can update logs (immutable audit trail)
-- DELETE: Only super admins can delete old logs
CREATE POLICY "activity_logs_delete_super_admin"
ON public.activity_logs
FOR DELETE
TO authenticated
USING ((SELECT public.is_super_admin()));

-- =====================================================
-- MEDIA_LIBRARY TABLE RLS POLICIES
-- Performance: Indexed on uploaded_by
-- =====================================================

-- SELECT: Anyone can view media
CREATE POLICY "media_library_select_all"
ON public.media_library
FOR SELECT
TO authenticated
USING (true);

-- INSERT: Only admins can upload media
CREATE POLICY "media_library_insert_admin"
ON public.media_library
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- UPDATE: Only admins can update media metadata
CREATE POLICY "media_library_update_admin"
ON public.media_library
FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- DELETE: Only admins can delete media
CREATE POLICY "media_library_delete_admin"
ON public.media_library
FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
