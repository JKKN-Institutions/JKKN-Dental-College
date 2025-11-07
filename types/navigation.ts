// =====================================================
// NAVIGATION TYPES
// =====================================================
// Purpose: TypeScript interfaces for navigation module
// Module: navigation
// Layer: Types
// =====================================================

/**
 * Main navigation item entity
 * Represents a menu item with support for nested submenus
 */
export interface NavigationItem {
  // Primary Key
  id: string;

  // Navigation Data
  label: string; // Display text (e.g., "Home", "About Us")
  url: string; // Link destination (e.g., "/", "/about")
  icon?: string; // Optional icon name or URL
  target: '_self' | '_blank'; // Link target (same window or new tab)

  // Hierarchy
  parent_id?: string; // Reference to parent menu item (null for top-level)
  display_order: number; // Sort order within the same level
  depth: number; // 0 = top level, 1 = submenu, 2 = nested submenu
  children?: NavigationItem[]; // Nested child items (populated in frontend)

  // Visibility
  is_active: boolean; // Show/hide item
  is_featured: boolean; // Highlight in UI (optional)

  // Access Control
  requires_auth: boolean; // Require user to be logged in
  allowed_roles?: string[]; // Roles that can see this item (e.g., ['admin', 'user'])

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

/**
 * DTO for creating a new navigation item
 * Only includes user-provided fields
 */
export interface CreateNavigationItemDto {
  label: string;
  url: string;
  icon?: string;
  target?: '_self' | '_blank';
  parent_id?: string;
  display_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  requires_auth?: boolean;
  allowed_roles?: string[];
}

/**
 * DTO for updating an existing navigation item
 * All fields optional except id
 */
export interface UpdateNavigationItemDto {
  id: string;
  label?: string;
  url?: string;
  icon?: string;
  target?: '_self' | '_blank';
  parent_id?: string;
  display_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  requires_auth?: boolean;
  allowed_roles?: string[];
}

/**
 * Filter interface for searching and filtering navigation items
 */
export interface NavigationItemFilters {
  search?: string; // Search in label or url
  is_active?: boolean; // Filter by active status
  parent_id?: string | null; // Filter by parent (null for top-level only)
  depth?: number; // Filter by depth level
  requires_auth?: boolean; // Filter by auth requirement
}

/**
 * Response interface for paginated navigation item lists
 */
export interface NavigationItemResponse {
  data: NavigationItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Nested navigation tree structure
 * Used for rendering hierarchical menus
 */
export interface NavigationTree extends NavigationItem {
  children: NavigationTree[];
}
