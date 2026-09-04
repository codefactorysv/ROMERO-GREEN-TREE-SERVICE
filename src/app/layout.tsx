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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Professional Tree Services`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Romero Green Tree Service provides professional tree removal, trimming, pruning, stump grinding, and landscaping for residential and commercial properties. Insured. Free estimates. 24/7 emergency tree service. Hablamos Español.",
  keywords: [
    "tree removal",
    "tree trimming",
    "tree pruning",
    "stump grinding",
    "residential tree service",
    "commercial tree service",
    "landscaping",
    "arborist",
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
    title: `${siteConfig.name} | Professional Tree Services`,
    description: siteConfig.slogan,
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
    title: `${siteConfig.name} | Professional Tree Services`,
    description: siteConfig.slogan,
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
  description:
    "Professional tree removal, trimming, pruning, stump grinding, and landscaping services for residential and commercial properties. Emergency tree service available 24/7.",
  telephone: siteConfig.phone,
  email: siteConfig.email,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  logo: `${siteConfig.url}${siteConfig.logoDark}`,
  priceRange: "$$",
  // Service area / address intentionally omitted — not confirmed by the
  // client. Add a `address` (PostalAddress) and `areaServed` once known.
  knowsLanguage: ["en", "es"],
  makesOffer: [
    "Tree Removal",
    "Tree Trimming",
    "Tree Pruning",
    "Stump Grinding",
    "Landscaping",
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
