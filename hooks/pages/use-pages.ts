// =====================================================
// PAGES HOOKS
// =====================================================
// Purpose: React hooks for pages state management
// Module: pages
// Layer: Hooks (State Management)
// =====================================================

import { useState, useCallback, useEffect } from 'react';
import { PagesService } from '@/lib/services/pages/pages-service';
import type {
  Page,
  PageFilters,
  PageResponse,
  CreatePageDto,
  UpdatePageDto,
} from '@/types/pages';

// =====================================================
// HOOK 1: usePages
// Purpose: Fetch paginated list of pages with filters
// Used in: Admin panel list view
// =====================================================

export function usePages(
  initialFilters: PageFilters = {},
  initialPage = 1,
  initialPageSize = 20
) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<PageFilters>(initialFilters);

  // Serialize filters to prevent infinite re-renders
  const filterKey = JSON.stringify(filters);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: PageResponse = await PagesService.getPages(filters, page, pageSize);

      setPages(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('[pages/hooks] Error fetching pages:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch pages'));
      setPages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page, pageSize]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const refetch = useCallback(() => {
    fetchPages();
  }, [fetchPages]);

  const updateFilters = useCallback((newFilters: PageFilters) => {
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
    pages,
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
// HOOK 2: usePage
// Purpose: Fetch single page by ID
// Used in: Admin panel edit forms
// =====================================================

export function usePage(id: string | null) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(async () => {
    if (!id) {
      setPage(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedPage = await PagesService.getPageById(id);
      setPage(fetchedPage);
    } catch (err) {
      console.error('[pages/hooks] Error fetching page:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch page'));
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const refetch = useCallback(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    page,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 3: usePageBySlug
// Purpose: Fetch page by slug (for public viewing)
// Used in: Dynamic page routing
// =====================================================

export function usePageBySlug(slug: string | null) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug) {
      setPage(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedPage = await PagesService.getPageBySlug(slug);
      setPage(fetchedPage);
    } catch (err) {
      console.error('[pages/hooks] Error fetching page by slug:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch page'));
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const refetch = useCallback(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    page,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 4: usePageMutations
// Purpose: CRUD operations for pages
// Used in: Admin panel forms and actions
// =====================================================

export function usePageMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPage = useCallback(async (dto: CreatePageDto): Promise<Page | null> => {
    try {
      setLoading(true);
      setError(null);

      const newPage = await PagesService.createPage(dto);
      return newPage;
    } catch (err) {
      console.error('[pages/hooks] Error creating page:', err);
      setError(err instanceof Error ? err : new Error('Failed to create page'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePage = useCallback(async (dto: UpdatePageDto): Promise<Page | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedPage = await PagesService.updatePage(dto);
      return updatedPage;
    } catch (err) {
      console.error('[pages/hooks] Error updating page:', err);
      setError(err instanceof Error ? err : new Error('Failed to update page'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePage = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await PagesService.deletePage(id);
      return success;
    } catch (err) {
      console.error('[pages/hooks] Error deleting page:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete page'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePublish = useCallback(
    async (id: string, publish: boolean): Promise<Page | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedPage = await PagesService.togglePublish(id, publish);
        return updatedPage;
      } catch (err) {
        console.error('[pages/hooks] Error toggling publish status:', err);
        setError(err instanceof Error ? err : new Error('Failed to toggle publish status'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    togglePublish,
  };
}
