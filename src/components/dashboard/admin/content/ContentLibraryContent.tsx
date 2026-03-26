"use client";

import { useState, useRef, useEffect } from "react";
import {
  sampleContentItems,
  type ContentItem,
  type ContentStatus,
} from "@/lib/dashboard/content-library-constants";
import { theme } from "@/lib/theme";
import { HexIconOutlined } from "@/components/dashboard/admin/articles/articles-create/HexIconOutlined";
import { SearchIcon, FilterIcon, MoreDotsIcon } from "@/components/ui/icons";
import { FilterDropdown } from "@/components/dashboard/admin/users/FilterDropdown";

const TABS: { id: ContentStatus | "all"; label: string }[] = [
  { id: "all", label: "All Content" },
  { id: "Published", label: "Published" },
  { id: "Draft", label: "Drafts" },
  { id: "Flagged", label: "Flagged" },
  { id: "Archived", label: "Archived" },
];

const statusColorMap: Record<ContentStatus, string> = {
  Published: "#2ECC71",
  Draft: "#9CA3AF",
  Flagged: "#ef4444",
  Archived: "#E67E22",
};

const TYPE_OPTIONS = [
  { value: "All Types", label: "All Types" },
  { value: "Film", label: "Film" },
  { value: "Essay", label: "Essay" },
  { value: "Music", label: "Music" },
  { value: "Gallery", label: "Gallery" },
  { value: "Article", label: "Article" },
];

const CATEGORY_OPTIONS = [
  { value: "All Categories", label: "All Categories" },
  { value: "Documentary", label: "Documentary" },
  { value: "Music", label: "Music" },
  { value: "Opinion", label: "Opinion" },
  { value: "Photography", label: "Photography" },
];

const ROW_ACTIONS = [
  { id: "view", label: "View" },
  { id: "edit", label: "Edit" },
  { id: "archive", label: "Archive" },
  { id: "delete", label: "Delete", destructive: true },
];

function ContentActionsDropdown({
  contentId,
  onAction,
}: {
  contentId: string;
  onAction?: (actionId: string, contentId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="rounded p-1.5 transition-colors hover:bg-white/5"
        style={{ color: "#A3A3A3" }}
        aria-label="More actions"
        aria-expanded={isOpen}
      >
        <MoreDotsIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-[#444] bg-[#232323] py-1 shadow-lg">
          {ROW_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                onAction?.(action.id, contentId);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] ${
                action.destructive ? "text-red-400 hover:bg-red-500/10" : "text-white"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContentLibraryContent() {
  const [activeTab, setActiveTab] = useState<ContentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [content] = useState<ContentItem[]>(() => sampleContentItems);

  const filtered = content.filter((item) => {
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.author.toLowerCase().includes(search.toLowerCase().trim());
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const matchesCategory =
      categoryFilter === "All Categories" || item.category === categoryFilter;
    return matchesTab && matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      {/* Tabs */}
      <div className="flex w-fit gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#444] bg-[#232323] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <FilterDropdown
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterDropdown
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-lg border border-[#444] bg-[#232323] p-2.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Filter"
          >
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#444]">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#444]">
              <th className="px-5 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Content
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Type
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Author
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Category
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                View
              </th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                Created
              </th>
              <th className="w-10 px-4 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const TypeIcon = item.typeIcon;
              return (
                <tr
                  key={item.id}
                  className="border-b border-[#444] last:border-b-0 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <HexIconOutlined size="sm">
                        <TypeIcon />
                      </HexIconOutlined>
                      <span className="font-medium text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{item.type}</td>
                  <td className="px-4 py-3.5 text-gray-400">{item.author}</td>
                  <td
                    className="px-4 py-3.5"
                    style={{ color: statusColorMap[item.status] }}
                  >
                    {item.status}
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{item.category}</td>
                  <td className="px-4 py-3.5 text-gray-400">{item.viewCount}</td>
                  <td className="px-4 py-3.5 text-gray-400">{item.created}</td>
                  <td className="px-4 py-3.5">
                    <ContentActionsDropdown contentId={item.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          No content matches your filters.
        </p>
      )}
    </div>
  );
}
