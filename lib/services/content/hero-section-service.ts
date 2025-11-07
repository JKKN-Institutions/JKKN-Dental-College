// =====================================================
// HERO SECTION SERVICE
// =====================================================
// Purpose: Database operations for hero sections
// Module: content/hero-sections
// Layer: Service (Business Logic)
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type {
  HeroSection,
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
  HeroSectionFilters,
  HeroSectionResponse,
} from '@/types/hero-section';

export class HeroSectionService {
  private static supabase = createClient();

  /**
   * Handle and format Supabase errors
   */
  private static handleError(error: any, context: string): Error {
    console.error(`[content/hero-sections] Error in ${context}:`, error);
    console.error(`[content/hero-sections] Error type:`, typeof error);
    console.error(`[content/hero-sections] Error keys:`, error ? Object.keys(error) : 'null');
    if (error && typeof error === 'object') {
      console.error(`[content/hero-sections] Error.message:`, error.message);
      console.error(`[content/hero-sections] Error.code:`, error.code);
      console.error(`[content/hero-sections] Error.details:`, error.details);
    }

    // Handle empty error objects (RLS policy errors)
    if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
      return new Error(
        `Unable to ${context}. This is likely due to Row Level Security (RLS) policies. ` +
        'Please ensure the hero_sections table exists and has proper RLS policies. ' +
        'See HERO_SECTIONS_SETUP.md for setup instructions.'
      );
    }

    // Handle table not found errors
    if (error.code === '42P01' || error.message?.includes('does not exist') ||
        error.message?.includes('schema cache')) {
      return new Error(
        `The hero_sections table does not exist. Please create it first. ` +
        'See HERO_SECTIONS_SETUP.md for setup instructions.'
      );
    }

    // Handle RLS policy errors
    if (error.code === 'PGRST301' || error.message?.includes('RLS')) {
      return new Error(
        `Access denied due to Row Level Security policies. ` +
        'You may need to be authenticated as an admin. ' +
        'See HERO_SECTIONS_SETUP.md for setup instructions.'
      );
    }

    // Handle network errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
      return new Error(
        'Network error. Please check your internet connection and Supabase configuration.'
      );
    }

    // Return original error message if available
    return new Error(error.message || `Failed to ${context}`);
  }

  /**
   * Get all hero sections with pagination and filters
   * @param filters - Search and filter criteria
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of items per page
   * @returns Paginated hero sections with total count
   */
  static async getHeroSections(
    filters: HeroSectionFilters = {},
    page = 1,
    pageSize = 10
  ): Promise<HeroSectionResponse> {
    try {
      console.log('[content/hero-sections] Fetching with filters:', filters);
      console.log('[content/hero-sections] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[content/hero-sections] Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      let query = this.supabase
        .from('hero_sections')
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`
        );
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw this.handleError(error, 'fetch hero sections');
      }

      console.log('[content/hero-sections] Fetched:', data?.length, 'items');
      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('[content/hero-sections] Error in getHeroSections:', error);
      throw error;
    }
  }

  /**
   * Get active hero section for public display
   * @returns Active hero section or null if none
   */
  static async getActiveHeroSection(): Promise<HeroSection | null> {
    try {
      console.log('[content/hero-sections] Fetching active hero');

      const { data, error } = await this.supabase
        .from('hero_sections')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        // If no active hero found, return null (not an error)
        if (error.code === 'PGRST116') {
          console.warn('[content/hero-sections] No active hero section found');
          return null;
        }
        throw this.handleError(error, 'fetch active hero section');
      }

      console.log('[content/hero-sections] Active hero:', data.id);
      return data;
    } catch (error) {
      console.error('[content/hero-sections] Error in getActiveHeroSection:', error);
      throw error;
    }
  }

  /**
   * Get hero section by ID
   * @param id - Hero section UUID
   * @returns Hero section or null
   */
  static async getHeroSectionById(id: string): Promise<HeroSection | null> {
    try {
      console.log('[content/hero-sections] Fetching by ID:', id);

      const { data, error } = await this.supabase
        .from('hero_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('[content/hero-sections] Hero not found:', id);
          return null;
        }
        throw this.handleError(error, 'fetch hero section by ID');
      }

      console.log('[content/hero-sections] Fetched hero:', data.id);
      return data;
    } catch (error) {
      console.error('[content/hero-sections] Error in getHeroSectionById:', error);
      throw error;
    }
  }

  /**
   * Create new hero section
   * @param dto - Hero section data
   * @returns Created hero section
   */
  static async createHeroSection(
    dto: CreateHeroSectionDto
  ): Promise<HeroSection> {
    try {
      console.log('[content/hero-sections] Creating hero section:', dto.title);

      const { data, error } = await this.supabase
        .from('hero_sections')
        .insert([dto])
        .select()
        .single();

      if (error) {
        throw this.handleError(error, 'create hero section');
      }

      console.log('[content/hero-sections] Created hero:', data.id);
      return data;
    } catch (error) {
      console.error('[content/hero-sections] Error in createHeroSection:', error);
      throw error;
    }
  }

  /**
   * Update existing hero section
   * @param dto - Updated hero section data
   * @returns Updated hero section
   */
  static async updateHeroSection(
    dto: UpdateHeroSectionDto
  ): Promise<HeroSection> {
    try {
      const { id, ...updates } = dto;
      console.log('[content/hero-sections] Updating hero:', id);

      const { data, error } = await this.supabase
        .from('hero_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw this.handleError(error, 'update hero section');
      }

      console.log('[content/hero-sections] Updated hero:', data.id);
      return data;
    } catch (error) {
      console.error('[content/hero-sections] Error in updateHeroSection:', error);
      throw error;
    }
  }

  /**
   * Delete hero section (hard delete)
   * @param id - Hero section UUID
   * @returns Success status
   */
  static async deleteHeroSection(id: string): Promise<boolean> {
    try {
      console.log('[content/hero-sections] Deleting hero:', id);

      const { error } = await this.supabase
        .from('hero_sections')
        .delete()
        .eq('id', id);

      if (error) {
        throw this.handleError(error, 'delete hero section');
      }

      console.log('[content/hero-sections] Deleted hero:', id);
      return true;
    } catch (error) {
      console.error('[content/hero-sections] Error in deleteHeroSection:', error);
      throw error;
    }
  }

  /**
   * Toggle active status of hero section
   * Note: Database trigger ensures only one can be active
   * @param id - Hero section UUID
   * @param isActive - New active status
   * @returns Updated hero section
   */
  static async toggleActiveStatus(
    id: string,
    isActive: boolean
  ): Promise<HeroSection> {
    try {
      console.log('[content/hero-sections] Toggling active:', id, isActive);

      const { data, error } = await this.supabase
        .from('hero_sections')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw this.handleError(error, 'toggle active status');
      }

      console.log('[content/hero-sections] Toggled active:', data.id);
      return data;
    } catch (error) {
      console.error('[content/hero-sections] Error in toggleActiveStatus:', error);
      throw error;
    }
  }

  /**
   * Duplicate existing hero section
   * @param id - Hero section UUID to duplicate
   * @returns Duplicated hero section (inactive by default)
   */
  static async duplicateHeroSection(id: string): Promise<HeroSection> {
    try {
      console.log('[content/hero-sections] Duplicating hero:', id);

      // First, fetch the hero to duplicate
      const original = await this.getHeroSectionById(id);
      if (!original) {
        throw new Error('Hero section not found');
      }

      // Create a copy with "Copy of" prefix and inactive status
      const dto: CreateHeroSectionDto = {
        title: `Copy of ${original.title}`,
        tagline: original.tagline,
        news_ticker_text: original.news_ticker_text || undefined,
        primary_cta_text: original.primary_cta_text,
        primary_cta_link: original.primary_cta_link || undefined,
        secondary_cta_text: original.secondary_cta_text,
        secondary_cta_link: original.secondary_cta_link || undefined,
        video_url: original.video_url || undefined,
        poster_image_url: original.poster_image_url || undefined,
        is_active: false,
        display_order: original.display_order + 1,
      };

      const duplicated = await this.createHeroSection(dto);
      console.log('[content/hero-sections] Duplicated hero:', duplicated.id);
      return duplicated;
    } catch (error) {
      console.error('[content/hero-sections] Error in duplicateHeroSection:', error);
      throw error;
    }
  }
}
