# Navigation Module Setup Guide

## Overview
This guide will help you set up the Navigation module for the JKKN Dental College website. The module allows you to manage navigation menu items through the admin panel.

## Architecture
The Navigation module follows the 5-layer architecture:
1. **Types Layer**: `types/navigation.ts` - TypeScript interfaces
2. **Service Layer**: `lib/services/navigation/navigation-service.ts` - Database operations
3. **Hooks Layer**: `hooks/navigation/use-navigation.ts` - React state management
4. **Components Layer**: `components/admin/navigation/*` - Admin UI components
5. **Pages Layer**: `app/admin/content/navigation/*` - Admin routes

## Setup Instructions

### Step 1: Create Database Table

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `supabase/setup/13_navigation_items_table.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute

This will:
- Create the `navigation_items` table
- Set up indexes for performance
- Create RLS policies for security
- Insert default navigation items (Home, About, News, etc.)

### Step 2: Verify Database Setup

Run this query in SQL Editor to verify:

```sql
SELECT id, label, url, display_order, depth, is_active
FROM public.navigation_items
ORDER BY display_order;
```

You should see 9 navigation items.

### Step 3: Access Admin Panel

1. Navigate to: `http://localhost:3000/admin/content/navigation`
2. You should see the Navigation Management page with all 9 items
3. Try the following actions:
   - **Search** by label or URL
   - **Filter** by status, level, or auth requirement
   - **Create** a new navigation item
   - **Edit** an existing item
   - **Delete** an item
   - **Reorder** items by changing display_order

### Step 4: Verify Frontend

1. Go to the homepage: `http://localhost:3000`
2. Check the navigation menu (top bar)
3. The navigation should display the items from the database
4. If the database is empty, it will show fallback items

## Features

### Admin Panel Features
- ✅ **CRUD Operations**: Create, Read, Update, Delete navigation items
- ✅ **Search & Filters**: Search by label/URL, filter by status/level/auth
- ✅ **Pagination**: Handle large numbers of navigation items
- ✅ **Hierarchical Menus**: Create submenus by setting parent_id
- ✅ **Drag & Drop Reordering**: Change display_order to reorder items
- ✅ **Visibility Control**: Show/hide items with is_active flag
- ✅ **Featured Items**: Highlight special navigation items
- ✅ **Access Control**: Require authentication for certain items

### Frontend Features
- ✅ **Dynamic Navigation**: Fetches navigation items from database
- ✅ **Fallback Support**: Shows default items if database is empty
- ✅ **External Links**: Supports both anchor links (#section) and URLs
- ✅ **Link Targets**: Open links in same tab or new tab
- ✅ **Mobile Responsive**: Works on all screen sizes
- ✅ **Active State**: Highlights current section

## Database Schema

### Table: `navigation_items`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `label` | VARCHAR(100) | Display text (e.g., "Home") |
| `url` | VARCHAR(500) | Link destination (e.g., "#hero", "/about") |
| `icon` | VARCHAR(100) | Optional icon name |
| `target` | VARCHAR(10) | Link target (_self or _blank) |
| `parent_id` | UUID | Reference to parent item (NULL for top-level) |
| `display_order` | INTEGER | Sort order (0, 1, 2...) |
| `depth` | INTEGER | Hierarchy level (0=top, 1=submenu) |
| `is_active` | BOOLEAN | Show/hide in navigation |
| `is_featured` | BOOLEAN | Highlight in UI |
| `requires_auth` | BOOLEAN | Require login to see |
| `allowed_roles` | TEXT[] | Roles that can see this item |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |
| `created_by` | UUID | Creator user ID |
| `updated_by` | UUID | Last updater user ID |

### Indexes
- `parent_id` - Fast hierarchical queries
- `display_order` - Fast sorting
- `is_active` - Fast active items filtering
- `depth` - Fast level filtering

## Usage Examples

### Example 1: Create Top-Level Menu Item

```typescript
{
  label: "About Us",
  url: "/about",
  icon: "HiInformationCircle",
  target: "_self",
  parent_id: null,  // Top-level item
  display_order: 1,
  is_active: true,
  is_featured: false,
  requires_auth: false
}
```

### Example 2: Create Submenu Item

```typescript
{
  label: "Our History",
  url: "/about/history",
  icon: "HiClock",
  target: "_self",
  parent_id: "uuid-of-about-us-item",  // Child of "About Us"
  display_order: 0,
  is_active: true,
  is_featured: false,
  requires_auth: false
}
```

### Example 3: Create External Link

```typescript
{
  label: "Apply Now",
  url: "https://admissions.jkkn.edu",
  icon: "HiExternalLink",
  target: "_blank",  // Open in new tab
  parent_id: null,
  display_order: 10,
  is_active: true,
  is_featured: true,  // Highlight this item
  requires_auth: false
}
```

### Example 4: Create Auth-Required Item

```typescript
{
  label: "Student Portal",
  url: "/portal",
  icon: "HiLockClosed",
  target: "_self",
  parent_id: null,
  display_order: 11,
  is_active: true,
  is_featured: false,
  requires_auth: true,  // Only show to logged-in users
  allowed_roles: ["student", "admin"]
}
```

## API Reference

### Hooks

#### `useNavigationItems(filters?, page?, pageSize?)`
Fetch paginated list of navigation items with filters.

**Returns:**
- `navigationItems` - Array of navigation items
- `loading` - Loading state
- `error` - Error object
- `page` - Current page number
- `pageSize` - Items per page
- `total` - Total items count
- `updateFilters()` - Update filter criteria
- `goToPage()` - Navigate to page
- `refetch()` - Reload data

#### `useNavigationItem(id)`
Fetch single navigation item by ID.

**Returns:**
- `navigationItem` - Navigation item object
- `loading` - Loading state
- `error` - Error object
- `refetch()` - Reload data

#### `useNavigationTree()`
Fetch active navigation items as hierarchical tree (for frontend menu).

**Returns:**
- `navigationTree` - Hierarchical tree structure
- `loading` - Loading state
- `error` - Error object
- `refetch()` - Reload data

#### `useNavigationMutations()`
CRUD operations for navigation items.

**Returns:**
- `loading` - Loading state
- `error` - Error object
- `createNavigationItem(dto)` - Create new item
- `updateNavigationItem(dto)` - Update existing item
- `deleteNavigationItem(id)` - Delete item
- `reorderNavigationItems(items)` - Bulk reorder

## Troubleshooting

### Navigation items not showing in admin panel

1. Check if table exists:
```sql
SELECT * FROM public.navigation_items LIMIT 1;
```

2. Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'navigation_items';
```

3. Check browser console for errors

### Navigation items not showing on website

1. Check if items are active:
```sql
SELECT label, is_active FROM public.navigation_items;
```

2. Update items to active:
```sql
UPDATE public.navigation_items SET is_active = true;
```

3. Check browser console for fetch errors
4. Hard refresh the page (Ctrl+Shift+R)

### Cannot create/edit/delete items

1. Ensure you're authenticated (logged in)
2. Check RLS policies allow authenticated users
3. Check browser console for permission errors

## Next Steps

After setting up the Navigation module, you can:

1. **Customize Navigation Items**: Add/edit/delete items through admin panel
2. **Create Submenus**: Build hierarchical navigation by setting parent_id
3. **Add External Links**: Link to external websites with target="_blank"
4. **Control Visibility**: Show/hide items based on user authentication
5. **Reorder Items**: Change display_order to rearrange navigation

## Related Modules

The Navigation module is part of the larger CMS roadmap. Next modules to build:

- **About Module** - Manage "About Us" content
- **Contact Module** - Manage contact information
- **News Module** - Manage news articles
- **Events Module** - Manage upcoming and past events

See `WEBSITE_CMS_ROADMAP.md` for the complete plan.
