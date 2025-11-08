'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Role Management',
    href: '/admin/roles',
    icon: Shield,
  },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Navigation', href: '/admin/content/navigation', icon: Menu },
      { name: 'Hero Section', href: '/admin/content/hero-sections', icon: Home },
      { name: 'Announcements', href: '/admin/content/announcements', icon: Bell },
      { name: 'Benefits', href: '/admin/content/benefits', icon: Award },
      { name: 'Statistics', href: '/admin/content/statistics', icon: BarChart3 },
      { name: 'Videos', href: '/admin/content/videos', icon: Video },
    ],
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Media Library',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content'])

  // Close mobile menu on route change
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose()
    }
  }, [pathname, onMobileClose])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {/* Always show logo on mobile, conditionally on desktop */}
        <div className={cn(
          "flex items-center gap-2",
          "lg:flex",
          collapsed && "lg:hidden"
        )}>
          <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-bold text-gray-900">JKKN Admin</span>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-hide">
        {navigation.map((item) => {
          const isActive = item.href ? pathname === item.href : false
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.name)

          if (hasChildren) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={cn(collapsed && "lg:hidden")}>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isExpanded && 'transform rotate-90',
                      collapsed && "lg:hidden"
                    )}
                  />
                </button>

                {/* Children - Show on mobile always when expanded, on desktop only when not collapsed */}
                <div className={cn(
                  "ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-200",
                  !isExpanded && "hidden",
                  collapsed && "lg:hidden"
                )}>
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
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
                        <child.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{child.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-green text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn(collapsed && "lg:hidden")}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* View Website Link */}
      <div className="border-t border-gray-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors"
          title={collapsed ? 'View Website' : undefined}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>View Website</span>
        </Link>
      </div>
    </aside>
    </>
  )
}
