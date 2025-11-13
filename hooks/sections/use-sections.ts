// =====================================================
// SECTIONS HOOKS
// =====================================================
// Purpose: React hooks for home sections state management
// Module: sections
// Layer: Hooks (State Management)
// =====================================================

import { useState, useCallback, useEffect } from 'react';
import { SectionsService } from '@/lib/services/sections/sections-service';
import type {
  HomeSection,
  SectionFilters,
  SectionResponse,
  CreateSectionDto,
  UpdateSectionDto,
  ReorderSectionsDto,
} from '@/types/sections';

// =====================================================
// HOOK 1: useSections
// Purpose: Fetch paginated list of sections with filters
// Used in: Admin panel list view
// =====================================================

export function useSections(
  initialFilters: SectionFilters = {},
  initialPage = 1,
  initialPageSize = 50
) {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SectionFilters>(initialFilters);

  // Serialize filters to prevent infinite re-renders
  const filterKey = JSON.stringify(filters);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: SectionResponse = await SectionsService.getSections(
        filters,
        page,
        pageSize
      );

      setSections(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('[sections/hooks] Error fetching sections:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sections'));
      setSections([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page, pageSize]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const refetch = useCallback(() => {
    fetchSections();
  }, [fetchSections]);

  const updateFilters = useCallback((newFilters: SectionFilters) => {
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
    sections,
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
// HOOK 2: useVisibleSections
// Purpose: Fetch all visible sections for frontend rendering
// Used in: Home page
// =====================================================

export function useVisibleSections() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedSections = await SectionsService.getVisibleSections();
      setSections(fetchedSections);
    } catch (err) {
      console.error('[sections/hooks] Error fetching visible sections:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch visible sections'));
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const refetch = useCallback(() => {
    fetchSections();
  }, [fetchSections]);

  return {
    sections,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 3: useSection
// Purpose: Fetch single section by ID
// Used in: Admin panel edit forms
// =====================================================

export function useSection(id: string | null) {
  const [section, setSection] = useState<HomeSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSection = useCallback(async () => {
    if (!id) {
      setSection(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedSection = await SectionsService.getSectionById(id);
      setSection(fetchedSection);
    } catch (err) {
      console.error('[sections/hooks] Error fetching section:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch section'));
      setSection(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  const refetch = useCallback(() => {
    fetchSection();
  }, [fetchSection]);

  return {
    section,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 4: useSectionByKey
// Purpose: Fetch section by key
// Used in: Specific section rendering
// =====================================================

export function useSectionByKey(sectionKey: string | null) {
  const [section, setSection] = useState<HomeSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSection = useCallback(async () => {
    if (!sectionKey) {
      setSection(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedSection = await SectionsService.getSectionByKey(sectionKey);
      setSection(fetchedSection);
    } catch (err) {
      console.error('[sections/hooks] Error fetching section by key:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch section'));
      setSection(null);
    } finally {
      setLoading(false);
    }
  }, [sectionKey]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  const refetch = useCallback(() => {
    fetchSection();
  }, [fetchSection]);

  return {
    section,
    loading,
    error,
    refetch,
  };
}

// =====================================================
// HOOK 5: useSectionMutations
// Purpose: CRUD operations for sections
// Used in: Admin panel forms and actions
// =====================================================

export function useSectionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSection = useCallback(
    async (dto: CreateSectionDto): Promise<HomeSection | null> => {
      try {
        setLoading(true);
        setError(null);

        const newSection = await SectionsService.createSection(dto);
        return newSection;
      } catch (err) {
        console.error('[sections/hooks] Error creating section:', err);
        setError(err instanceof Error ? err : new Error('Failed to create section'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateSection = useCallback(
    async (dto: UpdateSectionDto): Promise<HomeSection | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedSection = await SectionsService.updateSection(dto);
        return updatedSection;
      } catch (err) {
        console.error('[sections/hooks] Error updating section:', err);
        setError(err instanceof Error ? err : new Error('Failed to update section'));
        throw err; // Throw error instead of returning null
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSection = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await SectionsService.deleteSection(id);
      return success;
    } catch (err) {
      console.error('[sections/hooks] Error deleting section:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete section'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleVisibility = useCallback(
    async (id: string, isVisible: boolean): Promise<HomeSection | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedSection = await SectionsService.toggleVisibility(id, isVisible);
        return updatedSection;
      } catch (err) {
        console.error('[sections/hooks] Error toggling visibility:', err);
        setError(err instanceof Error ? err : new Error('Failed to toggle visibility'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reorderSections = useCallback(async (dto: ReorderSectionsDto): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await SectionsService.reorderSections(dto);
      return success;
    } catch (err) {
      console.error('[sections/hooks] Error reordering sections:', err);
      setError(err instanceof Error ? err : new Error('Failed to reorder sections'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSection,
    updateSection,
    deleteSection,
    toggleVisibility,
    reorderSections,
  };
}
