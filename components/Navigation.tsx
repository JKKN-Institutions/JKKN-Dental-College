"use client";

import { useState, useEffect } from "react";
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

    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  const scrollToSection = (href: string, target: string = "_self") => {
    // Check if it's an external link (starts with http/https)
    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (target === "_blank") {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
      return;
    }

    // Check if it's an anchor link (starts with #)
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Otherwise, treat it as an internal route
    window.location.href = href;
  };

  return (
    <>
      <nav
        className="hidden lg:block fixed left-0 right-0 top-0 z-[60] py-3 sm:py-4 bg-primary-green shadow-lg"
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

            {/* Mobile Menu Button - Hidden (using bottom navigation instead) */}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Removed (using bottom navigation instead) */}
    </>
  );
}
