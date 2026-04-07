import type { ArticleDetail } from "@/services/articles.service";
import {
  articleBlocksToSections,
  getFirstCoverSrcFromBlocks,
} from "@/lib/content/article-blocks-to-sections";
import { isUsableImageSrc } from "@/lib/content/content-image-src";
import type { ContentPageLayoutProps } from "@/components/content/ContentPageLayout";
import { CONTENT_COLLECTION, CONTENT_RELATED } from "@/lib/constants";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function formatPublished(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

type ContributorLike = {
  name?: string;
  username?: string;
  full_name?: string;
  role?: string;
  user?: { username?: string; full_name?: string };
};

function collectionLabelFromArticle(article: ArticleDetail): string | null {
  const col = article.collection;
  if (!col || typeof col !== "object") return null;
  const name = (col as { name?: string; title?: string }).name?.trim();
  const title = (col as { name?: string; title?: string }).title?.trim();
  return name || title || null;
}

/** Breadcrumb trail: collection name (if any), then article title only. */
function articleContentBreadcrumbs(article: ArticleDetail): { label: string; href?: string }[] {
  const colLabel = collectionLabelFromArticle(article);
  if (colLabel) {
    return [{ label: colLabel }, { label: article.title }];
  }
  return [{ label: article.title }];
}

export function buildArticleContentPageProps(article: ArticleDetail): ContentPageLayoutProps {
  const authorName =
    article.author?.full_name?.trim() || article.author?.username?.trim() || "Author";

  const contributorsRaw = Array.isArray(article.contributors) ? article.contributors : [];
  const contributors = contributorsRaw.map((c) => {
    const row = c as ContributorLike;
    const name =
      row.name ||
      row.full_name ||
      row.user?.full_name ||
      row.username ||
      row.user?.username ||
      "Contributor";
    return {
      name,
      role: row.role || "Contributor",
      initials: initialsFromName(name),
    };
  });

  const firstBlockImage = getFirstCoverSrcFromBlocks(article.blocks);
  const fromApiCover = article.cover_image?.trim() || null;
  const heroCandidate = firstBlockImage ?? fromApiCover;
  const heroSrc = isUsableImageSrc(heroCandidate) ? heroCandidate.trim() : null;

  const media = heroSrc
    ? {
        type: "image" as const,
        src: heroSrc,
        thumbnail: heroSrc,
        title: article.title,
      }
    : {
        type: "image" as const,
        src: "",
        title: article.title,
      };

  return {
    articleId: article.id,
    openCallId: article.open_call_id ?? undefined,
    contentType: article.content_type,
    breadcrumbs: articleContentBreadcrumbs(article),
    media,
    article: {
      title: article.title,
      category: article.category,
      publishedDate: formatPublished(article.published_at),
      readingTime:
        article.reading_time != null && article.reading_time > 0
          ? `${article.reading_time} min read`
          : undefined,
      viewCount:
        typeof article.view_count === "number" && Number.isFinite(article.view_count)
          ? article.view_count
          : undefined,
      sections: articleBlocksToSections(article.blocks, {
        omitCoverSrc: firstBlockImage ?? undefined,
      }),
    },
    author: {
      name: authorName,
      initials: initialsFromName(authorName),
    },
    contributors,
    collection: {
      articleCount: CONTENT_COLLECTION.articleCount,
      duration: CONTENT_COLLECTION.duration,
      items: [...CONTENT_COLLECTION.items].map((item) => ({ ...item })),
    },
    relatedContent: [...CONTENT_RELATED].map((r) => ({ ...r })),
  };
}
