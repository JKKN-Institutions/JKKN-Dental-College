# Testing Guide: Dynamic Navigation & CMS System

## Overview
This guide will help you test all the dynamic features we've implemented for the JKKN Dental College website.

## Prerequisites
- Development server running (see step 1 below)
- Admin access to the system
- Browser with developer console access

---

## Step 1: Start the Development Server

### Option A: If you encounter permission errors with .next folder
```bash
# Stop any running dev servers first
# Kill the process using port 3000/3001

# Delete .next folder manually via File Explorer
# Then run:
npm run dev
```

### Option B: Normal start
```bash
npm run dev
```

The server should start on http://localhost:3000 (or 3001 if 3000 is in use).

---

## Step 2: Verify Database Setup ✅

### Check Tables Exist
All three required tables have been created:
- ✅ **pages** - 0 pages (ready for creation)
- ✅ **home_sections** - 14 sections seeded
- ✅ **navigation_items** - 9 items with new link_type fields

### Verify Home Sections Data
Run this SQL query in Supabase dashboard or use the SQL editor:
```sql
SELECT id, section_key, title, is_visible, display_order, component_name
FROM home_sections
ORDER BY display_order;
```

**Expected Result:** 14 sections in order:
1. hero → HeroSection (order: 0)
2. about → AboutJKKN (order: 1)
3. institutions → OurInstitutions (order: 2)
4. why-choose → WhyChooseJKKN (order: 3)
5. strength → OurStrength (order: 4)
6. news → CollegeNews (order: 5)
7. buzz → LatestBuzz (order: 6)
8. events → PastEvents (order: 7)
9. videos → CampusVideos (order: 8)
10. partners → SupportingPartners (order: 9)
11. recruiters → OurRecruiters (order: 10)
12. alumni → OurAlumni (order: 11)
13. life → LifeAtJKKN (order: 12)
14. contact → ContactUs (order: 13)

---

## Step 3: Test Dynamic Home Page Sections

### What Changed
The home page ([app/page.tsx](app/page.tsx)) now uses `<DynamicHomeSections />` component instead of hardcoded sections.

### How to Test

1. **Visit the home page**: http://localhost:3000

2. **Expected Behavior:**
   - All 14 sections should render in the correct order
   - The design should look exactly the same as before
   - No visible changes to the UI (only backend is now dynamic)

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any errors related to sections
   - Should see no errors

4. **Verify Section IDs:**
   - Right-click on any section → Inspect Element
   - Each section should have an `id` attribute matching the `section_key`
   - Example: `<section id="about">`, `<section id="institutions">`

### Troubleshooting
If sections don't load:
- Check console for errors
- Verify `useVisibleSections()` hook is fetching data
- Check database connection in `.env.local`

---

## Step 4: Test Admin Pages Management

### Access Admin Panel
Navigate to: http://localhost:3000/admin/content/pages

### Features to Test

#### 4.1 View Pages List
- ✅ Should see empty table (no pages created yet)
- ✅ Should see stats cards: 0 Total, 0 Published, 0 Drafts
- ✅ Should see "Create New Page" button

#### 4.2 Create a New Page

1. Click **"Create New Page"** button
2. Fill in the form:
   - **Title**: "About Our College"
   - **Slug**: (auto-generated as "about-our-college", or customize)
   - **Excerpt**: "Learn more about JKKN Dental College"
   - **Template**: Select "Default"
   - **Content**: Add HTML content:
     ```html
     <h1>About Our College</h1>
     <p>JKKN Dental College has been a leading institution since 1985...</p>
     <h2>Our Mission</h2>
     <p>To provide world-class dental education...</p>
     ```
   - **SEO Fields** (optional):
     - Meta Title: "About JKKN Dental College"
     - Meta Description: "Learn about our history, mission, and values"
   - **Published**: ✅ Check this to publish immediately

3. Click **"Create Page"**

#### 4.3 Verify Page Creation
- Should redirect to pages list
- Should see new page in the table
- Stats should update: 1 Total, 1 Published

#### 4.4 Edit a Page
1. Click the **Edit** button (pencil icon) on the page
2. Change the title to "About JKKN Dental College"
3. Update content
4. Click **"Update Page"**
5. Verify changes are saved

#### 4.5 Test Slug Validation
1. Try creating another page with the same slug
2. Should see error: "This slug is already in use"
3. Change the slug to something unique

#### 4.6 Toggle Publish Status
1. Click the **Unpublish** button
2. Page should move to "Drafts"
3. Stats should update: 1 Draft, 0 Published

#### 4.7 Delete a Page
1. Click the **Delete** button (trash icon)
2. Confirm deletion
3. Page should be removed from the list

---

## Step 5: Test Admin Sections Management

### Access Sections Panel
Navigate to: http://localhost:3000/admin/content/sections

### Features to Test

#### 5.1 View Sections List
- ✅ Should see 14 sections in display_order
- ✅ Should see visibility toggles for each section
- ✅ All sections should be visible (green checkmark)

#### 5.2 Toggle Section Visibility

1. **Hide a Section:**
   - Find "Latest Buzz" section
   - Click the **eye icon** to toggle visibility
   - Status should change to "Hidden" (red X)

2. **Verify on Homepage:**
   - Go back to http://localhost:3000
   - Scroll down - "Latest Buzz" section should NOT appear
   - All other sections should still be visible

3. **Show the Section Again:**
   - Return to sections admin
   - Click the eye icon again
   - Verify section reappears on homepage

#### 5.3 Reorder Sections

1. **Edit Display Order:**
   - Click **Edit** on "About JKKN" section
   - Change **Display Order** from `1` to `10`
   - Click **Update Section**

2. **Verify Order Change:**
   - Go to homepage
   - "About JKKN" section should now appear much later (after Strength, News, etc.)

3. **Reset Order:**
   - Edit again and change back to `1`

#### 5.4 Edit Section Content

1. Click **Edit** on any section (e.g., "Hero Section")
2. Update fields:
   - **Title**: Change to test
   - **Subtitle**: Update
   - **Content (JSON)**: Edit section-specific data
3. Click **Update Section**
4. Verify changes on homepage

#### 5.5 Create Custom Section

1. Click **"Create New Section"**
2. Fill in:
   - **Section Key**: "testimonials"
   - **Title**: "Student Testimonials"
   - **Section Type**: Select "custom"
   - **Display Order**: 14
   - **Is Visible**: ✅
   - **Component Name**: "Testimonials" (must match a real component)
3. Click **Create Section**

**Note:** For custom sections to work, you need to:
- Create the React component (`components/Testimonials.tsx`)
- Add it to the COMPONENT_MAP in `DynamicHomeSections.tsx`

---

## Step 6: Test Navigation Auto-Page Creation

### Access Navigation Panel
Navigate to: http://localhost:3000/admin/content/navigation

### Test Auto-Create Feature

#### 6.1 Create Menu with New Page

1. Click **"Add Navigation Item"**
2. Fill in the form:
   - **Label**: "Admissions"
   - **Link Type**: Select "📄 Dynamic Page"
   - **Create Page**: ✅ Check this box
   - **Display Order**: 20

3. **Expected Behavior:**
   - A blue info box should appear: "A new page will be automatically created..."
   - Slug field should be disabled (auto-generated)

4. Click **"Create Navigation Item"**

5. **Verify:**
   - Navigation item is created
   - A new page "Admissions" is created in pages table (check /admin/content/pages)
   - Page slug is "admissions"
   - Page is unpublished by default (draft)

#### 6.2 Link to Existing Page

1. Create another page first (e.g., "Contact Information")
2. Create navigation item:
   - **Label**: "Contact"
   - **Link Type**: "📄 Dynamic Page"
   - **Page**: Select "Contact Information" from dropdown
   - **Create Page**: (should be disabled/hidden)

3. Navigation should link to existing page

#### 6.3 Link to Home Section

1. Create navigation item:
   - **Label**: "Our Facilities"
   - **Link Type**: "📍 Home Section (Scroll)"
   - **Section**: Select "Our Strength"

2. Verify clicking this link scrolls to the section on homepage

#### 6.4 External Link

1. Create navigation item:
   - **Label**: "Apply Online"
   - **Link Type**: "🔗 External URL"
   - **Custom Link**: "https://admissions.jkkn.edu"
   - **Target**: "_blank"

2. Verify link opens in new tab

---

## Step 7: Test Dynamic Page Routing

### Create and Access Dynamic Pages

#### 7.1 Create a Test Page

1. Go to /admin/content/pages
2. Create a page:
   - **Title**: "Facilities"
   - **Slug**: "facilities"
   - **Content**: Rich HTML content
   - **Template**: "Full Width"
   - **Published**: ✅

#### 7.2 Access the Page

Visit: http://localhost:3000/facilities

**Expected Behavior:**
- Page loads with green header showing title
- Content displays correctly
- Template styling is applied
- Page title appears in browser tab

#### 7.3 Test SEO Metadata

1. Right-click → View Page Source
2. Check `<head>` section for:
   ```html
   <title>Facilities - JKKN Dental College</title>
   <meta name="description" content="..." />
   ```

#### 7.4 Test 404 Page

Visit: http://localhost:3000/nonexistent-page

**Expected:** Next.js 404 page

#### 7.5 Test Different Templates

Create pages with different templates:
- **Default**: Standard container width
- **Full Width**: Edge-to-edge content
- **Sidebar**: 3-column grid layout
- **Landing**: Gradient background

Verify each renders correctly.

---

## Step 8: Integration Testing

### Test Complete Workflow

#### Scenario: Create "Courses" Page with Navigation

1. **Create Navigation Item:**
   - Go to /admin/content/navigation
   - Click "Add Navigation Item"
   - Label: "Courses Offered"
   - Link Type: "Dynamic Page"
   - Create Page: ✅
   - Display Order: 15

2. **Verify Auto-Creation:**
   - Check /admin/content/pages
   - Should see new "Courses Offered" page (draft)

3. **Edit the Page:**
   - Click Edit on "Courses Offered"
   - Add content about courses
   - Set template: "Sidebar"
   - Publish: ✅
   - Update page

4. **Test Navigation:**
   - Go to homepage
   - Navigation menu should show "Courses Offered"
   - Click it → should navigate to /courses-offered
   - Page should load with content

5. **Update Navigation Label:**
   - Edit navigation item
   - Change label to "Our Courses"
   - Verify navigation updates (page slug stays the same)

---

## Step 9: Performance & Error Testing

### Check for Errors

#### Browser Console
- Open DevTools (F12) → Console
- Should see no errors
- Check for warnings about missing components

#### Network Tab
- Go to Network tab
- Reload homepage
- Check for:
  - Successful API calls to Supabase
  - No 404 errors
  - Reasonable load times

#### React DevTools
If you have React DevTools installed:
- Check component tree
- Verify DynamicHomeSections renders all sections
- Check hooks are fetching data correctly

### Test Error States

#### 1. Database Connection Error
- Stop Supabase (or disconnect internet briefly)
- Reload homepage
- **Expected:** Error message: "Error loading sections"

#### 2. Invalid Section Component
1. Create a section with component_name: "NonExistentComponent"
2. Check console: Should see warning:
   ```
   [DynamicHomeSections] No component found for: NonExistentComponent
   ```
3. Page should still load (other sections render)

#### 3. Invalid Page Slug
- Visit /invalid-slug
- **Expected:** 404 page

---

## Step 10: Verify All Features Checklist

### Database ✅
- [x] pages table created
- [x] home_sections table created with 14 seeded sections
- [x] navigation_items table updated with link fields
- [x] RLS policies enabled
- [x] Triggers for updated_at working

### Backend Services ✅
- [x] PagesService with full CRUD
- [x] SectionsService with full CRUD
- [x] NavigationService with auto-page creation
- [x] TypeScript types defined
- [x] Validation working

### React Hooks ✅
- [x] usePages, usePage, usePageBySlug
- [x] usePageMutations
- [x] useSections, useVisibleSections
- [x] useSection, useSectionByKey
- [x] useSectionMutations

### Admin Panels ✅
- [x] /admin/content/pages - List, Create, Edit, Delete
- [x] /admin/content/sections - List, Edit, Reorder, Toggle
- [x] /admin/content/navigation - Enhanced with auto-create
- [x] Forms with validation
- [x] Data tables with sorting/filtering
- [x] Stats cards

### Frontend ✅
- [x] DynamicHomeSections component
- [x] Dynamic [slug] routing
- [x] SEO metadata generation
- [x] Multiple templates support
- [x] Error handling
- [x] Loading states

### Integration ✅
- [x] Navigation → Auto-create pages
- [x] Sections → Dynamic ordering
- [x] Sections → Visibility toggle
- [x] Pages → Dynamic routing
- [x] Navigation → Link to pages/sections

---

## Common Issues & Solutions

### Issue 1: Sections Not Loading
**Symptoms:** Homepage shows loading spinner forever

**Solutions:**
1. Check `.env.local` has correct Supabase credentials
2. Verify database connection
3. Check browser console for errors
4. Verify home_sections table has data:
   ```sql
   SELECT COUNT(*) FROM home_sections WHERE is_visible = true;
   ```

### Issue 2: Auto-Page Creation Not Working
**Symptoms:** Navigation created but page not auto-created

**Solutions:**
1. Check navigation_service.ts is updated
2. Verify PagesService import is correct
3. Check database for foreign key constraints
4. Look for errors in terminal/console

### Issue 3: Dynamic Routes Return 404
**Symptoms:** /test-page returns 404 even though page exists

**Solutions:**
1. Verify page is published (is_published = true)
2. Check slug is correct (no typos)
3. Clear .next folder and rebuild:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Issue 4: Sections Render in Wrong Order
**Symptoms:** "About" appears after "News"

**Solutions:**
1. Check display_order values in database
2. Verify ORDER BY clause in useVisibleSections hook
3. Edit section and set correct display_order

### Issue 5: Permission Errors
**Symptoms:** EPERM error when starting dev server

**Solutions:**
1. Close all terminals and editors
2. Delete .next folder manually via File Explorer
3. Restart computer if needed
4. Run `npm run dev` again

---

## Next Steps After Testing

### 1. Production Deployment Checklist
- [ ] Test all features in production environment
- [ ] Set up proper RLS policies for production
- [ ] Configure environment variables
- [ ] Test with real users
- [ ] Monitor for errors

### 2. Content Migration
- [ ] Migrate existing static content to pages
- [ ] Update navigation menu items
- [ ] Configure section order as needed
- [ ] Publish pages

### 3. Training
- [ ] Train admin users on Pages management
- [ ] Train admin users on Sections management
- [ ] Train admin users on Navigation management
- [ ] Document common workflows

### 4. Enhancements (Future)
- [ ] Rich text editor for page content
- [ ] Media library integration
- [ ] Version history for pages
- [ ] Page templates with predefined blocks
- [ ] Bulk operations (publish multiple pages)
- [ ] Advanced search/filtering

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify database connection
4. Review this testing guide
5. Check IMPLEMENTATION_PROGRESS.md for architecture details

---

## Summary

You've successfully implemented a complete dynamic CMS system! 🎉

**What's Now Dynamic:**
- ✅ All home page sections (order, visibility, content)
- ✅ Navigation menus with auto-page creation
- ✅ Custom pages with dynamic routing
- ✅ SEO metadata
- ✅ Multiple page templates

**Admin Can Now:**
- ✅ Create/edit/delete pages without touching code
- ✅ Reorder home page sections
- ✅ Hide/show sections
- ✅ Create navigation menus that auto-create pages
- ✅ Update all content from admin panel

**Frontend:**
- ✅ Maintains exact same design
- ✅ No visual changes to users
- ✅ Everything is now data-driven
