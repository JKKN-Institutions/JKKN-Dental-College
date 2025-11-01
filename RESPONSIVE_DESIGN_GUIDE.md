# Responsive Design Guide - JKKN Institution Website

## Overview
This document outlines the comprehensive responsive design strategy implemented across the JKKN Institution website to ensure optimal viewing experience on all devices.

## Breakpoint System

### Custom Breakpoints (Tailwind Config)
```typescript
{
  'xs': '375px',    // Extra small devices (small phones - iPhone SE)
  'sm': '640px',    // Small devices (large phones)
  'md': '768px',    // Medium devices (tablets)
  'lg': '1024px',   // Large devices (desktops)
  'xl': '1280px',   // Extra large devices (large desktops)
  '2xl': '1536px',  // 2X Extra large devices (ultra-wide)
}
```

### Device Coverage
- **320px - 374px**: Very small phones (Galaxy Fold, etc.)
- **375px - 639px**: Small phones (iPhone SE, iPhone 12 Mini)
- **640px - 767px**: Large phones (iPhone 14 Pro Max, Pixel)
- **768px - 1023px**: Tablets (iPad, iPad Mini)
- **1024px - 1279px**: Small desktops/Laptops
- **1280px - 1535px**: Standard desktops
- **1536px+**: Large desktops and ultra-wide monitors

## Key Features Implemented

### 1. Viewport Configuration
**File**: `app/layout.tsx`

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#187041',
};
```

### 2. PWA Support
**File**: `public/manifest.json`

- Standalone mode for app-like experience
- Theme color: #187041 (Primary Green)
- Icons: 192x192 and 512x512 (maskable)
- Orientation: Any

### 3. Safe Area Support
**File**: `app/globals.css`

Utility classes for notched devices (iPhone X+):
- `.safe-top` - Padding for top notch
- `.safe-bottom` - Padding for bottom notch/home indicator
- `.safe-left` - Padding for left cutout
- `.safe-right` - Padding for right cutout

### 4. Touch Optimizations

#### Tap Highlight Removal
```css
* {
  -webkit-tap-highlight-color: transparent;
}
```

#### Touch Action
```css
body {
  touch-action: pan-x pan-y;
}
```

#### Smooth Scrolling (iOS)
```css
* {
  -webkit-overflow-scrolling: touch;
}
```

### 5. Prevent Horizontal Scroll
```css
html {
  overflow-x: hidden;
}

body {
  overflow-x: hidden;
  width: 100%;
  position: relative;
}
```

### 6. Accessibility - Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Component-Specific Responsive Patterns

### Navigation Component
**File**: `components/Navigation.tsx`

- **Mobile** (< 1024px): Side drawer menu with backdrop
  - Slides from right
  - 85% width on XS, 75% on SM, 60% on MD
  - Prevents body scroll when open
  - Touch-friendly 44px+ tap targets

- **Desktop** (≥ 1024px): Horizontal navigation bar
  - Responsive gap spacing (4xl on XL, 8xl on 2XL)
  - Hover effects with underline animation

- **Logo Adaptation**:
  - Mobile: "JKKN" only
  - Tablet+: "JKKN Institution"

### Hero Section
**File**: `components/HeroSection.tsx`

- **Typography Scaling**:
  ```
  Mobile (base):  3xl (30px)
  XS (375px):     4xl (36px)
  SM (640px):     5xl (48px)
  MD (768px):     6xl (60px)
  LG (1024px):    7xl (72px)
  XL (1280px):    8xl (96px)
  ```

- **Subtitle Scaling**: base → lg → xl → 2xl → 3xl

- **CTA Buttons**:
  - Mobile: Full width, stacked
  - XS+: Auto width, side-by-side
  - Active states for touch feedback

- **Landscape Mode**: Compact padding using `.landscape-compact`

- **Video Background**:
  - `object-cover` for proper aspect ratio
  - Poster image for loading state
  - `preload="metadata"` for performance

### Announcement Banner
**File**: `components/AnnouncementBanner.tsx`

- **Responsive Text**: xs (10px) → sm (14px) → md (16px)
- **Icon Sizing**: base (16px) → xs (18px) → sm (20px)
- **Padding**: Adaptive based on screen size
- Safe area support for notched devices

### Grid Layouts

#### Why Choose JKKN / Our Strength
```
Mobile:  1 column
SM:      2 columns
LG:      3 columns
```

#### Footer
```
Mobile:  1 column
SM:      2 columns
LG:      4 columns
```

#### Contact Us
```
Mobile:  1 column (form below info)
LG:      2 columns (side-by-side)
```

### Carousel Component
**File**: `components/ui/Carousel.tsx`

- **Items Per View**:
  ```
  < 640px:   1 item
  640-767px: 1 item
  768-1023px: 2 items
  ≥ 1024px:  3 items
  ```

- **Navigation Arrows**:
  - Responsive sizing: 2xl (mobile) → 3xl (desktop)
  - Responsive positioning: -translate-x-2 → -translate-x-4
  - Touch feedback with `active:scale-90`

- **Drag Support**: Swipe gestures on touch devices

## Performance Optimizations

### Image Optimization
**File**: `next.config.ts`

- **Formats**: AVIF (modern) → WebP (fallback) → Original
- **Device Sizes**: [375, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
- **Image Sizes**: [16, 32, 48, 64, 96, 128, 256, 384]
- **Cache TTL**: 60 seconds minimum

### Font Loading
**File**: `app/layout.tsx`

- **Strategy**: `display: 'swap'` (prevent FOIT)
- **Preload**: `true`
- **Antialiasing**: Applied in globals.css

### Code Splitting
**File**: `app/page.tsx`

- Dynamic imports for below-the-fold components
- SSR enabled for SEO benefits

## Testing Matrix

### Recommended Test Devices

#### Mobile Phones
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 Mini (375x812)
- [ ] iPhone 12/13 (390x844)
- [ ] iPhone 14 Pro (393x852)
- [ ] iPhone 14 Pro Max (430x932)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Google Pixel 5 (393x851)

#### Tablets
- [ ] iPad Mini (744x1133)
- [ ] iPad (810x1080)
- [ ] iPad Air (820x1180)
- [ ] iPad Pro 11" (834x1194)
- [ ] iPad Pro 12.9" (1024x1366)
- [ ] Surface Pro (912x1368)

#### Desktop
- [ ] Laptop (1366x768)
- [ ] Desktop HD (1920x1080)
- [ ] Desktop Full HD (2560x1440)
- [ ] Ultra-wide (3440x1440)
- [ ] 4K (3840x2160)

### Orientation Testing
- [ ] Portrait mode (all devices)
- [ ] Landscape mode (tablets and phones)
- [ ] Landscape compact (height < 600px)

### Browser Testing
- [ ] Chrome (Mobile & Desktop)
- [ ] Safari (iOS & macOS)
- [ ] Firefox (Mobile & Desktop)
- [ ] Edge (Desktop)
- [ ] Samsung Internet (Mobile)

## Common Responsive Patterns

### Typography Scaling
```jsx
className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
```

### Spacing Scaling
```jsx
className="px-4 sm:px-6 lg:px-8"
className="py-12 sm:py-16 lg:py-20"
className="gap-6 sm:gap-8 lg:gap-12"
```

### Grid Columns
```jsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

### Flex Direction
```jsx
className="flex flex-col sm:flex-row"
```

### Visibility Control
```jsx
className="hidden sm:block"  // Show on SM and up
className="block sm:hidden"  // Show only on mobile
```

### Container Padding
```jsx
className="container mx-auto px-4 sm:px-6 lg:px-8"
```

## Accessibility Considerations

1. **Touch Targets**: Minimum 44x44px (Apple) / 48x48px (Google)
2. **Font Size**: Minimum 16px for body text (prevents zoom on iOS)
3. **Contrast Ratios**: WCAG AA compliant
4. **Focus Indicators**: Visible on all interactive elements
5. **ARIA Labels**: Added to navigation and interactive elements
6. **Semantic HTML**: Proper heading hierarchy

## Troubleshooting Common Issues

### Issue: Horizontal Scroll on Mobile
**Solution**: Check for fixed-width elements, ensure `overflow-x: hidden` on html/body

### Issue: Text Too Small on Mobile
**Solution**: Use responsive typography classes (xs:, sm:, etc.)

### Issue: Layout Shift on Load
**Solution**: Use `aspect-ratio` for images/videos, define dimensions

### Issue: Menu Not Closing on Resize
**Solution**: Add resize event listener to close mobile menu at breakpoint

### Issue: Touch Targets Too Small
**Solution**: Ensure min 44px height/width, add padding if needed

### Issue: Video Not Playing on Mobile
**Solution**: Add `playsInline` attribute, use poster image

## Best Practices

1. **Mobile-First Approach**: Start with mobile styles, add breakpoints for larger screens
2. **Test Early and Often**: Use browser DevTools responsive mode during development
3. **Use System Fonts**: Reduce load time, improve rendering
4. **Optimize Images**: Use Next.js Image component with proper sizes
5. **Minimize Animation**: Use `prefers-reduced-motion` for accessibility
6. **Progressive Enhancement**: Ensure core functionality works without JavaScript
7. **Responsive Images**: Provide multiple sizes for different viewports
8. **Touch-Friendly**: Large tap targets, prevent double-tap zoom

## Future Enhancements

1. **Container Queries**: When browser support improves
2. **Variable Fonts**: For smoother responsive typography
3. **Dynamic Viewport Units**: Use `dvh` instead of `vh` (iOS Safari)
4. **Hover Detection**: Use `@media (hover: hover)` for hover-only devices
5. **Portrait/Landscape Specific Styles**: Enhanced orientation support

## Resources

- [Tailwind Responsive Design Docs](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Responsive Images](https://web.dev/responsive-images/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design: Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)

---

**Last Updated**: 2025-11-01
**Version**: 1.0.0
**Maintained By**: JKKN Development Team
