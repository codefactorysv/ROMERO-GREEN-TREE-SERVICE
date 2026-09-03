import { trustPoints } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

export function TrustBar() {
  return (
    <section className="relative border-b border-forest-900/10 bg-forest-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
        {trustPoints.map((point, i) => (
          <Reveal key={point.title} delay={i * 0.07} y={16}>
            <div className="group flex h-full flex-col items-center gap-2 border-forest-800/60 px-4 py-7 text-center transition-colors hover:bg-forest-900/60 sm:border-r sm:last:border-r-0">
              <div className="flex size-11 items-center justify-center rounded-full bg-lime-400/10 text-lime-300 ring-1 ring-lime-300/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-lime-400/20">
                <Icon name={point.icon} className="size-5" />
              </div>
              <p className="text-sm font-semibold text-cream-50">{point.title}</p>
              <p className="hidden text-xs text-cream-100/60 sm:block">{point.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
