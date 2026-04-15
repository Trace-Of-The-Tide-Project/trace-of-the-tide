"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCollections, type CollectionItem } from "@/services/collections.service";
import { getAdminTags, type AdminTagItem } from "@/services/admin-tags.service";
import {
  FileTextIcon,
  GridIcon,
  TagIcon,
  GlobeIcon,
  EyeIcon,
  SettingsIcon,
} from "./ArticleEditorIcons";

const inputClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-3 py-2 text-sm text-foreground placeholder-gray-500 outline-none focus:border-gray-500";

const selectClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-3 py-2 text-sm text-gray-400 outline-none focus:border-gray-500";

export type ArticleWorkflowStatus = "draft" | "published" | "scheduled";

type ContentSettingsProps = {
  title?: string;
  workflowStatus: ArticleWorkflowStatus;
  onWorkflowStatusChange: (v: ArticleWorkflowStatus) => void;
  /** When status is scheduled — ISO from API */
  scheduledAt?: string | null;
  category: string;
  onCategoryChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  visibility: "public" | "private";
  onVisibilityChange: (v: "public" | "private") => void;
  seoTitle: string;
  onSeoTitleChange: (v: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (v: string) => void;
  collectionId: string;
  onCollectionIdChange: (v: string) => void;
  tagIds: string[];
  onTagIdsChange: (ids: string[]) => void;
};

function formatScheduledAtHint(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ContentSettings({
  title = "Article Settings",
  workflowStatus,
  onWorkflowStatusChange,
  scheduledAt,
  category,
  onCategoryChange,
  language,
  onLanguageChange,
  visibility,
  onVisibilityChange,
  seoTitle,
  onSeoTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  collectionId,
  onCollectionIdChange,
  tagIds,
  onTagIdsChange,
}: ContentSettingsProps) {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCollectionsLoading(true);
      setCollectionsError(null);
      try {
        const list = await getCollections({
          limit: 200,
          page: 1,
          sortBy: "name",
          order: "ASC",
        });
        if (!cancelled) setCollections(list);
      } catch {
        if (!cancelled) {
          setCollections([]);
          setCollectionsError("Could not load collections.");
        }
      } finally {
        if (!cancelled) setCollectionsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [adminTags, setAdminTags] = useState<AdminTagItem[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [tagPicker, setTagPicker] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTagsLoading(true);
      setTagsError(null);
      try {
        const list = await getAdminTags();
        if (!cancelled) setAdminTags(list);
      } catch {
        if (!cancelled) {
          setAdminTags([]);
          setTagsError("Could not load tags.");
        }
      } finally {
        if (!cancelled) setTagsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tagNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of adminTags) m.set(t.id, t.name);
    return m;
  }, [adminTags]);

  const removeTagById = useCallback(
    (id: string) => {
      onTagIdsChange(tagIds.filter((x) => x !== id));
    },
    [onTagIdsChange, tagIds],
  );

  const addTagFromPicker = useCallback(
    (id: string) => {
      if (!id || tagIds.includes(id)) return;
      onTagIdsChange([...tagIds, id]);
      setTagPicker("");
    },
    [onTagIdsChange, tagIds],
  );

  const tagsAvailableToAdd = useMemo(
    () => adminTags.filter((t) => !tagIds.includes(t.id)),
    [adminTags, tagIds],
  );

  return (
    <div className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] p-4">
      <h3 className="mb-4 text-base font-bold text-foreground">{title}</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <FileTextIcon />
            Status
          </label>
          <select
            className={selectClass}
            value={workflowStatus}
            onChange={(e) => onWorkflowStatusChange(e.target.value as ArticleWorkflowStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          {workflowStatus === "scheduled" && formatScheduledAtHint(scheduledAt ?? null) ? (
            <p className="mt-1 text-xs text-amber-200/90">
              Goes live: {formatScheduledAtHint(scheduledAt ?? null)}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-gray-500">
            Use <span className="text-gray-400">Publish now</span> or <span className="text-gray-400">Schedule</span>{" "}
            when status is Published or Scheduled.
          </p>
        </div>

        <div>
          <label
            className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400"
            htmlFor="article-settings-category"
          >
            <GridIcon />
            Category
            <span className="text-amber-500" aria-hidden>
              *
            </span>
          </label>
          <input
            id="article-settings-category"
            type="text"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="e.g., Documentary, Art"
            className={inputClass}
            required
            aria-required="true"
          />
        </div>

        <div>
          <label
            className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400"
            htmlFor="article-settings-collection"
          >
            <SettingsIcon />
            Collection (optional)
          </label>
          <select
            id="article-settings-collection"
            className={selectClass}
            value={collectionId}
            onChange={(e) => onCollectionIdChange(e.target.value)}
            aria-busy={collectionsLoading}
          >
            <option value="">No collection</option>
            {collectionId &&
            !collections.some((c) => c.id === collectionId) ? (
              <option value={collectionId}>
                Current: {collectionId.slice(0, 8)}…
              </option>
            ) : null}
            {collections.map((c) => (
              <option
                key={c.id}
                value={c.id}
                title={c.description?.trim() || undefined}
              >
                {c.name}
              </option>
            ))}
          </select>
          {collectionsLoading ? (
            <p className="mt-1 text-xs text-gray-500">Loading collections…</p>
          ) : null}
          {collectionsError ? (
            <p className="mt-1 text-xs text-amber-400">{collectionsError}</p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400"
            htmlFor="article-settings-tag-add"
          >
            <TagIcon />
            Tags
          </label>
          <div className="flex flex-col gap-2">
            {tagIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tagIds.map((id) => (
                  <span
                    key={id}
                    className="flex max-w-full items-center gap-1 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-2.5 py-1 text-xs text-foreground"
                  >
                    <span className="truncate" title={id}>
                      {tagNameById.get(id) ?? `Tag (${id.slice(0, 8)}…)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTagById(id)}
                      className="ml-0.5 shrink-0 text-gray-500 hover:text-foreground"
                      aria-label={`Remove ${tagNameById.get(id) ?? "tag"}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <select
              id="article-settings-tag-add"
              className={selectClass}
              value={tagPicker}
              aria-busy={tagsLoading}
              onChange={(e) => {
                const v = e.target.value;
                if (v) addTagFromPicker(v);
                else setTagPicker("");
              }}
            >
              <option value="">
                {tagsLoading ? "Loading tags…" : "Add a tag…"}
              </option>
              {tagsAvailableToAdd.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {!tagsLoading && tagsAvailableToAdd.length === 0 && adminTags.length > 0 ? (
              <p className="text-xs text-gray-500">All available tags are selected.</p>
            ) : null}
            {tagsError ? <p className="text-xs text-amber-400">{tagsError}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <GlobeIcon />
            Language
          </label>
          <select
            className={selectClass}
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="he">Hebrew</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <EyeIcon />
            Visibility
          </label>
          <select
            className={selectClass}
            value={visibility}
            onChange={(e) => onVisibilityChange(e.target.value as "public" | "private")}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
            <SettingsIcon />
            SEO
          </label>
          <div className="space-y-2">
            <div className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-3 py-2 text-xs text-gray-400">
              <p className="text-foreground">yoursite.com/articles/…</p>
              <p className="mt-1">
                {metaDescription.trim()
                  ? metaDescription.slice(0, 160) + (metaDescription.length > 160 ? "…" : "")
                  : "Add a meta description to improve search visibility."}
              </p>
            </div>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              placeholder="SEO Title"
              className={inputClass}
            />
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="Meta description"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ArticleSettings = ContentSettings;
