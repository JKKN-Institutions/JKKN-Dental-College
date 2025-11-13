# 🎨 Page Builder System - Complete Guide

## 📚 Overview

Your project has **3 powerful content management modules** for building and managing your website without coding:

1. **Pages** - Create any custom page (About, Contact, Programs, etc.)
2. **Home Sections** - Control your homepage layout and content
3. **Navigation** - Build your website menu structure

---

## 🔥 Module 1: PAGES (Dynamic Page Builder)

### **What is it?**
A **page builder** that lets you create custom pages without writing code. Think of it like WordPress or Wix's page editor.

### **✅ Advantages:**

#### **1. No Code Required**
- Create pages through a visual interface
- No need to touch code files
- Non-technical staff can manage content

#### **2. Multiple Page Templates**
Your system supports 4 template types:
- **`default`** - Standard page with header/footer
- **`full-width`** - No sidebar, full screen width
- **`sidebar`** - Page with a side navigation
- **`landing`** - Marketing landing page (no header/footer)

#### **3. Rich Content Support**
Content can include:
- **Paragraphs** - Regular text
- **Headings** - H1, H2, H3, etc.
- **Images** - Upload and display images
- **Videos** - Embed videos
- **Lists** - Bullet points, numbered lists
- **Quotes** - Blockquotes
- **Code** - Code snippets with syntax highlighting
- **Dividers** - Visual separators

#### **4. SEO Built-in**
Every page has:
- Meta title (for Google)
- Meta description (for Google)
- Meta keywords (for search)
- Auto-generated URL slug

#### **5. Draft & Publish System**
- Save as **Draft** → preview internally
- **Publish** → make it live on website
- Track who created/updated each page

#### **6. Dynamic URLs**
- URLs are auto-generated from titles
- Example: "About JKKN" → `/about-jkkn`
- You can customize the slug manually

---

### **📝 How to Use Pages Module:**

#### **Step 1: Create a New Page**
1. Go to: **Admin Panel → Content Management → Content → Pages**
2. Click **"Create Page"** button
3. Fill in the form:
   - **Title**: "About JKKN Dental College" (required)
   - **Slug**: Auto-generated as `about-jkkn-dental-college` (optional)
   - **Template**: Choose `default` or `full-width`
   - **Content**: Add your page content using blocks
   - **Excerpt**: Short summary (optional)
   - **Status**: Draft or Published

#### **Step 2: Add Content Blocks**
Content is built with blocks:
```json
{
  "blocks": [
    {
      "id": "block-1",
      "type": "heading",
      "content": "Welcome to JKKN"
    },
    {
      "id": "block-2",
      "type": "paragraph",
      "content": "JKKN Dental College is a premier institution..."
    },
    {
      "id": "block-3",
      "type": "image",
      "content": {
        "url": "/images/campus.jpg",
        "alt": "JKKN Campus"
      }
    }
  ]
}
```

#### **Step 3: SEO Optimization**
Fill in SEO fields:
- **Meta Title**: "About JKKN Dental College - Premier Dental Education" (max 60 chars)
- **Meta Description**: "Learn about JKKN Dental College, our mission, vision..." (max 160 chars)
- **Meta Keywords**: ["dental college", "jkkn", "education"]

#### **Step 4: Publish**
- Toggle **"is_published"** to `true`
- Click **"Save"**
- Your page is now live at: `yourdomain.com/about-jkkn-dental-college`

---

### **🎯 Use Cases for Pages:**

| Page Type | Example | Template |
|-----------|---------|----------|
| About Page | `/about` | default |
| Contact Page | `/contact` | sidebar |
| Programs Page | `/programs` | default |
| Admission Process | `/admissions` | full-width |
| Faculty Page | `/faculty` | default |
| Research Page | `/research` | default |
| Landing Pages | `/apply-now` | landing |
| News Articles | `/news/article-slug` | default |

---

## 🏠 Module 2: HOME SECTIONS (Homepage Layout Manager)

### **What is it?**
Controls which sections appear on your **homepage** and in what **order**. Think of it like building blocks for your homepage.

### **✅ Advantages:**

#### **1. Visual Homepage Control**
- Show/hide sections without deleting content
- Reorder sections by changing display_order
- No need to edit code

#### **2. Pre-built Section Types**
Your system has **14 section types**:

| Type | Purpose | Example |
|------|---------|---------|
| `hero` | Hero banner with CTA | Main banner at top |
| `about` | About institution | Mission, vision, values |
| `institutions` | List of institutions | JKKN Engineering, Medical, Dental |
| `why-choose` | Benefits/features | Why choose JKKN? |
| `strength` | Statistics | 5000+ students, 95% placements |
| `news` | Latest news feed | College news |
| `buzz` | Announcements | Important notices |
| `events` | Past events | Event gallery |
| `videos` | Campus videos | Video carousel |
| `partners` | Partner logos | Supporting partners |
| `recruiters` | Recruiter logos | Companies that hire |
| `alumni` | Alumni testimonials | Success stories |
| `life` | Campus life | Student life photos |
| `contact` | Contact form | Get in touch |
| `custom` | Custom section | Anything else |

#### **3. Dynamic Ordering**
Change section order without redeploying:
```
Order 1: Hero Section
Order 2: About JKKN
Order 3: Why Choose JKKN
Order 4: Our Strength
Order 5: Campus Videos
...
```

#### **4. Show/Hide Control**
- **is_visible = true** → Section shows on homepage
- **is_visible = false** → Section hidden (but data saved)

#### **5. Custom Styling**
Each section can have:
- Background color
- Text color
- Custom CSS classes
- Component mapping

---

### **📝 How to Use Home Sections Module:**

#### **Step 1: View Current Sections**
1. Go to: **Admin Panel → Content Management → Content → Home Sections**
2. See all sections with:
   - Current order
   - Visibility status
   - Section type

#### **Step 2: Show/Hide Sections**
Example: Hide "Partners" section temporarily
1. Find "Partners" section in list
2. Click **Edit**
3. Toggle **"is_visible"** to `false`
4. Click **Save**
5. Partners section disappears from homepage immediately

#### **Step 3: Reorder Sections**
Want "Campus Videos" to appear after "About JKKN"?
1. Edit "Campus Videos" section
2. Change **"display_order"** from `9` to `3`
3. Edit other sections and adjust their orders
4. Sections will appear in new order on homepage

#### **Step 4: Add New Custom Section**
1. Click **"Add Section"**
2. Fill in:
   - **Section Key**: `new-initiatives` (unique identifier)
   - **Title**: "Our New Initiatives"
   - **Section Type**: `custom`
   - **Component Name**: `NewInitiativesSection` (your React component)
   - **Display Order**: `8`
   - **is_visible**: `true`

#### **Step 5: Configure Section Content**
Each section has a `content` field (JSON):
```json
// Hero Section Content
{
  "tagline": "Excellence in Dental Education",
  "description": "Building Future Dental Professionals",
  "primary_cta_text": "Apply Now",
  "primary_cta_link": "/apply",
  "background_image": "/images/hero-bg.jpg"
}

// Why Choose Section Content
{
  "reasons": [
    {
      "title": "Expert Faculty",
      "description": "Learn from the best",
      "icon": "users"
    },
    {
      "title": "Modern Infrastructure",
      "description": "State-of-the-art facilities",
      "icon": "building"
    }
  ]
}
```

---

### **🎯 Use Cases for Home Sections:**

#### **Scenario 1: Seasonal Changes**
During admission season:
- Set **"Apply Now" section** → `display_order = 2` (move to top)
- Set **is_visible = true**

After admissions close:
- Set **"Apply Now" section** → `is_visible = false` (hide it)

#### **Scenario 2: Event Highlighting**
During centenary celebrations:
- Add new section "Centenary Activities"
- Set `display_order = 2` (right after hero)
- After event, set `is_visible = false`

#### **Scenario 3: A/B Testing**
Test two homepage layouts:
- **Layout A**: Hero → About → Programs → Videos
- **Layout B**: Hero → Videos → About → Programs

Just change `display_order` values, no code changes!

---

## 🗺️ Module 3: NAVIGATION (Menu Builder)

### **What is it?**
Manages your website's menu structure - the links in your header/footer.

### **✅ Advantages:**

#### **1. Dynamic Menu Structure**
- Add/remove menu items without code
- Support for dropdown menus
- Nested navigation (parent → child items)

#### **2. Auto-Page Creation Integration**
When you create a new **Page**, you can automatically:
- Add it to navigation menu
- Set its parent (for dropdowns)
- Set display order

#### **3. Link Types**
- **Internal**: Links to your pages (`/about`)
- **External**: Links to other websites (`https://jkkn.ac.in`)
- **Anchor**: Links to page sections (`#contact`)

#### **4. Menu Positions**
- Header menu (main navigation)
- Footer menu (footer links)
- Mobile menu (hamburger menu)

---

### **📝 How to Use Navigation Module:**

#### **Step 1: View Current Menu**
1. Go to: **Admin Panel → Content Management → Content → Navigation**
2. See all menu items with hierarchy

#### **Step 2: Add New Menu Item**
1. Click **"Add Navigation Item"**
2. Fill in:
   - **Label**: "About Us" (what users see)
   - **URL**: `/about` (where it links)
   - **Link Type**: `internal`
   - **Parent**: `null` (top-level item)
   - **Display Order**: `2`
   - **Is Active**: `true`

#### **Step 3: Create Dropdown Menu**
Want "Academics" dropdown with sub-items?

**Parent Item:**
- Label: "Academics"
- URL: `/academics`
- Parent: `null`
- Display Order: `3`

**Child Items:**
1. Label: "Programs"
   - URL: `/academics/programs`
   - Parent: `academics-id` (ID of parent)
   - Display Order: `1`

2. Label: "Admissions"
   - URL: `/academics/admissions`
   - Parent: `academics-id`
   - Display Order: `2`

Result:
```
Academics ▼
  ├── Programs
  └── Admissions
```

#### **Step 4: Auto-Add When Creating Page**
When creating a new page:
1. Create page: "Faculty"
2. Check option: **"Add to Navigation"**
3. Select: **"Parent Menu"** = "About"
4. Set: **"Display Order"** = 3
5. Save

Now "Faculty" automatically appears in "About" dropdown!

---

## 🔗 How These 3 Modules Work Together

### **Example Workflow:**

#### **Goal:** Add new "Research" section to website

**Step 1: Create the Page** (Pages Module)
1. Go to Pages
2. Create new page "Research & Innovation"
3. Add content blocks
4. Set template to `full-width`
5. Set SEO meta tags
6. Publish

**Step 2: Add to Navigation** (Navigation Module)
1. Go to Navigation
2. Add new item:
   - Label: "Research"
   - URL: `/research-innovation` (auto-slug from page)
   - Display Order: 4
3. Now "Research" appears in header menu

**Step 3: Optional - Add to Homepage** (Home Sections Module)
1. Go to Home Sections
2. Add new section:
   - Title: "Research Highlights"
   - Type: `custom`
   - Component: `ResearchHighlightsSection`
   - Display Order: 6
   - Content: Link to full research page
3. Now homepage has a research teaser that links to full page

---

## 🎭 Real-World Examples

### **Example 1: New Admission Process Page**

```
1. PAGES MODULE:
   - Create page: "Admission Process 2025"
   - Template: full-width
   - Content blocks:
     * Heading: "How to Apply"
     * Paragraph: Step-by-step guide
     * Image: Application flowchart
     * Divider
     * Heading: "Important Dates"
     * List: Dates and deadlines
   - SEO: Title, description, keywords
   - Publish

2. NAVIGATION MODULE:
   - Add menu item under "Admissions"
   - Label: "How to Apply"
   - URL: /admission-process-2025
   - Display Order: 1

3. HOME SECTIONS MODULE (Optional):
   - Add announcement section
   - Title: "Admissions Open!"
   - Content: CTA button to admission page
   - Display Order: 2 (right after hero)
   - is_visible: true (during admission season)
```

### **Example 2: Centenary Celebration Website Update**

```
1. HOME SECTIONS MODULE:
   - Add "Centenary Activities" section
   - Type: custom
   - Display Order: 2 (prominent position)
   - Content: Carousel of activities
   - is_visible: true

2. PAGES MODULE:
   - Create page: "Centenary Celebrations"
   - Template: landing
   - Content: Full details, timeline, gallery
   - Publish

3. NAVIGATION MODULE:
   - Add top-level item: "Centenary"
   - URL: /centenary-celebrations
   - Display Order: 1 (first item)
   - Style: Different color (highlighted)

After centenary:
   - HOME SECTIONS: Set is_visible = false
   - NAVIGATION: Set is_active = false or delete
   - PAGES: Keep published (historical record)
```

---

## 📊 Comparison Table

| Feature | Pages | Home Sections | Navigation |
|---------|-------|---------------|------------|
| **Purpose** | Create full pages | Control homepage layout | Manage menus |
| **Scope** | Entire website | Homepage only | Site-wide |
| **Content Type** | Rich content blocks | Section configurations | Menu links |
| **SEO** | Full SEO support | No (homepage already has) | Affects crawling |
| **Reordering** | Not applicable | Yes (display_order) | Yes (display_order) |
| **Show/Hide** | Publish/Draft | is_visible toggle | is_active toggle |
| **Nested Structure** | No | No | Yes (parent-child) |

---

## 🎯 Best Practices

### **For Pages:**
1. **Always fill SEO fields** - Critical for Google ranking
2. **Use descriptive slugs** - `/about-us` better than `/page-1`
3. **Choose right template** - Landing pages for marketing
4. **Draft first, then publish** - Review before going live
5. **Keep content organized** - Use headings hierarchy (H1 > H2 > H3)

### **For Home Sections:**
1. **Hero always first** - `display_order = 1`
2. **CTA sections near top** - Orders 2-4
3. **Social proof mid-page** - Testimonials, stats around order 6-8
4. **Contact at bottom** - Last section
5. **Don't show too many** - Hide less important sections
6. **Test mobile view** - Sections should work on mobile

### **For Navigation:**
1. **Limit top-level items** - Max 6-7 for readability
2. **Use dropdowns for related pages** - Group by category
3. **Consistent naming** - Match page titles
4. **Order by importance** - Most important first
5. **Test on mobile** - Hamburger menu should work
6. **Keep URLs short** - `/about` better than `/about-us-contact-information`

---

## 🚀 Quick Start Checklist

### **Setting Up Your First Page:**
- [ ] Go to Admin → Content → Pages
- [ ] Click "Create Page"
- [ ] Add title and content
- [ ] Choose template type
- [ ] Fill SEO fields
- [ ] Save as Draft
- [ ] Preview the page
- [ ] Publish when ready

### **Organizing Your Homepage:**
- [ ] Go to Admin → Content → Home Sections
- [ ] Review all sections
- [ ] Set display_order for each
- [ ] Hide unnecessary sections (is_visible = false)
- [ ] Configure section content
- [ ] Save and preview homepage

### **Building Your Menu:**
- [ ] Go to Admin → Content → Navigation
- [ ] Map out menu structure on paper first
- [ ] Add top-level items
- [ ] Add dropdown children
- [ ] Set display orders
- [ ] Test on desktop and mobile

---

## 🔧 Technical Details

### **Database Tables:**

**Pages:**
```sql
pages (
  id, title, slug, content, template_type,
  is_published, meta_title, meta_description,
  created_at, updated_at, created_by
)
```

**Home Sections:**
```sql
home_sections (
  id, section_key, title, section_type,
  content, is_visible, display_order,
  background_color, text_color, component_name,
  created_at, updated_at
)
```

**Navigation:**
```sql
navigation_items (
  id, label, url, link_type, parent_id,
  display_order, is_active, position,
  created_at, updated_at
)
```

---

## 📞 Need Help?

### **Common Issues:**

**Issue:** "Page not showing up"
- **Solution:** Check is_published = true, check URL slug

**Issue:** "Section not appearing on homepage"
- **Solution:** Check is_visible = true, check component_name matches

**Issue:** "Menu item not clickable"
- **Solution:** Check is_active = true, verify URL is correct

**Issue:** "Changes not reflecting"
- **Solution:** Hard refresh browser (Ctrl + Shift + R)

---

## 🎓 Summary

### **When to Use Each Module:**

| Scenario | Use Module | Why |
|----------|-----------|-----|
| Add "About Us" page | **Pages** | Creating full content page |
| Temporarily hide video section | **Home Sections** | Quick homepage changes |
| Add "Contact" to menu | **Navigation** | Menu structure |
| Create landing page for ads | **Pages** (landing template) | Marketing page |
| Reorder homepage sections | **Home Sections** | Change visual layout |
| Add dropdown menu | **Navigation** | Organize related pages |
| SEO optimize a page | **Pages** | Meta tags built-in |
| Show announcement banner | **Home Sections** | Quick homepage update |

---

**The Power of This System:**
You can build and manage a **complete, professional website** without ever touching code files. Content editors, marketing teams, and admins can all work independently using these three powerful modules! 🎉
