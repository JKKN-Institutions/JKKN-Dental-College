# JKKN Institution Website

A modern, professional website for JKKN Institution built with Next.js, React, and Tailwind CSS featuring smooth animations and responsive design.

## Features

- **Modern Design**: Professional and clean UI with JKKN brand colors
- **Smooth Animations**: Engaging animations using Framer Motion
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Video Integration**: Campus video background and video carousel
- **Contact Form**: Interactive contact form for inquiries
- **SEO Optimized**: Meta tags and semantic HTML for better search rankings

## Technology Stack

- **Framework**: Next.js 15.x
- **UI Library**: React 18.x
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion 11.x
- **Icons**: React Icons 5.x
- **Language**: TypeScript 5.x

## Brand Colors

- **Primary Green**: `#187041`
- **Cream/Beige**: `#fcfaee`
- **White**: `#ffffff`

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jkkn.ac.in
```

2. Install dependencies:
```bash
npm install
```

3. Add your media assets:
   - Place campus videos in `public/videos/`
   - Place campus images in `public/images/`
   - See README files in those directories for specifications

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
jkkn.ac.in/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── AnnouncementBanner.tsx
│   ├── Navigation.tsx
│   ├── HeroSection.tsx
│   ├── WhyChooseJKKN.tsx
│   ├── OurStrength.tsx
│   ├── CampusVideos.tsx
│   ├── ContactUs.tsx
│   └── Footer.tsx
├── public/
│   ├── images/             # Image assets
│   └── videos/             # Video assets
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies
```

## Sections

1. **Announcement Banner** - Admission 2025-2026 announcement
2. **Navigation** - Responsive navigation with smooth scrolling
3. **Hero Section** - Full-screen video background with CTA
4. **Why Choose JKKN** - 6 key benefits with icons
5. **Our Strength** - Statistics with animated counters
6. **Campus Videos** - Horizontal scrolling video carousel
7. **Contact Us** - Contact form and information
8. **Footer** - Links and social media

## Customization

### Updating Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    green: "#187041",
    cream: "#fcfaee",
  },
}
```

### Updating Content

- Navigation items: `components/Navigation.tsx`
- Statistics: `components/OurStrength.tsx`
- Contact info: `components/ContactUs.tsx`
- Videos list: `components/CampusVideos.tsx`

### Adding New Sections

1. Create a new component in `components/`
2. Import and add it to `app/page.tsx`
3. Add navigation link if needed in `components/Navigation.tsx`

## Performance Optimization

- Videos are lazy loaded
- Images use Next.js Image component (when implemented)
- Animations use hardware-accelerated transforms
- Code splitting via Next.js dynamic imports

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in the `.next` directory.

## Media Assets Setup

### Videos
Place the following videos in `public/videos/`:
- `campus-video.mp4` (Hero background)
- `campus-tour.mp4`
- `library.mp4`
- `sports.mp4`
- `student-life.mp4`
- `events.mp4`
- `hostel.mp4`

### Images
Place the following images in `public/images/`:
- `campus-poster.jpg` (Video fallback)
- `campus-tour.jpg`
- `library.jpg`
- `sports.jpg`
- `student-life.jpg`
- `events.jpg`
- `hostel.jpg`

## Future Enhancements

- CMS integration for easy content management
- Blog/News section
- Online application system
- Student portal
- Virtual campus tour (360°)
- Multi-language support
- Search functionality
- Event calendar

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

© 2025 JKKN Institution. All rights reserved.

## Support

For issues or questions:
- Email: info@jkkn.ac.in
- Phone: +91 4288 268000

---

**Built with ❤️ for JKKN Institution**
