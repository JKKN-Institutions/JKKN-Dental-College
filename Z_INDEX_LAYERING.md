# Z-Index Layering Guide

## Overview

This document defines the z-index stacking order for all fixed/absolute positioned elements in the admin panel to prevent overlap issues.

## Current Z-Index Hierarchy (Lowest to Highest)

### Layer 1: Bottom Navigation (z-30)
**Component:** `MobileBottomNav.tsx`
```typescript
zIndex: 30
```
- **Position:** Fixed at bottom of screen
- **Visibility:** Mobile only (lg:hidden)
- **Purpose:** Quick navigation shortcuts
- **Why z-30:** Should be below sidebar and overlay

---

### Layer 2: Sidebar Overlay (z-40)
**Component:** `AdminSidebar.tsx`
```typescript
className="fixed inset-0 bg-black/50 z-40 lg:hidden"
```
- **Position:** Full screen overlay
- **Visibility:** Mobile only, when sidebar is open
- **Purpose:** Darkens background and provides click-to-close area
- **Why z-40:** Above bottom nav (z-30), below sidebar (z-50)

---

### Layer 3: Sidebar (z-50)
**Component:** `AdminSidebar.tsx`
```typescript
className="... fixed lg:relative inset-y-0 left-0 z-50"
```
- **Position:** Fixed on left side (mobile), relative (desktop)
- **Visibility:** Always rendered, slides in/out on mobile
- **Purpose:** Main navigation menu
- **Why z-50:** Should be on top of everything when open

---

### Layer 4: User Dropdown Menu (z-20)
**Component:** `AdminHeader.tsx`
```typescript
className="absolute right-0 mt-2 ... z-20"
```
- **Position:** Absolute, positioned below user avatar
- **Visibility:** When user menu is open
- **Purpose:** User profile actions (profile, settings, logout)
- **Why z-20:** Should appear above content but below sidebar
- **Backdrop:** z-10 (to catch clicks outside)

---

## Stacking Order Visual

```
┌─────────────────────────────────────┐
│  Sidebar (z-50) ← HIGHEST           │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │  Menu Items                  │   │
│  │                              │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Sidebar Overlay (z-40)             │
│  (Semi-transparent dark backdrop)   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│         Main Content Area           │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Bottom Navigation (z-30) ← LOWEST  │
│  [Dashboard] [Users] [Content] [+]  │
└─────────────────────────────────────┘
```

## Rules & Best Practices

### 1. **Never Use z-index > 100**
High z-index values (like 9999) make it difficult to layer elements properly. Use incremental values instead.

### 2. **Reserve High Values for Modals**
If we add modals or tooltips in the future, use z-index > 100:
- Tooltips: z-100
- Modals: z-200
- Toast notifications: z-300
- Full-screen overlays: z-400

### 3. **Mobile vs Desktop**
- Mobile sidebar needs high z-index (z-50) to overlay content
- Desktop sidebar uses `lg:relative` and doesn't need z-index
- Bottom nav only appears on mobile (`lg:hidden`)

### 4. **Overlay Pattern**
When creating an overlay backdrop:
- Overlay backdrop: z-N
- Content above overlay: z-(N+10)
- Close button: Same as content

Example:
```typescript
{/* Backdrop */}
<div className="fixed inset-0 z-10" onClick={close} />

{/* Content */}
<div className="fixed ... z-20">
  Content here
</div>
```

## Testing Checklist

When adding new fixed/absolute elements:

- [ ] Test on mobile view (< 1024px)
- [ ] Open sidebar - should be on top of everything
- [ ] Check bottom nav - should be behind sidebar
- [ ] Test user dropdown - should appear but not block sidebar
- [ ] Test with multiple overlays open
- [ ] Verify click-to-close works on overlays

## Known Z-Index Values

| Component | Z-Index | Position | Visibility |
|-----------|---------|----------|------------|
| Bottom Navigation | 30 | Fixed bottom | Mobile only |
| Sidebar Overlay | 40 | Fixed fullscreen | Mobile only |
| Sidebar | 50 | Fixed left | Mobile only |
| User Menu Backdrop | 10 | Fixed fullscreen | When open |
| User Menu Dropdown | 20 | Absolute | When open |

## Common Issues & Solutions

### Issue: Bottom nav appears above sidebar
**Cause:** Bottom nav z-index too high
**Solution:** Set bottom nav z-index < sidebar overlay (< 40)

### Issue: Dropdown menu hidden behind sidebar
**Cause:** Dropdown z-index higher than sidebar
**Solution:** User dropdowns should have z < 50 or be rendered inside sidebar

### Issue: Can't click overlay to close
**Cause:** Another element with higher z-index blocking overlay
**Solution:** Lower the blocking element's z-index or add pointer-events

### Issue: Content appears above overlay
**Cause:** Content has explicit z-index
**Solution:** Remove z-index from regular content, or ensure z < overlay

## Future Additions

When adding new elements, follow this order:

1. **Background Elements:** z-0 to z-10
   - Page backgrounds, decorative elements

2. **Content Layer:** z-10 to z-20
   - Regular page content, cards, forms

3. **Floating UI:** z-20 to z-40
   - Dropdowns, popovers, floating buttons

4. **Navigation:** z-40 to z-60
   - Sidebars, headers, bottom nav

5. **Overlays:** z-60 to z-100
   - Full-screen overlays, loading screens

6. **Modals:** z-100 to z-200
   - Dialogs, alerts, confirmations

7. **Notifications:** z-200 to z-300
   - Toast messages, snackbars

8. **Critical:** z-300+
   - Dev tools, error boundaries, emergency messages

## Maintenance

**Last Updated:** January 2025

When modifying z-index values:
1. Update this document
2. Test on both mobile and desktop
3. Verify all interactive elements still work
4. Check console for any warnings

---

## Quick Reference

```css
/* Admin Panel Z-Index Scale */
.bottom-nav { z-index: 30; }
.sidebar-overlay { z-index: 40; }
.sidebar { z-index: 50; }
.dropdown-backdrop { z-index: 10; }
.dropdown-menu { z-index: 20; }

/* Future use */
.modal-backdrop { z-index: 100; }
.modal { z-index: 110; }
.toast { z-index: 200; }
```
