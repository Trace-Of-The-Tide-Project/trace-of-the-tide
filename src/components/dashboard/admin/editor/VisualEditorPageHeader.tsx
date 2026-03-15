"use client";

import { theme } from "@/lib/theme";
import { EyeIcon, FileTextIcon } from "@/components/ui/icons";
import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";

export function VisualEditorPageHeader() {
  return (
    <DashboardHeader
      title="CMS / Visual Editor"
      subtitle="Edit platform UI, homepage sections, and static pages."
      actions={
        <>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-[#444] bg-[#232323] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            <EyeIcon className="[&>svg]:h-4 [&>svg]:w-4" />
            Preview
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: theme.accentGoldFocus, color: theme.bgDark }}
          >
            <FileTextIcon className="[&>svg]:h-4 [&>svg]:w-4" />
            Publish changes
          </button>
        </>
      }
    />
  );
}
