"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { AdminTopbar } from "@/components/dashboard/admin/AdminTopbar";
import { AdminCommandCenter } from "@/components/dashboard/admin/AdminCommandCenter";
import { ArticlesPageHeader } from "@/components/dashboard/admin/articles/articles-main";
import { UsersPageHeader } from "@/components/dashboard/admin/users/UsersPageHeader";
import { RolesPageHeader } from "@/components/dashboard/admin/roles/RolesPageHeader";
import { ContentLibraryPageHeader } from "@/components/dashboard/admin/content/ContentLibraryPageHeader";
import { VisualEditorPageHeader } from "@/components/dashboard/admin/editor/VisualEditorPageHeader";
import { EngagementsPageHeader } from "@/components/dashboard/admin/engagements/EngagementsPageHeader";
import { MessagingPageHeader } from "@/components/dashboard/admin/messaging/MessagingPageHeader";
import { FinancePageHeader } from "@/components/dashboard/admin/finance/FinancePageHeader";
import { AnalyticsPageHeader } from "@/components/dashboard/admin/analytics/AnalyticsPageHeader";
import { ReportsPageHeader } from "@/components/dashboard/admin/reports/ReportsPageHeader";
import { SecurityPageToolbar } from "@/components/dashboard/admin/security/SecurityPageToolbar";
import { AdminSettingsPageHeader } from "@/components/dashboard/admin/settings/AdminSettingsPageHeader";
import { adminConfig } from "@/lib/dashboard/admin-config";
import { shouldShowAdminSettingsHeader } from "@/lib/dashboard/admin-settings-header-paths";

function getCommandCenter(pathname: string | null) {
  if (!pathname) return null;
  if (pathname === "/admin") return <AdminCommandCenter />;
  if (shouldShowAdminSettingsHeader(pathname)) {
    if (pathname.startsWith("/admin/security")) {
      return (
        <Fragment>
          <AdminSettingsPageHeader />
          <SecurityPageToolbar />
        </Fragment>
      );
    }
    return <AdminSettingsPageHeader />;
  }
  if (pathname.startsWith("/admin/users")) return <UsersPageHeader />;
  if (pathname.startsWith("/admin/roles")) return <RolesPageHeader />;
  if (pathname.startsWith("/admin/content")) return <ContentLibraryPageHeader />;
  if (pathname.startsWith("/admin/editor")) return <VisualEditorPageHeader />;
  if (pathname.startsWith("/admin/engagements")) return <EngagementsPageHeader />;
  if (pathname.startsWith("/admin/messaging")) return <MessagingPageHeader />;
  if (pathname.startsWith("/admin/finance")) return <FinancePageHeader />;
  if (pathname.startsWith("/admin/analytics")) return <AnalyticsPageHeader />;
  if (pathname.startsWith("/admin/reports")) return <ReportsPageHeader />;
  if (
    pathname.startsWith("/admin/articles") ||
    pathname.startsWith("/admin/trips") ||
    pathname.startsWith("/admin/supporters") ||
    pathname.startsWith("/admin/contributions-analytics")
  )
    return <ArticlesPageHeader />;
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const commandCenter = getCommandCenter(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-background"
        aria-busy="true"
        aria-label="Loading admin"
      />
    );
  }

  const mobileBarTitle = shouldShowAdminSettingsHeader(pathname) ? "Admin Settings" : "Dashboard";

  return (
    <DashboardLayout
      config={adminConfig}
      header={<AdminTopbar />}
      commandCenter={commandCenter}
      mobileBarTitle={mobileBarTitle}
    >
      {children}
    </DashboardLayout>
  );
}
