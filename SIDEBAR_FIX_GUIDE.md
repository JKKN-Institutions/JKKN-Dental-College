# 🔧 Sidebar Content Management Fix Guide

## ✅ What's Already Done

Your sidebar **already has** these items configured:
- ✅ **Navigation** (line 124-127 in AdminSidebar.tsx)
- ✅ **Pages** (line 129-134 in AdminSidebar.tsx)
- ✅ **Home Sections** (line 135-140 in AdminSidebar.tsx)

All three are under: **Content Management → Content** (dropdown)

## 🚨 Why You Can't See Them

The sidebar has **permission-based filtering** (lines 239-241). Menu items are hidden if you don't have permission for their modules.

## 🎯 Solution: Grant Permissions

### Option 1: If You're a Super Admin
✅ You should see ALL items automatically - just restart your dev server

### Option 2: If You're Using a Custom Role
You need to grant permissions. Follow these steps:

#### Step 1: Restart Your Dev Server
```bash
# Stop current server (Ctrl + C in terminal)
# Then run:
cd D:\Sangeetha\JKKN-Dental-College
npm run dev
```

#### Step 2: Login to Admin Panel
Go to: `http://localhost:3000/admin` (or your port)

#### Step 3: Navigate to Roles
Click: **Access Management → Role Management**

#### Step 4: Edit Your Role
1. Find your current role (e.g., "Content Manager", "Editor")
2. Click "Edit Role" button

#### Step 5: Grant Permissions
Scroll down to the Permission Matrix and find these modules:

**1. Navigation Module**
- ☑️ View
- ☑️ Create
- ☑️ Update
- ☑️ Delete

**2. Pages Module** ⭐ NEW
- ☑️ View Pages
- ☑️ Create Pages
- ☑️ Update Pages
- ☑️ Delete Pages

**3. Home Sections Module** ⭐ NEW
- ☑️ View Sections
- ☑️ Create Sections
- ☑️ Update Sections
- ☑️ Delete Sections

#### Step 6: Save Role
Click "Save Role" button at the bottom

#### Step 7: Hard Refresh Browser
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Or: F12 → Right-click Refresh → "Empty Cache and Hard Reload"

---

## 📋 Current Sidebar Structure

```
Content Management (group)
  └── Content (dropdown) ← Expanded by default
        ├── Navigation
        ├── Pages ⭐ NEW
        ├── Home Sections ⭐ NEW
        ├── Hero Section
        ├── Announcements
        ├── Benefits
        ├── Statistics
        └── Videos
```

---

## 🔍 How to Verify It's Working

### 1. Check You're a Super Admin
Open browser DevTools (F12) → Console → Run:
```javascript
// Check your profile
localStorage.getItem('user')
```

Look for: `"role_type": "super_admin"`

### 2. Check Permission Filtering
In the sidebar code (line 239-241), it filters items like this:
```typescript
const accessibleChildren = item.children.filter((child) =>
  accessibleModules.includes(child.module)
);
```

If `accessibleModules` doesn't include `'pages'` or `'home_sections'`, they won't show!

### 3. Test Direct URL Access
Try accessing directly:
- `/admin/content/navigation` - Should work
- `/admin/content/pages` - Should work
- `/admin/content/sections` - Should work

If you get "Access Denied", you don't have permission.

---

## 🐛 Still Not Working?

### Debug Steps:

**1. Check Permission Modules**
Open: `lib/permissions.ts`
Verify these are in the PermissionModule type:
```typescript
export type PermissionModule =
  | 'dashboard'
  | 'users'
  | 'navigation'      ← Should be here
  | 'pages'           ← Should be here
  | 'home_sections'   ← Should be here
  | ...
```

**2. Check Role Validation**
Open: `lib/validations/role.ts`
Verify these are in permissionModules array:
```typescript
export const permissionModules = [
  'dashboard',
  'users',
  'navigation',
  'pages',           ← Should be here
  'home_sections',   ← Should be here
  ...
] as const
```

**3. Check Module Metadata**
In the same file, verify moduleMetadata has entries for:
- `pages` (with label, description, actions)
- `home_sections` (with label, description, actions)

**4. Kill All Node Processes**
Sometimes Next.js caches get stuck:
```bash
# Windows:
taskkill /F /IM node.exe

# Then restart:
npm run dev
```

**5. Check Browser Console**
Open DevTools (F12) → Console
Look for errors related to:
- Permission loading
- Sidebar rendering
- Module imports

---

## 📊 Summary

| Item | Status | Location |
|------|--------|----------|
| Sidebar Menu Items | ✅ Added | `AdminSidebar.tsx:124-140` |
| Permission Types | ✅ Added | `lib/permissions.ts:18-19` |
| Role Validation | ✅ Added | `lib/validations/role.ts:14-15` |
| Module Metadata | ✅ Added | `lib/validations/role.ts:183-202` |
| Cache Cleared | ✅ Done | `.next/` deleted |

**Next Step:** Restart dev server + Hard refresh browser + Grant permissions to your role!

---

## 💡 Quick Test Commands

```bash
# Check if dev server is running
netstat -ano | findstr :3000

# Restart dev server
npm run dev

# Check TypeScript errors
npx tsc --noEmit
```

---

## 🎉 Expected Result

After following these steps, you should see:

**Content Management** (in sidebar)
  - **Content** ← Click to expand
    - Navigation
    - **Pages** ← NEW! Should appear here
    - **Home Sections** ← NEW! Should appear here
    - Hero Section
    - Announcements
    - Benefits
    - Statistics
    - Videos

The "Content" dropdown is **already expanded by default** (line 222 in AdminSidebar.tsx), so you should see all items immediately!
