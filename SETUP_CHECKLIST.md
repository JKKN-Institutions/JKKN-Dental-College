# ✅ Setup Checklist - Quick Reference

Use this checklist while following the complete setup guide.

---

## Pre-Setup

- [x] ✅ Demo mode disabled (`NEXT_PUBLIC_DEMO_MODE=false`)
- [x] ✅ Cache cleared
- [ ] ⏳ Supabase project ready
- [ ] ⏳ Project ID: **htpanlaslzowmnemyobc**

---

## Part 1: Database Setup (15 min)

### SQL Migrations (Run in Supabase SQL Editor)

- [ ] 1️⃣ Run `06_split_user_admin_tables.sql`
  - Location: `supabase/setup/06_split_user_admin_tables.sql`
  - Creates: `user_profiles` and `admin_profiles` tables
  - Expected: Migration summary showing user/admin counts

- [ ] 2️⃣ Run `07_rls_policies_split_tables.sql`
  - Location: `supabase/setup/07_rls_policies_split_tables.sql`
  - Creates: 13 RLS policies for security
  - Expected: "RLS Policies Created Successfully"

- [ ] 3️⃣ Run `08_triggers_split_tables.sql`
  - Location: `supabase/setup/08_triggers_split_tables.sql`
  - Creates: Auto-create user profile trigger
  - Expected: "Triggers Created Successfully"

### Verify Database

- [ ] Run verification query to check tables exist
- [ ] Run verification query to check functions exist

---

## Part 2: Google OAuth Setup (10 min)

### Google Cloud Console

- [ ] Create OAuth 2.0 Client ID
- [ ] Add redirect URI: `https://htpanlaslzowmnemyobc.supabase.co/auth/v1/callback`
- [ ] Add redirect URI: `http://localhost:3000/auth/callback`
- [ ] Copy Client ID
- [ ] Copy Client Secret

### Supabase Configuration

- [ ] Go to Authentication → Providers
- [ ] Enable Google provider
- [ ] Paste Client ID
- [ ] Paste Client Secret
- [ ] Save configuration
- [ ] Set Site URL: `http://localhost:3000`
- [ ] Add redirect URLs

---

## Part 3: Create First Admin (5 min)

### Sign Up First

- [ ] Clear cache: `powershell -Command "Remove-Item -Path '.next' -Recurse -Force"`
- [ ] Start server: `npm run dev`
- [ ] Go to: `http://localhost:3000/auth/login`
- [ ] Sign in with your @jkkn.ac.in email
- [ ] Redirected to homepage

### Verify User Created

- [ ] Check `auth.users` table has your account
- [ ] Check `user_profiles` table has your profile

### Promote to Admin

- [ ] Run SQL to insert into `admin_profiles`:
  ```sql
  INSERT INTO public.admin_profiles (id, email, full_name, role, status, department, created_at)
  SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin', 'active', 'Administration', NOW()
  FROM auth.users
  WHERE email = 'YOUR-EMAIL@jkkn.ac.in';
  ```
- [ ] Verify: `SELECT * FROM admin_profiles WHERE email = 'YOUR-EMAIL@jkkn.ac.in'`

---

## Part 4: Test Everything

### Test Public Access

- [ ] Open incognito window
- [ ] Go to: `http://localhost:3000`
- [ ] Homepage loads WITHOUT login ✅

### Test User Sign In

- [ ] Sign in with different @jkkn.ac.in account
- [ ] Redirected to homepage ✅
- [ ] user_profile created in database ✅

### Test Admin Blocking

- [ ] Regular user tries: `http://localhost:3000/admin/dashboard`
- [ ] Shows "Access Denied" ✅

### Test Admin Access

- [ ] Sign in with your admin account
- [ ] Go to: `http://localhost:3000/admin/dashboard`
- [ ] Dashboard loads ✅
- [ ] Shows "Super Admin" badge ✅
- [ ] Statistics cards visible ✅

---

## Part 5: Verification Queries

Run these in Supabase SQL Editor to verify everything:

### Check Tables
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('user_profiles', 'admin_profiles');
```
- [ ] Returns 2 tables ✅

### Check Your Admin
```sql
SELECT email, role, status FROM admin_profiles WHERE email = 'YOUR-EMAIL@jkkn.ac.in';
```
- [ ] Shows: super_admin, active ✅

### Check Helper Functions
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name IN ('is_admin', 'is_super_admin', 'get_user_type');
```
- [ ] Returns 3 functions ✅

### Test Functions (while signed in as admin)
```sql
SELECT public.is_admin();           -- Should return TRUE
SELECT public.is_super_admin();     -- Should return TRUE
SELECT public.get_user_type();      -- Should return 'super_admin'
```
- [ ] All return expected values ✅

---

## Troubleshooting

If something doesn't work:

### Can't Access Admin Panel

- [ ] Verified admin_profile exists for your email?
- [ ] Verified role is 'super_admin' or 'admin'?
- [ ] Verified status is 'active'?
- [ ] Cleared cache and restarted server?
- [ ] Hard refreshed browser (Ctrl + Shift + R)?

### Google OAuth Not Working

- [ ] Checked redirect URIs in Google Console?
- [ ] Verified Client ID and Secret in Supabase?
- [ ] Checked Site URL in Supabase?

### User Profile Not Created

- [ ] Checked trigger exists: `on_auth_user_created`?
- [ ] User exists in auth.users table?
- [ ] Manually created profile with SQL if needed?

---

## Security Final Check

Before production:

- [ ] Demo mode is DISABLED
- [ ] Google OAuth has production redirect URIs
- [ ] Site URL is production domain
- [ ] Only trusted staff are super_admins
- [ ] Database backups enabled
- [ ] All RLS policies active
- [ ] HTTPS configured for production

---

## Success Indicators

You'll know everything is working when:

- ✅ Homepage loads without authentication
- ✅ Users can sign in with Google (@jkkn.ac.in)
- ✅ user_profiles created automatically on signup
- ✅ Regular users cannot access /admin
- ✅ You can access /admin/dashboard
- ✅ Dashboard shows "Super Admin" badge
- ✅ Statistics show real counts

---

## What's Next?

After setup is complete:

### Phase 2: Build User Management
- [ ] Create user list page
- [ ] Add search and filter
- [ ] Implement block/unblock
- [ ] Add role management
- [ ] View activity logs

### Phase 3: Build Content Management
- [ ] Announcements CRUD
- [ ] Benefits management
- [ ] Statistics editor
- [ ] Video upload

---

## Time Estimates

- Database Setup: 15 minutes
- Google OAuth: 10 minutes
- Create Admin: 5 minutes
- Testing: 10 minutes
- **Total: ~40 minutes**

---

## Need Help?

See detailed guide: **COMPLETE_SETUP_GUIDE.md**

Common issues are covered in the troubleshooting section with SQL queries and solutions.

---

**Print this checklist and check off items as you complete them!** ✅
