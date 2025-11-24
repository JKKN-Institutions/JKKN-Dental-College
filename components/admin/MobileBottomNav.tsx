'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Menu,
  Plus,
  X,
  Sparkles,
  ImageIcon,
  Settings,
  Bell,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Navigation items with badge support
interface NavItem {
  id: string
  name: string
  href: string
  icon: LucideIcon
  badge?: number
}

const mobileNavigation: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'users',
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    id: 'content',
    name: 'Content',
    href: '/admin/content/hero-sections',
    icon: FileText,
  },
  {
    id: 'inquiries',
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
    badge: 3, // Example badge - can be made dynamic
  },
]

// Quick action items for FAB menu
interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  onClick?: () => void
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'activity',
    label: 'New Activity',
    icon: Sparkles,
    href: '/admin/activities/new',
    color: 'bg-purple-500',
  },
  {
    id: 'media',
    label: 'Upload Media',
    icon: ImageIcon,
    href: '/admin/media',
    color: 'bg-blue-500',
  },
  {
    id: 'announcement',
    label: 'Announcement',
    icon: Bell,
    href: '/admin/content/announcements/new',
    color: 'bg-orange-500',
  },
]

interface MobileBottomNavProps {
  onMenuClick: () => void
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isFabOpen, setIsFabOpen] = useState(false)

  // Close FAB when navigating
  useEffect(() => {
    setIsFabOpen(false)
  }, [pathname])

  // Get scale based on hover position (dock-style magnification)
  const getScale = (itemId: string, index: number) => {
    if (!hoveredId) return 1
    const hoveredIndex = mobileNavigation.findIndex(item => item.id === hoveredId)
    if (hoveredIndex === -1) return 1
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return 1.15
    if (distance === 1) return 1.05
    return 1
  }

  return (
    <>
      {/* FAB Backdrop */}
      <AnimatePresence>
        {isFabOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsFabOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navigation Container */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden pointer-events-none"
        style={{
          zIndex: 45,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          paddingLeft: '12px',
          paddingRight: '12px',
        }}
      >
        {/* Quick Action FAB Menu */}
        <AnimatePresence>
          {isFabOpen && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.8,
                      transition: { delay: (quickActions.length - index) * 0.03 }
                    }}
                  >
                    {action.href ? (
                      <Link
                        href={action.href}
                        className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                        onClick={() => setIsFabOpen(false)}
                      >
                        <div className={cn('p-2 rounded-full', action.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          {action.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          action.onClick?.()
                          setIsFabOpen(false)
                        }}
                        className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                      >
                        <div className={cn('p-2 rounded-full', action.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          {action.label}
                        </span>
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Floating Navigation Bar */}
        <nav
          className="pointer-events-auto mx-auto"
          style={{ maxWidth: '440px' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {/* Glassmorphism Container */}
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 dark:border-gray-700/50 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent dark:from-gray-800/30 pointer-events-none" />

            <div className="relative flex items-center justify-around px-2 py-2">
              {/* Left Navigation Items */}
              {mobileNavigation.slice(0, 2).map((item, index) => {
                const isActive = pathname?.startsWith(item.href)
                const scale = getScale(item.id, index)
                const Icon = item.icon

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      'relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl transition-all duration-200',
                      isActive
                        ? 'text-primary-green'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                    style={{ transform: `scale(${scale})` }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active indicator background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-green/10 dark:bg-primary-green/20 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-0.5 right-1/4 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}

                    <Icon
                      className={cn(
                        'w-6 h-6 mb-0.5 transition-all duration-200 relative z-10',
                        isActive && 'scale-105'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-medium truncate w-full text-center relative z-10',
                        isActive && 'font-semibold'
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}

              {/* Center FAB Button */}
              <div className="relative flex items-center justify-center px-1">
                <motion.button
                  type="button"
                  onClick={() => setIsFabOpen(!isFabOpen)}
                  className={cn(
                    'relative w-14 h-14 -mt-6 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br from-primary-green to-emerald-600',
                    'shadow-lg shadow-primary-green/30',
                    'transition-all duration-300',
                    'hover:shadow-xl hover:shadow-primary-green/40',
                    'active:scale-95',
                    isFabOpen && 'rotate-45 from-gray-700 to-gray-800 shadow-gray-500/30'
                  )}
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={isFabOpen}
                  aria-label={isFabOpen ? 'Close quick actions' : 'Open quick actions'}
                >
                  {/* Glow effect */}
                  <div className={cn(
                    'absolute inset-0 rounded-full bg-gradient-to-br from-primary-green to-emerald-600 blur-lg opacity-50 transition-opacity',
                    isFabOpen && 'opacity-0'
                  )} />

                  <motion.div
                    animate={{ rotate: isFabOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    {isFabOpen ? (
                      <X className="w-6 h-6 text-white" />
                    ) : (
                      <Plus className="w-7 h-7 text-white" />
                    )}
                  </motion.div>
                </motion.button>

                {/* FAB active indicator dot */}
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-primary-green rounded-full opacity-0" />
              </div>

              {/* Right Navigation Items */}
              {mobileNavigation.slice(2).map((item, index) => {
                const isActive = pathname?.startsWith(item.href)
                const scale = getScale(item.id, index + 2)
                const Icon = item.icon

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      'relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl transition-all duration-200',
                      isActive
                        ? 'text-primary-green'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                    style={{ transform: `scale(${scale})` }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active indicator background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-green/10 dark:bg-primary-green/20 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-0.5 right-1/4 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}

                    <Icon
                      className={cn(
                        'w-6 h-6 mb-0.5 transition-all duration-200 relative z-10',
                        isActive && 'scale-105'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-medium truncate w-full text-center relative z-10',
                        isActive && 'font-semibold'
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}

              {/* Menu Button */}
              <button
                type="button"
                onClick={onMenuClick}
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95 transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 mb-0.5" strokeWidth={2} />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  More
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
