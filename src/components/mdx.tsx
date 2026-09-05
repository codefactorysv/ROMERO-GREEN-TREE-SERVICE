import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { Lightbulb, Siren, TriangleAlert } from "lucide-react";

/**
 * Prose styling for MDX articles, built from the same theme tokens the landing
 * page uses (globals.css). Deliberately hand-rolled instead of pulling in a
 * typography plugin — an off-the-shelf prose theme ships its own type scale and
 * greys, which would read as a different brand from the rest of the site.
 */

type CalloutTone = "emergency" | "warning" | "tip";

const calloutStyles: Record<
  CalloutTone,
  { wrapper: string; iconWrapper: string; label: string; Icon: typeof Siren }
> = {
  emergency: {
    wrapper: "border-lime-400/30 bg-forest-950 text-cream-100/85",
    iconWrapper: "bg-lime-400 text-ink-900",
    label: "text-lime-300",
    Icon: Siren,
  },
  warning: {
    wrapper: "border-forest-900/10 bg-cream-200 text-ink-800",
    iconWrapper: "bg-forest-800 text-lime-300",
    label: "text-forest-700",
    Icon: TriangleAlert,
  },
  tip: {
    wrapper: "border-forest-900/10 bg-forest-50 text-ink-800",
    iconWrapper: "bg-lime-400 text-ink-900",
    label: "text-forest-700",
    Icon: Lightbulb,
  },
};

const calloutLabels: Record<CalloutTone, string> = {
  emergency: "Emergency",
  warning: "Heads up",
  tip: "Tip",
};

/** Highlighted aside inside an article. Usable from MDX as <Callout type="tip">. */
export function Callout({
  type = "tip",
  children,
}: {
  type?: CalloutTone;
  children: ReactNode;
}) {
  const tone = calloutStyles[type] ?? calloutStyles.tip;
  const { Icon } = tone;

  return (
    <aside
      className={`my-8 flex gap-4 rounded-2xl border p-5 sm:p-6 ${tone.wrapper}`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone.iconWrapper}`}
      >
        <Icon className="size-4.5" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] ${tone.label}`}
        >
          {calloutLabels[type] ?? calloutLabels.tip}
        </p>
        <div className="mt-1.5 text-base leading-relaxed [&>p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  );
}

/**
 * Element map handed to the MDX renderer. Articles are written in plain
 * markdown, so every tag the compiler can emit needs a home here.
 */
export const mdxComponents = {
  Callout,

  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 font-display text-2xl font-semibold text-balance text-ink-900 sm:text-3xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-9 mb-3 font-display text-xl font-semibold text-ink-900 sm:text-2xl"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="mt-7 mb-2 text-base font-semibold text-ink-900 sm:text-lg"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-base leading-relaxed text-ink-700/85 sm:text-lg" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-5 flex list-disc flex-col gap-2 pl-5 marker:text-lime-600"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-5 flex list-decimal flex-col gap-2 pl-5 marker:font-semibold marker:text-forest-600"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li
      className="pl-1 text-base leading-relaxed text-ink-700/85 sm:text-lg"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink-900" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-ink-800" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 rounded-r-2xl border-l-4 border-lime-400 bg-cream-50 px-5 py-4 text-base leading-relaxed text-ink-800 italic sm:text-lg [&>p]:my-0"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-forest-900/10" {...props} />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const className =
      "font-medium text-forest-700 underline decoration-forest-300 underline-offset-2 transition-colors hover:text-forest-600 hover:decoration-forest-500";

    // tel:/mailto: and anything off-site stay plain anchors; internal routes go
    // through next/link so they prefetch and navigate client-side.
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className={className}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...props}
        />
      );
    }

    return <Link href={href} className={className} {...props} />;
  },
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-forest-50 px-1.5 py-0.5 font-mono text-[0.9em] text-forest-800"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-8 overflow-x-auto rounded-2xl bg-ink-900 p-5 text-sm text-cream-100"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    // Wide tables scroll in their own container so the page body never does.
    <div className="my-8 overflow-x-auto rounded-2xl border border-forest-900/10">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="bg-forest-50 px-4 py-3 font-semibold text-ink-900"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-t border-forest-900/10 px-4 py-3 align-top text-ink-700/85"
      {...props}
    />
  ),
};
