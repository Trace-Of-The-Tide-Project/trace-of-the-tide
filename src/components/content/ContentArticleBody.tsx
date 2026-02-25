import { theme } from "@/lib/theme";

type ArticleSection = {
  heading?: string;
  paragraphs: string[];
  quote?: string;
};

type ContentArticleBodyProps = {
  sections: ArticleSection[];
};

export function ContentArticleBody({ sections }: ContentArticleBodyProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={i} className="space-y-4">
          {section.heading && (
            <h2 className="text-xl font-bold text-white">{section.heading}</h2>
          )}

          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-sm leading-relaxed text-gray-400">
              {p}
            </p>
          ))}

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
