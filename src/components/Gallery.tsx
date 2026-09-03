"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { galleryItems, type GalleryCategory } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";

const categories: Array<GalleryCategory | "All"> = [
  "All",
  "Tree Removal",
  "Tree Trimming & Pruning",
  "Special Projects",
];

export function Gallery() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      active === "All" ? galleryItems : galleryItems.filter((item) => item.category === active),
    [active],
  );

  return (
    <section id="our-work" className="relative bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
              Our Work
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              Real Jobs, Real Results
            </h2>
            <p className="mt-4 text-lg text-ink-700/80">
              Every photo below is real work by our crew — no stock photos, no stand-ins.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active === cat
                  ? "bg-forest-800 text-cream-50 shadow-md"
                  : "bg-cream-50 text-ink-700 ring-1 ring-forest-900/10 hover:ring-forest-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 0.06} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-forest-900 text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink-900/85 via-ink-900/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-cream-50">{item.caption}</p>
                  <p className="text-xs text-lime-300">{item.category}</p>
                </div>
                <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <Expand className="size-4" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        items={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
