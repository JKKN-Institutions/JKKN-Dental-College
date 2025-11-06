"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "News", href: "#news" },
  { name: "Institutions", href: "#institutions" },
  { name: "Why JKKN", href: "#why-choose" },
  { name: "Campus Life", href: "#life-at-jkkn" },
  { name: "Placements", href: "#recruiters" },
  { name: "Alumni", href: "#alumni" },
  { name: "Contact Us", href: "#contact" },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnHero, setIsOnHero] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const heroSection = document.querySelector("#hero");
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Check if we're in the hero section viewport
        const isInHero = heroRect.top <= 100 && heroRect.bottom > 100;
        setIsOnHero(isInHero);
      }

      // Track active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.href.substring(1), // Remove # from href
        element: document.querySelector(item.href)
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          // Consider section active if it's in the upper half of viewport
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-0 right-0 z-50 py-2 sm:py-3 transition-all duration-300 ${
          mounted && isOnHero
            ? "bg-transparent top-10 sm:top-12"
            : "bg-primary-green shadow-lg top-0"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white transition-colors duration-300">
                <span className="hidden sm:inline">JKKN Institution</span>
                <span className="sm:hidden">JKKN</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex items-center gap-4 xl:gap-8"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`font-medium text-sm xl:text-base transition-colors relative group whitespace-nowrap ${
                    mounted && isOnHero
                      ? "text-white hover:text-gray-200"
                      : "text-white hover:text-gray-200"
                  }`}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              ))}
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white text-2xl sm:text-3xl focus:outline-none transition-transform duration-300 active:scale-90 p-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full bg-white z-50 lg:hidden shadow-2xl overflow-y-auto safe-top safe-bottom scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="p-4">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-primary-green">JKKN</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 text-3xl focus:outline-none transition-transform duration-300 active:scale-90 p-2"
                    aria-label="Close menu"
                  >
                    <HiX />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-0">
                  {navItems.map((item, index) => {
                    const sectionId = item.href.substring(1); // Remove # from href
                    const isActive = activeSection === sectionId;

                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => scrollToSection(item.href)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`block w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-base ${
                          isActive
                            ? 'bg-primary-green text-white shadow-md'
                            : 'text-gray-700 bg-white active:bg-primary-green active:text-white focus:bg-primary-green focus:text-white hover:bg-primary-green hover:text-white hover:shadow-md active:shadow-md'
                        }`}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={isActive ? 'page' : undefined}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {item.name}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }

                /* Ensure hover and active states work on mobile */
                nav button:hover {
                  background-color: #187041 !important;
                  color: white !important;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                nav button:active {
                  background-color: #187041 !important;
                  color: white !important;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                /* Touch devices support */
                @media (hover: none) {
                  nav button:active {
                    background-color: #187041 !important;
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
