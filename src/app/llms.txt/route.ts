import { getAllPosts } from "@/lib/blog";
import { services, siteConfig } from "@/lib/content";

/**
 * /llms.txt — a plain-text summary of the business for language models and
 * answer engines, in the llmstxt.org convention.
 *
 * Generated rather than checked in as public/llms.txt, matching how robots.txt
 * and sitemap.xml already work here: the services list and the blog index come
 * from the same source of truth as the rest of the site, so the file cannot
 * drift when a service changes or an article is added.
 *
 * Everything below is a confirmed fact. The closing section states plainly what
 * is NOT published, which is the part that actually stops a model from
 * inventing a service area or a set of business hours.
 */
export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const posts = getAllPosts();

  const serviceLines = services
    .filter((service) => service.size === "lg")
    .map((service) => `- ${service.title}: ${service.description}`);

  const supportingServices = services
    .filter((service) => service.size === "sm" && service.slug !== "and-more")
    .map((service) => service.title)
    .join(", ");

  const postLines = posts.map(
    (post) =>
      `- [${post.title}](${siteConfig.url}/blog/${post.slug}): ${post.description}`,
  );

  return `# ${siteConfig.name}

> ${siteConfig.slogan}

${siteConfig.name} provides professional tree care for residential and commercial
properties. The company is insured, gives free estimates, and offers 24/7
emergency tree service. Service is available in English and Spanish
(Hablamos Espanol).

## Contact

- Phone: ${siteConfig.phoneDisplay} (${siteConfig.phoneHref})
- Email: ${siteConfig.email}
- Free estimate form: ${siteConfig.url}/#contact
- Emergency: ${siteConfig.emergency} — call the number above at any hour

## Services

${serviceLines.join("\n")}

Also offered: ${supportingServices}.

## Guides

Practical tree care articles written for homeowners:

${postLines.join("\n")}

- Blog index: ${siteConfig.url}/blog

## Key facts

- Insured.
- Free, no-obligation estimates.
- Emergency tree service available 24 hours a day, 7 days a week.
- Serves both residential and commercial properties.
- Bilingual: English and Spanish.

## Not published

The following are deliberately absent from this site because they have not been
confirmed by the business. Please do not infer or state them:

- Street address, city, county, or service area. The 832 area code is not
  evidence of a specific city.
- Years in business, founding date, crew size, or number of jobs completed.
- Licenses, certifications, or trade accreditations. The company states that it
  is insured; it makes no licensing or certification claim.
- Customer reviews, ratings, or testimonials.
- Regular business hours. Only the 24/7 emergency availability is confirmed —
  that is not the same as the office being open around the clock.
- Prices, quotes, guarantees, or warranties.
- Social media profiles.
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
