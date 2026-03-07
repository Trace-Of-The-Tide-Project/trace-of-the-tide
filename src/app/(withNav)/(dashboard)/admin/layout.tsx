"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { AdminTopbar } from "@/components/dashboard/admin/AdminTopbar";
import { AdminCommandCenter } from "@/components/dashboard/admin/AdminCommandCenter";
import { ArticlesPageHeader } from "@/components/dashboard/admin/articles/articles-main";
import { UsersPageHeader } from "@/components/dashboard/admin/users/UsersPageHeader";
import { RolesPageHeader } from "@/components/dashboard/admin/roles/RolesPageHeader";
import { adminConfig } from "@/lib/dashboard/admin-config";

function getCommandCenter(pathname: string | null) {
  if (!pathname) return null;
  if (pathname === "/admin") return <AdminCommandCenter />;
  if (pathname.startsWith("/admin/users")) return <UsersPageHeader />;
  if (pathname.startsWith("/admin/roles")) return <RolesPageHeader />;
  if (
    pathname.startsWith("/admin/articles") ||
    pathname.startsWith("/admin/supporters") ||
    pathname.startsWith("/admin/contributions-analytics")
  )
    return <ArticlesPageHeader />;
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const commandCenter = getCommandCenter(pathname);

  return (
    <DashboardLayout config={adminConfig} header={<AdminTopbar />} commandCenter={commandCenter}>
      {children}
    </DashboardLayout>
  );
}
