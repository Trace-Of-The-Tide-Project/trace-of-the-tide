"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

type TimelineEntry = {
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
};

type TripTimelineProps = {
  entries: TimelineEntry[];
};

function CalendarSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PinSmall() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
    </svg>
  );
}

export function TripTimeline({ entries }: TripTimelineProps) {
  const [tab, setTab] = useState<"timeline" | "map">("timeline");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex overflow-hidden rounded-lg border border-gray-700/50">
        <button
          type="button"
          onClick={() => setTab("timeline")}
          className={`flex-1 cursor-pointer py-3 text-center text-sm font-medium transition-colors ${
            tab === "timeline"
              ? "bg-[#1a1a1a] text-white"
              : "bg-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Trip timeline
        </button>
        <button
          type="button"
          onClick={() => setTab("map")}
          className={`flex-1 cursor-pointer py-3 text-center text-sm font-medium transition-colors ${
            tab === "map"
              ? "bg-[#1a1a1a] text-white"
              : "bg-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Route map
        </button>
      </div>

      {tab === "timeline" && (
        <div className="relative pl-10">
          {/* Vertical dashed line */}
          <div
            className="absolute left-[18px] top-3 bottom-3 w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #555 0px, #555 6px, transparent 6px, transparent 12px)",
            }}
          />

          <div className="space-y-10">
            {entries.map((entry, i) => (
              <div key={i} className="relative">
                {/* Number circle */}
                <div
                  className="absolute -left-10 top-0 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold"
                  style={{
                    borderColor: theme.accentGold,
                    color: theme.accentGold,
                    backgroundColor: "#0d0d0d",
                  }}
                >
                  {i + 1}
                </div>

                {/* Content */}
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <h3 className="text-base font-semibold text-white">
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarSmall />
                        {entry.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockSmall />
                        {entry.time}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {entry.description}
                  </p>

                  {/* Image placeholder */}
                  <div className="mt-4 h-40 rounded-lg bg-[#1a1a1a] sm:h-48" />

                  {entry.location && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                      <PinSmall />
                      {entry.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "map" && (
        <div className="relative overflow-hidden rounded-xl border border-gray-700/30">
          {/* Dark map background */}
          <div
            className="relative h-72 w-full sm:h-80"
            style={{
              backgroundColor: "#2a2a2a",
              backgroundImage: `
                linear-gradient(rgba(60,60,60,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(60,60,60,0.3) 1px, transparent 1px),
                linear-gradient(rgba(60,60,60,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(60,60,60,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 800 320"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              {/* Route path */}
              <path
                d="M600 160 Q560 160 500 190 Q440 220 400 210 Q360 200 320 190 Q280 180 240 170 Q200 160 180 130"
                stroke="#CBA158"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Waypoint 1 */}
              <circle cx="600" cy="160" r="14" fill="#CBA158" />
              <text x="600" y="165" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="600">1</text>

              {/* Waypoint 2 */}
              <circle cx="420" cy="205" r="14" fill="#CBA158" />
              <text x="420" y="210" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="600">2</text>

              {/* Waypoint 3 */}
              <circle cx="280" cy="180" r="14" fill="#CBA158" />
              <text x="280" y="185" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="600">3</text>

              {/* Waypoint 4 */}
              <circle cx="180" cy="130" r="14" fill="#CBA158" />
              <text x="180" y="135" textAnchor="middle" fill="#1a1a1a" fontSize="14" fontWeight="600">4</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
