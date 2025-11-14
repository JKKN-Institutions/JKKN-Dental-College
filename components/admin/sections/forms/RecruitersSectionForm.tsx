// =====================================================
// RECRUITERS SECTION FORM
// =====================================================
// Purpose: Form for managing Our Recruiters section content
// Allows add/edit/delete of recruiter logo items dynamically from database
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
  getAllRecruiters,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
  toggleRecruiterStatus,
  type Recruiter,
  type RecruitersInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/recruiters-actions";

interface RecruitersSectionFormProps {
  section: HomeSection;
}

const recruiterItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo_url: z.string().url("Must be a valid URL"),
  website_url: z.string().url("Must be a valid URL").optional(),
  industry: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type RecruiterItemFormValues = z.infer<typeof recruiterItemSchema>;

export function RecruitersSectionForm({ section }: RecruitersSectionFormProps) {
  const [recruiterItems, setRecruiterItems] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<RecruiterItemFormValues>({
    resolver: zodResolver(recruiterItemSchema),
    defaultValues: {
      name: "",
      logo_url: "",
      website_url: "",
      industry: "",
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadRecruiterItems();
  }, []);

  const loadRecruiterItems = async () => {
    setIsLoading(true);
    const result = await getAllRecruiters();
    if (result.success && result.data) {
      setRecruiterItems(result.data);
    } else {
      toast.error(result.error || "Failed to load recruiters");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: RecruiterItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: RecruitersInput = {
        name: values.name,
        logo_url: values.logo_url,
        website_url: values.website_url,
        industry: values.industry,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updateRecruiter(editingId, input);
        if (result.success) {
          toast.success("Recruiter updated successfully!");
        }
      } else {
        result = await createRecruiter(input);
        if (result.success) {
          toast.success("Recruiter created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save recruiter");
        return;
      }

      form.reset({
        name: "",
        logo_url: "",
        website_url: "",
        industry: "",
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadRecruiterItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[RecruitersSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (recruiter: Recruiter) => {
    setEditingId(recruiter.id);
    form.reset({
      name: recruiter.name,
      logo_url: recruiter.logo_url,
      website_url: recruiter.website_url || "",
      industry: recruiter.industry || "",
      is_active: recruiter.is_active,
      display_order: recruiter.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recruiter?")) {
      return;
    }

    const result = await deleteRecruiter(id);
    if (result.success) {
      toast.success("Recruiter deleted successfully!");
      await loadRecruiterItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete recruiter");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleRecruiterStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Recruiter ${!currentStatus ? "activated" : "deactivated"}`);
      await loadRecruiterItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      name: "",
      logo_url: "",
      website_url: "",
      industry: "",
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
            {editingId ? "Edit Recruiter" : "Add New Recruiter"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="TCS, Infosys, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo URL */}
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Full URL to the company's logo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website URL */}
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://company-website.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Industry */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="IT, Healthcare, Manufacturing, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        Show this recruiter on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Recruiter" : "Add Recruiter"}
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

      {/* Recruiters Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Recruiters ({recruiterItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading recruiters...</div>
          ) : recruiterItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recruiters yet</p>
              <p className="text-sm text-gray-400">Add your first recruiter using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Logo</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Industry</th>
                    <th className="text-left p-3 font-semibold">Website</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterItems.map((recruiter) => (
                    <tr key={recruiter.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{recruiter.display_order}</td>
                      <td className="p-3">
                        <img
                          src={recruiter.logo_url}
                          alt={recruiter.name}
                          className="w-20 h-12 object-contain"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{recruiter.name}</div>
                      </td>
                      <td className="p-3 text-sm">{recruiter.industry || "N/A"}</td>
                      <td className="p-3 text-sm">
                        {recruiter.website_url ? (
                          <a href={recruiter.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit
                          </a>
                        ) : "N/A"}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={recruiter.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(recruiter.id, recruiter.is_active)}
                        >
                          {recruiter.is_active ? (
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
                            onClick={() => handleEdit(recruiter)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(recruiter.id)}
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
