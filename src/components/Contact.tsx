import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-forest-950 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 size-[32rem] rounded-full bg-forest-700/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
              Free Estimate
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
              Let&apos;s Take Care of Your Trees
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cream-100/75">
              Tell us what you need and we&apos;ll get back to you with a free, no-obligation
              estimate. Prefer to talk it through? Give us a call.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-3 rounded-2xl border border-cream-50/10 bg-forest-900/60 p-4 transition-colors hover:border-lime-300/40"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-lime-400/15 text-lime-300">
                  <Icon name="phone" className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-cream-100/50">Call us</p>
                  <p className="font-semibold text-cream-50">{siteConfig.phoneDisplay}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-cream-50/10 bg-forest-900/60 p-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-lime-400/15 text-lime-300">
                  <Icon name="clock" className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-cream-100/50">
                    Regular service hours
                  </p>
                  <p className="font-semibold text-cream-50">{siteConfig.hours}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-lime-300/25 bg-forest-900/60 p-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-lime-400/15 text-lime-300">
                  <Icon name="emergency" className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-cream-100/50">
                    Tree emergency?
                  </p>
                  <p className="font-semibold text-cream-50">{siteConfig.emergency}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
