// =====================================================
// PAST EVENTS ACTIONS
// =====================================================
// Purpose: Server actions for managing past events
// =====================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PastEvent = {
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
};

export type PastEventsInput = {
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  location?: string;
  attendees?: number;
  is_active?: boolean;
  display_order?: number;
};

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Get all past events (for admin panel)
export async function getAllPastEvents(): Promise<ActionResult<PastEvent[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("past_events")
      .select("*")
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[getAllPastEvents] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PastEvent[] };
  } catch (error) {
    console.error("[getAllPastEvents] Unexpected error:", error);
    return { success: false, error: "Failed to fetch past events" };
  }
}

// Get only active past events (for public website)
export async function getActivePastEvents(): Promise<ActionResult<PastEvent[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("past_events")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[getActivePastEvents] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PastEvent[] };
  } catch (error) {
    console.error("[getActivePastEvents] Unexpected error:", error);
    return { success: false, error: "Failed to fetch active past events" };
  }
}

// Create a new past event
export async function createPastEvent(
  input: PastEventsInput
): Promise<ActionResult<PastEvent>> {
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
      .from("past_events")
      .insert({
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        event_date: input.event_date,
        location: input.location || null,
        attendees: input.attendees || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[createPastEvent] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as PastEvent };
  } catch (error) {
    console.error("[createPastEvent] Unexpected error:", error);
    return { success: false, error: "Failed to create past event" };
  }
}

// Update an existing past event
export async function updatePastEvent(
  id: string,
  input: PastEventsInput
): Promise<ActionResult<PastEvent>> {
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
      .from("past_events")
      .update({
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        event_date: input.event_date,
        location: input.location || null,
        attendees: input.attendees || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updatePastEvent] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true, data: data as PastEvent };
  } catch (error) {
    console.error("[updatePastEvent] Unexpected error:", error);
    return { success: false, error: "Failed to update past event" };
  }
}

// Delete a past event
export async function deletePastEvent(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("past_events").delete().eq("id", id);

    if (error) {
      console.error("[deletePastEvent] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[deletePastEvent] Unexpected error:", error);
    return { success: false, error: "Failed to delete past event" };
  }
}

// Toggle past event active status
export async function togglePastEventStatus(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("past_events")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      console.error("[togglePastEventStatus] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content/sections");

    return { success: true };
  } catch (error) {
    console.error("[togglePastEventStatus] Unexpected error:", error);
    return { success: false, error: "Failed to toggle past event status" };
  }
}
