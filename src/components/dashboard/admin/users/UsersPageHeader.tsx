"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { DownloadIcon, PlusIcon } from "@/components/ui/icons";
import { requestUsersCsvExport } from "@/lib/dashboard/users-export-events";
import { normalizeAppPathname } from "@/lib/i18n/strip-locale-from-path";

export function UsersPageHeader() {
  const t = useTranslations("Dashboard.headers.users");
  const tAdd = useTranslations("Dashboard.usersManagement.addUserPage");
  const tEdit = useTranslations("Dashboard.usersManagement.editUserPage");
  const tChangeRole = useTranslations("Dashboard.usersManagement.changeRolePage");
  const pathname = usePathname();
  const path = normalizeAppPathname(pathname) || "";
  const isAddUser = path === "/admin/users/add";
  const editUserMatch = path.match(/^\/admin\/users\/([^/]+)\/edit$/);
  const isEditUser = Boolean(editUserMatch);
  const changeRoleMatch = path.match(/^\/admin\/users\/([^/]+)\/role$/);
  const isChangeRole = Boolean(changeRoleMatch);

  if (isChangeRole) {
    return (
      <DashboardHeader
        title={tChangeRole("headerTitle")}
        subtitle={tChangeRole("headerSubtitle")}
        actions={
          <Link
            href="/admin/users"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--tott-dash-surface-inset)] sm:w-auto sm:py-2"
          >
            {tChangeRole("backToList")}
          </Link>
        }
      />
    );
  }

  if (isEditUser) {
    return (
      <DashboardHeader
        title={tEdit("headerTitle")}
        subtitle={tEdit("headerSubtitle")}
        actions={
          <Link
            href="/admin/users"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--tott-dash-surface-inset)] sm:w-auto sm:py-2"
          >
            {tEdit("backToList")}
          </Link>
        }
      />
    );
  }

  if (isAddUser) {
    return (
      <DashboardHeader
        title={tAdd("headerTitle")}
        subtitle={tAdd("headerSubtitle")}
        actions={
          <Link
            href="/admin/users"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--tott-dash-surface-inset)] sm:w-auto sm:py-2"
          >
            {tAdd("backToList")}
          </Link>
        }
      />
    );
  }

  return (
    <DashboardHeader
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => requestUsersCsvExport()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--tott-dash-surface-inset)] sm:w-auto sm:justify-start sm:py-2"
          >
            <DownloadIcon />
            {t("exportCsv")}
          </button>
          <Link
            href="/admin/users/add"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:w-auto sm:py-2"
            style={{ backgroundColor: "#C9A96E", color: "#000" }}
          >
            <PlusIcon />
            {t("addUser")}
          </Link>
        </div>
      }
    />
  );
}
