// Shared SEO helpers. Structured data is rendered as a plain
// <script type="application/ld+json"> inside the component tree, which is what
// the Next.js App Router JSON-LD guide prescribes — next/script is for
// executable JavaScript, and its "afterInteractive" strategy would inject the
// tag client-side, leaving it out of the prerendered HTML entirely.

import { businessLocation, siteConfig } from "@/lib/content";

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

/**
 * Local SEO fields for the business node, built from `businessLocation`.
 *
 * Returns an empty object while local data is unconfirmed, so spreading it into
 * the schema is a no-op today and becomes a full local-business profile the
 * moment the client confirms an address or service area. Every field is emitted
 * only when it actually has a value — a partial address is better than a
 * fabricated complete one.
 */
export function localBusinessSchema(): Record<string, unknown> {
  if (!businessLocation.enabled) return {};

  const {
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry,
    latitude,
    longitude,
    areaServed,
    serviceRadiusKm,
    openingHours,
  } = businessLocation;

  const schema: Record<string, unknown> = {};

  const address: Record<string, string> = {};
  if (streetAddress) address.streetAddress = streetAddress;
  if (addressLocality) address.addressLocality = addressLocality;
  if (addressRegion) address.addressRegion = addressRegion;
  if (postalCode) address.postalCode = postalCode;
  if (addressCountry) address.addressCountry = addressCountry;
  // addressCountry alone is not an address — require something more specific.
  if (Object.keys(address).length > 1) {
    schema.address = { "@type": "PostalAddress", ...address };
  }

  const hasGeo = latitude !== null && longitude !== null;
  if (hasGeo) {
    schema.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }

  if (areaServed.length > 0) {
    schema.areaServed = areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    }));
  } else if (hasGeo && serviceRadiusKm !== null) {
    // Service-area business with no named list: describe the coverage circle.
    schema.areaServed = {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude, longitude },
      geoRadius: serviceRadiusKm * 1000,
    };
  }

  if (openingHours.length > 0) {
    schema.openingHours = openingHours;
  }

  return schema;
}
