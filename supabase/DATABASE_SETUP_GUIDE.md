# JKKN Admin Panel - Database Setup Guide

## 🎯 Quick Start

This guide will help you set up the complete database schema for your JKKN Admin Panel in **under 5 minutes**.

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] Supabase project created (from SUPABASE_SETUP_GUIDE.md Step 1-2)
- [ ] Supabase credentials in `.env.local`
- [ ] Supabase Dashboard open

---

## 📋 Setup Steps

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **JKKN Institution** project
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query**

### Step 2: Run SQL Files in Order

**⚠️ IMPORTANT:** Run files in this **EXACT ORDER**

#### File 1: Create Tables (01_tables.sql)

1. Open `supabase/setup/01_tables.sql` in your editor
2. **Copy ALL contents** (Ctrl+A, Ctrl+C)
3. **Paste** into Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. ✅ Wait for "Success. No rows returned"

**What this does:**
- Creates 9 database tables
- Adds all constraints and indexes
- Enables Row-Level Security
- Validates @jkkn.ac.in email domain

#### File 2: Create Functions (02_functions.sql)

1. Open `supabase/setup/02_functions.sql`
2. **Copy ALL contents**
3. **Paste** into Supabase SQL Editor (new query or same)
4. Click **Run**
5. ✅ Wait for "Success. No rows returned"

**What this does:**
- Creates helper functions
- Sets up authentication helpers
- Adds audit logging function
- Creates admin check functions

#### File 3: Create RLS Policies (03_policies.sql)

1. Open `supabase/setup/03_policies.sql`
2. **Copy ALL contents**
3. **Paste** into Supabase SQL Editor
4. Click **Run**
5. ✅ Wait for "Success. No rows returned"

**What this does:**
- Secures all tables with RLS policies
- Implements role-based access control
- Allows users to see own data
- Allows admins to see all data

#### File 4: Create Triggers (04_triggers.sql)

1. Open `supabase/setup/04_triggers.sql`
2. **Copy ALL contents**
3. **Paste** into Supabase SQL Editor
4. Click **Run**
5. ✅ Wait for "Success. No rows returned"

**What this does:**
- Auto-creates profile on user signup
- Auto-updates timestamps
- Auto-increments content versions

---

## 🔍 Verify Installation

After running all files, verify everything is set up correctly:

### Check 1: Verify Tables Created

Run this query in SQL Editor:

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Result:** 9 tables
```
✅ activity_logs
✅ announcements
✅ benefits
✅ campus_videos
✅ contact_submissions
✅ content_sections
✅ media_library
✅ profiles
✅ statistics
```

### Check 2: Verify RLS Enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Result:** All tables show `rowsecurity = t` (true)

### Check 3: Verify Policies Created

```sql
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public';
```

**Expected Result:** 40+ policies

### Check 4: Verify Functions Created

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

**Expected Result:** 7+ functions including:
- `get_user_role`
- `handle_new_user`
- `is_admin`
- `is_super_admin`
- `log_activity`

### Check 5: Verify Triggers Created

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected Result:** 9+ triggers on various tables

---

## 👤 Create Your First Admin Account

### Step 1: Sign Up with Your College Email

1. Open your app: `http://localhost:3000`
2. You'll be redirected to `/auth/login`
3. Click **"Sign in with Google"**
4. Use your **@jkkn.ac.in** email
5. Complete the sign-in process

This will:
- Create your user in `auth.users`
- Auto-create your profile in `public.profiles`
- Default role will be `user`

### Step 2: Promote Yourself to Super Admin

Go back to Supabase SQL Editor and run:

```sql
-- Replace with YOUR actual email
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'your-email@jkkn.ac.in';
```

### Step 3: Verify Your Admin Status

```sql
SELECT
  email,
  full_name,
  role,
  status,
  created_at
FROM public.profiles
WHERE email = 'your-email@jkkn.ac.in';
```

**Expected Result:**
```
email: your-email@jkkn.ac.in
role: super_admin
status: active
```

### Step 4: Test Admin Access

1. Go to `http://localhost:3000/admin/dashboard`
2. You should see the admin dashboard
3. Check the header - your role badge should say "Super Admin"

---

## 🎉 You're All Set!

Your database is now fully configured with:

✅ **9 Tables** - All data structures ready
✅ **41 RLS Policies** - Secure access control
✅ **9 Functions** - Business logic helpers
✅ **9 Triggers** - Automatic data management
✅ **1 Super Admin** - You!

---

## 🚀 Next Steps

Now that your database is ready:

1. **Test Authentication:**
   - Sign out and sign in again
   - Verify you can access admin panel

2. **Test User Management:**
   - Invite another @jkkn.ac.in user
   - View them in the admin dashboard
   - Try blocking/unblocking

3. **Start Building Features:**
   - Add announcements
   - Upload videos
   - Manage content
   - View analytics

---

## 🐛 Troubleshooting

### Issue: "permission denied for schema public"

**Solution:**
```sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### Issue: "relation 'profiles' does not exist"

**Solution:** Re-run `01_tables.sql` - the tables didn't create properly

### Issue: "function auth.uid() does not exist"

**Solution:** This shouldn't happen with our setup, but if it does:
```sql
-- Check if auth schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';
```

### Issue: Profile not created after signup

**Solution:** Check trigger exists:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

If missing, re-run `04_triggers.sql`

### Issue: Can't access admin panel even as admin

**Solution:**
1. Verify role:
```sql
SELECT email, role, status FROM public.profiles WHERE email = 'your-email@jkkn.ac.in';
```

2. Clear browser cache and cookies
3. Sign out and sign in again

### Issue: RLS blocking queries

**Solution:** Check your authentication:
```sql
-- This should return your user ID
SELECT auth.uid();

-- This should return true if you're admin
SELECT public.is_admin();
```

---

## 📚 Understanding Your Database

### Table Relationships

```
auth.users (Supabase Auth)
    └─> profiles (1:1) - User profiles with roles
            └─> activity_logs (1:many) - Audit trail
            └─> campus_videos (1:many) - Uploaded by
            └─> media_library (1:many) - Uploaded by
            └─> contact_submissions (1:many) - Submitted by

Standalone tables:
- announcements - Site banners
- content_sections - Dynamic content (hero, about, etc.)
- benefits - "Why Choose JKKN" cards
- statistics - "Our Strength" numbers
```

### Role Hierarchy

```
super_admin
    └─> Full access to everything
    └─> Can manage other admins
    └─> Can delete critical data

admin
    └─> Manage content and users
    └─> View analytics
    └─> Cannot delete admins

user (default)
    └─> View public website
    └─> View own profile
    └─> Submit inquiries
```

### Security Model

1. **Row-Level Security (RLS):** Every table is protected
2. **Role-Based Access:** Policies check user role
3. **Ownership Model:** Users can view/edit own data
4. **Admin Override:** Admins can view/edit all data
5. **Audit Trail:** All admin actions logged

---

## 🔄 Database Migrations (Future Updates)

When we add new features, you'll receive migration files. To apply:

1. Backup your database first (Supabase Dashboard → Database → Backups)
2. Run migration SQL in Supabase SQL Editor
3. Verify with provided test queries
4. Update `SQL_FILE_INDEX.md`

---

## 📖 Reference Documentation

- **Full PRD:** `ADMIN_PANEL_PRD.md`
- **SQL File Index:** `supabase/SQL_FILE_INDEX.md`
- **Supabase Setup:** `SUPABASE_SETUP_GUIDE.md`
- **Implementation Status:** `ADMIN_PANEL_IMPLEMENTATION_STATUS.md`

---

## 💡 Pro Tips

1. **Bookmark SQL Editor:** You'll use it often for data inspection
2. **Use Table Editor:** Supabase Dashboard → Table Editor for visual data editing
3. **Check Logs:** Database → Logs for debugging
4. **Test RLS:** Use "RLS Disabled" toggle in Table Editor to see policy effects
5. **Regular Backups:** Enable Point-in-Time Recovery in Database settings

---

## ✅ Completion Checklist

Mark these as you complete each step:

- [ ] Ran 01_tables.sql successfully
- [ ] Ran 02_functions.sql successfully
- [ ] Ran 03_policies.sql successfully
- [ ] Ran 04_triggers.sql successfully
- [ ] Verified all 9 tables exist
- [ ] Verified RLS enabled on all tables
- [ ] Verified 40+ policies created
- [ ] Signed up with @jkkn.ac.in email
- [ ] Promoted self to super_admin
- [ ] Accessed admin dashboard successfully
- [ ] Reviewed SQL_FILE_INDEX.md
- [ ] Bookmarked Supabase Dashboard

---

**🎊 Congratulations!** Your JKKN Admin Panel database is fully set up and ready to use!

**Next:** Continue with Google OAuth configuration if you haven't already, then start building features!

---

**Document Version:** 1.0
**Last Updated:** 2025-01-03
**Estimated Setup Time:** 5 minutes
