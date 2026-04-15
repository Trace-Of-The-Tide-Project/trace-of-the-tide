"use client";

import { Suspense } from "react";
import { NotificationsAdminPage } from "@/components/dashboard/admin/notifications/NotificationsAdminPage";

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <NotificationsAdminPage />
    </Suspense>
  );
}
