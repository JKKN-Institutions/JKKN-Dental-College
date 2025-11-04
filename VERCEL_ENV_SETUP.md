# 🚨 URGENT: Fix Missing Environment Variables in Vercel

## The Error You're Seeing

```
@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

**This means:** Environment variables are NOT set in Vercel!

---

## ⚡ Fix It Now (3 Minutes)

### Step 1: Go to Vercel Environment Variables

1. Open: https://vercel.com/dashboard
2. Click your project name
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Add These 5 Variables

Click **"Add New"** for each variable:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://htpanlaslzowmnemyobc.supabase.co`
- **Environments:** Check all three (Production, Preview, Development)
- Click **Save**

#### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGFubGFzbHpvd21uZW15b2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjAyNzEsImV4cCI6MjA3NzczNjI3MX0.SZdGvhRbc3lmLSFLGcnysnzfd3gYEKx7YtdeSIR8h30`
- **Environments:** Check all three
- Click **Save**

#### Variable 3:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGFubGFzbHpvd21uZW15b2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE2MDI3MSwiZXhwIjoyMDc3NzM2MjcxfQ.og1wHhiNWU4l4_ay_oJWIIOZIg1rNKOh3SeYJ-_yDq4`
- **Environments:** Check all three
- Click **Save**

#### Variable 4:
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://jkkn-dental-college.vercel.app` (or your actual Vercel URL)
- **Environments:** Check all three
- Click **Save**

#### Variable 5:
- **Name:** `NEXT_PUBLIC_DEMO_MODE`
- **Value:** `false`
- **Environments:** Check all three
- Click **Save**

### Step 3: Redeploy

**CRITICAL:** After adding environment variables, you MUST redeploy!

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) button
4. Click **"Redeploy"**
5. Wait 2-3 minutes for deployment to complete

---

## ✅ Verify It's Fixed

After redeployment, visit your site:
- `https://jkkn-dental-college.vercel.app`

**Should now work without the Supabase error!**

---

## 📸 Screenshot Guide

If you're unsure where to add variables, here's the exact path:

```
Vercel Dashboard
  └── Your Project
       └── Settings (top tab)
            └── Environment Variables (left sidebar)
                 └── Add New (button)
```

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Wrong Variable Names
```
WRONG: NEXT_PUBLIC_SUPABASE_API_KEY
RIGHT: NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### ❌ Mistake 2: Adding Extra Spaces
```
WRONG: " https://htpanlaslzowmnemyobc.supabase.co "
RIGHT: "https://htpanlaslzowmnemyobc.supabase.co"
```

### ❌ Mistake 3: Forgetting to Redeploy
**You MUST redeploy after adding variables!**

### ❌ Mistake 4: Not Checking All Environments
Make sure you check all three:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] All 5 variables are added
- [ ] Variable names are EXACTLY as shown (case-sensitive!)
- [ ] No extra spaces or quotes in values
- [ ] All three environments are checked
- [ ] You clicked "Save" for each variable
- [ ] Ready to redeploy

---

## 🆘 Still Not Working?

### Check 1: Verify Variables Are Set

Go to: **Vercel** → **Settings** → **Environment Variables**

You should see 5 variables listed:
1. ✅ NEXT_PUBLIC_SUPABASE_URL
2. ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
3. ✅ SUPABASE_SERVICE_ROLE_KEY
4. ✅ NEXT_PUBLIC_SITE_URL
5. ✅ NEXT_PUBLIC_DEMO_MODE

### Check 2: Verify Deployment Used New Variables

1. Go to **Deployments** tab
2. Check timestamp of latest deployment
3. It should be AFTER you added the variables
4. If not, click **Redeploy** again

### Check 3: Check Browser Console

1. Open your deployed site
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. If you still see the Supabase error, variables didn't apply
5. Try redeploying again

---

## 💡 Pro Tip: Copy from .env.local

You already have these values in your local `.env.local` file!

Just copy the values from there to Vercel.

---

## 🚀 After It's Fixed

Once your site is working:

1. **Test homepage:** Should load
2. **Test login:** `/auth/login` should work
3. **Test admin:** `/admin/dashboard` should redirect to login (if not logged in)

---

## 📞 Need the Service Role Key?

If you don't have the `SUPABASE_SERVICE_ROLE_KEY`:

1. Go to: https://app.supabase.com
2. Select your project: **htpanlaslzowmnemyobc**
3. Go to **Settings** → **API**
4. Copy the **service_role** key (⚠️ Keep this secret!)

---

**Your site will work immediately after redeployment!** 🎉

The 500 error and Supabase client error will both be resolved.
