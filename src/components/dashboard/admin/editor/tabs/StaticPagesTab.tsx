"use client";

import { EyeIcon, FileTextIcon, PenLineIcon } from "@/components/ui/icons";
import { HexIconOutlined } from "@/components/dashboard/admin/articles/articles-create/HexIconOutlined";

const STATIC_PAGES = [
  { id: "about", title: "About Us", lastEdited: "Feb 1, 2024" },
  { id: "faq", title: "FAQ", lastEdited: "Feb 1, 2024" },
  { id: "terms", title: "Terms of Service", lastEdited: "Feb 1, 2024" },
  { id: "privacy", title: "Privacy Policy", lastEdited: "Feb 1, 2024" },
  { id: "contact", title: "Contact", lastEdited: "Feb 1, 2024" },
];

export function StaticPagesTab() {
  return (
    <div className="rounded-xl border border-[#444] p-6">
      <div className="space-y-4">
        {STATIC_PAGES.map((page) => (
          <div
            key={page.id}
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#444] px-4 py-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <HexIconOutlined size="sm">
                <FileTextIcon />
              </HexIconOutlined>
              <div>
                <p className="font-medium text-white">{page.title}</p>
                <p className="text-xs text-gray-500">Last edited: {page.lastEdited}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm font-medium text-emerald-500">Published</span>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#444] bg-[#333] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
              >
                <PenLineIcon className="[&>svg]:h-4 [&>svg]:w-4" />
                Edit
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#444] bg-[#333] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
              >
                <EyeIcon className="[&>svg]:h-4 [&>svg]:w-4" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
