// =====================================================
// PAGES SERVICE
// =====================================================
// Purpose: Service layer for pages CRUD operations
// Module: pages
// Layer: Services (Business Logic)
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type {
  Page,
  CreatePageDto,
  UpdatePageDto,
  PageFilters,
  PageResponse,
} from '@/types/pages';

// =====================================================
// SERVICE CLASS
// =====================================================

export class PagesService {
  /**
   * Fetch paginated list of pages with optional filters
   */
  static async getPages(
    filters: PageFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PageResponse> {
    const supabase = createClient();

    try {
      // Build query
      let query = supabase
        .from('pages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
      }

      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }

      if (filters.template_type) {
        query = query.eq('template_type', filters.template_type);
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        console.error('[pages/service] Error fetching pages:', error);
        throw new Error(error.message);
      }

      return {
        data: (data as Page[]) || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Fetch single page by ID
   */
  static async getPageById(id: string): Promise<Page | null> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[pages/service] Error fetching page:', error);
        throw new Error(error.message);
      }

      return data as Page;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Fetch single page by slug (for public viewing)
   */
  static async getPageBySlug(slug: string): Promise<Page | null> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('[pages/service] Error fetching page by slug:', error);
        throw new Error(error.message);
      }

      return data as Page;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      return null;
    }
  }

  /**
   * Create a new page
   */
  static async createPage(dto: CreatePageDto): Promise<Page> {
    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Auto-generate slug if not provided
      const slug = dto.slug || this.generateSlug(dto.title);

      // Prepare insert data
      const insertData = {
        ...dto,
        slug,
        created_by: user?.id,
        updated_by: user?.id,
      };

      const { data, error } = await supabase
        .from('pages')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('[pages/service] Error creating page:', error);
        throw new Error(error.message);
      }

      return data as Page;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Update an existing page
   */
  static async updatePage(dto: UpdatePageDto): Promise<Page> {
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
        .from('pages')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[pages/service] Error updating page:', error);
        throw new Error(error.message);
      }

      return data as Page;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Delete a page
   */
  static async deletePage(id: string): Promise<boolean> {
    const supabase = createClient();

    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);

      if (error) {
        console.error('[pages/service] Error deleting page:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      return false;
    }
  }

  /**
   * Toggle publish status
   */
  static async togglePublish(id: string, publish: boolean): Promise<Page> {
    const supabase = createClient();

    try {
      const updateData: any = {
        is_published: publish,
      };

      // Set published_at timestamp when publishing
      if (publish) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[pages/service] Error toggling publish status:', error);
        throw new Error(error.message);
      }

      return data as Page;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      throw error;
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }

  /**
   * Check if slug is available
   */
  static async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient();

    try {
      let query = supabase.from('pages').select('id').eq('slug', slug);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[pages/service] Error checking slug availability:', error);
        return false;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('[pages/service] Unexpected error:', error);
      return false;
    }
  }
}
