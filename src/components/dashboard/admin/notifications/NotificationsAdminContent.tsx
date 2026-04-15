"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { SearchIcon } from "@/components/ui/icons";
import { FilterDropdown } from "@/components/dashboard/admin/users/FilterDropdown";
import { theme } from "@/lib/theme";
import { formatUserLastActiveRelative } from "@/lib/dashboard/user-table-formatters";
import { useStoredAuthUser } from "@/hooks/useStoredAuthUser";
import {
  filterNotificationsForUser,
  getNotifications,
  type NotificationListItem,
  type NotificationsListMeta,
} from "@/services/notifications.service";

const PAGE_LIMIT = 20;

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "system", label: "System" },
  { value: "review", label: "Review" },
  { value: "update", label: "Update" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
] as const;

const ORDER_OPTIONS = [
  { value: "DESC", label: "Newest first" },
  { value: "ASC", label: "Oldest first" },
] as const;

function listErrMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
    }
    return e.message || "Failed to load notifications";
  }
  if (e instanceof Error) return e.message;
  return "Failed to load notifications";
}

const emptyMeta: NotificationsListMeta = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 };

export function NotificationsAdminContent() {
  const user = useStoredAuthUser();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy] = useState("created_at");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<NotificationListItem[]>([]);
  const [meta, setMeta] = useState<NotificationsListMeta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const prevDebouncedRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedRef.current !== debouncedSearch) {
      prevDebouncedRef.current = debouncedSearch;
      setPage(1);
    }
  }, [debouncedSearch]);

  const load = useCallback(async () => {
    if (!user?.id) {
      setRows([]);
      setMeta(emptyMeta);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
        type: typeFilter === "all" ? undefined : typeFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        sortBy,
        order,
      });
      const mine = filterNotificationsForUser(res.notifications, user.id);
      setRows(mine);
      setMeta(res.meta);
    } catch (e) {
      setError(listErrMessage(e));
      setRows([]);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page, debouncedSearch, typeFilter, statusFilter, sortBy, order]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, meta.totalPages);
  useEffect(() => {
    if (meta.total > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [meta.total, page, totalPages]);

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };
  const handleOrderChange = (value: string) => {
    setOrder(value === "ASC" ? "ASC" : "DESC");
    setPage(1);
  };

  const effectivePage = Math.min(page, totalPages);
  const startItem = rows.length === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = rows.length === 0 ? 0 : (meta.page - 1) * meta.limit + rows.length;

  if (!user?.id) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-500 sm:px-6 md:px-8">
        Sign in to view notifications.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <p className="text-xs text-gray-500">
        Only notifications for your account are shown (matched by user id).
      </p>

      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search message or type…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-gray-500 focus:border-[#555] focus:outline-none sm:pr-4"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-2 lg:items-center">
          <FilterDropdown
            options={[...TYPE_OPTIONS]}
            value={typeFilter}
            onChange={handleTypeChange}
          />
          <FilterDropdown
            options={[...STATUS_OPTIONS]}
            value={statusFilter}
            onChange={handleStatusChange}
          />
          <FilterDropdown options={[...ORDER_OPTIONS]} value={order} onChange={handleOrderChange} />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-3 text-sm text-red-200 sm:px-4">
          <p className="wrap-break-word">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-2 text-xs font-medium text-amber-400 underline hover:text-amber-300"
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="-mx-1 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-[var(--tott-card-border)] [touch-action:pan-x] sm:mx-0">
        <table className="min-w-[640px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--tott-card-border)]">
              <th
                className="bg-transparent px-3 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Message
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Type
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Status
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                User
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold whitespace-nowrap sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                When
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  No notifications match your filters.
                </td>
              </tr>
            ) : (
              rows.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-[var(--tott-card-border)] last:border-b-0 transition-colors hover:bg-[var(--tott-dash-ghost-hover)]"
                >
                  <td className="max-w-[280px] px-3 py-2.5 text-foreground sm:max-w-md sm:px-4 sm:py-3">
                    <p className="line-clamp-2 text-sm">{n.message}</p>
                  </td>
                  <td className="px-2 py-2.5 capitalize text-gray-400 sm:px-4 sm:py-3">{n.type}</td>
                  <td className="px-2 py-2.5 capitalize text-gray-400 sm:px-4 sm:py-3">{n.status}</td>
                  <td className="px-2 py-2.5 text-gray-400 sm:px-4 sm:py-3">
                    {n.user?.full_name?.trim() || n.user?.username || "—"}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-xs text-gray-500 sm:px-4 sm:py-3 sm:text-sm">
                    {formatUserLastActiveRelative(n.created_at, nowMs)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-center text-sm text-gray-500 sm:text-left">
          Showing {meta.total === 0 ? 0 : startItem} to {endItem} of {meta.total} (your account)
        </p>
        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || effectivePage <= 1 || meta.total === 0}
            className="min-h-[44px] rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2 text-sm font-medium text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--tott-dash-surface-inset)] sm:min-h-0"
          >
            Previous
          </button>
          <span className="min-w-26 shrink-0 text-center text-xs text-gray-500 sm:min-w-0">
            Page {effectivePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={loading || effectivePage >= totalPages || meta.total === 0}
            className="min-h-[44px] rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2 text-sm font-medium text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--tott-dash-surface-inset)] sm:min-h-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
