# 🚀 Vercel Deployment Guide - Admin Panel

## ✅ Your Admin Files ARE Already on GitHub!

Your admin panel is already pushed to GitHub at:
```
https://github.com/JKKN-Institutions/JKKN-Dental-College
```

**Admin files included:**
- ✅ `app/admin/dashboard/page.tsx`
- ✅ `app/admin/layout.tsx`
- ✅ `components/admin/AdminHeader.tsx`
- ✅ `components/admin/AdminSidebar.tsx`
- ✅ All authentication files
- ✅ All SQL migration files

---

## 🌐 Deploy to Vercel (Step-by-Step)

### Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Find your repository: **JKKN-Institutions/JKKN-Dental-College**
3. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected) ✅

**Root Directory:** `./` (default)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

### Step 4: Add Environment Variables

**CRITICAL:** Add these environment variables:

Click **"Environment Variables"** and add:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://htpanlaslzowmnemyobc.supabase.co` | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Copy after deployment |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | **MUST be false!** |

**Where to find Supabase keys:**
1. Go to: https://app.supabase.com
2. Select your project: **htpanlaslzowmnemyobc**
3. Go to **Settings** → **API**
4. Copy **anon/public** key
5. Copy **service_role** key (⚠️ Keep secret!)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll see: "🎉 Congratulations! Your project has been deployed."

---

## 🔗 Your Admin Panel URLs

### After Deployment, You'll Get:

**Vercel gives you a URL like:**
```
https://jkkn-dental-college.vercel.app
```

**Your admin panel will be at:**
```
https://jkkn-dental-college.vercel.app/admin/dashboard
```

**Login page:**
```
https://jkkn-dental-college.vercel.app/auth/login
```

### With Custom Domain (Optional)

After adding your domain:
```
https://jkkndental.edu.in/admin/dashboard
```

Or subdomain:
```
https://admin.jkkndental.edu.in/dashboard
```

---

## 🔐 Configure Authentication for Production

### Step 1: Update Supabase

Go to: Supabase Dashboard → Authentication → URL Configuration

**Site URL:** Update to your Vercel URL
```
https://jkkn-dental-college.vercel.app
```

**Redirect URLs:** Add these
```
https://jkkn-dental-college.vercel.app/auth/callback
https://jkkn-dental-college.vercel.app/admin/dashboard
https://jkkn-dental-college.vercel.app/
```

### Step 2: Update Google OAuth

Go to: Google Cloud Console → Credentials → Your OAuth Client

**Authorized redirect URIs:** Add
```
https://htpanlaslzowmnemyobc.supabase.co/auth/v1/callback
https://jkkn-dental-college.vercel.app/auth/callback
```

**Authorized JavaScript origins:** Add
```
https://jkkn-dental-college.vercel.app
```

### Step 3: Update NEXT_PUBLIC_SITE_URL

In Vercel Dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_SITE_URL`
4. Change to: `https://your-project.vercel.app`
5. **Redeploy** (Vercel → Deployments → Click ⋯ → Redeploy)

---

## 📍 How to Find Your Admin Panel Link

### Method 1: Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click your project: **jkkn-dental-college**
3. Click **"Visit"** button
4. Copy the URL (e.g., `https://jkkn-dental-college.vercel.app`)
5. Add `/admin/dashboard` to the end
6. **Your admin URL:** `https://jkkn-dental-college.vercel.app/admin/dashboard`

### Method 2: Deployment Details

1. Vercel Dashboard → Your Project
2. Click latest deployment
3. See **"Preview"** URL
4. Copy it
5. Add `/admin/dashboard`

### Method 3: Custom Domain (After Setup)

1. Vercel → Project → Settings → Domains
2. Add your domain: `jkkndental.edu.in`
3. Configure DNS (Vercel will show instructions)
4. Wait for DNS propagation (5-30 minutes)
5. **Your admin URL:** `https://jkkndental.edu.in/admin/dashboard`

---

## 🎯 Quick Access Links

After deployment, you'll have:

| Page | URL |
|------|-----|
| Homepage | `https://your-project.vercel.app` |
| Login | `https://your-project.vercel.app/auth/login` |
| **Admin Dashboard** | `https://your-project.vercel.app/admin/dashboard` |
| Unauthorized | `https://your-project.vercel.app/auth/unauthorized` |

---

## ✅ Test Your Deployment

### 1. Test Homepage

Visit: `https://your-project.vercel.app`

**Should see:**
- ✅ Homepage loads
- ✅ Navigation works
- ✅ No errors

### 2. Test Admin Login

Visit: `https://your-project.vercel.app/auth/login`

**Should see:**
- ✅ Login page with Google button
- ✅ Click "Sign in with Google"
- ✅ Redirects to Google OAuth
- ✅ After sign in → redirects back

### 3. Test Admin Dashboard

Visit: `https://your-project.vercel.app/admin/dashboard`

**If you're admin:**
- ✅ Dashboard loads
- ✅ See statistics cards
- ✅ Sidebar visible
- ✅ Header shows your profile

**If you're not admin:**
- ✅ Redirects to unauthorized page
- ✅ This is correct!

---

## 🔄 Update Deployment

### When You Make Changes

1. **Commit changes locally:**
   ```bash
   git add .
   git commit -m "Update admin panel"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Vercel auto-deploys!**
   - Vercel automatically detects push
   - Rebuilds and redeploys
   - Takes 2-3 minutes
   - Check: Vercel Dashboard → Deployments

### Manual Redeploy

If needed, redeploy manually:

1. Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Find latest deployment
4. Click **⋯** (three dots)
5. Click **"Redeploy"**

---

## 🚨 Troubleshooting

### Issue: Admin panel shows 404

**Problem:** Build might have failed

**Solution:**
1. Vercel Dashboard → Your Project → Deployments
2. Click latest deployment
3. Check **"Build Logs"** for errors
4. Common fix: Ensure all dependencies in `package.json`

### Issue: Can't sign in with Google

**Problem:** Redirect URI not configured

**Solution:**
1. Google Cloud Console → Credentials
2. Add: `https://your-vercel-url.vercel.app/auth/callback`
3. Add: `https://htpanlaslzowmnemyobc.supabase.co/auth/v1/callback`

### Issue: "Access Denied" for admin

**Problem:** Admin profile not created

**Solution:**
Run this SQL in Supabase:
```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, status)
SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin', 'active'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

### Issue: Environment variables not working

**Problem:** Not redeployed after adding variables

**Solution:**
1. Add/update environment variables
2. Vercel Dashboard → Deployments
3. **Redeploy** latest deployment

### Issue: Database connection fails

**Problem:** Wrong Supabase credentials

**Solution:**
1. Verify credentials in `.env.local`
2. Copy exact same values to Vercel
3. Check no extra spaces or quotes
4. Redeploy

---

## 📊 Vercel Dashboard Overview

### Project Settings

**General:**
- Project name
- Git repository
- Framework (Next.js)

**Domains:**
- Add custom domain
- Configure DNS
- SSL certificate (automatic)

**Environment Variables:**
- Production variables
- Preview variables
- Development variables

**Deployments:**
- History of all deployments
- Build logs
- Preview URLs

### Useful Features

**1. Preview Deployments**
- Every GitHub push creates preview
- Test before merging to main

**2. Analytics**
- Page views
- Performance metrics
- Available with Pro plan

**3. Logs**
- Runtime logs
- Function logs
- Error tracking

---

## 🔒 Security Checklist for Production

Before going live:

- [ ] `NEXT_PUBLIC_DEMO_MODE=false` in Vercel
- [ ] All environment variables set correctly
- [ ] Google OAuth redirect URIs updated
- [ ] Supabase Site URL updated
- [ ] Admin profiles created for all admins
- [ ] Test login flow works
- [ ] Test admin access works
- [ ] SSL/HTTPS working (Vercel auto)
- [ ] Database RLS policies enabled
- [ ] Service role key kept secret

---

## 💡 Pro Tips

### 1. Use Environment Variable Groups

Vercel allows you to set variables for:
- **Production** - Live site
- **Preview** - PR previews
- **Development** - Local dev

Set different values for each!

### 2. Enable Automatic Deployments

Vercel auto-deploys when you push to GitHub:
- Push to `main` → Production deployment
- Push to other branches → Preview deployment

### 3. Custom Domain Setup

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Vercel → Domains → Add Domain
3. Follow DNS instructions
4. Wait 5-30 minutes
5. SSL certificate auto-generated

### 4. Monitor Build Times

- Check **Build Logs** if deployment fails
- Optimize build by removing unused packages
- Use `next.config.js` optimizations

---

## 📱 Share Your Admin Panel

After deployment, share these with your team:

**Admin Login:**
```
https://your-project.vercel.app/auth/login
```

**Instructions for admins:**
```
1. Go to login URL above
2. Sign in with @jkkn.ac.in email
3. You'll be redirected to admin dashboard
4. You'll see your role badge in header
```

**Create their admin profiles:**
```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, status)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin', 'active'
FROM auth.users
WHERE email = 'staff@jkkn.ac.in';
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] ✅ Homepage loads at Vercel URL
- [ ] ✅ Can access `/auth/login`
- [ ] ✅ Can sign in with Google
- [ ] ✅ Admin profile exists in database
- [ ] ✅ Can access `/admin/dashboard`
- [ ] ✅ Dashboard shows correct data
- [ ] ✅ Statistics cards display
- [ ] ✅ Profile shows in header
- [ ] ✅ Role badge visible
- [ ] ✅ All environment variables set
- [ ] ✅ Supabase configured for production URL

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Custom Domains:** https://vercel.com/docs/concepts/projects/domains

---

## 🆘 Need Help?

If deployment fails:

1. Check **Build Logs** in Vercel
2. Verify environment variables are correct
3. Test build locally: `npm run build`
4. Check Vercel status: https://www.vercel-status.com
5. Contact Vercel support (free tier has community support)

---

## Quick Reference

```bash
# Local
http://localhost:3000/admin/dashboard

# Vercel (after deployment)
https://your-project.vercel.app/admin/dashboard

# Custom domain (after setup)
https://jkkndental.edu.in/admin/dashboard
```

---

**Your admin panel is ready to deploy!** 🚀

**Next steps:**
1. Deploy to Vercel (5 minutes)
2. Configure environment variables
3. Update Supabase URLs
4. Test admin access
5. Share admin URL with team
