"use client";

import { useState } from "react";
import { FilterIcon, SearchIcon } from "@/components/ui/icons";
import { FilterDropdown } from "./FilterDropdown";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { theme } from "@/lib/theme";
import {
  sampleUsers,
  type UserEntry,
  type UserStatus,
} from "@/lib/dashboard/users-management-constants";

const statusColors: Record<UserStatus, string> = {
  Active: "#2ECC71",
  Pending: "#E67E22",
  Inactive: "#9CA3AF",
  Suspended: "#E74C3C",
};

const PAGE_SIZE = 6;

const ROLE_OPTIONS = [
  { value: "all", label: "All Rules" },
  { value: "User", label: "User" },
  { value: "Contributor", label: "Contributor" },
  { value: "Author", label: "Author" },
  { value: "Editor", label: "Editor" },
  { value: "Admin", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Suspended", label: "Suspended" },
  { value: "Inactive", label: "Inactive" },
];

export function UsersManagementContent() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch =
      !search.trim() ||
      user.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      user.email.toLowerCase().includes(search.toLowerCase().trim());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (effectivePage - 1) * PAGE_SIZE,
    effectivePage * PAGE_SIZE
  );
  const startItem = totalFiltered === 0 ? 0 : (effectivePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(effectivePage * PAGE_SIZE, totalFiltered);

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-[#444] bg-[#232323] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <FilterDropdown options={ROLE_OPTIONS} value={roleFilter} onChange={handleRoleChange} />
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={handleStatusChange}
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
      <div className="overflow-x-auto rounded-lg border border-[#444444]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#444444]">
              <th
                className="bg-transparent px-5 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Contributor
              </th>
              <th
                className="bg-transparent px-4 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Role
              </th>
              <th
                className="bg-transparent px-4 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Status
              </th>
              <th
                className="bg-transparent px-4 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Joined
              </th>
              <th
                className="bg-transparent px-4 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Last Active
              </th>
              <th
                className="bg-transparent px-4 py-3 text-xs font-semibold"
                style={{ color: theme.accentGoldFocus }}
              >
                Contributions
              </th>
              <th className="w-10 px-4 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing {totalFiltered === 0 ? 0 : startItem} to {endItem} of {totalFiltered} users
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={effectivePage <= 1 || totalFiltered === 0}
            className="rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a2a2a]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={effectivePage >= totalPages || totalFiltered === 0}
            className="rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2a2a2a]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user }: { user: UserEntry }) {
  return (
    <tr className="border-b border-[#444444] last:border-b-0 transition-colors hover:bg-white/5">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: theme.accentGoldFocus, color: theme.bgDark }}
          >
            {user.initials}
          </span>
          <div>
            <p className="font-medium" style={{ color: "#DBC99E" }}>
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex rounded-full border border-[#444] bg-[#2a2a2a] px-3 py-0.5 text-xs font-medium text-gray-300">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: statusColors[user.status] }}
          />
          <span style={{ color: statusColors[user.status] }}>{user.status}</span>
        </span>
      </td>
      <td className="px-4 py-3 text-gray-400">{user.joined}</td>
      <td className="px-4 py-3 text-gray-400">{user.lastActive}</td>
      <td className="px-4 py-3 font-medium text-gray-300">{user.contributions}</td>
      <td className="px-4 py-3">
        <UserActionsDropdown userId={user.id} />
      </td>
    </tr>
  );
}
