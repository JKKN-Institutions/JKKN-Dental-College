// =====================================================
// PAST EVENTS SECTION FORM
// =====================================================
// Purpose: Form for managing Past Events section content
// Allows add/edit/delete of event items dynamically from database
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HomeSection } from "@/types/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { HiPlus, HiTrash, HiSave, HiPencil, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "sonner";
import {
  getAllPastEvents,
  createPastEvent,
  updatePastEvent,
  deletePastEvent,
  togglePastEventStatus,
  type PastEvent,
  type PastEventsInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/past-events-actions";

interface PastEventsSectionFormProps {
  section: HomeSection;
}

const eventItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL"),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().optional(),
  attendees: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type EventItemFormValues = z.infer<typeof eventItemSchema>;

export function PastEventsSectionForm({ section }: PastEventsSectionFormProps) {
  const [eventItems, setEventItems] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<EventItemFormValues>({
    resolver: zodResolver(eventItemSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      event_date: new Date().toISOString().split("T")[0],
      location: "",
      attendees: undefined,
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadEventItems();
  }, []);

  const loadEventItems = async () => {
    setIsLoading(true);
    const result = await getAllPastEvents();
    if (result.success && result.data) {
      setEventItems(result.data);
    } else {
      toast.error(result.error || "Failed to load events");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: EventItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: PastEventsInput = {
        title: values.title,
        description: values.description,
        image_url: values.image_url,
        event_date: values.event_date,
        location: values.location,
        attendees: values.attendees,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updatePastEvent(editingId, input);
        if (result.success) {
          toast.success("Event updated successfully!");
        }
      } else {
        result = await createPastEvent(input);
        if (result.success) {
          toast.success("Event created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save event");
        return;
      }

      form.reset({
        title: "",
        description: "",
        image_url: "",
        event_date: new Date().toISOString().split("T")[0],
        location: "",
        attendees: undefined,
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadEventItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[PastEventsSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event: PastEvent) => {
    setEditingId(event.id);
    form.reset({
      title: event.title,
      description: event.description,
      image_url: event.image_url,
      event_date: event.event_date,
      location: event.location || "",
      attendees: event.attendees || undefined,
      is_active: event.is_active,
      display_order: event.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const result = await deletePastEvent(id);
    if (result.success) {
      toast.success("Event deleted successfully!");
      await loadEventItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete event");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await togglePastEventStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Event ${!currentStatus ? "activated" : "deactivated"}`);
      await loadEventItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      title: "",
      description: "",
      image_url: "",
      event_date: new Date().toISOString().split("T")[0],
      location: "",
      attendees: undefined,
      is_active: true,
      display_order: 0,
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Event" : "Add New Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Sports Day 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the event..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Full URL to the event image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Campus Auditorium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attendees */}
                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of people who attended
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Display Order */}
                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Is Active */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Show this event on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Event" : "Add Event"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({eventItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading events...</div>
          ) : eventItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No events yet</p>
              <p className="text-sm text-gray-400">Add your first event using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Image</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Location</th>
                    <th className="text-left p-3 font-semibold">Attendees</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventItems.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{event.display_order}</td>
                      <td className="p-3">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {event.description}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">{event.location || "N/A"}</td>
                      <td className="p-3 text-sm">{event.attendees || "N/A"}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={event.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(event.id, event.is_active)}
                        >
                          {event.is_active ? (
                            <>
                              <HiEye className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <HiEyeOff className="w-4 h-4 mr-1" />
                              Inactive
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(event.id)}
                          >
                            <HiTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
