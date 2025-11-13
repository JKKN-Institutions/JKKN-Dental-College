# College News Management System - User Guide

## Overview
The College News Management System allows you to manage news items from the admin panel that automatically appear on your website's College News section.

## Features
- ✅ Add new news items with image, title, description, and date
- ✅ Edit existing news items
- ✅ Delete news items
- ✅ Toggle news visibility (Active/Inactive)
- ✅ Set display order for news items
- ✅ View all news in a table format
- ✅ Real-time updates on the website

## How to Use

### Accessing College News Management

1. **Login to Admin Panel**
   - Go to `/admin` and login with your credentials

2. **Navigate to Sections**
   - Click on "Content" in the sidebar
   - Click on "Sections"
   - Find the "College News" section in the list

3. **Click Edit**
   - Click the edit button on the College News row
   - You'll see the College News management interface

### Adding a New News Item

1. Fill in the form fields:
   - **Title** (Required): Main headline of the news
   - **Description** (Required): Brief description or content
   - **Image URL** (Required): Full URL to the news image
     - Example: `/images/news-photo.jpg` or `https://example.com/image.jpg`
   - **Published Date**: Date when the news was published
   - **Display Order**: Lower numbers appear first (0, 1, 2, etc.)
   - **Active**: Check this box to show the news on the website

2. Click "Add News" button

3. The news will appear in the table below and immediately on your website

### Editing a News Item

1. In the news table, find the item you want to edit
2. Click the **Edit (pencil icon)** button
3. The form will populate with the current values
4. Make your changes
5. Click "Update News" button
6. Changes appear immediately on the website

### Deleting a News Item

1. In the news table, find the item you want to delete
2. Click the **Delete (trash icon)** button
3. Confirm the deletion
4. The news is removed from the table and website

### Toggling News Status

1. In the "Status" column, you'll see Active/Inactive buttons
2. Click the button to toggle the status
3. **Active** (green): News is visible on the website
4. **Inactive** (gray): News is hidden from the website

### Display Order

- News items are displayed in order of:
  1. **Display Order** (ascending): Lower numbers first
  2. **Published Date** (descending): Newer dates first

- To reorder news, edit the Display Order value

## Website Display

The news items appear on your homepage in the "College News" section with:
- Auto-scrolling carousel
- News image
- Published date badge
- Title
- Description (excerpt)

Only **Active** news items are shown on the website.

## Database Schema

The news items are stored in the `college_news` table with:
- `id`: Unique identifier
- `title`: News headline
- `description`: News content
- `image_url`: URL to news image
- `published_date`: Publication date
- `is_active`: Visibility status
- `display_order`: Display order
- `created_at`, `updated_at`: Timestamps
- `created_by`, `updated_by`: User tracking

## Security

- Only authenticated admin users can manage news
- Row Level Security (RLS) policies protect the data
- Public users can only view active news items

## Existing News Migration

Your existing 6 news items have been migrated to the database:
1. JKKN Receives NAAC A+ Accreditation
2. Students Win National Level Hackathon
3. New Research Lab Inaugurated
4. Record Breaking Placement Season 2024-25
5. Faculty Receives National Teaching Award
6. MoU Signed with Leading Tech Companies

## Technical Details

### Files Created/Modified

1. **Database Migration**
   - `supabase/migrations/[timestamp]_create_college_news_table.sql`
   - Creates `college_news` table with RLS policies

2. **Server Actions**
   - `app/admin/content/sections/[id]/edit/_actions/college-news-actions.ts`
   - CRUD operations for news management

3. **Admin Form Component**
   - `components/admin/sections/forms/NewsSectionForm.tsx`
   - Form interface for managing news items

4. **Website Display Component**
   - `components/CollegeNews.tsx`
   - Frontend component that displays news on website

5. **Migration Script**
   - `scripts/migrate-news-data.ts`
   - Script to populate existing news data

### API Operations

All operations use Server Actions:
- `getAllCollegeNews()` - Get all news items (admin)
- `getActiveCollegeNews()` - Get active news items (public)
- `createCollegeNews()` - Create new news item
- `updateCollegeNews()` - Update existing news item
- `deleteCollegeNews()` - Delete news item
- `toggleCollegeNewsStatus()` - Toggle active status

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify you're logged in as admin
3. Ensure image URLs are valid and accessible
4. Check that Supabase connection is working

## Future Enhancements

Possible features to add:
- [ ] Category/tags for news items
- [ ] Rich text editor for descriptions
- [ ] Image upload directly from admin panel
- [ ] Search and filter in news table
- [ ] Pagination for large number of news items
- [ ] Draft mode for unpublished news
- [ ] Featured news highlighting
