// =====================================================
// HERO SECTION TYPES
// =====================================================
// Purpose: TypeScript interfaces for hero section module
// Module: content/hero-sections
// =====================================================

/**
 * Main Hero Section entity interface
 * Represents a complete hero section record from database
 */
export interface HeroSection {
  // Primary Key
  id: string;

  // Content Fields
  title: string;
  tagline: string;
  news_ticker_text: string | null;

  // Call-to-Action Buttons
  primary_cta_text: string;
  primary_cta_link: string | null;
  secondary_cta_text: string;
  secondary_cta_link: string | null;

  // Media Assets
  video_url: string | null;
  poster_image_url: string | null;

  // Status & Ordering
  is_active: boolean;
  display_order: number;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * Create Hero Section DTO
 * Fields required when creating a new hero section
 */
export interface CreateHeroSectionDto {
  // Content Fields (required)
  title: string;
  tagline: string;

  // Content Fields (optional)
  news_ticker_text?: string;

  // Call-to-Action Buttons
  primary_cta_text: string;
  primary_cta_link?: string;
  secondary_cta_text: string;
  secondary_cta_link?: string;

  // Media Assets
  video_url?: string;
  poster_image_url?: string;

  // Status & Ordering
  is_active?: boolean;
  display_order?: number;
}

/**
 * Update Hero Section DTO
 * All fields optional except id
 */
export interface UpdateHeroSectionDto {
  // Primary Key (required)
  id: string;

  // Content Fields (optional)
  title?: string;
  tagline?: string;
  news_ticker_text?: string;

  // Call-to-Action Buttons (optional)
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;

  // Media Assets (optional)
  video_url?: string;
  poster_image_url?: string;

  // Status & Ordering (optional)
  is_active?: boolean;
  display_order?: number;
}

/**
 * Hero Section Filters
 * Used for searching and filtering hero sections
 */
export interface HeroSectionFilters {
  // Search by text
  search?: string; // Searches in title, tagline

  // Filter by status
  is_active?: boolean;

  // Filter by creator
  created_by?: string;
}

/**
 * Hero Section Response
 * Used for paginated API responses
 */
export interface HeroSectionResponse {
  data: HeroSection[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Hero Section Form Values
 * Used with React Hook Form for form validation
 */
export interface HeroSectionFormValues {
  title: string;
  tagline: string;
  news_ticker_text?: string;
  primary_cta_text: string;
  primary_cta_link?: string;
  secondary_cta_text: string;
  secondary_cta_link?: string;
  video_url?: string;
  poster_image_url?: string;
  is_active?: boolean;
  display_order?: number;
}
