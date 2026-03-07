"use client";

import { useState } from "react";
import Link from "next/link";
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

export function ArticlesTable({
  tabs,
  rows,
  addNewHref = "/admin/articles/create",
}: ArticlesTableProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "all");

  return (
    <div>
      {/* Tabs - segment control with gray effect on selected */}
      <div className="mb-4 flex w-full gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
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
            {rows.map((row) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
