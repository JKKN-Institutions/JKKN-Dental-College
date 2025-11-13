// =====================================================
// LATEST BUZZ SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing latest buzz items
// CRUD operations for buzz photos that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const latestBuzzSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  image_url: z.string().url("Must be a valid URL"),
  buzz_date: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type LatestBuzzInput = z.infer<typeof latestBuzzSchema>;

export interface LatestBuzz {
  id: string;
  title: string;
  image_url: string;
  buzz_date: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL BUZZ ITEMS
// =====================================================

export async function getAllLatestBuzz(): Promise<{
  success: boolean;
  data?: LatestBuzz[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("latest_buzz")
      .select("*")
      .order("display_order", { ascending: true })
      .order("buzz_date", { ascending: false });

    if (error) {
      console.error("[getAllLatestBuzz] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LatestBuzz[] };
  } catch (error) {
    console.error("[getAllLatestBuzz] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE BUZZ (For website display)
// =====================================================

export async function getActiveLatestBuzz(): Promise<{
  success: boolean;
  data?: LatestBuzz[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("latest_buzz")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("buzz_date", { ascending: false });

    if (error) {
      console.error("[getActiveLatestBuzz] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LatestBuzz[] };
  } catch (error) {
    console.error("[getActiveLatestBuzz] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE BUZZ ITEM
// =====================================================

export async function createLatestBuzz(
  input: LatestBuzzInput
): Promise<{
  success: boolean;
  data?: LatestBuzz;
  error?: string;
}> {
  try {
    const validated = latestBuzzSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("latest_buzz")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createLatestBuzz] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LatestBuzz };
  } catch (error) {
    console.error("[createLatestBuzz] Error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// UPDATE BUZZ ITEM
// =====================================================

export async function updateLatestBuzz(
  id: string,
  input: Partial<LatestBuzzInput>
): Promise<{
  success: boolean;
  data?: LatestBuzz;
  error?: string;
}> {
  try {
    const validated = latestBuzzSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("latest_buzz")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateLatestBuzz] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LatestBuzz };
  } catch (error) {
    console.error("[updateLatestBuzz] Error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// DELETE BUZZ ITEM
// =====================================================

export async function deleteLatestBuzz(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("latest_buzz").delete().eq("id", id);

    if (error) {
      console.error("[deleteLatestBuzz] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteLatestBuzz] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE BUZZ ACTIVE STATUS
// =====================================================

export async function toggleLatestBuzzStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: LatestBuzz;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("latest_buzz")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleLatestBuzzStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LatestBuzz };
  } catch (error) {
    console.error("[toggleLatestBuzzStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
