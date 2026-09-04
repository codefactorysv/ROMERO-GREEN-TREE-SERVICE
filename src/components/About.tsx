import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

const points = [
  { icon: "leaf" as const, text: "Safety-first approach on every job, every climb" },
  { icon: "building" as const, text: "Residential and commercial properties, big or small" },
  { icon: "estimate" as const, text: "Honest, free estimates before any work begins" },
  { icon: "emergency" as const, text: "Tree emergencies answered 24/7" },
];

export function About() {
  return (
    <section id="about" className="relative bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/real/why-two-pines-topping.jpg"
                alt="ROOSTER Tree - Lawn Services crew removing two tall pine trees beside a home"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">About Us</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              ROOSTER Tree - Lawn Services
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-700/85">
              We&apos;re a tree and lawn crew that takes the work seriously — because it
              happens close to homes, families, and the things people care about. Every job
              starts with a clear estimate and ends with a property that&apos;s clean, safe,
              and taken care of.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-700/85">
              Whether it&apos;s a single tree, a full lawn, or ongoing property maintenance,
              residential or commercial, we bring the same attention to safety,
              communication, and quality — and when a storm takes a tree down, we answer
              around the clock.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-forest-800 text-lime-300">
                    <Icon name={point.icon} className="size-4" />
                  </span>
                  <span className="text-sm text-ink-800">{point.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
