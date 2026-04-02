import type { ArticleListItem } from "@/services/articles.service";
import type { ArticleRow } from "@/components/dashboard/admin/articles/articles-main/ArticlesTable";

function stringLabel(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  for (const key of ["title", "name", "collection_name", "label"] as const) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/**
 * List endpoints sometimes echo collection/collaboration name in `title` instead of the article headline.
 * Prefer nested `article.title`, then disambiguate with `seo_title` when `title` matches collection/collaboration.
 */
export function articleListItemDisplayTitle(a: ArticleListItem): string {
  const nested = a.article?.title;
  if (typeof nested === "string" && nested.trim()) return nested.trim();

  const raw = (a.title ?? "").trim();
  const seo = (a.seo_title ?? "").trim();
  const coll = stringLabel(a.collection);
  const collab = stringLabel(a.collaboration);

  const titleIsGroupLabel =
    (coll != null && raw === coll) || (collab != null && raw === collab);
  if (titleIsGroupLabel && seo) return seo;

  return raw || seo || "—";
}

export function formatArticleListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const now = Date.now();
  const diffMs = now - d.getTime();
  if (diffMs < 0) {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatScheduledSubtitle(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function articleStatusKey(status: string | null | undefined): string {
  const raw = String(status ?? "draft").trim().toLowerCase() || "draft";
  if (
    raw === "scheduled" ||
    raw === "schedule_pending" ||
    raw === "scheduled_for_publish"
  ) {
    return "scheduled";
  }
  return raw;
}

/** Same normalization as the articles table (scheduled variants). */
export function isArticleListItemScheduled(a: Pick<ArticleListItem, "status">): boolean {
  return articleStatusKey(a.status) === "scheduled";
}

export function mapArticleListItemToTableRow(a: ArticleListItem): ArticleRow {
  const s = articleStatusKey(a.status);
  let status: ArticleRow["status"];
  let statusColor: string;
  if (s === "published") {
    status = "Published";
    statusColor = "emerald";
  } else if (s === "scheduled") {
    status = "Scheduled";
    statusColor = "blue";
  } else {
    status = "Draft";
    statusColor = "orange";
  }

  const contributors = Array.isArray(a.contributors) ? a.contributors.length : 0;

  return {
    id: a.id,
    slug: a.slug?.trim() || a.id,
    title: articleListItemDisplayTitle(a),
    status,
    statusColor,
    lastUpdated: formatArticleListDate(a.updatedAt),
    views: String(a.view_count ?? 0),
    supporters: contributors > 0 ? String(contributors) : "—",
  };
}
