import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { HelpCircle } from "lucide-react";
import type { FaqItem } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx";
import { Reveal } from "@/components/Reveal";

/**
 * Tighter prose inside a FAQ card: the shared paragraph style carries the
 * article's vertical rhythm, which is too airy for a short answer in a box.
 */
const answerComponents = {
  ...mdxComponents,
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p
      className="text-base leading-relaxed text-ink-700/85 [&:not(:first-child)]:mt-3"
      {...props}
    />
  ),
};

/**
 * Visible FAQ block at the end of an article.
 *
 * The items come from the article's own "## Frequently Asked Questions"
 * section, which the loader lifts out of the body — so this is the same text
 * that goes into the FAQPage JSON-LD. Answers stay expanded rather than sitting
 * behind an accordion: the point of the block is to be read and quoted.
 */
export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
          Common Questions
        </p>
        <h2
          id="faq-heading"
          className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
      </Reveal>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item, i) => (
          <Reveal key={item.question} delay={i * 0.06} y={16}>
            <article className="rounded-2xl border border-forest-900/10 bg-cream-50 p-5 shadow-sm sm:p-6">
              <h3 className="flex items-start gap-3 font-display text-lg font-semibold text-ink-900 sm:text-xl">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                  <HelpCircle className="size-4" aria-hidden="true" />
                </span>
                {item.question}
              </h3>
              <div className="mt-3 pl-10">
                <MDXRemote
                  source={item.answerMarkdown}
                  components={answerComponents}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
