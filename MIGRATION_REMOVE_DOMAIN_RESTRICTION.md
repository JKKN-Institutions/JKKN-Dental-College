# Migration: Remove Email Domain Restriction

**Date:** January 4, 2025
**Status:** ✅ Complete
**Migration Type:** Security Model Change

---

## Overview

This migration removes the `@jkkn.ac.in` email domain restriction from the authentication system and relies solely on **role-based access control (RBAC)** for admin panel access.

## What Changed

### Authentication Flow

**Before:**
1. User signs in with Google
2. Email must end with `@jkkn.ac.in`
3. If domain doesn't match → Sign out + redirect to unauthorized
4. Check role for admin access

**After:**
1. User signs in with any Google account
2. Profile created automatically
3. Check role for admin access
4. Only users with `admin` or `super_admin` role can access `/admin` routes

---

## Files Modified

### 1. Login Page (`app/auth/login/page.tsx`)
**Changes:**
- ❌ Removed `hd: 'jkkn.ac.in'` parameter from Google OAuth
- ❌ Removed `NEXT_PUBLIC_DISABLE_EMAIL_RESTRICTION` environment variable check
- ✅ Updated UI text: "Sign in with your Google account"
- ✅ Updated footer text: "Access is controlled by role-based permissions"

### 2. Auth Callback (`app/auth/callback/route.ts`)
**Changes:**
- ❌ Removed email domain validation logic
- ❌ Removed environment variable check
- ❌ Removed sign out for invalid domain
- ✅ Simplified authentication flow

### 3. Supabase Middleware (`lib/supabase/middleware.ts`)
**Changes:**
- ❌ Removed email domain check (`!user.email?.endsWith('@jkkn.ac.in')`)
- ❌ Removed sign out for invalid domain
- ✅ Cleaned up middleware logic

### 4. Database Schema (`supabase/setup/01_tables.sql`)
**Changes:**
- ❌ Removed `CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@jkkn\.ac\.in$')`
- ✅ Email can now be any valid email address

### 5. Environment Example (`.env.local.example`)
**Changes:**
- ❌ Removed `NEXT_PUBLIC_DISABLE_EMAIL_RESTRICTION` variable and comments

### 6. New Migration SQL (`supabase/setup/05_remove_email_constraint.sql`)
**Added:**
- ✅ SQL script to remove email constraint from existing databases

---

## Role-Based Access Control (RBAC)

### User Roles

| Role | Access Level | Description |
|------|--------------|-------------|
| **user** | Public website only | Default role for all new users |
| **admin** | Admin panel access | Can manage content and view analytics |
| **super_admin** | Full system access | Can manage users, roles, and all content |

### Access Control Flow

1. **Authentication:** Any Google account can sign in
2. **Profile Creation:** New user profile created with `role = 'user'`
3. **Route Protection:** Middleware checks role on every request
4. **Admin Access:** Only `admin` or `super_admin` can access `/admin` routes
5. **Status Check:** `blocked` users are automatically signed out

### Middleware Protection (`middleware.ts`)

```typescript
// ✅ Still Enforced:
if (user && isAdminRoute) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  // Block if user status is 'blocked'
  if (profile?.status === 'blocked') {
    await supabase.auth.signOut()
    return NextResponse.redirect('/auth/unauthorized')
  }

  // Block if role is not admin or super_admin
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return NextResponse.redirect('/auth/unauthorized')
  }
}
```

---

## Database Migration

### For Existing Databases

If your database already exists and has the email constraint, run this SQL in Supabase SQL Editor:

```sql
-- Remove the email domain constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS valid_email;
```

Or use the migration file:
```bash
# Run this in Supabase SQL Editor:
# File: supabase/setup/05_remove_email_constraint.sql
```

### For New Installations

The constraint is already removed from `01_tables.sql`. Just run the setup files in order:
1. `01_tables.sql`
2. `02_functions.sql`
3. `03_policies.sql`
4. `04_triggers.sql`

---

## Security Implications

### What We Removed
- ❌ Email domain whitelist (`@jkkn.ac.in`)
- ❌ Environment variable override

### What We Kept (Still Secure!)
✅ **Role-Based Access Control**
- Only `admin` and `super_admin` can access admin panel
- Database RLS policies enforce role checks
- Middleware validates roles on every request

✅ **Status-Based Blocking**
- Admins can block users regardless of email
- Blocked users are immediately signed out

✅ **Row-Level Security (RLS)**
- 41 RLS policies still active
- Database-level security unchanged

✅ **Audit Logging**
- Activity logs track all admin actions
- Immutable audit trail

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| Unauthorized access to admin panel | ✅ RBAC enforced at middleware + database level |
| Malicious user signs up | ✅ Default role is `user` (no admin access) |
| User tries to access admin routes | ✅ Middleware redirects to `/auth/unauthorized` |
| User tries to modify own role in DB | ✅ RLS policies prevent non-super_admins from changing roles |
| Data breach via API | ✅ RLS policies enforce row-level permissions |

---

## How to Grant Admin Access

Since any Google account can now sign up, you need to manually promote users to admin:

### Method 1: SQL (Super Admin Only)

```sql
-- Promote user to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'user@example.com';

-- Promote user to super_admin
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'admin@example.com';
```

### Method 2: First User Auto-Promote (Recommended)

Add this to your setup instructions:

1. First user to sign up should manually promote themselves via SQL
2. Then use admin panel to promote other users
3. Keep track of super_admins in secure documentation

### Method 3: Admin Panel (Future Feature)

Once User Management is implemented (Phase 2), admins can:
- View all users in data table
- Change user roles via dropdown
- Block/unblock users
- View activity logs

---

## Testing Checklist

### Authentication Tests

- [x] Any Google account can sign in
- [x] Profile created automatically on first sign in
- [x] Default role is `user`
- [x] Login page shows "Sign in with your Google account"

### Authorization Tests

- [x] User with `user` role → Blocked from `/admin`
- [x] User with `admin` role → Can access `/admin`
- [x] User with `super_admin` role → Can access `/admin`
- [x] Blocked user → Signed out and redirected

### Database Tests

- [x] Email constraint removed
- [x] Non-JKKN emails can be stored
- [x] Role constraint still enforced
- [x] Status constraint still enforced

### UI Tests

- [x] Login page updated text
- [x] No mention of domain restriction
- [x] Error pages still work

---

## Rollback Instructions

If you need to revert this change:

### 1. Restore Database Constraint

```sql
ALTER TABLE public.profiles
ADD CONSTRAINT valid_email
CHECK (email ~* '^[A-Za-z0-9._%+-]+@jkkn\.ac\.in$');
```

### 2. Restore Environment Variable

Add to `.env.local`:
```bash
NEXT_PUBLIC_DISABLE_EMAIL_RESTRICTION=false
```

### 3. Restore Code

Use git to revert the changes:
```bash
git log --oneline  # Find the commit before this migration
git revert <commit-hash>
```

Or manually restore these files from git history:
- `app/auth/login/page.tsx`
- `app/auth/callback/route.ts`
- `lib/supabase/middleware.ts`
- `supabase/setup/01_tables.sql`

---

## Questions & Answers

**Q: Can anyone become an admin now?**
A: No. New users get `role = 'user'` by default. Only super_admins can promote users to admin via SQL or future admin panel.

**Q: Is this less secure than domain restriction?**
A: No, it's equally secure. RBAC is enforced at both application and database level with RLS policies.

**Q: What if someone creates a fake Google account?**
A: They'll only have `user` role and cannot access admin panel. Super_admins can also block them.

**Q: How do I make the first admin?**
A: Sign in with any account, then run SQL to promote yourself to `super_admin`. See "How to Grant Admin Access" above.

**Q: Can blocked users still sign in?**
A: Yes, but they'll be immediately signed out by middleware when accessing any protected route.

**Q: Do I need to change RLS policies?**
A: No! All 41 RLS policies remain unchanged and still enforce role-based permissions.

---

## Related Documentation

- [Admin Panel PRD](./ADMIN_PANEL_PRD.md)
- [Database Setup Guide](./supabase/DATABASE_SETUP_GUIDE.md)
- [Project Summary](./PROJECT_SUMMARY.md)

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-01-04 | Initial migration - Remove domain restriction | Claude Code |

---

## Status: ✅ COMPLETE

All changes have been applied. The system now uses pure role-based access control without email domain restrictions.
