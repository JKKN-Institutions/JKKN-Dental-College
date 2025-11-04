-- =====================================================
-- TRIGGERS: User and Admin Profiles
-- =====================================================
-- Created: 2025-01-04
-- Purpose: Automatic triggers for separate user and admin tables
-- =====================================================

-- =====================================================
-- FUNCTION: Handle new user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user profile by default for all new signups
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user_signup IS 'Automatically creates user_profile when new user signs up via OAuth';

-- =====================================================
-- TRIGGER: Create user profile on signup
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Creates user_profile automatically when user signs up';

-- =====================================================
-- FUNCTION: Update user_profiles timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Update user_profiles timestamp
-- =====================================================
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();

-- =====================================================
-- FUNCTION: Update admin_profiles timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_admin_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Update admin_profiles timestamp
-- =====================================================
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_profiles_updated_at();

-- =====================================================
-- FUNCTION: Log admin login
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_admin_login()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.last_login_at IS DISTINCT FROM OLD.last_login_at THEN
    NEW.login_count = OLD.login_count + 1;
  END IF;
  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Log admin login count
-- =====================================================
CREATE TRIGGER log_admin_login_trigger
  BEFORE UPDATE OF last_login_at ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_login();

COMMENT ON TRIGGER log_admin_login_trigger ON public.admin_profiles IS 'Increments login_count when last_login_at is updated';

-- =====================================================
-- FUNCTION: Prevent admin self-deletion
-- =====================================================
CREATE OR REPLACE FUNCTION public.prevent_admin_self_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own admin account';
  END IF;

  -- Log the deletion in activity_logs
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (
    auth.uid(),
    'delete',
    'admin_profile',
    OLD.id,
    jsonb_build_object(
      'deleted_email', OLD.email,
      'deleted_role', OLD.role
    )
  );

  RETURN OLD;
END;
$$;

-- =====================================================
-- TRIGGER: Prevent admin self-deletion
-- =====================================================
CREATE TRIGGER prevent_admin_self_deletion_trigger
  BEFORE DELETE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_self_deletion();

COMMENT ON TRIGGER prevent_admin_self_deletion_trigger ON public.admin_profiles IS 'Prevents admins from deleting their own account and logs deletion';

-- =====================================================
-- FUNCTION: Log admin profile changes
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_admin_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_changes JSONB := '{}'::jsonb;
BEGIN
  -- Detect role change
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    v_changes := v_changes || jsonb_build_object(
      'role_changed', true,
      'old_role', OLD.role,
      'new_role', NEW.role
    );
  END IF;

  -- Detect status change
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    v_changes := v_changes || jsonb_build_object(
      'status_changed', true,
      'old_status', OLD.status,
      'new_status', NEW.status
    );
  END IF;

  -- Log if there were significant changes
  IF v_changes != '{}'::jsonb THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      auth.uid(),
      'update',
      'admin_profile',
      NEW.id,
      v_changes || jsonb_build_object('target_email', NEW.email)
    );
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Log admin profile changes
-- =====================================================
CREATE TRIGGER log_admin_profile_changes_trigger
  AFTER UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_profile_changes();

COMMENT ON TRIGGER log_admin_profile_changes_trigger ON public.admin_profiles IS 'Logs significant changes to admin profiles (role, status) to activity_logs';

-- =====================================================
-- FUNCTION: Log user profile blocking
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_user_profile_blocking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log status changes (especially blocking)
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      auth.uid(),
      CASE
        WHEN NEW.status = 'blocked' THEN 'block_user'
        WHEN NEW.status = 'active' AND OLD.status = 'blocked' THEN 'unblock_user'
        ELSE 'update_user_status'
      END,
      'user_profile',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'user_email', NEW.email
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Log user profile blocking
-- =====================================================
CREATE TRIGGER log_user_profile_blocking_trigger
  AFTER UPDATE OF status ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_profile_blocking();

COMMENT ON TRIGGER log_user_profile_blocking_trigger ON public.user_profiles IS 'Logs user blocking/unblocking events to activity_logs';

-- =====================================================
-- FUNCTION: Update last_login for users
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_last_login(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to update user_profiles
  UPDATE public.user_profiles
  SET last_login_at = NOW()
  WHERE id = user_id;

  -- If not found, try admin_profiles
  IF NOT FOUND THEN
    UPDATE public.admin_profiles
    SET last_login_at = NOW()
    WHERE id = user_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.update_user_last_login IS 'Updates last_login_at for user or admin profile';

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Triggers Created Successfully';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'User Profile Triggers: 2';
  RAISE NOTICE 'Admin Profile Triggers: 4';
  RAISE NOTICE 'Utility Functions: 1';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✅ All triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Behavior:';
  RAISE NOTICE '• New signups → user_profile created automatically';
  RAISE NOTICE '• Admin profiles → created manually by super_admins';
  RAISE NOTICE '• Significant changes → logged to activity_logs';
  RAISE NOTICE '• Timestamps → auto-updated on changes';
  RAISE NOTICE '===========================================';
END $$;

-- =====================================================
-- END OF TRIGGERS
-- =====================================================
