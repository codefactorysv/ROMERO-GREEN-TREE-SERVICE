// Blog content loader.
//
// Posts are plain MDX files in src/content/blog/ — same philosophy as
// src/lib/content.ts: edit a file, no CMS, no database, no build step to learn.
// Everything here runs on the server at build time, so it is free at runtime.

import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Average adult reading speed, used for the "x min read" badge. */
const WORDS_PER_MINUTE = 200;

export type PostFrontmatter = {
  title: string;
  slug: string;
  description: string;
  /** `YYYY-MM-DD`, or a full ISO 8601 timestamp with an offset. */
  date: string;
  author: string;
  /** Path under public/, e.g. "/images/real/why-water-removal.jpg". */
  cover: string;
  coverAlt: string;
  /**
   * Optional Tailwind object-position utility, e.g. "object-[50%_30%]". Most of
   * the crew's photos are portrait, so a landscape crop needs steering onto the
   * subject — same convention as `imagePosition` in src/lib/content.ts.
   */
  coverPosition?: string;
  tags: string[];
  /** Draft posts are visible in development and hidden in production. */
  draft: boolean;
  /** Optional last-edited date; falls back to `date`. */
  updated?: string;
};

export type PostMeta = PostFrontmatter & {
  /** "August 12, 2026" — what the reader sees. */
  dateLabel: string;
  /** What <time dateTime> and JSON-LD datePublished get. */
  dateISO: string;
  /** dateModified for JSON-LD; equals dateISO when the post was never edited. */
  updatedISO: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  /** Raw MDX body, frontmatter already stripped. */
  content: string;
};

const REQUIRED_KEYS = [
  "title",
  "slug",
  "description",
  "date",
  "author",
  "cover",
  "coverAlt",
] as const;

/**
 * Minimal frontmatter reader for the small, fixed set of keys above.
 *
 * A full YAML parser would be a dependency (and a foot-gun — YAML happily
 * reinterprets unquoted values) for something this project only needs in one
 * shape: scalars, booleans, and a list of tags.
 */
function parseFrontmatter(raw: string, file: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    throw new Error(`Blog post ${file} is missing its --- frontmatter block.`);
  }

  const data: Record<string, string | boolean | string[]> = {};
  const lines = match[1].split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) {
      throw new Error(`Blog post ${file} has an unreadable frontmatter line: ${line}`);
    }

    const [, key, rest] = pair;
    const value = rest.trim();

    // `tags:` followed by indented "- item" lines.
    if (value === "") {
      const items: string[] = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        i += 1;
        items.push(unquote(lines[i].replace(/^\s*-\s+/, "").trim()));
      }
      data[key] = items;
      continue;
    }

    // Inline list: [a, "b c"]
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(",").map((item) => unquote(item.trim())).filter(Boolean)
        : [];
      continue;
    }

    if (value === "true" || value === "false") {
      data[key] = value === "true";
      continue;
    }

    data[key] = unquote(value);
  }

  return { data, content: raw.slice(match[0].length) };
}

function unquote(value: string): string {
  const quoted = /^(["'])([\s\S]*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
}

function readingMinutes(content: string): number {
  const words = content
    // Drop MDX/markdown syntax so it does not inflate the count.
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function formatDateLabel(date: string): string {
  // Parsing "YYYY-MM-DD" as UTC and formatting in UTC keeps the label on the
  // day the author wrote, instead of sliding a day west of Greenwich.
  const value = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date);
  if (Number.isNaN(value.getTime())) {
    throw new Error(`Blog post has an invalid date: ${date}`);
  }
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * A parsed file. Metadata and body are kept apart so the index and the landing
 * page can pass posts to client components without shipping every article body
 * to the browser.
 */
type LoadedPost = { meta: PostMeta; content: string };

function toPost(file: string): LoadedPost {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = parseFrontmatter(raw, file);

  for (const key of REQUIRED_KEYS) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim()) {
      throw new Error(`Blog post ${file} is missing the required "${key}" frontmatter field.`);
    }
  }

  const slug = data.slug as string;
  const expected = file.replace(/\.mdx?$/, "");
  if (slug !== expected) {
    throw new Error(
      `Blog post ${file} declares slug "${slug}". Rename the file to ${slug}.mdx so the route and the file stay in sync.`,
    );
  }

  const cover = data.cover as string;
  if (!fs.existsSync(path.join(PUBLIC_DIR, cover.replace(/^\//, "")))) {
    throw new Error(
      `Blog post ${file} points at a cover image that does not exist: public${cover}`,
    );
  }

  const date = data.date as string;
  const updated = typeof data.updated === "string" ? data.updated : undefined;

  return {
    meta: {
      title: data.title as string,
      slug,
      description: data.description as string,
      date,
      author: data.author as string,
      cover,
      coverAlt: data.coverAlt as string,
      coverPosition:
        typeof data.coverPosition === "string" ? data.coverPosition : undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: data.draft === true,
      updated,
      dateLabel: formatDateLabel(date),
      dateISO: date,
      updatedISO: updated ?? date,
      readingMinutes: readingMinutes(content),
    },
    content,
  };
}

function readPosts(): LoadedPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(toPost)
    .filter(({ meta }) => !meta.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

/** Every published post, newest first, without the article bodies. */
export function getAllPosts(): PostMeta[] {
  return readPosts().map(({ meta }) => meta);
}

/** The n newest published posts — used by the landing page teaser. */
export function getLatestPosts(count: number): PostMeta[] {
  return getAllPosts().slice(0, count);
}

/** A single post with its body, or null when the slug does not exist. */
export function getPostBySlug(slug: string): Post | null {
  const found = readPosts().find(({ meta }) => meta.slug === slug);
  return found ? { ...found.meta, content: found.content } : null;
}

/** Every tag in use, most-used first, then alphabetically. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const { meta } of readPosts()) {
    for (const tag of meta.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
