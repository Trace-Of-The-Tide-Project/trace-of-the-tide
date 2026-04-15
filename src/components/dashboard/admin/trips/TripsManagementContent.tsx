"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { PlusIcon, EyeIcon, TrashIcon } from "@/components/ui/icons";
import { getTrips, deleteTrip, type TripListItem } from "@/services/trips.service";
import { TripEditorLayout } from "@/components/dashboard/admin/articles/articles-editor/trip/TripEditorLayout";
import { TripPreviewModal } from "@/components/dashboard/admin/articles/articles-editor/trip/TripPreviewModal";

const ROWS_PER_PAGE = 6;

function errMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
    }
    return e.message || "Request failed";
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function durationLabel(hours: number): string {
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

type StatusStyle = { label: string; color: string };

function statusDisplay(status: string): StatusStyle {
  const s = status.toLowerCase();
  if (s === "published" || s === "completed") return { label: "Completed", color: "#2ECC71" };
  if (s === "archived") return { label: "Archived", color: "#E67E22" };
  if (s === "draft") return { label: "Draft", color: "#3498DB" };
  return { label: "Past", color: "#9ca3af" };
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

type ArchiveViewProps = {
  trips: TripListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onPreview: (trip: TripListItem) => void;
};

function ArchiveView({ trips, loading, error, onRetry, onDelete, deletingId, onPreview }: ArchiveViewProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return trips;
    const q = search.toLowerCase();
    return trips.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.route_summary ?? "").toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [trips, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-medium text-amber-400 underline hover:text-amber-300"
          >
            Try again
          </button>
        </div>
      )}

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search archive..."
          className="w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-gray-500 outline-none focus:border-gray-500"
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-[var(--tott-card-border)] px-5 py-12 text-center text-sm text-gray-500">
          Loading trips…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--tott-card-border)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--tott-card-border)]">
                <th className="px-5 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>Title</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>Route</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>Start Date</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>End Date</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>Duration</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#C9A96E" }}>Status</th>
                <th className="w-20 px-4 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500">
                    {search.trim() ? "No trips match your search." : "No trips yet."}
                  </td>
                </tr>
              ) : (
                pageRows.map((trip) => {
                  const st = statusDisplay(trip.status);
                  return (
                    <tr key={trip.id} className="border-b border-[var(--tott-card-border)] last:border-b-0">
                      <td className="px-5 py-3 font-medium text-foreground">{trip.title}</td>
                      <td className="px-4 py-3 text-gray-400">{trip.route_summary ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(trip.start_date)}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(trip.end_date)}</td>
                      <td className="px-4 py-3 text-gray-400">{durationLabel(trip.duration_hours)}</td>
                      <td className="px-4 py-3">
                        <span style={{ color: st.color }} className="text-xs font-medium">
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onPreview(trip)}
                            className="text-gray-500 transition-colors hover:text-foreground"
                            aria-label={`Preview ${trip.title}`}
                          >
                            <EyeIcon />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === trip.id}
                            onClick={() => onDelete(trip.id)}
                            className="text-gray-500 transition-colors hover:text-red-400 disabled:opacity-40"
                            aria-label={`Delete ${trip.title}`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {(safePage - 1) * ROWS_PER_PAGE + 1} to{" "}
            {Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length.toLocaleString()} trips…
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] px-4 py-2 text-gray-400 transition-colors hover:text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] px-4 py-2 text-gray-400 transition-colors hover:text-foreground disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TripsManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "archive" ? "archive" : "create";

  const setTab = useCallback(
    (tab: "create" | "archive") => {
      router.replace(tab === "archive" ? "/admin/trips?tab=archive" : "/admin/trips", { scroll: false });
    },
    [router]
  );

  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewTrip, setPreviewTrip] = useState<TripListItem | null>(null);

  const loadTrips = useCallback(async () => {
    setTripsLoading(true);
    setTripsError(null);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (e) {
      setTripsError(errMessage(e));
    } finally {
      setTripsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "archive") {
      void loadTrips();
    }
  }, [activeTab, loadTrips]);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setTripsError(errMessage(e));
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div className="space-y-4">
      <TripPreviewModal
        open={previewTrip !== null}
        onClose={() => setPreviewTrip(null)}
        trip={previewTrip ?? undefined}
      />

      {/* Tabs */}
      <div className="flex w-full gap-1 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] p-1">
        <button
          type="button"
          onClick={() => setTab("create")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-medium transition-all ${
            activeTab === "create"
              ? "border border-[#4A4A4A] bg-[var(--tott-dash-control-bg)] text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
          }`}
        >
          <PlusIcon />
          Create Trip
        </button>
        <button
          type="button"
          onClick={() => setTab("archive")}
          className={`flex-1 rounded-md py-3 text-sm font-medium transition-all ${
            activeTab === "archive"
              ? "border border-[#4A4A4A] bg-[var(--tott-dash-control-bg)] text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
          }`}
        >
          Archive
        </button>
      </div>

      {/* Both tabs stay mounted, hidden via CSS to preserve state */}
      <div className={activeTab === "create" ? "" : "hidden"}>
        <TripEditorLayout />
      </div>
      <div className={activeTab === "archive" ? "space-y-4" : "hidden"}>
        <ArchiveView
          trips={trips}
          loading={tripsLoading}
          error={tripsError}
          onRetry={loadTrips}
          onDelete={(id) => void handleDelete(id)}
          deletingId={deletingId}
          onPreview={setPreviewTrip}
        />
      </div>
    </div>
  );
}
