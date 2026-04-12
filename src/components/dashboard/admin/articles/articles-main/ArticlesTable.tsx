"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusIcon, MoreDotsIcon } from "@/components/ui/icons";
import { ConfirmDeleteArticleModal } from "@/components/dashboard/admin/articles/articles-editor/modals/ConfirmDeleteArticleModal";
import { deleteArticle } from "@/services/articles.service";
import { isAxiosError } from "axios";

type Tab = { id: string; label: string };

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  status: "Published" | "Draft" | "Scheduled";
  statusColor: string;
  lastUpdated: string;
  views: string;
  supporters: string;
};

type ArticlesTableProps = {
  tabs: readonly Tab[];
  rows: ArticleRow[];
  addNewHref?: string;
  /** Update list after a row is deleted (e.g. remove locally; no refetch). */
  onArticleDeleted?: (articleId: string) => void | Promise<void>;
};

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

const statusColorMap: Record<string, string> = {
  emerald: "#2ECC71",
  blue: "#3498DB",
  orange: "#E67E22",
};

const TAB_TO_STATUS: Record<string, ArticleRow["status"] | null> = {
  all: null,
  drafts: "Draft",
  published: "Published",
  scheduled: "Scheduled",
};

const ARTICLE_MENU_WIDTH_PX = 160;

function menuCoordsFromAnchor(anchor: HTMLElement) {
  const r = anchor.getBoundingClientRect();
  const left = Math.min(
    Math.max(8, r.right - ARTICLE_MENU_WIDTH_PX),
    window.innerWidth - ARTICLE_MENU_WIDTH_PX - 8,
  );
  return { top: r.bottom + 4, left };
}

export function ArticlesTable({
  tabs,
  rows,
  addNewHref = "/admin/articles/create",
  onArticleDeleted,
}: ArticlesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultTab = tabs[0]?.id ?? "all";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("tab");
    if (fromUrl && tabs.some((t) => t.id === fromUrl)) {
      setActiveTab(fromUrl);
    }
  }, [searchParams, tabs]);

  const selectTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(searchParams.toString());
      if (tabId === defaultTab) {
        params.delete("tab");
      } else {
        params.set("tab", tabId);
      }
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [defaultTab, pathname, router, searchParams]
  );

  const filteredRows = useMemo(() => {
    const want = TAB_TO_STATUS[activeTab];
    if (!want) return rows;
    return rows.filter((r) => r.status === want);
  }, [rows, activeTab]);

  useLayoutEffect(() => {
    if (openMenuId == null) return;
    const reposition = () => {
      const safe = openMenuId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const el = document.querySelector(
        `[data-article-menu-trigger="${safe}"]`,
      ) as HTMLElement | null;
      if (!el) {
        setOpenMenuId(null);
        setMenuPosition(null);
        return;
      }
      setMenuPosition(menuCoordsFromAnchor(el));
    };
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (openMenuId == null) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-article-actions-menu]")) return;
      const wrap = el.closest("[data-article-actions]");
      if (wrap?.getAttribute("data-article-actions") === openMenuId) return;
      setOpenMenuId(null);
      setMenuPosition(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenuId]);

  const openMenuRow = useMemo(
    () => (openMenuId ? rows.find((r) => r.id === openMenuId) ?? null : null),
    [openMenuId, rows],
  );

  useEffect(() => {
    if (openMenuId && !openMenuRow) {
      setOpenMenuId(null);
      setMenuPosition(null);
    }
  }, [openMenuId, openMenuRow]);

  const openDeleteModal = useCallback((row: ArticleRow) => {
    setDeleteError(null);
    setDeleteTarget(row);
    setOpenMenuId(null);
    setMenuPosition(null);
  }, []);

  const closeArticleMenu = useCallback(() => {
    setOpenMenuId(null);
    setMenuPosition(null);
  }, []);

  const toggleArticleMenu = useCallback((row: ArticleRow, anchor: HTMLElement) => {
    if (openMenuId === row.id) {
      closeArticleMenu();
      return;
    }
    setMenuPosition(menuCoordsFromAnchor(anchor));
    setOpenMenuId(row.id);
  }, [openMenuId, closeArticleMenu]);

  const closeDeleteModal = useCallback(() => {
    if (deleteBusy) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }, [deleteBusy]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const id = deleteTarget.id;
      await deleteArticle(id);
      setDeleteTarget(null);
      await onArticleDeleted?.(id);
    } catch (e) {
      setDeleteError(deleteErrMessage(e));
    } finally {
      setDeleteBusy(false);
    }
  }, [deleteTarget, onArticleDeleted]);

  return (
    <div>
      {openMenuRow && menuPosition != null && typeof document !== "undefined"
        ? createPortal(
            <ul
              id={`article-actions-${openMenuRow.id}`}
              data-article-actions-menu
              className="fixed z-300 min-w-[148px] rounded-lg border border-[var(--tott-card-border)] bg-[#252525] py-1 shadow-lg"
              style={{ top: menuPosition.top, left: menuPosition.left }}
              role="menu"
              aria-label={`Actions for ${openMenuRow.title}`}
            >
              <li role="none">
                <Link
                  role="menuitem"
                  href={`/content/article?id=${encodeURIComponent(openMenuRow.id)}`}
                  className="block px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-[var(--tott-dash-ghost-hover)] hover:text-foreground"
                  onClick={closeArticleMenu}
                >
                  Preview
                </Link>
              </li>
              <li role="none">
                <Link
                  role="menuitem"
                  href={`/admin/articles/edit/${encodeURIComponent(openMenuRow.id)}`}
                  className="block px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-[var(--tott-dash-ghost-hover)] hover:text-foreground"
                  onClick={closeArticleMenu}
                >
                  Edit
                </Link>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-red-950/40 hover:text-red-200"
                  disabled={deleteBusy && deleteTarget?.id === openMenuRow.id}
                  onClick={() => openDeleteModal(openMenuRow)}
                >
                  Delete
                </button>
              </li>
            </ul>,
            document.body,
          )
        : null}

      <ConfirmDeleteArticleModal
        open={deleteTarget != null}
        articleTitle={deleteTarget?.title ?? ""}
        busy={deleteBusy}
        error={deleteError}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
      />
      {/* Tabs - segment control with gray effect on selected */}
      <div className="mb-4 flex w-full gap-1 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`flex-1 rounded-md py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border border-[#4A4A4A] bg-[var(--tott-dash-control-bg)] text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href={addNewHref}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ color: "#C9A96E" }}
        >
          <PlusIcon />
          Add new
        </Link>
      </div>

      {/* Table - borders #444444 at top and bottom */}
      <div className="overflow-x-auto rounded-lg border border-[var(--tott-card-border)]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--tott-card-border)]">
              <th
                className="bg-transparent px-5 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Title
              </th>
              <th
                className="bg-transparent px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Status
              </th>
              <th
                className="bg-transparent  px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Last Updated
              </th>
              <th
                className="bg-transparent px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Views
              </th>
              <th
                className="bg-transparent  px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Supporters
              </th>
              <th className="w-10  px-4 py-2" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No articles in this view.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--tott-card-border)] last:border-b-0 transition-colors"
                >
                  <td className="px-5 pt-3.5 pb-0 font-medium" style={{ color: "#DBC99E" }}>
                    {row.title}
                  </td>
                  <td
                    className="px-4 pt-3.5 pb-0"
                    style={{ color: statusColorMap[row.statusColor] ?? "#9ca3af" }}
                  >
                    {row.status}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.lastUpdated}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.views}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.supporters}
                  </td>
                  <td className="px-4 pt-3.5 pb-0">
                    <div className="flex justify-end" data-article-actions={row.id}>
                      <button
                        type="button"
                        data-article-menu-trigger={row.id}
                        className="rounded p-1.5 transition-colors hover:bg-[var(--tott-dash-ghost-hover)] disabled:opacity-40"
                        style={{ color: "#A3A3A3" }}
                        aria-label="Article actions"
                        aria-expanded={openMenuId === row.id}
                        aria-haspopup="menu"
                        aria-controls={
                          openMenuId === row.id ? `article-actions-${row.id}` : undefined
                        }
                        id={`article-actions-trigger-${row.id}`}
                        disabled={deleteBusy && deleteTarget?.id === row.id}
                        onClick={(e) => toggleArticleMenu(row, e.currentTarget)}
                      >
                        <MoreDotsIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
