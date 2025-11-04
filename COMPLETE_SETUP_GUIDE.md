# 🚀 Complete Authentication Setup Guide

**Goal:** Set up Google authentication with separate user and admin tables for your JKKN institution website.

**Time Required:** 20-30 minutes

---

## Overview

After this setup:
- ✅ Anyone can view the homepage (no login required)
- ✅ Users can sign in with Google (@jkkn.ac.in domain)
- ✅ Regular users → Stored in `user_profiles` table
- ✅ Admins → Stored in `admin_profiles` table
- ✅ Only admins can access `/admin` routes
- ✅ Role-based access control (admin/super_admin)

---

## Part 1: Database Setup (15 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **htpanlaslzowmnemyobc**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migration Scripts (In Order!)

You need to run **3 SQL files** in order. Each file is in `supabase/setup/` folder.

---

#### Migration 1: Create Tables

📁 **File:** `supabase/setup/06_split_user_admin_tables.sql`

**What it does:**
- Creates `user_profiles` table (for regular users)
- Creates `admin_profiles` table (for admins)
- Migrates any existing data
- Creates backup of old data
- Updates helper functions

**How to run:**
1. Open the file: `D:\Sangeetha\JKKN-Dental-College\supabase\setup\06_split_user_admin_tables.sql`
2. Copy ALL the content (Ctrl + A, Ctrl + C)
3. Paste into Supabase SQL Editor
4. Click **Run** button
5. Wait for "Success" message
6. Check for verification message showing user and admin counts

**Expected Output:**
```
===========================================
Migration Summary:
===========================================
Original profiles: X
User profiles: X
Admin profiles: X
Total migrated: X
===========================================
✅ Migration successful - all profiles migrated
```

---

#### Migration 2: Apply Security Policies

📁 **File:** `supabase/setup/07_rls_policies_split_tables.sql`

**What it does:**
- Applies Row-Level Security (RLS) policies
- 6 policies for `user_profiles`
- 7 policies for `admin_profiles`
- Updates policies for other tables

**How to run:**
1. Open the file: `D:\Sangeetha\JKKN-Dental-College\supabase\setup\07_rls_policies_split_tables.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor (new query)
4. Click **Run**
5. Wait for success

**Expected Output:**
```
===========================================
RLS Policies Created Successfully
===========================================
User Profiles Policies: 6
Admin Profiles Policies: 7
Updated Other Table Policies: 15+
===========================================
✅ All RLS policies applied
```

---

#### Migration 3: Set Up Triggers

📁 **File:** `supabase/setup/08_triggers_split_tables.sql`

**What it does:**
- Auto-creates user_profile when someone signs up
- Updates timestamps automatically
- Tracks admin logins
- Prevents admin self-deletion
- Logs important changes

**How to run:**
1. Open the file: `D:\Sangeetha\JKKN-Dental-College\supabase\setup\08_triggers_split_tables.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor (new query)
4. Click **Run**
5. Wait for success

**Expected Output:**
```
===========================================
Triggers Created Successfully
===========================================
User Profile Triggers: 2
Admin Profile Triggers: 4
Utility Functions: 1
===========================================
✅ All triggers configured
```

---

### Step 3: Verify Database Setup

Run this verification query in SQL Editor:

```sql
-- Verify tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'admin_profiles')
ORDER BY table_name;

-- Check helper functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('is_admin', 'is_super_admin', 'get_user_type');
```

**Expected Output:**
- 2 tables: `admin_profiles`, `user_profiles`
- 3 functions: `get_user_type`, `is_admin`, `is_super_admin`

✅ If you see these, database setup is complete!

---

## Part 2: Google OAuth Setup (10 minutes)

### Step 1: Create Google OAuth Credentials

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Name it: "JKKN Institution Website"

**Authorized JavaScript origins:**
```
http://localhost:3000
https://your-domain.com (for production later)
```

**Authorized redirect URIs:**
```
https://htpanlaslzowmnemyobc.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

7. Click **Create**
8. **Copy** the Client ID and Client Secret

---

### Step 2: Configure Supabase Google Provider

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **Enable Sign in with Google**
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

---

### Step 3: Configure Site URL

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:3000`
3. Set **Redirect URLs:** Add these:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/
   http://localhost:3000/admin/dashboard
   ```
4. Click **Save**

---

## Part 3: Create Your First Admin Account (5 minutes)

### Step 1: Sign Up as Regular User First

1. Stop your dev server if running (Ctrl + C)
2. Clear cache:
   ```bash
   powershell -Command "Remove-Item -Path '.next' -Recurse -Force"
   ```
3. Start server:
   ```bash
   npm run dev
   ```
4. Go to: `http://localhost:3000/auth/login`
5. Click **"Sign in with Google"**
6. Sign in with your **@jkkn.ac.in** email
7. You'll be redirected to homepage

---

### Step 2: Verify User Profile Created

In Supabase SQL Editor, run:

```sql
-- Check your user was created
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';

-- Check user_profile was created
SELECT id, email, status, created_at
FROM public.user_profiles
WHERE email = 'your-email@jkkn.ac.in';
```

You should see your account in both tables. ✅

---

### Step 3: Promote Yourself to Super Admin

Now run this SQL to create your admin profile:

```sql
-- Promote your account to super_admin
INSERT INTO public.admin_profiles (
  id,
  email,
  full_name,
  role,
  status,
  department,
  created_at
)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  'super_admin',
  'active',
  'Administration',
  NOW()
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';  -- Replace with YOUR email

-- Verify it was created
SELECT
  email,
  role,
  status,
  department,
  created_at
FROM public.admin_profiles
WHERE email = 'your-email@jkkn.ac.in';
```

**Expected Output:**
```
email: your-email@jkkn.ac.in
role: super_admin
status: active
department: Administration
```

✅ You're now a super admin!

---

### Step 4: Test Admin Access

1. Go to: `http://localhost:3000/admin/dashboard`
2. You should see:
   - ✅ Dashboard loads successfully
   - ✅ Sidebar with navigation menu
   - ✅ Header showing your email
   - ✅ Purple "Super Admin" badge
   - ✅ Statistics cards (may show 0 if no other users yet)

🎉 **Success!** You can now access the admin panel!

---

## Part 4: Understanding the Flow

### Public Homepage Flow

```
User visits http://localhost:3000
  ↓
Homepage loads (NO authentication required)
  ↓
User can browse public pages freely
```

### User Sign Up Flow

```
User clicks "Sign in with Google"
  ↓
Redirects to Google OAuth
  ↓
User selects @jkkn.ac.in account
  ↓
Redirects to /auth/callback
  ↓
Creates user_profile automatically (via trigger)
  ↓
Redirects to homepage
  ↓
User is now authenticated
```

### Admin Access Flow

```
User (with admin_profile) tries to access /admin/*
  ↓
Middleware checks admin_profiles table
  ↓
If found AND status='active' AND role='admin' or 'super_admin'
  ↓
Access granted ✅
```

### Regular User Trying Admin Access

```
Regular user tries to access /admin/*
  ↓
Middleware checks admin_profiles table
  ↓
No admin_profile found
  ↓
Redirected to /auth/unauthorized ❌
```

---

## Part 5: Creating Additional Admins

### Promote Existing User to Admin

```sql
-- Create admin profile for existing user
INSERT INTO public.admin_profiles (
  id,
  email,
  full_name,
  role,
  status,
  department,
  created_by,
  approved_at,
  approved_by
)
SELECT
  u.id,
  u.email,
  up.full_name,
  'admin',  -- or 'super_admin'
  'active',
  'IT Department',  -- optional
  'YOUR_SUPER_ADMIN_ID',  -- your user ID
  NOW(),
  'YOUR_SUPER_ADMIN_ID'
FROM auth.users u
JOIN public.user_profiles up ON up.id = u.id
WHERE u.email = 'staff-email@jkkn.ac.in';
```

### Create Admin Directly (New User)

When a new staff member needs admin access:

1. They sign in with Google first (creates user_profile)
2. You run the SQL above to create their admin_profile
3. They can now access admin panel

---

## Part 6: Testing Everything

### Test 1: Public Homepage Access

1. Open incognito window
2. Go to: `http://localhost:3000`
3. Homepage should load WITHOUT requiring login ✅

### Test 2: User Sign In

1. In incognito window, go to: `http://localhost:3000/auth/login`
2. Sign in with a different @jkkn.ac.in account (not your admin one)
3. Should redirect to homepage ✅
4. Check database - user_profile should be created ✅

### Test 3: Regular User Cannot Access Admin

1. While signed in as regular user, try: `http://localhost:3000/admin/dashboard`
2. Should see "Access Denied" page ✅
3. This is correct! Regular users shouldn't access admin.

### Test 4: Admin Can Access Admin Panel

1. Sign out
2. Sign in with your admin account (@jkkn.ac.in)
3. Go to: `http://localhost:3000/admin/dashboard`
4. Should see dashboard with "Super Admin" badge ✅

### Test 5: Statistics Work

1. In admin dashboard, check statistics cards
2. **Total Users** should show count from both tables ✅
3. **Active Users** should show recent logins ✅
4. **Pending Inquiries** works if contact_submissions has data ✅

---

## Part 7: Troubleshooting

### Issue: "Can't access admin dashboard"

**Check 1: Admin profile exists?**
```sql
SELECT * FROM public.admin_profiles WHERE email = 'your-email@jkkn.ac.in';
```
If empty, run the admin creation SQL from Step 3.3 above.

**Check 2: Role is correct?**
```sql
SELECT email, role, status FROM public.admin_profiles WHERE email = 'your-email@jkkn.ac.in';
```
Should show: `role: super_admin` or `role: admin`, `status: active`

**Check 3: Clear cache and restart**
```bash
powershell -Command "Remove-Item -Path '.next' -Recurse -Force"
npm run dev
```

---

### Issue: "Google OAuth not working"

**Check 1: Credentials configured?**
- Supabase → Authentication → Providers → Google
- Should be enabled with Client ID and Secret

**Check 2: Redirect URI correct?**
- Google Console → Credentials → Your OAuth Client
- Should include: `https://htpanlaslzowmnemyobc.supabase.co/auth/v1/callback`

**Check 3: Site URL correct?**
- Supabase → Authentication → URL Configuration
- Site URL should be: `http://localhost:3000`

---

### Issue: "User profile not created after sign in"

**Check 1: Trigger exists?**
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
If empty, re-run `08_triggers_split_tables.sql`

**Check 2: Check auth.users table**
```sql
SELECT id, email FROM auth.users WHERE email = 'problem-email@jkkn.ac.in';
```
User should exist here.

**Check 3: Manually create profile**
```sql
INSERT INTO public.user_profiles (id, email, status)
SELECT id, email, 'active'
FROM auth.users
WHERE email = 'problem-email@jkkn.ac.in';
```

---

## Part 8: Security Checklist

Before going live, ensure:

- [ ] Demo mode is DISABLED (`NEXT_PUBLIC_DEMO_MODE=false`)
- [ ] Google OAuth credentials are production-ready
- [ ] Site URL is set to production domain
- [ ] Only trusted staff have super_admin role
- [ ] Regular backups enabled in Supabase
- [ ] RLS policies are active on all tables
- [ ] HTTPS enabled for production

---

## Part 9: What's Next?

Now that authentication is set up, you can:

### Phase 2: User Management
- View all users in data table
- Block/unblock users
- Promote users to admin
- View activity logs

### Phase 3: Content Management
- Edit announcements
- Manage benefits section
- Update statistics
- Upload videos

### Phase 4: Inquiry Management
- View contact form submissions
- Respond to inquiries
- Track status

---

## Quick Reference

### Tables

| Table | Purpose | Who Has Access |
|-------|---------|----------------|
| `user_profiles` | Regular users | Everyone (own profile) |
| `admin_profiles` | Admins/super_admins | Admins (all profiles) |
| `auth.users` | Supabase auth users | System only |

### Roles

| Role | Access Level |
|------|--------------|
| `user` | Public pages only (no admin access) |
| `admin` | Admin panel + manage content |
| `super_admin` | Full access + manage admins |

### Helper Functions

```sql
SELECT public.is_admin();           -- Returns true if user is admin/super_admin
SELECT public.is_super_admin();     -- Returns true if user is super_admin
SELECT public.get_user_type();      -- Returns: user, admin, super_admin, or unknown
```

### Important URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Homepage (public) |
| `http://localhost:3000/auth/login` | Sign in page |
| `http://localhost:3000/admin/dashboard` | Admin dashboard |
| `http://localhost:3000/auth/unauthorized` | Access denied page |

---

## Summary

✅ **Database Setup:** 3 SQL files run successfully
✅ **Google OAuth:** Configured in Supabase
✅ **First Admin:** Created with super_admin role
✅ **Testing:** All flows verified
✅ **Security:** RLS policies active

Your JKKN website now has:
- ✅ Public homepage (no login required)
- ✅ Google authentication for @jkkn.ac.in users
- ✅ Separate user and admin tables
- ✅ Role-based access control
- ✅ Secure admin panel

**You're ready to build Phase 2!** 🚀

---

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the SQL verification queries
3. Check browser console for errors (F12)
4. Check Supabase logs for authentication errors

---

**Setup complete!** You now have a fully functional authentication system with separate user and admin management. 🎉
