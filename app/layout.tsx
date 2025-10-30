import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JKKN Institution | Admission Open 2025-2026",
  description: "JKKN Institution - Leading educational institution offering quality education with state-of-the-art facilities, expert faculty, and excellent placement opportunities.",
  keywords: "JKKN Institution, Education, Admission 2025, College, Engineering, Placement",
  authors: [{ name: "JKKN Institution" }],
  openGraph: {
    title: "JKKN Institution | Admission Open 2025-2026",
    description: "Leading educational institution with excellent facilities and placement opportunities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
