'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigationTree } from '@/hooks/navigation/use-navigation';

// Fallback navigation items (used if database is empty)
const fallbackNavItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'News', href: '#news' },
  { name: 'Institutions', href: '#institutions' },
  { name: 'Why JKKN', href: '#why-choose' },
  { name: 'Campus Life', href: '#life-at-jkkn' },
  { name: 'Placements', href: '#recruiters' },
  { name: 'Alumni', href: '#alumni' },
  { name: 'Contact Us', href: '#contact' },
];

export default function FloatingNavButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Fetch navigation items from database
  const { navigationTree } = useNavigationTree();

  // Map database navigation items to component format
  const navItems = navigationTree.length > 0
    ? navigationTree.map(item => ({
        name: item.label,
        href: item.url,
        target: item.target,
      }))
    : fallbackNavItems.map(item => ({
        name: item.name,
        href: item.href,
        target: '_self' as const,
      }));

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.href.startsWith('#') ? item.href.substring(1) : '',
        element: item.href.startsWith('#') ? document.querySelector(item.href) : null
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scrollToSection = (href: string, target: string = '_self') => {
    // Check if it's an external link
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (target === '_blank') {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
      setIsOpen(false);
      return;
    }

    // Check if it's an anchor link
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
      return;
    }

    // Otherwise, treat it as an internal route
    window.location.href = href;
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-[#0b6d41] text-white shadow-lg flex items-center justify-center lg:hidden"
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
        transition={{ duration: 0.2 }}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Animated Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#0b6d41]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Plus Icon */}
        <Plus className="w-7 h-7 relative z-10" strokeWidth={2.5} />
      </motion.button>

      {/* Bottom Sheet Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            >
              <div className="bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto">
                {/* Drag Handle */}
                <div className="flex justify-center pt-4 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-[#0b6d41]">
                    Navigation Menu
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quick access to all sections
                  </p>
                </div>

                {/* Navigation Items */}
                <nav className="px-4 py-4 space-y-2">
                  {navItems.map((item, index) => {
                    const sectionId = item.href.startsWith('#') ? item.href.substring(1) : '';
                    const isActive = activeSection === sectionId && sectionId !== '';

                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => scrollToSection(item.href, item.target)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-semibold text-base flex items-center justify-between ${
                          isActive
                            ? 'bg-[#0b6d41] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-[#0b6d41] active:text-white'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                        }}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Footer Spacing */}
                <div className="h-6" />
              </div>

              {/* Custom Styles */}
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }

                div::-webkit-scrollbar-track {
                  background: transparent;
                }

                div::-webkit-scrollbar-thumb {
                  background: #d1d5db;
                  border-radius: 3px;
                }

                div::-webkit-scrollbar-thumb:hover {
                  background: #9ca3af;
                }

                /* Touch devices support */
                @media (hover: none) {
                  nav button:active {
                    background-color: #0b6d41 !important;
                    color: white !important;
                    transform: scale(0.98);
                  }
                }
              `}</style>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
