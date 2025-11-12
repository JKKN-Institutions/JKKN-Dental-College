// =====================================================
// SECTIONS FILTERS
// =====================================================

"use client";

import { useState } from "react";
import { SectionFilters } from "@/types/sections";
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

interface SectionsFiltersProps {
  onFilterChange: (filters: SectionFilters) => void;
}

export function SectionsFilters({ onFilterChange }: SectionsFiltersProps) {
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState<string>("all");
  const [sectionType, setSectionType] = useState<string>("all");

  const handleApplyFilters = () => {
    const filters: SectionFilters = {};

    if (search.trim()) {
      filters.search = search.trim();
    }

    if (isVisible !== "all") {
      filters.is_visible = isVisible === "visible";
    }

    if (sectionType !== "all") {
      filters.section_type = sectionType as any;
    }

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSearch("");
    setIsVisible("all");
    setSectionType("all");
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
            placeholder="Search by title or key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            className="pl-9"
          />
        </div>
      </div>

      {/* Visibility Filter */}
      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <Select value={isVisible} onValueChange={setIsVisible}>
          <SelectTrigger id="visibility" className="mt-1">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div>
        <Label htmlFor="type">Section Type</Label>
        <Select value={sectionType} onValueChange={setSectionType}>
          <SelectTrigger id="type" className="mt-1">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hero">Hero</SelectItem>
            <SelectItem value="about">About</SelectItem>
            <SelectItem value="institutions">Institutions</SelectItem>
            <SelectItem value="why-choose">Why Choose</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="buzz">Buzz</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
            <SelectItem value="partners">Partners</SelectItem>
            <SelectItem value="recruiters">Recruiters</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
            <SelectItem value="life">Life</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
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
