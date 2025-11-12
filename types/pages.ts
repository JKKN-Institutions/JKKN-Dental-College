// =====================================================
// PAGES MODULE - TYPE DEFINITIONS
// =====================================================
// Purpose: TypeScript types for dynamic pages system
// Module: pages
// Layer: Types
// =====================================================

// =====================================================
// ENUMS
// =====================================================

export type PageTemplateType = 'default' | 'full-width' | 'sidebar' | 'landing';

// =====================================================
// MAIN TYPES
// =====================================================

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageContent;
  excerpt?: string;
  template_type: PageTemplateType;
  is_published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Content can be rich JSON structure (for future rich text editor)
export interface PageContent {
  blocks?: ContentBlock[];
  html?: string;
  raw?: string;
}

export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'list' | 'quote' | 'code' | 'divider';
  content: any;
  properties?: Record<string, any>;
}

// =====================================================
// DTO (Data Transfer Objects)
// =====================================================

export interface CreatePageDto {
  title: string;
  slug?: string; // Optional, auto-generated if not provided
  content?: PageContent;
  excerpt?: string;
  template_type?: PageTemplateType;
  is_published?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface UpdatePageDto {
  id: string;
  title?: string;
  slug?: string;
  content?: PageContent;
  excerpt?: string;
  template_type?: PageTemplateType;
  is_published?: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

// =====================================================
// FILTERS & PAGINATION
// =====================================================

export interface PageFilters {
  search?: string;
  is_published?: boolean;
  template_type?: PageTemplateType;
  created_by?: string;
}

export interface PageResponse {
  data: Page[];
  total: number;
  page: number;
  pageSize: number;
}

// =====================================================
// VIEW MODELS (for frontend display)
// =====================================================

export interface PageSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageDetail extends Page {
  created_by_name?: string;
  updated_by_name?: string;
}
