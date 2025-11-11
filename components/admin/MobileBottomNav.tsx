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
      className="fixed bottom-0 left-0 right-0 lg:hidden pointer-events-none"
      style={{
        zIndex: 9999,
        padding: '0 16px 20px 16px', // Space from edges and bottom
      }}
    >
      {/* Floating Navigation Container */}
      <nav
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 pointer-events-auto"
        style={{
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        <div className="flex items-center justify-around px-3 py-3">
          {mobileNavigation.map((item) => {
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary-green/10 text-primary-green scale-105'
                    : 'text-gray-600 hover:text-gray-900 active:scale-95 active:bg-gray-100'
                )}
              >
                <item.icon
                  className={cn(
                    'w-6 h-6 mb-1 transition-all duration-200',
                    isActive && 'scale-110 stroke-[2.5]'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium truncate w-full text-center',
                    isActive && 'font-bold'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}

          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-xl text-gray-600 hover:text-gray-900 active:scale-95 active:bg-gray-100 transition-all duration-200"
          >
            <Menu className="w-6 h-6 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium truncate w-full text-center">
              More
            </span>
          </button>
        </div>
      </nav>
    </div>
  )
}
