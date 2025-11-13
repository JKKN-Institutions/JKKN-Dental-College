// =====================================================
// ALUMNI SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing alumni testimonials
// CRUD operations for alumni stories that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const alumniSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  batch: z.string().min(1, "Batch is required"),
  course: z.string().min(1, "Course is required"),
  current_position: z.string().min(1, "Current position is required"),
  company: z.string().min(1, "Company is required"),
  testimonial: z.string().min(1, "Testimonial is required"),
  image_url: z.string().url("Must be a valid URL").optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type AlumniInput = z.infer<typeof alumniSchema>;

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  course: string;
  current_position: string;
  company: string;
  testimonial: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL ALUMNI
// =====================================================

export async function getAllAlumni(): Promise<{
  success: boolean;
  data?: Alumni[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .order("display_order", { ascending: true })
      .order("batch", { ascending: false });

    if (error) {
      console.error("[getAllAlumni] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Alumni[] };
  } catch (error) {
    console.error("[getAllAlumni] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE ALUMNI (For website display)
// =====================================================

export async function getActiveAlumni(): Promise<{
  success: boolean;
  data?: Alumni[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("batch", { ascending: false });

    if (error) {
      console.error("[getActiveAlumni] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Alumni[] };
  } catch (error) {
    console.error("[getActiveAlumni] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE ALUMNI
// =====================================================

export async function createAlumni(
  input: AlumniInput
): Promise<{
  success: boolean;
  data?: Alumni;
  error?: string;
}> {
  try {
    const validated = alumniSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("alumni")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createAlumni] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Alumni };
  } catch (error) {
    console.error("[createAlumni] Error:", error);
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
// UPDATE ALUMNI
// =====================================================

export async function updateAlumni(
  id: string,
  input: Partial<AlumniInput>
): Promise<{
  success: boolean;
  data?: Alumni;
  error?: string;
}> {
  try {
    const validated = alumniSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("alumni")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateAlumni] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Alumni };
  } catch (error) {
    console.error("[updateAlumni] Error:", error);
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
// DELETE ALUMNI
// =====================================================

export async function deleteAlumni(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("alumni").delete().eq("id", id);

    if (error) {
      console.error("[deleteAlumni] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteAlumni] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE ALUMNI ACTIVE STATUS
// =====================================================

export async function toggleAlumniStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: Alumni;
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
      .from("alumni")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleAlumniStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Alumni };
  } catch (error) {
    console.error("[toggleAlumniStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
