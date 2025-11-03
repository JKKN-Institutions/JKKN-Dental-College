-- =====================================================
-- JKKN ADMIN PANEL - DATABASE FUNCTIONS
-- =====================================================
-- Created: 2025-01-03
-- Purpose: Database functions for JKKN Admin Panel
-- Security: All functions use SECURITY INVOKER (safer default)
-- =====================================================

-- =====================================================
-- FUNCTION: handle_new_user
-- Purpose: Automatically create profile when user signs up
-- Created: 2025-01-03
-- Security: DEFINER (needs auth schema access)
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates profile when new user signs up via auth.users';

-- =====================================================
-- FUNCTION: update_last_login
-- Purpose: Update user last login timestamp and count
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_last_login(
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles
  SET
    last_login_at = NOW(),
    login_count = login_count + 1,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

COMMENT ON FUNCTION public.update_last_login IS 'Updates last login timestamp and increments login count';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_last_login TO authenticated;

-- =====================================================
-- FUNCTION: log_activity
-- Purpose: Log admin actions for audit trail
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_activity(
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_log_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := (SELECT auth.uid());

  -- Insert activity log
  INSERT INTO public.activity_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    details
  )
  VALUES (
    v_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_details
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

COMMENT ON FUNCTION public.log_activity IS 'Logs admin actions for audit trail';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.log_activity TO authenticated;

-- =====================================================
-- FUNCTION: is_admin
-- Purpose: Check if current user is admin or super_admin
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- Volatility: STABLE (result won't change within transaction)
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN v_role IN ('admin', 'super_admin');
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if current user is admin or super_admin';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- =====================================================
-- FUNCTION: is_super_admin
-- Purpose: Check if current user is super_admin
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- Volatility: STABLE (result won't change within transaction)
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN v_role = 'super_admin';
END;
$$;

COMMENT ON FUNCTION public.is_super_admin IS 'Returns true if current user is super_admin';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_super_admin TO authenticated;

-- =====================================================
-- FUNCTION: get_user_role
-- Purpose: Get current user's role
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- Volatility: STABLE (result won't change within transaction)
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN COALESCE(v_role, 'user');
END;
$$;

COMMENT ON FUNCTION public.get_user_role IS 'Returns current user role (user, admin, super_admin)';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- =====================================================
-- FUNCTION: increment_video_views
-- Purpose: Safely increment video view count
-- Created: 2025-01-03
-- Security: INVOKER (runs with caller permissions)
-- =====================================================
CREATE OR REPLACE FUNCTION public.increment_video_views(
  p_video_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.campus_videos
  SET view_count = view_count + 1
  WHERE id = p_video_id;
END;
$$;

COMMENT ON FUNCTION public.increment_video_views IS 'Increments video view count';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.increment_video_views TO authenticated;

-- =====================================================
-- END OF FUNCTIONS
-- =====================================================
