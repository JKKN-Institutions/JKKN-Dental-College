# Authentication Testing Guide

## Your Current Setup

**Your Email:** @jkkn.ac.in domain (super_admin)
**System:** Role-based access control (any email domain allowed)

---

## Test Scenarios

### ✅ Test 1: Sign In as Super Admin (You)

1. Go to: `http://localhost:3000/auth/login`
2. Click "Sign in with Google"
3. Select your @jkkn.ac.in account
4. **Expected Result:**
   - Redirected to homepage or admin dashboard
   - Can navigate to `/admin/dashboard`
   - See your name/email in admin header
   - Role badge shows "Super Admin" (purple)

### ✅ Test 2: Access Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/dashboard`
2. **Expected Result:**
   - Dashboard loads successfully
   - See statistics cards (Total Users, Active Users, etc.)
   - Sidebar shows all menu items
   - Header shows your profile with super_admin badge

### ✅ Test 3: Verify Profile in Database

Check your profile exists with correct role:

```sql
-- Run this in Supabase SQL Editor
SELECT
  id,
  email,
  full_name,
  role,
  status,
  created_at,
  last_login_at
FROM public.profiles
WHERE email = 'your-email@jkkn.ac.in';
```

**Expected Result:**
```
role: super_admin
status: active
```

### ⚠️ Test 4: Try Signing In with Another Email (Optional)

If you have another Google account (gmail, outlook, etc.):

1. Sign out from current account
2. Go to: `http://localhost:3000/auth/login`
3. Sign in with different email (e.g., personal@gmail.com)
4. Try to access `/admin/dashboard`
5. **Expected Result:**
   - Sign in succeeds ✅
   - Profile created with `role = 'user'`
   - Accessing `/admin` → Redirected to `/auth/unauthorized` ❌
   - This is correct! Regular users can't access admin panel

---

## Common Issues & Solutions

### Issue 1: "Redirected to /auth/unauthorized"

**Cause:** Your role is not `admin` or `super_admin`

**Solution:**
```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'your-email@jkkn.ac.in';
```

### Issue 2: "Can't see admin dashboard"

**Cause 1:** Not signed in
- Go to `/auth/login` and sign in

**Cause 2:** Wrong role
- Check database: `SELECT role FROM profiles WHERE email = 'your-email@jkkn.ac.in'`
- Should be `admin` or `super_admin`

**Cause 3:** Status is blocked
```sql
UPDATE public.profiles
SET status = 'active'
WHERE email = 'your-email@jkkn.ac.in';
```

### Issue 3: "Profile not created after sign in"

**Cause:** Trigger not working

**Solution:** Check if trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If missing, run: `supabase/setup/04_triggers.sql`

### Issue 4: "Still see domain restriction message"

**Cause:** Old code cached in browser

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Restart dev server: `npm run dev`

---

## Verification Queries

### Check All Users and Roles
```sql
SELECT
  email,
  role,
  status,
  last_login_at,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
```

### Check Who Can Access Admin
```sql
SELECT
  email,
  role,
  status
FROM public.profiles
WHERE role IN ('admin', 'super_admin')
  AND status = 'active';
```

### Count Users by Role
```sql
SELECT
  role,
  COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY count DESC;
```

### Check Recent Activity
```sql
SELECT
  u.email,
  p.role,
  p.last_login_at,
  CASE
    WHEN p.last_login_at > NOW() - INTERVAL '7 days' THEN 'Active'
    ELSE 'Inactive'
  END as activity_status
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.last_login_at DESC NULLS LAST;
```

---

## Next Steps After Testing

Once you confirm everything works:

1. ✅ **Sign in successfully** - You can access admin panel
2. ✅ **Verify role-based access** - Only admins can access `/admin`
3. ✅ **Test with different emails** - Any Google account can sign up
4. 📝 **Document your admins** - Keep list of who has admin/super_admin
5. 🔐 **Secure your database** - Only you should have Supabase admin access
6. 🚀 **Continue development** - Build user management (Phase 2)

---

## Security Reminders

⚠️ **Important:**
- Keep your Supabase credentials secret
- Only promote trusted users to `admin` or `super_admin`
- Monitor the `activity_logs` table for suspicious activity
- Regularly review who has admin access
- Use strong passwords for your Google account

✅ **System is secure because:**
- Default role is `user` (no admin access)
- RLS policies prevent privilege escalation
- Middleware checks role on every request
- Blocked users are automatically signed out
- All admin actions logged in `activity_logs`

---

## Development vs Production

### Development (Current)
- Test with any email
- You are super_admin
- Can promote users via SQL

### Production (Future)
- Build user management UI
- Admins can promote/demote users
- Email notifications for role changes
- Activity dashboard for monitoring
- Automated backup of admin list

---

## Support

If you encounter issues:
1. Check the console logs in browser (F12 → Console)
2. Check Supabase logs in dashboard
3. Verify environment variables in `.env.local`
4. Ensure dev server is running: `npm run dev`
5. Check this testing guide for common issues

---

**Status:** Ready to test! 🚀
