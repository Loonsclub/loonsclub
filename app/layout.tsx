import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { SITE, SITE_URL } from "./lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Hero typeface (licensed files live in /public)
const clamp = localFont({
  variable: "--font-clamp",
  src: [
    { path: "../public/Clamp-Light-BF6a4db666a34da.otf", weight: "300", style: "normal" },
    { path: "../public/Clamp-LightItalic-BF6a4db666c5c71.otf", weight: "300", style: "italic" },
  ],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // browser extensions add their own attributes to <html> before React hydrates
    <html
      suppressHydrationWarning
      lang="en"
      className={`${clamp.variable} ${manrope.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
