import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ChevronRight, Clock } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/content";
import { jsonLdHtml, organizationId } from "@/lib/seo";
import { mdxComponents } from "@/components/mdx";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";

type Params = { params: Promise<{ slug: string }> };

/**
 * Every article is prerendered from the files on disk. Paired with a complete
 * generateStaticParams, this makes an unknown slug a real 404 from the router
 * rather than a soft one rendered with a 200.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    // Metadata merges shallowly, so siteName/locale have to be restated here or
    // they are dropped from what the root layout set.
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: post.dateISO,
      modifiedTime: post.updatedISO,
      authors: [post.author],
      tags: [...post.tags],
      images: [{ url: post.cover, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;
  const related = getAllPosts()
    .filter((other) => other.slug !== post.slug)
    .slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.description,
    image: `${siteConfig.url}${post.cover}`,
    datePublished: post.dateISO,
    dateModified: post.updatedISO,
    // Credited to the business: no individual author or credential is confirmed,
    // and inventing a byline would be inventing a credential.
    author: {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logoDark}`,
        width: 999,
        height: 314,
      },
    },
    isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
    keywords: post.tags,
    inLanguage: "en-US",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
      // The last crumb is the current page, so it carries no `item`.
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <>
      <Navbar />

      <main className="bg-cream-100 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-700/60">
              <li>
                <Link href="/" className="transition-colors hover:text-forest-600">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <li>
                <Link href="/blog" className="transition-colors hover:text-forest-600">
                  Blog
                </Link>
              </li>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <li aria-current="page" className="text-ink-700/80">
                {post.title}
              </li>
            </ol>
          </nav>

          <header className="mt-6">
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700 ring-1 ring-forest-900/10"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <h1 className="mt-5 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-ink-700/85">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-forest-900/10 pt-5 text-sm text-ink-700/60">
              <span className="font-semibold text-ink-800">{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.dateISO}>{post.dateLabel}</time>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </div>
          </header>

          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-forest-900">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              // Above the fold and the LCP candidate, so it loads eagerly at high
              // priority — `priority` is deprecated in Next 16.
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 768px, 100vw"
              quality={90}
              className={`object-cover ${post.coverPosition ?? ""}`}
            />
          </div>

          <div className="mt-4">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          <aside className="mt-14 overflow-hidden rounded-3xl bg-forest-950 px-6 py-10 sm:px-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-lime-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-lime-300 ring-1 ring-lime-300/30">
              <Icon name="estimate" className="size-4" />
              Free Estimate
            </p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              Want a second opinion on a tree?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cream-100/75">
              Tell us what you are looking at and we will give you an honest,
              no-obligation estimate. Insured crew, 24/7 emergency tree service,
              and we are glad to help in English or en Español.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-lime-300"
              >
                <Icon name="phone" className="size-4" strokeWidth={2.25} />
                Call {siteConfig.phoneDisplay}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream-50 ring-1 ring-cream-50/25 transition-colors hover:bg-cream-50/10"
              >
                Request a Free Estimate
              </Link>
            </div>
          </aside>
        </article>

        {related.length > 0 && (
          <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                Keep reading
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((other, i) => (
                <Reveal key={other.slug} delay={i * 0.08} className="h-full">
                  <BlogCard post={other} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer onHome={false} />
      <MobileCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbSchema) }}
      />
    </>
  );
}
