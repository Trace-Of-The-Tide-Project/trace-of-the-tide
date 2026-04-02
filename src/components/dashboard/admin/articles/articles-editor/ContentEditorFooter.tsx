"use client";

import { CameraIcon, SaveIcon, CalendarIcon } from "./ArticleEditorIcons";
import type { ArticleWorkflowStatus } from "./ArticleSettings";

type ContentEditorFooterProps = {
  primaryButtonLabel?: string;
  /** Create: "Save Draft". Edit: e.g. "Save changes". */
  saveDraftLabel?: string;
  workflowStatus: ArticleWorkflowStatus;
  busy?: boolean;
  error?: string | null;
  onPublish: () => void;
  onSaveDraft: () => void;
  onOpenSchedule: () => void;
};

export function ContentEditorFooter({
  primaryButtonLabel = "Publish Now",
  saveDraftLabel = "Save Draft",
  workflowStatus,
  busy = false,
  error,
  onPublish,
  onSaveDraft,
  onOpenSchedule,
}: ContentEditorFooterProps) {
  const publishFlowEnabled = workflowStatus === "published" || workflowStatus === "scheduled";
  const disabledPrimary = busy || !publishFlowEnabled;

  return (
    <footer className="mt-6 border-t border-[#444444] pt-6">
      <div className="flex flex-col items-stretch gap-3">
        {error ? (
          <p
            className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={disabledPrimary}
          onClick={onPublish}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "#C9A96E" }}
        >
          <CameraIcon />
          {primaryButtonLabel}
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onSaveDraft}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#333333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d3d3d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SaveIcon />
            {saveDraftLabel}
          </button>
          <button
            type="button"
            disabled={busy || !publishFlowEnabled}
            onClick={onOpenSchedule}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#333333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d3d3d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarIcon />
            Schedule
          </button>
        </div>
      </div>
    </footer>
  );
}
