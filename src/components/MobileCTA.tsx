"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveNavHref, siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";

export function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-forest-900/10 bg-forest-900/10 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.25)] transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={siteConfig.phoneHref}
        className="flex items-center justify-center gap-2 bg-forest-800 py-4 text-sm font-bold uppercase tracking-wide text-cream-50 active:bg-forest-900"
      >
        <Icon name="phone" className="size-4" />
        Call Now
      </a>
      <a
        href={resolveNavHref("#contact", onHome)}
        className="flex items-center justify-center gap-2 bg-lime-400 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 active:bg-lime-300"
      >
        <Icon name="estimate" className="size-4" />
        Free Estimate
      </a>
    </div>
  );
}
