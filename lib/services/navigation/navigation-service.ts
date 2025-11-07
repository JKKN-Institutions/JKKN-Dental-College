// =====================================================
// NAVIGATION SERVICE
// =====================================================
// Purpose: Database operations for navigation items
// Module: navigation
// Layer: Service (Business Logic)
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type {
  NavigationItem,
  CreateNavigationItemDto,
  UpdateNavigationItemDto,
  NavigationItemFilters,
  NavigationItemResponse,
  NavigationTree,
} from '@/types/navigation';

export class NavigationService {
  private static supabase = createClient();

  /**
   * Get all navigation items with pagination and filters
   * @param filters - Search and filter criteria
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of items per page
   * @returns Paginated navigation items with total count
   */
  static async getNavigationItems(
    filters: NavigationItemFilters = {},
    page = 1,
    pageSize = 50
  ): Promise<NavigationItemResponse> {
    try {
      console.log('[navigation] Fetching with filters:', filters);

      let query = this.supabase
        .from('navigation_items')
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `label.ilike.%${filters.search}%,url.ilike.%${filters.search}%`
        );
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.parent_id !== undefined) {
        if (filters.parent_id === null) {
          query = query.is('parent_id', null);
        } else {
          query = query.eq('parent_id', filters.parent_id);
        }
      }

      if (filters.depth !== undefined) {
        query = query.eq('depth', filters.depth);
      }

      if (filters.requires_auth !== undefined) {
        query = query.eq('requires_auth', filters.requires_auth);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('[navigation] Error fetching:', error);
        throw error;
      }

      console.log('[navigation] Fetched:', data?.length, 'items');
      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('[navigation] Error in getNavigationItems:', error);
      throw error;
    }
  }

  /**
   * Get active navigation items for public display (build menu tree)
   * @returns Hierarchical navigation tree
   */
  static async getActiveNavigationTree(): Promise<NavigationTree[]> {
    try {
      console.log('[navigation] Fetching active navigation tree');

      const { data, error } = await this.supabase
        .from('navigation_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[navigation] Error fetching tree:', error);
        throw error;
      }

      // Build hierarchical tree structure
      const tree = this.buildNavigationTree(data || []);
      console.log('[navigation] Built tree with', tree.length, 'root items');
      return tree;
    } catch (error) {
      console.error('[navigation] Error in getActiveNavigationTree:', error);
      throw error;
    }
  }

  /**
   * Build hierarchical tree from flat navigation items array
   * @param items - Flat array of navigation items
   * @returns Nested tree structure
   */
  private static buildNavigationTree(items: NavigationItem[]): NavigationTree[] {
    const itemMap = new Map<string, NavigationTree>();
    const rootItems: NavigationTree[] = [];

    // First pass: create map of all items
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree structure
    items.forEach((item) => {
      const treeItem = itemMap.get(item.id)!;

      if (item.parent_id && itemMap.has(item.parent_id)) {
        // Add to parent's children
        const parent = itemMap.get(item.parent_id)!;
        parent.children.push(treeItem);
      } else {
        // Top-level item
        rootItems.push(treeItem);
      }
    });

    return rootItems;
  }

  /**
   * Get navigation item by ID
   * @param id - Navigation item UUID
   * @returns Navigation item or null
   */
  static async getNavigationItemById(id: string): Promise<NavigationItem | null> {
    try {
      console.log('[navigation] Fetching by ID:', id);

      const { data, error } = await this.supabase
        .from('navigation_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('[navigation] Item not found:', id);
          return null;
        }
        throw error;
      }

      console.log('[navigation] Fetched item:', data.id);
      return data;
    } catch (error) {
      console.error('[navigation] Error in getNavigationItemById:', error);
      throw error;
    }
  }

  /**
   * Create new navigation item
   * @param dto - Navigation item data
   * @returns Created navigation item
   */
  static async createNavigationItem(
    dto: CreateNavigationItemDto
  ): Promise<NavigationItem> {
    try {
      console.log('[navigation] Creating item:', dto.label);

      // Calculate depth based on parent
      let depth = 0;
      if (dto.parent_id) {
        const parent = await this.getNavigationItemById(dto.parent_id);
        if (parent) {
          depth = parent.depth + 1;
        }
      }

      const { data, error } = await this.supabase
        .from('navigation_items')
        .insert([{ ...dto, depth, target: dto.target || '_self' }])
        .select()
        .single();

      if (error) {
        console.error('[navigation] Error creating:', error);
        throw error;
      }

      console.log('[navigation] Created item:', data.id);
      return data;
    } catch (error) {
      console.error('[navigation] Error in createNavigationItem:', error);
      throw error;
    }
  }

  /**
   * Update existing navigation item
   * @param dto - Updated navigation item data
   * @returns Updated navigation item
   */
  static async updateNavigationItem(
    dto: UpdateNavigationItemDto
  ): Promise<NavigationItem> {
    try {
      const { id, ...updates } = dto;
      console.log('[navigation] Updating item:', id);

      // Recalculate depth if parent changed
      if (updates.parent_id !== undefined) {
        if (updates.parent_id) {
          const parent = await this.getNavigationItemById(updates.parent_id);
          if (parent) {
            (updates as any).depth = parent.depth + 1;
          }
        } else {
          (updates as any).depth = 0;
        }
      }

      const { data, error } = await this.supabase
        .from('navigation_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[navigation] Error updating:', error);
        throw error;
      }

      console.log('[navigation] Updated item:', data.id);
      return data;
    } catch (error) {
      console.error('[navigation] Error in updateNavigationItem:', error);
      throw error;
    }
  }

  /**
   * Delete navigation item
   * @param id - Navigation item UUID
   * @returns Success status
   */
  static async deleteNavigationItem(id: string): Promise<boolean> {
    try {
      console.log('[navigation] Deleting item:', id);

      const { error } = await this.supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[navigation] Error deleting:', error);
        throw error;
      }

      console.log('[navigation] Deleted item:', id);
      return true;
    } catch (error) {
      console.error('[navigation] Error in deleteNavigationItem:', error);
      throw error;
    }
  }

  /**
   * Reorder navigation items
   * @param items - Array of {id, display_order} pairs
   * @returns Success status
   */
  static async reorderNavigationItems(
    items: Array<{ id: string; display_order: number }>
  ): Promise<boolean> {
    try {
      console.log('[navigation] Reordering items:', items.length);

      // Update each item's display_order
      const promises = items.map(({ id, display_order }) =>
        this.supabase
          .from('navigation_items')
          .update({ display_order })
          .eq('id', id)
      );

      const results = await Promise.all(promises);

      const hasError = results.some((result) => result.error);
      if (hasError) {
        console.error('[navigation] Error reordering items');
        throw new Error('Failed to reorder some items');
      }

      console.log('[navigation] Reordered items successfully');
      return true;
    } catch (error) {
      console.error('[navigation] Error in reorderNavigationItems:', error);
      throw error;
    }
  }
}
