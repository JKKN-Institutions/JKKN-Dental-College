// =====================================================
// HOME SECTIONS MODULE - TYPE DEFINITIONS
// =====================================================
// Purpose: TypeScript types for dynamic home page sections
// Module: sections
// Layer: Types
// =====================================================

// =====================================================
// ENUMS
// =====================================================

export type SectionType =
  | 'hero'
  | 'about'
  | 'institutions'
  | 'why-choose'
  | 'strength'
  | 'news'
  | 'buzz'
  | 'events'
  | 'videos'
  | 'partners'
  | 'recruiters'
  | 'alumni'
  | 'life'
  | 'contact'
  | 'custom';

// =====================================================
// MAIN TYPES
// =====================================================

export interface HomeSection {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string;
  section_type: SectionType;
  content: SectionContent;
  is_visible: boolean;
  display_order: number;
  background_color?: string;
  text_color?: string;
  custom_css_class?: string;
  component_name?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Content structure varies by section type
export type SectionContent = Record<string, any>;

// =====================================================
// SPECIFIC SECTION CONTENT TYPES
// =====================================================

export interface HeroSectionContent {
  tagline?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  background_image?: string;
  background_video?: string;
}

export interface AboutSectionContent {
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  images?: string[];
}

export interface InstitutionsSectionContent {
  institutions?: Array<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    link?: string;
  }>;
}

export interface WhyChooseSectionContent {
  reasons?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface StrengthSectionContent {
  statistics?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
}

// =====================================================
// DTO (Data Transfer Objects)
// =====================================================

export interface CreateSectionDto {
  section_key: string;
  title: string;
  subtitle?: string;
  section_type: SectionType;
  content?: SectionContent;
  is_visible?: boolean;
  display_order?: number;
  background_color?: string;
  text_color?: string;
  custom_css_class?: string;
  component_name?: string;
}

export interface UpdateSectionDto {
  id: string;
  section_key?: string;
  title?: string;
  subtitle?: string;
  section_type?: SectionType;
  content?: SectionContent;
  is_visible?: boolean;
  display_order?: number;
  background_color?: string;
  text_color?: string;
  custom_css_class?: string;
  component_name?: string;
}

// =====================================================
// FILTERS & PAGINATION
// =====================================================

export interface SectionFilters {
  search?: string;
  section_type?: SectionType;
  is_visible?: boolean;
}

export interface SectionResponse {
  data: HomeSection[];
  total: number;
  page: number;
  pageSize: number;
}

// =====================================================
// REORDERING
// =====================================================

export interface ReorderSectionsDto {
  sections: Array<{
    id: string;
    display_order: number;
  }>;
}

// =====================================================
// VIEW MODELS
// =====================================================

export interface SectionSummary {
  id: string;
  section_key: string;
  title: string;
  section_type: SectionType;
  is_visible: boolean;
  display_order: number;
  component_name?: string;
}

export interface SectionDetail extends HomeSection {
  created_by_name?: string;
  updated_by_name?: string;
}
