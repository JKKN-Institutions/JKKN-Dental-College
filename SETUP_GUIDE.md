# JKKN Institution Website - Setup Guide

## Quick Start

Your JKKN Institution website is ready! Follow these steps to complete the setup.

## Current Status

✅ Project initialized successfully
✅ All components created
✅ Responsive design implemented
✅ Animations configured
✅ Development server running

**Your website is now live at: http://localhost:3001**

---

## Next Steps

### 1. Add Your Media Assets

The website uses videos and images that you need to provide:

#### Videos Required (place in `public/videos/`):
- **campus-video.mp4** - Main hero background video (1-2 minutes)
- **campus-tour.mp4** - Campus tour video
- **library.mp4** - Library and labs video
- **sports.mp4** - Sports facilities video
- **student-life.mp4** - Student life video
- **events.mp4** - Events and activities video
- **hostel.mp4** - Hostel facilities video

#### Images Required (place in `public/images/`):
- **campus-poster.jpg** - Hero video fallback image
- **campus-tour.jpg** - Campus tour thumbnail
- **library.jpg** - Library thumbnail
- **sports.jpg** - Sports facilities thumbnail
- **student-life.jpg** - Student life thumbnail
- **events.jpg** - Events thumbnail
- **hostel.jpg** - Hostel facilities thumbnail

**Video Specifications:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (Full HD) or 1280x720 (HD)
- File size: Under 50MB each
- Duration: 30-60 seconds for carousel, 1-2 minutes for hero

**Image Specifications:**
- Format: JPG or PNG
- Resolution: 1920x1080 for hero, 800x450 for thumbnails
- File size: Under 500KB each
- Aspect ratio: 16:9

### 2. Customize Content

#### Update Contact Information
Edit `components/ContactUs.tsx`:
- Address
- Phone numbers
- Email addresses
- Office hours

#### Update Statistics
Edit `components/OurStrength.tsx`:
- Years of Excellence
- Number of Students
- Placement Rate
- Courses Offered
- Faculty Count
- Industry Partners

#### Update Social Media Links
Edit `components/Footer.tsx` and `components/ContactUs.tsx`:
- Facebook URL
- Twitter URL
- Instagram URL
- LinkedIn URL
- YouTube URL

#### Add Google Maps
Edit `components/ContactUs.tsx` (line ~203):
Replace the placeholder with actual Google Maps embed:
```tsx
<iframe
  src="YOUR_GOOGLE_MAPS_EMBED_URL"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>
```

### 3. Optional Customizations

#### Add Your Logo
1. Place your logo in `public/images/logo.png`
2. Update `components/Navigation.tsx` (line ~47):
```tsx
<Image
  src="/images/logo.png"
  alt="JKKN Institution"
  width={150}
  height={60}
/>
```

#### Modify Colors
If you want to adjust brand colors, edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    green: "#187041",  // Change this
    cream: "#fcfaee",  // Change this
  },
}
```

#### Update Metadata (SEO)
Edit `app/layout.tsx`:
- Title
- Description
- Keywords
- Open Graph tags

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Website Sections

Your website includes these sections:

1. **Announcement Banner** - Admission 2025-2026 news ticker
2. **Navigation** - Sticky navigation with smooth scrolling
3. **Hero Section** - Full-screen video with institution title
4. **Why Choose JKKN** - 6 key benefits with animated cards
5. **Our Strength** - Statistics with animated counters
6. **Campus Videos** - Horizontal scrolling video carousel
7. **Contact Us** - Contact form + information + map
8. **Footer** - Links, resources, and social media

---

## Features Implemented

✅ **Professional Design**
- Clean, modern UI
- JKKN brand colors (#187041, #fcfaee, #ffffff)
- Consistent typography and spacing

✅ **Smooth Animations**
- Framer Motion integration
- Scroll-triggered animations
- Hover effects
- Counter animations
- Fade-in, slide-in effects

✅ **Fully Responsive**
- Mobile-first approach
- Hamburger menu for mobile
- Responsive grid layouts
- Touch-friendly buttons

✅ **Video Integration**
- Hero background video with fallback
- Video carousel with modal playback
- Lazy loading for performance

✅ **Interactive Features**
- Smooth scroll navigation
- Contact form validation
- Video modal player
- Social media links

✅ **Performance Optimized**
- Next.js automatic optimization
- Code splitting
- Lazy loading
- Efficient animations

✅ **SEO Ready**
- Meta tags configured
- Semantic HTML
- Proper heading hierarchy
- Alt text support

---

## Accessing Your Website

**Local Development:**
- URL: http://localhost:3001
- Auto-reloads on file changes

**Production Deployment:**
See deployment section in README.md

---

## Adding New Content

### Add a New Section
1. Create component in `components/NewSection.tsx`
2. Import in `app/page.tsx`
3. Add to navigation if needed

### Add New Page
1. Create `app/new-page/page.tsx`
2. Add link in navigation
3. Update sitemap

---

## Form Submission

The contact form currently shows an alert. To make it functional:

1. **Using Email Service (Recommended)**
   - Set up EmailJS, SendGrid, or similar
   - Update `components/ContactUs.tsx` handleSubmit function

2. **Using API Route**
   - Create `app/api/contact/route.ts`
   - Add form submission logic
   - Update form to POST to API

Example API route:
```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  // Send email or save to database
  return Response.json({ success: true });
}
```

---

## Troubleshooting

### Videos not playing?
- Check file paths in `public/videos/`
- Ensure videos are in MP4 format
- Check browser console for errors

### Animations not working?
- Framer Motion is installed
- Check browser compatibility
- Clear cache and reload

### Styling issues?
- Run `npm run dev` to rebuild
- Check Tailwind classes
- Inspect element in browser

### Build errors?
- Run `npm install` to ensure dependencies
- Check TypeScript errors
- Run `npm run lint`

---

## Browser Testing

Test your website in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari
- ✅ Chrome Mobile

---

## Performance Tips

1. **Optimize Videos**
   - Compress videos before upload
   - Use appropriate resolution
   - Consider adaptive streaming

2. **Optimize Images**
   - Compress images (TinyPNG, ImageOptim)
   - Use WebP format when possible
   - Use Next.js Image component

3. **Enable Caching**
   - Configure CDN
   - Set proper cache headers

---

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React Icons**: https://react-icons.github.io/react-icons/

---

## Project Structure

```
jkkn.ac.in/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (main entry)
│   └── globals.css         # Global styles
├── components/
│   ├── AnnouncementBanner.tsx  # Top admission banner
│   ├── Navigation.tsx          # Header navigation
│   ├── HeroSection.tsx         # Hero with video
│   ├── WhyChooseJKKN.tsx       # Benefits section
│   ├── OurStrength.tsx         # Statistics section
│   ├── CampusVideos.tsx        # Video carousel
│   ├── ContactUs.tsx           # Contact form + info
│   └── Footer.tsx              # Footer with links
├── public/
│   ├── images/                 # Image assets
│   └── videos/                 # Video assets
├── PRD.md                      # Product requirements
├── README.md                   # Documentation
├── SETUP_GUIDE.md              # This file
└── package.json                # Dependencies
```

---

## Ready to Deploy?

Once you've added your content:

1. **Test thoroughly** in all browsers
2. **Optimize media** files
3. **Update all content** and links
4. **Test contact form** functionality
5. **Run production build**: `npm run build`
6. **Deploy to Vercel** or your hosting platform

---

## Congratulations! 🎉

Your JKKN Institution website is ready. The foundation is complete with:
- Professional design
- Smooth animations
- Responsive layout
- All required sections

Just add your media assets and customize the content to make it yours!

---

**Need Help?**
Refer to README.md for detailed documentation.
