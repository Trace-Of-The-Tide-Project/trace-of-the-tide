"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { theme } from "@/lib/theme";
import {
  SearchIcon,
  FilterIcon,
  MoreDotsIcon,
  EyeIcon,
  MusicIcon,
  FilmIcon,
  CameraIcon,
  BookIcon,
  FileTextIcon,
  MicIcon,
} from "@/components/ui/icons";
import { FilterDropdown } from "@/components/dashboard/admin/users/FilterDropdown";
import { HexIconOutlined } from "@/components/dashboard/admin/articles/articles-create/HexIconOutlined";
import {
  getContributions,
  type ContributionListItem,
  type ContributionListMeta,
} from "@/services/contributions.service";

const ROWS_PER_PAGE = 10;

function errMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
    }
    return e.message || "Request failed";
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}

type ContributionStatus = "all" | "pending" | "published" | "archived" | "rejected";

const TABS: { id: ContributionStatus; label: string }[] = [
  { id: "all", label: "All Content" },
  { id: "published", label: "Published" },
  { id: "pending", label: "Pending" },
  { id: "archived", label: "Archived" },
  { id: "rejected", label: "Rejected" },
];

const statusColorMap: Record<string, string> = {
  published: "#2ECC71",
  pending: "#E67E22",
  archived: "#9CA3AF",
  rejected: "#ef4444",
  draft: "#3498DB",
};

function statusColor(status: string): string {
  return statusColorMap[status.toLowerCase()] ?? "#9CA3AF";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ROW_ACTIONS = [
  { id: "view", label: "View" },
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

function TypeIconInline({ typeName }: { typeName: string | null | undefined }) {
  const n = (typeName ?? "").toLowerCase();
  if (n.includes("music") || n.includes("audio")) return <MusicIcon />;
  if (n.includes("film") || n.includes("video")) return <FilmIcon />;
  if (n.includes("photo") || n.includes("image")) return <CameraIcon />;
  if (n.includes("story") || n.includes("personal")) return <BookIcon />;
  if (n.includes("podcast") || n.includes("oral")) return <MicIcon />;
  return <FileTextIcon />;
}

function ContributionDetailModal({
  item,
  onClose,
}: {
  item: ContributionListItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className="relative mx-2 flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-[#333] bg-[#0a0a0a] shadow-2xl sm:mx-4 sm:max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#333] px-6 py-5">
          <div className="flex items-center gap-3">
            <HexIconOutlined size="sm">
              <TypeIconInline typeName={item.type?.name} />
            </HexIconOutlined>
            <div>
              <h2 className="text-base font-bold text-white">{item.title}</h2>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                {item.type?.name && <span>{item.type.name}</span>}
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                  style={{
                    backgroundColor: `${statusColor(item.status)}20`,
                    color: statusColor(item.status),
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Description */}
          {item.description && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase text-gray-500">Description</h3>
              <p className="text-sm leading-relaxed text-gray-300">{item.description}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard label="Contributor" value={item.user?.full_name ?? item.contributor_name ?? "—"} />
            <InfoCard label="Email" value={item.user?.email ?? item.contributor_email ?? "—"} />
            <InfoCard label="Phone" value={item.phone_number ?? item.contributor_phone ?? "—"} />
            <InfoCard label="Submitted" value={formatDate(item.submission_date)} />
            <InfoCard label="Consent" value={item.consent_given ? "Yes" : "No"} />
            {item.open_call_id && <InfoCard label="Open Call" value={item.open_call_id.slice(0, 8) + "…"} />}
          </div>

          {/* Files */}
          {item.files.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Files ({item.files.length})
              </h3>
              <div className="space-y-2">
                {item.files.map((f) => {
                  const isImage = f.mime_type.startsWith("image/");
                  const isAudio = f.mime_type.startsWith("audio/");
                  const isVideo = f.mime_type.startsWith("video/");
                  const fileUrl = f.path.startsWith("http")
                    ? f.path
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://backend-phd7.onrender.com"}/${f.path}`;

                  return (
                    <div
                      key={f.id}
                      className="overflow-hidden rounded-lg border border-[#333] bg-[#111]"
                    >
                      {isImage && (
                        <div className="relative w-full bg-black/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fileUrl}
                            alt={f.file_name}
                            className="max-h-64 w-full object-contain"
                          />
                        </div>
                      )}
                      {isAudio && (
                        <div className="px-4 pt-3">
                          <audio controls className="w-full" preload="metadata">
                            <source src={fileUrl} type={f.mime_type} />
                          </audio>
                        </div>
                      )}
                      {isVideo && (
                        <div className="relative w-full bg-black/30">
                          <video
                            controls
                            className="max-h-64 w-full"
                            preload="metadata"
                          >
                            <source src={fileUrl} type={f.mime_type} />
                          </video>
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{f.file_name}</p>
                          <p className="text-[11px] text-gray-500">
                            {f.mime_type} &middot; {formatFileSize(f.file_size)}
                            {f.duration ? ` \u00b7 ${f.duration}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collections */}
          {item.collections.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Collections ({item.collections.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.collections.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full border border-[#333] bg-[#1a1a1a] px-3 py-1 text-xs text-gray-300"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-[#333] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#333] bg-[#333333] px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#222] bg-[#111] px-3 py-2">
      <span className="text-[10px] font-medium uppercase text-gray-500">{label}</span>
      <p className="mt-0.5 truncate text-sm text-white">{value}</p>
    </div>
  );
}

export function ContentLibraryContent() {
  const [activeTab, setActiveTab] = useState<ContributionStatus>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [items, setItems] = useState<ContributionListItem[]>([]);
  const [meta, setMeta] = useState<ContributionListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<ContributionListItem | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const fetchData = useCallback(async (p: number, force = false) => {
    if (!force && loadedPagesRef.current.has(p)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getContributions(p, ROWS_PER_PAGE);
      setItems(res.items);
      setMeta(res.meta);
      loadedPagesRef.current.add(p);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(page);
  }, [page, fetchData]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    items.forEach((i) => {
      if (i.type?.name) types.add(i.type.name);
    });
    return [
      { value: "All Types", label: "All Types" },
      ...Array.from(types)
        .sort()
        .map((t) => ({ value: t, label: t })),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === "all" || item.status.toLowerCase() === activeTab;
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (item.user?.full_name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType =
        typeFilter === "All Types" || item.type?.name === typeFilter;
      return matchesTab && matchesSearch && matchesType;
    });
  }, [items, activeTab, search, typeFilter]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      {previewItem && (
        <ContributionDetailModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}

      {/* Tabs */}
      <div className="flex flex-col gap-1 rounded-lg border border-[#444] bg-[#232323] p-1 sm:w-fit sm:flex-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-all sm:px-6 sm:py-3 ${
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
        <div className="relative max-w-md flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search contributions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#444] bg-[#232323] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <FilterDropdown
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
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

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void fetchData(page, true)}
            className="mt-2 text-xs font-medium text-amber-400 underline hover:text-amber-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="rounded-xl border border-[#444] px-5 py-16 text-center text-sm text-gray-500">
          Loading contributions…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#444] px-5 py-16 text-center text-sm text-gray-500">
          {search.trim() || activeTab !== "all"
            ? "No contributions match your filters."
            : "No contributions yet."}
        </div>
      ) : (
        <>
          {/* Card layout — small screens */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#444] bg-[#111] p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{item.title}</p>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="rounded p-1.5 text-gray-500 transition-colors hover:text-white"
                      aria-label={`View ${item.title}`}
                    >
                      <EyeIcon />
                    </button>
                    <ContentActionsDropdown contentId={item.id} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  {item.type?.name && <span>{item.type.name}</span>}
                  <span>{item.user?.full_name ?? item.contributor_name ?? "—"}</span>
                  <span
                    className="font-medium"
                    style={{ color: statusColor(item.status) }}
                  >
                    {capitalize(item.status)}
                  </span>
                  {item.files.length > 0 && (
                    <span>{item.files.length} file{item.files.length > 1 ? "s" : ""}</span>
                  )}
                  <span>{formatDate(item.submission_date)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table layout — large screens */}
          <div className="hidden overflow-hidden rounded-xl border border-[#444] lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#444]">
                  <th className="px-3 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                    Title
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                    Type
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                    Contributor
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                    Status
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold xl:table-cell" style={{ color: theme.accentGoldFocus }}>
                    Files
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold xl:table-cell" style={{ color: theme.accentGoldFocus }}>
                    Collection
                  </th>
                  <th className="whitespace-nowrap px-2 py-3 text-xs font-semibold" style={{ color: theme.accentGoldFocus }}>
                    Submitted
                  </th>
                  <th className="w-16 px-2 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#444] transition-colors last:border-b-0"
                  >
                    <td className="px-3 py-3">
                      <span className="block truncate font-medium text-white">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="block truncate text-xs text-gray-500">
                          {item.description}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-gray-400">
                      {item.type?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-gray-400">
                      {item.user?.full_name ?? item.contributor_name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <span
                        className="text-xs font-medium"
                        style={{ color: statusColor(item.status) }}
                      >
                        {capitalize(item.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-gray-400 xl:table-cell">
                      {item.files.length > 0
                        ? `${item.files.length} file${item.files.length > 1 ? "s" : ""}`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-gray-400 xl:table-cell">
                      {item.collections.length > 0
                        ? item.collections.map((c) => c.name).join(", ")
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-gray-400">
                      {formatDate(item.submission_date)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="rounded p-1.5 text-gray-500 transition-colors hover:text-white"
                          aria-label={`View ${item.title}`}
                        >
                          <EyeIcon />
                        </button>
                        <ContentActionsDropdown contentId={item.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
          <span className="text-gray-500">
            Page {page} of {totalPages} &middot; {meta.total} contribution{meta.total !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-gray-400 transition-colors hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2 text-gray-400 transition-colors hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
