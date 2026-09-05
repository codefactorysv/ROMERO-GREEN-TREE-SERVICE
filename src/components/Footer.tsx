import Link from "next/link";
import Image from "next/image";
import {
  navLinks,
  photoCredits,
  resolveNavHref,
  services,
  siteConfig,
} from "@/lib/content";
import { Icon } from "@/components/Icon";

const bigServices = services.filter((s) => s.size === "lg");

/**
 * `onHome` is false on the blog routes, where the landing-page anchors have to
 * be prefixed with "/" to work. Server component, so the route can't be read
 * from a hook — the caller passes it.
 */
export function Footer({ onHome = true }: { onHome?: boolean }) {
  return (
    <footer className="bg-ink-900 pb-28 pt-16 text-cream-100/70 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={siteConfig.logoLight}
              alt={`${siteConfig.name} logo`}
              width={999}
              height={314}
              className="h-14 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{siteConfig.slogan}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-400/20 transition-colors hover:bg-lime-400/20"
              >
                <Icon name="emergency" className="size-3.5" />
                {siteConfig.emergency}
              </a>
              <p className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-400/20">
                <Icon name="language" className="size-3.5" />
                Hablamos Español
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">
              Navigate
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveNavHref(link.href, onHome)}
                    className="transition-colors hover:text-lime-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">
              Services
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {bigServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={resolveNavHref("#services", onHome)}
                    className="transition-colors hover:text-lime-300"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">
              Get In Touch
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <a href={siteConfig.phoneHref} className="flex items-center gap-2 transition-colors hover:text-lime-300">
                  <Icon name="phone" className="size-4" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={siteConfig.emailHref} className="flex items-center gap-2 break-all transition-colors hover:text-lime-300">
                  <Icon name="mail" className="size-4 shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <Link
              href={resolveNavHref("#contact", onHome)}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink-900 transition-transform hover:-translate-y-0.5"
            >
              Free Estimate
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream-50/10 pt-6 text-xs text-cream-100/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Insured · Residential &amp; Commercial · Free Estimates · 24/7 Emergency Tree Service</p>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-cream-100/25">
          Photo credits —{" "}
          {photoCredits.map((credit, i) => (
            <span key={credit.subject}>
              {i > 0 && " · "}
              {credit.subject}:{" "}
              <a
                href={credit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-cream-100/50"
              >
                {credit.title}
              </a>{" "}
              by {credit.author},{" "}
              <a
                href={credit.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-cream-100/50"
              >
                {credit.license}
              </a>
            </span>
          ))}
          . All other photography © {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}
