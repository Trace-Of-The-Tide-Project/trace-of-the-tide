"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArticlesTable,
  ArticleCardsSection,
  type ArticleRow,
} from "@/components/dashboard/admin/articles/articles-main";
import { articleTabs } from "@/lib/dashboard/articles-constants";
import {
  articleListItemDisplayTitle,
  formatArticleListDate,
  formatScheduledSubtitle,
  isArticleListItemScheduled,
  mapArticleListItemToTableRow,
} from "@/lib/dashboard/map-articles-list";
import {
  commitAdminArticlesList,
  invalidateAdminArticlesListCache,
  peekValidAdminArticlesList,
  removeArticleFromAdminArticlesListCache,
} from "@/lib/dashboard/admin-articles-list-cache";
import { deleteArticle, getArticles, type ArticleListItem } from "@/services/articles.service";
import { previewHrefForContentType } from "@/lib/content/public-article-preview-href";
import { isAxiosError } from "axios";
import type { ArticleCardItem } from "@/components/dashboard/admin/articles/articles-main/ArticleCardsSection";
import {
  FileTextIcon,
  ChevronRightIcon,
  ContributeIcon,
  SquareCheckIcon,
  XIcon,
  ShareIcon,
  EyeIcon,
} from "@/components/ui/icons";
import { ConfirmDeleteArticleModal } from "@/components/dashboard/admin/articles/articles-editor/modals/ConfirmDeleteArticleModal";

const CREATE_HREF = "/admin/articles/create";

function editArticleHref(id: string): string {
  return `/admin/articles/edit/${encodeURIComponent(id)}`;
}

function listErrMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
      if (Array.isArray(o.message)) return o.message.map(String).join("; ");
    }
    return e.message || "Failed to load articles";
  }
  if (e instanceof Error) return e.message;
  return "Failed to load articles";
}

function deleteErrMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
    }
    return e.message || "Delete failed";
  }
  if (e instanceof Error) return e.message;
  return "Delete failed";
}

function toDraftCards(items: ArticleListItem[]): ArticleCardItem[] {
  return items.map((a) => ({
    id: a.id,
    icon: <FileTextIcon />,
    statusLabel: "Drafted Article",
    title: articleListItemDisplayTitle(a),
    subtitle: formatArticleListDate(a.updatedAt),
    useHexIcon: true,
    compact: true,
    actions: [
      {
        label: "Continue Writing",
        icon: <ChevronRightIcon />,
        href: editArticleHref(a.id),
      },
    ],
  }));
}

function toScheduledIconCards(
  items: ArticleListItem[],
  onRequestDelete: (item: ArticleListItem) => void,
): ArticleCardItem[] {
  return items.map((a) => ({
    id: a.id,
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: a.title,
    subtitle: formatScheduledSubtitle(a.scheduled_at),
    useHexIcon: true,
    compact: true,
    actions: [
      {
        icon: <ContributeIcon />,
        ariaLabel: "Edit article",
        href: editArticleHref(a.id),
      },
      {
        icon: <XIcon />,
        ariaLabel: "Delete scheduled article",
        onClick: () => onRequestDelete(a),
      },
    ],
  }));
}

function toScheduledShareCards(items: ArticleListItem[]): ArticleCardItem[] {
  const fmtViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
  return items.map((a) => ({
    id: `${a.id}-share`,
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: a.title,
    subtitle: formatScheduledSubtitle(a.scheduled_at),
    views: fmtViews(a.view_count ?? 0),
    useHexIcon: true,
    compact: true,
    actions: [
      {
        icon: <ContributeIcon />,
        ariaLabel: "Edit article",
        href: editArticleHref(a.id),
      },
      { label: "Share", icon: <ShareIcon />, onClick: () => {} },
      {
        label: "View",
        icon: <EyeIcon />,
        href: previewHrefForContentType(a.content_type, a.id),
      },
    ],
  }));
}

export function AdminArticlesPageContent() {
  const [articleList, setArticleList] = useState<ArticleListItem[]>(
    () => peekValidAdminArticlesList() ?? [],
  );
  const [loading, setLoading] = useState(() => peekValidAdminArticlesList() === undefined);
  const [error, setError] = useState<string | null>(null);

  const [scheduledDeleteTarget, setScheduledDeleteTarget] = useState<ArticleListItem | null>(null);
  const [scheduledDeleteBusy, setScheduledDeleteBusy] = useState(false);
  const [scheduledDeleteError, setScheduledDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getArticles();
      const list = Array.isArray(res.data) ? res.data : [];
      setArticleList(list);
      commitAdminArticlesList(list);
    } catch (e) {
      setError(listErrMessage(e));
      setArticleList([]);
      invalidateAdminArticlesListCache();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (peekValidAdminArticlesList() !== undefined) return;
    void load();
  }, [load]);

  const onArticleRemoved = useCallback((id: string) => {
    removeArticleFromAdminArticlesListCache(id);
    setArticleList((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const openScheduledDelete = useCallback((item: ArticleListItem) => {
    setScheduledDeleteError(null);
    setScheduledDeleteTarget(item);
  }, []);

  const closeScheduledDelete = useCallback(() => {
    if (scheduledDeleteBusy) return;
    setScheduledDeleteTarget(null);
    setScheduledDeleteError(null);
  }, [scheduledDeleteBusy]);

  const confirmScheduledDelete = useCallback(async () => {
    if (!scheduledDeleteTarget) return;
    setScheduledDeleteBusy(true);
    setScheduledDeleteError(null);
    try {
      const id = scheduledDeleteTarget.id;
      await deleteArticle(id);
      setScheduledDeleteTarget(null);
      onArticleRemoved(id);
    } catch (e) {
      setScheduledDeleteError(deleteErrMessage(e));
    } finally {
      setScheduledDeleteBusy(false);
    }
  }, [scheduledDeleteTarget, onArticleRemoved]);

  const rows: ArticleRow[] = useMemo(
    () => articleList.map(mapArticleListItemToTableRow),
    [articleList],
  );

  const draftCards = useMemo(() => {
    const drafts = articleList.filter((a) => a.status.toLowerCase() === "draft");
    return toDraftCards(drafts.slice(0, 8));
  }, [articleList]);

  const { scheduledIconCards, scheduledShareCards } = useMemo(() => {
    const scheduled = articleList.filter(isArticleListItemScheduled);
    const mid = Math.ceil(scheduled.length / 2) || scheduled.length;
    return {
      scheduledIconCards: toScheduledIconCards(scheduled.slice(0, mid), openScheduledDelete),
      scheduledShareCards: toScheduledShareCards(scheduled.slice(mid)),
    };
  }, [articleList, openScheduledDelete]);

  const fallback = useMemo(
    () => (
      <div className="rounded-lg border border-[var(--tott-card-border)] px-5 py-12 text-center text-sm text-gray-500">
        Loading articles…
      </div>
    ),
    [],
  );

  if (loading) {
    return <div className="space-y-8 my-4 mx-10">{fallback}</div>;
  }

  return (
    <div className="space-y-8 my-4 mx-10">
      <ConfirmDeleteArticleModal
        open={scheduledDeleteTarget != null}
        articleTitle={
          scheduledDeleteTarget ? articleListItemDisplayTitle(scheduledDeleteTarget) : ""
        }
        busy={scheduledDeleteBusy}
        error={scheduledDeleteError}
        onClose={closeScheduledDelete}
        onConfirm={() => void confirmScheduledDelete()}
      />

      {error ? (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-2 text-xs font-medium text-amber-400 underline hover:text-amber-300"
          >
            Try again
          </button>
        </div>
      ) : null}

      <ArticlesTable
        tabs={articleTabs}
        rows={rows}
        addNewHref={CREATE_HREF}
        onArticleDeleted={onArticleRemoved}
      />

      <ArticleCardsSection
        title="Drafted Articles"
        items={draftCards}
        viewAllHref="/admin/articles?tab=drafts"
        compactGap
      />

      <ArticleCardsSection
        title="Scheduled Articles"
        items={scheduledIconCards}
        viewAllHref="/admin/articles?tab=scheduled"
        compactGap
      />

      {scheduledShareCards.length > 0 ? (
        <ArticleCardsSection
          items={scheduledShareCards}
          viewAllHref="/admin/articles?tab=scheduled"
          hideTitle
          compactGap
        />
      ) : null}
    </div>
  );
}
