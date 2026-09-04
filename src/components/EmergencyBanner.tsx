import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

export function EmergencyBanner() {
  return (
    <section className="bg-cream-100 pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-forest-950 px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-lime-400/10 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-lime-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-lime-300 ring-1 ring-lime-300/30">
                  <Icon name="emergency" className="size-4" />
                  Tree Emergency?
                </p>
                <h2 className="mt-4 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                  Storm damage or an urgent tree problem?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-cream-100/75">
                  Emergency tree response is available 24/7. Regular service hours are{" "}
                  {siteConfig.hours} — but if a tree comes down, call any time.
                </p>
              </div>

              <a
                href={siteConfig.phoneHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-lime-950/20 transition-all hover:-translate-y-0.5 hover:bg-lime-300 sm:w-auto sm:text-base"
              >
                <Icon name="phone" className="size-4" strokeWidth={2.25} />
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
