"use client";

import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";

/**
 * Tag filter + article grid. Mirrors the Gallery section's filter pattern so
 * the two feel like the same site. Filtering client-side keeps /blog fully
 * static — reading the tag from searchParams would opt the route into dynamic
 * rendering for a purely cosmetic control.
 */
export function BlogList({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: string[];
}) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((post) => post.tags.includes(active))),
    [active, posts],
  );

  const filters = ["All", ...tags];

  return (
    <>
      {tags.length > 0 && (
        <div
          role="group"
          aria-label="Filter articles by topic"
          className="mt-8 flex flex-wrap gap-2"
        >
          {filters.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active === tag}
              onClick={() => setActive(tag)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active === tag
                  ? "bg-forest-800 text-cream-50 shadow-md"
                  : "bg-cream-50 text-ink-700 ring-1 ring-forest-900/10 hover:ring-forest-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/*
        The cards carry h3 headings. Without this the index would jump straight
        from the page h1 to an h3, which breaks the heading outline for screen
        reader users navigating by heading.
      */}
      <h2 className="sr-only">Articles</h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 0.08} className="h-full">
            <BlogCard post={post} eager={i === 0} />
          </Reveal>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"} shown
      </p>

      {filtered.length === 0 && (
        <p className="mt-10 text-lg text-ink-700/80">
          No articles under that topic yet — check back soon.
        </p>
      )}
    </>
  );
}
