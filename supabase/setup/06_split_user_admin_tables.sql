-- =====================================================
-- MIGRATION: Split User and Admin Profiles
-- =====================================================
-- Created: 2025-01-04
-- Purpose: Separate user_profiles and admin_profiles into distinct tables
-- Reason: Better separation of concerns, different fields for users vs admins
-- =====================================================

-- =====================================================
-- STEP 1: Backup existing profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles_backup AS
SELECT * FROM public.profiles;

COMMENT ON TABLE public.profiles_backup IS 'Backup of original profiles table before split';

-- =====================================================
-- STEP 2: Create user_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,

  -- Student/Applicant specific fields
  student_id TEXT UNIQUE,
  course_interested TEXT,
  qualification TEXT,

  -- Account management
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  email_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ
);

COMMENT ON TABLE public.user_profiles IS 'Regular user profiles (students, visitors, applicants)';
COMMENT ON COLUMN public.user_profiles.status IS 'Account status: active, blocked, or pending';
COMMENT ON COLUMN public.user_profiles.student_id IS 'Student ID for enrolled students';
COMMENT ON COLUMN public.user_profiles.course_interested IS 'Course they are interested in or enrolled in';

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_student_id ON public.user_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON public.user_profiles(last_login_at DESC);

-- =====================================================
-- STEP 3: Create admin_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,

  -- Admin specific fields
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')) NOT NULL,
  department TEXT,
  designation TEXT,
  employee_id TEXT UNIQUE,

  -- Permissions (JSONB for flexible permissions)
  permissions JSONB DEFAULT '{"can_manage_users": false, "can_manage_content": true, "can_view_analytics": true, "can_manage_inquiries": true}'::jsonb,

  -- Account management
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')) NOT NULL,

  -- Audit fields
  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0 NOT NULL
);

COMMENT ON TABLE public.admin_profiles IS 'Admin and super admin profiles with elevated permissions';
COMMENT ON COLUMN public.admin_profiles.role IS 'Admin role: admin or super_admin';
COMMENT ON COLUMN public.admin_profiles.permissions IS 'JSON object defining specific permissions for this admin';
COMMENT ON COLUMN public.admin_profiles.created_by IS 'Super admin who created this admin account';
COMMENT ON COLUMN public.admin_profiles.approved_by IS 'Super admin who approved this admin account';

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_status ON public.admin_profiles(status);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_employee_id ON public.admin_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_last_login ON public.admin_profiles(last_login_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_department ON public.admin_profiles(department);

-- =====================================================
-- STEP 4: Migrate existing data
-- =====================================================
-- Move regular users to user_profiles
INSERT INTO public.user_profiles (id, email, full_name, avatar_url, status, created_at, updated_at, last_login_at)
SELECT
  id,
  email,
  full_name,
  avatar_url,
  status,
  created_at,
  updated_at,
  last_login_at
FROM public.profiles
WHERE role = 'user'
ON CONFLICT (id) DO NOTHING;

-- Move admins to admin_profiles
INSERT INTO public.admin_profiles (id, email, full_name, avatar_url, role, department, status, created_at, updated_at, last_login_at, login_count)
SELECT
  id,
  email,
  full_name,
  avatar_url,
  CASE
    WHEN role = 'super_admin' THEN 'super_admin'
    ELSE 'admin'
  END,
  department,
  status,
  created_at,
  updated_at,
  last_login_at,
  login_count
FROM public.profiles
WHERE role IN ('admin', 'super_admin')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 5: Create updated helper functions
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role IN ('admin', 'super_admin')
  );
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if current user is an active admin or super_admin';

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND role = 'super_admin'
  );
$$;

COMMENT ON FUNCTION public.is_super_admin IS 'Returns true if current user is an active super_admin';

-- Function to get user type
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS TEXT
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT
    CASE
      WHEN EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid() AND role = 'super_admin') THEN 'super_admin'
      WHEN EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid() AND role = 'admin') THEN 'admin'
      WHEN EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid()) THEN 'user'
      ELSE 'unknown'
    END;
$$;

COMMENT ON FUNCTION public.get_user_type IS 'Returns user type: super_admin, admin, user, or unknown';

-- Function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS TEXT
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT role
  FROM public.admin_profiles
  WHERE id = auth.uid()
    AND status = 'active'
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_admin_role IS 'Returns admin role (admin or super_admin) if user is an admin';

-- =====================================================
-- STEP 6: Drop old functions that referenced profiles
-- =====================================================
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;

-- =====================================================
-- STEP 7: Grant permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify migration
DO $$
DECLARE
  v_user_count INTEGER;
  v_admin_count INTEGER;
  v_original_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_user_count FROM public.user_profiles;
  SELECT COUNT(*) INTO v_admin_count FROM public.admin_profiles;
  SELECT COUNT(*) INTO v_original_count FROM public.profiles_backup;

  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Original profiles: %', v_original_count;
  RAISE NOTICE 'User profiles: %', v_user_count;
  RAISE NOTICE 'Admin profiles: %', v_admin_count;
  RAISE NOTICE 'Total migrated: %', v_user_count + v_admin_count;
  RAISE NOTICE '===========================================';

  IF (v_user_count + v_admin_count) = v_original_count THEN
    RAISE NOTICE '✅ Migration successful - all profiles migrated';
  ELSE
    RAISE WARNING '⚠️ Migration incomplete - some profiles may be missing';
  END IF;
END $$;

-- =====================================================
-- OPTIONAL: Drop old profiles table (ONLY AFTER VERIFICATION!)
-- =====================================================
-- Uncomment the following lines ONLY after verifying migration is successful:

-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- RAISE NOTICE '⚠️ Original profiles table dropped. Backup still exists in profiles_backup.';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
