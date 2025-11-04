# 🎨 Demo Mode Guide - Preview Admin Panel

**Purpose:** View and test the admin panel design without setting up authentication or database.

---

## Quick Start (3 Steps)

### Step 1: Enable Demo Mode

Add this line to your `.env.local` file (create it if it doesn't exist):

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

**Complete .env.local file should look like:**

```bash
# Supabase Configuration (can be empty for demo)
NEXT_PUBLIC_SUPABASE_URL=https://htpanlaslzowmnemyobc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 🎨 DEMO MODE - Enable to preview admin panel
NEXT_PUBLIC_DEMO_MODE=true
```

### Step 2: Restart Dev Server

```bash
# Stop the server if running (Ctrl + C)

# Start dev server
npm run dev
```

### Step 3: Access Admin Panel

Open your browser and go directly to:

```
http://localhost:3000/admin/dashboard
```

**No login required!** You'll see the admin panel immediately.

---

## What Demo Mode Does

When `NEXT_PUBLIC_DEMO_MODE=true`:

✅ **Bypasses all authentication** - No need to sign in
✅ **Bypasses authorization** - No need for admin role
✅ **Skips database checks** - No Supabase setup needed
✅ **Direct access** - Go straight to `/admin/dashboard`

**What you'll see:**
- Admin layout with sidebar and header
- Dashboard with statistics cards (will show 0 since no database)
- Navigation menu with all admin sections
- Header with placeholder user info
- Full UI/UX design and layout

**What won't work:**
- Statistics will show 0 (no database connection)
- User profile data won't load (no auth user)
- Clicking other menu items will show placeholder pages
- Any database-dependent features

---

## Available Admin Routes to Preview

With demo mode enabled, you can visit:

| Route | What You'll See |
|-------|-----------------|
| `/admin/dashboard` | Main dashboard with stats cards, welcome message |
| `/admin/users` | User management (not yet implemented) |
| `/admin/content` | Content management (not yet implemented) |
| `/admin/inquiries` | Inquiry management (not yet implemented) |
| `/admin/analytics` | Analytics dashboard (not yet implemented) |
| `/admin/media` | Media library (not yet implemented) |
| `/admin/settings` | Settings page (not yet implemented) |

---

## What You're Previewing

### 1. Admin Layout Structure

**Sidebar (Left):**
- JKKN logo
- Navigation menu with icons
- Collapsible functionality
- "View Website" link at bottom

**Header (Top):**
- Page title and breadcrumb
- Notifications bell icon
- User profile dropdown (shows placeholder)
- Role badge (won't show in demo mode)

**Main Content Area:**
- Full-width content area
- Scrollable content
- Responsive grid layout

### 2. Dashboard Components

**Statistics Cards (4 cards):**
- Total Users - Blue
- Active Users - Green
- Pending Inquiries - Yellow
- Page Views - Purple

Each card shows:
- Icon
- Number (will be 0 in demo)
- Percentage change indicator
- Trend arrow

**Recent Activity Section:**
- Recent Users panel
- Recent Activity panel
- Both show placeholder text

**Welcome Card:**
- Gradient green background
- Welcome message
- Links to setup guide and documentation

### 3. Design System

**Colors:**
- Primary Green: #187041
- Background: Gray-50
- Cards: White with shadow
- Borders: Gray-200

**Typography:**
- Headers: Bold, large
- Body: Regular weight
- Stats: Extra large bold numbers

**Spacing:**
- Consistent padding and margins
- 24px gaps between sections
- 6px card padding

---

## Disable Demo Mode (Important!)

### Before Production or Real Testing

**ALWAYS disable demo mode before:**
- Deploying to production
- Testing authentication
- Testing with real database
- Sharing with others

### How to Disable

**Option 1: Change to false**
```bash
# In .env.local
NEXT_PUBLIC_DEMO_MODE=false
```

**Option 2: Remove the line entirely**
```bash
# Just delete the NEXT_PUBLIC_DEMO_MODE line
# Or comment it out with #
# NEXT_PUBLIC_DEMO_MODE=true
```

**Then restart server:**
```bash
# Ctrl + C to stop
npm run dev
```

Now authentication will be enforced again.

---

## Troubleshooting

### Issue: "Can't access /admin/dashboard"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify line says `NEXT_PUBLIC_DEMO_MODE=true` (not false)
3. Restart dev server completely
4. Hard refresh browser (Ctrl + Shift + R)

### Issue: "Page shows errors or blank"

**Cause:** Database queries failing (expected in demo mode)

**Solution:** This is normal. Some features need database. You're just previewing the layout and design.

### Issue: "User profile shows blank"

**Cause:** No authenticated user in demo mode

**Solution:** This is expected. The header will show placeholder values when there's no real user.

### Issue: "Sidebar navigation doesn't work"

**Cause:** Other admin pages not yet implemented

**Solution:** Only dashboard is fully built. Other routes will show "Page not found" or placeholder content.

---

## Next Steps After Preview

### Liked the design? Here's what to do next:

**1. Disable Demo Mode**
```bash
NEXT_PUBLIC_DEMO_MODE=false
```

**2. Set Up Database**
Run the SQL migration files:
- `06_split_user_admin_tables.sql`
- `07_rls_policies_split_tables.sql`
- `08_triggers_split_tables.sql`

**3. Create Admin Profile**
```sql
INSERT INTO public.admin_profiles (id, email, role, status)
SELECT id, email, 'super_admin', 'active'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

**4. Sign In and Test**
- Go to `/auth/login`
- Sign in with Google
- Access `/admin/dashboard` with real authentication
- Statistics will now show real data!

---

## Security Warning

⚠️ **NEVER USE DEMO MODE IN PRODUCTION**

**Why?**
- Anyone can access admin panel
- No authentication or authorization
- Security is completely disabled
- All routes are publicly accessible

**Safe Usage:**
- ✅ Local development only
- ✅ Design preview only
- ✅ Quick UI testing
- ✅ Screenshots/demos

**Unsafe Usage:**
- ❌ Production deployment
- ❌ Staging servers accessible by others
- ❌ Sharing your dev server URL
- ❌ Leaving enabled after testing

---

## Demo Mode Implementation Details

### Code Location

**File:** `middleware.ts` (lines 5-13)

```typescript
export async function middleware(request: NextRequest) {
  // 🎨 DEMO MODE: Bypass all authentication checks
  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (DEMO_MODE) {
    console.log('🎨 [DEMO MODE] Authentication bypassed')
    return NextResponse.next()
  }

  // Normal authentication flow continues...
}
```

### How It Works

1. Middleware runs on every request
2. Checks if `NEXT_PUBLIC_DEMO_MODE=true`
3. If true, immediately allows access (returns `NextResponse.next()`)
4. If false, proceeds with normal authentication checks

### Console Logging

When demo mode is active, you'll see this in terminal:

```
🎨 [DEMO MODE] Authentication bypassed - allowing all access
```

This confirms demo mode is working.

---

## FAQ

**Q: Will this work without Supabase credentials?**
A: Yes! Demo mode bypasses all Supabase checks. You don't need valid credentials.

**Q: Can I preview other pages besides dashboard?**
A: Yes, but most aren't built yet. You'll see "Page not found" or placeholders.

**Q: Will statistics show real data?**
A: No. Without database connection, all stats show 0. This is just for UI preview.

**Q: Can I test the login page in demo mode?**
A: You can visit it, but you don't need to. Just go directly to `/admin/dashboard`.

**Q: Is this safe for production?**
A: **NO! NEVER!** This completely disables security. Development/preview only.

**Q: How do I know if demo mode is active?**
A: Check terminal for "🎨 [DEMO MODE]" message when accessing admin routes.

**Q: Can others see my local server in demo mode?**
A: Only if you share your localhost URL. Keep it private.

**Q: Does this affect the public website?**
A: No. Demo mode only affects authentication. Public pages work normally.

---

## Design Feedback Checklist

While in demo mode, check these aspects:

### Layout
- [ ] Sidebar width feels comfortable
- [ ] Sidebar icons are clear and recognizable
- [ ] Header height is appropriate
- [ ] Main content area has good spacing
- [ ] Layout is responsive on different screen sizes

### Colors
- [ ] Primary green (#187041) looks good
- [ ] Card backgrounds have good contrast
- [ ] Text is readable on all backgrounds
- [ ] Stat card colors (blue, green, yellow, purple) work well

### Typography
- [ ] Font sizes are comfortable to read
- [ ] Headings have good hierarchy
- [ ] Numbers in stat cards are prominent
- [ ] Button text is clear

### Components
- [ ] Stat cards are visually appealing
- [ ] Icons match their purpose
- [ ] Buttons have clear hover states
- [ ] Cards have appropriate shadows

### Navigation
- [ ] Menu items are easy to find
- [ ] Active state is obvious
- [ ] Collapse/expand works smoothly
- [ ] "View Website" link is noticeable

### Overall
- [ ] Design feels professional
- [ ] Layout is intuitive
- [ ] Loading states are smooth
- [ ] Animations aren't too much

---

## Summary

### To Enable Demo Mode:

1. Add `NEXT_PUBLIC_DEMO_MODE=true` to `.env.local`
2. Restart server: `npm run dev`
3. Visit: `http://localhost:3000/admin/dashboard`

### To Disable Demo Mode:

1. Change to `NEXT_PUBLIC_DEMO_MODE=false`
2. Restart server: `npm run dev`
3. Authentication is enforced again

### Remember:
- ✅ Demo mode = Quick UI preview
- ✅ Great for design review
- ⚠️ No real data shown
- ❌ Never use in production!

---

**Enjoy previewing the admin panel design!** 🎨

When you're ready to set up authentication and database, disable demo mode and follow the migration guides.
