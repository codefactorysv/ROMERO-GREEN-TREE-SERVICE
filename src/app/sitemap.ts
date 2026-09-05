import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Newest post drives the blog index's lastModified, so the index only looks
  // "fresh" when something actually changed.
  const newest = posts[0];

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: newest ? new Date(newest.updatedISO) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      // Matches the dateModified in the article's JSON-LD — the two disagreeing
      // is a trust signal problem.
      lastModified: new Date(post.updatedISO),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
