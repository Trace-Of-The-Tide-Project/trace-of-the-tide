import { theme } from "@/lib/theme";

type ContentArticleHeaderProps = {
  title: string;
  edition?: string;
  category?: string;
  publishedDate?: string;
  readingTime?: string;
};

export function ContentArticleHeader({
  title,
  edition,
  category,
  publishedDate,
  readingTime,
}: ContentArticleHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
        {title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
        {edition && (
          <span
            className="mr-1 rounded-full border px-3 py-0.5 text-xs font-semibold"
            style={{ borderColor: theme.accentGold, color: theme.accentGold }}
          >
            {edition}
          </span>
        )}
        {category && (
          <>
            <span className="text-gray-600">·</span>
            <span>Category: {category}</span>
          </>
        )}
        {publishedDate && (
          <>
            <span className="text-gray-600">·</span>
            <span>Published: {publishedDate}</span>
          </>
        )}
        {readingTime && (
          <>
            <span className="text-gray-600">·</span>
            <span>Reading Time: {readingTime}</span>
          </>
        )}
      </div>
    </div>
  );
}
