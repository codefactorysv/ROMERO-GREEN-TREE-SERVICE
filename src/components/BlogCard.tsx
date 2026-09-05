import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

/**
 * Article teaser used on the blog index and the landing page.
 *
 * Type-only import of PostMeta so this stays usable from client components —
 * src/lib/blog.ts reads the filesystem and must never reach the browser.
 */
export function BlogCard({
  post,
  eager = false,
}: {
  post: PostMeta;
  eager?: boolean;
}) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-cream-50 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-900">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              post.coverPosition ?? ""
            }`}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          {post.tags.length > 0 && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest-600">
              {post.tags[0]}
            </p>
          )}

          <h3 className="font-display text-xl font-semibold text-balance text-ink-900 sm:text-2xl">
            {post.title}
          </h3>

          <p className="text-sm leading-relaxed text-ink-700/80">
            {post.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs text-ink-700/60">
            <span className="flex items-center gap-3">
              <time dateTime={post.dateISO}>{post.dateLabel}</time>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </span>
            <span
              aria-hidden="true"
              className="flex items-center gap-1 font-bold text-forest-700 transition-colors group-hover:text-forest-600"
            >
              Read
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
