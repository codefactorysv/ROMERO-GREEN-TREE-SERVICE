"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/Reveal";

export function FeaturedBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-60, 60]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-16 -bottom-16">
          <Image
            src="/images/real/gallery-removal-house.jpg"
            alt="Large pine tree removal beside a historic home"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/75 to-ink-900/30" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
              Experience Matters
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
              Tree Work Requires Experience.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream-100/85">
              Protect your home, your property, and your family with professional tree
              services from a crew that knows how to work safely around what matters most.
            </p>
            <Link
              href="#contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-lime-950/20 transition-all hover:-translate-y-0.5 hover:bg-lime-300 sm:text-base"
            >
              Get Your Free Estimate
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
