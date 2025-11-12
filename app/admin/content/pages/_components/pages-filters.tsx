// =====================================================
// PAGES FILTERS
// =====================================================

"use client";

import { useState } from "react";
import { PageFilters } from "@/types/pages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiSearch, HiX } from "react-icons/hi";

interface PagesFiltersProps {
  onFilterChange: (filters: PageFilters) => void;
}

export function PagesFilters({ onFilterChange }: PagesFiltersProps) {
  const [search, setSearch] = useState("");
  const [isPublished, setIsPublished] = useState<string>("all");
  const [templateType, setTemplateType] = useState<string>("all");

  const handleApplyFilters = () => {
    const filters: PageFilters = {};

    if (search.trim()) {
      filters.search = search.trim();
    }

    if (isPublished !== "all") {
      filters.is_published = isPublished === "published";
    }

    if (templateType !== "all") {
      filters.template_type = templateType as any;
    }

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSearch("");
    setIsPublished("all");
    setTemplateType("all");
    onFilterChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Search */}
      <div className="md:col-span-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative mt-1">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="search"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={isPublished} onValueChange={setIsPublished}>
          <SelectTrigger id="status" className="mt-1">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Filter */}
      <div>
        <Label htmlFor="template">Template</Label>
        <Select value={templateType} onValueChange={setTemplateType}>
          <SelectTrigger id="template" className="mt-1">
            <SelectValue placeholder="All templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="full-width">Full Width</SelectItem>
            <SelectItem value="sidebar">Sidebar</SelectItem>
            <SelectItem value="landing">Landing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="md:col-span-4 flex gap-2">
        <Button onClick={handleApplyFilters} className="bg-primary-green hover:bg-primary-green/90">
          <HiSearch className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} variant="outline">
          <HiX className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
