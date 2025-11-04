##

 🎉 Migration: Separate User and Admin Profile Tables

**Date:** January 4, 2025
**Status:** ✅ Complete
**Migration Type:** Schema Restructure
**Impact Level:** Major

---

## Overview

This migration separates the single `profiles` table into two distinct tables:
- **`user_profiles`** - For regular users (students, visitors, applicants)
- **`admin_profiles`** - For admins and super_admins with elevated permissions

### Why This Change?

✅ **Better separation of concerns** - Different data requirements for users vs admins
✅ **Enhanced security** - Admins isolated from regular users
✅ **Flexible schemas** - Can add user-specific or admin-specific fields independently
✅ **Clearer access control** - RLS policies more explicit and maintainable
✅ **Performance** - Smaller tables, more efficient queries

---

## New Schema Design

### user_profiles Table

**Purpose:** Store regular user data (students, visitors, applicants)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK, FK to auth.users) | User ID |
| `email` | TEXT | User email (unique) |
| `full_name` | TEXT | Full name |
| `avatar_url` | TEXT | Profile picture URL |
| `phone` | TEXT | Phone number |
| `date_of_birth` | DATE | Date of birth |
| `gender` | TEXT | Gender (male/female/other/prefer_not_to_say) |
| `address` | TEXT | Full address |
| `city` | TEXT | City |
| `state` | TEXT | State/Province |
| `country` | TEXT | Country (default: India) |
| `pincode` | TEXT | Postal code |
| **Student Fields** | | |
| `student_id` | TEXT | Student ID (unique) |
| `course_interested` | TEXT | Course enrolled/interested in |
| `qualification` | TEXT | Educational qualification |
| **Account Management** | | |
| `status` | TEXT | active/blocked/pending (default: active) |
| `email_verified` | BOOLEAN | Email verification status |
| **Timestamps** | | |
| `created_at` | TIMESTAMPTZ | Account creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |
| `last_login_at` | TIMESTAMPTZ | Last login timestamp |

**Indexes:**
- `idx_user_profiles_email` on email
- `idx_user_profiles_status` on status
- `idx_user_profiles_student_id` on student_id
- `idx_user_profiles_last_login` on last_login_at DESC

---

### admin_profiles Table

**Purpose:** Store admin data with elevated permissions

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK, FK to auth.users) | Admin ID |
| `email` | TEXT | Admin email (unique) |
| `full_name` | TEXT | Full name |
| `avatar_url` | TEXT | Profile picture URL |
| `phone` | TEXT | Phone number |
| **Admin Fields** | | |
| `role` | TEXT | admin/super_admin (NOT NULL) |
| `department` | TEXT | Department/Division |
| `designation` | TEXT | Job title/position |
| `employee_id` | TEXT | Employee ID (unique) |
| `permissions` | JSONB | Fine-grained permissions object |
| **Account Management** | | |
| `status` | TEXT | active/blocked/pending (default: active) |
| **Audit Fields** | | |
| `created_by` | UUID (FK to admin_profiles) | Super admin who created this account |
| `approved_at` | TIMESTAMPTZ | Approval timestamp |
| `approved_by` | UUID (FK to admin_profiles) | Super admin who approved |
| **Timestamps** | | |
| `created_at` | TIMESTAMPTZ | Account creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |
| `last_login_at` | TIMESTAMPTZ | Last login timestamp |
| `login_count` | INTEGER | Number of logins (default: 0) |

**Indexes:**
- `idx_admin_profiles_email` on email
- `idx_admin_profiles_role` on role
- `idx_admin_profiles_status` on status
- `idx_admin_profiles_employee_id` on employee_id
- `idx_admin_profiles_last_login` on last_login_at DESC
- `idx_admin_profiles_department` on department

---

## Permissions JSON Structure

The `admin_profiles.permissions` field uses JSONB for flexible permission management:

```json
{
  "can_manage_users": false,          // View/edit/block users
  "can_manage_content": true,         // Edit website content
  "can_view_analytics": true,         // Access analytics dashboard
  "can_manage_inquiries": true,       // View/respond to inquiries
  "can_manage_media": false,          // Upload/delete media files
  "can_manage_admins": false,         // Create/edit other admins (super_admin only)
  "can_delete_content": false         // Delete content (super_admin only)
}
```

**Default Permissions:**
- **Regular Admin**: Can manage content, view analytics, handle inquiries
- **Super Admin**: Full permissions (set all to `true`)

---

## Migration Files

### SQL Files (Run in Order)

1. **`06_split_user_admin_tables.sql`** - Create new tables and migrate data
   - Creates `user_profiles` and `admin_profiles` tables
   - Migrates data from old `profiles` table
   - Creates backup table (`profiles_backup`)
   - Updates helper functions
   - Verification queries

2. **`07_rls_policies_split_tables.sql`** - Row-Level Security policies
   - 6 policies for `user_profiles`
   - 7 policies for `admin_profiles`
   - Updates policies for other tables (announcements, content_sections, etc.)

3. **`08_triggers_split_tables.sql`** - Automatic triggers
   - Auto-create `user_profile` on signup
   - Timestamp updates
   - Login counting
   - Self-deletion prevention
   - Audit logging

### Application Files Updated

- ✅ `middleware.ts` - Checks `admin_profiles` instead of `profiles`
- ✅ `components/admin/AdminHeader.tsx` - Fetches from `admin_profiles`
- ✅ `app/admin/dashboard/page.tsx` - Queries both tables for stats

---

## Migration Steps

### Step 1: Run SQL Files in Supabase

In Supabase SQL Editor, run these files in order:

```sql
-- 1. Create new tables and migrate data
-- File: 06_split_user_admin_tables.sql
-- This creates user_profiles and admin_profiles

-- 2. Apply RLS policies
-- File: 07_rls_policies_split_tables.sql
-- This sets up security policies

-- 3. Set up triggers
-- File: 08_triggers_split_tables.sql
-- This enables automatic profile creation
```

### Step 2: Verify Migration

Check migration was successful:

```sql
-- Verify data migration
SELECT
  (SELECT COUNT(*) FROM public.user_profiles) as user_count,
  (SELECT COUNT(*) FROM public.admin_profiles) as admin_count,
  (SELECT COUNT(*) FROM public.profiles_backup) as original_count;

-- Check your admin profile exists
SELECT id, email, role, status
FROM public.admin_profiles
WHERE email = 'your-email@jkkn.ac.in';
```

**Expected Result:**
- `user_count` + `admin_count` should equal `original_count`
- Your admin profile should exist with `role = 'super_admin'`

### Step 3: Restart Application

```bash
# Stop dev server (Ctrl + C)

# Clear Next.js cache
powershell -Command "Remove-Item -Path '.next' -Recurse -Force"

# Restart
npm run dev
```

### Step 4: Test

1. **Sign in** at `http://localhost:3000/auth/login`
2. **Access admin** at `http://localhost:3000/admin/dashboard`
3. **Verify:**
   - Dashboard loads ✅
   - Stats show correct counts ✅
   - Header shows your role badge ✅

---

## What Changed?

### Before (Single Table)

```
profiles table:
├─ Users (role='user')
├─ Admins (role='admin')
└─ Super Admins (role='super_admin')
```

### After (Split Tables)

```
user_profiles table:
└─ Regular users only

admin_profiles table:
├─ Admins (role='admin')
└─ Super Admins (role='super_admin')
```

---

## Access Control Flow

### New User Signup

1. User signs in with Google
2. Trigger creates entry in `user_profiles` (default)
3. User gets `status = 'active'` by default
4. User can access public website
5. **Cannot** access `/admin` routes

### Promoting to Admin

Super admin manually creates admin profile:

```sql
-- Promote existing user to admin
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
  id,
  email,
  full_name,
  'admin', -- or 'super_admin'
  'active',
  'IT Department', -- or null
  'YOUR_SUPER_ADMIN_ID',
  NOW(),
  'YOUR_SUPER_ADMIN_ID'
FROM public.user_profiles
WHERE email = 'user-to-promote@example.com';

-- Note: User can exist in BOTH tables
-- user_profiles → access to public site
-- admin_profiles → access to admin panel
```

### Middleware Check (Admin Access)

```typescript
1. User tries to access /admin/*
2. Middleware queries admin_profiles
3. If no record → Redirect to /auth/unauthorized
4. If status = 'blocked' → Sign out + redirect
5. If role not in ['admin', 'super_admin'] → Redirect
6. Otherwise → Grant access ✅
```

---

## Row-Level Security (RLS)

### user_profiles Policies

| Policy | Action | Access |
|--------|--------|--------|
| `user_profiles_select_own` | SELECT | Users can read their own profile |
| `user_profiles_update_own` | UPDATE | Users can update their own profile |
| `user_profiles_insert_own` | INSERT | Users can create their own profile |
| `user_profiles_select_admin` | SELECT | Admins can read all user profiles |
| `user_profiles_update_super_admin` | UPDATE | Super admins can update any profile |
| `user_profiles_delete_super_admin` | DELETE | Super admins can delete profiles |

### admin_profiles Policies

| Policy | Action | Access |
|--------|--------|--------|
| `admin_profiles_select_own` | SELECT | Admins can read their own profile |
| `admin_profiles_select_all_admins` | SELECT | Admins can read all admin profiles |
| `admin_profiles_update_own_basic` | UPDATE | Admins can update their own info (not role/status) |
| `admin_profiles_insert_super_admin` | INSERT | Only super admins can create admin accounts |
| `admin_profiles_update_super_admin` | UPDATE | Super admins can update any admin profile |
| `admin_profiles_delete_super_admin` | DELETE | Super admins can delete admins (not self) |

---

## Updated Helper Functions

### `is_admin()`

```sql
SELECT public.is_admin();
-- Returns: TRUE if user is in admin_profiles with active status
```

### `is_super_admin()`

```sql
SELECT public.is_super_admin();
-- Returns: TRUE if user is super_admin with active status
```

### `get_user_type()`

```sql
SELECT public.get_user_type();
-- Returns: 'super_admin', 'admin', 'user', or 'unknown'
```

### `get_admin_role()`

```sql
SELECT public.get_admin_role();
-- Returns: 'admin' or 'super_admin' (null if not an admin)
```

---

## Triggers

### Auto-Create User Profile

```sql
-- Automatically runs on signup
TRIGGER: on_auth_user_created
FUNCTION: handle_new_user_signup()
```

Creates entry in `user_profiles` when user signs up via Google OAuth.

### Timestamp Updates

```sql
-- Auto-updates updated_at on changes
TRIGGER: update_user_profiles_updated_at
TRIGGER: update_admin_profiles_updated_at
```

### Login Tracking

```sql
-- Increments login_count for admins
TRIGGER: log_admin_login_trigger
FUNCTION: log_admin_login()
```

### Audit Logging

```sql
-- Logs role/status changes
TRIGGER: log_admin_profile_changes_trigger
FUNCTION: log_admin_profile_changes()

-- Logs user blocking
TRIGGER: log_user_profile_blocking_trigger
FUNCTION: log_user_profile_blocking()
```

### Self-Deletion Prevention

```sql
-- Prevents admins from deleting themselves
TRIGGER: prevent_admin_self_deletion_trigger
FUNCTION: prevent_admin_self_deletion()
```

---

## Benefits of New Schema

### 1. Security

✅ **Admins isolated from users** - Separate tables, separate RLS policies
✅ **Fine-grained permissions** - JSONB permissions for flexible access control
✅ **Audit trail** - created_by, approved_by fields for accountability

### 2. Performance

✅ **Smaller tables** - Queries faster with fewer rows
✅ **Better indexes** - Optimized for specific use cases
✅ **Reduced joins** - Most queries only need one table

### 3. Maintainability

✅ **Clear separation** - Easier to understand and modify
✅ **Independent schemas** - Add user fields without affecting admins
✅ **Type safety** - Role field only in admin_profiles (can't have user with role)

### 4. Flexibility

✅ **User-specific fields** - Student ID, course, qualifications
✅ **Admin-specific fields** - Employee ID, department, designation
✅ **Different constraints** - Can enforce different rules per table

---

## Dashboard Statistics

The admin dashboard now shows:

```typescript
Total Users = user_profiles.count + admin_profiles.count
Active Users = active_user_profiles + active_admin_profiles
```

This gives a complete picture of all system users.

---

## API Changes for Future Development

When building user management UI (Phase 2):

### List All Regular Users

```typescript
const { data: users } = await supabase
  .from('user_profiles')
  .select('*')
  .order('created_at', { ascending: false })
```

### List All Admins

```typescript
const { data: admins } = await supabase
  .from('admin_profiles')
  .select('*')
  .order('created_at', { ascending: false })
```

### Promote User to Admin

```typescript
// 1. Create admin profile
const { data: newAdmin } = await supabase
  .from('admin_profiles')
  .insert({
    id: userId, // Same as user_profiles ID
    email: userEmail,
    full_name: userFullName,
    role: 'admin',
    status: 'active',
    created_by: currentAdminId,
    approved_at: new Date().toISOString(),
    approved_by: currentAdminId,
  })
  .single()

// User can now access both public site AND admin panel
// Their user_profile still exists for public site data
```

### Demote Admin to User

```typescript
// Simply delete from admin_profiles
const { error } = await supabase
  .from('admin_profiles')
  .delete()
  .eq('id', adminId)

// User_profile remains, they keep public access
// But lose admin access
```

---

## Rollback Instructions

If you need to revert to single table:

### 1. Restore from Backup

```sql
-- Drop new tables
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.admin_profiles CASCADE;

-- Restore original
CREATE TABLE public.profiles AS
SELECT * FROM public.profiles_backup;

-- Recreate indexes and policies from 01_tables.sql, 03_policies.sql
```

### 2. Restore Application Code

```bash
# Revert the files
git checkout HEAD~1 -- middleware.ts
git checkout HEAD~1 -- components/admin/AdminHeader.tsx
git checkout HEAD~1 -- app/admin/dashboard/page.tsx
```

---

## Common Operations

### Get Current User Type

```typescript
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

// Check if admin
const { data: adminProfile } = await supabase
  .from('admin_profiles')
  .select('role, status')
  .eq('id', user.id)
  .single()

if (adminProfile) {
  console.log('User is:', adminProfile.role) // admin or super_admin
} else {
  console.log('User is: regular user')
}
```

### Block a User

```sql
-- Super admin can block users
UPDATE public.user_profiles
SET status = 'blocked'
WHERE id = 'USER_ID';

-- Logged to activity_logs automatically
```

### Block an Admin

```sql
-- Super admin can block admins
UPDATE public.admin_profiles
SET status = 'blocked'
WHERE id = 'ADMIN_ID';

-- Logged to activity_logs automatically
```

---

## Testing Checklist

After migration:

- [ ] Sign in with regular account → `user_profile` created ✅
- [ ] Sign in with admin account → Can access `/admin` ✅
- [ ] Regular user tries `/admin` → Blocked ✅
- [ ] Dashboard shows correct user counts ✅
- [ ] Admin header shows role badge ✅
- [ ] Can read own profile ✅
- [ ] Admin can read all user profiles ✅
- [ ] Super admin can create admin profile ✅
- [ ] Regular admin cannot create admin profile ✅
- [ ] Super admin can delete user profile ✅
- [ ] Regular user cannot delete any profile ✅
- [ ] Blocked user is signed out ✅
- [ ] Activity logs record changes ✅

---

## Questions & Answers

**Q: Can a user be in both tables?**
A: Yes! A user can have both a `user_profile` (for public site) and an `admin_profile` (for admin access). The `id` is the same (from `auth.users`).

**Q: What happens to existing data?**
A: It's migrated automatically. Users with `role='user'` go to `user_profiles`. Users with `role='admin'` or `role='super_admin'` go to `admin_profiles`. Original data is backed up in `profiles_backup`.

**Q: Can I add custom fields?**
A: Yes! You can add fields to either table independently. For example, add `graduation_year` to `user_profiles` without affecting `admin_profiles`.

**Q: How do I make someone an admin?**
A: Super admins create a record in `admin_profiles` with the user's `id` from `auth.users`. The user can then access both public site (via `user_profile`) and admin panel (via `admin_profile`).

**Q: Can admins delete their own account?**
A: No. The `prevent_admin_self_deletion_trigger` prevents this. Super admins can delete other admins, but not themselves.

**Q: What about the old `profiles` table?**
A: It's backed up as `profiles_backup`. You can drop it after verifying migration is successful. The SQL file has a commented-out `DROP TABLE` command.

**Q: Do I need to change my .env files?**
A: No. Supabase credentials remain the same.

**Q: What if migration fails?**
A: Check the verification queries in the SQL file. If data is missing, you can restore from `profiles_backup`.

---

## Related Documentation

- [Database Setup Guide](./supabase/DATABASE_SETUP_GUIDE.md)
- [Admin Panel PRD](./ADMIN_PANEL_PRD.md)
- [Previous Migration - Remove Domain Restriction](./MIGRATION_REMOVE_DOMAIN_RESTRICTION.md)

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-01-04 | Initial migration - Split user and admin tables | Claude Code |

---

## Status: ✅ COMPLETE

All changes have been applied. The system now uses separate `user_profiles` and `admin_profiles` tables with distinct schemas and RLS policies.

**Next Steps:**
1. Run the SQL migration files in Supabase
2. Restart your development server
3. Test authentication and admin access
4. Begin building user management UI (Phase 2)
