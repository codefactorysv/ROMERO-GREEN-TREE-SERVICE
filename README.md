# Romero Green Tree Service — Landing Page

Conversion-focused landing page for **Romero Green Tree Service**
_"Keeping Families Safe Through Professional Tree Services."_

Phone: **832-272-4373** · Email: **greentreeromero@gmail.com** · Hablamos Español

**Insured · Free estimates · 24/7 emergency tree service**

---

## Stack

| Piece      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19             |
| Language   | TypeScript                                     |
| Styling    | Tailwind CSS v4 (CSS-first theme tokens)       |
| Animation  | Motion (`motion/react`)                        |
| Icons      | lucide-react                                   |
| Blog       | MDX files rendered with `next-mdx-remote/rsc`  |
| Validation | Zod (shared client + server schema)            |
| Email      | Resend                                         |

---

## Requirements

- Node.js 20 or newer
- npm 10 or newer

---

## Quick start

```bash
npm install          # install dependencies
cp .env.example .env.local   # create your local env file
npm run dev          # start dev server at http://localhost:3000
```

Other commands:

```bash
npm run build        # production build
npm start            # run the production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. **Never commit `.env*` files** —
`.gitignore` already blocks them (only `.env.example` is tracked).

| Variable               | Required | What it does                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Yes\*    | Resend API key used to send form submissions. Starts with `re_`.     |
| `CONTACT_TO_EMAIL`     | No       | Inbox that receives requests. Defaults to `greentreeromero@gmail.com`. |
| `CONTACT_FROM_EMAIL`   | No       | "From" address. Defaults to `onboarding@resend.dev` (testing only).  |
| `NEXT_PUBLIC_SITE_URL` | No       | Public URL used for canonical/OG tags and `sitemap.xml`.             |

\* Without `RESEND_API_KEY`:

- **In development**, submissions are logged to the terminal and the form shows the
  success state, so the whole flow can be tested without credentials.
- **In production**, the form returns a friendly error asking the visitor to call
  instead, and the missing key is logged server-side.

### Setting up email (one time)

1. Create an account at <https://resend.com> and add an API key
   (Dashboard → API Keys → Create).
2. Paste it into `.env.local` as `RESEND_API_KEY=re_...`.
3. For a real "From" address, verify the domain `romerogreentree.com` in Resend
   (Dashboard → Domains) and set `CONTACT_FROM_EMAIL=estimates@romerogreentree.com`.
   Until then, `onboarding@resend.dev` works for testing.
4. Redeploy (or restart `npm run dev`). Nothing in the code needs to change.

---

## How the Free Estimate form works

`src/components/ContactForm.tsx` → `POST /api/contact` → Resend → inbox.

- Fields: name\*, phone\*, email, service address/ZIP, service needed\*, property type,
  message, up to 4 optional photos, and a "I prefer service in Spanish" checkbox.
- Validation runs on the client **and** again on the server with the same Zod schema
  (`src/lib/validation.ts`) — the server is the source of truth.
- Protection: hidden honeypot field, per-IP rate limiting (5 requests / 10 minutes),
  HTML escaping of every value in the email, file type and size limits (JPG/PNG/WEBP/HEIC,
  max 8MB each, max 4 files).
- States: idle → sending → success (`"Thank you! We received your request..."`) or a
  clear error with the phone number as a fallback.

Rate limiting is in-memory, which suits a single instance. If the site is ever scaled
across multiple instances, swap `src/lib/rate-limit.ts` for Upstash Redis or similar.

---

## Project structure

```
src/
  app/
    layout.tsx           # fonts, SEO metadata, Open Graph, JSON-LD
    page.tsx             # section composition of the landing page
    globals.css          # Tailwind v4 theme tokens (brand colors, fonts, motion)
    sitemap.ts           # /sitemap.xml (landing page + every blog URL)
    robots.ts            # /robots.txt
    blog/page.tsx        # /blog — article index with tag filter
    blog/[slug]/page.tsx # /blog/<slug> — the article template
    api/contact/route.ts # form endpoint (validation, anti-spam, Resend)
  components/            # one file per section + shared Icon/Reveal/Lightbox
  content/
    blog/*.mdx           # the articles themselves — one file per post
  lib/
    content.ts           # ALL site copy, services, gallery data, contact info
    blog.ts              # reads + validates the MDX files, sorts, tags
    seo.ts               # JSON-LD helpers shared by the layout and the blog
    validation.ts        # shared Zod schema and upload limits
    rate-limit.ts        # in-memory per-IP limiter
public/
  images/real/           # the client's real job photographs
  images/stock/          # licensed stock photos (services with no real photo)
  images/logo/           # Romero logo lockup (transparent PNG, light + dark)
  favicon.png
```

### Editing content

Almost everything visitors read lives in **`src/lib/content.ts`** — phone number,
email, services, gallery captions and categories, trust points. Change it there and it
updates everywhere on the page.

---

## The blog

Articles live at `/blog` (index, with a tag filter) and `/blog/<slug>`. Same
philosophy as the rest of the site: **edit a file, no CMS**.

### Adding a post

1. Create `src/content/blog/<slug>.mdx`. The filename must match the `slug` in the
   frontmatter — the loader throws at build time if they drift apart.
2. Fill in the frontmatter:

   ```yaml
   ---
   title: "Tree Pruning Done Right: A Texas Homeowner's Guide"
   slug: tree-pruning-guide-healthy-trees
   description: "The 140-160 character meta description used for search and social."
   date: 2026-09-02
   author: Romero Green Tree Service
   cover: /images/real/hero-climber-pine.jpg
   coverAlt: "Climber roped into a pine canopy making a pruning cut on a limb"
   coverPosition: object-[55%_50%]
   tags: ["Tree Pruning", "Tree Health"]
   draft: false
   ---
   ```

   | Field           | Required | Notes                                                             |
   | --------------- | -------- | ----------------------------------------------------------------- |
   | `title`         | Yes      | The page `h1`. Keep it under ~65 characters so search doesn't cut it. |
   | `slug`          | Yes      | Must equal the filename without the extension.                     |
   | `description`   | Yes      | Meta description, OG/Twitter description, and card copy.           |
   | `summary`       | No       | One self-contained sentence answering the article's core question. Shown under the headline and used as the `speakable` target. Falls back to `description`. |
   | `date`          | Yes      | `YYYY-MM-DD`, or a full ISO 8601 timestamp with an offset.         |
   | `author`        | Yes      | Shown as the byline and used as the schema author.                 |
   | `cover`         | Yes      | Path under `public/`. The build fails if the file is missing.      |
   | `coverAlt`      | Yes      | Descriptive alt text — not the title again.                        |
   | `coverPosition` | No       | Tailwind object-position, e.g. `object-[50%_38%]`. Most crew photos are portrait, so a 16:10 crop usually needs steering. |
   | `tags`          | No       | Drives the filter on `/blog` and the schema keywords.              |
   | `howToSection`  | No       | Title of the `##` section whose numbered list is a procedure. Setting it emits `HowTo` structured data built from those exact visible steps. |
   | `draft`         | No       | `true` hides the post in production but keeps it visible in `npm run dev`. |
   | `updated`       | No       | Last-edited date. Feeds `dateModified` and the sitemap; defaults to `date`. |

3. Write the body in Markdown. Headings start at `##` (the `h1` is the title), and
   GitHub-flavored tables work. One custom component is available:

   ```mdx
   <Callout type="emergency">Storm damage? Call 24/7.</Callout>
   <Callout type="warning">Topped trees are higher risk, not lower.</Callout>
   <Callout type="tip">Prune most shade trees in winter dormancy.</Callout>
   ```

Everything else is automatic: the post appears on `/blog`, in the "From Our Blog"
block on the landing page, in `sitemap.xml`, in `/llms.txt`, and with its own
canonical URL, Open Graph tags, `BlogPosting` and `BreadcrumbList` JSON-LD.

### Writing for answer engines

Search results and AI assistants both reward the same thing: a question, answered
immediately and completely, in text a machine can lift without guessing. Three
conventions do that work, and all three derive their structured data **from the
visible article** so the markup can never disagree with the page.

**Question headings.** Where a section genuinely answers a question, make the
heading the question and put the whole answer in the first sentence beneath it.
`## How Much of a Tree Can You Prune at One Time?` beats `## The 25 Percent Rule`.
Don't force it — narrative sections keep normal headings.

**A FAQ block.** End the article with a `## Frequently Asked Questions` section,
then one `### ` per question and a single paragraph answering it:

```mdx
## Frequently Asked Questions

### Can a tree be saved after it has been topped?

Often yes, but it takes years of patient restoration pruning rather than a single
visit.
```

The loader lifts that section out of the body, renders it through
`src/components/FaqSection.tsx`, and emits it as `FAQPage` JSON-LD. Keep answers
to one paragraph of two to four sentences, and make the first sentence answer the
question outright — that paragraph is what gets quoted.

**Step-by-step procedures.** If the article contains a numbered procedure, set
`howToSection` to that section's title. Write each step as
`1. **Step name.** What to do.` and the loader turns it into `HowTo` /
`HowToStep` markup. Rename the heading and you must rename `howToSection` with it,
or the build fails — which is the point.

> Do not add `HowTo` or `FAQPage` markup for content that is not visibly on the
> page. Structured data that does not match what a reader sees is a search
> engine policy violation, not a shortcut.

### How it renders

`src/lib/blog.ts` reads and validates the files at build time; `next-mdx-remote/rsc`
compiles the body inside a Server Component, so every article is prerendered as
static HTML. Prose styling comes from `src/components/mdx.tsx`, which maps each
markdown element onto the theme tokens in `globals.css` — deliberately hand-rolled
instead of a typography plugin, which would ship its own type scale and greys and
read as a different brand.

Unknown slugs 404 for real: `generateStaticParams` enumerates the files and
`dynamicParams = false` makes the router reject anything else.

### Writing rules

Articles are marketing copy for a real business, so the **Pending business info**
list below applies to them too. Do not write a service area or city, years in
business, crew size, licenses, certifications, reviews, prices, guarantees, or
regular business hours. The confirmed facts are: the phone number, the email,
insured, free estimates, 24/7 emergency service, residential and commercial, the
listed services, and English/Español. General horticultural and weather facts are
fine — just never attribute them to the company as a statistic.

---

## Answer engines and AI crawlers

`/llms.txt` (generated by `src/app/llms.txt/route.ts`) is a plain-text briefing for
language models: what the business does, the confirmed contact details, the service
list, and every blog article. It is built from `src/lib/content.ts` and
`src/lib/blog.ts`, so it cannot fall out of date the way a hand-written file in
`public/` would.

Its most useful section is the last one, **Not published** — an explicit list of the
things that are unknown (address, service area, hours, licences, reviews). Saying so
out loud is what stops a model from filling the gaps with plausible invention.

`src/app/robots.ts` allows the reputable answer-engine crawlers by name — GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-User, PerplexityBot,
Google-Extended and Applebot-Extended. Delete a line from that array to opt out of
one; nothing else depends on the list.

---

## Turning on local SEO

Local SEO is **built and switched off**, waiting on data. `businessLocation` in
`src/lib/content.ts` holds the shape — address, geo point, service area, opening
hours — with every field empty, and `localBusinessSchema()` in `src/lib/seo.ts`
returns nothing while it is disabled. The root layout already spreads the result
into the `ProfessionalService` node, so no wiring is left to do.

When the client confirms their details:

1. Open `src/lib/content.ts` and fill in **only** the fields they actually gave you.
   A partial address is fine — empty fields are simply left out of the schema.
2. Set `enabled: true`.
3. Rebuild. The business node now carries `address`, `geo`, `areaServed` and
   `openingHours`.

```ts
export const businessLocation: BusinessLocation = {
  enabled: true,
  streetAddress: "123 Example Rd",
  addressLocality: "Houston",
  addressRegion: "TX",
  postalCode: "77001",
  addressCountry: "US",
  latitude: 29.7604,
  longitude: -95.3698,
  areaServed: ["Houston", "Harris County"],
  serviceRadiusKm: null,
  openingHours: ["Mo-Fr 08:00-17:00"],
};
```

Two cautions:

- **`openingHours` is not the emergency line.** Writing `Mo-Su 00:00-23:59` would
  tell search engines the business is staffed around the clock. The confirmed fact
  is 24/7 *emergency* availability, which the site already states in prose.
- **A service-area business without a public storefront** should leave
  `streetAddress` empty and use `areaServed`, or a `latitude`/`longitude` plus
  `serviceRadiusKm`, which is emitted as a `GeoCircle`.

Do the same on the Google Business Profile — see
[`docs/backlinks-strategy.md`](docs/backlinks-strategy.md), where the address is
listed as the item blocking the highest-impact off-page work.

---

## Off-page SEO

Backlinks, citations and reviews are not code. The plan lives in
[`docs/backlinks-strategy.md`](docs/backlinks-strategy.md): Google Business Profile
first, then NAP consistency, industry directories, local citations, Texas trade
organisations, and an ethical review strategy — each marked with effort, impact,
and whether it is blocked on the pending business info above.

---

## Photography

`public/images/real/` holds the client's own job photos. They are used across the hero,
services, story section, featured banner, about and gallery. **The "Our Work" gallery
uses the client's real photos exclusively** — no stock image ever appears there.

`public/images/stock/` holds two licensed stock photos, used only for the two services
the client has no photo of yet:

| File                 | Used for       | Source                                                                                                 | License                                                                     |
| -------------------- | -------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `stump-grinding.jpg` | Stump Grinding | [Stump grinder](https://commons.wikimedia.org/wiki/File:Stump_grinder.jpg) by Wikideas1                  | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — no attribution required |
| `landscaping.jpg`    | Landscaping    | [Cottage garden border at Boreham, Essex, England](https://commons.wikimedia.org/wiki/File:Cottage_garden_border_at_Boreham,_Essex,_England.jpg) by Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — attribution required |

Both are credited in the site footer, which is generated from the `photoCredits` array
in `src/lib/content.ts`.

### Replacing a stock photo with a real one

1. Drop the new photo in `public/images/real/`.
2. In `src/lib/content.ts`, point that service's `image` at the new file, update
   `imageAlt`, and delete its `isStock: true` line.
3. Delete the matching entry from `photoCredits` (the footer credit disappears with it)
   and remove the unused file from `public/images/stock/`.

---

## Deployment

### Vercel (recommended)

1. Push the branch to GitHub.
2. Import the repository at <https://vercel.com/new>.
3. Add the environment variables from `.env.example` under
   Project → Settings → Environment Variables.
4. Deploy. Next.js image optimization, caching, and the `/api/contact` route all work
   out of the box.

### Any Node host

```bash
npm ci
npm run build
npm start        # serves on port 3000 (set PORT to change)
```

The site needs a Node server (not a static export) because of the contact API route and
built-in image optimization.

### After going live

- Point `NEXT_PUBLIC_SITE_URL` at the real domain.
- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Add the business address / service area (see "Pending business info" below) to
  `structuredData` in `src/app/layout.tsx` for local SEO.

---

## Pending business info

These were intentionally **not** invented and should be added when confirmed:

- Business address and service area (city / counties served)
- Years of experience, crew size, certifications, review counts
- Regular business hours (only the 24/7 emergency tree service is confirmed)
- Licensing details — the site claims **insured only**, never "licensed"
- Social media profiles

---

## Git workflow (phone friendly)

```bash
git status                       # what changed
git add -A                       # stage everything
git commit -m "feat: describe the change"
git push -u origin <branch-name> # push
```

Working branch for this project: `claude/romero-green-tree-landing-vi5fkd`.

Before every push, double-check no secrets are staged:

```bash
git diff --cached --name-only    # review the file list
grep -r "re_" --include="*.ts" src/   # should return nothing
```

---

## Accessibility & performance notes

- Semantic HTML with a single `h1`, ordered heading levels, and descriptive `alt` text.
- All animations respect `prefers-reduced-motion`.
- Hero image is prioritized (LCP); every other image is lazy-loaded, responsive via
  `sizes`, and served as WebP/AVIF by Next.js image optimization.
- Lightbox supports Escape and arrow-key navigation.
