/**
 * Page Service
 * Handles all CRUD operations for pages
 * Client-side service for real-time data fetching
 */

import { createClient } from '@/lib/supabase/client'
import type {
  Page,
  CreatePageDto,
  UpdatePageDto,
  PublishPageDto,
  PageBlock,
} from '@/types/page-builder'

export interface PageFilters {
  search?: string
  status?: 'draft' | 'published' | 'archived'
  created_by?: string
}

export interface PageResponse {
  data: Page[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Page Service Class
 * Static methods for all page operations
 */
export class PageService {
  private static supabase = createClient()

  /**
   * Error handler helper
   */
  private static handleError(error: unknown, context: string): Error {
    console.error(`[PageService] ${context} error:`, error)

    if (error instanceof Error) {
      return new Error(`${context} failed: ${error.message}`)
    }

    return new Error(`${context} failed: Unknown error occurred`)
  }

  /**
   * Get paginated list of pages with filters
   *
   * @param filters - Filter criteria
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @returns Paginated page response
   */
  static async getPages(
    filters: PageFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PageResponse> {
    try {
      console.log('[PageService] Fetching pages with filters:', filters)

      const supabase = createClient()
      const offset = (page - 1) * pageSize

      // Build base query
      let query = supabase
        .from('pages')
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `,
          { count: 'exact' }
        )

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
        )
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by)
      }

      // Apply pagination
      query = query
        .order('updated_at', { ascending: false })
        .range(offset, offset + pageSize - 1)

      const { data, error, count } = await query

      if (error) {
        throw this.handleError(error, 'Fetch pages')
      }

      const totalPages = count ? Math.ceil(count / pageSize) : 0

      return {
        data: data || [],
        count: count || 0,
        page,
        pageSize,
        totalPages,
      }
    } catch (error) {
      throw this.handleError(error, 'Get pages')
    }
  }

  /**
   * Get a single page by ID
   *
   * @param id - Page ID
   * @returns Page or null
   */
  static async getPageById(id: string): Promise<Page | null> {
    try {
      console.log('[PageService] Fetching page by ID:', id)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('pages')
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `
        )
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw this.handleError(error, 'Fetch page by ID')
      }

      return data
    } catch (error) {
      throw this.handleError(error, 'Get page by ID')
    }
  }

  /**
   * Get a single page by slug (for public viewing)
   *
   * @param slug - Page slug
   * @returns Page or null
   */
  static async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      console.log('[PageService] Fetching page by slug:', slug)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw this.handleError(error, 'Fetch page by slug')
      }

      return data
    } catch (error) {
      throw this.handleError(error, 'Get page by slug')
    }
  }

  /**
   * Create a new page
   *
   * @param data - Page data
   * @returns Created page
   */
  static async createPage(data: CreatePageDto): Promise<Page> {
    try {
      console.log('[PageService] Creating page:', data)

      const supabase = createClient()

      const { data: page, error } = await supabase
        .from('pages')
        .insert({
          title: data.title,
          slug: data.slug,
          description: data.description,
          created_by: data.created_by,
          blocks: [],
          status: 'draft',
        })
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email)
        `
        )
        .single()

      if (error) {
        throw this.handleError(error, 'Create page')
      }

      return page
    } catch (error) {
      throw this.handleError(error, 'Create page')
    }
  }

  /**
   * Update a page
   *
   * @param data - Update data
   * @returns Updated page
   */
  static async updatePage(data: UpdatePageDto): Promise<Page> {
    try {
      console.log('[PageService] Updating page:', data.id)

      const supabase = createClient()

      const updateData: Record<string, unknown> = {
        updated_by: data.updated_by,
        last_saved_at: new Date().toISOString(),
      }

      if (data.title !== undefined) updateData.title = data.title
      if (data.slug !== undefined) updateData.slug = data.slug
      if (data.description !== undefined) updateData.description = data.description
      if (data.blocks !== undefined) updateData.blocks = data.blocks
      if (data.seo_metadata !== undefined) updateData.seo_metadata = data.seo_metadata

      const { data: page, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', data.id)
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `
        )
        .single()

      if (error) {
        throw this.handleError(error, 'Update page')
      }

      return page
    } catch (error) {
      throw this.handleError(error, 'Update page')
    }
  }

  /**
   * Auto-save page (updates last_auto_saved_at timestamp)
   *
   * @param pageId - Page ID
   * @param blocks - Block data
   * @param userId - User ID
   */
  static async autoSavePage(
    pageId: string,
    blocks: PageBlock[],
    userId: string
  ): Promise<void> {
    try {
      console.log('[PageService] Auto-saving page:', pageId)

      const supabase = createClient()

      const { error } = await supabase
        .from('pages')
        .update({
          blocks,
          last_auto_saved_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq('id', pageId)

      if (error) {
        throw this.handleError(error, 'Auto-save page')
      }
    } catch (error) {
      // Log error but don't throw - auto-save failures shouldn't break the UI
      console.error('[PageService] Auto-save failed:', error)
    }
  }

  /**
   * Publish a page
   *
   * @param data - Publish data
   * @returns Updated page
   */
  static async publishPage(data: PublishPageDto): Promise<Page> {
    try {
      console.log('[PageService] Publishing page:', data.id)
      console.log('[PageService] Publish data:', data)

      const supabase = createClient()

      // First, get the current page to copy blocks to published_blocks
      console.log('[PageService] Fetching current page blocks...')
      const { data: currentPage, error: fetchError } = await supabase
        .from('pages')
        .select('blocks')
        .eq('id', data.id)
        .single()

      console.log('[PageService] Fetch result:', { currentPage, fetchError })

      if (fetchError) {
        console.error('[PageService] Fetch error:', fetchError)
        throw this.handleError(fetchError, 'Fetch page for publishing')
      }

      console.log('[PageService] Current page blocks count:', (currentPage.blocks as any[])?.length)

      // Update page status and published data
      const updateData: Record<string, unknown> = {
        status: 'published',
        published_blocks: currentPage.blocks,
        published_at: new Date().toISOString(),
        published_by: data.user_id,
        updated_by: data.user_id,
      }

      // If navigation integration is requested
      if (data.add_to_navigation && data.navigation_config) {
        updateData.auto_added_to_nav = true
        // Navigation item creation will be handled separately
      }

      console.log('[PageService] Update data:', updateData)
      console.log('[PageService] Executing update query...')

      const { data: page, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', data.id)
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `
        )
        .single()

      console.log('[PageService] Update result:', { page, error })

      if (error) {
        console.error('[PageService] Update error:', error)
        throw this.handleError(error, 'Publish page')
      }

      console.log('[PageService] Page published successfully:', page.id)
      return page
    } catch (error) {
      console.error('[PageService] Publish page caught error:', error)
      throw this.handleError(error, 'Publish page')
    }
  }

  /**
   * Unpublish a page (set back to draft)
   *
   * @param pageId - Page ID
   * @param userId - User ID
   * @returns Updated page
   */
  static async unpublishPage(pageId: string, userId: string): Promise<Page> {
    try {
      console.log('[PageService] Unpublishing page:', pageId)

      const supabase = createClient()

      const { data: page, error } = await supabase
        .from('pages')
        .update({
          status: 'draft',
          updated_by: userId,
        })
        .eq('id', pageId)
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `
        )
        .single()

      if (error) {
        throw this.handleError(error, 'Unpublish page')
      }

      return page
    } catch (error) {
      throw this.handleError(error, 'Unpublish page')
    }
  }

  /**
   * Archive a page
   *
   * @param pageId - Page ID
   * @param userId - User ID
   * @returns Updated page
   */
  static async archivePage(pageId: string, userId: string): Promise<Page> {
    try {
      console.log('[PageService] Archiving page:', pageId)

      const supabase = createClient()

      const { data: page, error } = await supabase
        .from('pages')
        .update({
          status: 'archived',
          updated_by: userId,
        })
        .eq('id', pageId)
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          publisher:profiles!published_by(id, full_name, email)
        `
        )
        .single()

      if (error) {
        throw this.handleError(error, 'Archive page')
      }

      return page
    } catch (error) {
      throw this.handleError(error, 'Archive page')
    }
  }

  /**
   * Delete a page
   *
   * @param pageId - Page ID
   */
  static async deletePage(pageId: string): Promise<void> {
    try {
      console.log('[PageService] Deleting page:', pageId)

      const supabase = createClient()

      const { error } = await supabase.from('pages').delete().eq('id', pageId)

      if (error) {
        throw this.handleError(error, 'Delete page')
      }
    } catch (error) {
      throw this.handleError(error, 'Delete page')
    }
  }

  /**
   * Check if slug is available
   *
   * @param slug - Slug to check
   * @param excludeId - Page ID to exclude (for updates)
   * @returns True if available
   */
  static async isSlugAvailable(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const supabase = createClient()

      let query = supabase.from('pages').select('id').eq('slug', slug)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query

      if (error) {
        throw this.handleError(error, 'Check slug availability')
      }

      return !data || data.length === 0
    } catch (error) {
      throw this.handleError(error, 'Check slug availability')
    }
  }
}
