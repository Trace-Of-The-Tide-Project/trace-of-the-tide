"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { UploadedMediaImage } from "@/components/media/UploadedMediaImage";
import { USER_STATUS_COLORS } from "@/lib/dashboard/users-management-constants";
import { theme } from "@/lib/theme";
import { getUserProfile, type AdminUserProfileView } from "@/services/users.service";

type UserProfileModalProps = {
  userId: string | null;
  onClose: () => void;
};

function userErrMessage(e: unknown, fallback: string): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      const nested = o.data;
      if (nested && typeof nested === "object") {
        const m = (nested as Record<string, unknown>).message;
        if (typeof m === "string" && m.trim()) return m;
      }
      if (typeof o.message === "string" && o.message.trim()) return o.message;
      if (typeof o.error === "string" && o.error.trim()) return o.error;
    }
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

function displayValue(value: string | null | undefined, emptyLabel: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : emptyLabel;
}

function formatBirthDate(value: string | null | undefined, emptyLabel: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return emptyLabel;
  const parsed = Date.parse(trimmed);
  if (!Number.isFinite(parsed)) return trimmed;
  return new Date(parsed).toLocaleDateString();
}

function formatSocialLinks(value: string | null | undefined, emptyLabel: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return emptyLabel;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return trimmed;
    const entries = Object.entries(parsed as Record<string, unknown>)
      .map(([key, entry]) => {
        if (typeof entry !== "string" || !entry.trim()) return null;
        return `${key}: ${entry.trim()}`;
      })
      .filter((entry): entry is string => entry !== null);
    return entries.length > 0 ? entries.join(", ") : trimmed;
  } catch {
    return trimmed;
  }
}

function profileInitials(profileView: AdminUserProfileView): string {
  const source =
    profileView.profile?.display_name?.trim() ||
    profileView.full_name?.trim() ||
    profileView.username?.trim() ||
    profileView.email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "?";
}

function ProfileDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--tott-card-border)]/70 bg-[var(--tott-dash-control-bg)]/40 px-3.5 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground wrap-break-word">{value}</p>
    </div>
  );
}

export function UserProfileModal({ userId, onClose }: UserProfileModalProps) {
  const t = useTranslations("Dashboard.usersManagement.viewProfilePage");
  const tStatus = useTranslations("Dashboard.usersManagement.statusLabels");
  const open = Boolean(userId);
  const [profileView, setProfileView] = useState<AdminUserProfileView | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const emptyLabel = t("noValue");
  const avatarRef = profileView?.profile?.avatar?.trim() || null;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || !userId) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setProfileView(null);

    void (async () => {
      try {
        const profile = await getUserProfile(userId).catch((err) => {
          if (isAxiosError(err) && err.response?.status === 404) return null;
          throw err;
        });
        if (cancelled) return;
        if (!profile) {
          setLoadError(t("errors.loadFailed"));
          return;
        }
        setProfileView(profile);
      } catch (err) {
        if (cancelled) return;
        setLoadError(userErrMessage(err, t("errors.loadFailed")));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, t, userId]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [handleClose, open]);

  if (!open || typeof document === "undefined") return null;

  const profile = profileView?.profile;
  const statusKey = profileView?.status.trim().toLowerCase() ?? "";
  const statusLabel =
    statusKey === "active" ||
    statusKey === "pending" ||
    statusKey === "suspended" ||
    statusKey === "inactive"
      ? tStatus(statusKey)
      : displayValue(profileView?.status, emptyLabel);
  const statusColor = USER_STATUS_COLORS[statusKey] ?? "#9CA3AF";
  const headline =
    profile?.display_name?.trim() ||
    profileView?.full_name?.trim() ||
    profileView?.username?.trim() ||
    t("headerTitle");

  return createPortal(
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={handleClose}
        aria-label={t("closeModalAria")}
      />

      <div
        className="relative flex max-h-[min(90vh,760px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-modal-title"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[var(--tott-card-border)] px-5 py-4 sm:px-6">
          <div>
            <h2 id="user-profile-modal-title" className="text-base font-semibold text-foreground sm:text-lg">
              {t("headerTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{t("headerSubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[var(--tott-dash-ghost-hover)] hover:text-foreground"
            aria-label={t("closeAria")}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">{t("loading")}</p>
          ) : loadError ? (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
              {loadError}
            </div>
          ) : profileView ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <aside className="flex w-full shrink-0 flex-col items-center rounded-2xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] p-5 text-center lg:w-56 lg:items-stretch lg:p-6">
                <div
                  className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 bg-[var(--tott-dash-control-bg)] shadow-inner lg:mx-0"
                  style={{ borderColor: theme.accentGold }}
                >
                  {avatarRef ? (
                    <UploadedMediaImage mediaRef={avatarRef} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-foreground/80">{profileInitials(profileView)}</span>
                  )}
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">{headline}</p>
                <p className="mt-1 text-sm text-gray-500">@{displayValue(profileView.username, emptyLabel)}</p>
                <span
                  className="mt-4 inline-flex self-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide lg:self-start"
                  style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                >
                  {statusLabel}
                </span>
                {!profile ? (
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">{t("noProfile")}</p>
                ) : null}
              </aside>

              <section className="min-w-0 flex-1 rounded-2xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ProfileDetailRow label={t("email")} value={displayValue(profileView.email, emptyLabel)} />
                  <ProfileDetailRow label={t("fullName")} value={displayValue(profileView.full_name, emptyLabel)} />
                  <ProfileDetailRow label={t("phoneNumber")} value={displayValue(profileView.phone_number, emptyLabel)} />
                  <ProfileDetailRow
                    label={t("emailVerified")}
                    value={profileView.email_verified ? t("yes") : t("no")}
                  />
                  <ProfileDetailRow label={t("displayName")} value={displayValue(profile?.display_name, emptyLabel)} />
                  <ProfileDetailRow label={t("location")} value={displayValue(profile?.location, emptyLabel)} />
                  <ProfileDetailRow label={t("company")} value={displayValue(profile?.company, emptyLabel)} />
                  <ProfileDetailRow label={t("jobTitle")} value={displayValue(profile?.job_title, emptyLabel)} />
                  <ProfileDetailRow label={t("personalLink")} value={displayValue(profile?.personal_link, emptyLabel)} />
                  <ProfileDetailRow label={t("birthDate")} value={formatBirthDate(profile?.birth_date, emptyLabel)} />
                  <ProfileDetailRow label={t("gender")} value={displayValue(profile?.gender, emptyLabel)} />
                  <ProfileDetailRow
                    label={t("socialLinks")}
                    value={formatSocialLinks(profile?.social_links, emptyLabel)}
                  />
                </div>
                <div className="mt-3 rounded-xl border border-[var(--tott-card-border)]/70 bg-[var(--tott-dash-control-bg)]/40 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{t("about")}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground wrap-break-word">
                    {displayValue(profile?.about, emptyLabel)}
                  </p>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
