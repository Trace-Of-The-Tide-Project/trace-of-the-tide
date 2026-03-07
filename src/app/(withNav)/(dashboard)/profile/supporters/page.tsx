"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { SupportersContent } from "@/components/dashboard/profile/SupportersContent";

export default function SupportersPage() {
  return (
    <div>
      <DashboardHeader
        title="Supporters"
        subtitle="View your supporters and their contributions."
      />
      <SupportersContent />
    </div>
  );
}
