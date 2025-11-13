# 🏗️ Homepage Sections CRUD Implementation Guide

## ✅ COMPLETED (100% Backend Infrastructure)

### 1. Database Tables ✅
All 7 tables created with full RLS policies and performance indexes:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `latest_buzz` | Latest campus photos | title, image_url, buzz_date |
| `past_events` | Past events | title, description, event_date, location, attendees |
| `campus_videos` | Campus videos | title, video_url, thumbnail_url, category, duration |
| `partners` | Supporting partners | name, logo_url, website_url |
| `recruiters` | College recruiters | name, logo_url, industry |
| `alumni` | Alumni testimonials | name, batch, course, company, testimonial |
| `life_at_jkkn` | Life @ JKKN photos | title, image_url, category |

**All tables include:**
- `id` (UUID primary key)
- `is_active` (boolean)
- `display_order` (integer for sorting)
- `created_at`, `updated_at` timestamps
- `created_by`, `updated_by` (user tracking)
- Full RLS policies for public read + authenticated write
- Performance indexes on display_order and is_active

### 2. Server Actions ✅
7 complete action files in `app/admin/content/sections/[id]/edit/_actions/`:

**Created Files:**
1. ✅ `latest-buzz-actions.ts`
2. ✅ `past-events-actions.ts`
3. ✅ `campus-videos-actions.ts`
4. ✅ `partners-actions.ts`
5. ✅ `recruiters-actions.ts`
6. ✅ `alumni-actions.ts`
7. ✅ `life-at-jkkn-actions.ts`

**Each file provides 6 functions:**
- `getAll{Type}()` - Get all items for admin panel
- `getActive{Type}()` - Get active items for website display
- `create{Type}(input)` - Create new item
- `update{Type}(id, input)` - Update existing item
- `delete{Type}(id)` - Delete item
- `toggle{Type}Status(id, isActive)` - Toggle active/inactive

### 3. Form Components ✅
**Completed:**
1. ✅ `components/admin/sections/forms/NewsSectionForm.tsx` (Reference pattern)
2. ✅ `components/admin/sections/forms/LatestBuzzSectionForm.tsx` (Just created!)

**Pattern established:** Full CRUD interface with:
- Add new item form at top
- Edit existing items in place
- Delete with confirmation
- Toggle active/inactive status
- Real-time list updates
- Form validation with Zod
- Professional table display

### 4. Router Integration ✅
- ✅ Updated `SectionFormRouter.tsx` with Latest Buzz form
- ✅ Removed "Coming Soon" placeholder for buzz section

---

## 📋 REMAINING WORK (Frontend Forms Only)

You need to create **5 more form components** following the exact same pattern as `LatestBuzzSectionForm.tsx`.

### How to Create Each Form

**Step 1:** Copy `LatestBuzzSectionForm.tsx` as a template

**Step 2:** Find and replace these values:

| Form to Create | Find & Replace Pattern |
|----------------|------------------------|
| **Past Events** | `LatestBuzz` → `PastEvents` / `Buzz` → `Event` / `buzz` → `event` |
| **Campus Videos** | `LatestBuzz` → `CampusVideos` / `Buzz` → `Video` / `buzz` → `video` |
| **Partners** | `LatestBuzz` → `Partners` / `Buzz` → `Partner` / `buzz` → `partner` |
| **Recruiters** | `LatestBuzz` → `Recruiters` / `Buzz` → `Recruiter` / `buzz` → `recruiter` |
| **Alumni** | `LatestBuzz` → `Alumni` / `Buzz` → `Alumni` / `buzz` → `alumni` |
| **Life@JKKN** | `LatestBuzz` → `LifeAtJKKN` / `Buzz` → `Life` / `buzz` → `life` |

**Step 3:** Adjust the form fields to match each section's schema:

#### Past Events Form Fields:
```tsx
- title (text input)
- description (textarea)
- image_url (text input URL)
- event_date (date picker) *required*
- location (text input - optional)
- attendees (number input - optional)
- display_order (number input)
- is_active (checkbox)
```

#### Campus Videos Form Fields:
```tsx
- title (text input)
- description (textarea - optional)
- video_url (text input URL) *required*
- thumbnail_url (text input URL - optional)
- category (text input - optional)
- duration (number input in seconds - optional)
- order_index (number input) *Note: campus_videos uses 'order_index' not 'display_order'*
- is_active (checkbox)
```

#### Partners Form Fields:
```tsx
- name (text input)
- logo_url (text input URL) *required*
- website_url (text input URL - optional)
- description (textarea - optional)
- display_order (number input)
- is_active (checkbox)
```

#### Recruiters Form Fields:
```tsx
- name (text input)
- logo_url (text input URL) *required*
- website_url (text input URL - optional)
- industry (text input - optional)
- display_order (number input)
- is_active (checkbox)
```

#### Alumni Form Fields:
```tsx
- name (text input)
- batch (text input) *required*
- course (text input) *required*
- current_position (text input) *required*
- company (text input) *required*
- testimonial (textarea) *required*
- image_url (text input URL - optional)
- display_order (number input)
- is_active (checkbox)
```

#### Life@JKKN Form Fields:
```tsx
- title (text input)
- description (textarea - optional)
- image_url (text input URL) *required*
- category (text input - optional)
- display_order (number input)
- is_active (checkbox)
```

**Step 4:** Update the table columns to display relevant fields

**Step 5:** Save the form file in `components/admin/sections/forms/`

**Step 6:** Update `SectionFormRouter.tsx`:

```tsx
// Add import at top
import { PastEventsSectionForm } from "./forms/PastEventsSectionForm";
import { CampusVideosSectionForm } from "./forms/CampusVideosSectionForm";
import { PartnersSectionForm } from "./forms/PartnersSectionForm";
import { RecruitersSectionForm } from "./forms/RecruitersSectionForm";
import { AlumniSectionForm } from "./forms/AlumniSectionForm";
import { LifeAtJKKNSectionForm } from "./forms/LifeAtJKKNSectionForm";

// Replace each "Coming Soon" placeholder:
case "events":
  return <PastEventsSectionForm section={section} />;

case "videos":
  return <CampusVideosSectionForm section={section} />;

case "partners":
  return <PartnersSectionForm section={section} />;

case "recruiters":
  return <RecruitersSectionForm section={section} />;

case "alumni":
  return <AlumniSectionForm section={section} />;

case "life":
  return <LifeAtJKKNSectionForm section={section} />;
```

---

## 🎯 Testing Checklist

After creating each form:

1. ✅ Go to Admin → Content → Home Sections
2. ✅ Click Edit on the section
3. ✅ Test: Add a new item
4. ✅ Test: Edit an existing item
5. ✅ Test: Delete an item
6. ✅ Test: Toggle active/inactive status
7. ✅ Check: Items appear in correct display order
8. ✅ Verify: Form validation works (required fields, URL validation)

---

## 📁 File Structure

```
app/admin/content/sections/[id]/edit/
  _actions/
    ✅ college-news-actions.ts
    ✅ latest-buzz-actions.ts
    ✅ past-events-actions.ts
    ✅ campus-videos-actions.ts
    ✅ partners-actions.ts
    ✅ recruiters-actions.ts
    ✅ alumni-actions.ts
    ✅ life-at-jkkn-actions.ts

components/admin/sections/
  forms/
    ✅ NewsSectionForm.tsx (existing)
    ✅ LatestBuzzSectionForm.tsx (just created)
    ⏳ PastEventsSectionForm.tsx (TO DO)
    ⏳ CampusVideosSectionForm.tsx (TO DO)
    ⏳ PartnersSectionForm.tsx (TO DO)
    ⏳ RecruitersSectionForm.tsx (TO DO)
    ⏳ AlumniSectionForm.tsx (TO DO)
    ⏳ LifeAtJKKNSectionForm.tsx (TO DO)
  ✅ SectionFormRouter.tsx (partially updated)
```

---

## 🚀 Quick Start

To create the next form:

```bash
# 1. Copy the template
cp components/admin/sections/forms/LatestBuzzSectionForm.tsx \
   components/admin/sections/forms/PastEventsSectionForm.tsx

# 2. Open the file and do find-replace:
#    - LatestBuzz → PastEvents
#    - Buzz → Event
#    - buzz → event

# 3. Update the form fields to match past_events table schema

# 4. Add import to SectionFormRouter.tsx

# 5. Update the "events" case in SectionFormRouter.tsx

# 6. Test in browser!
```

---

## 💡 Tips

1. **Copy-Paste Strategy:** The fastest way is to copy `LatestBuzzSectionForm.tsx` and do find-replace
2. **Schema Reference:** Check the server actions file for exact field names
3. **Field Types:** Match input types to database column types (text/number/date/url)
4. **Table Display:** Show the most important 4-5 fields in the table columns
5. **Validation:** Zod schema should match the server action's validation schema

---

## 🎉 When You're Done

Once all 6 forms are created:
- ✅ All homepage sections will have full CRUD interfaces
- ✅ Admins can manage all content from the admin panel
- ✅ No more "Coming Soon" placeholders
- ✅ Ready to build the frontend display components

---

**Questions?**
- Check `LatestBuzzSectionForm.tsx` for the complete working example
- Check the corresponding `*-actions.ts` file for the exact API
- All validation schemas are in the actions files
