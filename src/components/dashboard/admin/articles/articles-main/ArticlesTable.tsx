"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusIcon, MoreDotsIcon } from "@/components/ui/icons";

type Tab = { id: string; label: string };

type ArticleRow = {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Scheduled";
  statusColor: string;
  lastUpdated: string;
  views: string;
  supporters: string;
};

type ArticlesTableProps = {
  tabs: readonly Tab[];
  rows: ArticleRow[];
  addNewHref?: string;
};

const statusColorMap: Record<string, string> = {
  emerald: "#2ECC71",
  blue: "#3498DB",
  orange: "#E67E22",
};

const TAB_TO_STATUS: Record<string, ArticleRow["status"] | null> = {
  all: null,
  drafts: "Draft",
  published: "Published",
  scheduled: "Scheduled",
};

export function ArticlesTable({
  tabs,
  rows,
  addNewHref = "/admin/articles/create",
}: ArticlesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultTab = tabs[0]?.id ?? "all";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const fromUrl = searchParams.get("tab");
    if (fromUrl && tabs.some((t) => t.id === fromUrl)) {
      setActiveTab(fromUrl);
    }
  }, [searchParams, tabs]);

  const selectTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(searchParams.toString());
      if (tabId === defaultTab) {
        params.delete("tab");
      } else {
        params.set("tab", tabId);
      }
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [defaultTab, pathname, router, searchParams]
  );

  const filteredRows = useMemo(() => {
    const want = TAB_TO_STATUS[activeTab];
    if (!want) return rows;
    return rows.filter((r) => r.status === want);
  }, [rows, activeTab]);

  return (
    <div>
      {/* Tabs - segment control with gray effect on selected */}
      <div className="mb-4 flex w-full gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`flex-1 rounded-md py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href={addNewHref}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ color: "#C9A96E" }}
        >
          <PlusIcon />
          Add new
        </Link>
      </div>

      {/* Table - borders #444444 at top and bottom */}
      <div className="overflow-x-auto rounded-lg border border-[#444444]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#444444]">
              <th
                className="bg-transparent px-5 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Title
              </th>
              <th
                className="bg-transparent px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Status
              </th>
              <th
                className="bg-transparent  px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Last Updated
              </th>
              <th
                className="bg-transparent px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Views
              </th>
              <th
                className="bg-transparent  px-4 py-2 text-xs font-semibold"
                style={{ color: "#C9A96E" }}
              >
                Supporters
              </th>
              <th className="w-10  px-4 py-2" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No articles in this view.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#444444] last:border-b-0 transition-colors"
                >
                  <td className="px-5 pt-3.5 pb-0 font-medium" style={{ color: "#DBC99E" }}>
                    {row.title}
                  </td>
                  <td
                    className="px-4 pt-3.5 pb-0"
                    style={{ color: statusColorMap[row.statusColor] ?? "#9ca3af" }}
                  >
                    {row.status}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.lastUpdated}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.views}
                  </td>
                  <td className="px-4 pt-3.5 pb-0 font-medium" style={{ color: "#A3A3A3" }}>
                    {row.supporters}
                  </td>
                  <td className="px-4 pt-3.5 pb-0">
                    <button
                      type="button"
                      className="rounded p-1.5 transition-colors hover:bg-white/5"
                      style={{ color: "#A3A3A3" }}
                      aria-label="More actions"
                    >
                      <MoreDotsIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
