"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { DownloadIcon, PlusIcon } from "@/components/ui/icons";

export function UsersPageHeader() {
  return (
    <DashboardHeader
      title="Users Management"
      subtitle="Manage all platform users, roles, and permissions."
      actions={
        <>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            <DownloadIcon />
            Export
          </button>
          <Link
            href="/admin/users/add"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: "#C9A96E", color: "#000" }}
          >
            <PlusIcon />
            Add user
          </Link>
        </>
      }
    />
  );
}
