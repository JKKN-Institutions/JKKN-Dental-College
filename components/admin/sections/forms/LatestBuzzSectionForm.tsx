// =====================================================
// LATEST BUZZ SECTION FORM
// =====================================================
// Purpose: Form for managing Latest Buzz section content
// Allows add/edit/delete of buzz photo items dynamically from database
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HomeSection } from "@/types/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getAllLatestBuzz,
  createLatestBuzz,
  updateLatestBuzz,
  deleteLatestBuzz,
  toggleLatestBuzzStatus,
  type LatestBuzz,
  type LatestBuzzInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/latest-buzz-actions";

interface LatestBuzzSectionFormProps {
  section: HomeSection;
}

const buzzItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  image_url: z.string().url("Must be a valid URL"),
  buzz_date: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type BuzzItemFormValues = z.infer<typeof buzzItemSchema>;

export function LatestBuzzSectionForm({ section }: LatestBuzzSectionFormProps) {
  const [buzzItems, setBuzzItems] = useState<LatestBuzz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<BuzzItemFormValues>({
    resolver: zodResolver(buzzItemSchema),
    defaultValues: {
      title: "",
      image_url: "",
      buzz_date: new Date().toISOString().split("T")[0],
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadBuzzItems();
  }, []);

  const loadBuzzItems = async () => {
    setIsLoading(true);
    const result = await getAllLatestBuzz();
    if (result.success && result.data) {
      setBuzzItems(result.data);
    } else {
      toast.error(result.error || "Failed to load buzz items");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: BuzzItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: LatestBuzzInput = {
        title: values.title,
        image_url: values.image_url,
        buzz_date: values.buzz_date,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updateLatestBuzz(editingId, input);
        if (result.success) {
          toast.success("Buzz item updated successfully!");
        }
      } else {
        result = await createLatestBuzz(input);
        if (result.success) {
          toast.success("Buzz item created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save buzz item");
        return;
      }

      form.reset({
        title: "",
        image_url: "",
        buzz_date: new Date().toISOString().split("T")[0],
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadBuzzItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[LatestBuzzSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (buzz: LatestBuzz) => {
    setEditingId(buzz.id);
    form.reset({
      title: buzz.title,
      image_url: buzz.image_url,
      buzz_date: buzz.buzz_date || new Date().toISOString().split("T")[0],
      is_active: buzz.is_active,
      display_order: buzz.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this buzz item?")) {
      return;
    }

    const result = await deleteLatestBuzz(id);
    if (result.success) {
      toast.success("Buzz item deleted successfully!");
      await loadBuzzItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete buzz item");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleLatestBuzzStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Buzz item ${!currentStatus ? "activated" : "deactivated"}`);
      await loadBuzzItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      title: "",
      image_url: "",
      buzz_date: new Date().toISOString().split("T")[0],
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
            {editingId ? "Edit Buzz Item" : "Add New Buzz Item"}
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
                      <Input placeholder="Sports Day Celebrations" {...field} />
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
                      Full URL to the buzz photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buzz Date */}
                <FormField
                  control={form.control}
                  name="buzz_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                        Show this buzz item on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Item" : "Add Item"}
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

      {/* Buzz Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Buzz Items ({buzzItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading buzz items...</div>
          ) : buzzItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No buzz items yet</p>
              <p className="text-sm text-gray-400">Add your first buzz item using the form above</p>
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
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buzzItems.map((buzz) => (
                    <tr key={buzz.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{buzz.display_order}</td>
                      <td className="p-3">
                        <img
                          src={buzz.image_url}
                          alt={buzz.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{buzz.title}</div>
                      </td>
                      <td className="p-3 text-sm">
                        {buzz.buzz_date
                          ? new Date(buzz.buzz_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={buzz.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(buzz.id, buzz.is_active)}
                        >
                          {buzz.is_active ? (
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
                            onClick={() => handleEdit(buzz)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(buzz.id)}
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
