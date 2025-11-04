# Troubleshooting Admin Access Issues

## Issue: Getting "Access Denied" when accessing `/admin/dashboard`

---

## Step 1: Verify You're Signed In

1. Open browser console (F12 → Console tab)
2. Go to `http://localhost:3000`
3. Check if you see any authentication errors
4. Try signing in again at `http://localhost:3000/auth/login`

---

## Step 2: Check Database Profile

Run this SQL in **Supabase SQL Editor**:

```sql
-- Check if your profile exists and has correct role
SELECT
  id,
  email,
  role,
  status,
  created_at,
  last_login_at
FROM public.profiles
WHERE email = 'your-email@jkkn.ac.in';  -- Replace with your actual email
```

### Expected Result:
```
role: super_admin (or admin)
status: active
```

### If Profile Doesn't Exist:

Sign in first, then the profile should be auto-created. If not, create manually:

```sql
-- Get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@jkkn.ac.in';

-- Create profile manually
INSERT INTO public.profiles (id, email, role, status)
VALUES (
  'paste-user-id-here',  -- From query above
  'your-email@jkkn.ac.in',
  'super_admin',
  'active'
);
```

### If Role is Wrong:

```sql
UPDATE public.profiles
SET role = 'super_admin', status = 'active'
WHERE email = 'your-email@jkkn.ac.in';
```

### If Status is Blocked:

```sql
UPDATE public.profiles
SET status = 'active'
WHERE email = 'your-email@jkkn.ac.in';
```

---

## Step 3: Verify Trigger Exists

Check if the auto-profile creation trigger is working:

```sql
-- Check if trigger exists
SELECT
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

### If Trigger Doesn't Exist:

Run the trigger setup file:
```
File: supabase/setup/04_triggers.sql
```

---

## Step 4: Clear Cache and Restart

Sometimes cached code or sessions cause issues:

```bash
# Stop the dev server (Ctrl + C)

# Clear Next.js cache
powershell -Command "Remove-Item -Path '.next' -Recurse -Force"

# Restart dev server
npm run dev
```

Then:
1. Hard refresh browser: `Ctrl + Shift + R`
2. Or clear cookies for localhost:3000
3. Sign in again

---

## Step 5: Check Environment Variables

Verify your `.env.local` file has correct Supabase credentials:

```bash
# .env.local should have:
NEXT_PUBLIC_SUPABASE_URL=https://htpanlaslzowmnemyobc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** No `NEXT_PUBLIC_DISABLE_EMAIL_RESTRICTION` should exist anymore!

---

## Step 6: Test Middleware

Add console logs to see what's happening:

**File:** `middleware.ts` (line 56-78)

Add this before the role check:

```typescript
// Check admin access for admin routes
if (user && isAdminRoute) {
  console.log('[MIDDLEWARE] Checking admin access for:', user.email) // ADD THIS

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  console.log('[MIDDLEWARE] Profile data:', profile) // ADD THIS

  // Check if user is blocked
  if (profile?.status === 'blocked') {
    console.log('[MIDDLEWARE] User is blocked') // ADD THIS
    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = '/auth/unauthorized'
    return NextResponse.redirect(url)
  }

  // Check if user has admin or super_admin role
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    console.log('[MIDDLEWARE] Insufficient role:', profile?.role) // ADD THIS
    const url = request.nextUrl.clone()
    url.pathname = '/auth/unauthorized'
    return NextResponse.redirect(url)
  }

  console.log('[MIDDLEWARE] Access granted!') // ADD THIS
}
```

Then check browser console and terminal for these log messages.

---

## Step 7: Verify RLS Policies

Make sure RLS policies allow you to read your own profile:

```sql
-- Test if you can read your profile
SELECT * FROM public.profiles WHERE id = auth.uid();
```

If this returns nothing, RLS policies might be blocking you. Run:

```
File: supabase/setup/03_policies.sql
```

---

## Step 8: Manual Sign In Test

Try this sequence:

1. **Sign out completely:**
   - Go to `http://localhost:3000`
   - Open browser DevTools → Application → Cookies
   - Delete all cookies for localhost:3000

2. **Sign in fresh:**
   - Go to `http://localhost:3000/auth/login`
   - Sign in with your @jkkn.ac.in account
   - Watch browser console for any errors

3. **Check profile was created:**
   ```sql
   SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
   ```

4. **Try accessing admin:**
   - Go to `http://localhost:3000/admin/dashboard`
   - If still blocked, check console logs

---

## Step 9: Verify Database Connection

Make sure Supabase is running and accessible:

```sql
-- Test basic query
SELECT NOW();
```

If this fails, your Supabase project might be paused or credentials are wrong.

---

## Step 10: Check for Multiple Users

You might be signed in with wrong account:

```sql
-- List all users
SELECT
  u.email,
  p.role,
  p.status
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```

Make sure you're signing in with the account that has `super_admin` role.

---

## Quick Diagnostic Checklist

Run these queries in order:

```sql
-- 1. Check if you're in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'your-email@jkkn.ac.in';

-- 2. Check if profile exists
SELECT id, email, role, status FROM public.profiles WHERE email = 'your-email@jkkn.ac.in';

-- 3. If profile exists but role is wrong
UPDATE public.profiles SET role = 'super_admin', status = 'active' WHERE email = 'your-email@jkkn.ac.in';

-- 4. Verify update worked
SELECT email, role, status FROM public.profiles WHERE email = 'your-email@jkkn.ac.in';
```

**Expected Final Result:**
```
email: your-email@jkkn.ac.in
role: super_admin
status: active
```

---

## Common Errors and Solutions

### Error: "No profile found in database"

**Solution:**
```sql
-- Create profile manually
INSERT INTO public.profiles (id, email, role, status)
SELECT id, email, 'super_admin', 'active'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

### Error: "RLS policy prevents access"

**Solution:**
Re-run RLS policies:
```
File: supabase/setup/03_policies.sql
```

### Error: "Status is blocked"

**Solution:**
```sql
UPDATE public.profiles SET status = 'active' WHERE email = 'your-email@jkkn.ac.in';
```

### Error: "Role is user, not admin"

**Solution:**
```sql
UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your-email@jkkn.ac.in';
```

### Error: "Session expired or invalid"

**Solution:**
1. Sign out completely
2. Clear browser cookies
3. Restart dev server
4. Sign in again

---

## Still Not Working?

If you've tried everything above and still can't access:

1. **Share these details:**
   - Your email (with domain)
   - Result of SQL query: `SELECT role, status FROM public.profiles WHERE email = 'your-email@jkkn.ac.in'`
   - Browser console errors (if any)
   - Terminal errors (if any)

2. **Nuclear option (fresh start):**
   ```bash
   # Delete .next folder
   powershell -Command "Remove-Item -Path '.next' -Recurse -Force"

   # Clear Supabase data (in Supabase Dashboard):
   # Table Editor → profiles → Delete all rows
   # Authentication → Users → Delete test users

   # Re-run setup:
   # 01_tables.sql
   # 02_functions.sql
   # 03_policies.sql
   # 04_triggers.sql

   # Restart dev server
   npm run dev

   # Sign in fresh
   # Manually set role to super_admin via SQL
   ```

---

## Success Indicators

You'll know it's working when:
- ✅ You can access `http://localhost:3000/admin/dashboard`
- ✅ Dashboard shows statistics
- ✅ Header shows your email and "Super Admin" badge (purple)
- ✅ Sidebar shows all menu items
- ✅ No redirect to `/auth/unauthorized`

---

## Next Step After Success

Once you can access the admin panel:

1. Take note of your super_admin email
2. Document it securely
3. Start building user management (Phase 2)
4. Test with another account (should be blocked from admin)
