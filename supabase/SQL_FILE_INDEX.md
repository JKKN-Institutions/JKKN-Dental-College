# SQL File Index - JKKN Admin Panel

## Overview
This directory contains all SQL setup files for the JKKN Admin Panel database schema. Files must be executed in order.

**Last Updated:** 2025-01-03
**Database:** Supabase PostgreSQL
**Project:** JKKN Institution Admin Panel

---

## Execution Order

### ⚠️ IMPORTANT: Run files in this exact order

```
1. 01_tables.sql        → Create all tables with indexes
2. 02_functions.sql     → Create database functions
3. 03_policies.sql      → Create RLS policies
4. 04_triggers.sql      → Create triggers
```

---

## File Details

### 01_tables.sql
**Purpose:** Create all database tables with proper structure
**Created:** 2025-01-03
**Dependencies:** None (run first)

**Tables Created:**
- `profiles` - User profiles with role-based access
- `announcements` - Site-wide announcements
- `content_sections` - Dynamic content (hero, about, etc.)
- `benefits` - "Why Choose JKKN" benefit cards
- `statistics` - Institution statistics
- `campus_videos` - Campus tour videos
- `contact_submissions` - Contact form inquiries
- `activity_logs` - Audit trail for admin actions
- `media_library` - Media file management

**Features:**
- All tables have proper constraints
- All tables have appropriate indexes
- All tables have RLS enabled
- All tables have proper comments
- Email validation for @jkkn.ac.in domain

---

### 02_functions.sql
**Purpose:** Create database functions for business logic
**Created:** 2025-01-03
**Dependencies:** Requires 01_tables.sql

**Functions Created:**
- `handle_new_user()` - Auto-create profile on user signup (TRIGGER)
- `update_last_login(user_id)` - Update login timestamp
- `log_activity(action, entity_type, entity_id, details)` - Audit logging
- `is_admin()` - Check if user is admin/super_admin
- `is_super_admin()` - Check if user is super_admin
- `get_user_role()` - Get current user's role
- `increment_video_views(video_id)` - Increment video view count

**Security:**
- All functions use SECURITY INVOKER (except handle_new_user)
- All functions set search_path = '' for security
- All functions properly granted to authenticated users

---

### 03_policies.sql
**Purpose:** Row-Level Security policies for all tables
**Created:** 2025-01-03
**Dependencies:** Requires 01_tables.sql, 02_functions.sql

**Policy Pattern:**
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE)
- All functions wrapped in SELECT: `(SELECT auth.uid())`
- All policies specify target role: `TO authenticated`
- Performance optimized with proper indexes

**Tables Secured:**
- `profiles` - Own profile + admin access
- `announcements` - Public read, admin write
- `content_sections` - Published read, admin write
- `benefits` - Active read, admin write
- `statistics` - Active read, admin write
- `campus_videos` - Active read, admin write
- `contact_submissions` - Own read, admin manage
- `activity_logs` - Own read, admin view all
- `media_library` - All read, admin write

---

### 04_triggers.sql
**Purpose:** Automatic triggers for data management
**Created:** 2025-01-03
**Dependencies:** Requires 01_tables.sql, 02_functions.sql

**Triggers Created:**
- `on_auth_user_created` - Auto-create profile on signup
- `on_profiles_updated` - Auto-update updated_at
- `on_announcements_updated` - Auto-update updated_at
- `on_content_sections_updated` - Auto-update updated_at + version
- `on_benefits_updated` - Auto-update updated_at
- `on_statistics_updated` - Auto-update updated_at
- `on_campus_videos_updated` - Auto-update updated_at
- `on_contact_submissions_updated` - Auto-update updated_at

---

## Quick Setup

### Method 1: Run All at Once (Recommended)
```sql
-- In Supabase SQL Editor, run in this order:

-- 1. Tables
\i supabase/setup/01_tables.sql

-- 2. Functions
\i supabase/setup/02_functions.sql

-- 3. Policies
\i supabase/setup/03_policies.sql

-- 4. Triggers
\i supabase/setup/04_triggers.sql
```

### Method 2: Copy-Paste
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `01_tables.sql` → Run
3. Copy contents of `02_functions.sql` → Run
4. Copy contents of `03_policies.sql` → Run
5. Copy contents of `04_triggers.sql` → Run

---

## Post-Setup Verification

### Check Tables
```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected: 9 tables

### Check RLS Status
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`

### Check Policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Expected: ~40+ policies

### Check Functions
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

Expected: 7+ functions

### Check Triggers
```sql
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

Expected: 9+ triggers

---

## Creating Your First Admin

After running all SQL files:

```sql
-- 1. Sign in to your app with @jkkn.ac.in email
-- 2. Then run this to promote yourself to super admin:

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'your-email@jkkn.ac.in';

-- 3. Verify:
SELECT email, role, status
FROM public.profiles
WHERE email = 'your-email@jkkn.ac.in';
```

---

## Change Log

### 2025-01-03 - Initial Creation
- Created complete database schema
- Added all tables with proper constraints
- Created database functions
- Implemented RLS policies
- Added automatic triggers
- Documented all SQL files

---

## Common Issues & Solutions

### Issue: "permission denied for schema public"
**Solution:**
```sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
```

### Issue: "function auth.uid() does not exist"
**Solution:** Wrap in SELECT: `(SELECT auth.uid())`

### Issue: "trigger not firing"
**Solution:** Check trigger exists:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### Issue: "RLS blocking queries"
**Solution:** Check policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## Maintenance

### Adding New Tables
1. Update `01_tables.sql` with dated comment
2. Add RLS policies to `03_policies.sql`
3. Add triggers if needed to `04_triggers.sql`
4. Update this index file

### Modifying Existing Tables
1. Add ALTER statements to appropriate file
2. Add dated comment explaining change
3. Update this index file
4. Consider creating migration file for production

---

## File Metadata

| File | Lines | Tables | Functions | Policies | Triggers |
|------|-------|--------|-----------|----------|----------|
| 01_tables.sql | ~450 | 9 | 0 | 0 | 0 |
| 02_functions.sql | ~200 | 0 | 7 | 0 | 0 |
| 03_policies.sql | ~450 | 0 | 0 | 41 | 0 |
| 04_triggers.sql | ~150 | 0 | 2 | 0 | 9 |
| **TOTAL** | **~1250** | **9** | **9** | **41** | **9** |

---

**Documentation Status:** ✅ Complete
**Schema Version:** 1.0.0
**Compatible With:** Supabase PostgreSQL 15+
