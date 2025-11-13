// =====================================================
// LIFE AT JKKN SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing Life@JKKN photos
// CRUD operations for campus life photos that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const lifeAtJKKNSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL"),
  category: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type LifeAtJKKNInput = z.infer<typeof lifeAtJKKNSchema>;

export interface LifeAtJKKN {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL LIFE PHOTOS
// =====================================================

export async function getAllLifeAtJKKN(): Promise<{
  success: boolean;
  data?: LifeAtJKKN[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("life_at_jkkn")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllLifeAtJKKN] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LifeAtJKKN[] };
  } catch (error) {
    console.error("[getAllLifeAtJKKN] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE LIFE PHOTOS (For website display)
// =====================================================

export async function getActiveLifeAtJKKN(): Promise<{
  success: boolean;
  data?: LifeAtJKKN[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("life_at_jkkn")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getActiveLifeAtJKKN] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LifeAtJKKN[] };
  } catch (error) {
    console.error("[getActiveLifeAtJKKN] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE LIFE PHOTO
// =====================================================

export async function createLifeAtJKKN(
  input: LifeAtJKKNInput
): Promise<{
  success: boolean;
  data?: LifeAtJKKN;
  error?: string;
}> {
  try {
    const validated = lifeAtJKKNSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("life_at_jkkn")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createLifeAtJKKN] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LifeAtJKKN };
  } catch (error) {
    console.error("[createLifeAtJKKN] Error:", error);
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
// UPDATE LIFE PHOTO
// =====================================================

export async function updateLifeAtJKKN(
  id: string,
  input: Partial<LifeAtJKKNInput>
): Promise<{
  success: boolean;
  data?: LifeAtJKKN;
  error?: string;
}> {
  try {
    const validated = lifeAtJKKNSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("life_at_jkkn")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateLifeAtJKKN] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LifeAtJKKN };
  } catch (error) {
    console.error("[updateLifeAtJKKN] Error:", error);
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
// DELETE LIFE PHOTO
// =====================================================

export async function deleteLifeAtJKKN(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("life_at_jkkn").delete().eq("id", id);

    if (error) {
      console.error("[deleteLifeAtJKKN] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteLifeAtJKKN] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE LIFE PHOTO ACTIVE STATUS
// =====================================================

export async function toggleLifeAtJKKNStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: LifeAtJKKN;
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
      .from("life_at_jkkn")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleLifeAtJKKNStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as LifeAtJKKN };
  } catch (error) {
    console.error("[toggleLifeAtJKKNStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
