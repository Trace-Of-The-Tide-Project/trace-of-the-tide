"use client";

import { useMemo, useState } from "react";

const ANALYTICS_TABS = ["Overview", "Content Performance", "Top Creators", "Conversion Funnel"] as const;
type AnalyticsTab = (typeof ANALYTICS_TABS)[number];

type TopCategoryRow = {
  id: string;
  name: string;
  views: number;
  trendPct: number; // positive or negative
};

type CreatorRow = {
  id: string;
  rank: number;
  name: string;
  followers: number;
  content: number;
  earnings: number;
};

type FunnelStep = {
  id: string;
  label: string;
  value: number;
  conversionPct?: number;
};

const TOP_CATEGORIES: TopCategoryRow[] = [
  { id: "c1", name: "Documentary", views: 125_400, trendPct: 12 },
  { id: "c2", name: "Music", views: 98_200, trendPct: 8 },
  { id: "c3", name: "Photography", views: 76_500, trendPct: -2 },
  { id: "c4", name: "Essay", views: 54_300, trendPct: 15 },
  { id: "c5", name: "Experimental", views: 32_100, trendPct: 22 },
];

const TOP_CREATORS: CreatorRow[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `u${i + 1}`,
  rank: 1,
  name: "Fadi Barghouti",
  followers: 12_400,
  content: 127,
  earnings: 8_920,
}));

const FUNNEL_STEPS: FunnelStep[] = [
  { id: "f1", label: "Visitors", value: 45_000 },
  { id: "f2", label: "Registered Users", value: 12_500, conversionPct: 27.8 },
  { id: "f3", label: "Contributors", value: 1_543, conversionPct: 12.3 },
  { id: "f4", label: "Authors", value: 589, conversionPct: 38.2 },
  { id: "f5", label: "Editors", value: 156, conversionPct: 26.5 },
];

function formatViews(n: number) {
  return n.toLocaleString("en-US");
}

function formatInt(n: number) {
  return n.toLocaleString("en-US");
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");

  const maxViews = useMemo(() => Math.max(...TOP_CATEGORIES.map((r) => r.views)), []);

  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
        <div className="flex w-fit gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
          {ANALYTICS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${
                tab === activeTab
                  ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6">
              <h3 className="text-lg font-semibold text-white">Platform Growth</h3>
              <p className="mt-1 text-sm text-gray-500">User registrations over time</p>
              <div className="mt-6 flex h-[280px] items-end rounded-2xl border border-[#2f2f2f] bg-[#0f0f0f] p-6 text-sm text-gray-500">
                Chart
              </div>
            </div>

            <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6">
              <h3 className="text-lg font-semibold text-white">Engagement Trends</h3>
              <p className="mt-1 text-sm text-gray-500">Daily active users and interactions</p>
              <div className="mt-6 flex h-[280px] items-end rounded-2xl border border-[#2f2f2f] bg-[#0f0f0f] p-6 text-sm text-gray-500">
                Chart
              </div>
            </div>
          </div>
        )}

        {activeTab === "Content Performance" && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-white">Top Categories</h2>
            <p className="mt-1 text-sm text-gray-500">Most viewed content categories</p>

            <div className="mt-7 space-y-6">
              {TOP_CATEGORIES.map((row, idx) => {
                const pct = Math.max(0.06, row.views / maxViews);
                const trendUp = row.trendPct >= 0;
                return (
                  <div key={row.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-4">
                    <div className="text-xl font-semibold text-gray-500">{idx + 1}</div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-6">
                        <p className="truncate text-base font-semibold text-white">{row.name}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-400">{formatViews(row.views)} views</p>
                          <p
                            className={`flex items-center gap-1 text-xs font-semibold ${
                              trendUp ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            <span aria-hidden="true">{trendUp ? "↗" : "↘"}</span>
                            {Math.abs(row.trendPct)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#222]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct * 100}%`,
                            background: "linear-gradient(to right, rgba(203,161,88,0.35), #CBA158)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Top Creators" && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-white">Top Creators</h2>
            <p className="mt-1 text-sm text-gray-500">
              Highest performing creators on the platform
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#2f2f2f]">
              <div className="grid grid-cols-[1.6fr_0.7fr_0.6fr_0.7fr] items-center bg-[#121212] px-6 py-4 text-sm border-b border-[#2f2f2f]">
                <div className="text-sm text-[#CBA158]">Creator</div>
                <div className="text-sm text-[#CBA158] text-center">Followers</div>
                <div className="text-sm text-[#CBA158] text-center">Content</div>
                <div className="text-sm text-[#CBA158] text-right">Earnings</div>
              </div>

              <div className="divide-y divide-[#2f2f2f]">
                {TOP_CREATORS.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1.6fr_0.7fr_0.6fr_0.7fr] items-center px-6 py-5"
                  >
                    <div className="text-sm font-medium text-white">
                      {row.rank}-{row.name}
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      {formatInt(row.followers)}
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      {formatInt(row.content)}
                    </div>
                    <div className="text-sm text-gray-400 text-right">
                      {formatCurrency(row.earnings)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Conversion Funnel" && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-white">Conversion Funnel</h2>
            <p className="mt-1 text-sm text-gray-500">User journey from visitor to editor</p>

            <div className="mt-8 space-y-7">
              {FUNNEL_STEPS.map((step) => {
                const pct = Math.max(0.02, step.value / FUNNEL_STEPS[0].value);
                return (
                  <div key={step.id}>
                    <div className="flex items-center justify-between gap-6">
                      <p className="text-base font-semibold text-white">{step.label}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-400">{formatInt(step.value)}</p>
                        {typeof step.conversionPct === "number" && (
                          <p className="text-sm font-semibold text-emerald-400">
                            {step.conversionPct}% conversion
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#222]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct * 100}%`,
                          background: "linear-gradient(to right, rgba(203,161,88,0.35), #CBA158)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab !== "Overview" &&
          activeTab !== "Content Performance" &&
          activeTab !== "Top Creators" &&
          activeTab !== "Conversion Funnel" && (
            <div className="mt-6 rounded-2xl border border-[#2f2f2f] bg-[#0f0f0f] p-10 text-center text-gray-500">
              {activeTab} coming soon.
            </div>
          )}
      </div>
    </div>
  );
}
