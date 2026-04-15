"use client";

import { useCallback, useState } from "react";
import { theme } from "@/lib/theme";
import { SettingsRow, settingsCardClass, SettingsToggle } from "./SettingsPrimitives";

export function AdminNotificationPreferences() {
  const [articleUpdates, setArticleUpdates] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [newContributor, setNewContributor] = useState(true);
  const [comments, setComments] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = useCallback(() => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className={settingsCardClass} style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}>
        <h1 className="text-lg font-bold text-foreground">Notifications Settings</h1>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Email Notifications</h2>
          <div className="mt-2">
            <SettingsRow
              title="Article Updates"
              description="Get notified when articles you follow are updated"
              control={
                <SettingsToggle checked={articleUpdates} onChange={setArticleUpdates} aria-label="Article updates" />
              }
            />
            <SettingsRow
              title="New Followers"
              description="Get notified when someone follows you"
              control={<SettingsToggle checked={newFollowers} onChange={setNewFollowers} aria-label="New followers" />}
            />
            <SettingsRow
              title="New Contributor"
              description="Real-time notification for new supporters"
              control={
                <SettingsToggle checked={newContributor} onChange={setNewContributor} aria-label="New contributor" />
              }
            />
            <SettingsRow
              title="Comments"
              description="Get notified when someone comments on your articles"
              control={<SettingsToggle checked={comments} onChange={setComments} aria-label="Comments" />}
            />
            <SettingsRow
              title="Weekly Digest"
              description="Get a weekly summary of popular articles"
              control={<SettingsToggle checked={weeklyDigest} onChange={setWeeklyDigest} aria-label="Weekly digest" />}
              showDivider={false}
            />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Push Notifications</h2>
          <div className="mt-2">
            <SettingsRow
              title="Browser Notifications"
              description="Receive notifications in your browser"
              control={
                <SettingsToggle
                  checked={browserNotifications}
                  onChange={setBrowserNotifications}
                  aria-label="Browser notifications"
                />
              }
              showDivider={false}
            />
          </div>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={handleSave}
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
