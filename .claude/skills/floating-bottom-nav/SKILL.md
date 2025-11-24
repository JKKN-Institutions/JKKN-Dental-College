---
name: floating-bottom-nav
description: Create mobile-friendly floating bottom navigation components for React and Next.js applications. This skill should be used when building mobile navigation bars, bottom tab bars, floating action buttons (FAB), or any persistent bottom navigation UI elements. Supports glassmorphism styling, Tailwind CSS, and various navigation patterns including tab bars, dock-style menus, and expandable FABs.
---

# Floating Bottom Navigation

## Overview

This skill enables creation of mobile-optimized floating bottom navigation components with modern styling, smooth animations, and accessibility support. It provides reusable React/TypeScript components styled with Tailwind CSS following glassmorphism design principles.

## When to Use

- Building mobile-responsive web applications requiring bottom navigation
- Creating tab bars for single-page applications (SPAs)
- Implementing floating action buttons (FAB) with expandable menus
- Adding dock-style navigation similar to iOS/Android native apps
- Designing progressive web apps (PWAs) with native-like navigation

## Quick Start

To implement a basic floating bottom navigation:

1. Copy the appropriate component from `assets/components/`
2. Install required dependencies: `lucide-react` for icons
3. Import and configure navigation items
4. Customize colors to match brand guidelines

## Component Variants

### 1. Basic Tab Bar

A simple horizontal tab bar fixed to the bottom of the viewport.

```tsx
import { useState } from 'react';
import { Home, Search, Bell, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

interface FloatingTabBarProps {
  items: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export function FloatingTabBar({ items, activeId, onItemClick }: FloatingTabBarProps) {
  const [active, setActive] = useState(activeId || items[0]?.id);

  const handleClick = (item: NavItem) => {
    setActive(item.id);
    onItemClick?.(item.id);
    item.onClick?.();
  };

  return (
    <nav 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`
                flex flex-col items-center justify-center
                min-w-[60px] px-3 py-2 rounded-xl
                transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-primary-500/20 text-primary-600 scale-105' 
                  : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Usage Example
const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

<FloatingTabBar items={navItems} activeId="home" onItemClick={(id) => console.log(id)} />
```

### 2. Glassmorphism Dock Navigation

A macOS dock-style navigation with hover magnification effect.

```tsx
import { useState } from 'react';
import { Home, Compass, Heart, MessageCircle, User } from 'lucide-react';

interface DockItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

interface FloatingDockProps {
  items: DockItem[];
  onItemClick?: (id: string) => void;
}

export function FloatingDock({ items, onItemClick }: FloatingDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(items[0]?.id);

  const getScale = (itemId: string, index: number) => {
    if (!hoveredId) return 1;
    const hoveredIndex = items.findIndex(item => item.id === hoveredId);
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    return 1;
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-1 px-4 py-3 bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        {items.map((item, index) => {
          const Icon = item.icon;
          const scale = getScale(item.id, index);
          const isActive = activeId === item.id;
          
          return (
            <button
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                setActiveId(item.id);
                onItemClick?.(item.id);
              }}
              className="relative flex flex-col items-center transition-all duration-200 ease-out"
              style={{ transform: `scale(${scale})` }}
              aria-label={item.label}
            >
              <div className={`
                p-3 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                }
              `}>
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              {hoveredId === item.id && (
                <span className="absolute -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {isActive && (
                <div className="w-1 h-1 bg-white rounded-full mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

### 3. Expandable FAB (Floating Action Button)

A central floating button that expands to reveal additional actions.

```tsx
import { useState } from 'react';
import { Plus, X, Camera, Image, FileText, Mic } from 'lucide-react';

interface FABAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color?: string;
}

interface ExpandableFABProps {
  actions: FABAction[];
  position?: 'center' | 'right';
}

export function ExpandableFAB({ actions, position = 'center' }: ExpandableFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-6',
  };

  return (
    <div className={`fixed bottom-6 ${positionClasses[position]} z-50`}>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col-reverse items-center gap-3 mb-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-full
                bg-white shadow-lg border border-gray-100
                transition-all duration-300 ease-out
                ${isOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
                }
              `}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              aria-hidden={!isOpen}
            >
              <div className={`p-2 rounded-full ${action.color || 'bg-primary-500'}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 pr-2">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full
          bg-gradient-to-br from-primary-500 to-primary-600
          text-white shadow-lg shadow-primary-500/40
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-primary-500/50
          active:scale-95
          ${isOpen ? 'rotate-45 bg-gray-800' : ''}
        `}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}

// Usage Example
const fabActions: FABAction[] = [
  { id: 'camera', icon: Camera, label: 'Take Photo', onClick: () => {}, color: 'bg-blue-500' },
  { id: 'gallery', icon: Image, label: 'Upload Image', onClick: () => {}, color: 'bg-green-500' },
  { id: 'document', icon: FileText, label: 'Add Document', onClick: () => {}, color: 'bg-orange-500' },
  { id: 'voice', icon: Mic, label: 'Voice Note', onClick: () => {}, color: 'bg-purple-500' },
];

<ExpandableFAB actions={fabActions} position="right" />
```

### 4. Tab Bar with Center Action Button

A tab bar featuring a prominent center action button (common in social apps).

```tsx
import { useState } from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';

interface CenterActionTabBarProps {
  onCenterAction: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CenterActionTabBar({ 
  onCenterAction, 
  activeTab, 
  onTabChange 
}: CenterActionTabBarProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'activity', icon: Heart, label: 'Activity' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  const renderTab = (tab: typeof tabs[0]) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`
          flex flex-col items-center justify-center flex-1 py-2
          transition-colors duration-200
          ${isActive ? 'text-primary-600' : 'text-gray-500'}
        `}
      >
        <Icon className="w-6 h-6" />
        <span className="text-xs mt-1">{tab.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="relative bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
        <div className="flex items-center justify-around px-4 h-16">
          {/* Left Tabs */}
          {leftTabs.map(renderTab)}
          
          {/* Spacer for center button */}
          <div className="w-16" />
          
          {/* Right Tabs */}
          {rightTabs.map(renderTab)}
        </div>
        
        {/* Center Action Button */}
        <button
          onClick={onCenterAction}
          className="
            absolute left-1/2 -translate-x-1/2 -top-6
            w-14 h-14 rounded-full
            bg-gradient-to-br from-primary-500 to-primary-600
            text-white shadow-lg shadow-primary-500/40
            flex items-center justify-center
            transition-transform duration-200
            hover:scale-105 active:scale-95
          "
          aria-label="Create new"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}
```

## Required CSS Utilities

Add these utilities to the global stylesheet or Tailwind configuration:

```css
/* Custom Animations */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.3s ease-out;
}

/* Safe Area Padding (for notched devices) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Glassmorphism Base */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Tailwind Configuration

Extend the Tailwind configuration to support glassmorphism:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.3s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
};
```

## Accessibility Guidelines

To ensure navigation components meet accessibility standards:

1. **ARIA Labels**: Include `role="navigation"` and `aria-label` on nav elements
2. **Current Page**: Use `aria-current="page"` on active navigation items
3. **Keyboard Navigation**: Ensure all items are focusable and keyboard-accessible
4. **Color Contrast**: Maintain 4.5:1 contrast ratio for text
5. **Touch Targets**: Minimum 44x44px touch target size
6. **Screen Readers**: Provide meaningful labels for icon-only buttons

## Mobile-Specific Considerations

1. **Safe Area Insets**: Use `env(safe-area-inset-bottom)` for devices with home indicators
2. **Viewport Height**: Account for browser chrome with `100dvh` instead of `100vh`
3. **Touch Feedback**: Add visual feedback on touch (`active:scale-95`)
4. **Prevent Scroll Bounce**: Use `overscroll-behavior: none` on body when nav is open
5. **Performance**: Use `will-change: transform` for animated elements

## Resources

- `assets/components/` - Pre-built React component files
- `references/patterns.md` - Common navigation patterns and use cases
- `references/accessibility.md` - Detailed accessibility checklist
