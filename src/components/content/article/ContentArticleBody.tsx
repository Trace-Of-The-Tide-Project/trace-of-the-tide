import { theme } from "@/lib/theme";

export type ContentArticleCallout = string | { title: string; body: string };

export type ContentArticleSection = {
  heading?: string;
  paragraphs: string[];
  quote?: string;
  /** Callout block — title + body card or legacy body-only string */
  callout?: ContentArticleCallout;
  /** API divider block — horizontal rule (not body text) */
  divider?: boolean;
  /** Inline figures from API image / gallery blocks */
  images?: { src: string; alt?: string; caption?: string }[];
};

type ContentArticleBodyProps = {
  sections: ContentArticleSection[];
};

export function ContentArticleBody({ sections }: ContentArticleBodyProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={i} className="space-y-4">
          {section.heading && (
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {section.heading}
            </h2>
          )}

          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-sm leading-relaxed text-gray-400">
              {p}
            </p>
          ))}

          {section.divider ? (
            <div className="py-3" role="separator">
              <hr
                className="mx-auto h-px w-full max-w-2xl border-0"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${theme.accentGold}33 15%, ${theme.accentGold}55 50%, ${theme.accentGold}33 85%, transparent 100%)`,
                }}
              />
            </div>
          ) : null}

          {section.callout != null && section.callout !== "" ? (
            <aside className="rounded-2xl bg-[#262626] p-8 text-neutral-400" role="note">
              {typeof section.callout === "object" ? (
                <div className="flex flex-col gap-3">
                  {section.callout.title ? (
                    <p className="m-0 text-4xl font-bold leading-tight text-white">
                      {section.callout.title}
                    </p>
                  ) : null}
                  {section.callout.body ? (
                    <p className="m-0 text-lg font-normal leading-relaxed text-neutral-400">
                      {section.callout.body}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="m-0 text-lg font-normal leading-relaxed text-neutral-400">
                  {section.callout}
                </p>
              )}
            </aside>
          ) : null}

          {section.images && section.images.length > 0
            ? section.images.map((img, k) => (
                <figure key={k} className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote article URLs from API */}
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    className="max-h-[min(70vh,720px)] w-full max-w-3xl rounded-lg border border-gray-800 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  {img.caption ? (
                    <figcaption className="mt-2 text-sm italic text-gray-400">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))
            : null}

          {section.quote && (
            <blockquote
              className="rounded-r-lg border-l-4 bg-[#1a1a1a] py-3 pl-5 pr-4 text-sm leading-relaxed text-gray-300"
              style={{ borderColor: theme.accentGold }}
            >
              {section.quote}
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}
