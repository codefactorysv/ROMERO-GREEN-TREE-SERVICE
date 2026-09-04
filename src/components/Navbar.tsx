"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-cream-50/95 shadow-[0_2px_24px_-8px_rgba(15,47,24,0.25)] backdrop-blur-sm"
          : "bg-gradient-to-b from-ink-900/70 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="#home" aria-label={`${siteConfig.name} — home`}>
          <Image
            src={solid ? siteConfig.logoDark : siteConfig.logoLight}
            alt={`${siteConfig.name} logo`}
            width={999}
            height={314}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  solid
                    ? "text-ink-800 hover:text-forest-600"
                    : "text-cream-100/90 hover:text-lime-300"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className={`flex items-center gap-2 text-sm font-semibold ${
              solid ? "text-forest-800" : "text-cream-50"
            }`}
          >
            <Icon name="phone" className="size-4" />
            {siteConfig.phoneDisplay}
          </a>
          <Link
            href="#contact"
            className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-md shadow-lime-900/10 transition-all hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-lg"
          >
            Free Estimate
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={siteConfig.phoneHref}
            aria-label={`Call ${siteConfig.phoneDisplay}`}
            className={`flex size-10 items-center justify-center rounded-full ${
              solid ? "bg-forest-800 text-cream-50" : "bg-cream-50/15 text-cream-50"
            }`}
          >
            <Icon name="phone" className="size-4.5" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex size-10 items-center justify-center rounded-full ${
              solid ? "text-forest-900" : "text-cream-50"
            }`}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-forest-900/10 bg-cream-50 px-4 pb-8 pt-2 shadow-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink-800 hover:bg-forest-50 hover:text-forest-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-full bg-lime-400 px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-ink-900 shadow-md"
            >
              Get a Free Estimate
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
