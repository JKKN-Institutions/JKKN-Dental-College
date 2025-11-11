'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileNavigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Content',
    href: '/admin/content/hero-sections',
    icon: FileText,
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
]

interface MobileBottomNavProps {
  onMenuClick: () => void
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary-green shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden"
      style={{
        zIndex: 9999,
        minHeight: '60px',
      }}
    >
      <nav className="flex items-center justify-around px-2 py-2 pb-safe h-full">
        {mobileNavigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg transition-all',
                isActive
                  ? 'text-primary-green'
                  : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
              )}
            >
              <item.icon className={cn(
                'w-6 h-6 mb-1 transition-all',
                isActive && 'scale-110'
              )} />
              <span className={cn(
                'text-[9px] font-medium truncate w-full text-center leading-tight',
                isActive && 'font-bold'
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg text-gray-600 hover:text-gray-900 active:bg-gray-100 transition-all"
        >
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-medium truncate w-full text-center leading-tight">
            More
          </span>
        </button>
      </nav>
    </div>
  )
}
