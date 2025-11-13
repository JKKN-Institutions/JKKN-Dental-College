// =====================================================
// RECRUITERS SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing college recruiters
// CRUD operations for recruiter logos that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const recruitersSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo_url: z.string().url("Must be a valid URL"),
  website_url: z.string().url("Must be a valid URL").optional(),
  industry: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type RecruitersInput = z.infer<typeof recruitersSchema>;

export interface Recruiter {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  industry: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL RECRUITERS
// =====================================================

export async function getAllRecruiters(): Promise<{
  success: boolean;
  data?: Recruiter[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("recruiters")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("[getAllRecruiters] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Recruiter[] };
  } catch (error) {
    console.error("[getAllRecruiters] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE RECRUITERS (For website display)
// =====================================================

export async function getActiveRecruiters(): Promise<{
  success: boolean;
  data?: Recruiter[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("recruiters")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("[getActiveRecruiters] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Recruiter[] };
  } catch (error) {
    console.error("[getActiveRecruiters] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE RECRUITER
// =====================================================

export async function createRecruiter(
  input: RecruitersInput
): Promise<{
  success: boolean;
  data?: Recruiter;
  error?: string;
}> {
  try {
    const validated = recruitersSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("recruiters")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createRecruiter] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Recruiter };
  } catch (error) {
    console.error("[createRecruiter] Error:", error);
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
// UPDATE RECRUITER
// =====================================================

export async function updateRecruiter(
  id: string,
  input: Partial<RecruitersInput>
): Promise<{
  success: boolean;
  data?: Recruiter;
  error?: string;
}> {
  try {
    const validated = recruitersSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("recruiters")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateRecruiter] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Recruiter };
  } catch (error) {
    console.error("[updateRecruiter] Error:", error);
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
// DELETE RECRUITER
// =====================================================

export async function deleteRecruiter(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("recruiters").delete().eq("id", id);

    if (error) {
      console.error("[deleteRecruiter] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteRecruiter] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE RECRUITER ACTIVE STATUS
// =====================================================

export async function toggleRecruiterStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: Recruiter;
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
      .from("recruiters")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleRecruiterStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Recruiter };
  } catch (error) {
    console.error("[toggleRecruiterStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
