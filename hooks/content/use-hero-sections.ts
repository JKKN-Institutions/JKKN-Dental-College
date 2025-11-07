// =====================================================
// USE HERO SECTIONS HOOK
// =====================================================
// Purpose: React state management for hero sections
// Module: content/hero-sections
// Layer: Hooks (State Management)
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeroSectionService } from '@/lib/services/content/hero-section-service';
import type {
  HeroSection,
  HeroSectionFilters,
} from '@/types/hero-section';

/**
 * Hook for managing multiple hero sections with pagination
 */
export function useHeroSections(filters: HeroSectionFilters = {}) {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Serialize filters to prevent infinite re-renders
  const filterKey = JSON.stringify(filters);

  const fetchHeroSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await HeroSectionService.getHeroSections(
        filters,
        page,
        pageSize
      );

      setHeroSections(response.data);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch hero sections';
      setError(message);
      console.error('[hooks/hero-sections] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  useEffect(() => {
    fetchHeroSections();
  }, [fetchHeroSections]);

  return {
    heroSections,
    loading,
    error,
    total,
    page,
    setPage,
    pageSize,
    refetch: fetchHeroSections,
  };
}

/**
 * Hook for managing single hero section (for detail/edit pages)
 */
export function useHeroSection(id: string | null) {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroSection = useCallback(async () => {
    if (!id) {
      setHeroSection(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await HeroSectionService.getHeroSectionById(id);
      setHeroSection(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch hero section';
      setError(message);
      console.error('[hooks/hero-section] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHeroSection();
  }, [fetchHeroSection]);

  return {
    heroSection,
    loading,
    error,
    refetch: fetchHeroSection,
  };
}

/**
 * Hook for getting active hero section (for public display)
 */
export function useActiveHeroSection() {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveHeroSection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await HeroSectionService.getActiveHeroSection();
      setHeroSection(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch active hero section';
      setError(message);
      console.error('[hooks/hero-section] Fetch active error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveHeroSection();
  }, [fetchActiveHeroSection]);

  return {
    heroSection,
    loading,
    error,
    refetch: fetchActiveHeroSection,
  };
}
