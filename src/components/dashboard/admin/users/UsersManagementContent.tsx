"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { SearchIcon } from "@/components/ui/icons";
import { FilterDropdown } from "./FilterDropdown";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { theme } from "@/lib/theme";
import {
  formatContributionsCount,
  formatUserJoinedDate,
  formatUserLastActiveRelative,
  formatUserRoleLabel,
  formatUserStatusLabel,
} from "@/lib/dashboard/user-table-formatters";
import { USER_STATUS_COLORS } from "@/lib/dashboard/users-management-constants";
import { USERS_CSV_EXPORT_EVENT } from "@/lib/dashboard/users-export-events";
import { downloadUsersCsv } from "@/lib/export/users-csv";
import {
  getAllUsersForExport,
  getUsers,
  type AdminUserListItem,
  type UsersListMeta,
} from "@/services/users.service";

const PAGE_LIMIT = 10;

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
] as const;

const SORT_OPTIONS = [
  { value: "username", label: "Username" },
  { value: "email", label: "Email" },
  { value: "full_name", label: "Full name" },
] as const;

const ORDER_OPTIONS = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
] as const;

function displayName(u: AdminUserListItem): string {
  const n = u.full_name?.trim();
  if (n) return n;
  return u.username?.trim() || "—";
}

function initialsFromUser(u: AdminUserListItem): string {
  const source = u.full_name?.trim() || u.username?.trim() || u.email || "";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "?";
}

function statusColor(status: string): string {
  const key = status.trim().toLowerCase();
  return USER_STATUS_COLORS[key] ?? "#9CA3AF";
}

function listErrMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
    }
    return e.message || "Failed to load users";
  }
  if (e instanceof Error) return e.message;
  return "Failed to load users";
}

const emptyMeta: UsersListMeta = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 };

export function UsersManagementContent() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("username");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [meta, setMeta] = useState<UsersListMeta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportBusyRef = useRef(false);
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
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as "active" | "suspended" | "inactive" | "pending"),
        sortBy,
        order,
      });
      setUsers(res.users);
      setMeta(res.meta);
    } catch (e) {
      setError(listErrMessage(e));
      setUsers([]);
      setMeta(emptyMeta);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sortBy, order]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, meta.totalPages);
  useEffect(() => {
    if (meta.total > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [meta.total, page, totalPages]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };
  const handleOrderChange = (value: string) => {
    setOrder(value === "DESC" ? "DESC" : "ASC");
    setPage(1);
  };

  const runExport = useCallback(async () => {
    if (exportBusyRef.current) return;
    exportBusyRef.current = true;
    setExportError(null);
    try {
      const list = await getAllUsersForExport({
        search: debouncedSearch || undefined,
        status:
          statusFilter === "all"
            ? undefined
            : (statusFilter as "active" | "suspended" | "inactive" | "pending"),
        sortBy,
        order,
      });
      downloadUsersCsv(list, "trace-users");
    } catch (e) {
      setExportError(listErrMessage(e));
    } finally {
      exportBusyRef.current = false;
    }
  }, [debouncedSearch, statusFilter, sortBy, order]);

  useEffect(() => {
    const onExportRequest = () => {
      void runExport();
    };
    window.addEventListener(USERS_CSV_EXPORT_EVENT, onExportRequest);
    return () => window.removeEventListener(USERS_CSV_EXPORT_EVENT, onExportRequest);
  }, [runExport]);

  const effectivePage = Math.min(page, totalPages);
  const startItem = users.length === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = users.length === 0 ? 0 : (meta.page - 1) * meta.limit + users.length;

  return (
    <div className="mx-auto max-w-full space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search username, full name, email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-[#444] bg-[#232323] py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none sm:pr-4"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-2 lg:flex-nowrap lg:items-center">
          <FilterDropdown
            options={[...STATUS_OPTIONS]}
            value={statusFilter}
            onChange={handleStatusChange}
          />
          <FilterDropdown options={[...SORT_OPTIONS]} value={sortBy} onChange={handleSortChange} />
          <FilterDropdown options={[...ORDER_OPTIONS]} value={order} onChange={handleOrderChange} />
        </div>
      </div>

      {exportError ? (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-3 text-sm text-red-200 sm:px-4">
          <p className="wrap-break-word">{exportError}</p>
          <button
            type="button"
            onClick={() => void runExport()}
            className="mt-2 text-xs font-medium text-amber-400 underline hover:text-amber-300"
          >
            Try export again
          </button>
        </div>
      ) : null}

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

      <div className="-mx-1 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-[#444444] [touch-action:pan-x] sm:mx-0">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#444444]">
              <th
                className="bg-transparent px-3 py-2.5 text-xs font-semibold sm:px-5 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Contributor
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Role
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Status
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold whitespace-nowrap sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Joined
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-xs font-semibold whitespace-nowrap sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Last active
              </th>
              <th
                className="bg-transparent px-2 py-2.5 text-center text-xs font-semibold sm:px-4 sm:py-3"
                style={{ color: theme.accentGoldFocus }}
              >
                Contributions
              </th>
              <th className="w-10 px-1 py-2.5 sm:px-4 sm:py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                  Loading users…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              users.map((user) => <UserRow key={user.id} user={user} nowMs={nowMs} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-center text-sm text-gray-500 sm:text-left">
          Showing {meta.total === 0 ? 0 : startItem} to {endItem} of {meta.total} users
        </p>
        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || effectivePage <= 1 || meta.total === 0}
            className="min-h-[44px] rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a2a2a] sm:min-h-0"
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
            className="min-h-[44px] rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a2a2a] sm:min-h-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, nowMs }: { user: AdminUserListItem; nowMs: number }) {
  const color = statusColor(user.status);
  return (
    <tr className="border-b border-[#444444] last:border-b-0 transition-colors hover:bg-white/5">
      <td className="px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold sm:h-9 sm:w-9 sm:text-xs"
            style={{ backgroundColor: "#DBC99E", color: theme.bgDark }}
          >
            {initialsFromUser(user)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium sm:text-base" style={{ color: "#DBC99E" }}>
              {displayName(user)}
            </p>
            <p
              className="mt-0.5 max-w-[140px] truncate text-[11px] text-gray-500 sm:max-w-[220px] sm:text-xs md:max-w-[260px]"
              title={user.email}
            >
              {user.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-2 py-2.5 sm:px-4 sm:py-3">
        <span className="inline-flex max-w-full rounded-full bg-[#3a3a3a] px-2 py-0.5 text-[10px] font-medium text-white sm:px-2.5 sm:py-1 sm:text-xs">
          <span className="truncate">{formatUserRoleLabel(user.role)}</span>
        </span>
      </td>
      <td className="px-2 py-2.5 sm:px-4 sm:py-3">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <span className="truncate text-xs sm:text-sm" style={{ color }}>
            {formatUserStatusLabel(user.status)}
          </span>
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-2.5 text-xs text-gray-400 sm:px-4 sm:py-3 sm:text-sm">
        {formatUserJoinedDate(user.joined_at)}
      </td>
      <td className="whitespace-nowrap px-2 py-2.5 text-xs text-gray-400 sm:px-4 sm:py-3 sm:text-sm">
        {formatUserLastActiveRelative(user.last_active_at, nowMs)}
      </td>
      <td className="px-2 py-2.5 text-center text-xs tabular-nums text-gray-300 sm:px-4 sm:py-3 sm:text-sm">
        {formatContributionsCount(user.contributions_count)}
      </td>
      <td className="px-1 py-2.5 sm:px-4 sm:py-3">
        <UserActionsDropdown userId={user.id} />
      </td>
    </tr>
  );
}
