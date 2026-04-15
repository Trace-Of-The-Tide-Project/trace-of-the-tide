"use client";

import { useCallback, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-input-bg)] px-3 py-2 text-sm text-foreground placeholder-gray-500 outline-none focus:border-gray-500";

type TripBasicInfoProps = {
  title: string;
  onTitleChange: (v: string) => void;
  moderatorName: string;
  onModeratorNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  highlights: string[];
  onHighlightsChange: (v: string[]) => void;
};

export function TripBasicInfo({
  title,
  onTitleChange,
  moderatorName,
  onModeratorNameChange,
  description,
  onDescriptionChange,
  highlights,
  onHighlightsChange,
}: TripBasicInfoProps) {
  const addHighlight = useCallback(() => {
    onHighlightsChange([...highlights, ""]);
  }, [highlights, onHighlightsChange]);

  const updateHighlight = useCallback(
    (idx: number, value: string) => {
      onHighlightsChange(highlights.map((h, i) => (i === idx ? value : h)));
    },
    [highlights, onHighlightsChange],
  );

  const removeHighlight = useCallback(
    (idx: number) => {
      onHighlightsChange(highlights.filter((_, i) => i !== idx));
    },
    [highlights, onHighlightsChange],
  );

  return (
    <section className="rounded-lg border border-[var(--tott-card-border)] p-4 space-y-4">
      <h3 className="text-sm font-bold text-foreground">Basic Informations</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Trip Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g., Heritage Walk: Old Jerusalem"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Moderator Name
          </label>
          <input
            type="text"
            value={moderatorName}
            onChange={(e) => onModeratorNameChange(e.target.value)}
            placeholder="e.g., John Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the trip experience..."
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Highlights
        </label>
        <div className="space-y-2">
          {highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder={`Highlight ${idx + 1}`}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="shrink-0 text-gray-500 hover:text-foreground"
                aria-label={`Remove highlight ${idx + 1}`}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addHighlight}
          className="mt-2 w-full rounded-lg border border-dashed border-[var(--tott-card-border)] py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-foreground"
        >
          + Add Highlight
        </button>
      </div>
    </section>
  );
}
