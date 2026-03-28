"use client";

import { useState } from "react";
import {
  ContributeIcon,
  FolderIcon,
  LinkIcon,
  PenLineIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { BadgeFormModal } from "@/components/dashboard/modals/BadgeFormModal";
import { CategoryFormModal } from "@/components/dashboard/modals/CategoryFormModal";
import { TagFormModal } from "@/components/dashboard/modals/TagFormModal";
import { BadgeIconRenderer } from "@/components/dashboard/admin/system-settings/badge-icon-options";
import { TagHexShell } from "@/components/dashboard/admin/system-settings/TagHexShell";
import {
  SYSTEM_SETTINGS_TABS,
  sampleAchievementBadges,
  sampleContentCategories,
  sampleContentTags,
  type AchievementBadgeRow,
  type ContentCategoryRow,
  type ContentTagRow,
  type SystemSettingsTabId,
} from "@/lib/dashboard/system-settings-constants";

const ACCENT = "#E8DDC0";

/** Chamfered row (matches Reports audit log cards). */
const ROW_CLIP =
  "polygon(11px 0, calc(100% - 11px) 0, 100% 11px, 100% calc(100% - 11px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 11px), 0 11px)";

type CategoryModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "edit"; category: ContentCategoryRow };

type TagModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "edit"; tag: ContentTagRow };

type BadgeModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "edit"; badge: AchievementBadgeRow };

export function SystemSettingsContent() {
  const [activeTab, setActiveTab] = useState<SystemSettingsTabId>("categories");
  const [categories, setCategories] = useState<ContentCategoryRow[]>(() => [...sampleContentCategories]);
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>({ type: "closed" });
  const [tags, setTags] = useState<ContentTagRow[]>(() => [...sampleContentTags]);
  const [tagModal, setTagModal] = useState<TagModalState>({ type: "closed" });
  const [badges, setBadges] = useState<AchievementBadgeRow[]>(() => [...sampleAchievementBadges]);
  const [badgeModal, setBadgeModal] = useState<BadgeModalState>({ type: "closed" });

  const handleCategorySave = (payload: { id?: string; name: string; slug: string }) => {
    if (categoryModal.type === "add") {
      setCategories((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, name: payload.name, slug: payload.slug, itemCount: 0 },
      ]);
    } else if (categoryModal.type === "edit" && payload.id) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === payload.id ? { ...c, name: payload.name, slug: payload.slug } : c
        )
      );
    }
  };

  const closeCategoryModal = () => setCategoryModal({ type: "closed" });

  const handleTagSave = (payload: { id?: string; label: string }) => {
    if (tagModal.type === "add") {
      setTags((prev) => [...prev, { id: `tag-${Date.now()}`, label: payload.label }]);
    } else if (tagModal.type === "edit" && payload.id) {
      setTags((prev) =>
        prev.map((t) => (t.id === payload.id ? { ...t, label: payload.label } : t))
      );
    }
  };

  const closeTagModal = () => setTagModal({ type: "closed" });

  const handleBadgeSave = (payload: {
    id?: string;
    iconId: AchievementBadgeRow["iconId"];
    name: string;
    milestone: string;
  }) => {
    if (badgeModal.type === "add") {
      setBadges((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          iconId: payload.iconId,
          name: payload.name,
          milestone: payload.milestone,
        },
      ]);
    } else if (badgeModal.type === "edit" && payload.id) {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === payload.id
            ? {
                ...b,
                iconId: payload.iconId,
                name: payload.name,
                milestone: payload.milestone,
              }
            : b
        )
      );
    }
  };

  const closeBadgeModal = () => setBadgeModal({ type: "closed" });

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-wrap items-center gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
            {SYSTEM_SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-2.5 text-sm font-medium transition-all sm:px-5 ${
                  activeTab === tab.id
                    ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "categories" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCategoryModal({ type: "add" })}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="[&_svg]:h-4 [&_svg]:w-4">
                  <PlusIcon />
                </span>
                Add Category
              </button>
            </div>
          )}

          {activeTab === "tags" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTagModal({ type: "add" })}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="[&_svg]:h-4 [&_svg]:w-4">
                  <PlusIcon />
                </span>
                Add Tag
              </button>
            </div>
          )}

          {activeTab === "badges" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setBadgeModal({ type: "add" })}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="[&_svg]:h-4 [&_svg]:w-4">
                  <PlusIcon />
                </span>
                Create Badge
              </button>
            </div>
          )}
        </div>

        {activeTab === "categories" && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white">Content Categories</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage content classification categories.
            </p>
            <div className="mt-6 space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-4"
                  style={{
                    clipPath: ROW_CLIP,
                    backgroundColor: "#1a1a1a",
                    boxShadow: "inset 0 0 0 1px #2a2a2a",
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#333] bg-[#121212] text-[#E8DDC0]"
                    aria-hidden
                  >
                    <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                      <FolderIcon />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{cat.name}</p>
                    <p className="mt-0.5 font-mono text-sm text-gray-500">{cat.slug}</p>
                  </div>
                  <span className="hidden shrink-0 text-sm text-gray-500 sm:inline">
                    {cat.itemCount} items
                  </span>
                  <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <span className="sm:hidden text-xs text-gray-500">{cat.itemCount} items</span>
                    <button
                      type="button"
                      onClick={() => setCategoryModal({ type: "edit", category: cat })}
                      className="rounded-lg p-2 text-[#E8DDC0] transition-colors hover:bg-white/10"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        <ContributeIcon />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategories((prev) => prev.filter((c) => c.id !== cat.id))}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        <TrashIcon />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tags" && (
          <div
            className="mt-8 p-6 sm:p-8"
            style={{
              clipPath: ROW_CLIP,
              backgroundColor: "#1a1a1a",
              boxShadow: "inset 0 0 0 1px #2a2a2a",
            }}
          >
            <h2 className="text-lg font-bold text-white">Content Tags</h2>
            <p className="mt-1 text-sm text-gray-500">Special tags for content highlighting</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-4 px-4 py-4 sm:px-5 sm:py-4"
                  style={{
                    clipPath: ROW_CLIP,
                    backgroundColor: "#141414",
                    boxShadow: "inset 0 0 0 1px #2a2a2a",
                  }}
                >
                  <TagHexShell>
                    <LinkIcon />
                  </TagHexShell>
                  <p className="min-w-0 flex-1 font-semibold text-white">{tag.label}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTagModal({ type: "edit", tag })}
                      className="rounded-lg p-2 text-[#E8DDC0] transition-colors hover:bg-white/10"
                      aria-label={`Edit ${tag.label}`}
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        <ContributeIcon />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((t) => t.id !== tag.id))}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${tag.label}`}
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        <TrashIcon />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div
            className="mt-8 p-6 sm:p-8"
            style={{
              clipPath: ROW_CLIP,
              backgroundColor: "#1a1a1a",
              boxShadow: "inset 0 0 0 1px #2a2a2a",
            }}
          >
            <h2 className="text-lg font-bold text-white">Achievement Badges</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure user achievement badges and milestones.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 px-4 py-4 sm:px-5 sm:py-4"
                  style={{
                    clipPath: ROW_CLIP,
                    backgroundColor: "#141414",
                    boxShadow: "inset 0 0 0 1px #2a2a2a",
                  }}
                >
                  <TagHexShell>
                    <BadgeIconRenderer iconId={badge.iconId} />
                  </TagHexShell>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{badge.name}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{badge.milestone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBadgeModal({ type: "edit", badge })}
                    className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-[#E8DDC0]"
                    aria-label={`Edit ${badge.name}`}
                  >
                    <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                      <PenLineIcon />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "categories" && activeTab !== "tags" && activeTab !== "badges" && (
          <div className="mt-8 rounded-xl border border-[#2f2f2f] bg-[#121212] px-6 py-12 text-center text-sm text-gray-500">
            {SYSTEM_SETTINGS_TABS.find((t) => t.id === activeTab)?.label ?? "This section"} — coming
            soon.
          </div>
        )}
      </div>

      <CategoryFormModal
        open={categoryModal.type !== "closed"}
        onClose={closeCategoryModal}
        mode={categoryModal.type === "edit" ? "edit" : "add"}
        categoryId={categoryModal.type === "edit" ? categoryModal.category.id : undefined}
        initialName={categoryModal.type === "edit" ? categoryModal.category.name : ""}
        initialSlug={categoryModal.type === "edit" ? categoryModal.category.slug : ""}
        onSave={handleCategorySave}
      />

      <TagFormModal
        open={tagModal.type !== "closed"}
        onClose={closeTagModal}
        mode={tagModal.type === "edit" ? "edit" : "add"}
        tagId={tagModal.type === "edit" ? tagModal.tag.id : undefined}
        initialLabel={tagModal.type === "edit" ? tagModal.tag.label : ""}
        onSave={handleTagSave}
      />

      <BadgeFormModal
        open={badgeModal.type !== "closed"}
        onClose={closeBadgeModal}
        mode={badgeModal.type === "edit" ? "edit" : "add"}
        badgeId={badgeModal.type === "edit" ? badgeModal.badge.id : undefined}
        initialIconId={badgeModal.type === "edit" ? badgeModal.badge.iconId : undefined}
        initialName={badgeModal.type === "edit" ? badgeModal.badge.name : ""}
        initialMilestone={badgeModal.type === "edit" ? badgeModal.badge.milestone : ""}
        onSave={handleBadgeSave}
      />
    </div>
  );
}
