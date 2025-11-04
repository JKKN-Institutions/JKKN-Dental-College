# 🚨 Fixing 500 Internal Server Error on Deployment

## What I Fixed

I've updated the middleware to handle errors gracefully and prevent the 500 error you were experiencing. Here's what was changed:

### Changes Made to `middleware.ts`:

1. **Added comprehensive error handling** - Wrapped entire middleware in try-catch
2. **Added environment variable validation** - Checks if Supabase credentials exist
3. **Added error logging** - Console logs help debug issues in production
4. **Added graceful fallbacks** - Allows requests to continue even if middleware fails
5. **Added database query error handling** - Catches errors when fetching admin profiles

---

## 🔧 How to Deploy the Fix

### Step 1: Commit and Push the Changes

```bash
git add .
git commit -m "Fix: Add error handling to middleware for deployment"
git push origin main
```

### Step 2: Verify Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Make sure these are set correctly:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://htpanlaslzowmnemyobc.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key (starts with `eyJ...`) | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | ✅ Yes |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | ✅ Yes |

**Important:** After adding/updating environment variables, you MUST **redeploy**!

### Step 3: Redeploy on Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** tab
3. Find the latest deployment
4. Click **⋯** (three dots)
5. Click **"Redeploy"**

---

## 🔍 Common Causes of 500 Error

### 1. Missing Environment Variables ❌

**Problem:** Environment variables not set in Vercel

**Solution:**
- Add all required variables in Vercel Dashboard
- Make sure there are no extra spaces or quotes
- Redeploy after adding variables

### 2. Database Connection Error ❌

**Problem:** Supabase credentials are incorrect or database is unreachable

**Solution:**
- Verify Supabase URL and keys are correct
- Check Supabase project is active (not paused)
- Test connection locally first: `npm run dev`

### 3. Database Table Missing ❌

**Problem:** `admin_profiles` table doesn't exist

**Solution:**
Run this SQL in Supabase SQL Editor:

```sql
-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for reading profiles
CREATE POLICY "Admin profiles are viewable by authenticated users"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for super admins to manage profiles
CREATE POLICY "Super admins can manage all profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND role = 'super_admin' AND status = 'active'
    )
  );
```

### 4. Middleware Infinite Loop ❌

**Problem:** Middleware redirects causing infinite loops

**Solution:** Already fixed in the updated middleware! The middleware now:
- Checks for public routes before redirecting
- Has proper error handling to prevent crashes
- Allows requests to continue even if there's an error

### 5. Supabase URL Configuration ❌

**Problem:** Redirect URLs not configured in Supabase

**Solution:**
1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Add these redirect URLs:
   ```
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/
   https://your-project.vercel.app/admin/dashboard
   ```

---

## 🧪 How to Test Locally First

Before deploying, test locally to catch issues:

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Start production server
npm start
```

If local build works, deployment should work too.

---

## 📊 How to Check Vercel Logs

To see what's causing the 500 error:

### Method 1: Vercel Dashboard

1. Go to **Vercel Dashboard**
2. Click your project
3. Click **Deployments**
4. Click latest deployment
5. Scroll to **Function Logs** or **Runtime Logs**
6. Look for red error messages

### Method 2: Real-time Logs

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# View logs
vercel logs your-project-url
```

---

## 🎯 Step-by-Step Fix Checklist

Follow these steps in order:

### ✅ Step 1: Verify Local Build
```bash
npm run build
```
- [ ] Build succeeds locally
- [ ] No ESLint errors
- [ ] No TypeScript errors

### ✅ Step 2: Check Environment Variables
- [ ] All 5 required variables are set in Vercel
- [ ] No typos in variable names
- [ ] No extra spaces or quotes in values
- [ ] Values match your `.env.local` file

### ✅ Step 3: Verify Supabase Setup
- [ ] Supabase project is active (not paused)
- [ ] `admin_profiles` table exists
- [ ] RLS policies are enabled
- [ ] Redirect URLs are configured

### ✅ Step 4: Deploy with Updated Code
- [ ] Commit middleware changes
- [ ] Push to GitHub
- [ ] Vercel auto-deploys
- [ ] Or manually redeploy in Vercel

### ✅ Step 5: Test Deployment
- [ ] Visit homepage: `https://your-project.vercel.app`
- [ ] Visit login: `https://your-project.vercel.app/auth/login`
- [ ] Try signing in with Google
- [ ] Check admin dashboard (if you have admin role)

---

## 🔧 Additional Fixes

### If Homepage Still Shows 500 Error

The homepage (`/`) should not require authentication. If it's still failing:

1. **Check if public routes are excluded:**
   - Open `middleware.ts`
   - Verify line 57: `const publicRoutes = ['/auth/login', '/auth/error', '/auth/unauthorized', '/auth/callback']`
   - The homepage `/` is NOT in this list because it should be accessible to everyone

2. **Add homepage to public routes if needed:**

```typescript
const publicRoutes = ['/', '/auth/login', '/auth/error', '/auth/unauthorized', '/auth/callback']
```

### If Static Assets Return 500 Error

Static files (images, CSS, JS) should bypass middleware:

1. Check `middleware.ts` line 134-145
2. Verify the matcher pattern excludes static files
3. Pattern should look like:
   ```typescript
   matcher: [
     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
   ]
   ```

### If Database Queries Are Slow

If middleware is slow (not 500 error, just slow):

1. **Add database indexes:**
```sql
CREATE INDEX idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX idx_admin_profiles_role ON public.admin_profiles(role);
```

2. **Enable caching** (optional, for high traffic):
   - Add Redis/Vercel KV for session caching
   - Cache admin profile lookups

---

## 📞 Still Getting 500 Error?

If you've tried everything above and still getting 500 error:

### 1. Enable Debug Mode Temporarily

Add this to your environment variables in Vercel:
```
NODE_ENV=development
```

**WARNING:** Remove this after debugging! Don't leave in production.

### 2. Check Vercel Function Logs

Look for specific error messages:
- "Missing Supabase environment variables" → Add env vars
- "Error fetching admin profile" → Check database table exists
- "Error getting user in middleware" → Check Supabase credentials

### 3. Simplify Middleware Temporarily

If you need to get the site working ASAP, you can temporarily disable authentication:

**Option A: Enable Demo Mode (Temporary!)**
In Vercel environment variables:
```
NEXT_PUBLIC_DEMO_MODE=true
```
This bypasses ALL authentication. Only for testing!

**Option B: Simplify Middleware**
Comment out the admin profile check temporarily to isolate the issue.

---

## 🚀 After the Fix

Once deployed successfully:

1. **Test all routes:**
   - ✅ Homepage loads
   - ✅ Login page works
   - ✅ Google OAuth works
   - ✅ Admin dashboard accessible (if admin)
   - ✅ Unauthorized page shows for non-admins

2. **Remove debug settings:**
   - Set `NEXT_PUBLIC_DEMO_MODE=false`
   - Remove `NODE_ENV=development` if added
   - Redeploy

3. **Monitor for issues:**
   - Check Vercel Analytics
   - Review Function Logs regularly
   - Set up alerts for errors (Vercel Pro)

---

## 📚 Additional Resources

- **Vercel Deployment Docs:** https://vercel.com/docs
- **Next.js Middleware Docs:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **Vercel Error Debugging:** https://vercel.com/docs/concepts/functions/serverless-functions/troubleshooting

---

## ✅ Summary

**What was fixed:**
- ✅ Added try-catch error handling to middleware
- ✅ Added environment variable validation
- ✅ Added detailed error logging
- ✅ Added graceful error fallbacks
- ✅ Added database query error handling

**What you need to do:**
1. Commit and push the changes
2. Verify environment variables in Vercel
3. Redeploy on Vercel
4. Test the deployment

**Expected result:**
- Homepage works
- Login works
- Admin dashboard works (for admins)
- No more 500 errors!

---

**Need more help?** Check the Vercel logs and look for the specific error message. The updated middleware now logs helpful error messages that will point you to the exact problem.
