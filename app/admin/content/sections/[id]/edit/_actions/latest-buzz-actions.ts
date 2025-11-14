// =====================================================
// LATEST BUZZ ACTIONS
// =====================================================
// Purpose: Server actions for managing latest buzz items
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LatestBuzz = {
  id: string;
  title: string;
  image_url: string;
  buzz_date: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type LatestBuzzInput = {
  title: string;
  image_url: string;
  buzz_date?: string;
  is_active?: boolean;
  display_order?: number;
};

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Get all latest buzz items (for admin panel)
export async function getAllLatestBuzz(): Promise<ActionResult<LatestBuzz[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("latest_buzz")
      .select("*")
      .order("display_order", { ascending: true })
      .order("buzz_date", { ascending: false });

    if (error) {
      console.error("[getAllLatestBuzz] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LatestBuzz[] };
  } catch (error) {
    console.error("[getAllLatestBuzz] Unexpected error:", error);
    return { success: false, error: "Failed to fetch latest buzz items" };
  }
}

// Get only active latest buzz items (for public website)
export async function getActiveLatestBuzz(): Promise<ActionResult<LatestBuzz[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("latest_buzz")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("buzz_date", { ascending: false });

    if (error) {
      console.error("[getActiveLatestBuzz] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LatestBuzz[] };
  } catch (error) {
    console.error("[getActiveLatestBuzz] Unexpected error:", error);
    return { success: false, error: "Failed to fetch active latest buzz items" };
  }
}

// Create a new latest buzz item
export async function createLatestBuzz(
  input: LatestBuzzInput
): Promise<ActionResult<LatestBuzz>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("latest_buzz")
      .insert({
        title: input.title,
        image_url: input.image_url,
        buzz_date: input.buzz_date || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createLatestBuzz] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LatestBuzz };
  } catch (error) {
    console.error("[createLatestBuzz] Unexpected error:", error);
    return { success: false, error: "Failed to create latest buzz item" };
  }
}

// Update an existing latest buzz item
export async function updateLatestBuzz(
  id: string,
  input: LatestBuzzInput
): Promise<ActionResult<LatestBuzz>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("latest_buzz")
      .update({
        title: input.title,
        image_url: input.image_url,
        buzz_date: input.buzz_date || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateLatestBuzz] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LatestBuzz };
  } catch (error) {
    console.error("[updateLatestBuzz] Unexpected error:", error);
    return { success: false, error: "Failed to update latest buzz item" };
  }
}

// Delete a latest buzz item
export async function deleteLatestBuzz(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("latest_buzz").delete().eq("id", id);

    if (error) {
      console.error("[deleteLatestBuzz] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteLatestBuzz] Unexpected error:", error);
    return { success: false, error: "Failed to delete latest buzz item" };
  }
}

// Toggle latest buzz item active status
export async function toggleLatestBuzzStatus(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("latest_buzz")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      console.error("[toggleLatestBuzzStatus] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[toggleLatestBuzzStatus] Unexpected error:", error);
    return { success: false, error: "Failed to toggle latest buzz status" };
  }
}
