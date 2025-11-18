# Page Builder Blueprint
## JKKN Dental College - Complete Design Document

**Version:** 1.0
**Date:** November 18, 2025
**Author:** Design Team
**Status:** Approved for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Database Schema](#2-database-schema)
3. [Type Definitions](#3-type-definitions)
4. [Component Architecture](#4-component-architecture)
5. [User Interface & Workflows](#5-user-interface--workflows)
6. [Service Layer](#6-service-layer)
7. [Routing & Rendering](#7-routing--rendering)
8. [Permissions & Security](#8-permissions--security)
9. [Admin Panel Integration](#9-admin-panel-integration)
10. [Dependencies](#10-dependencies)
11. [Implementation Checklist](#11-implementation-checklist)
12. [Success Criteria](#12-success-criteria)

---

## 1. Executive Summary

### 1.1 Overview

A full-featured page builder that allows administrators to create custom pages using reusable blocks with drag-and-drop functionality, full design customization, auto-save, and automatic navigation integration.

### 1.2 Key Features

- ✅ Drag-and-drop block reordering
- ✅ 20+ block types (content, media, layout, data)
- ✅ Full design customization per block
- ✅ Auto-save drafts every 30 seconds
- ✅ Draft/Published workflow with preview
- ✅ Automatic navigation menu integration
- ✅ Dynamic routing for `/[slug]` pages
- ✅ Integrated media library
- ✅ Role-based permissions (RBAC)
- ✅ SEO metadata management

### 1.3 Technology Stack

| Component | Technology |
|-----------|------------|
| Drag-and-drop | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities |
| Rich text editor | @tiptap/react, @tiptap/starter-kit |
| Color picker | react-colorful |
| Database | PostgreSQL (Supabase) with JSONB |
| State management | React hooks + Server Actions |
| Routing | Next.js 15 App Router |
| UI Components | Radix UI + Shadcn/ui |
| Forms | React Hook Form + Zod |

### 1.4 User Roles & Capabilities

| Role | View Pages | Create | Edit | Delete | Publish |
|------|-----------|--------|------|--------|---------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Content Editor | ✅ | ✅ | ✅ | ❌ | ✅ |
| Content Viewer | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 2. Database Schema

### 2.1 Pages Table

```sql
CREATE TABLE pages (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',

  -- Content (JSONB arrays of block objects)
  blocks JSONB NOT NULL DEFAULT '[]',
  published_blocks JSONB,

  -- SEO
  seo_metadata JSONB,

  -- Auto-save tracking
  last_saved_at TIMESTAMPTZ DEFAULT NOW(),
  last_auto_saved_at TIMESTAMPTZ,

  -- Publishing
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES profiles(id),

  -- Navigation integration
  auto_added_to_nav BOOLEAN DEFAULT false,
  navigation_item_id UUID REFERENCES navigation_items(id),

  -- Audit
  created_by UUID REFERENCES profiles(id) NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Indexes for performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_published_at ON pages(published_at DESC);
CREATE INDEX idx_pages_created_by ON pages(created_by);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_pages_updated_at();
```

### 2.2 SEO Metadata Structure

```json
{
  "title": "Custom page title for SEO",
  "description": "Meta description for search engines",
  "og_image": "https://example.com/image.jpg",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

### 2.3 Block Structure in JSONB

```json
{
  "id": "blk_hero_1",
  "type": "hero",
  "order": 0,
  "visibility": "visible",
  "config": {
    "title": "Welcome to JKKN",
    "subtitle": "Excellence in Education",
    "backgroundType": "gradient",
    "gradient": {
      "start": "#0b6d41",
      "end": "#1a5f4a"
    },
    "ctaButtons": [
      {
        "label": "Learn More",
        "href": "/about",
        "variant": "primary"
      }
    ],
    "overlay": true,
    "overlayOpacity": 50
  },
  "styles": {
    "padding": "80px 20px",
    "textColor": "#ffffff",
    "textAlign": "center"
  }
}
```

### 2.4 RLS Policies

```sql
-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Super admins: Full access
CREATE POLICY "Super admins full access"
ON pages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role_type = 'super_admin'
    AND status = 'active'
  )
);

-- Custom roles: View pages with permission
CREATE POLICY "Custom roles view pages"
ON pages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND p.status = 'active'
    AND (r.permissions->'pages'->>'view')::boolean = true
  )
);

-- Custom roles: Create pages with permission
CREATE POLICY "Custom roles create pages"
ON pages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND p.status = 'active'
    AND (r.permissions->'pages'->>'create')::boolean = true
  )
);

-- Custom roles: Update pages with permission
CREATE POLICY "Custom roles update pages"
ON pages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND p.status = 'active'
    AND (r.permissions->'pages'->>'update')::boolean = true
  )
);

-- Custom roles: Delete pages with permission
CREATE POLICY "Custom roles delete pages"
ON pages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND p.status = 'active'
    AND (r.permissions->'pages'->>'delete')::boolean = true
  )
);

-- Public: View published pages only
CREATE POLICY "Public can view published pages"
ON pages
FOR SELECT
USING (status = 'published');
```

---

## 3. Type Definitions

### 3.1 Block Types Enumeration

```typescript
// types/page-builder.ts

export type BlockType =
  // Content blocks
  | 'hero'
  | 'heading'
  | 'paragraph'
  | 'rich_text'
  | 'quote'
  | 'cta'
  // Media blocks
  | 'image'
  | 'gallery'
  | 'video'
  | 'carousel'
  // Layout blocks
  | 'two_column'
  | 'three_column'
  | 'card_grid'
  | 'accordion'
  | 'tabs'
  // Data blocks
  | 'table'
  | 'statistics'
  | 'timeline'
  | 'contact_form'
  | 'embed';
```

### 3.2 Base Block Interface

```typescript
export interface BaseBlockConfig {
  id: string;
  type: BlockType;
  order: number;
  visibility: 'visible' | 'hidden';
}

export interface CustomStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  // Add any other CSS properties as needed
}
```

### 3.3 Content Block Types

```typescript
// Hero Block
export interface HeroBlockConfig extends BaseBlockConfig {
  type: 'hero';
  config: {
    title: string;
    subtitle?: string;
    backgroundType: 'image' | 'video' | 'gradient';
    backgroundImage?: string;
    backgroundVideo?: string;
    gradient?: {
      start: string;
      end: string;
    };
    ctaButtons?: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
    overlay?: boolean;
    overlayOpacity?: number; // 0-100
  };
  styles?: CustomStyles;
}

// Heading Block
export interface HeadingBlockConfig extends BaseBlockConfig {
  type: 'heading';
  config: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6; // h1-h6
  };
  styles?: CustomStyles;
}

// Paragraph Block
export interface ParagraphBlockConfig extends BaseBlockConfig {
  type: 'paragraph';
  config: {
    content: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  };
  styles?: CustomStyles;
}

// Rich Text Block
export interface RichTextBlockConfig extends BaseBlockConfig {
  type: 'rich_text';
  config: {
    html: string; // Rich HTML content from TipTap
  };
  styles?: CustomStyles;
}

// Quote Block
export interface QuoteBlockConfig extends BaseBlockConfig {
  type: 'quote';
  config: {
    quote: string;
    author?: string;
    role?: string;
  };
  styles?: CustomStyles;
}

// CTA Block
export interface CTABlockConfig extends BaseBlockConfig {
  type: 'cta';
  config: {
    heading: string;
    description?: string;
    buttons: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
  };
  styles?: CustomStyles;
}
```

### 3.4 Media Block Types

```typescript
// Image Block
export interface ImageBlockConfig extends BaseBlockConfig {
  type: 'image';
  config: {
    src: string;
    alt: string;
    caption?: string;
    aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
    objectFit?: 'cover' | 'contain' | 'fill';
  };
  styles?: CustomStyles;
}

// Gallery Block
export interface GalleryBlockConfig extends BaseBlockConfig {
  type: 'gallery';
  config: {
    images: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    columns: 2 | 3 | 4;
    gap?: number; // pixels
    lightbox?: boolean; // Open in lightbox on click
  };
  styles?: CustomStyles;
}

// Video Block
export interface VideoBlockConfig extends BaseBlockConfig {
  type: 'video';
  config: {
    videoType: 'youtube' | 'vimeo' | 'upload';
    videoUrl?: string; // For YouTube/Vimeo
    videoFile?: string; // For uploaded videos
    thumbnail?: string;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
  };
  styles?: CustomStyles;
}

// Carousel Block
export interface CarouselBlockConfig extends BaseBlockConfig {
  type: 'carousel';
  config: {
    slides: Array<{
      image: string;
      title?: string;
      description?: string;
      link?: string;
    }>;
    autoplay?: boolean;
    interval?: number; // milliseconds
    showArrows?: boolean;
    showDots?: boolean;
  };
  styles?: CustomStyles;
}
```

### 3.5 Layout Block Types

```typescript
// Two Column Block
export interface TwoColumnBlockConfig extends BaseBlockConfig {
  type: 'two_column';
  config: {
    leftColumn: PageBlock[]; // Nested blocks
    rightColumn: PageBlock[];
    ratio?: '50/50' | '60/40' | '40/60' | '70/30' | '30/70';
    gap?: number;
    verticalAlign?: 'top' | 'center' | 'bottom';
    stackOnMobile?: boolean;
  };
  styles?: CustomStyles;
}

// Three Column Block
export interface ThreeColumnBlockConfig extends BaseBlockConfig {
  type: 'three_column';
  config: {
    leftColumn: PageBlock[];
    centerColumn: PageBlock[];
    rightColumn: PageBlock[];
    gap?: number;
    verticalAlign?: 'top' | 'center' | 'bottom';
    stackOnMobile?: boolean;
  };
  styles?: CustomStyles;
}

// Card Grid Block
export interface CardGridBlockConfig extends BaseBlockConfig {
  type: 'card_grid';
  config: {
    cards: Array<{
      title: string;
      description: string;
      image?: string;
      link?: string;
      icon?: string;
    }>;
    columns: 2 | 3 | 4;
    cardStyle?: 'flat' | 'elevated' | 'outlined';
  };
  styles?: CustomStyles;
}

// Accordion Block
export interface AccordionBlockConfig extends BaseBlockConfig {
  type: 'accordion';
  config: {
    items: Array<{
      title: string;
      content: string;
    }>;
    allowMultiple?: boolean; // Allow multiple items open
  };
  styles?: CustomStyles;
}

// Tabs Block
export interface TabsBlockConfig extends BaseBlockConfig {
  type: 'tabs';
  config: {
    tabs: Array<{
      label: string;
      content: PageBlock[]; // Nested blocks
    }>;
    defaultTab?: number; // Index of default open tab
  };
  styles?: CustomStyles;
}
```

### 3.6 Data Block Types

```typescript
// Table Block
export interface TableBlockConfig extends BaseBlockConfig {
  type: 'table';
  config: {
    headers: string[];
    rows: string[][];
    striped?: boolean;
    bordered?: boolean;
  };
  styles?: CustomStyles;
}

// Statistics Block
export interface StatisticsBlockConfig extends BaseBlockConfig {
  type: 'statistics';
  config: {
    stats: Array<{
      label: string;
      value: string | number;
      suffix?: string;
      icon?: string;
    }>;
    layout: 'horizontal' | 'grid';
    columns?: 2 | 3 | 4;
  };
  styles?: CustomStyles;
}

// Timeline Block
export interface TimelineBlockConfig extends BaseBlockConfig {
  type: 'timeline';
  config: {
    events: Array<{
      date: string;
      title: string;
      description: string;
    }>;
    orientation?: 'vertical' | 'horizontal';
  };
  styles?: CustomStyles;
}

// Contact Form Block
export interface ContactFormBlockConfig extends BaseBlockConfig {
  type: 'contact_form';
  config: {
    title?: string;
    description?: string;
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'tel' | 'textarea';
      required: boolean;
      placeholder?: string;
    }>;
    submitButtonText?: string;
  };
  styles?: CustomStyles;
}

// Embed Block
export interface EmbedBlockConfig extends BaseBlockConfig {
  type: 'embed';
  config: {
    embedType: 'iframe' | 'script';
    embedCode: string;
    aspectRatio?: '16/9' | '4/3' | '1/1';
  };
  styles?: CustomStyles;
}
```

### 3.7 Union Type & Page Interface

```typescript
// Union type for all blocks
export type PageBlock =
  // Content blocks
  | HeroBlockConfig
  | HeadingBlockConfig
  | ParagraphBlockConfig
  | RichTextBlockConfig
  | QuoteBlockConfig
  | CTABlockConfig
  // Media blocks
  | ImageBlockConfig
  | GalleryBlockConfig
  | VideoBlockConfig
  | CarouselBlockConfig
  // Layout blocks
  | TwoColumnBlockConfig
  | ThreeColumnBlockConfig
  | CardGridBlockConfig
  | AccordionBlockConfig
  | TabsBlockConfig
  // Data blocks
  | TableBlockConfig
  | StatisticsBlockConfig
  | TimelineBlockConfig
  | ContactFormBlockConfig
  | EmbedBlockConfig;

// Page interface
export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  blocks: PageBlock[];
  published_blocks?: PageBlock[];
  seo_metadata?: {
    title?: string;
    description?: string;
    og_image?: string;
    keywords?: string[];
  };
  last_saved_at: string;
  last_auto_saved_at?: string;
  published_at?: string;
  published_by?: string;
  auto_added_to_nav: boolean;
  navigation_item_id?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  version: number;
}
```

---

## 4. Component Architecture

### 4.1 Directory Structure

```
components/page-builder/
├── PageBuilderEditor.tsx           # Main editor container
├── BlockRenderer.tsx                # Public site block renderer
├── BlockEditor.tsx                  # Editable block wrapper
├── BlockToolbar.tsx                 # Block actions toolbar
├── BlockSidebar.tsx                 # Block settings panel
├── BlockPalette.tsx                 # Add block menu
├── DragDropContext.tsx              # Drag-and-drop provider
├── AutoSave.tsx                     # Auto-save component
│
├── blocks/                          # Block components (view mode)
│   ├── content/
│   │   ├── HeroBlock.tsx
│   │   ├── HeadingBlock.tsx
│   │   ├── ParagraphBlock.tsx
│   │   ├── RichTextBlock.tsx
│   │   ├── QuoteBlock.tsx
│   │   └── CTABlock.tsx
│   ├── media/
│   │   ├── ImageBlock.tsx
│   │   ├── GalleryBlock.tsx
│   │   ├── VideoBlock.tsx
│   │   └── CarouselBlock.tsx
│   ├── layout/
│   │   ├── TwoColumnBlock.tsx
│   │   ├── ThreeColumnBlock.tsx
│   │   ├── CardGridBlock.tsx
│   │   ├── AccordionBlock.tsx
│   │   └── TabsBlock.tsx
│   └── data/
│       ├── TableBlock.tsx
│       ├── StatisticsBlock.tsx
│       ├── TimelineBlock.tsx
│       ├── ContactFormBlock.tsx
│       └── EmbedBlock.tsx
│
└── editors/                         # Block config editors (edit mode)
    ├── HeroBlockEditor.tsx
    ├── HeadingBlockEditor.tsx
    ├── ParagraphBlockEditor.tsx
    ├── RichTextBlockEditor.tsx
    ├── QuoteBlockEditor.tsx
    ├── CTABlockEditor.tsx
    ├── ImageBlockEditor.tsx
    ├── GalleryBlockEditor.tsx
    ├── VideoBlockEditor.tsx
    ├── CarouselBlockEditor.tsx
    ├── TwoColumnBlockEditor.tsx
    ├── ThreeColumnBlockEditor.tsx
    ├── CardGridBlockEditor.tsx
    ├── AccordionBlockEditor.tsx
    ├── TabsBlockEditor.tsx
    ├── TableBlockEditor.tsx
    ├── StatisticsBlockEditor.tsx
    ├── TimelineBlockEditor.tsx
    ├── ContactFormBlockEditor.tsx
    └── EmbedBlockEditor.tsx
```

### 4.2 Component Patterns

#### Pattern 1: Block Components (View Mode)

Each block component receives configuration and renders for the public site.

```typescript
// components/page-builder/blocks/content/HeroBlock.tsx

interface HeroBlockProps {
  config: HeroBlockConfig['config'];
  style?: React.CSSProperties;
}

export function HeroBlock({ config, style }: HeroBlockProps) {
  return (
    <section style={style}>
      {/* Render hero content */}
    </section>
  );
}
```

#### Pattern 2: Block Editors (Edit Mode)

Each block editor provides a form to configure the block.

```typescript
// components/page-builder/editors/HeroBlockEditor.tsx

interface HeroBlockEditorProps {
  config: HeroBlockConfig['config'];
  onChange: (config: HeroBlockConfig['config']) => void;
}

export function HeroBlockEditor({ config, onChange }: HeroBlockEditorProps) {
  return (
    <form>
      {/* Form fields for hero configuration */}
    </form>
  );
}
```

#### Pattern 3: Block Wrapper (Admin)

Wraps blocks in the editor with toolbar and drag handle.

```typescript
// components/page-builder/BlockEditor.tsx

interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (block: PageBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: React.ReactNode;
}

export function BlockEditor({ block, onUpdate, onDelete, onDuplicate, children }: BlockEditorProps) {
  return (
    <div className="relative group">
      {/* Drag handle */}
      <div className="drag-handle">⋮⋮</div>

      {/* Block toolbar */}
      <BlockToolbar
        onEdit={() => {/* open sidebar */}}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />

      {/* Actual block content */}
      {children}
    </div>
  );
}
```

### 4.3 Main Editor Components

#### PageBuilderEditor.tsx

```typescript
'use client';

interface PageBuilderEditorProps {
  pageId: string;
  initialBlocks: PageBlock[];
  pageTitle: string;
  pageStatus: 'draft' | 'published' | 'archived';
}

export function PageBuilderEditor({
  pageId,
  initialBlocks,
  pageTitle,
  pageStatus
}: PageBuilderEditorProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      {/* Left: Block Palette */}
      <BlockPalette onAddBlock={handleAddBlock} />

      {/* Center: Canvas */}
      <div className="flex-1 overflow-y-auto">
        <DragDropContext blocks={blocks} onReorder={setBlocks}>
          {blocks.map(block => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onDuplicate={handleDuplicateBlock}
            >
              {/* Render appropriate block component */}
            </BlockEditor>
          ))}
        </DragDropContext>
      </div>

      {/* Right: Block Settings */}
      {selectedBlockId && (
        <BlockSidebar
          block={blocks.find(b => b.id === selectedBlockId)!}
          onChange={handleUpdateBlock}
        />
      )}

      {/* Auto-save component */}
      <AutoSave pageId={pageId} blocks={blocks} />
    </div>
  );
}
```

#### BlockRenderer.tsx

```typescript
// components/page-builder/BlockRenderer.tsx

interface BlockRendererProps {
  blocks: PageBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  const sortedBlocks = [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter(block => block.visibility === 'visible');

  return (
    <>
      {sortedBlocks.map(block => {
        const style: React.CSSProperties = block.styles || {};

        switch (block.type) {
          case 'hero':
            return <HeroBlock key={block.id} config={block.config} style={style} />;
          case 'heading':
            return <HeadingBlock key={block.id} config={block.config} style={style} />;
          case 'paragraph':
            return <ParagraphBlock key={block.id} config={block.config} style={style} />;
          case 'image':
            return <ImageBlock key={block.id} config={block.config} style={style} />;
          // ... all other block types
          default:
            console.warn(`Unknown block type: ${(block as any).type}`);
            return null;
        }
      })}
    </>
  );
}
```

---

## 5. User Interface & Workflows

### 5.1 Page Builder Editor Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Header Bar                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ [Title Input]  [Draft Badge]  [Save] [Preview] [Publish]        │   │
│  │ Auto-saved at 2:34 PM                                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
├──────────────┬───────────────────────────────────────┬──────────────────┤
│              │                                       │                  │
│  Block       │     Canvas (Live Preview)             │  Block Settings  │
│  Palette     │                                       │  Panel           │
│              │                                       │                  │
│  [Search]    │  ┌──────────────────────────────────┐ │  Selected:       │
│              │  │ ⋮⋮ Hero Block                    │ │  Hero Block      │
│  Content ▼   │  │    [Edit] [⋮ More] [×]           │ │                  │
│  ├─ [+ Hero] │  │                                  │ │  Title:          │
│  ├─ [+ Head] │  │    Welcome to JKKN               │ │  [___________]   │
│  ├─ [+ Text] │  │    Excellence in Education       │ │                  │
│  ├─ [+ Rich] │  │                                  │ │  Background:     │
│  ├─ [+ Quote]│  │    [Learn More Button]           │ │  ○ Image         │
│  └─ [+ CTA]  │  │                                  │ │  ○ Video         │
│              │  └──────────────────────────────────┘ │  ● Gradient      │
│  Media ▼     │                                       │                  │
│  ├─ [+ Image]│  ┌──────────────────────────────────┐ │  Gradient Start: │
│  ├─ [+ Gall] │  │ ⋮⋮ Image Block                   │ │  [#0b6d41]  ⬛   │
│  ├─ [+ Video]│  │    [Edit] [⋮ More] [×]           │ │                  │
│  └─ [+ Caro] │  │                                  │ │  Gradient End:   │
│              │  │    [Image Preview]               │ │  [#1a5f4a]  ⬛   │
│  Layout ▼    │  │                                  │ │                  │
│  ├─ [+ 2Col] │  └──────────────────────────────────┘ │  CTA Buttons:    │
│  ├─ [+ 3Col] │                                       │  [+ Add Button]  │
│  ├─ [+ Cards]│  ┌──────────────────────────────────┐ │                  │
│  ├─ [+ Accor]│  │ ⋮⋮ Paragraph Block               │ │  Overlay:        │
│  └─ [+ Tabs] │  │    [Edit] [⋮ More] [×]           │ │  ☑ Enable        │
│              │  │                                  │ │                  │
│  Data ▼      │  │    Lorem ipsum dolor sit amet... │ │  Opacity:        │
│  ├─ [+ Table]│  │                                  │ │  [====●====] 50% │
│  ├─ [+ Stats]│  └──────────────────────────────────┘ │                  │
│  ├─ [+ Time] │                                       │  ──────────────  │
│  ├─ [+ Form] │  [+ Add Block]                        │                  │
│  └─ [+ Embed]│                                       │  Custom Styles:  │
│              │                                       │  [Advanced ▼]    │
│              │                                       │                  │
│ (Collapsible)│                     (Scrollable)      │  (Scrollable)    │
└──────────────┴───────────────────────────────────────┴──────────────────┘
```

### 5.2 User Workflows

#### Workflow 1: Create New Page

```
Step 1: Navigate to /admin/pages
        ↓
Step 2: Click "Create Page" button
        ↓
Step 3: Modal appears with form:
        ┌─────────────────────────────────┐
        │  Create New Page                │
        │                                 │
        │  Page Title: *                  │
        │  [_________________________]    │
        │                                 │
        │  Slug: *                        │
        │  [_________________________]    │
        │  (auto-generated from title)    │
        │                                 │
        │  Description:                   │
        │  [_________________________]    │
        │  [_________________________]    │
        │                                 │
        │  [Cancel]      [Create Page]    │
        └─────────────────────────────────┘
        ↓
Step 4: Click "Create Page"
        ↓
Step 5: Redirect to /admin/pages/[id]/edit
        Opens page builder with empty canvas
```

#### Workflow 2: Build Page Content

```
Step 1: Click block type from left palette
        Example: Click "[+ Hero]"
        ↓
Step 2: Hero block added to canvas bottom
        Block appears with default configuration
        ↓
Step 3: Click on block in canvas
        Block selected (blue outline)
        Settings panel opens on right
        ↓
Step 4: Edit configuration in settings panel
        - Enter title
        - Choose background type
        - Select colors
        - Add CTA buttons
        ↓
Step 5: Changes reflect in real-time on canvas
        Live preview updates instantly
        ↓
Step 6: Drag block by handle (⋮⋮) to reorder
        Visual feedback during drag
        Drop to new position
        ↓
Step 7: Add more blocks, repeat steps 1-6
        ↓
Step 8: Click "Save" to manually save draft
        Toast: "Draft saved successfully"
        ↓
Step 9: Auto-save runs every 30 seconds
        Indicator: "Saving..." → "Saved at [time]"
```

#### Workflow 3: Customize Block Styles

```
Step 1: Select block in canvas
        ↓
Step 2: Settings panel shows block config
        ↓
Step 3: Scroll to "Custom Styles" section
        Click "Advanced ▼" to expand
        ↓
Step 4: Style customization options:
        ┌────────────────────────────────┐
        │ Custom Styles                  │
        │                                │
        │ Background Color:              │
        │ [#ffffff] ⬛ [Color Picker]     │
        │                                │
        │ Text Color:                    │
        │ [#000000] ⬛ [Color Picker]     │
        │                                │
        │ Padding:                       │
        │ [80px 20px______________]      │
        │                                │
        │ Text Align:                    │
        │ ○ Left  ● Center  ○ Right      │
        │                                │
        │ Font Size:                     │
        │ [16px___________________]      │
        │                                │
        │ [More Options ▼]               │
        └────────────────────────────────┘
        ↓
Step 5: Apply changes
        Live preview updates immediately
```

#### Workflow 4: Preview Draft

```
Step 1: Click "Preview" button in header
        ↓
Step 2: New tab opens: /admin/pages/[id]/preview
        ↓
Step 3: Preview page shows:
        ┌────────────────────────────────────────┐
        │ ⚠ Preview Mode - Not public            │
        └────────────────────────────────────────┘

        [Rendered page with current draft blocks]

        ↓
Step 4: Review page appearance
        Check responsiveness (resize browser)
        ↓
Step 5: Close tab to return to editor
        Make adjustments if needed
```

#### Workflow 5: Publish Page

```
Step 1: Click "Publish" button in header
        ↓
Step 2: Publish modal appears:
        ┌─────────────────────────────────────────────┐
        │  Publish Page                                │
        │                                              │
        │  Publishing: "About Our Campus"              │
        │                                              │
        │  This page will be available at:             │
        │  https://jkkn.ac.in/about-our-campus         │
        │                                              │
        │  ☑ Add to navigation menu                    │
        │                                              │
        │  Parent Menu:                                │
        │  [Select...      ▼]                          │
        │  ├─ None (Top level)                         │
        │  ├─ About                                    │
        │  ├─ Admissions                               │
        │  └─ Academics                                │
        │                                              │
        │  Menu Label:                                 │
        │  [About Our Campus_________________]         │
        │                                              │
        │  Position:                                   │
        │  ○ First                                     │
        │  ● After "About JKKN"                        │
        │  ○ Last                                      │
        │                                              │
        │  [Cancel]              [Publish Page]        │
        └─────────────────────────────────────────────┘
        ↓
Step 3: Configure navigation settings
        - Check "Add to navigation" if desired
        - Select parent menu (or none for top level)
        - Enter menu label
        - Choose position
        ↓
Step 4: Click "Publish Page"
        ↓
Step 5: Backend processing:
        ├─ Copy blocks → published_blocks
        ├─ Set status = 'published'
        ├─ Set published_at = NOW()
        ├─ Create navigation_items entry
        ├─ Update navigation_item_id
        └─ Revalidate cache
        ↓
Step 6: Success!
        Toast: "Page published successfully"
        Redirect to /admin/pages
        ↓
Step 7: Page now accessible at /about-our-campus
        Appears in navigation menu
```

#### Workflow 6: Edit Published Page

```
Step 1: In /admin/pages list, click "Edit" on page
        ↓
Step 2: Page builder opens with published content
        ↓
Step 3: Make changes to blocks
        Changes saved to 'blocks' column (draft)
        'published_blocks' remain unchanged
        ↓
Step 4: Click "Preview" to see draft changes
        Public site still shows old version
        ↓
Step 5: Click "Publish" to go live
        Draft blocks → published_blocks
        Public site updates
```

#### Workflow 7: Unpublish Page

```
Step 1: In /admin/pages list, click "⋮ More" on page
        ↓
Step 2: Select "Unpublish"
        ↓
Step 3: Confirmation dialog:
        "Are you sure? Page will no longer be public."
        ↓
Step 4: Click "Unpublish"
        ↓
Step 5: Backend processing:
        ├─ Set status = 'draft'
        ├─ Remove from navigation (optional)
        └─ Page no longer accessible at /[slug]
        ↓
Step 6: Success!
        Toast: "Page unpublished"
        Page status changed to "Draft"
```

---

## 6. Service Layer

### 6.1 PageBuilderService Class

```typescript
// lib/services/page-builder-service.ts

import { createClient } from '@/lib/supabase/server';
import type { Page, PageBlock } from '@/types/page-builder';

export class PageBuilderService {

  /**
   * Create a new page
   */
  async createPage(data: {
    title: string;
    slug: string;
    description?: string;
    created_by: string;
  }): Promise<Page> {
    const supabase = createClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (existing) {
      throw new Error('Slug already exists');
    }

    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        status: 'draft',
        blocks: [],
        created_by: data.created_by,
        updated_by: data.created_by,
      })
      .select()
      .single();

    if (error) throw error;
    return page;
  }

  /**
   * Auto-save blocks to draft
   */
  async autoSaveBlocks(
    pageId: string,
    blocks: PageBlock[],
    userId: string
  ): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('pages')
      .update({
        blocks,
        last_auto_saved_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('id', pageId);

    if (error) throw error;
  }

  /**
   * Manual save draft
   */
  async saveDraft(pageId: string, data: {
    title?: string;
    slug?: string;
    description?: string;
    blocks: PageBlock[];
    seo_metadata?: Page['seo_metadata'];
    userId: string;
  }): Promise<Page> {
    const supabase = createClient();

    // Validate blocks
    this.validateBlocks(data.blocks);

    const updateData: any = {
      blocks: data.blocks,
      last_saved_at: new Date().toISOString(),
      updated_by: data.userId,
      updated_at: new Date().toISOString(),
    };

    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.seo_metadata) updateData.seo_metadata = data.seo_metadata;

    const { data: page, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;
    return page;
  }

  /**
   * Publish page
   */
  async publishPage(pageId: string, data: {
    userId: string;
    addToNavigation: boolean;
    navigationConfig?: {
      parentId?: string;
      label: string;
      position: 'first' | 'after' | 'last';
      afterItemId?: string;
    };
  }): Promise<Page> {
    const supabase = createClient();

    // Get current page
    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (!page) throw new Error('Page not found');

    // Validate blocks before publishing
    this.validateBlocks(page.blocks);

    // Update page status
    const { data: publishedPage, error: pageError } = await supabase
      .from('pages')
      .update({
        status: 'published',
        published_blocks: page.blocks,
        published_at: new Date().toISOString(),
        published_by: data.userId,
        updated_by: data.userId,
        version: page.version + 1,
      })
      .eq('id', pageId)
      .select()
      .single();

    if (pageError) throw pageError;

    // Add to navigation if requested
    if (data.addToNavigation && data.navigationConfig) {
      const navItemId = await this.addToNavigation(
        pageId,
        publishedPage.slug,
        data.navigationConfig
      );

      // Update page with navigation reference
      await supabase
        .from('pages')
        .update({
          auto_added_to_nav: true,
          navigation_item_id: navItemId,
        })
        .eq('id', pageId);
    }

    return publishedPage;
  }

  /**
   * Unpublish page (revert to draft)
   */
  async unpublishPage(pageId: string, userId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('pages')
      .update({
        status: 'draft',
        updated_by: userId,
      })
      .eq('id', pageId);

    if (error) throw error;
  }

  /**
   * Archive page
   */
  async archivePage(pageId: string, userId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('pages')
      .update({
        status: 'archived',
        updated_by: userId,
      })
      .eq('id', pageId);

    if (error) throw error;
  }

  /**
   * Delete page permanently
   */
  async deletePage(pageId: string): Promise<void> {
    const supabase = createClient();

    // Get page to check navigation
    const { data: page } = await supabase
      .from('pages')
      .select('navigation_item_id')
      .eq('id', pageId)
      .single();

    // Delete navigation item if exists
    if (page?.navigation_item_id) {
      await supabase
        .from('navigation_items')
        .delete()
        .eq('id', page.navigation_item_id);
    }

    // Delete page
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;
  }

  /**
   * Get page by ID (for admin editing)
   */
  async getPageById(pageId: string): Promise<Page | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Get page by slug (for public rendering)
   */
  async getPageBySlug(slug: string): Promise<Page | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) return null;
    return data;
  }

  /**
   * List all pages with optional filters
   */
  async listPages(filters?: {
    status?: 'draft' | 'published' | 'archived';
    search?: string;
  }): Promise<Page[]> {
    const supabase = createClient();

    let query = supabase
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Add page to navigation menu
   * @private
   */
  private async addToNavigation(
    pageId: string,
    slug: string,
    config: {
      parentId?: string;
      label: string;
      position: 'first' | 'after' | 'last';
      afterItemId?: string;
    }
  ): Promise<string> {
    const supabase = createClient();

    // Calculate display order
    let displayOrder = 0;

    if (config.position === 'first') {
      // Get minimum order and subtract 1
      const { data: firstItem } = await supabase
        .from('navigation_items')
        .select('display_order')
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      displayOrder = (firstItem?.display_order || 0) - 1;

    } else if (config.position === 'after' && config.afterItemId) {
      // Get order of specified item and add 1
      const { data: afterItem } = await supabase
        .from('navigation_items')
        .select('display_order')
        .eq('id', config.afterItemId)
        .single();

      displayOrder = (afterItem?.display_order || 0) + 1;

    } else {
      // Last position: get maximum order and add 1
      const { data: lastItem } = await supabase
        .from('navigation_items')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      displayOrder = (lastItem?.display_order || 0) + 1;
    }

    // Create navigation item
    const { data: navItem, error } = await supabase
      .from('navigation_items')
      .insert({
        label: config.label,
        href: `/${slug}`,
        parent_id: config.parentId || null,
        display_order: displayOrder,
        icon: 'FileText',
      })
      .select('id')
      .single();

    if (error) throw error;

    return navItem.id;
  }

  /**
   * Validate blocks structure
   * @private
   */
  private validateBlocks(blocks: PageBlock[]): void {
    if (!Array.isArray(blocks)) {
      throw new Error('Blocks must be an array');
    }

    blocks.forEach((block, index) => {
      if (!block.id) {
        throw new Error(`Block at index ${index} missing id`);
      }

      if (!block.type) {
        throw new Error(`Block at index ${index} missing type`);
      }

      if (!block.config) {
        throw new Error(`Block at index ${index} missing config`);
      }

      // Type-specific validation
      switch (block.type) {
        case 'hero':
          if (!block.config.title) {
            throw new Error(`Hero block at index ${index} requires title`);
          }
          break;

        case 'image':
          if (!block.config.src) {
            throw new Error(`Image block at index ${index} requires src`);
          }
          if (!block.config.alt) {
            throw new Error(`Image block at index ${index} requires alt text`);
          }
          break;

        case 'heading':
          if (!block.config.text) {
            throw new Error(`Heading block at index ${index} requires text`);
          }
          break;

        // Add more type-specific validations as needed
      }
    });
  }

  /**
   * Duplicate page
   */
  async duplicatePage(pageId: string, userId: string): Promise<Page> {
    const supabase = createClient();

    // Get original page
    const { data: originalPage } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (!originalPage) throw new Error('Page not found');

    // Create copy with modified title and slug
    const { data: newPage, error } = await supabase
      .from('pages')
      .insert({
        title: `${originalPage.title} (Copy)`,
        slug: `${originalPage.slug}-copy-${Date.now()}`,
        description: originalPage.description,
        blocks: originalPage.blocks,
        seo_metadata: originalPage.seo_metadata,
        status: 'draft',
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return newPage;
  }
}

// Export singleton instance
export const pageBuilderService = new PageBuilderService();
```

### 6.2 Server Actions

```typescript
// actions/page-builder.ts
'use server';

import { revalidatePath } from 'next/cache';
import { pageBuilderService } from '@/lib/services/page-builder-service';
import { createClient } from '@/lib/supabase/server';
import type { PageBlock } from '@/types/page-builder';

export async function createPageAction(data: {
  title: string;
  slug: string;
  description?: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const page = await pageBuilderService.createPage({
      ...data,
      created_by: user.id,
    });

    revalidatePath('/admin/pages');
    return { success: true, page };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function autoSaveBlocksAction(
  pageId: string,
  blocks: PageBlock[]
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await pageBuilderService.autoSaveBlocks(pageId, blocks, user.id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveDraftAction(pageId: string, data: {
  title?: string;
  slug?: string;
  description?: string;
  blocks: PageBlock[];
  seo_metadata?: any;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const page = await pageBuilderService.saveDraft(pageId, {
      ...data,
      userId: user.id,
    });

    revalidatePath('/admin/pages');
    return { success: true, page };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishPageAction(pageId: string, navigationConfig: {
  addToNavigation: boolean;
  parentId?: string;
  label?: string;
  position?: 'first' | 'after' | 'last';
  afterItemId?: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const page = await pageBuilderService.publishPage(pageId, {
      userId: user.id,
      addToNavigation: navigationConfig.addToNavigation,
      navigationConfig: navigationConfig.addToNavigation ? {
        parentId: navigationConfig.parentId,
        label: navigationConfig.label!,
        position: navigationConfig.position!,
        afterItemId: navigationConfig.afterItemId,
      } : undefined,
    });

    revalidatePath('/admin/pages');
    revalidatePath(`/${page.slug}`);
    return { success: true, page };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unpublishPageAction(pageId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await pageBuilderService.unpublishPage(pageId, user.id);

    revalidatePath('/admin/pages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePageAction(pageId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await pageBuilderService.deletePage(pageId);

    revalidatePath('/admin/pages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function duplicatePageAction(pageId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const page = await pageBuilderService.duplicatePage(pageId, user.id);

    revalidatePath('/admin/pages');
    return { success: true, page };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### 6.3 Custom Hooks

```typescript
// hooks/use-pages.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Page } from '@/types/page-builder';

export function usePagesData(filters?: { status?: string; search?: string }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPages = async () => {
    setLoading(true);

    let query = supabase
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setPages(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, [filters?.status, filters?.search]);

  return { pages, loading, refresh: fetchPages };
}

// hooks/use-auto-save.ts
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { autoSaveBlocksAction } from '@/actions/page-builder';
import type { PageBlock } from '@/types/page-builder';

export function useAutoSave(pageId: string, blocks: PageBlock[]) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedBlocks = useDebounce(blocks, 30000); // 30 seconds

  useEffect(() => {
    // Skip if no blocks or initial load
    if (debouncedBlocks.length === 0 || !pageId) return;

    setIsSaving(true);
    autoSaveBlocksAction(pageId, debouncedBlocks)
      .then((result) => {
        if (result.success) {
          setLastSaved(new Date());
        }
        setIsSaving(false);
      })
      .catch(() => {
        setIsSaving(false);
      });
  }, [debouncedBlocks, pageId]);

  return { lastSaved, isSaving };
}

// hooks/use-page-editor.ts
import { useState, useCallback } from 'react';
import type { PageBlock } from '@/types/page-builder';

export function usePageEditor(initialBlocks: PageBlock[]) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [history, setHistory] = useState<PageBlock[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addBlock = useCallback((block: PageBlock) => {
    const newBlocks = [...blocks, block];
    setBlocks(newBlocks);
    updateHistory(newBlocks);
  }, [blocks]);

  const updateBlock = useCallback((blockId: string, updates: Partial<PageBlock>) => {
    const newBlocks = blocks.map(b =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    setBlocks(newBlocks);
    updateHistory(newBlocks);
  }, [blocks]);

  const deleteBlock = useCallback((blockId: string) => {
    const newBlocks = blocks.filter(b => b.id !== blockId);
    setBlocks(newBlocks);
    updateHistory(newBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [blocks, selectedBlockId]);

  const duplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.type}_${Date.now()}`,
      order: blockToDuplicate.order + 1,
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    updateHistory(newBlocks);
  }, [blocks]);

  const reorderBlocks = useCallback((newBlocks: PageBlock[]) => {
    setBlocks(newBlocks);
    updateHistory(newBlocks);
  }, []);

  const updateHistory = (newBlocks: PageBlock[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
```

---

## 7. Routing & Rendering

### 7.1 Dynamic Route for Public Pages

```typescript
// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/page-builder/BlockRenderer';
import type { Page } from '@/types/page-builder';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all published pages (SSG)
 */
export async function generateStaticParams() {
  const supabase = createClient();

  const { data: pages } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published');

  return pages?.map((page) => ({
    slug: page.slug,
  })) || [];
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data: page } = await supabase
    .from('pages')
    .select('title, description, seo_metadata')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.seo_metadata?.title || page.title,
    description: page.seo_metadata?.description || page.description,
    openGraph: {
      title: page.seo_metadata?.title || page.title,
      description: page.seo_metadata?.description || page.description,
      images: page.seo_metadata?.og_image ? [page.seo_metadata.og_image] : [],
    },
    keywords: page.seo_metadata?.keywords,
  };
}

/**
 * Dynamic page component
 */
export default async function DynamicPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !page) {
    notFound();
  }

  // Use published_blocks (snapshot at publish time)
  const blocks = page.published_blocks || [];

  return (
    <main className="min-h-screen">
      <BlockRenderer blocks={blocks} />
    </main>
  );
}
```

### 7.2 Preview Route for Admin

```typescript
// app/admin/pages/[id]/preview/page.tsx
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/page-builder/BlockRenderer';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get page (any status, draft blocks)
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !page) {
    notFound();
  }

  // Use draft blocks (current working version)
  const blocks = page.blocks || [];

  return (
    <div className="min-h-screen">
      {/* Preview banner */}
      <div className="bg-yellow-500 text-black py-2 px-4 text-center font-medium sticky top-0 z-50">
        ⚠ Preview Mode - This page is not visible to the public
      </div>

      <BlockRenderer blocks={blocks} />
    </div>
  );
}
```

### 7.3 Block Renderer Component

```typescript
// components/page-builder/BlockRenderer.tsx
import React from 'react';
import type { PageBlock } from '@/types/page-builder';

// Import all block components
import { HeroBlock } from './blocks/content/HeroBlock';
import { HeadingBlock } from './blocks/content/HeadingBlock';
import { ParagraphBlock } from './blocks/content/ParagraphBlock';
import { RichTextBlock } from './blocks/content/RichTextBlock';
import { QuoteBlock } from './blocks/content/QuoteBlock';
import { CTABlock } from './blocks/content/CTABlock';

import { ImageBlock } from './blocks/media/ImageBlock';
import { GalleryBlock } from './blocks/media/GalleryBlock';
import { VideoBlock } from './blocks/media/VideoBlock';
import { CarouselBlock } from './blocks/media/CarouselBlock';

import { TwoColumnBlock } from './blocks/layout/TwoColumnBlock';
import { ThreeColumnBlock } from './blocks/layout/ThreeColumnBlock';
import { CardGridBlock } from './blocks/layout/CardGridBlock';
import { AccordionBlock } from './blocks/layout/AccordionBlock';
import { TabsBlock } from './blocks/layout/TabsBlock';

import { TableBlock } from './blocks/data/TableBlock';
import { StatisticsBlock } from './blocks/data/StatisticsBlock';
import { TimelineBlock } from './blocks/data/TimelineBlock';
import { ContactFormBlock } from './blocks/data/ContactFormBlock';
import { EmbedBlock } from './blocks/data/EmbedBlock';

interface BlockRendererProps {
  blocks: PageBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  // Sort blocks by order and filter visible ones
  const sortedBlocks = [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter(block => block.visibility === 'visible');

  return (
    <>
      {sortedBlocks.map((block) => {
        const key = block.id;

        // Apply custom styles if provided
        const style: React.CSSProperties = block.styles ? {
          backgroundColor: block.styles.backgroundColor,
          color: block.styles.textColor,
          padding: block.styles.padding,
          margin: block.styles.margin,
          borderRadius: block.styles.borderRadius,
          fontFamily: block.styles.fontFamily,
          fontSize: block.styles.fontSize,
          fontWeight: block.styles.fontWeight,
          textAlign: block.styles.textAlign,
          maxWidth: block.styles.maxWidth,
        } : {};

        // Render appropriate block component based on type
        switch (block.type) {
          // Content blocks
          case 'hero':
            return <HeroBlock key={key} config={block.config} style={style} />;
          case 'heading':
            return <HeadingBlock key={key} config={block.config} style={style} />;
          case 'paragraph':
            return <ParagraphBlock key={key} config={block.config} style={style} />;
          case 'rich_text':
            return <RichTextBlock key={key} config={block.config} style={style} />;
          case 'quote':
            return <QuoteBlock key={key} config={block.config} style={style} />;
          case 'cta':
            return <CTABlock key={key} config={block.config} style={style} />;

          // Media blocks
          case 'image':
            return <ImageBlock key={key} config={block.config} style={style} />;
          case 'gallery':
            return <GalleryBlock key={key} config={block.config} style={style} />;
          case 'video':
            return <VideoBlock key={key} config={block.config} style={style} />;
          case 'carousel':
            return <CarouselBlock key={key} config={block.config} style={style} />;

          // Layout blocks
          case 'two_column':
            return <TwoColumnBlock key={key} config={block.config} style={style} />;
          case 'three_column':
            return <ThreeColumnBlock key={key} config={block.config} style={style} />;
          case 'card_grid':
            return <CardGridBlock key={key} config={block.config} style={style} />;
          case 'accordion':
            return <AccordionBlock key={key} config={block.config} style={style} />;
          case 'tabs':
            return <TabsBlock key={key} config={block.config} style={style} />;

          // Data blocks
          case 'table':
            return <TableBlock key={key} config={block.config} style={style} />;
          case 'statistics':
            return <StatisticsBlock key={key} config={block.config} style={style} />;
          case 'timeline':
            return <TimelineBlock key={key} config={block.config} style={style} />;
          case 'contact_form':
            return <ContactFormBlock key={key} config={block.config} style={style} />;
          case 'embed':
            return <EmbedBlock key={key} config={block.config} style={style} />;

          default:
            console.warn(`Unknown block type: ${(block as any).type}`);
            return null;
        }
      })}
    </>
  );
}
```

### 7.4 Middleware Update

Update your existing middleware to allow public access to dynamic page routes:

```typescript
// middleware.ts (add to existing file)

import { createClient } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createClient(request);

  // Always allow these routes
  const publicRoutes = ['/', '/auth/login', '/auth/callback', '/auth/error'];
  const apiRoutes = pathname.startsWith('/api');

  if (publicRoutes.includes(pathname) || apiRoutes) {
    return NextResponse.next();
  }

  // Check if path matches a published page slug
  const potentialSlug = pathname.slice(1); // Remove leading slash

  if (potentialSlug && !pathname.startsWith('/admin')) {
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('slug', potentialSlug)
      .eq('status', 'published')
      .single();

    if (page) {
      // This is a published page, allow public access
      return NextResponse.next();
    }
  }

  // Admin routes require authentication
  if (pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Additional admin checks...
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 8. Permissions & Security

### 8.1 Update Permission Types

```typescript
// types/permissions.ts (add to existing)

export type PermissionModule =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'hero_sections'
  | 'navigation'
  | 'announcements'
  | 'benefits'
  | 'statistics'
  | 'campus_videos'
  | 'contact_submissions'
  | 'activities'
  | 'activity_categories'
  | 'media_library'
  | 'settings'
  | 'home_sections'
  | 'activity_logs'
  | 'content_sections'
  | 'pages'; // NEW MODULE

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage'
  | 'upload'
  | 'respond'
  | 'assign'
  | 'manage_folders'
  | 'manage_roles'
  | 'publish'; // NEW ACTION for pages
```

### 8.2 Page-Level Protection

```typescript
// app/admin/pages/page.tsx
import { ProtectedPage } from '@/components/admin/ProtectedPage';

export default function PagesListPage() {
  return (
    <ProtectedPage module="pages" action="view">
      {/* Page content */}
    </ProtectedPage>
  );
}

// app/admin/pages/[id]/edit/page.tsx
import { ProtectedPage } from '@/components/admin/ProtectedPage';

export default function PageEditPage() {
  return (
    <ProtectedPage module="pages" action="update">
      {/* Page builder editor */}
    </ProtectedPage>
  );
}
```

### 8.3 Action-Level Permission Checks

```typescript
// In component
import { usePermissions } from '@/lib/permissions';

export function PagesToolbar() {
  const { hasPermission, isSuperAdmin } = usePermissions();

  const canCreate = hasPermission('pages', 'create');
  const canUpdate = hasPermission('pages', 'update');
  const canDelete = hasPermission('pages', 'delete');
  const canPublish = hasPermission('pages', 'publish');

  return (
    <div>
      {canCreate && (
        <CustomButton onClick={handleCreate}>
          Create Page
        </CustomButton>
      )}

      {canUpdate && (
        <CustomButton onClick={handleEdit}>
          Edit
        </CustomButton>
      )}

      {canPublish && (
        <CustomButton onClick={handlePublish}>
          Publish
        </CustomButton>
      )}

      {canDelete && (
        <CustomButton onClick={handleDelete} variant="destructive">
          Delete
        </CustomButton>
      )}
    </div>
  );
}
```

### 8.4 Server Action Security

All server actions include authentication checks:

```typescript
// actions/page-builder.ts
export async function publishPageAction(pageId: string, config: any) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Additional permission check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role_type, roles(permissions)')
    .eq('id', user.id)
    .single();

  if (profile?.role_type !== 'super_admin') {
    const hasPublishPermission = profile?.roles?.permissions?.pages?.publish === true;
    if (!hasPublishPermission) {
      return { success: false, error: 'No permission to publish pages' };
    }
  }

  // Proceed with action...
}
```

---

## 9. Admin Panel Integration

### 9.1 Update AdminSidebar

```typescript
// components/admin/AdminSidebar.tsx

const navigationItems = [
  {
    label: 'Dashboard',
    items: [
      {
        label: 'Overview',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        requiredPermission: { module: 'dashboard' as const, action: 'view' as const },
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Pages',
        href: '/admin/pages',
        icon: FileText,
        requiredPermission: { module: 'pages' as const, action: 'view' as const },
      },
      {
        label: 'Hero Sections',
        href: '/admin/content/hero-sections',
        icon: Image,
        requiredPermission: { module: 'hero_sections' as const, action: 'view' as const },
      },
      {
        label: 'Home Sections',
        href: '/admin/content/sections',
        icon: Layout,
        requiredPermission: { module: 'home_sections' as const, action: 'view' as const },
      },
      {
        label: 'Navigation',
        href: '/admin/content/navigation',
        icon: Navigation,
        requiredPermission: { module: 'navigation' as const, action: 'view' as const },
      },
      // ... other content items
    ],
  },
  // ... rest of navigation
];
```

### 9.2 Pages List Page

```typescript
// app/admin/pages/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/admin/ProtectedPage';
import { CustomButton } from '@/components/ui/CustomButton';
import { usePermissions } from '@/lib/permissions';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Eye, Edit, Trash, Globe, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { usePagesData } from '@/hooks/use-pages';
import { deletePageAction, duplicatePageAction } from '@/actions/page-builder';
import toast from 'react-hot-toast';

export default function PagesListPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { pages, loading, refresh } = usePagesData({
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const canCreate = hasPermission('pages', 'create');
  const canUpdate = hasPermission('pages', 'update');
  const canDelete = hasPermission('pages', 'delete');

  const handleDelete = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const result = await deletePageAction(pageId);
      if (result.success) {
        toast.success('Page deleted successfully');
        refresh();
      } else {
        toast.error(result.error || 'Failed to delete page');
      }
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleDuplicate = async (pageId: string) => {
    try {
      const result = await duplicatePageAction(pageId);
      if (result.success) {
        toast.success('Page duplicated successfully');
        refresh();
      } else {
        toast.error(result.error || 'Failed to duplicate page');
      }
    } catch (error) {
      toast.error('Failed to duplicate page');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      published: { variant: 'default' as const, label: 'Published' },
      archived: { variant: 'destructive' as const, label: 'Archived' },
    };

    const { variant, label } = config[status as keyof typeof config] || config.draft;

    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <ProtectedPage module="pages" action="view">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pages</h1>
            <p className="text-muted-foreground mt-1">
              Build and manage custom pages with the page builder
            </p>
          </div>

          {canCreate && (
            <CustomButton
              onClick={() => router.push('/admin/pages/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Page
            </CustomButton>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'draft', 'published', 'archived'].map((status) => (
            <CustomButton
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </CustomButton>
          ))}
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading pages...
                  </TableCell>
                </TableRow>
              ) : pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No pages found. Create your first page to get started.
                  </TableCell>
                </TableRow>
              ) : (
                pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      /{page.slug}
                    </TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell>
                      {format(new Date(page.updated_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      {page.published_at
                        ? format(new Date(page.published_at), 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <CustomButton variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </CustomButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {page.status === 'published' && (
                            <DropdownMenuItem
                              onClick={() => window.open(`/${page.slug}`, '_blank')}
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              View Live
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/pages/${page.id}/preview`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>

                          {canUpdate && (
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/pages/${page.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}

                          {canCreate && (
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(page.id)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                          )}

                          {canDelete && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(page.id, page.title)}
                              className="text-destructive"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </ProtectedPage>
  );
}
```

---

## 10. Dependencies

### 10.1 New Packages to Install

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@tiptap/extension-link": "^2.1.13",
    "@tiptap/extension-image": "^2.1.13",
    "@tiptap/extension-placeholder": "^2.1.13",
    "react-colorful": "^5.6.1"
  }
}
```

### 10.2 Installation Command

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder react-colorful
```

### 10.3 Existing Packages (Already Installed)

- next
- react
- typescript
- tailwindcss
- @supabase/supabase-js
- react-hook-form
- zod
- lucide-react
- date-fns
- framer-motion
- radix-ui components (via shadcn/ui)

---

## 11. Implementation Checklist

### Phase 1: Database & Types (Week 1)
- [ ] Create migration file for `pages` table
- [ ] Apply RLS policies
- [ ] Add triggers for `updated_at`
- [ ] Create `types/page-builder.ts` with all block types
- [ ] Update `types/permissions.ts` to include `pages` module
- [ ] Test database schema with sample data

### Phase 2: Service Layer (Week 1-2)
- [ ] Implement `PageBuilderService` class
- [ ] Create all service methods (CRUD operations)
- [ ] Create server actions in `actions/page-builder.ts`
- [ ] Create custom hooks: `use-pages.ts`, `use-auto-save.ts`, `use-page-editor.ts`
- [ ] Test service layer with mock data

### Phase 3: Block Components - View Mode (Week 2-3)
- [ ] Create `BlockRenderer.tsx`
- [ ] Implement content blocks (6 components)
  - [ ] HeroBlock
  - [ ] HeadingBlock
  - [ ] ParagraphBlock
  - [ ] RichTextBlock
  - [ ] QuoteBlock
  - [ ] CTABlock
- [ ] Implement media blocks (4 components)
  - [ ] ImageBlock
  - [ ] GalleryBlock
  - [ ] VideoBlock
  - [ ] CarouselBlock
- [ ] Implement layout blocks (5 components)
  - [ ] TwoColumnBlock
  - [ ] ThreeColumnBlock
  - [ ] CardGridBlock
  - [ ] AccordionBlock
  - [ ] TabsBlock
- [ ] Implement data blocks (5 components)
  - [ ] TableBlock
  - [ ] StatisticsBlock
  - [ ] TimelineBlock
  - [ ] ContactFormBlock
  - [ ] EmbedBlock
- [ ] Test all blocks with sample configurations

### Phase 4: Admin UI - Pages List (Week 3)
- [ ] Create `/admin/pages/page.tsx` (list view)
- [ ] Add table with filters and search
- [ ] Implement status badges
- [ ] Add action dropdowns (edit, preview, delete, duplicate)
- [ ] Add pages link to `AdminSidebar.tsx`
- [ ] Implement permission checks
- [ ] Test CRUD operations

### Phase 5: Admin UI - Page Editor (Week 4-5)
- [ ] Create `PageBuilderEditor.tsx` (main container)
- [ ] Implement `BlockPalette.tsx` (add block menu)
- [ ] Implement `BlockSidebar.tsx` (settings panel)
- [ ] Implement `BlockToolbar.tsx` (block actions)
- [ ] Create block editors for all 20+ block types
- [ ] Implement style customization panel
- [ ] Test editor UI/UX

### Phase 6: Drag-and-Drop (Week 5)
- [ ] Install @dnd-kit packages
- [ ] Create `DragDropContext.tsx`
- [ ] Implement drag-and-drop logic
- [ ] Add visual feedback (drag overlay, drop indicators)
- [ ] Handle reordering state updates
- [ ] Test drag-and-drop reliability

### Phase 7: Auto-Save & Draft Management (Week 6)
- [ ] Implement `AutoSave.tsx` component
- [ ] Add debounced save logic
- [ ] Add save indicator in header
- [ ] Test auto-save reliability
- [ ] Handle offline scenarios
- [ ] Test concurrent editing scenarios

### Phase 8: Publish Flow (Week 6)
- [ ] Create publish modal component
- [ ] Implement navigation integration UI
- [ ] Add position selection (first/after/last)
- [ ] Implement publish action
- [ ] Test navigation auto-add
- [ ] Test unpublish/archive flows

### Phase 9: Dynamic Routing (Week 7)
- [ ] Create `/app/[slug]/page.tsx`
- [ ] Implement `generateStaticParams`
- [ ] Implement `generateMetadata` for SEO
- [ ] Create preview route `/admin/pages/[id]/preview`
- [ ] Update middleware for public page access
- [ ] Test dynamic routing with various slugs

### Phase 10: Testing & Polish (Week 7-8)
- [ ] Test all block types render correctly
- [ ] Test drag-and-drop edge cases
- [ ] Test auto-save during poor network
- [ ] Test navigation integration
- [ ] Test permissions for all roles
- [ ] Add loading states to all async operations
- [ ] Add comprehensive error handling
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Test mobile responsiveness
- [ ] Conduct user acceptance testing

### Phase 11: Documentation & Deployment (Week 8)
- [ ] Create user guide for content editors
- [ ] Document block types and configurations
- [ ] Create developer documentation
- [ ] Deploy to staging environment
- [ ] Conduct stakeholder demo
- [ ] Deploy to production
- [ ] Monitor for issues

---

## 12. Success Criteria

### Functional Requirements

✅ **Core Functionality**
- [ ] Users can create new pages with unique slugs
- [ ] Users can add, edit, reorder, and delete blocks
- [ ] Drag-and-drop reordering works smoothly
- [ ] All 20+ block types render correctly
- [ ] Full style customization works for all blocks
- [ ] Auto-save prevents data loss
- [ ] Manual save updates draft correctly

✅ **Publishing Workflow**
- [ ] Draft pages are not publicly accessible
- [ ] Published pages appear at `/[slug]`
- [ ] Preview shows current draft state
- [ ] Published pages auto-add to navigation menu
- [ ] Navigation position can be customized
- [ ] Unpublishing removes from public site

✅ **Media Integration**
- [ ] Media library integration works
- [ ] Images upload and display correctly
- [ ] Videos embed properly
- [ ] Image optimization works

✅ **Permissions**
- [ ] Super admins have full access
- [ ] Custom roles respect permission settings
- [ ] Page-level protection works
- [ ] Action-level checks function correctly
- [ ] RLS policies enforce database security

### Non-Functional Requirements

✅ **Performance**
- [ ] Page editor loads in < 2 seconds
- [ ] Drag-and-drop feels responsive (< 100ms lag)
- [ ] Auto-save doesn't interrupt editing
- [ ] Public pages load in < 1.5 seconds
- [ ] Image lazy loading works

✅ **User Experience**
- [ ] Intuitive for non-technical users
- [ ] Clear visual feedback for all actions
- [ ] Helpful error messages
- [ ] Consistent with existing admin UI
- [ ] Mobile-responsive editor (basic support)

✅ **Reliability**
- [ ] Auto-save doesn't lose data
- [ ] No crashes during extended editing
- [ ] Handles network errors gracefully
- [ ] Concurrent editing doesn't cause conflicts

✅ **SEO & Accessibility**
- [ ] SEO metadata generates correctly
- [ ] Open Graph tags work
- [ ] Semantic HTML structure
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (basic)

---

## Appendix A: Example Block Configurations

### Hero Block Example

```json
{
  "id": "blk_hero_1",
  "type": "hero",
  "order": 0,
  "visibility": "visible",
  "config": {
    "title": "Welcome to JKKN Dental College",
    "subtitle": "Excellence in Dental Education Since 2005",
    "backgroundType": "gradient",
    "gradient": {
      "start": "#0b6d41",
      "end": "#1a5f4a"
    },
    "ctaButtons": [
      {
        "label": "Apply Now",
        "href": "/admissions/apply",
        "variant": "primary"
      },
      {
        "label": "Learn More",
        "href": "/about",
        "variant": "secondary"
      }
    ],
    "overlay": true,
    "overlayOpacity": 30
  },
  "styles": {
    "padding": "120px 20px",
    "textColor": "#ffffff",
    "textAlign": "center"
  }
}
```

### Card Grid Block Example

```json
{
  "id": "blk_cards_1",
  "type": "card_grid",
  "order": 3,
  "visibility": "visible",
  "config": {
    "cards": [
      {
        "title": "Expert Faculty",
        "description": "Learn from experienced dental professionals",
        "icon": "Users",
        "link": "/faculty"
      },
      {
        "title": "Modern Facilities",
        "description": "State-of-the-art dental labs and equipment",
        "icon": "Building",
        "link": "/facilities"
      },
      {
        "title": "Clinical Experience",
        "description": "Hands-on training in our dental hospital",
        "icon": "Stethoscope",
        "link": "/clinical"
      }
    ],
    "columns": 3,
    "cardStyle": "elevated"
  },
  "styles": {
    "padding": "60px 20px",
    "backgroundColor": "#f9f9f9"
  }
}
```

---

## Appendix B: API Response Examples

### Create Page Response

```json
{
  "success": true,
  "page": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "About Our Campus",
    "slug": "about-our-campus",
    "description": "Learn about our beautiful campus",
    "status": "draft",
    "blocks": [],
    "published_blocks": null,
    "seo_metadata": null,
    "last_saved_at": "2025-11-18T10:30:00Z",
    "last_auto_saved_at": null,
    "published_at": null,
    "published_by": null,
    "auto_added_to_nav": false,
    "navigation_item_id": null,
    "created_by": "user-id-123",
    "updated_by": "user-id-123",
    "created_at": "2025-11-18T10:30:00Z",
    "updated_at": "2025-11-18T10:30:00Z",
    "version": 1
  }
}
```

### Publish Page Response

```json
{
  "success": true,
  "page": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "About Our Campus",
    "slug": "about-our-campus",
    "status": "published",
    "published_blocks": [...],
    "published_at": "2025-11-18T11:00:00Z",
    "published_by": "user-id-123",
    "auto_added_to_nav": true,
    "navigation_item_id": "nav-item-456",
    "version": 2
  }
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-18 | Design Team | Initial blueprint created |

---

**END OF DOCUMENT**
