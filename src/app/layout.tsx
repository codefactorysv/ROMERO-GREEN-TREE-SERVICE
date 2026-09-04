import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const description =
  "Professional tree and lawn services including tree work, stump grinding, lawn care, mulching and sod installation. Call ROOSTER today for a free estimate.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ROOSTER | Professional Tree & Lawn Services",
    template: `%s | ${siteConfig.brand}`,
  },
  description,
  keywords: [
    "tree services",
    "stump grinding",
    "lawn services",
    "lawn care",
    "mulching",
    "sod installation",
    "emergency tree service",
    "residential tree service",
    "commercial tree service",
    "tree service near me",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "ROOSTER | Professional Tree & Lawn Services",
    description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1600,
        height: 1200,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROOSTER | Professional Tree & Lawn Services",
    description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  alternateName: siteConfig.brand,
  description:
    "Professional tree services, stump grinding, lawn services, mulching, and sod installation for residential and commercial properties. Emergency tree service available 24/7.",
  telephone: "+18329898795",
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  logo: `${siteConfig.url}${siteConfig.logoDark}`,
  priceRange: "$$",
  // Address, service area, email, ratings and founding date are intentionally
  // omitted — not confirmed by the client. Add them once known.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  makesOffer: [
    "Tree Services",
    "Stump Grinding",
    "Lawn Services",
    "Mulching",
    "Sod Installation",
    "Flower Beds",
    "Wood Fence",
    "Power Washing",
    "Junk Hauling",
    "Property Maintenance",
    "24/7 Emergency Tree Service",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-900">
        {children}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
