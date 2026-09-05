// Shared SEO helpers. Structured data is rendered as a plain
// <script type="application/ld+json"> inside the component tree, which is what
// the Next.js App Router JSON-LD guide prescribes — next/script is for
// executable JavaScript, and its "afterInteractive" strategy would inject the
// tag client-side, leaving it out of the prerendered HTML entirely.

import { siteConfig } from "@/lib/content";

/**
 * Stable @id for the business node declared once in the root layout. Every
 * other schema node (author, publisher, ...) points at this instead of
 * describing the business again, so search engines merge them into a single
 * entity rather than reading several unrelated companies with the same name.
 */
export const organizationId = `${siteConfig.url}/#organization`;

/**
 * Serialize a JSON-LD object for `dangerouslySetInnerHTML`.
 *
 * JSON.stringify does not escape "<", so a stray "</script>" inside any string
 * value would close the tag early. Escaping it to its unicode form is the
 * mitigation the Next.js docs call for.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
