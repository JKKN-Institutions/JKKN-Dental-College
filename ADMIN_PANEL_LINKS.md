# 🔗 Admin Panel Access Links

## 📍 Admin Panel URLs

### Local Development
```
http://localhost:3000/admin/dashboard
```

### Production (After Deployment)
```
https://your-domain.com/admin/dashboard
```

---

## 🎯 Admin Routes Available

| Route | Purpose | Access Level |
|-------|---------|--------------|
| `/admin/dashboard` | Main admin dashboard | Admin & Super Admin |
| `/admin/users` | User management | Admin & Super Admin |
| `/admin/content` | Content management | Admin & Super Admin |
| `/admin/inquiries` | Contact inquiries | Admin & Super Admin |
| `/admin/analytics` | Analytics dashboard | Admin & Super Admin |
| `/admin/media` | Media library | Admin & Super Admin |
| `/admin/settings` | System settings | Admin & Super Admin |

**Note:** Currently only `/admin/dashboard` is fully implemented. Others will show "Page not found" until built.

---

## 🔐 Who Can Access

### Super Admin
- ✅ Full access to all admin routes
- ✅ Can manage other admins
- ✅ Can delete content
- ✅ View all analytics

### Admin
- ✅ Access to most admin routes
- ✅ Can manage content
- ✅ Can view analytics
- ✅ Can manage inquiries
- ❌ Cannot manage other admins

### Regular User
- ❌ Cannot access any `/admin` routes
- Will see "Access Denied" page

---

## 🚀 How to Access Admin Panel

### Step 1: Make Sure You're an Admin

Check in Supabase SQL Editor:

```sql
-- Check if you have admin access
SELECT email, role, status
FROM public.admin_profiles
WHERE email = 'your-email@jkkn.ac.in';
```

**Should return:**
- `role`: `admin` or `super_admin`
- `status`: `active`

**If not found, create admin profile:**

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, status, department)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  'super_admin',
  'active',
  'Administration'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

### Step 2: Sign In

1. Go to: `http://localhost:3000/auth/login`
2. Click **"Sign in with Google"**
3. Select your @jkkn.ac.in account
4. You'll be redirected to homepage

### Step 3: Access Admin Panel

1. Go to: `http://localhost:3000/admin/dashboard`
2. You should see:
   - ✅ Dashboard with statistics
   - ✅ Sidebar navigation
   - ✅ Header with your profile
   - ✅ "Super Admin" or "Admin" badge

---

## 🌐 After Deployment

### Vercel Deployment

When you deploy to Vercel, your admin URL will be:

```
https://your-project-name.vercel.app/admin/dashboard
```

**Or with custom domain:**

```
https://jkkndental.edu.in/admin/dashboard
https://admin.jkkndental.edu.in/dashboard
```

### Set Environment Variables

In Vercel Dashboard, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://htpanlaslzowmnemyobc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_DEMO_MODE=false
```

### Update Supabase

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-domain.com
```

**Redirect URLs:** Add your production URL
```
https://your-domain.com/auth/callback
https://your-domain.com/admin/dashboard
```

---

## 📱 Direct Access Links

### Development (Copy & Paste)

**Homepage:**
```
http://localhost:3000
```

**Login Page:**
```
http://localhost:3000/auth/login
```

**Admin Dashboard:**
```
http://localhost:3000/admin/dashboard
```

**Unauthorized Page (if not admin):**
```
http://localhost:3000/auth/unauthorized
```

---

## 🎨 Demo Mode Access

If you want to preview admin panel without authentication:

**Enable demo mode in `.env.local`:**
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

Then access directly:
```
http://localhost:3000/admin/dashboard
```

**Remember to disable before production:**
```bash
NEXT_PUBLIC_DEMO_MODE=false
```

---

## 🔄 Quick Access Workflow

### For Admins (Daily Use)

```
1. Open browser
2. Go to: http://localhost:3000/admin/dashboard
3. If not signed in → Redirected to /auth/login
4. Sign in with Google (@jkkn.ac.in)
5. Redirected back to admin dashboard ✅
```

### For Testing

```
1. Open incognito window
2. Go to: http://localhost:3000/admin/dashboard
3. Try to access as regular user
4. Should see "Access Denied" ✅
```

---

## 📊 What You'll See

### Dashboard Components

**Statistics Cards (4):**
- Total Users (Blue)
- Active Users (Green)
- Pending Inquiries (Yellow)
- Page Views (Purple)

**Layout:**
- Left Sidebar with navigation
- Top Header with profile
- Main content area with cards
- Recent activity sections

**Navigation Menu:**
- Dashboard
- User Management
- Content (with submenu)
- Inquiries
- Analytics
- Media Library
- Settings

---

## 🔗 Shareable Admin Links

### For Your Team

Send these to other admins after creating their admin profiles:

**Admin Login:**
```
http://localhost:3000/auth/login
```

**Admin Dashboard:**
```
http://localhost:3000/admin/dashboard
```

**Instructions:**
```
1. Go to admin login
2. Sign in with your @jkkn.ac.in email
3. Access the dashboard
4. You should see your role badge (Admin or Super Admin)
```

---

## 🚨 Troubleshooting Access

### Issue: Can't access admin dashboard

**Check 1: Are you signed in?**
- Go to homepage
- Check if you see your profile or sign-in button

**Check 2: Do you have admin role?**
```sql
SELECT email, role FROM admin_profiles WHERE email = 'your-email@jkkn.ac.in';
```

**Check 3: Is your status active?**
```sql
SELECT email, status FROM admin_profiles WHERE email = 'your-email@jkkn.ac.in';
```

**Check 4: Clear cache and retry**
```bash
powershell -Command "Remove-Item -Path '.next' -Recurse -Force"
npm run dev
```

### Issue: Shows "Access Denied"

This means you don't have admin_profile. Run this SQL:

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, status)
SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin', 'active'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

---

## 🎯 Quick Reference

| Need | URL |
|------|-----|
| Admin Dashboard | `http://localhost:3000/admin/dashboard` |
| Sign In | `http://localhost:3000/auth/login` |
| Homepage | `http://localhost:3000` |
| Sign Out | Click profile in header → "Sign Out" |

---

## 📞 Support

If you can't access the admin panel:

1. Check if you're signed in
2. Verify your admin profile exists in database
3. Clear browser cache
4. Restart dev server
5. Check console for errors (F12)

---

**Your admin panel is ready!** 🎉

**Local Admin URL:**
```
http://localhost:3000/admin/dashboard
```

**After deployment, it will be:**
```
https://your-domain.com/admin/dashboard
```
