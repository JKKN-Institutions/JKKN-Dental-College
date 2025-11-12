"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigationTree } from "@/hooks/navigation/use-navigation";

// Fallback navigation items (used if database is empty)
const fallbackNavItems = [
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
  const [activeSection, setActiveSection] = useState("home");

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
        target: "_self" as const,
      }));

  useEffect(() => {
    const handleScroll = () => {
      // Track active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.href.startsWith("#") ? item.href.substring(1) : "",
        element: item.href.startsWith("#") ? document.querySelector(item.href) : null
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
  }, [isMobileMenuOpen, navItems]);

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

  const scrollToSection = (href: string, target: string = "_self") => {
    // Check if it's an external link (starts with http/https)
    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (target === "_blank") {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
      setIsMobileMenuOpen(false);
      return;
    }

    // Check if it's an anchor link (starts with #)
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
      return;
    }

    // Otherwise, treat it as an internal route
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-[60] py-3 sm:py-4 bg-primary-green shadow-lg"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white">
                <span className="hidden sm:inline">JKKN Institution</span>
                <span className="sm:hidden">JKKN</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.target)}
                  className="font-medium text-sm xl:text-base transition-colors relative group whitespace-nowrap text-white hover:text-gray-200"
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

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
      </nav>

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
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[85%] md:w-[400px] bg-gradient-to-b from-white to-gray-50 z-50 lg:hidden shadow-2xl overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* Header Section */}
              <div className="sticky top-0 bg-primary-green shadow-md z-10">
                <div className="flex justify-between items-center p-5 sm:p-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">JKKN</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:text-gray-200 text-3xl sm:text-4xl focus:outline-none transition-all duration-300 active:scale-90 hover:rotate-90 p-2"
                    aria-label="Close menu"
                  >
                    <HiX />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="px-4 sm:px-6 py-6 space-y-2">
                {navItems.map((item, index) => {
                  const sectionId = item.href.startsWith("#") ? item.href.substring(1) : "";
                  const isActive = activeSection === sectionId && sectionId !== "";

                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href, item.target)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`block w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-semibold text-base sm:text-lg border-2 ${
                        isActive
                          ? 'bg-primary-green text-white border-primary-green shadow-lg scale-105 transform'
                          : 'text-gray-700 bg-white border-gray-200 hover:border-primary-green active:bg-primary-green active:text-white active:border-primary-green hover:shadow-md active:scale-95 hover:scale-[1.02]'
                      }`}
                      aria-label={`Navigate to ${item.name}`}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {isActive && (
                          <span className="text-white text-xl">•</span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer Section */}
              <div className="px-6 py-8 mt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  © 2025 JKKN Institution
                </p>
              </div>

              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }

                /* Ensure hover and active states work on mobile */
                nav button:not(.bg-primary-green):hover {
                  border-color: #187041 !important;
                  box-shadow: 0 4px 6px -1px rgba(24, 112, 65, 0.1) !important;
                }

                nav button:active {
                  background-color: #187041 !important;
                  color: white !important;
                  border-color: #187041 !important;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2) !important;
                }

                /* Touch devices support */
                @media (hover: none) {
                  nav button:active {
                    background-color: #187041 !important;
                    color: white !important;
                    border-color: #187041 !important;
                    transform: scale(0.95);
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
