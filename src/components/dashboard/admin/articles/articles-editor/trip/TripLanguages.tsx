"use client";

import { useCallback } from "react";

const selectClass =
  "w-full rounded-lg border border-[#444444] bg-[#333333] px-3 py-2 text-sm text-gray-400 outline-none focus:border-gray-500";

const AVAILABLE_LANGUAGES = [
  { code: "AR", label: "Arabic" },
  { code: "EN", label: "English" },
  { code: "HE", label: "Hebrew" },
  { code: "FR", label: "French" },
  { code: "ES", label: "Spanish" },
  { code: "DE", label: "German" },
  { code: "TR", label: "Turkish" },
] as const;

type TripLanguagesProps = {
  languages: string[];
  onLanguagesChange: (v: string[]) => void;
};

export function TripLanguages({ languages, onLanguagesChange }: TripLanguagesProps) {
  const addLanguage = useCallback(
    (code: string) => {
      if (code && !languages.includes(code)) {
        onLanguagesChange([...languages, code]);
      }
    },
    [languages, onLanguagesChange],
  );

  const removeLanguage = useCallback(
    (code: string) => {
      onLanguagesChange(languages.filter((l) => l !== code));
    },
    [languages, onLanguagesChange],
  );

  const available = AVAILABLE_LANGUAGES.filter((l) => !languages.includes(l.code));

  return (
    <section className="rounded-lg border border-[#333333] p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Languages</h3>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Select Language
        </label>
        <select
          className={selectClass}
          value=""
          onChange={(e) => {
            if (e.target.value) addLanguage(e.target.value);
          }}
        >
          <option value="">Select...</option>
          {available.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {languages.map((code) => {
            const label = AVAILABLE_LANGUAGES.find((l) => l.code === code)?.label ?? code;
            return (
              <span
                key={code}
                className="flex items-center gap-1 rounded-lg border border-[#444444] bg-[#333333] px-2.5 py-1 text-xs text-white"
              >
                {code}
                <button
                  type="button"
                  onClick={() => removeLanguage(code)}
                  className="ml-0.5 text-gray-500 hover:text-white"
                  aria-label={`Remove ${label}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
