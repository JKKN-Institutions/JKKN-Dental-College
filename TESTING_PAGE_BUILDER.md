# 🧪 Page Builder Testing Guide

**Test Date**: November 20, 2025
**Server**: http://localhost:3000
**Test Environment**: Development

---

## 🔧 **Fix Applied**

### **Issue**: Heading text input not updating
**Root Cause**: State synchronization issue between `selectedBlock` and `blocks` array
**Fix**: Updated `handleUpdateBlock` to sync `selectedBlock` state when block is updated
**File**: `components/admin/pages/page-editor.tsx:156`

---

## ✅ **Complete Testing Checklist**

### **1. Page Creation Flow** 🆕

#### Steps:
1. Navigate to: **http://localhost:3000/admin/pages**
2. Click **"Create Page"** button
3. Fill in form:
   - Title: `Test Page 1`
   - Slug: `test-page-1` (auto-generated)
   - Description: `Testing page builder functionality`
4. Click **"Create Page"**

#### Expected Results:
- ✅ Redirects to editor: `/admin/pages/[id]/edit`
- ✅ Page title appears in toolbar
- ✅ Empty canvas with placeholder message
- ✅ Block palette visible on left sidebar
- ✅ Status badge shows "draft"

#### Test Results:
- [ ] **Pass**
- [ ] **Fail** - Notes: _______________

---

### **2. Block Addition** ➕

#### Test Each Block Category:

##### **A. Content Blocks** (6 blocks)
| Block | Test | Pass/Fail | Notes |
|-------|------|-----------|-------|
| **Hero** | Click "Hero" in palette | ⬜ | |
| **Heading** | Click "Heading" in palette | ⬜ | |
| **Paragraph** | Click "Paragraph" in palette | ⬜ | |
| **Rich Text** | Click "Rich Text" in palette | ⬜ | |
| **Quote** | Click "Quote" in palette | ⬜ | |
| **CTA** | Click "Call to Action" in palette | ⬜ | |

##### **B. Media Blocks** (4 blocks)
| Block | Test | Pass/Fail | Notes |
|-------|------|-----------|-------|
| **Image** | Click "Image" in palette | ⬜ | |
| **Gallery** | Click "Gallery" in palette | ⬜ | |
| **Video** | Click "Video" in palette | ⬜ | |
| **Carousel** | Click "Carousel" in palette | ⬜ | |

##### **C. Layout Blocks** (5 blocks)
| Block | Test | Pass/Fail | Notes |
|-------|------|-----------|-------|
| **Two Columns** | Click "Two Columns" in palette | ⬜ | |
| **Three Columns** | Click "Three Columns" in palette | ⬜ | |
| **Card Grid** | Click "Card Grid" in palette | ⬜ | |
| **Accordion** | Click "Accordion" in palette | ⬜ | |
| **Tabs** | Click "Tabs" in palette | ⬜ | |

##### **D. Data Blocks** (5 blocks)
| Block | Test | Pass/Fail | Notes |
|-------|------|-----------|-------|
| **Table** | Click "Table" in palette | ⬜ | |
| **Statistics** | Click "Statistics" in palette | ⬜ | |
| **Timeline** | Click "Timeline" in palette | ⬜ | |
| **Contact Form** | Click "Contact Form" in palette | ⬜ | |
| **Embed** | Click "Embed" in palette | ⬜ | |

#### Expected Results for Each:
- ✅ Toast notification: "Block added"
- ✅ Block appears at bottom of canvas
- ✅ Default content is visible
- ✅ Block controls appear on hover

---

### **3. Block Configuration** ⚙️

#### Test Heading Block (Primary Test - Issue Fixed):
1. Add a **Heading** block
2. Click the block to select it
3. Click **settings icon** (gear) OR the block itself
4. Right panel opens: "Block Settings"
5. **Content Tab**:
   - Clear "Heading Text" field
   - Type: `Welcome to JKKN Dental College`
   - Character count updates in real-time
   - Change "Heading Level" to **H1**
6. **Style Tab**:
   - Set Background Color: `#f0f9ff` (light blue)
   - Set Text Color: `#0b6d41` (JKKN green)
   - Set Padding: `20px`
   - Set Text Align: `center`
7. Close panel (X button)

#### Expected Results:
- ✅ Text updates **immediately** in the canvas as you type
- ✅ Heading level changes (size increases for H1)
- ✅ Style changes apply to the block
- ✅ Block updates are persisted
- ✅ "Last saved" timestamp updates (if auto-save triggers)

#### Test Results:
- [ ] **Pass** - Text input works correctly
- [ ] **Fail** - Still has issues: _______________

---

#### Test Other Config Panels:

##### **A. Hero Block Config**
1. Add Hero block → Click settings
2. **Content Tab**:
   - Title: `Excellence in Dental Education`
   - Subtitle: `Empowering Future Healthcare Professionals`
   - Background Type: `Gradient`
   - Gradient Start: `#0b6d41`
   - Gradient End: `#1a5f4a`
   - Add CTA Button:
     - Label: `Learn More`
     - Href: `/about`
     - Variant: `Primary`
   - Enable Overlay: ✓
   - Overlay Opacity: `50%`
3. **Style Tab**: Test color/spacing

**Pass/Fail**: ⬜ **Notes**: _______________

##### **B. Paragraph Block Config**
1. Add Paragraph block → Click settings
2. **Content Tab**:
   - Content: `JKKN Dental College is a premier institution...`
   - Font Size: `lg`
3. **Style Tab**: Test styling

**Pass/Fail**: ⬜ **Notes**: _______________

##### **C. Image Block Config**
1. Add Image block → Click settings
2. **Content Tab**:
   - Src: `https://picsum.photos/800/600`
   - Alt: `Campus building`
   - Caption: `Our beautiful campus`
   - Aspect Ratio: `16/9`
   - Object Fit: `cover`

**Pass/Fail**: ⬜ **Notes**: _______________

##### **D. CTA Block Config**
1. Add CTA block → Click settings
2. **Content Tab**:
   - Heading: `Ready to Join Us?`
   - Description: `Apply now for admission`
   - Add multiple buttons

**Pass/Fail**: ⬜ **Notes**: _______________

##### **E. Blocks Without Config Panels** (15 blocks)
- Should show: "Configuration panel for [type] coming soon..."
- Still functional, just can't configure visually

**Test 3 blocks**: ⬜ Gallery, ⬜ Video, ⬜ Table

---

### **4. Drag and Drop** 🔄

#### Test Reordering:
1. Add 5 blocks in this order:
   - Heading
   - Paragraph
   - Image
   - Paragraph
   - CTA
2. Hover over **Paragraph** block (2nd one)
3. Click and hold the **grip handle** (≡ icon)
4. Drag to top position
5. Release

#### Expected Results:
- ✅ Visual feedback during drag (opacity, highlight)
- ✅ Other blocks shift to make space
- ✅ Block drops in new position
- ✅ Order numbers update (0, 1, 2, 3, 4)
- ✅ Toast: "Block added" or similar
- ✅ "Unsaved changes" indicator appears

#### Test Results:
- [ ] **Pass**
- [ ] **Fail** - Notes: _______________

---

### **5. Block Controls** 🎛️

For **each control**, test on a Heading block:

#### **A. Settings Button** ⚙️
- Click → Config panel opens
- **Pass/Fail**: ⬜

#### **B. Visibility Toggle** 👁️
- Click → Block becomes semi-transparent
- Icon changes: 👁️ → 👁️‍🗨️
- Block is hidden on public page (but visible in editor)
- Click again → Visible
- **Pass/Fail**: ⬜

#### **C. Duplicate Button** 📋
- Click → New identical block added at bottom
- Toast: "Block duplicated"
- Original block unchanged
- **Pass/Fail**: ⬜

#### **D. Delete Button** 🗑️
- Click → Confirmation or immediate delete
- Toast: "Block deleted"
- Block removed from canvas
- Selected block cleared (right panel closes)
- **Pass/Fail**: ⬜

---

### **6. Save Functionality** 💾

#### **A. Auto-Save** (30-second interval)
1. Add a block and configure it
2. Wait 30 seconds without touching anything
3. Watch the status text

**Expected**:
- ✅ Shows: "Saving..." with spinner
- ✅ Then: "Last saved 0 seconds ago"
- ✅ Toast: "Draft auto-saved"

**Pass/Fail**: ⬜ **Notes**: _______________

#### **B. Manual Save**
1. Make changes (add/edit blocks)
2. Click **"Save Draft"** button

**Expected**:
- ✅ Button shows loading state
- ✅ Toast: "Page saved successfully!"
- ✅ Timestamp updates
- ✅ "Unsaved changes" indicator clears

**Pass/Fail**: ⬜ **Notes**: _______________

---

### **7. SEO Configuration** 🔍

1. Click **"SEO"** button in toolbar
2. Panel/dialog opens
3. Fill in fields:
   - **Meta Title**: `JKKN Dental College - Test Page` (60 char limit)
   - **Meta Description**: `This is a test page for the JKKN page builder` (160 char limit)
   - **OG Image**: `https://picsum.photos/1200/630`
   - **Keywords**: Add tags: `dental`, `education`, `jkkn`
4. Save

**Expected**:
- ✅ Character counters work
- ✅ Cannot exceed limits
- ✅ Tags can be added/removed
- ✅ Data saves to page

**Pass/Fail**: ⬜ **Notes**: _______________

---

### **8. Preview Functionality** 👁️

1. Click **"Preview"** button in toolbar
2. New tab opens: `http://localhost:3000/test-page-1`

**Expected**:
- ✅ Shows current draft (even if unpublished)
- ✅ All blocks render correctly
- ✅ Styles are applied
- ✅ Hidden blocks are **not shown**
- ✅ Responsive (test on mobile width)

**Pass/Fail**: ⬜ **Notes**: _______________

---

### **9. Publish Workflow** 🚀

#### **A. Publish Dialog**
1. Click **"Publish"** button
2. Dialog opens with options:
   - [ ] Add to navigation menu
   - Menu Label: _____________
   - Position: First / After / Last
3. Check "Add to navigation"
4. Label: `Test Page`
5. Position: `Last`
6. Click **"Publish Page"**

**Expected**:
- ✅ Status changes: draft → published
- ✅ Badge color changes
- ✅ `published_at` timestamp set
- ✅ `published_blocks` snapshot created
- ✅ Navigation item created (if checked)
- ✅ Redirects to pages list

**Pass/Fail**: ⬜ **Notes**: _______________

#### **B. Published Page Access**
1. Navigate to: `http://localhost:3000/test-page-1`
2. View as public user (logout if needed)

**Expected**:
- ✅ Page loads successfully
- ✅ All visible blocks render
- ✅ SEO meta tags in HTML `<head>`
- ✅ No editor controls
- ✅ Clean public view

**Pass/Fail**: ⬜ **Notes**: _______________

#### **C. Edit After Publish**
1. Go back to editor
2. Make changes (edit a heading)
3. Save (don't publish yet)
4. View public page again

**Expected**:
- ✅ Public page shows **old version** (published_blocks)
- ✅ Editor shows **new version** (blocks)
- ✅ Draft/Published separation working

**Pass/Fail**: ⬜ **Notes**: _______________

---

### **10. Search and Filter** 🔍

In Block Palette:
1. Type in search box: `image`
2. Results filter in real-time

**Expected**:
- ✅ Shows: Image, Gallery (contains "image" in description)
- ✅ Hides other blocks
- ✅ Clear search → All blocks return

**Pass/Fail**: ⬜ **Notes**: _______________

---

### **11. Responsive Design** 📱

#### Test on Different Widths:
1. Desktop (1920px): ⬜ **Works**
2. Tablet (768px): ⬜ **Works**
3. Mobile (375px): ⬜ **Works**

**Expected**:
- ✅ Editor is usable on tablet
- ✅ Canvas scrolls properly
- ✅ Config panel is responsive
- ✅ Public page is mobile-friendly

---

### **12. Error Handling** ⚠️

#### Test Error Cases:

##### **A. Network Failure During Save**
1. Disconnect internet
2. Make changes
3. Try to save

**Expected**: ⬜ Error toast shown

##### **B. Invalid Image URL**
1. Add Image block
2. Enter invalid URL: `not-a-url`
3. Save and preview

**Expected**: ⬜ Broken image placeholder or error

##### **C. Delete Last Block**
1. Have only 1 block
2. Delete it

**Expected**: ⬜ Empty state message shows

---

### **13. Performance Tests** ⚡

#### **A. Large Page (50+ blocks)**
1. Create a page with 50 heading blocks
2. Test:
   - Scrolling: ⬜ Smooth
   - Drag-drop: ⬜ Responsive
   - Save: ⬜ Under 2 seconds

#### **B. Complex Blocks**
1. Add Hero with video background
2. Add Gallery with 20 images
3. Test:
   - Load time: ⬜ Under 3 seconds
   - Edit responsiveness: ⬜ No lag

---

### **14. Browser Compatibility** 🌐

Test on multiple browsers:

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ⬜ | |
| Firefox | Latest | ⬜ | |
| Safari | Latest | ⬜ | |
| Edge | Latest | ⬜ | |

---

### **15. Dark Mode** 🌙

1. Toggle dark mode (if available)
2. Test:
   - Editor UI: ⬜ Readable
   - Block preview: ⬜ Correct colors
   - Config panels: ⬜ Proper contrast

---

## 🐛 **Known Issues to Verify**

### **Issue #1: Heading Text Input** ✅ **FIXED**
- **Status**: Fixed by updating state synchronization
- **Test**: Type in heading config → Should update in real-time
- **Result**: ⬜ **Pass** / ⬜ **Fail**

### **Issue #2: Auth Placeholders** 🔴 **NOT FIXED**
- **Status**: Still using `'current-user-id'`
- **Impact**: created_by, updated_by will be wrong
- **Test**: Check database after creating page
- **Result**: ⬜ Shows real user ID / ⬜ Shows placeholder

### **Issue #3: Contact Form Submission**
- **Status**: Only logs to console
- **Test**: Fill and submit contact form on published page
- **Result**: ⬜ Console log only / ⬜ Actual submission

### **Issue #4: Media Library**
- **Status**: No upload/browser
- **Test**: Try to add image
- **Result**: ⬜ Must paste URL manually

---

## 📊 **Test Summary**

### **Completion Checklist**:
- [ ] All 20 block types tested
- [ ] Configuration panels tested (5/20)
- [ ] Drag-and-drop working
- [ ] Save/Auto-save working
- [ ] SEO configuration working
- [ ] Preview working
- [ ] Publish workflow working
- [ ] Public page rendering correct
- [ ] Responsive design verified
- [ ] Performance acceptable

### **Critical Issues Found**:
1. _______________
2. _______________
3. _______________

### **Minor Issues Found**:
1. _______________
2. _______________

### **Overall Assessment**:
- [ ] ✅ **Production Ready**
- [ ] ⚠️ **Needs Minor Fixes**
- [ ] 🔴 **Needs Major Fixes**

---

## 🎯 **Quick Smoke Test** (5 minutes)

If short on time, test these essentials:

1. ✅ Create page
2. ✅ Add Heading block
3. ✅ Edit heading text → **Verifies primary fix**
4. ✅ Drag block to reorder
5. ✅ Save draft
6. ✅ Publish page
7. ✅ View public page

**All working?** → ✅ **System is functional**

---

## 📝 **Testing Notes**

**Tester Name**: _______________
**Date**: _______________
**Time Spent**: _______________
**Overall Experience**: _______________

**Additional Comments**:
_______________
_______________
_______________

