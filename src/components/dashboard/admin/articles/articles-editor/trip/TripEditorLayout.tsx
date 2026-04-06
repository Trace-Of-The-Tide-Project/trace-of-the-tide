"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { type ArticleWorkflowStatus } from "../ArticleSettings";
import { ContentEditorFooter } from "../ContentEditorFooter";
import { ScheduleArticleModal } from "../modals/ScheduleArticleModal";
import { TripBasicInfo } from "./TripBasicInfo";
import { TripDetailsSection } from "./TripDetailsSection";
import { TripPricing } from "./TripPricing";
import { TripLanguages } from "./TripLanguages";
import { ItineraryBuilder, emptyEditorStop, editorStopsToTripStops, type EditorStop } from "./ItineraryBuilder";
import { TripSummary } from "./TripSummary";
import { createTrip, type CreateTripPayload } from "@/services/trips.service";

const ADMIN_ARTICLES_PATH = "/admin/articles";

function errMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
      if (Array.isArray(o.message)) return o.message.map(String).join("; ");
      if (typeof o.error === "string") return o.error;
    }
    return e.message || "Request failed";
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}

export function TripEditorLayout() {
  const router = useRouter();

  // Basic info
  const [title, setTitle] = useState("");
  const [moderatorName, setModeratorName] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);

  // Trip details
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("moderate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationHours, setDurationHours] = useState(8);
  const [maxParticipants, setMaxParticipants] = useState(15);
  const [minParticipants, setMinParticipants] = useState(0);

  // Pricing
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Languages
  const [languages, setLanguages] = useState<string[]>(["EN"]);

  // Tags
  const [tags, setTags] = useState<string[]>([]);

  // Stops (itinerary)
  const [stops, setStops] = useState<EditorStop[]>([emptyEditorStop()]);

  // Workflow
  const [workflowStatus, setWorkflowStatus] = useState<ArticleWorkflowStatus>("draft");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildRouteSummary = useCallback((): string => {
    return stops
      .map((s) => (s.title.trim() || s.locationName.trim()))
      .filter(Boolean)
      .map((n) => n.split(",")[0]!.trim())
      .join(" \u2192 ");
  }, [stops]);

  const buildPayload = useCallback(
    (status: "draft" | "published"): CreateTripPayload => {
      const filteredHighlights = highlights.filter((h) => h.trim());
      return {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        route_summary: buildRouteSummary() || undefined,
        start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        price: price || "0",
        currency,
        max_participants: maxParticipants,
        min_participants: minParticipants || undefined,
        status,
        difficulty,
        duration_hours: durationHours,
        tags: tags.length > 0 ? tags : undefined,
        languages: languages.length > 0 ? languages : undefined,
        highlights: filteredHighlights.length > 0 ? filteredHighlights : undefined,
        moderator_name: moderatorName.trim() || undefined,
        stops: editorStopsToTripStops(stops),
      };
    },
    [
      title, description, category, buildRouteSummary,
      startDate, endDate, price, currency, maxParticipants, minParticipants,
      difficulty, durationHours, tags, languages, highlights, moderatorName, stops,
    ],
  );

  const validateBeforeSubmit = useCallback(() => {
    if (!title.trim()) return "Title is required.";
    if (!category.trim()) return "Category is required.";
    return null;
  }, [title, category]);

  const handleSaveDraft = useCallback(async () => {
    const v = validateBeforeSubmit();
    if (v) { setError(v); return; }
    setError(null);
    setBusy(true);
    try {
      await createTrip(buildPayload("draft"));
      router.push(ADMIN_ARTICLES_PATH);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setBusy(false);
    }
  }, [validateBeforeSubmit, buildPayload, router]);

  const handlePublish = useCallback(async () => {
    if (workflowStatus !== "published" && workflowStatus !== "scheduled") return;
    const v = validateBeforeSubmit();
    if (v) { setError(v); return; }
    setError(null);
    setBusy(true);
    try {
      await createTrip(buildPayload("published"));
      router.push(ADMIN_ARTICLES_PATH);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setBusy(false);
    }
  }, [workflowStatus, validateBeforeSubmit, buildPayload, router]);

  const handleScheduleConfirm = useCallback(
    async (_iso: string) => {
      if (workflowStatus !== "published" && workflowStatus !== "scheduled") return;
      const v = validateBeforeSubmit();
      if (v) { setError(v); setScheduleModalOpen(false); return; }
      setError(null);
      setBusy(true);
      try {
        await createTrip(buildPayload("published"));
        setScheduleModalOpen(false);
        router.push(ADMIN_ARTICLES_PATH);
      } catch (e) {
        setError(errMessage(e));
        setScheduleModalOpen(false);
      } finally {
        setBusy(false);
      }
    },
    [workflowStatus, validateBeforeSubmit, buildPayload, router],
  );

  return (
    <div className="flex min-h-0 flex-col">
      <ScheduleArticleModal
        open={scheduleModalOpen}
        busy={busy}
        onClose={() => !busy && setScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
      />

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Main column */}
        <div className="min-w-0 flex-1 space-y-6 overflow-y-auto">
          <TripBasicInfo
            title={title}
            onTitleChange={setTitle}
            moderatorName={moderatorName}
            onModeratorNameChange={setModeratorName}
            description={description}
            onDescriptionChange={setDescription}
            highlights={highlights}
            onHighlightsChange={setHighlights}
          />

          <TripDetailsSection
            category={category}
            onCategoryChange={setCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            durationHours={durationHours}
            onDurationHoursChange={setDurationHours}
            maxParticipants={maxParticipants}
            onMaxParticipantsChange={setMaxParticipants}
            minParticipants={minParticipants}
            onMinParticipantsChange={setMinParticipants}
          />

          <TripPricing
            price={price}
            onPriceChange={setPrice}
            currency={currency}
            onCurrencyChange={setCurrency}
          />

          <TripLanguages
            languages={languages}
            onLanguagesChange={setLanguages}
          />

          <ItineraryBuilder
            stops={stops}
            onChange={setStops}
          />
        </div>

        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
          <TripSummary
            title={title}
            startDate={startDate}
            durationHours={durationHours}
            price={price}
            currency={currency}
            stops={stops}
          />

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#444444] bg-[#1a1a1a] py-2 text-sm text-gray-400 hover:text-white"
            >
              Duplicate Trip
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#444444] bg-[#1a1a1a] py-2 text-sm text-gray-400 hover:text-white"
            >
              Publish on...
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#444444] bg-[#1a1a1a] py-2 text-sm text-gray-400 hover:text-white"
            >
              Archive
            </button>
          </div>
        </aside>
      </div>

      <ContentEditorFooter
        primaryButtonLabel="Publish Now"
        workflowStatus={workflowStatus}
        busy={busy}
        error={error}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onOpenSchedule={() => setScheduleModalOpen(true)}
      />
    </div>
  );
}
