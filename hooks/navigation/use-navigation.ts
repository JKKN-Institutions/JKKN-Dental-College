// =====================================================
// NAVIGATION HOOKS
// =====================================================
// Purpose: React hooks for navigation items state management
// Module: navigation
// Layer: Hooks (State Management)
// =====================================================

import { useState, useCallback, useEffect } from 'react';
import { NavigationService } from '@/lib/services/navigation/navigation-service';
import type {
  NavigationItem,
  NavigationItemFilters,
  NavigationItemResponse,
  NavigationTree,
  CreateNavigationItemDto,
  UpdateNavigationItemDto,
} from '@/types/navigation';

// =====================================================
// HOOK 1: useNavigationItems
// Purpose: Fetch paginated list of navigation items with filters
// Used in: Admin panel list view
// =====================================================

export function useNavigationItems(
  initialFilters: NavigationItemFilters = {},
  initialPage = 1,
  initialPageSize = 50
) {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<NavigationItemFilters>(initialFilters);

  // Serialize filters to prevent infinite re-renders
  const filterKey = JSON.stringify(filters);

  const fetchNavigationItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: NavigationItemResponse =
        await NavigationService.getNavigationItems(filters, page, pageSize);

      setNavigationItems(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('[navigation/hooks] Error fetching navigation items:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch navigation items'));
      setNavigationItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page, pageSize]);

  useEffect(() => {
    fetchNavigationItems();
  }, [fetchNavigationItems]);

  const refetch = useCallback(() => {
    fetchNavigationItems();
  }, [fetchNavigationItems]);

  const updateFilters = useCallback((newFilters: NavigationItemFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  return {
    navigationItems,
    loading,
    error,
    page,
    pageSize,
    total,
    filters,
    updateFilters,
    goToPage,
    changePageSize,
    refetch,
  };
}

// =====================================================
// HOOK 2: useNavigationItem
// Purpose: Fetch single navigation item by ID
// Used in: Admin panel edit forms
// =====================================================

export function useNavigationItem(id: string | null) {
  const [navigationItem, setNavigationItem] = useState<NavigationItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNavigationItem = useCallback(async () => {
    if (!id) {
      setNavigationItem(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const item = await NavigationService.getNavigationItemById(id);
      setNavigationItem(item);
    } catch (err) {
      console.error('[navigation/hooks] Error fetching navigation item:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch navigation item'));
      setNavigationItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNavigationItem();
  }, [fetchNavigationItem]);

  const refetch = useCallback(() => {
    fetchNavigationItem();
  }, [fetchNavigationItem]);

  return {
    navigationItem,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 3: useNavigationTree
// Purpose: Fetch active navigation tree for frontend menu
// Used in: Public website navigation component
// =====================================================

export function useNavigationTree() {
  const [navigationTree, setNavigationTree] = useState<NavigationTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNavigationTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tree = await NavigationService.getActiveNavigationTree();
      setNavigationTree(tree);
    } catch (err) {
      console.error('[navigation/hooks] Error fetching navigation tree:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch navigation tree'));
      setNavigationTree([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavigationTree();
  }, [fetchNavigationTree]);

  const refetch = useCallback(() => {
    fetchNavigationTree();
  }, [fetchNavigationTree]);

  return {
    navigationTree,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 4: useNavigationMutations
// Purpose: CRUD operations for navigation items
// Used in: Admin panel forms and actions
// =====================================================

export function useNavigationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNavigationItem = useCallback(
    async (dto: CreateNavigationItemDto): Promise<NavigationItem | null> => {
      try {
        setLoading(true);
        setError(null);

        const newItem = await NavigationService.createNavigationItem(dto);
        return newItem;
      } catch (err) {
        console.error('[navigation/hooks] Error creating navigation item:', err);
        setError(err instanceof Error ? err : new Error('Failed to create navigation item'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateNavigationItem = useCallback(
    async (dto: UpdateNavigationItemDto): Promise<NavigationItem | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedItem = await NavigationService.updateNavigationItem(dto);
        return updatedItem;
      } catch (err) {
        console.error('[navigation/hooks] Error updating navigation item:', err);
        setError(err instanceof Error ? err : new Error('Failed to update navigation item'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteNavigationItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await NavigationService.deleteNavigationItem(id);
      return success;
    } catch (err) {
      console.error('[navigation/hooks] Error deleting navigation item:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete navigation item'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderNavigationItems = useCallback(
    async (items: Array<{ id: string; display_order: number }>): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const success = await NavigationService.reorderNavigationItems(items);
        return success;
      } catch (err) {
        console.error('[navigation/hooks] Error reordering navigation items:', err);
        setError(err instanceof Error ? err : new Error('Failed to reorder navigation items'));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    reorderNavigationItems,
  };
}
