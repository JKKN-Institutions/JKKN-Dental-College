# Admin Access Control - Security Documentation

## 🔒 Overview

This document describes the **strict admin access control** implemented for the JKKN Dental College admin dashboard.

**Security Rule:** ONLY users with `role_type = "super_admin"` can access `/admin/*` routes.

---

## ✅ Allowed Users (Super Admins)

| Email | Role Type | Status | Access Level |
|-------|-----------|--------|--------------|
| `boobalan.a@jkkn.ac.in` | `super_admin` | `active` | ✅ Full Admin Access |
| `sangeetha_v@jkkn.ac.in` | `super_admin` | `active` | ✅ Full Admin Access |

---

## 🚫 Blocked Users (Regular Users)

| Email | Role Type | Status | Access Level |
|-------|-----------|--------|--------------|
| `mahasri_v@jkkn.ac.in` | `user` | `active` | ❌ No Admin Access |
| `director@jkkn.ac.in` | `user` | `active` | ❌ No Admin Access |
| `ramesh.s@jkkn.ac.in` | `user` | `active` | ❌ No Admin Access |
| `account@jkkn.ac.in` | `user` | `active` | ❌ No Admin Access |
| `aiengineering@jkkn.ac.in` | `user` | `active` | ❌ No Admin Access |

---

## 🛡️ Two-Layer Security Implementation

### Layer 1: Server-Side Middleware
**File:** `middleware.ts` (Lines 66-109)

**What it does:**
- Runs on the **server** before any page loads
- Checks user authentication
- Verifies email domain is `@jkkn.ac.in`
- Checks if `role_type === 'super_admin'` AND `status === 'active'`
- Redirects unauthorized users to `/auth/unauthorized`

**Code:**
```typescript
// ONLY super_admin role type is allowed to access admin area
if (profile.role_type === 'super_admin' && profile.status === 'active') {
  console.log('[MIDDLEWARE] ✅ Super admin access GRANTED')
  return response
}

// ALL other users are blocked
console.log('[MIDDLEWARE] ❌ Access BLOCKED')
const redirectUrl = new URL('/auth/unauthorized', request.url)
return NextResponse.redirect(redirectUrl)
```

---

### Layer 2: Client-Side Admin Layout
**File:** `app/admin/layout.tsx` (Lines 26-91)

**What it does:**
- Runs on the **client** when the component mounts
- Shows "Verifying your access..." loading screen
- Checks user profile from database
- If `role_type !== 'super_admin'` → Immediately redirects to `/auth/unauthorized`
- If `role_type === 'super_admin'` → Allows admin content to render

**Code:**
```typescript
// Check if user is super admin - ONLY super_admin role_type allowed
if (profile.role_type === 'super_admin' && profile.status === 'active') {
  console.log('[ADMIN LAYOUT] ✅ Super admin access verified')
  setIsAuthorized(true)
  return
}

// For ANY other role type - DENY ACCESS
console.log('[ADMIN LAYOUT] ❌ Access DENIED')
router.replace('/auth/unauthorized')
```

---

## 🎯 User Experience Flow

### Super Admin (✅ Authorized)
```
1. User logs in with Google
   → boobalan.a@jkkn.ac.in

2. User clicks "Admin" link
   → Navigates to /admin/dashboard

3. [MIDDLEWARE] Checks authentication
   → ✅ role_type = 'super_admin'
   → ✅ status = 'active'
   → ✅ PASS - Page loads

4. [ADMIN LAYOUT] Shows "Verifying access..."
   → Checks profile from database
   → ✅ role_type = 'super_admin'
   → ✅ PASS - Renders admin dashboard

5. ✅ User sees admin dashboard with full access
```

### Regular User (❌ Blocked)
```
1. User logs in with Google
   → mahasri_v@jkkn.ac.in

2. User clicks "Admin" link
   → Tries to navigate to /admin/dashboard

3. [MIDDLEWARE] Checks authentication
   → ❌ role_type = 'user' (not super_admin)
   → ❌ BLOCKED - Redirects to /auth/unauthorized

4. User sees "Access Denied" page
   → Message: "You don't have permission to access the admin panel"
   → Options: Return to Homepage | Try Different Account
```

---

## 📋 Access Requirements

To access the admin dashboard, a user MUST meet ALL of these criteria:

1. ✅ User must be **authenticated** (logged in)
2. ✅ User email must end with **@jkkn.ac.in**
3. ✅ User must have **`role_type = 'super_admin'`** in the database
4. ✅ User must have **`status = 'active'`** in the database

If ANY of these criteria are not met, the user will be redirected to `/auth/unauthorized`.

---

## 🧪 Testing Instructions

### Test 1: Regular User (Should be BLOCKED)
1. Login with: `mahasri_v@jkkn.ac.in`
2. Navigate to: `/admin/dashboard` or click "Admin" link
3. **Expected Result:**
   - ❌ Should NOT see admin sidebar
   - ❌ Should NOT see admin content
   - ❌ Should be redirected to `/auth/unauthorized`
   - ✅ Should see "Access Denied" page

### Test 2: Super Admin (Should be ALLOWED)
1. Login with: `boobalan.a@jkkn.ac.in` or `sangeetha_v@jkkn.ac.in`
2. Navigate to: `/admin/dashboard`
3. **Expected Result:**
   - ✅ Should see "Verifying access..." briefly
   - ✅ Should see admin sidebar and navigation
   - ✅ Should see admin dashboard content
   - ✅ Full access to all admin features

---

## 🔐 Database Schema

The `profiles` table has the following relevant columns:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role_type TEXT DEFAULT 'user' CHECK (role_type IN ('super_admin', 'custom_role', 'user')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  ...
);
```

---

## 🚨 Security Notes

1. **No Custom Roles:** Currently, the system does NOT check for custom role permissions. ONLY `super_admin` role type is allowed.

2. **Email Domain Restriction:** Only emails ending with `@jkkn.ac.in` can authenticate.

3. **Double Protection:** Both middleware (server) and layout (client) check permissions, preventing any bypass.

4. **Immediate Redirect:** Unauthorized users are redirected immediately with `router.replace()` to prevent back navigation.

5. **Console Logging:** All access attempts are logged to the console for debugging:
   - `[MIDDLEWARE]` prefix for server-side checks
   - `[ADMIN LAYOUT]` prefix for client-side checks

---

## 📞 Support

If you need to:
- Grant admin access to a new user → Update their `role_type` to `super_admin` in the database
- Revoke admin access → Change their `role_type` to `user` or set `status` to `blocked`
- Check access logs → Review console logs for `[MIDDLEWARE]` and `[ADMIN LAYOUT]` messages

---

**Last Updated:** 2025-11-11
**Security Level:** HIGH (Two-layer protection)
**Status:** ✅ Active and Enforced
