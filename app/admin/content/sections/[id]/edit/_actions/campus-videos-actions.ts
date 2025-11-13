// =====================================================
// CAMPUS VIDEOS SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing campus videos
// CRUD operations for video items that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const campusVideosSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  video_url: z.string().url("Must be a valid URL"),
  thumbnail_url: z.string().url("Must be a valid URL").optional(),
  duration: z.number().int().positive().optional(),
  order_index: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export type CampusVideosInput = z.infer<typeof campusVideosSchema>;

export interface CampusVideo {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  order_index: number;
  is_active: boolean;
  view_count: number;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// GET ALL VIDEOS
// =====================================================

export async function getAllCampusVideos(): Promise<{
  success: boolean;
  data?: CampusVideo[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campus_videos")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllCampusVideos] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CampusVideo[] };
  } catch (error) {
    console.error("[getAllCampusVideos] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE VIDEOS (For website display)
// =====================================================

export async function getActiveCampusVideos(): Promise<{
  success: boolean;
  data?: CampusVideo[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campus_videos")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getActiveCampusVideos] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CampusVideo[] };
  } catch (error) {
    console.error("[getActiveCampusVideos] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE VIDEO
// =====================================================

export async function createCampusVideo(
  input: CampusVideosInput
): Promise<{
  success: boolean;
  data?: CampusVideo;
  error?: string;
}> {
  try {
    const validated = campusVideosSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("campus_videos")
      .insert({
        ...validated,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createCampusVideo] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CampusVideo };
  } catch (error) {
    console.error("[createCampusVideo] Error:", error);
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
// UPDATE VIDEO
// =====================================================

export async function updateCampusVideo(
  id: string,
  input: Partial<CampusVideosInput>
): Promise<{
  success: boolean;
  data?: CampusVideo;
  error?: string;
}> {
  try {
    const validated = campusVideosSchema.partial().parse(input);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campus_videos")
      .update(validated)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateCampusVideo] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CampusVideo };
  } catch (error) {
    console.error("[updateCampusVideo] Error:", error);
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
// DELETE VIDEO
// =====================================================

export async function deleteCampusVideo(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("campus_videos").delete().eq("id", id);

    if (error) {
      console.error("[deleteCampusVideo] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deleteCampusVideo] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE VIDEO ACTIVE STATUS
// =====================================================

export async function toggleCampusVideoStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: CampusVideo;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campus_videos")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[toggleCampusVideoStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as CampusVideo };
  } catch (error) {
    console.error("[toggleCampusVideoStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
