// =====================================================
// HOME SECTIONS SERVICE
// =====================================================
// Purpose: Service layer for home sections CRUD operations
// Module: sections
// Layer: Services (Business Logic)
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type {
  HomeSection,
  CreateSectionDto,
  UpdateSectionDto,
  SectionFilters,
  SectionResponse,
  ReorderSectionsDto,
} from '@/types/sections';

// =====================================================
// SERVICE CLASS
// =====================================================

export class SectionsService {
  /**
   * Fetch paginated list of sections with optional filters
   */
  static async getSections(
    filters: SectionFilters = {},
    page = 1,
    pageSize = 50
  ): Promise<SectionResponse> {
    const supabase = createClient();

    try {
      // Build query
      let query = supabase
        .from('home_sections')
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,section_key.ilike.%${filters.search}%`
        );
      }

      if (filters.is_visible !== undefined) {
        query = query.eq('is_visible', filters.is_visible);
      }

      if (filters.section_type) {
        query = query.eq('section_type', filters.section_type);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        console.error('[sections/service] Error fetching sections:', error);
        throw new Error(error.message);
      }

      return {
        data: (data as HomeSection[]) || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Fetch all visible sections (for frontend rendering)
   */
  static async getVisibleSections(): Promise<HomeSection[]> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[sections/service] Error fetching visible sections:', error);
        throw new Error(error.message);
      }

      return (data as HomeSection[]) || [];
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Fetch single section by ID
   */
  static async getSectionById(id: string): Promise<HomeSection | null> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[sections/service] Error fetching section:', error);
        throw new Error(error.message);
      }

      return data as HomeSection;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Fetch single section by key (for specific section rendering)
   */
  static async getSectionByKey(sectionKey: string): Promise<HomeSection | null> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .single();

      if (error) {
        console.error('[sections/service] Error fetching section by key:', error);
        throw new Error(error.message);
      }

      return data as HomeSection;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Create a new section
   */
  static async createSection(dto: CreateSectionDto): Promise<HomeSection> {
    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Prepare insert data
      const insertData = {
        ...dto,
        created_by: user?.id,
        updated_by: user?.id,
      };

      const { data, error } = await supabase
        .from('home_sections')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('[sections/service] Error creating section:', error);
        throw new Error(error.message);
      }

      return data as HomeSection;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Update an existing section
   */
  static async updateSection(dto: UpdateSectionDto): Promise<HomeSection> {
    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Prepare update data
      const { id, ...updateData } = dto;
      const dataToUpdate = {
        ...updateData,
        updated_by: user?.id,
      };

      const { data, error } = await supabase
        .from('home_sections')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[sections/service] Error updating section:', error);
        throw new Error(error.message);
      }

      return data as HomeSection;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Delete a section
   */
  static async deleteSection(id: string): Promise<boolean> {
    const supabase = createClient();

    try {
      const { error } = await supabase.from('home_sections').delete().eq('id', id);

      if (error) {
        console.error('[sections/service] Error deleting section:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return false;
    }
  }

  /**
   * Toggle section visibility
   */
  static async toggleVisibility(id: string, isVisible: boolean): Promise<HomeSection> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('home_sections')
        .update({ is_visible: isVisible })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[sections/service] Error toggling visibility:', error);
        throw new Error(error.message);
      }

      return data as HomeSection;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Reorder sections (batch update display_order)
   */
  static async reorderSections(dto: ReorderSectionsDto): Promise<boolean> {
    const supabase = createClient();

    try {
      // Update each section's display_order
      const updates = dto.sections.map((section) =>
        supabase
          .from('home_sections')
          .update({ display_order: section.display_order })
          .eq('id', section.id)
      );

      const results = await Promise.all(updates);

      // Check if any update failed
      const hasError = results.some((result) => result.error);
      if (hasError) {
        console.error('[sections/service] Error reordering sections');
        throw new Error('Failed to reorder sections');
      }

      return true;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return false;
    }
  }

  /**
   * Get next available display order
   */
  static async getNextDisplayOrder(): Promise<number> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      if (error) {
        console.error('[sections/service] Error getting next display order:', error);
        return 0;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      return data[0].display_order + 1;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return 0;
    }
  }

  /**
   * Check if section key is available
   */
  static async isSectionKeyAvailable(
    sectionKey: string,
    excludeId?: string
  ): Promise<boolean> {
    const supabase = createClient();

    try {
      let query = supabase.from('home_sections').select('id').eq('section_key', sectionKey);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[sections/service] Error checking section key availability:', error);
        return false;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('[sections/service] Unexpected error:', error);
      return false;
    }
  }
}
