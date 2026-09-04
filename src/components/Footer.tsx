import Link from "next/link";
import Image from "next/image";
import { navLinks, photoCredits, services, siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";

const mainServices = services.filter((s) => s.size === "lg");

export function Footer() {
  return (
    <footer className="bg-ink-900 pb-28 pt-16 text-cream-100/70 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={siteConfig.logoLight}
              alt={`${siteConfig.brand} ${siteConfig.descriptor} logo`}
              width={902}
              height={255}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{siteConfig.slogan}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-400/20">
              <Icon name="emergency" className="size-3.5" />
              {siteConfig.emergency}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cream-50">
              Navigate
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-lime-300">
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
              {mainServices.map((service) => (
                <li key={service.slug}>
                  <Link href="#services" className="transition-colors hover:text-lime-300">
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
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 font-semibold text-cream-50 transition-colors hover:text-lime-300"
                >
                  <Icon name="phone" className="size-4" />
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0" />
                <span>
                  Regular hours
                  <br />
                  {siteConfig.hours}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="emergency" className="mt-0.5 size-4 shrink-0" />
                <span>{siteConfig.emergency}</span>
              </li>
            </ul>
            <Link
              href="#contact"
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
          <p>Residential &amp; Commercial · Free Estimates · 24/7 Emergency Tree Service</p>
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
