// =====================================================
// PAST EVENTS SERVER ACTIONS
// =====================================================
// Purpose: Server actions for managing past events
// CRUD operations for event cards that appear on the website
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const pastEventsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL"),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().optional(),
  attendees: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type PastEventsInput = z.infer<typeof pastEventsSchema>;

export interface PastEvent {
  id: string;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  location: string | null;
  attendees: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// =====================================================
// GET ALL EVENTS
// =====================================================

export async function getAllPastEvents(): Promise<{
  success: boolean;
  data?: PastEvent[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("past_events")
      .select("*")
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[getAllPastEvents] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PastEvent[] };
  } catch (error) {
    console.error("[getAllPastEvents] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// GET ACTIVE EVENTS (For website display)
// =====================================================

export async function getActivePastEvents(): Promise<{
  success: boolean;
  data?: PastEvent[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("past_events")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[getActivePastEvents] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PastEvent[] };
  } catch (error) {
    console.error("[getActivePastEvents] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// CREATE EVENT
// =====================================================

export async function createPastEvent(
  input: PastEventsInput
): Promise<{
  success: boolean;
  data?: PastEvent;
  error?: string;
}> {
  try {
    const validated = pastEventsSchema.parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("past_events")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createPastEvent] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as PastEvent };
  } catch (error) {
    console.error("[createPastEvent] Error:", error);
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
// UPDATE EVENT
// =====================================================

export async function updatePastEvent(
  id: string,
  input: Partial<PastEventsInput>
): Promise<{
  success: boolean;
  data?: PastEvent;
  error?: string;
}> {
  try {
    const validated = pastEventsSchema.partial().parse(input);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("past_events")
      .update({
        ...validated,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updatePastEvent] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as PastEvent };
  } catch (error) {
    console.error("[updatePastEvent] Error:", error);
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
// DELETE EVENT
// =====================================================

export async function deletePastEvent(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("past_events").delete().eq("id", id);

    if (error) {
      console.error("[deletePastEvent] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deletePastEvent] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================================================
// TOGGLE EVENT ACTIVE STATUS
// =====================================================

export async function togglePastEventStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  data?: PastEvent;
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
      .from("past_events")
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[togglePastEventStatus] Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as PastEvent };
  } catch (error) {
    console.error("[togglePastEventStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
