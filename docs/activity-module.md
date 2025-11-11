# Activities Module - Product Requirements Document (PRD)

## 1. Executive Summary

Transform the JKKN Centenary Activities platform from static to dynamic database-driven system with admin panel for content management.

**Current State**: 100 hardcoded activities in TypeScript files  
**Target State**: Database-driven with role-based admin panel for CRUD operations

---

## 2. Database Schema Requirements

### 2.1 Core Tables

**activities**
- id (UUID, Primary Key)
- title (String, Required, Max 255)
- slug (String, Unique, Required)
- status (Enum: planned/ongoing/completed)
- category (Enum: environment/education/community/healthcare/infrastructure/cultural)
- description (Text, Required)
- vision_text (Text, Optional)
- hero_image_url (String, Required)
- progress (Integer, 0-100)
- impact (String, Max 100)
- activity_date (Date, Optional)
- is_published (Boolean, Default false)
- meta_title (String, Max 60)
- meta_description (String, Max 160)
- created_at, updated_at (Timestamps)
- created_by, updated_by (UUID, Foreign Key to users)

**activity_metrics** (One-to-Many with activities)
- id (UUID, PK)
- activity_id (UUID, FK, Cascade Delete)
- metric_key (String, Required, Max 100)
- metric_value (String, Required, Max 100)
- display_order (Integer, Default 0)
- created_at (Timestamp)

**activity_impact_stats** (One-to-Many with activities)
- id (UUID, PK)
- activity_id (UUID, FK, Cascade Delete)
- label (String, Required, Max 100)
- value (String, Required, Max 100)
- icon (String, Optional, Max 50)
- display_order (Integer, Default 0)
- created_at (Timestamp)

**activity_gallery** (One-to-Many with activities)
- id (UUID, PK)
- activity_id (UUID, FK, Cascade Delete)
- image_url (String, Required)
- caption (Text, Optional)
- alt_text (String, Max 255)
- display_order (Integer, Default 0)
- uploaded_at (Timestamp)

**activity_testimonials** (One-to-Many with activities)
- id (UUID, PK)
- activity_id (UUID, FK, Cascade Delete)
- author_name (String, Required, Max 100)
- author_role (String, Optional, Max 100)
- author_avatar_url (String, Optional)
- content (Text, Required)
- display_order (Integer, Default 0)
- created_at (Timestamp)

**activity_relations** (Many-to-Many self-join)
- id (UUID, PK)
- activity_id (UUID, FK, Cascade Delete)
- related_activity_id (UUID, FK, Cascade Delete)
- relation_type (String, Default 'related')
- Constraint: Cannot self-reference, unique pairs

### 2.2 Indexes Required
- activities: status, category, is_published, activity_date, slug
- All child tables: activity_id, (activity_id + display_order) composite

---

## 3. File Storage Requirements

**Storage Container 1: activity-images**
- Max file size: 10MB
- Formats: JPG, PNG, WEBP
- Public read, authenticated write
- Path: `/{activity_id}/{filename}`

**Storage Container 2: testimonial-avatars**
- Max file size: 2MB
- Formats: JPG, PNG, WEBP
- Public read, authenticated write
- Path: `/{testimonial_id}/{filename}`

---

## 4. Access Control Requirements

### 4.1 User Roles
- **Admin**: Full CRUD, publish/unpublish, delete
- **Moderator**: Create/edit own activities, cannot publish or delete
- **User (Public)**: Read-only access to published activities

### 4.2 Data Access Rules
- SELECT: Public sees published only; Admins/Moderators see all
- INSERT: Admins only
- UPDATE: Admins and Moderators
- DELETE: Admins only
- Child tables inherit parent activity permissions

---

## 5. API Endpoints Specification

### 5.1 GET /api/activities (Public)
**Query Params**: page, limit, status, category, search, sort  
**Response**: Array of activities with pagination metadata

### 5.2 GET /api/activities/:slug (Public)
**Response**: Complete activity with all nested data (metrics, stats, gallery, testimonials, related)

### 5.3 POST /api/activities (Protected - Admin)
**Request Body**: Complete activity object with nested arrays  
**Response**: Created activity with generated ID and slug

### 5.4 PUT /api/activities/:id (Protected - Admin/Moderator)
**Request Body**: Partial or full update  
**Response**: Updated activity

### 5.5 DELETE /api/activities/:id (Protected - Admin)
**Response**: Success confirmation

### 5.6 POST /api/upload (Protected - Admin/Moderator)
**Request**: Multipart form data with file and metadata  
**Response**: Public URL of uploaded file

### 5.7 GET /api/admin/stats (Protected - Admin/Moderator)
**Response**: Dashboard statistics (counts by status, category, recent updates)

---

## 6. Admin Panel Feature Requirements

### 6.1 Dashboard
- Total activities count
- Status breakdown (pie chart)
- Category breakdown (bar chart)
- Recent activity feed
- Quick action buttons

### 6.2 Activities List
- Table/Grid view toggle
- Columns: thumbnail, title, status badge, category, progress bar, published status, dates, actions
- Search: Full-text on title/description
- Filters: Status, category, published status, date range
- Sorting: Title, date, progress
- Pagination: 12/24/50/100 per page
- Bulk actions: Publish/unpublish, delete, export

### 6.3 Create/Edit Form Sections
1. **Basic Info**: Title, slug, status, category, date, progress, impact
2. **Content**: Description, vision (rich text editors)
3. **Hero Image**: Upload with preview, alt text
4. **Metrics**: Dynamic list (key-value pairs, reorderable)
5. **Impact Stats**: Dynamic list (label, value, icon, reorderable)
6. **Gallery**: Multi-upload, captions, alt text, reorderable
7. **Testimonials**: Dynamic list (name, role, avatar, content, reorderable)
8. **Related Activities**: Multi-select dropdown (max 5)
9. **SEO**: Meta title, meta description
10. **Actions**: Save draft, publish, preview, cancel

**Validation**: All required fields, character limits, progress 0-100, unique slug

### 6.4 Bulk Import/Export
- Import: CSV/JSON upload with column mapping, validation preview
- Export: Format selector (CSV/JSON/Excel), field selector, filters

---

## 7. Frontend Integration Requirements

### 7.1 API Client
- Centralized request handling
- Auth token management
- Error handling
- Loading states
- Retry logic

### 7.2 Components to Update
- `Index.tsx`: Replace static data with API fetch
- `ActivityDetail.tsx`: Fetch by slug from API
- Add loading skeletons
- Add error boundaries
- Handle empty states

---

## 8. Data Migration Plan

1. Upload all hero images to storage
2. Insert 100 activities into database
3. Insert all metrics, stats, gallery images, testimonials
4. Create activity relations
5. Verify counts and spot-check data
6. Test API endpoints
7. Update frontend
8. Remove static data files

**Validation Checklist**: 100 activities, all images accessible, all relationships intact, frontend displays correctly

---

## 9. Implementation Timeline (5 Weeks)

- **Week 1**: Database schema + API endpoints
- **Week 2**: Admin panel core (dashboard, list, basic form)
- **Week 3**: Admin panel advanced (dynamic fields, uploads)
- **Week 4**: Frontend migration + integration
- **Week 5**: Data migration + testing + deployment

---

## 10. Success Criteria

✅ All CRUD operations working  
✅ 100 activities migrated without data loss  
✅ Role-based access enforced  
✅ Images upload and display correctly  
✅ API response time <500ms  
✅ Frontend loads <3s  
✅ SEO meta tags working  
✅ Mobile responsive

---

This PRD is tech-stack agnostic and can be implemented in any backend (Node.js, Python, Java, .NET) and frontend framework (React, Angular, Vue).
