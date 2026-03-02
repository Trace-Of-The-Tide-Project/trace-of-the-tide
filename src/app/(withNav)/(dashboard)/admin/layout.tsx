"use client";

import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { AdminTopbar } from "@/components/dashboard/admin/AdminTopbar";
import { AdminCommandCenter } from "@/components/dashboard/admin/AdminCommandCenter";
import { adminConfig } from "@/lib/dashboard/admin-config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      config={adminConfig}
      header={
        <>
          <AdminTopbar />
          <AdminCommandCenter />
        </>
      }
    >
      {children}
    </DashboardLayout>
  );
}
