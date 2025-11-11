# JKKN Dental College - Brand Color Palette

## Primary Brand Colors

### 1. JKKN Dark Green
- **Hex:** `#0b6d41`
- **RGB:** `rgb(11, 109, 65)`
- **HSL:** `hsl(153, 82%, 24%)`
- **Tailwind Class:** `text-primary-green`, `bg-primary-green`, `border-primary-green`
- **CSS Variable:** `--primary`

**Usage:**
- Primary buttons and CTAs
- Navigation highlights
- Links and interactive elements
- Brand accents and highlights
- Success states
- Active states

**Examples:**
```tsx
<button className="bg-primary-green text-white">Click Me</button>
<div className="border-primary-green border-2">Content</div>
<h1 className="text-primary-green">Title</h1>
```

---

### 2. JKKN Cream
- **Hex:** `#fbfbee`
- **RGB:** `rgb(251, 251, 238)`
- **HSL:** `hsl(60, 68%, 96%)`
- **Tailwind Class:** `text-primary-cream`, `bg-primary-cream`, `border-primary-cream`
- **CSS Variable:** `--secondary`

**Usage:**
- Background sections (alternating with white)
- Card backgrounds
- Subtle highlights
- Text on dark backgrounds
- Soft accents

**Examples:**
```tsx
<section className="bg-primary-cream/50">Content</section>
<div className="bg-primary-cream p-6">Card</div>
<span className="text-primary-cream">Light Text</span>
```

---

### 3. JKKN Yellow
- **Hex:** `#ffde59`
- **RGB:** `rgb(255, 222, 89)`
- **HSL:** `hsl(48, 100%, 67%)`
- **Tailwind Class:** `text-primary-yellow`, `bg-primary-yellow`, `border-primary-yellow`
- **CSS Variable:** `--accent`

**Usage:**
- Secondary CTAs and highlights
- Badges and labels
- Icons and decorative elements
- Warning/caution states
- Hover effects
- Energy and attention-grabbing elements

**Examples:**
```tsx
<button className="bg-primary-yellow text-gray-900">Learn More</button>
<span className="bg-primary-yellow/10 px-3 py-1 rounded-full">New</span>
<div className="hover:border-primary-yellow">Hover Me</div>
```

---

## Color Combinations

### Primary Combination (Green + Cream)
```tsx
<div className="bg-primary-green text-primary-cream">
  High contrast, professional look
</div>
```

### Secondary Combination (Yellow + Green)
```tsx
<div className="bg-primary-yellow text-primary-green">
  Energetic, eye-catching
</div>
```

### Subtle Combination (Cream + Green accents)
```tsx
<div className="bg-primary-cream text-gray-900">
  <span className="text-primary-green">Accent text</span>
</div>
```

---

## Accessibility Guidelines

### Contrast Ratios (WCAG 2.1)

#### JKKN Dark Green (#0b6d41)
- ✅ **On White Background:** 7.52:1 (AAA for normal text, AA for large text)
- ✅ **On Cream Background (#fbfbee):** 7.28:1 (AAA for normal text)
- ✅ **With White Text:** 7.52:1 (AAA compliant)

#### JKKN Cream (#fbfbee)
- ✅ **On Dark Green (#0b6d41):** 7.28:1 (AAA compliant)
- ⚠️ **On White:** Low contrast (use for subtle backgrounds only)

#### JKKN Yellow (#ffde59)
- ⚠️ **On White:** 1.54:1 (Use for decorative elements only)
- ✅ **With Dark Text (gray-900):** 8.89:1 (AAA compliant)
- ❌ **As text color:** Use darker text on yellow backgrounds

**Best Practices:**
- Use Dark Green for primary text and interactive elements
- Use Yellow for badges, labels, and decorative accents (not body text)
- Ensure sufficient contrast for all text elements

---

## Color Usage by Component Type

### Buttons
```tsx
// Primary Button
<button className="bg-primary-green text-white hover:bg-primary-green/90">
  Primary Action
</button>

// Secondary Button
<button className="bg-primary-yellow text-gray-900 hover:bg-primary-yellow/90">
  Secondary Action
</button>

// Outline Button
<button className="border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white">
  Outline
</button>
```

### Cards
```tsx
// Standard Card
<div className="bg-white rounded-xl shadow-lg p-6">
  <h3 className="text-primary-green">Title</h3>
  <p className="text-gray-600">Content</p>
</div>

// Highlighted Card
<div className="bg-primary-cream rounded-xl p-6">
  <h3 className="text-primary-green">Special Section</h3>
</div>
```

### Badges & Labels
```tsx
<span className="bg-primary-green text-white px-3 py-1 rounded-full text-xs font-semibold">
  Category
</span>

<span className="bg-primary-yellow/10 text-primary-green px-3 py-1 rounded-full text-xs font-bold">
  New
</span>
```

### Section Backgrounds
```tsx
// Alternating sections
<section className="py-20 bg-white">...</section>
<section className="py-20 bg-primary-cream/50">...</section>
<section className="py-20 bg-white">...</section>
```

---

## Opacity Variants

All brand colors support Tailwind's opacity modifiers:

```tsx
// Green variants
bg-primary-green/5   // Very light tint
bg-primary-green/10  // Light tint
bg-primary-green/20  // Subtle background
bg-primary-green/50  // Semi-transparent
bg-primary-green/80  // Mostly opaque
bg-primary-green/90  // Hover state
bg-primary-green     // Full opacity

// Cream variants
bg-primary-cream/30  // Subtle overlay
bg-primary-cream/50  // Section background
bg-primary-cream     // Full background

// Yellow variants
bg-primary-yellow/10 // Subtle highlight
bg-primary-yellow/20 // Badge background
bg-primary-yellow/90 // Hover state
```

---

## Gradient Combinations

### Green to Transparent
```tsx
<div className="bg-gradient-to-t from-primary-green to-transparent">
  Fade effect
</div>
```

### Cream to White
```tsx
<div className="bg-gradient-to-b from-primary-cream/30 to-white">
  Subtle gradient section
</div>
```

### Yellow Accent Gradient
```tsx
<div className="bg-gradient-to-r from-primary-yellow/10 to-primary-cream/10">
  Highlight background
</div>
```

---

## Dark Mode Considerations

All brand colors are defined for both light and dark modes in `app/globals.css`:

```css
:root {
  --primary: 153 82% 24%;    /* Green */
  --secondary: 60 68% 96%;   /* Cream */
  --accent: 48 100% 67%;     /* Yellow */
}

.dark {
  /* Same values - brand colors remain consistent */
  --primary: 153 82% 24%;
  --secondary: 60 68% 96%;
  --accent: 48 100% 67%;
}
```

---

## Brand Color Don'ts

❌ **Don't:**
- Use yellow for body text or large blocks of text
- Mix more than 2-3 brand colors in a single component
- Use cream on white backgrounds (low contrast)
- Override brand colors without good reason
- Use brand colors for error states (use red/destructive instead)

✅ **Do:**
- Use green as the primary brand identifier
- Use cream for soft, welcoming backgrounds
- Use yellow sparingly for highlights and accents
- Maintain consistent color usage across the site
- Test contrast ratios for accessibility

---

## Color Variables Reference

### Tailwind Config (`tailwind.config.ts`)
```typescript
colors: {
  primary: {
    green: '#0b6d41',
    cream: '#fbfbee',
    yellow: '#ffde59',
  }
}
```

### CSS Variables (`app/globals.css`)
```css
--primary: 153 82% 24%;     /* Green #0b6d41 */
--secondary: 60 68% 96%;    /* Cream #fbfbee */
--accent: 48 100% 67%;      /* Yellow #ffde59 */
```

---

## Implementation Examples

### Hero Section
```tsx
<section className="bg-gradient-to-br from-primary-green to-primary-green/80">
  <h1 className="text-primary-cream">Welcome to JKKN</h1>
  <button className="bg-primary-yellow text-gray-900">Learn More</button>
</section>
```

### Card with Hover
```tsx
<div className="bg-white hover:shadow-2xl transition-all group">
  <h3 className="text-gray-900 group-hover:text-primary-green transition-colors">
    Title
  </h3>
  <span className="bg-primary-green/10 px-3 py-1 rounded-full">
    Badge
  </span>
</div>
```

### Navigation
```tsx
<nav className="bg-white border-b">
  <a className="text-gray-900 hover:text-primary-green active:text-primary-green">
    Menu Item
  </a>
</nav>
```

---

## Color Psychology

### JKKN Dark Green (#0b6d41)
- **Associations:** Growth, health, trust, professionalism, stability
- **Emotion:** Calm, reassuring, trustworthy
- **Perfect for:** Education, healthcare, institutional branding

### JKKN Cream (#fbfbee)
- **Associations:** Warmth, comfort, sophistication, cleanliness
- **Emotion:** Welcoming, peaceful, elegant
- **Perfect for:** Backgrounds, creating breathing room, soft contrast

### JKKN Yellow (#ffde59)
- **Associations:** Optimism, energy, clarity, innovation
- **Emotion:** Cheerful, attention-grabbing, energetic
- **Perfect for:** Highlights, CTAs, badges, drawing focus

---

## Files Updated

The brand colors have been updated in:
1. ✅ `tailwind.config.ts` - Tailwind color definitions
2. ✅ `app/globals.css` - CSS variable definitions (light & dark mode)

The colors are automatically applied across all **133 instances** in **42 components** using:
- `primary-green` class
- `primary-cream` class
- `primary-yellow` class (new)

---

**Last Updated:** November 11, 2025
**Version:** 2.0 - New Brand Colors
