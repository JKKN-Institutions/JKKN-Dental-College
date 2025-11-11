# 🧪 Testing Admin Access Control

## ⚠️ IMPORTANT: Clear Cache First!

Before testing, you MUST clear your browser cache and restart the dev server:

### Step 1: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 2: Clear Browser Cache
**Option A: Hard Refresh**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Option B: Clear All Cache**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Option C: Incognito/Private Window**
- Use a new incognito/private browser window

---

## 🔒 Three Layers of Protection

Your admin dashboard now has **THREE layers** of security:

### Layer 1: Middleware (Server-Side)
- **File:** `middleware.ts` (lines 97-109)
- **When:** Before page loads on server
- **What:** Blocks unauthorized users, redirects to `/auth/unauthorized`

### Layer 2: Admin Layout (Client-Side)
- **File:** `app/admin/layout.tsx` (lines 26-91)
- **When:** When admin layout mounts
- **What:** Shows loading, checks auth, redirects if unauthorized

### Layer 3: Dashboard Page (Client-Side)
- **File:** `app/admin/dashboard/page.tsx` (lines 17-47)
- **When:** When dashboard page loads
- **What:** Double-checks auth, shows loader until verified

---

## ✅ Test Case 1: Super Admin Access

**User:** `boobalan.a@jkkn.ac.in` OR `sangeetha_v@jkkn.ac.in`

### Steps:
1. **Clear cache** (see above)
2. Go to `/auth/login`
3. Click "Continue with Google"
4. Login with super admin email
5. Navigate to `/admin/dashboard` or click "Admin" link

### Expected Result: ✅
```
✅ Brief "Verifying your access..." loading screen
✅ Admin sidebar appears on left
✅ Admin header with user info
✅ Dashboard with stats: Total Users, Active Users, etc.
✅ No redirects or errors
```

### Console Logs (Check DevTools):
```
[MIDDLEWARE] Checking admin access for user: boobalan.a@jkkn.ac.in
[MIDDLEWARE] Profile data: {role_type: 'super_admin', status: 'active'}
[MIDDLEWARE] ✅ Super admin access GRANTED
[ADMIN LAYOUT] Checking access for user: boobalan.a@jkkn.ac.in
[ADMIN LAYOUT] ✅ Super admin access verified
[DASHBOARD] ✅ Access granted to: boobalan.a@jkkn.ac.in
```

---

## 🚫 Test Case 2: Regular User Blocked

**User:** `mahasri_v@jkkn.ac.in` OR any other regular user

### Steps:
1. **Clear cache** (see above)
2. **Sign out** any current user
3. Go to `/auth/login`
4. Click "Continue with Google"
5. Login with regular user email
6. Try to navigate to `/admin/dashboard`

### Expected Result: ❌
```
❌ Should be IMMEDIATELY redirected to /auth/unauthorized
❌ Should NOT see admin sidebar
❌ Should NOT see admin header
❌ Should NOT see dashboard content
✅ Should see "Access Denied" page
```

### Console Logs (Check DevTools):
```
[MIDDLEWARE] Checking admin access for user: mahasri_v@jkkn.ac.in
[MIDDLEWARE] Profile data: {role_type: 'user', status: 'active'}
[MIDDLEWARE] ❌ Access BLOCKED for: mahasri_v@jkkn.ac.in
[MIDDLEWARE] Role type: user (Only super_admin allowed)
```

**If you still see the dashboard:**
1. Check that you cleared the cache properly
2. Try using an incognito/private window
3. Check the terminal/console for middleware logs

---

## 🔍 Debugging Steps

### If regular user can still access dashboard:

**1. Check if middleware is running:**
```bash
# Look at your terminal where npm run dev is running
# You should see [MIDDLEWARE] logs when accessing /admin
```

**2. Check browser console:**
```javascript
// Open DevTools (F12)
// Go to Console tab
// Look for [MIDDLEWARE], [ADMIN LAYOUT], [DASHBOARD] logs
```

**3. Verify user role in database:**
```bash
npx tsx scripts/test-strict-admin-access.ts
```

This will show:
```
✅ ALLOWED: boobalan.a@jkkn.ac.in (super_admin)
✅ ALLOWED: sangeetha_v@jkkn.ac.in (super_admin)
🚫 BLOCKED: mahasri_v@jkkn.ac.in (user)
🚫 BLOCKED: director@jkkn.ac.in (user)
... etc
```

**4. Hard restart Next.js:**
```bash
# Stop server (Ctrl+C)
# Delete .next folder
del /f /s /q .next 2>nul
# Restart
npm run dev
```

---

## 🎯 Success Criteria

### ✅ Test PASSES if:
- Super admins can access `/admin/dashboard` without issues
- Regular users are IMMEDIATELY redirected to `/auth/unauthorized`
- Regular users NEVER see admin sidebar, header, or content
- Console logs show proper blocking messages

### ❌ Test FAILS if:
- Regular user sees admin dashboard (even briefly)
- Regular user sees admin sidebar or navigation
- No middleware logs appear in console
- Redirects don't happen

---

## 📞 If Tests Still Fail

1. **Verify middleware.ts was saved:**
   - Check line 98: `if (profile.role_type === 'super_admin' && profile.status === 'active')`
   - Check line 104-109: Should redirect unauthorized users

2. **Verify app/admin/layout.tsx was saved:**
   - Check line 68: `if (profile.role_type === 'super_admin' && profile.status === 'active')`
   - Check line 83: `router.replace('/auth/unauthorized')`

3. **Restart everything:**
   ```bash
   # Kill all Node processes
   taskkill /F /IM node.exe

   # Delete Next.js cache
   del /f /s /q .next 2>nul

   # Restart dev server
   npm run dev
   ```

4. **Check user data:**
   ```bash
   # Verify user roles in database
   npx tsx scripts/verify-access-control.ts
   ```

---

**Last Updated:** 2025-11-11
**Status:** Three-layer protection active
