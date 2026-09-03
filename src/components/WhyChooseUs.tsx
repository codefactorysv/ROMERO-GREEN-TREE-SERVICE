import Image from "next/image";
import { storyItems } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-forest-950 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 size-[36rem] rounded-full bg-forest-700/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[28rem] rounded-full bg-lime-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
            Tree Work Done the Right Way
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {storyItems.map((item, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={item.title}
                className={`flex flex-col items-center gap-8 lg:gap-16 ${
                  reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <Reveal
                  className="w-full lg:w-1/2"
                  y={40}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-cream-50/10">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <Reveal className="w-full lg:w-1/2" delay={0.1}>
                  <span className="font-display text-6xl font-semibold text-forest-800">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-cream-100/75 sm:text-lg">
                    {item.description}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
