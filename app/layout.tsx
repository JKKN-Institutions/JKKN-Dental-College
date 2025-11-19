import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#187041'
};

export const metadata: Metadata = {
  title: 'JKKN Institution | Admission Open 2025-2026',
  description:
    'JKKN Institution - Leading educational institution offering quality education with state-of-the-art facilities, expert faculty, and excellent placement opportunities.',
  keywords:
    'JKKN Institution, Education, Admission 2025, College, Engineering, Placement',
  authors: [{ name: 'JKKN Institution' }],
  openGraph: {
    title: 'JKKN Institution | Admission Open 2025-2026',
    description:
      'Leading educational institution with excellent facilities and placement opportunities',
    type: 'website',
    locale: 'en_IN'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
