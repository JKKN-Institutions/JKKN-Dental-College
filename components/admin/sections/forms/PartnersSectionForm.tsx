// =====================================================
// PARTNERS SECTION FORM
// =====================================================
// Purpose: Form for managing Supporting Partners section content
// Allows add/edit/delete of partner logo items dynamically from database
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
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartnerStatus,
  type Partner,
  type PartnersInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/partners-actions";

interface PartnersSectionFormProps {
  section: HomeSection;
}

const partnerItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo_url: z.string().url("Must be a valid URL"),
  website_url: z.string().url("Must be a valid URL").optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type PartnerItemFormValues = z.infer<typeof partnerItemSchema>;

export function PartnersSectionForm({ section }: PartnersSectionFormProps) {
  const [partnerItems, setPartnerItems] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<PartnerItemFormValues>({
    resolver: zodResolver(partnerItemSchema),
    defaultValues: {
      name: "",
      logo_url: "",
      website_url: "",
      description: "",
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadPartnerItems();
  }, []);

  const loadPartnerItems = async () => {
    setIsLoading(true);
    const result = await getAllPartners();
    if (result.success && result.data) {
      setPartnerItems(result.data);
    } else {
      toast.error(result.error || "Failed to load partners");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: PartnerItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: PartnersInput = {
        name: values.name,
        logo_url: values.logo_url,
        website_url: values.website_url,
        description: values.description,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updatePartner(editingId, input);
        if (result.success) {
          toast.success("Partner updated successfully!");
        }
      } else {
        result = await createPartner(input);
        if (result.success) {
          toast.success("Partner created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save partner");
        return;
      }

      form.reset({
        name: "",
        logo_url: "",
        website_url: "",
        description: "",
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadPartnerItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[PartnersSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    form.reset({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url || "",
      description: partner.description || "",
      is_active: partner.is_active,
      display_order: partner.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) {
      return;
    }

    const result = await deletePartner(id);
    if (result.success) {
      toast.success("Partner deleted successfully!");
      await loadPartnerItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete partner");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await togglePartnerStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Partner ${!currentStatus ? "activated" : "deactivated"}`);
      await loadPartnerItems();
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
      description: "",
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
            {editingId ? "Edit Partner" : "Add New Partner"}
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
                    <FormLabel>Partner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Corporation" {...field} />
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
                      Full URL to the partner's logo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website URL */}
              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://partner-website.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional link to partner's website
                    </FormDescription>
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
                        placeholder="Brief description of the partnership..."
                        rows={3}
                        {...field}
                      />
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
                        Show this partner on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Partner" : "Add Partner"}
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

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners ({partnerItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading partners...</div>
          ) : partnerItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No partners yet</p>
              <p className="text-sm text-gray-400">Add your first partner using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Logo</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Website</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerItems.map((partner) => (
                    <tr key={partner.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{partner.display_order}</td>
                      <td className="p-3">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="w-20 h-12 object-contain"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{partner.name}</div>
                        {partner.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {partner.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        {partner.website_url ? (
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit
                          </a>
                        ) : "N/A"}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={partner.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(partner.id, partner.is_active)}
                        >
                          {partner.is_active ? (
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
                            onClick={() => handleEdit(partner)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(partner.id)}
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
