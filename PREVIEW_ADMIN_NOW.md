# 🚀 Preview Admin Panel NOW (No Setup Required!)

Want to see the admin panel design immediately? Follow these 3 quick steps:

---

## Step 1: Create/Edit `.env.local`

In your project root, create or edit the `.env.local` file and add this line:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

**Full file example:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://htpanlaslzowmnemyobc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGFubGFzbHpvd21uZW15b2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjAyNzEsImV4cCI6MjA3NzczNjI3MX0.SZdGvhRbc3lmLSFLGcnysnzfd3gYEKx7YtdeSIR8h30
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGFubGFzbHpvd21uZW15b2JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE2MDI3MSwiZXhwIjoyMDc3NzM2MjcxfQ.og1wHhiNWU4l4_ay_oJWIIOZIg1rNKOh3SeYJ-_yDq4
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 🎨 Enable Demo Mode for instant preview
NEXT_PUBLIC_DEMO_MODE=true
```

---

## Step 2: Start/Restart Server

```bash
# If server is running, stop it (Ctrl + C)

# Start dev server
npm run dev
```

**You'll see this message in terminal:**
```
🎨 [DEMO MODE] Authentication bypassed - allowing all access
```

---

## Step 3: Open Admin Panel

Go directly to:

```
http://localhost:3000/admin/dashboard
```

**That's it!** 🎉 No login, no setup, instant access!

---

## What You'll See

✅ **Admin Dashboard** with:
- Sidebar navigation (collapsible)
- Header with user menu
- 4 statistics cards
- Recent activity sections
- Welcome card with links

✅ **Full Layout:**
- Professional design
- JKKN brand colors
- Responsive grid
- Icons and animations

⚠️ **Note:** Stats will show "0" because there's no database connection. This is just for UI preview!

---

## When You're Done Previewing

### Disable Demo Mode

Change the line in `.env.local`:

```bash
NEXT_PUBLIC_DEMO_MODE=false
```

Then restart server:

```bash
npm run dev
```

---

## ⚠️ Important Warning

**NEVER deploy with demo mode enabled!**

Demo mode completely bypasses authentication and security. Use it only for:
- ✅ Local development preview
- ✅ Design review
- ✅ UI testing

Never use for:
- ❌ Production
- ❌ Public servers
- ❌ Real data testing

---

## Quick Reference

| Action | Command |
|--------|---------|
| Enable demo mode | Add `NEXT_PUBLIC_DEMO_MODE=true` to `.env.local` |
| Disable demo mode | Change to `NEXT_PUBLIC_DEMO_MODE=false` |
| Access admin | `http://localhost:3000/admin/dashboard` |
| Restart server | `npm run dev` |

---

**Need more details?** See: [DEMO_MODE_GUIDE.md](./DEMO_MODE_GUIDE.md)

**Ready to set up authentication?** See: [MIGRATION_SPLIT_USER_ADMIN_TABLES.md](./MIGRATION_SPLIT_USER_ADMIN_TABLES.md)

---

**Enjoy exploring the admin panel design!** 🎨
