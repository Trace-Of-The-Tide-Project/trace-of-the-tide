import Link from "next/link";
import type { ComponentType } from "react";

type FinanceCard = {
  id: string;
  icon: ComponentType;
  amount: string;
  label: string;
  sublabel: string;
  trend?: { value: string; direction: "up" | "down" };
};

type FinanceSnapshotProps = {
  cards: FinanceCard[];
  detailsHref?: string;
};

export function FinanceSnapshot({ cards, detailsHref }: FinanceSnapshotProps) {
  return (
    <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-5 px-9">
      <div className="mb-4 flex items-center gap-10">
        <h3 className="text-lg font-bold text-white">Finance Snapshot</h3>
        {detailsHref && (
          <Link
            href={detailsHref}
            className="rounded-lg border border-[#333] bg-[#333] px-5 py-2 text-l font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            View details
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 mx-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="rounded-xl border border-[#333] bg-[#0a0a0a] px-5 py-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span style={{ color: "#E8DDC0" }}><Icon /></span>
                {card.trend && (
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    card.trend.direction === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {card.trend.direction === "up" ? "↗" : "↘"} {card.trend.value}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-white">{card.amount}</p>
              <p className="mt-1 text-xs text-gray-500">{card.label}</p>
              <p className="text-xs text-gray-600">{card.sublabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
