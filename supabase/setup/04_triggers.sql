-- =====================================================
-- JKKN ADMIN PANEL - DATABASE TRIGGERS
-- =====================================================
-- Created: 2025-01-03
-- Purpose: Automatic triggers for JKKN Admin Panel
-- =====================================================

-- =====================================================
-- TRIGGER: on_auth_user_created
-- Purpose: Create profile when user signs up
-- Table: auth.users
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Automatically creates profile when new user signs up';

-- =====================================================
-- TRIGGER: on_profiles_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: profiles
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: on_announcements_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: announcements
-- =====================================================
DROP TRIGGER IF EXISTS on_announcements_updated ON public.announcements;

CREATE TRIGGER on_announcements_updated
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: on_content_sections_updated
-- Purpose: Auto-update updated_at and version
-- Table: content_sections
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_content_section_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_content_sections_updated ON public.content_sections;

CREATE TRIGGER on_content_sections_updated
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_content_section_version();

-- =====================================================
-- TRIGGER: on_benefits_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: benefits
-- =====================================================
DROP TRIGGER IF EXISTS on_benefits_updated ON public.benefits;

CREATE TRIGGER on_benefits_updated
  BEFORE UPDATE ON public.benefits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: on_statistics_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: statistics
-- =====================================================
DROP TRIGGER IF EXISTS on_statistics_updated ON public.statistics;

CREATE TRIGGER on_statistics_updated
  BEFORE UPDATE ON public.statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: on_campus_videos_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: campus_videos
-- =====================================================
DROP TRIGGER IF EXISTS on_campus_videos_updated ON public.campus_videos;

CREATE TRIGGER on_campus_videos_updated
  BEFORE UPDATE ON public.campus_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: on_contact_submissions_updated
-- Purpose: Auto-update updated_at timestamp
-- Table: contact_submissions
-- =====================================================
DROP TRIGGER IF EXISTS on_contact_submissions_updated ON public.contact_submissions;

CREATE TRIGGER on_contact_submissions_updated
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- END OF TRIGGERS
-- =====================================================
