// =====================================================
// COLLEGE NEWS SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing college news items
// CRUD operations for news cards that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const collegeNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL"),
  published_date: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type CollegeNewsInput = z.infer<typeof collegeNewsSchema>;

export interface CollegeNews {
  id: string;
  title: string;
  description: string;
  image_url: string;
  published_date: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL NEWS
// =====================================================

export async function getAllCollegeNews(): Promise<{
  success: boolean;
  data?: CollegeNews[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("college_news")
      .select("*")
      .order("display_order", { ascending: true })
      .order("published_date", { ascending: false });

    if (error) {
      console.error("[getAllCollegeNews] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CollegeNews[] };
  } catch (error) {
    console.error("[getAllCollegeNews] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE NEWS (For website display)
// =====================================================

export async function getActiveCollegeNews(): Promise<{
  success: boolean;
  data?: CollegeNews[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("college_news")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("published_date", { ascending: false });

    if (error) {
      console.error("[getActiveCollegeNews] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CollegeNews[] };
  } catch (error) {
    console.error("[getActiveCollegeNews] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET SINGLE NEWS ITEM
// =====================================================

export async function getCollegeNewsById(
  id: string
): Promise<{
  success: boolean;
  data?: CollegeNews;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("college_news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getCollegeNewsById] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CollegeNews };
  } catch (error) {
    console.error("[getCollegeNewsById] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE NEWS ITEM
// =====================================================

export async function createCollegeNews(
  input: CollegeNewsInput
): Promise<{
  success: boolean;
  data?: CollegeNews;
  error?: string;
}> {
  try {
    // Validate input
    const validated = collegeNewsSchema.parse(input);

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Insert news item
    const { data, error } = await supabase
      .from("college_news")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createCollegeNews] Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CollegeNews };
  } catch (error) {
    console.error("[createCollegeNews] Error:", error);
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
// UPDATE NEWS ITEM
// =====================================================

export async function updateCollegeNews(
  id: string,
  input: Partial<CollegeNewsInput>
): Promise<{
  success: boolean;
  data?: CollegeNews;
  error?: string;
}> {
  try {
    // Validate input (partial)
    const validated = collegeNewsSchema.partial().parse(input);

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Update news item
    const { data, error } = await supabase
      .from("college_news")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateCollegeNews] Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CollegeNews };
  } catch (error) {
    console.error("[updateCollegeNews] Error:", error);
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
// DELETE NEWS ITEM
// =====================================================

export async function deleteCollegeNews(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("college_news").delete().eq("id", id);

    if (error) {
      console.error("[deleteCollegeNews] Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteCollegeNews] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE NEWS ACTIVE STATUS
// =====================================================

export async function toggleCollegeNewsStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: CollegeNews;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("college_news")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleCollegeNewsStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CollegeNews };
  } catch (error) {
    console.error("[toggleCollegeNewsStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
