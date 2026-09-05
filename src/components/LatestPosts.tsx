import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLatestPosts } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";

/**
 * "From the blog" teaser on the landing page. Renders nothing when there are
 * no published posts, so the section never appears as an empty shell.
 */
export function LatestPosts() {
  const posts = getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
              Tree Care Advice
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              From Our Blog
            </h2>
            <p className="mt-4 text-lg text-ink-700/80">
              Practical guidance on keeping the trees around your home healthy,
              safe, and storm-ready.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1 text-sm font-bold text-forest-700 transition-colors hover:text-forest-600"
          >
            All articles
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08} className="h-full">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
