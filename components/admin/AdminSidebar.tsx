'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  MessageSquare,
  BarChart3,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Video,
  Bell,
  Award,
  Menu,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions, type PermissionModule } from '@/lib/permissions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Type definitions for navigation structure
type NavItemWithChildren = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  children: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    module: PermissionModule;
  }[];
};

type NavItemWithHref = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  module: PermissionModule;
};

type NavItem = NavItemWithChildren | NavItemWithHref;

type NavGroup = {
  groupLabel: string;
  items: NavItem[];
};

// Navigation structure with module mapping for permission checking
const navigation: NavGroup[] = [
  {
    groupLabel: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        module: 'dashboard' as PermissionModule
      }
    ]
  },
  {
    groupLabel: 'Access Management',
    items: [
      {
        name: 'User Management',
        href: '/admin/users',
        icon: Users,
        module: 'users' as PermissionModule
      },
      {
        name: 'Role Management',
        href: '/admin/roles',
        icon: Shield,
        module: 'roles' as PermissionModule
      }
    ]
  },
  {
    groupLabel: 'Activities',
    items: [
      {
        name: 'Activities',
        icon: Sparkles,
        children: [
          {
            name: 'All Activities',
            href: '/admin/activities',
            icon: Sparkles,
            module: 'activities' as PermissionModule
          },
          {
            name: 'Categories',
            href: '/admin/activities/categories',
            icon: Tag,
            module: 'activities' as PermissionModule
          }
        ]
      }
    ]
  },
  {
    groupLabel: 'Content Management',
    items: [
      {
        name: 'Content',
        icon: FileText,
        children: [
          {
            name: 'Navigation',
            href: '/admin/content/navigation',
            icon: Menu,
            module: 'navigation' as PermissionModule
          },
          {
            name: 'Hero Section',
            href: '/admin/content/hero-sections',
            icon: Home,
            module: 'hero_sections' as PermissionModule
          },
          {
            name: 'Announcements',
            href: '/admin/content/announcements',
            icon: Bell,
            module: 'announcements' as PermissionModule
          },
          {
            name: 'Benefits',
            href: '/admin/content/benefits',
            icon: Award,
            module: 'benefits' as PermissionModule
          },
          {
            name: 'Statistics',
            href: '/admin/content/statistics',
            icon: BarChart3,
            module: 'statistics' as PermissionModule
          },
          {
            name: 'Videos',
            href: '/admin/content/videos',
            icon: Video,
            module: 'campus_videos' as PermissionModule
          }
        ]
      }
    ]
  },
  {
    groupLabel: 'System',
    items: [
      {
        name: 'Inquiries',
        href: '/admin/inquiries',
        icon: MessageSquare,
        module: 'contact_submissions' as PermissionModule
      },
      {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        module: 'activity_logs' as PermissionModule
      },
      {
        name: 'Media Library',
        href: '/admin/media',
        icon: ImageIcon,
        module: 'media_library' as PermissionModule
      },
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        module: 'settings' as PermissionModule
      }
    ]
  }
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Type guard to check if an item has children
function hasChildren(item: NavItem): item is NavItemWithChildren {
  return 'children' in item;
}

export function AdminSidebar({
  isMobileOpen = false,
  onMobileClose
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content']);
  const { accessibleModules, isSuperAdmin, loading } = usePermissions();

  // Filter navigation items based on user permissions
  const filteredNavigation = useMemo(() => {
    // Super admin sees everything
    if (isSuperAdmin) {
      return navigation;
    }

    // For custom_role users, filter based on permissions
    return navigation
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            // If item has children (like Content menu)
            if (hasChildren(item)) {
              const accessibleChildren = item.children.filter((child) =>
                accessibleModules.includes(child.module)
              );

              // If no children are accessible, hide the parent
              if (accessibleChildren.length === 0) return null;

              return { ...item, children: accessibleChildren };
            }

            // For regular items, check if module is accessible
            if (accessibleModules.includes(item.module)) {
              return item;
            }

            return null;
          })
          .filter((item): item is NavItem => item !== null);

        // If no items are accessible in this group, hide the group
        if (filteredItems.length === 0) return null;

        return { ...group, items: filteredItems };
      })
      .filter((group): group is NavGroup => group !== null);
  }, [isSuperAdmin, accessibleModules]);

  // Close mobile menu on route change
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose();
    }
  }, [pathname, onMobileClose]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          'fixed lg:relative inset-y-0 left-0 z-50',
          // Desktop styles
          'lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile styles
          'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className='h-16 flex items-center justify-between px-4 border-b border-gray-200'>
          {/* Always show logo on mobile, conditionally on desktop */}
          <div
            className={cn(
              'flex items-center gap-2',
              'lg:flex',
              collapsed && 'lg:hidden'
            )}
          >
            <div className='w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>J</span>
            </div>
            <span className='font-bold text-gray-900'>JKKN Admin</span>
          </div>

          {/* Mobile Close Button */}
          <button
            type='button'
            onClick={onMobileClose}
            className='lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>

          {/* Desktop Collapse Button */}
          <button
            type='button'
            onClick={() => setCollapsed(!collapsed)}
            className='hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
          >
            {collapsed ? (
              <ChevronRight className='w-5 h-5 text-gray-600' />
            ) : (
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-hide'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin' />
            </div>
          ) : (
            filteredNavigation.map((group) => (
              <div key={group.groupLabel}>
                {/* Group Label */}
                <div
                  className={cn(
                    'px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider',
                    collapsed && 'lg:hidden'
                  )}
                >
                  {group.groupLabel}
                </div>

                {/* Divider for collapsed state */}
                {collapsed && (
                  <div className='hidden lg:block mb-2 mx-3 border-t border-gray-200' />
                )}

                {/* Group Items */}
                <div className='space-y-1'>
                  {group.items.map((item) => {
                    const isActive = !hasChildren(item)
                      ? pathname === item.href
                      : false;
                    const isExpanded = expandedItems.includes(item.name);

                    if (hasChildren(item)) {
                      return (
                        <div key={item.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type='button'
                                onClick={() => toggleExpand(item.name)}
                                className={cn(
                                  'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                  'hover:bg-gray-100 text-gray-700'
                                )}
                              >
                                <div className='flex items-center gap-3'>
                                  <item.icon className='w-5 h-5 flex-shrink-0' />
                                  <span className={cn(collapsed && 'lg:hidden')}>
                                    {item.name}
                                  </span>
                                </div>
                                <ChevronRight
                                  className={cn(
                                    'w-4 h-4 transition-transform',
                                    isExpanded && 'transform rotate-90',
                                    collapsed && 'lg:hidden'
                                  )}
                                />
                              </button>
                            </TooltipTrigger>
                            {collapsed && (
                              <TooltipContent side='right' className='hidden lg:block'>
                                <p>{item.name}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>

                          {/* Children - Show on mobile always when expanded, on desktop only when not collapsed */}
                          <div
                            className={cn(
                              'ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-200',
                              !isExpanded && 'hidden',
                              collapsed && 'lg:hidden'
                            )}
                          >
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isChildActive
                                      ? 'bg-primary-green/10 text-primary-green'
                                      : 'hover:bg-gray-100 text-gray-700'
                                  )}
                                >
                                  <child.icon className='w-4 h-4 flex-shrink-0' />
                                  <span>{child.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href!}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary-green text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                            )}
                          >
                            <item.icon className='w-5 h-5 flex-shrink-0' />
                            <span className={cn(collapsed && 'lg:hidden')}>
                              {item.name}
                            </span>
                          </Link>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side='right' className='hidden lg:block'>
                            <p>{item.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* View Website Link */}
        <div className='border-t border-gray-200 p-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='/'
                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors'
              >
                <Home className='w-5 h-5 flex-shrink-0' />
                <span className={cn(collapsed && 'lg:hidden')}>View Website</span>
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side='right' className='hidden lg:block'>
                <p>View Website</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
