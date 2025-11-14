// =====================================================
// ALUMNI SECTION FORM
// =====================================================
// Purpose: Form for managing Our Alumni section content
// Allows add/edit/delete of alumni testimonial items dynamically from database
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
  getAllAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  toggleAlumniStatus,
  type Alumni,
  type AlumniInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/alumni-actions";

interface AlumniSectionFormProps {
  section: HomeSection;
}

const alumniItemSchema = z.object({
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

type AlumniItemFormValues = z.infer<typeof alumniItemSchema>;

export function AlumniSectionForm({ section }: AlumniSectionFormProps) {
  const [alumniItems, setAlumniItems] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AlumniItemFormValues>({
    resolver: zodResolver(alumniItemSchema),
    defaultValues: {
      name: "",
      batch: "",
      course: "",
      current_position: "",
      company: "",
      testimonial: "",
      image_url: "",
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadAlumniItems();
  }, []);

  const loadAlumniItems = async () => {
    setIsLoading(true);
    const result = await getAllAlumni();
    if (result.success && result.data) {
      setAlumniItems(result.data);
    } else {
      toast.error(result.error || "Failed to load alumni");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: AlumniItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: AlumniInput = {
        name: values.name,
        batch: values.batch,
        course: values.course,
        current_position: values.current_position,
        company: values.company,
        testimonial: values.testimonial,
        image_url: values.image_url,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updateAlumni(editingId, input);
        if (result.success) {
          toast.success("Alumni updated successfully!");
        }
      } else {
        result = await createAlumni(input);
        if (result.success) {
          toast.success("Alumni created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save alumni");
        return;
      }

      form.reset({
        name: "",
        batch: "",
        course: "",
        current_position: "",
        company: "",
        testimonial: "",
        image_url: "",
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadAlumniItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[AlumniSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (alumni: Alumni) => {
    setEditingId(alumni.id);
    form.reset({
      name: alumni.name,
      batch: alumni.batch,
      course: alumni.course,
      current_position: alumni.current_position,
      company: alumni.company,
      testimonial: alumni.testimonial,
      image_url: alumni.image_url || "",
      is_active: alumni.is_active,
      display_order: alumni.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni?")) {
      return;
    }

    const result = await deleteAlumni(id);
    if (result.success) {
      toast.success("Alumni deleted successfully!");
      await loadAlumniItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete alumni");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleAlumniStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Alumni ${!currentStatus ? "activated" : "deactivated"}`);
      await loadAlumniItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      name: "",
      batch: "",
      course: "",
      current_position: "",
      company: "",
      testimonial: "",
      image_url: "",
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
            {editingId ? "Edit Alumni" : "Add New Alumni"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Batch */}
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch *</FormLabel>
                      <FormControl>
                        <Input placeholder="2020, 2021-2023, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Course */}
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <FormControl>
                      <Input placeholder="B.Tech Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Position */}
                <FormField
                  control={form.control}
                  name="current_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Position *</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input placeholder="Google, Microsoft, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Testimonial */}
              <FormField
                control={form.control}
                name="testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write their testimonial about the college..."
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
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional alumni photo
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
                        Show this alumni on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Alumni" : "Add Alumni"}
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

      {/* Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Alumni ({alumniItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading alumni...</div>
          ) : alumniItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No alumni yet</p>
              <p className="text-sm text-gray-400">Add your first alumni using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Photo</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Batch</th>
                    <th className="text-left p-3 font-semibold">Position</th>
                    <th className="text-left p-3 font-semibold">Company</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alumniItems.map((alumni) => (
                    <tr key={alumni.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{alumni.display_order}</td>
                      <td className="p-3">
                        {alumni.image_url ? (
                          <img
                            src={alumni.image_url}
                            alt={alumni.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            No photo
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{alumni.name}</div>
                        <div className="text-sm text-gray-500">{alumni.course}</div>
                      </td>
                      <td className="p-3 text-sm">{alumni.batch}</td>
                      <td className="p-3 text-sm">{alumni.current_position}</td>
                      <td className="p-3 text-sm">{alumni.company}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={alumni.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(alumni.id, alumni.is_active)}
                        >
                          {alumni.is_active ? (
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
                            onClick={() => handleEdit(alumni)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(alumni.id)}
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
