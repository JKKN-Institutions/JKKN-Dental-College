// =====================================================
// NAVIGATION FILTERS
// =====================================================
// Purpose: Search and filter controls for navigation items
// Module: navigation
// Layer: Components
// =====================================================

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiSearch, HiX } from "react-icons/hi";
import { NavigationItemFilters } from "@/types/navigation";

interface NavigationFiltersProps {
  onFilterChange: (filters: NavigationItemFilters) => void;
}

export function NavigationFilters({ onFilterChange }: NavigationFiltersProps) {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const [depth, setDepth] = useState<string>("all");
  const [requiresAuth, setRequiresAuth] = useState<string>("all");
  const [parentId, setParentId] = useState<string>("all");

  const handleApplyFilters = () => {
    const filters: NavigationItemFilters = {};

    if (search.trim()) {
      filters.search = search.trim();
    }

    if (isActive !== "all") {
      filters.is_active = isActive === "true";
    }

    if (depth !== "all") {
      filters.depth = parseInt(depth);
    }

    if (requiresAuth !== "all") {
      filters.requires_auth = requiresAuth === "true";
    }

    if (parentId === "null") {
      filters.parent_id = null;
    } else if (parentId !== "all") {
      filters.parent_id = parentId;
    }

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSearch("");
    setIsActive("all");
    setDepth("all");
    setRequiresAuth("all");
    setParentId("all");
    onFilterChange({});
  };

  const hasActiveFilters =
    search.trim() ||
    isActive !== "all" ||
    depth !== "all" ||
    requiresAuth !== "all" ||
    parentId !== "all";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by label or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleApplyFilters} className="bg-primary-green hover:bg-primary-green/90">
          <HiSearch className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={isActive} onValueChange={setIsActive}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level/Depth Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Level</label>
          <Select value={depth} onValueChange={setDepth}>
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="0">Top Level (0)</SelectItem>
              <SelectItem value="1">Submenu (1)</SelectItem>
              <SelectItem value="2">Nested (2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auth Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Authentication
          </label>
          <Select value={requiresAuth} onValueChange={setRequiresAuth}>
            <SelectTrigger>
              <SelectValue placeholder="All items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="true">Auth Required</SelectItem>
              <SelectItem value="false">Public Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Hierarchy</label>
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder="All items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="null">Top Level Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="text-gray-600"
          >
            <HiX className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
