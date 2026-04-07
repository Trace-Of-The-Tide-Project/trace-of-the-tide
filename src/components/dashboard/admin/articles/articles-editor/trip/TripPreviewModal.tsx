"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { XIcon } from "@/components/ui/icons";
import type { EditorStop } from "./ItineraryBuilder";
import type { TripStop, TripListItem } from "@/services/trips.service";

/** Normalised stop shape used only inside this modal. */
type PreviewStop = {
  title: string;
  description: string;
  arrivalTime: string;
  locationName: string;
  latitude: string;
  longitude: string;
};

function editorStopToPreview(s: EditorStop): PreviewStop {
  return {
    title: s.title,
    description: s.description,
    arrivalTime: s.arrivalTime,
    locationName: s.locationName,
    latitude: s.latitude,
    longitude: s.longitude,
  };
}

function tripStopToPreview(s: TripStop): PreviewStop {
  return {
    title: s.title,
    description: s.description,
    arrivalTime: s.arrival_time ?? "",
    locationName: s.location.name,
    latitude: String(s.location.latitude),
    longitude: String(s.location.longitude),
  };
}

type TripPreviewData = {
  title: string;
  description: string;
  moderatorName: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  durationHours: number;
  maxParticipants: number;
  minParticipants: number;
  price: string;
  currency: string;
  languages: string[];
  highlights: string[];
  stops: EditorStop[];
};

type TripPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  data?: TripPreviewData;
  trip?: TripListItem;
};

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((t: unknown) => typeof t === "string" && t.trim()) : [];
  } catch {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

type PreviewTab = "describes" | "visitors" | "completed";

function CalendarSmIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockSmIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinSmIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "---";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso: string): string {
  if (!iso) return "";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  if (diff < 0) {
    const days = Math.ceil(Math.abs(diff) / 86_400_000);
    if (days < 7) return `in ${days} day${days > 1 ? "s" : ""}`;
    const weeks = Math.ceil(days / 7);
    return `in ${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function StatIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333] bg-[#1a1a1a] text-gray-400">
        {icon}
      </div>
      <span className="text-center text-[10px] leading-tight text-gray-500">{label}</span>
    </div>
  );
}

function DaysIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WalkingIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="4" r="2" />
      <path d="m10 22 1.5-6.5L14 17v5" />
      <path d="m18 18-3-3 1-4.5-4 1 0 4" />
      <path d="M6.5 16 9 13" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#CBA158" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StopTimeline({
  stop,
  index,
  isLast,
}: {
  stop: PreviewStop;
  index: number;
  isLast: boolean;
}) {
  const title = stop.title.trim() || stop.locationName.trim() || `Stop ${index + 1}`;
  const hasCoords = stop.latitude && stop.longitude;

  return (
    <div className="relative flex gap-4">
      {/* Timeline line + number */}
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CBA158] bg-[#CBA158]/10 text-xs font-bold text-[#CBA158]">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[#333]" />}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-6">
        <h4 className="text-sm font-semibold text-white">{title}</h4>

        {/* Time info */}
        {stop.arrivalTime && (
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarSmIcon />
              {formatDate(stop.arrivalTime)}
            </span>
            <span className="flex items-center gap-1">
              <ClockSmIcon />
              {formatTime(stop.arrivalTime)}
            </span>
          </div>
        )}

        {stop.description.trim() && (
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {stop.description}
          </p>
        )}

        {hasCoords && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-600">
            <MapPinSmIcon />
            <span>Lat: {parseFloat(stop.latitude).toFixed(5)}, Lng: {parseFloat(stop.longitude).toFixed(5)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TripPreviewModal({ open, onClose, data, trip }: TripPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("describes");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const resolved = useMemo(() => {
    if (data) {
      return {
        title: data.title,
        description: data.description,
        moderatorName: data.moderatorName,
        category: data.category,
        difficulty: data.difficulty,
        startDate: data.startDate,
        durationHours: data.durationHours,
        maxParticipants: data.maxParticipants,
        price: data.price,
        currency: data.currency,
        languages: data.languages,
        highlights: data.highlights,
        stops: data.stops.map(editorStopToPreview),
      };
    }
    if (trip) {
      return {
        title: trip.title,
        description: trip.description,
        moderatorName: trip.moderator_name ?? "",
        category: trip.category,
        difficulty: trip.difficulty,
        startDate: trip.start_date,
        durationHours: trip.duration_hours,
        maxParticipants: trip.max_participants,
        price: trip.price,
        currency: trip.currency,
        languages: parseTags(trip.tags),
        highlights: [] as string[],
        stops: (trip.stops ?? []).map(tripStopToPreview),
      };
    }
    return null;
  }, [data, trip]);

  if (!open || !resolved) return null;

  const firstStopName =
    resolved.stops.find((s) => s.locationName.trim() || s.title.trim())?.locationName.split(",")[0]?.trim() ||
    resolved.stops.find((s) => s.title.trim())?.title.split(",")[0]?.trim() ||
    "";

  const subtitle = [
    firstStopName,
    resolved.startDate ? timeAgo(resolved.startDate) : null,
    resolved.durationHours > 0 ? `${resolved.durationHours}h` : null,
  ]
    .filter(Boolean)
    .join(" \u2022 ");

  const filteredHighlights = resolved.highlights.filter((h) => h.trim());
  const namedStops = resolved.stops.filter(
    (s) => s.title.trim() || s.locationName.trim(),
  );

  const priceNum = parseFloat(resolved.price);
  const priceDisplay = priceNum > 0 ? `${resolved.price} ${resolved.currency}` : "Free";

  const tabs: { key: PreviewTab; label: string }[] = [
    { key: "describes", label: "Describes" },
    { key: "visitors", label: "Visitors" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#333] bg-[#0a0a0a] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-preview-title"
      >
        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <XIcon />
        </button>

        {/* Tabs */}
        <div className="flex shrink-0 gap-1 border-b border-[#333] px-6 pt-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-t-lg px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#CBA158] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "describes" && (
            <>
              {/* Title + subtitle */}
              <div className="mb-5">
                <h2
                  id="trip-preview-title"
                  className="text-lg font-bold text-white"
                >
                  {resolved.title.trim() || "Untitled Trip"}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
                )}
              </div>

              {/* Stats row */}
              <div className="mb-6 flex items-start justify-center gap-2 rounded-xl border border-[#222] bg-[#111] px-4 py-4">
                <StatIcon
                  icon={<DaysIcon />}
                  label={`${resolved.durationHours}h\nDuration`}
                />
                <StatIcon
                  icon={<WalkingIcon />}
                  label={`${namedStops.length} Stops`}
                />
                <StatIcon
                  icon={<TimeIcon />}
                  label={resolved.startDate ? formatDate(resolved.startDate) : "---"}
                />
                <StatIcon
                  icon={<GroupIcon />}
                  label={`Max ${resolved.maxParticipants}`}
                />
                <StatIcon
                  icon={<LocationPinIcon />}
                  label={firstStopName || "---"}
                />
              </div>

              {/* Description */}
              {resolved.description.trim() && (
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    Trip Description
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-400">
                    {resolved.description}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {filteredHighlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Trip Highlights
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {filteredHighlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-400"
                      >
                        <span className="mt-0.5 shrink-0">
                          <CheckIcon />
                        </span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {resolved.languages.length > 0 && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Languages:
                  </span>
                  <div className="flex gap-1.5">
                    {resolved.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded bg-[#222] px-2 py-0.5 text-[10px] font-medium uppercase text-gray-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + Difficulty */}
              <div className="mb-6 flex gap-4">
                <div className="rounded-lg border border-[#222] bg-[#111] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-gray-500">Price</span>
                  <p className="text-sm font-semibold text-[#CBA158]">{priceDisplay}</p>
                </div>
                <div className="rounded-lg border border-[#222] bg-[#111] px-4 py-2.5">
                  <span className="text-[10px] uppercase text-gray-500">Difficulty</span>
                  <p className="text-sm font-semibold capitalize text-white">{resolved.difficulty}</p>
                </div>
                {resolved.moderatorName.trim() && (
                  <div className="rounded-lg border border-[#222] bg-[#111] px-4 py-2.5">
                    <span className="text-[10px] uppercase text-gray-500">Moderator</span>
                    <p className="text-sm font-semibold text-white">{resolved.moderatorName}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {namedStops.length > 0 && (
                <div className="mb-2">
                  <h3 className="mb-4 text-sm font-semibold text-white">
                    Trip Timeline &amp; Route Map
                  </h3>
                  <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                    {namedStops.map((stop, i) => (
                      <StopTimeline
                        key={i}
                        stop={stop}
                        index={i}
                        isLast={i === namedStops.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "visitors" && (
            <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
              No visitor data yet.
            </div>
          )}

          {activeTab === "completed" && (
            <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
              No completed trip data yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-[#333] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#333] bg-[#333333] px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
