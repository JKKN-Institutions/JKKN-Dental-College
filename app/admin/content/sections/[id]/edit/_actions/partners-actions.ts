// =====================================================
// PARTNERS SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing supporting partners
// CRUD operations for partner logos that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const partnersSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo_url: z.string().url("Must be a valid URL"),
  website_url: z.string().url("Must be a valid URL").optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type PartnersInput = z.infer<typeof partnersSchema>;

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL PARTNERS
// =====================================================

export async function getAllPartners(): Promise<{
  success: boolean;
  data?: Partner[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("[getAllPartners] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Partner[] };
  } catch (error) {
    console.error("[getAllPartners] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE PARTNERS (For website display)
// =====================================================

export async function getActivePartners(): Promise<{
  success: boolean;
  data?: Partner[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("[getActivePartners] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Partner[] };
  } catch (error) {
    console.error("[getActivePartners] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE PARTNER
// =====================================================

export async function createPartner(
  input: PartnersInput
): Promise<{
  success: boolean;
  data?: Partner;
  error?: string;
}> {
  try {
    const validated = partnersSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("partners")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createPartner] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Partner };
  } catch (error) {
    console.error("[createPartner] Error:", error);
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
// UPDATE PARTNER
// =====================================================

export async function updatePartner(
  id: string,
  input: Partial<PartnersInput>
): Promise<{
  success: boolean;
  data?: Partner;
  error?: string;
}> {
  try {
    const validated = partnersSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("partners")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updatePartner] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Partner };
  } catch (error) {
    console.error("[updatePartner] Error:", error);
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
// DELETE PARTNER
// =====================================================

export async function deletePartner(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("partners").delete().eq("id", id);

    if (error) {
      console.error("[deletePartner] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deletePartner] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE PARTNER ACTIVE STATUS
// =====================================================

export async function togglePartnerStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: Partner;
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
      .from("partners")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[togglePartnerStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as Partner };
  } catch (error) {
    console.error("[togglePartnerStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
