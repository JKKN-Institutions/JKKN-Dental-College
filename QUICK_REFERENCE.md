# 🚀 Quick Reference Card - JKKN Institution Website

## 📍 Your Website is Live!
**Local:** http://localhost:3001

---

## ⚡ Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
```

---

## 📁 Key Files to Edit

| File | What to Update |
|------|----------------|
| `components/ContactUs.tsx` | Contact info, form, map |
| `components/OurStrength.tsx` | Statistics numbers |
| `components/Footer.tsx` | Social media links |
| `app/layout.tsx` | SEO metadata |
| `tailwind.config.ts` | Brand colors |
| `public/videos/` | Add your videos |
| `public/images/` | Add your images |

---

## 🎨 Brand Colors

```css
Primary Green:  #187041
Cream/Beige:    #fcfaee
White:          #ffffff
```

---

## 📂 Project Structure

```
jkkn.ac.in/
├── app/
│   ├── page.tsx        ← Main page
│   └── layout.tsx      ← SEO & metadata
├── components/         ← All UI components
├── public/
│   ├── images/         ← Your images here
│   └── videos/         ← Your videos here
└── Documentation files
```

---

## 🎬 Required Media Assets

### Videos (MP4, < 50MB each):
- campus-video.mp4
- campus-tour.mp4
- library.mp4
- sports.mp4
- student-life.mp4
- events.mp4
- hostel.mp4

### Images (JPG/PNG, < 500KB each):
- campus-poster.jpg
- campus-tour.jpg
- library.jpg
- sports.jpg
- student-life.jpg
- events.jpg
- hostel.jpg

---

## 🔧 Common Updates

### Update Contact Info
**File:** `components/ContactUs.tsx` (lines 70-130)
- Address
- Phone numbers
- Email addresses
- Office hours

### Update Statistics
**File:** `components/OurStrength.tsx` (lines 15-22)
```typescript
const stats = [
  { number: 25, suffix: "+", label: "Years" },
  { number: 5000, suffix: "+", label: "Students" },
  // ... update numbers here
];
```

### Update Social Media
**File:** `components/Footer.tsx` (lines 80-95)
**File:** `components/ContactUs.tsx` (lines 140-155)
- Replace `#` with actual URLs

### Add Google Maps
**File:** `components/ContactUs.tsx` (line ~203)
```tsx
<iframe src="YOUR_GOOGLE_MAPS_URL" ... />
```

---

## 📝 Section IDs (for navigation)

```
#about          → About section
#institution    → Institution section
#admission      → Admission section
#placements     → Placements section
#facilities     → Facilities section
#career         → Career section
#contact        → Contact Us section
```

---

## 🎯 Website Sections (in order)

1. Announcement Banner
2. Navigation
3. Hero Section
4. Why Choose JKKN
5. Our Strength
6. Campus Videos
7. Contact Us
8. Footer

---

## 🔍 Troubleshooting

### Server won't start?
```bash
npm install
npm run dev
```

### Changes not showing?
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

### Build errors?
```bash
npm run lint
npm run build
```

### Videos not playing?
- Check files are in `public/videos/`
- Check file names match exactly
- Try MP4 format

---

## 📊 Performance Targets

- Load time: < 3 seconds
- Lighthouse: > 90 score
- Mobile friendly: 100%
- No console errors

---

## 🚀 Deployment Steps

1. Add all media assets
2. Update all content
3. Test thoroughly
4. Run `npm run build`
5. Deploy to Vercel/Netlify
6. Configure custom domain

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PRD.md` | Full requirements |
| `README.md` | Complete documentation |
| `SETUP_GUIDE.md` | Setup instructions |
| `VISUAL_GUIDE.md` | Layout & design guide |
| `LAUNCH_CHECKLIST.md` | Pre-launch checklist |
| `PROJECT_SUMMARY.md` | What's been built |
| `QUICK_REFERENCE.md` | This file |

---

## 🆘 Need Help?

1. Check the documentation files above
2. Review Next.js docs: https://nextjs.org/docs
3. Check Tailwind docs: https://tailwindcss.com/docs
4. Check Framer Motion docs: https://framer.com/motion

---

## ✅ Before Launch

- [ ] Add all videos
- [ ] Add all images
- [ ] Update contact info
- [ ] Update statistics
- [ ] Add social links
- [ ] Add Google Maps
- [ ] Test all features
- [ ] Test on mobile
- [ ] Test in multiple browsers
- [ ] Run production build

---

## 🎨 Component Locations

```
AnnouncementBanner → components/AnnouncementBanner.tsx
Navigation         → components/Navigation.tsx
HeroSection        → components/HeroSection.tsx
WhyChooseJKKN      → components/WhyChooseJKKN.tsx
OurStrength        → components/OurStrength.tsx
CampusVideos       → components/CampusVideos.tsx
ContactUs          → components/ContactUs.tsx
Footer             → components/Footer.tsx
```

---

## 💡 Pro Tips

1. **Optimize videos** before adding (compress!)
2. **Test on real mobile devices**, not just browser
3. **Keep backups** before major changes
4. **Update regularly** - keep dependencies fresh
5. **Monitor analytics** after launch
6. **Gather feedback** from real users

---

## 🌐 Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile Safari
✅ Chrome Mobile

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px
Tablet:  640-1024px
Desktop: > 1024px
```

---

## 🎯 Key Features

✅ Professional design
✅ Smooth animations
✅ Fully responsive
✅ Video integration
✅ Contact form
✅ SEO optimized
✅ Fast loading
✅ Accessible

---

## 📞 Support Links

- Next.js: https://nextjs.org
- Tailwind: https://tailwindcss.com
- Framer Motion: https://framer.com/motion
- React Icons: https://react-icons.github.io

---

**Keep this file handy for quick reference!**

🎉 Happy launching! 🎉
