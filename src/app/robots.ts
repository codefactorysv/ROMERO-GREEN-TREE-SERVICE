import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

/**
 * Answer-engine and AI crawlers, allowed by name.
 *
 * The wildcard rule already allows them, but several of these bots are opt-in
 * by convention: publishers are expected to name them, and some tools read the
 * absence of a specific rule as a signal not to index. Being quotable by answer
 * engines is the point of the FAQ/HowTo markup on the blog, so the invitation
 * is made explicit here.
 *
 * Remove a line to opt out of that engine — nothing else in the app depends on
 * this list.
 */
const answerEngineCrawlers = [
  "GPTBot", // OpenAI — ChatGPT
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — fetches triggered by a user's question
  "ClaudeBot", // Anthropic — Claude
  "anthropic-ai", // Anthropic — legacy token, still honoured
  "Claude-User", // Anthropic — fetches triggered by a user's question
  "PerplexityBot", // Perplexity
  "Google-Extended", // Google — Gemini grounding and AI Overviews
  "Applebot-Extended", // Apple Intelligence
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...answerEngineCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
