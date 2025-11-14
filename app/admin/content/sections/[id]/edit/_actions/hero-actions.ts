// =====================================================
// HERO SECTION ACTIONS
// =====================================================
// Purpose: Server actions for Hero Section CRUD operations in Home Sections
// =====================================================

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type HeroSection = {
  id: string;
  title: string;
  tagline: string;
  news_ticker_text: string | null;
  primary_cta_text: string;
  primary_cta_link: string | null;
  secondary_cta_text: string;
  secondary_cta_link: string | null;
  video_url: string | null;
  poster_image_url: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

export type HeroSectionInput = {
  title: string;
  tagline: string;
  news_ticker_text?: string | null;
  primary_cta_text: string;
  primary_cta_link?: string | null;
  secondary_cta_text: string;
  secondary_cta_link?: string | null;
  video_url?: string | null;
  poster_image_url?: string | null;
  is_active?: boolean;
  display_order?: number;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Get all hero sections
 */
export async function getAllHeroSections(): Promise<ActionResult<HeroSection[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[getAllHeroSections] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch hero sections',
    };
  }
}

/**
 * Get active hero section (for display on website)
 */
export async function getActiveHeroSection(): Promise<ActionResult<HeroSection | null>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('[getActiveHeroSection] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch active hero section',
    };
  }
}

/**
 * Create a new hero section
 */
export async function createHeroSection(
  input: HeroSectionInput
): Promise<ActionResult<HeroSection>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // If setting as active, deactivate all other hero sections first
    if (input.is_active) {
      await supabase
        .from('hero_sections')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await supabase
      .from('hero_sections')
      .insert({
        title: input.title,
        tagline: input.tagline,
        news_ticker_text: input.news_ticker_text,
        primary_cta_text: input.primary_cta_text,
        primary_cta_link: input.primary_cta_link,
        secondary_cta_text: input.secondary_cta_text,
        secondary_cta_link: input.secondary_cta_link,
        video_url: input.video_url,
        poster_image_url: input.poster_image_url,
        is_active: input.is_active ?? false,
        display_order: input.display_order ?? 0,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/content/hero-sections');
    revalidatePath('/admin/content/sections');

    return { success: true, data };
  } catch (error) {
    console.error('[createHeroSection] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create hero section',
    };
  }
}

/**
 * Update an existing hero section
 */
export async function updateHeroSection(
  id: string,
  input: HeroSectionInput
): Promise<ActionResult<HeroSection>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // If setting as active, deactivate all other hero sections first
    if (input.is_active) {
      await supabase.from('hero_sections').update({ is_active: false }).neq('id', id);
    }

    const { data, error } = await supabase
      .from('hero_sections')
      .update({
        title: input.title,
        tagline: input.tagline,
        news_ticker_text: input.news_ticker_text,
        primary_cta_text: input.primary_cta_text,
        primary_cta_link: input.primary_cta_link,
        secondary_cta_text: input.secondary_cta_text,
        secondary_cta_link: input.secondary_cta_link,
        video_url: input.video_url,
        poster_image_url: input.poster_image_url,
        is_active: input.is_active ?? false,
        display_order: input.display_order ?? 0,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/content/hero-sections');
    revalidatePath('/admin/content/sections');

    return { success: true, data };
  } catch (error) {
    console.error('[updateHeroSection] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update hero section',
    };
  }
}

/**
 * Delete a hero section
 */
export async function deleteHeroSection(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('hero_sections').delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/content/hero-sections');
    revalidatePath('/admin/content/sections');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('[deleteHeroSection] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete hero section',
    };
  }
}

/**
 * Toggle hero section active status
 */
export async function toggleHeroSectionStatus(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // If activating, deactivate all other hero sections first
    if (isActive) {
      await supabase.from('hero_sections').update({ is_active: false }).neq('id', id);
    }

    const { error } = await supabase
      .from('hero_sections')
      .update({
        is_active: isActive,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/content/hero-sections');
    revalidatePath('/admin/content/sections');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('[toggleHeroSectionStatus] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle hero section status',
    };
  }
}
