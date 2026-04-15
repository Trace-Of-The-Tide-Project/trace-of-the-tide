"use client";

import { useCallback, useState } from "react";
import { theme } from "@/lib/theme";
import { SettingsRow, settingsCardClass, SettingsToggle } from "./SettingsPrimitives";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "followers", label: "Followers only" },
  { value: "private", label: "Private" },
] as const;

export function AdminPrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState<(typeof VISIBILITY_OPTIONS)[number]["value"]>("public");
  const [showEmail, setShowEmail] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [allowFollows, setAllowFollows] = useState(true);

  const selectClass =
    "min-w-[9.5rem] cursor-pointer appearance-none rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] py-2.5 pl-3 pr-9 text-sm text-foreground outline-none focus:border-[#C9A96E]";

  const [savedFlash, setSavedFlash] = useState(false);
  const onSave = useCallback(() => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className={settingsCardClass} style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}>
        <h1 className="text-lg font-bold text-foreground">Privacy Settings</h1>

        <div className="mt-6">
          <SettingsRow
            title="Profile Visibility"
            description="Control who can see your profile"
            control={
              <div className="relative">
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value as typeof profileVisibility)}
                  className={selectClass}
                  aria-label="Profile visibility"
                >
                  {VISIBILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
            }
          />
          <SettingsRow
            title="Show Email"
            description="Display your email on your profile"
            control={
              <SettingsToggle checked={showEmail} onChange={setShowEmail} aria-label="Show email on profile" />
            }
          />
          <SettingsRow
            title="Show Activity"
            description="Show your recent activity on your profile"
            control={
              <SettingsToggle checked={showActivity} onChange={setShowActivity} aria-label="Show activity" />
            }
          />
          <SettingsRow
            title="Allow Follows"
            description="Allow other users to follow you"
            control={<SettingsToggle checked={allowFollows} onChange={setAllowFollows} aria-label="Allow follows" />}
            showDivider={false}
          />
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-lg py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accentGold }}
          >
            {savedFlash ? "Saved" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
