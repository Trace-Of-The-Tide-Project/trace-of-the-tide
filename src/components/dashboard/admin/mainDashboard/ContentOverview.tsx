import Link from "next/link";
import type { ComponentType } from "react";

type ContentRow = {
  id: string;
  icon: ComponentType;
  category: string;
  published: number;
  drafts: number;
  flagged: number | string;
};

type ContentOverviewProps = {
  rows: ContentRow[];
  totalLabel?: string;
  totalValue?: string;
  manageHref?: string;
};

export function ContentOverview({ rows, totalLabel, totalValue, manageHref }: ContentOverviewProps) {
  return (
    <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Content Overview</h3>
        {manageHref && (
          <Link
            href={manageHref}
            className="rounded-lg border border-[#333] bg-[#333333] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Manage all
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#333]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-5 py-3 text-xs font-medium" style={{ color: "#CBA158" }}>Category</th>
              <th className="px-4 py-3 text-xs font-medium" style={{ color: "#CBA158" }}>Published</th>
              <th className="px-4 py-3 text-xs font-medium" style={{ color: "#CBA158" }}>Drafts</th>
              <th className="px-4 py-3 text-xs font-medium" style={{ color: "#CBA158" }}>Flagged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]/40">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <tr key={row.id} className="text-gray-300">
                  <td className="flex items-center gap-2.5 px-5 py-3.5">
                    <span className="text-gray-500"><Icon /></span>
                    <span className="font-medium text-white">{row.category}</span>
                  </td>
                  <td className="px-4 py-3.5">{row.published.toLocaleString()}</td>
                  <td className="px-4 py-3.5">{row.drafts}</td>
                  <td className="px-4 py-3.5">
                    {row.flagged === "—" || row.flagged === 0 ? (
                      <span className="text-gray-600">—</span>
                    ) : (
                      <span className="font-medium text-red-400">{row.flagged}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalLabel && totalValue && (
        <div className="mt-4 flex items-center justify-between px-1 text-sm text-gray-500">
          <span>{totalLabel}</span>
          <span className="font-medium text-white">{totalValue}</span>
        </div>
      )}
    </div>
  );
}
