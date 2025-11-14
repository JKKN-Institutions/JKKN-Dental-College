// =====================================================
// LIFE AT JKKN SECTION FORM
// =====================================================
// Purpose: Form for managing Life @ JKKN section content
// Allows add/edit/delete of campus life photo items dynamically from database
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
  getAllLifeAtJKKN,
  createLifeAtJKKN,
  updateLifeAtJKKN,
  deleteLifeAtJKKN,
  toggleLifeAtJKKNStatus,
  type LifeAtJKKN,
  type LifeAtJKKNInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/life-at-jkkn-actions";

interface LifeAtJKKNSectionFormProps {
  section: HomeSection;
}

const lifeItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL"),
  category: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type LifeItemFormValues = z.infer<typeof lifeItemSchema>;

export function LifeAtJKKNSectionForm({ section }: LifeAtJKKNSectionFormProps) {
  const [lifeItems, setLifeItems] = useState<LifeAtJKKN[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<LifeItemFormValues>({
    resolver: zodResolver(lifeItemSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      category: "",
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadLifeItems();
  }, []);

  const loadLifeItems = async () => {
    setIsLoading(true);
    const result = await getAllLifeAtJKKN();
    if (result.success && result.data) {
      setLifeItems(result.data);
    } else {
      toast.error(result.error || "Failed to load life photos");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: LifeItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: LifeAtJKKNInput = {
        title: values.title,
        description: values.description,
        image_url: values.image_url,
        category: values.category,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updateLifeAtJKKN(editingId, input);
        if (result.success) {
          toast.success("Photo updated successfully!");
        }
      } else {
        result = await createLifeAtJKKN(input);
        if (result.success) {
          toast.success("Photo created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save photo");
        return;
      }

      form.reset({
        title: "",
        description: "",
        image_url: "",
        category: "",
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadLifeItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[LifeAtJKKNSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (life: LifeAtJKKN) => {
    setEditingId(life.id);
    form.reset({
      title: life.title,
      description: life.description || "",
      image_url: life.image_url,
      category: life.category || "",
      is_active: life.is_active,
      display_order: life.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    const result = await deleteLifeAtJKKN(id);
    if (result.success) {
      toast.success("Photo deleted successfully!");
      await loadLifeItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete photo");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleLifeAtJKKNStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Photo ${!currentStatus ? "activated" : "deactivated"}`);
      await loadLifeItems();
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
      category: "",
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
            {editingId ? "Edit Photo" : "Add New Photo"}
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
                      <Input placeholder="Sports Activities" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the photo..."
                        rows={3}
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
                      Full URL to the campus life photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Sports, Cultural, Academic, etc." {...field} />
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
                        Show this photo on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Photo" : "Add Photo"}
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

      {/* Life Photos Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Life @ JKKN Photos ({lifeItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading photos...</div>
          ) : lifeItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No photos yet</p>
              <p className="text-sm text-gray-400">Add your first photo using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Image</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lifeItems.map((life) => (
                    <tr key={life.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{life.display_order}</td>
                      <td className="p-3">
                        <img
                          src={life.image_url}
                          alt={life.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{life.title}</div>
                        {life.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {life.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-sm">{life.category || "N/A"}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={life.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(life.id, life.is_active)}
                        >
                          {life.is_active ? (
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
                            onClick={() => handleEdit(life)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(life.id)}
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
