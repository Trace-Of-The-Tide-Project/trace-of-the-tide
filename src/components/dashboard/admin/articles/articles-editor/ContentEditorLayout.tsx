"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AvailableBlocks,
  type BlockType,
} from "@/components/dashboard/admin/articles/articles-editor/AvailableBlocks";
import {
  ContentBlocks,
  type ContentBlock,
} from "@/components/dashboard/admin/articles/articles-editor/ContentBlocks";
import {
  ContentSettings,
  type ArticleWorkflowStatus,
} from "@/components/dashboard/admin/articles/articles-editor/ArticleSettings";
import { ContentEditorFooter } from "@/components/dashboard/admin/articles/articles-editor/ContentEditorFooter";
import { ScheduleArticleModal } from "@/components/dashboard/admin/articles/articles-editor/modals/ScheduleArticleModal";
import { buildArticleBlocksFromEditor } from "@/components/dashboard/admin/articles/articles-editor/lib/build-api-blocks";
import { articleDetailBlocksToContentBlocks } from "@/components/dashboard/admin/articles/articles-editor/lib/api-blocks-to-content-blocks";
import {
  articleConfig,
  contentFormConfigForType,
  type ContentFormConfig,
} from "./content-form-config";
import { invalidateAdminArticlesListCache } from "@/lib/dashboard/admin-articles-list-cache";
import {
  createArticle,
  getArticleById,
  getArticleIdFromCreateResponse,
  publishArticle,
  scheduleArticle,
  updateArticle,
  type ArticleLifecycleStatus,
  type CreateArticlePayload,
} from "@/services/articles.service";
import { isAxiosError } from "axios";

const titleClass =
  "w-full border-0 bg-transparent px-0 py-2 text-lg text-white placeholder:text-white outline-none";

function errMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
      if (Array.isArray(o.message)) return o.message.map(String).join("; ");
      if (typeof o.error === "string") return o.error;
    }
    return e.message || "Request failed";
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}

function editPatchFromPayload(payload: CreateArticlePayload) {
  return {
    title: payload.title || undefined,
    category: payload.category || undefined,
    collection_id: payload.collection_id?.trim() ? payload.collection_id.trim() : null,
    blocks: payload.blocks,
    tag_ids: payload.tag_ids,
  };
}

export type ContentEditorLayoutProps = {
  /** Create mode */
  config?: ContentFormConfig;
  /** Edit mode — same editor UI, loads article into the form */
  articleId?: string;
};

const ADMIN_ARTICLES_PATH = "/admin/articles";

export function ContentEditorLayout({ config: configFromProps, articleId }: ContentEditorLayoutProps) {
  const router = useRouter();
  const invalidateArticlesListAndLeave = useCallback(() => {
    invalidateAdminArticlesListCache();
    router.push(ADMIN_ARTICLES_PATH);
  }, [router]);
  const isEditMode = Boolean(articleId);
  const initialWasDraftRef = useRef(true);

  const [config, setConfig] = useState<ContentFormConfig>(() => configFromProps ?? articleConfig);

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => configFromProps?.defaultBlocks ?? articleConfig.defaultBlocks);
  const [workflowStatus, setWorkflowStatus] = useState<ArticleWorkflowStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("en");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articleLoading, setArticleLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    if (configFromProps && !articleId) {
      setConfig(configFromProps);
      setBlocks(configFromProps.defaultBlocks);
    }
  }, [configFromProps, articleId]);

  useEffect(() => {
    if (!articleId) return;
    let cancelled = false;
    (async () => {
      setArticleLoading(true);
      setLoadError(null);
      try {
        const a = await getArticleById(articleId);
        if (cancelled) return;
        if (!a) {
          setLoadError("Article not found.");
          return;
        }
        setConfig(contentFormConfigForType(a.content_type));
        setTitle(a.title ?? "");
        setCategory(a.category ?? "");
        const st = (a.status || "draft").trim().toLowerCase();
        initialWasDraftRef.current = st === "draft";
        const isScheduled =
          st === "scheduled" ||
          st === "schedule_pending" ||
          st === "scheduled_for_publish";
        setWorkflowStatus(
          isScheduled ? "scheduled" : st === "published" ? "published" : "draft",
        );
        const sat = a.scheduled_at?.trim();
        setScheduledAt(sat && sat.length ? sat : null);
        setLanguage((a.language || "en").trim() || "en");
        setVisibility((a.visibility || "public").toLowerCase() === "private" ? "private" : "public");
        setSeoTitle(a.seo_title?.trim() ?? "");
        setMetaDescription(a.meta_description?.trim() ?? "");
        setCollectionId(a.collection_id?.trim() ?? "");
        setTagIds(
          Array.isArray(a.tags)
            ? a.tags.map((t) => t.id).filter((id): id is string => typeof id === "string")
            : [],
        );
        const mapped = articleDetailBlocksToContentBlocks(a.blocks);
        setBlocks(
          mapped.length
            ? mapped
            : [{ id: crypto.randomUUID(), type: "paragraph", content: "" }],
        );
      } catch (e) {
        if (!cancelled) setLoadError(errMessage(e));
      } finally {
        if (!cancelled) setArticleLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [articleId, loadKey]);

  const addBlock = useCallback((type: BlockType) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        ...(type === "divider" ? {} : { content: "" }),
      },
    ]);
  }, []);

  const addCoverBlock = useCallback(() => {
    setBlocks((prev) => [
      {
        id: crypto.randomUUID(),
        type: "image" as const,
      },
      ...prev,
    ]);
  }, []);

  const reorderBlocks = useCallback((activeId: string, overId: string) => {
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === activeId);
      const to = prev.findIndex((b) => b.id === overId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      // Insert at original target index (same rule as splice(from,1); splice(to,0) on a copy).
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i < 0) return prev;
      const b = prev[i]!;
      const copy: ContentBlock = {
        ...b,
        id: crypto.randomUUID(),
        file: undefined,
        files: b.files ? [...b.files] : undefined,
      };
      const next = [...prev];
      next.splice(i + 1, 0, copy);
      return next;
    });
  }, []);

  const updateBlock = useCallback((id: string, patch: Partial<ContentBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const buildPayload = useCallback(async (): Promise<CreateArticlePayload> => {
    const apiBlocks = await buildArticleBlocksFromEditor(blocks);
    const cid = collectionId.trim();
    return {
      title: title.trim(),
      content_type: config.contentType,
      category: category.trim(),
      language: language.trim() || undefined,
      visibility,
      seo_title: seoTitle.trim() || undefined,
      meta_description: metaDescription.trim() || undefined,
      collection_id: cid || undefined,
      tag_ids: tagIds.length ? tagIds : undefined,
      blocks: apiBlocks,
    };
  }, [
    blocks,
    title,
    config.contentType,
    category,
    language,
    visibility,
    seoTitle,
    metaDescription,
    collectionId,
    tagIds,
  ]);

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const payload = await buildPayload();
      if (payload.blocks.length === 0) {
        setError("Add at least one block with content (empty placeholders are not sent).");
        return;
      }
      if (isEditMode && articleId) {
        const status: ArticleLifecycleStatus =
          workflowStatus === "draft"
            ? "draft"
            : workflowStatus === "published"
              ? "published"
              : "scheduled";
        await updateArticle(articleId, { ...editPatchFromPayload(payload), status });
        invalidateArticlesListAndLeave();
        return;
      }
      await createArticle(payload);
      invalidateArticlesListAndLeave();
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setBusy(false);
    }
  }, [title, category, buildPayload, invalidateArticlesListAndLeave, isEditMode, articleId, workflowStatus]);

  const handlePublish = useCallback(async () => {
    if (workflowStatus !== "published" && workflowStatus !== "scheduled") return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const payload = await buildPayload();
      if (payload.blocks.length === 0) {
        setError("Publishing requires at least one block with content.");
        return;
      }
      if (isEditMode && articleId) {
        await updateArticle(articleId, editPatchFromPayload(payload));
        if (initialWasDraftRef.current || workflowStatus === "scheduled") {
          await publishArticle(articleId);
          initialWasDraftRef.current = false;
        }
        invalidateArticlesListAndLeave();
        return;
      }
      const res = await createArticle(payload);
      const id = getArticleIdFromCreateResponse(res);
      if (!id) {
        setError("Article was created but no id was returned; cannot publish.");
        return;
      }
      await publishArticle(id);
      invalidateArticlesListAndLeave();
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setBusy(false);
    }
  }, [workflowStatus, title, category, buildPayload, invalidateArticlesListAndLeave, isEditMode, articleId]);

  const handleScheduleConfirm = useCallback(
    async (iso: string) => {
      if (workflowStatus !== "published" && workflowStatus !== "scheduled") return;
      if (!title.trim()) {
        setError("Title is required.");
        setScheduleModalOpen(false);
        return;
      }
      if (!category.trim()) {
        setError("Category is required.");
        setScheduleModalOpen(false);
        return;
      }
      setError(null);
      setBusy(true);
      try {
        const payload = await buildPayload();
        if (payload.blocks.length === 0) {
          setError("Scheduling requires at least one block with content.");
          setScheduleModalOpen(false);
          return;
        }
        if (isEditMode && articleId) {
          await updateArticle(articleId, {
            ...editPatchFromPayload(payload),
            status: "scheduled",
          });
          await scheduleArticle(articleId, iso);
          setScheduleModalOpen(false);
          invalidateArticlesListAndLeave();
          return;
        }
        const res = await createArticle(payload);
        const id = getArticleIdFromCreateResponse(res);
        if (!id) {
          setError("Article was created but no id was returned; cannot schedule.");
          setScheduleModalOpen(false);
          return;
        }
        await scheduleArticle(id, iso);
        setScheduleModalOpen(false);
        invalidateArticlesListAndLeave();
      } catch (e) {
        setError(errMessage(e));
        setScheduleModalOpen(false);
      } finally {
        setBusy(false);
      }
    },
    [workflowStatus, title, category, buildPayload, invalidateArticlesListAndLeave, isEditMode, articleId],
  );

  if (isEditMode && articleLoading) {
    return (
      <div className="flex min-h-0 flex-col p-8 text-sm text-gray-500" role="status">
        Loading article…
      </div>
    );
  }

  if (isEditMode && loadError) {
    return (
      <div className="flex min-h-0 flex-col gap-4 p-8 text-white">
        <Link href={ADMIN_ARTICLES_PATH} className="text-sm text-[#C9A96E] hover:underline">
          ← Articles
        </Link>
        <p className="text-sm text-red-300">{loadError}</p>
        <button
          type="button"
          onClick={() => setLoadKey((k: number) => k + 1)}
          className="w-fit text-sm text-gray-400 underline hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!isEditMode && !configFromProps) {
    return (
      <div className="p-8 text-sm text-red-300">
        Editor misconfigured: pass <code className="text-white">config</code> for create mode.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col">
      <ScheduleArticleModal
        open={scheduleModalOpen}
        busy={busy}
        onClose={() => !busy && setScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
      />

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="min-w-0 flex-1 space-y-6 overflow-y-auto">
          {isEditMode && articleId ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#444444] pb-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link href={ADMIN_ARTICLES_PATH} className="text-[#C9A96E] hover:underline">
                  ← Articles
                </Link>
                <span className="text-gray-500">Edit article</span>
              </div>
              <Link
                href={`/content/article?id=${encodeURIComponent(articleId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#444444] bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#C9A96E]/50 hover:bg-[#252525]"
              >
                Preview
              </Link>
            </div>
          ) : null}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={config.titlePlaceholder}
            className={titleClass}
          />
          <ContentBlocks
            blocks={blocks}
            onRemoveBlock={removeBlock}
            onDuplicateBlock={duplicateBlock}
            onUpdateBlock={updateBlock}
            onAddCoverBlock={addCoverBlock}
            onReorderBlock={reorderBlocks}
            config={config}
          />
        </div>

        <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
          <AvailableBlocks onAddBlock={addBlock} />
          <ContentSettings
            title={config.settingsTitle}
            workflowStatus={workflowStatus}
            onWorkflowStatusChange={setWorkflowStatus}
            scheduledAt={scheduledAt}
            category={category}
            onCategoryChange={setCategory}
            language={language}
            onLanguageChange={setLanguage}
            visibility={visibility}
            onVisibilityChange={setVisibility}
            seoTitle={seoTitle}
            onSeoTitleChange={setSeoTitle}
            metaDescription={metaDescription}
            onMetaDescriptionChange={setMetaDescription}
            collectionId={collectionId}
            onCollectionIdChange={setCollectionId}
            tagIds={tagIds}
            onTagIdsChange={setTagIds}
          />
        </aside>
      </div>

      <ContentEditorFooter
        primaryButtonLabel={config.primaryButtonLabel}
        saveDraftLabel={isEditMode ? "Save changes" : undefined}
        workflowStatus={workflowStatus}
        busy={busy}
        error={error}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onOpenSchedule={() => setScheduleModalOpen(true)}
      />
    </div>
  );
}
