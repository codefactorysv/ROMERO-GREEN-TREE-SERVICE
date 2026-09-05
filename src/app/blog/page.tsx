import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { blogConfig, siteConfig } from "@/lib/content";
import { jsonLdHtml, organizationId } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { BlogList } from "@/components/BlogList";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: blogConfig.metaTitle,
  description: blogConfig.metaDescription,
  alternates: { canonical: "/blog" },
  // Metadata merges shallowly, so the openGraph block has to restate the
  // siteName/locale/type the root layout sets or they are dropped here.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    title: `${blogConfig.metaTitle} | ${siteConfig.name}`,
    description: blogConfig.metaDescription,
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
    title: `${blogConfig.metaTitle} | ${siteConfig.name}`,
    description: blogConfig.metaDescription,
    images: [siteConfig.ogImage],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags().map(({ tag }) => tag);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    url: `${siteConfig.url}/blog`,
    name: `${siteConfig.name} Blog`,
    description: blogConfig.metaDescription,
    inLanguage: "en-US",
    publisher: { "@id": organizationId },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${siteConfig.url}/blog/${post.slug}#article`,
      url: `${siteConfig.url}/blog/${post.slug}`,
      mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
      headline: post.title,
      description: post.description,
      image: `${siteConfig.url}${post.cover}`,
      datePublished: post.dateISO,
      dateModified: post.updatedISO,
      inLanguage: "en-US",
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="bg-cream-100 pb-20 pt-28 sm:pb-28 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
              {blogConfig.eyebrow}
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink-900 sm:text-5xl lg:text-6xl">
              {blogConfig.heading}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700/85">
              {blogConfig.intro}
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <p className="mt-10 text-lg text-ink-700/80">
              The first articles are on their way. In the meantime, call us at{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-forest-700 underline underline-offset-2"
              >
                {siteConfig.phoneDisplay}
              </a>{" "}
              — we are happy to talk through anything on your property.
            </p>
          ) : (
            <BlogList posts={posts} tags={tags} />
          )}
        </div>
      </main>
      <Footer onHome={false} />
      <MobileCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(structuredData) }}
      />
    </>
  );
}
