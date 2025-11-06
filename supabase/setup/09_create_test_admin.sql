-- =====================================================
-- CREATE TEST ADMIN USER
-- =====================================================
-- Purpose: Create a test admin user for development
-- Usage: Run this in Supabase SQL Editor
-- NOTE: This is for DEVELOPMENT ONLY
-- =====================================================

-- Step 1: First, manually create a user via Supabase Auth Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@jkkn.edu.in
-- 4. Password: (set a secure password)
-- 5. Auto Confirm User: YES
-- 6. Copy the user's UUID

-- Step 2: Run this SQL to update the profile with admin role
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from step 1

-- Example:
-- UPDATE public.profiles
-- SET role = 'super_admin'
-- WHERE id = 'YOUR_USER_UUID_HERE';

-- Or if you know the email:
UPDATE public.profiles
SET
  role = 'super_admin',
  status = 'active',
  full_name = 'Super Admin',
  department = 'Administration',
  updated_at = NOW()
WHERE email = 'admin@jkkn.edu.in';

-- Verify the update
SELECT id, email, full_name, role, status
FROM public.profiles
WHERE email = 'admin@jkkn.edu.in';

-- =====================================================
-- ALTERNATIVE: If you want to create a user via SQL
-- (Requires Supabase service_role key - not recommended for production)
-- =====================================================

-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   confirmation_sent_at,
--   confirmation_token,
--   recovery_token,
--   email_change_token_new,
--   email_change,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   is_super_admin,
--   last_sign_in_at
-- )
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@jkkn.edu.in',
--   crypt('YourSecurePassword123!', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   '',
--   '',
--   '',
--   '',
--   NOW(),
--   NOW(),
--   '{"provider":"email","providers":["email"]}',
--   '{"full_name":"Super Admin"}',
--   NULL,
--   NOW()
-- );
