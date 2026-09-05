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
   | `date`          | Yes      | `YYYY-MM-DD`, or a full ISO 8601 timestamp with an offset.         |
   | `author`        | Yes      | Shown as the byline and used as the schema author.                 |
   | `cover`         | Yes      | Path under `public/`. The build fails if the file is missing.      |
   | `coverAlt`      | Yes      | Descriptive alt text — not the title again.                        |
   | `coverPosition` | No       | Tailwind object-position, e.g. `object-[50%_38%]`. Most crew photos are portrait, so a 16:10 crop usually needs steering. |
   | `tags`          | No       | Drives the filter on `/blog` and the schema keywords.              |
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
block on the landing page, in `sitemap.xml`, and with its own canonical URL, Open
Graph tags, `BlogPosting` and `BreadcrumbList` JSON-LD.

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
