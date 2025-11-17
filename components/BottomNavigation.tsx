'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Info, Building2, Phone, Shield } from 'lucide-react';
import { useNavigationTree } from '@/hooks/navigation/use-navigation';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  isExternal?: boolean;
}

// Default navigation items for bottom nav
const defaultNavItems: NavItem[] = [
  { name: 'Home', href: '#hero', icon: Home },
  { name: 'About', href: '#about', icon: Info },
  { name: 'Institutions', href: '#institutions', icon: Building2 },
  { name: 'Contact', href: '#contact', icon: Phone },
  { name: 'Admin', href: '/admin/dashboard', icon: Shield, isExternal: true },
];

export default function BottomNavigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hasNotifications, setHasNotifications] = useState(true); // For badge demo

  // Fetch navigation items from database (optional - using defaults for bottom nav)
  const { navigationTree } = useNavigationTree();

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = defaultNavItems.map(item => ({
        id: item.href.startsWith('#') ? item.href.substring(1) : '',
        element: item.href.startsWith('#') ? document.querySelector(item.href) : null
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          // Consider section active if it's in the viewport
          if (rect.top <= 300 && rect.bottom > 300) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    // Check if it's an anchor link
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active section immediately for better UX
        setActiveSection(href.substring(1));
      }
      return;
    }

    // Otherwise, navigate to the route
    window.location.href = href;
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-2 left-2 right-2 z-40 lg:hidden rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0b6d41 0%, #0a5d37 100%)',
        boxShadow: '0 4px 24px rgba(11, 109, 65, 0.5), 0 -4px 20px rgba(11, 109, 65, 0.3)',
      }}
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffde59] via-[#fbfbee] to-[#ffde59] opacity-80 rounded-t-3xl" />

      <div className="px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around">
          {defaultNavItems.map((item, index) => {
            const Icon = item.icon;
            const sectionId = item.href.startsWith('#') ? item.href.substring(1) : '';
            const isActive = !item.isExternal && activeSection === sectionId;

            return (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2"
                whileTap={{ scale: 0.95 }}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
                aria-label={`Navigate to ${item.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon Container */}
                <div className="relative">
                  {/* Active state background glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -m-2 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 222, 89, 0.4) 0%, transparent 70%)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      className={`w-[18px] h-[18px] transition-all duration-300 ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                          : 'text-white/60'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />

                    {/* Notification Badge - Show on Admin button */}
                    {item.name === 'Admin' && hasNotifications && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-[9px] font-bold text-white">3</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60'
                  }`}
                >
                  {item.name}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#ffde59' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Safe area padding for devices with notch */}
      <style jsx>{`
        .pb-safe {
          padding-bottom: max(0.375rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </motion.nav>
  );
}
