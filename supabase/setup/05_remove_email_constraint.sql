-- =====================================================
-- MIGRATION: Remove Email Domain Constraint
-- =====================================================
-- Created: 2025-01-04
-- Purpose: Remove @jkkn.ac.in email domain restriction
-- Reason: Allow any Google account, use role-based access control
-- =====================================================

-- Drop the email domain constraint from profiles table
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS valid_email;

-- Verify the constraint has been removed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_email'
    AND conrelid = 'public.profiles'::regclass
  ) THEN
    RAISE EXCEPTION 'Failed to remove valid_email constraint';
  ELSE
    RAISE NOTICE 'Email domain constraint successfully removed. Access is now controlled by role-based permissions.';
  END IF;
END $$;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
