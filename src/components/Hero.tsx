"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { siteConfig, trustPoints } from "@/lib/content";
import { Icon } from "@/components/Icon";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 140]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  const quickTrust = trustPoints.slice(0, 3);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-900"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/real/hero-climber-pine.jpg"
          alt="Romero Green Tree Service climber working high in a pine tree canopy"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-forest-950/40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-40 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-300/40 bg-lime-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-lime-300 backdrop-blur-sm"
        >
          Licensed &amp; Insured Tree Care
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-balance font-display text-4xl font-semibold leading-[1.05] text-cream-50 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Professional Tree Services You Can Trust
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-5 max-w-xl text-balance text-lg text-cream-100/85 sm:text-xl"
        >
          Safe, reliable tree care for your property — removal, trimming, pruning &amp;
          landscaping, done right the first time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.44 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-lime-950/20 transition-all hover:-translate-y-0.5 hover:bg-lime-300 sm:text-base"
          >
            Get a Free Estimate
          </Link>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-50/30 bg-cream-50/10 px-7 py-4 text-sm font-bold uppercase tracking-wide text-cream-50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-cream-50/20 sm:text-base"
          >
            <Icon name="phone" className="size-4" />
            Call {siteConfig.phoneDisplay}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.56 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream-50/15 pt-6"
        >
          {quickTrust.map((point) => (
            <div key={point.title} className="flex items-center gap-2 text-sm text-cream-100/90">
              <Icon name={point.icon} className="size-4 text-lime-300" />
              {point.title}
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-full bg-lime-400/15 px-3 py-1 text-sm font-semibold text-lime-300 ring-1 ring-lime-300/30">
            <Icon name="language" className="size-4" />
            Hablamos Español
          </div>
        </motion.div>
      </div>
    </section>
  );
}
