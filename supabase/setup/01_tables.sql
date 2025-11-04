-- =====================================================
-- JKKN ADMIN PANEL - DATABASE SCHEMA
-- =====================================================
-- Created: 2025-01-03
-- Purpose: Complete database schema for JKKN Institution Admin Panel
-- Usage: Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLE: profiles
-- Purpose: User profiles with role-based access control
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0 NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';
COMMENT ON COLUMN public.profiles.role IS 'User role: user (default), admin, or super_admin';
COMMENT ON COLUMN public.profiles.status IS 'Account status: active, blocked, or pending';

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login_at DESC);

-- =====================================================
-- TABLE: announcements
-- Purpose: Site-wide announcements and banners
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_date_range CHECK (start_date IS NULL OR end_date IS NULL OR start_date < end_date)
);

COMMENT ON TABLE public.announcements IS 'Site-wide announcements displayed on banner';
COMMENT ON COLUMN public.announcements.priority IS 'Higher number = higher priority (shown first)';

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON public.announcements(start_date, end_date);

-- =====================================================
-- TABLE: content_sections
-- Purpose: Dynamic content sections (hero, about, etc.)
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.content_sections IS 'Dynamic content sections for website (hero, about, etc.)';
COMMENT ON COLUMN public.content_sections.section_key IS 'Unique identifier: hero, about, benefits, etc.';
COMMENT ON COLUMN public.content_sections.content IS 'JSON content structure specific to section type';

-- Enable RLS
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON public.content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_content_sections_published ON public.content_sections(is_published);

-- =====================================================
-- TABLE: benefits
-- Purpose: "Why Choose JKKN" benefit cards
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.benefits IS 'Benefit cards for "Why Choose JKKN" section';
COMMENT ON COLUMN public.benefits.order_index IS 'Display order (lower numbers first)';

-- Enable RLS
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_benefits_active_order ON public.benefits(is_active, order_index);

-- =====================================================
-- TABLE: statistics
-- Purpose: Institution statistics (students, placement %, etc.)
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.statistics IS 'Institution statistics for "Our Strength" section';
COMMENT ON COLUMN public.statistics.value IS 'Can be number or text like "50K+"';
COMMENT ON COLUMN public.statistics.suffix IS 'Optional suffix: %, +, K, etc.';

-- Enable RLS
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_statistics_active_order ON public.statistics(is_active, order_index);

-- =====================================================
-- TABLE: campus_videos
-- Purpose: Campus tour and promotional videos
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.campus_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.campus_videos IS 'Campus tour and promotional videos';
COMMENT ON COLUMN public.campus_videos.category IS 'Category: campus-tour, library, sports, events, etc.';
COMMENT ON COLUMN public.campus_videos.duration IS 'Duration in seconds';

-- Enable RLS
ALTER TABLE public.campus_videos ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campus_videos_active_order ON public.campus_videos(is_active, category, order_index);
CREATE INDEX IF NOT EXISTS idx_campus_videos_views ON public.campus_videos(view_count DESC);

-- =====================================================
-- TABLE: contact_submissions
-- Purpose: Contact form inquiries
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'spam')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions and inquiries';
COMMENT ON COLUMN public.contact_submissions.status IS 'Inquiry status: pending, in_progress, resolved, spam';

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned ON public.contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

-- =====================================================
-- TABLE: activity_logs
-- Purpose: Audit trail for all admin actions
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.activity_logs IS 'Audit trail for all admin actions';
COMMENT ON COLUMN public.activity_logs.action IS 'Action performed: login, logout, create, update, delete, etc.';
COMMENT ON COLUMN public.activity_logs.entity_type IS 'Type of entity: profile, announcement, video, etc.';

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- =====================================================
-- TABLE: media_library
-- Purpose: Media file management
-- Created: 2025-01-03
-- =====================================================
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  folder TEXT DEFAULT 'root' NOT NULL,
  alt_text TEXT,
  tags TEXT[],
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.media_library IS 'Media file management and organization';
COMMENT ON COLUMN public.media_library.file_size IS 'File size in bytes';
COMMENT ON COLUMN public.media_library.folder IS 'Folder path for organization';

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_library_type ON public.media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON public.media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded ON public.media_library(uploaded_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON public.media_library USING GIN(tags);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant authenticated users access to tables
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
