"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import {
  CameraIcon,
  FacebookIcon,
  InstagramIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  TwitterXIcon,
} from "@/components/ui/icons";
import { UploadedMediaImage } from "@/components/media/UploadedMediaImage";
import { formatUserRoleLabel } from "@/lib/dashboard/user-table-formatters";
import {
  isSignedUploadedMediaRef,
  uploadUploadedMediaFile,
  uploadedMediaPersistedRef,
} from "@/lib/media/uploaded-media";
import { useStoredAuthUser } from "@/hooks/useStoredAuthUser";
import { theme } from "@/lib/theme";
import { getUserRoles } from "@/services/roles.service";
import {
  canonicalSocialLinksJson,
  canonicalSocialLinksObject,
  getUserProfile,
  parseSocialLinksObject,
  updateUserProfile,
  type UserProfileSocialLinks,
} from "@/services/users.service";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const inputClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-4 py-3 text-sm text-foreground placeholder:text-gray-500 outline-none focus:border-[#C9A96E]";
const readOnlyInputClass =
  "w-full rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-3 text-sm text-gray-400 outline-none";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function profileErrMessage(e: unknown, fallback: string): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      const message = o.message;
      if (Array.isArray(message)) {
        const parts = message
          .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
          .filter(Boolean);
        if (parts.length > 0) return parts.join(" ");
      }
      if (typeof message === "string" && message.trim()) return message;
      if (typeof o.error === "string" && o.error.trim()) return o.error;
    }
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

function displayReadOnlyValue(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function formatRoleList(roleNames: readonly string[]): string {
  const names = roleNames.map((name) => name.trim()).filter(Boolean);
  if (names.length === 0) return "";
  return names.map((name) => formatUserRoleLabel(name)).join(", ");
}

function buildPresetSocialLinks(presets: Record<PresetKey, string>): UserProfileSocialLinks {
  return {
    facebook: presets.facebook.trim(),
    twitter: presets.twitter.trim(),
    instagram: presets.instagram.trim(),
    linkedin: presets.linkedin.trim(),
  };
}

type PresetKey = "facebook" | "twitter" | "instagram" | "linkedin";

const PRESETS: { key: PresetKey; Icon: FC }[] = [
  { key: "facebook", Icon: FacebookIcon },
  { key: "twitter", Icon: TwitterXIcon },
  { key: "instagram", Icon: InstagramIcon },
  { key: "linkedin", Icon: LinkedInIcon },
];

export function AdminProfileInformation() {
  const t = useTranslations("Dashboard.adminProfile");
  const authUser = useStoredAuthUser();
  const photoInputId = useId();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [biography, setBiography] = useState("");
  const [originalLocation, setOriginalLocation] = useState("");
  const [originalWebsite, setOriginalWebsite] = useState("");
  const [originalBiography, setOriginalBiography] = useState("");
  const [originalSocialLinksJson, setOriginalSocialLinksJson] = useState("");
  const [presetUrls, setPresetUrls] = useState<Record<PresetKey, string>>({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });
  const [extraLinks, setExtraLinks] = useState<{ id: string; url: string }[]>([]);
  const [otherLinkUrl, setOtherLinkUrl] = useState("");
  const [otherFocused, setOtherFocused] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [remoteAvatar, setRemoteAvatar] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const avatarFileRef = useRef<File | null>(null);

  const initials = useMemo(() => initialsFromName(fullName), [fullName]);
  const avatarSrc = avatarPreview;

  const revokePreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    const userId = authUser?.id;
    if (!userId) {
      setLoading(false);
      setLoadError(t("errors.loadFailed"));
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setError(null);

    void (async () => {
      try {
        const [profileView, userRoles] = await Promise.all([
          getUserProfile(userId),
          getUserRoles(userId).catch(() => ({ roles: [], results: 0 })),
        ]);
        if (cancelled) return;
        if (!profileView) {
          setLoadError(t("errors.loadFailed"));
          return;
        }

        const profile = profileView.profile;
        const nextLocation = profile?.location ?? "";
        const nextWebsite = profile?.website ?? profile?.personal_link ?? "";
        const nextBiography = profile?.about ?? "";
        const assignedRoles = userRoles.roles.map((assignment) => assignment.roleName).filter(Boolean);
        const nextRole =
          formatRoleList(assignedRoles) ||
          formatRoleList(authUser?.roles ?? []) ||
          (profile?.job_title?.trim() ?? "");

        setFullName(profileView.full_name);
        setEmail(profileView.email);
        setRole(nextRole);
        setCompany(profile?.company ?? "");
        setLocation(nextLocation);
        setWebsite(nextWebsite);
        setBiography(nextBiography);
        setOriginalLocation(nextLocation);
        setOriginalWebsite(nextWebsite);
        setOriginalBiography(nextBiography);
        const parsedSocial = parseSocialLinksObject(profile?.social_links);
        setPresetUrls({
          facebook: parsedSocial.facebook,
          twitter: parsedSocial.twitter,
          instagram: parsedSocial.instagram,
          linkedin: parsedSocial.linkedin,
        });
        setOtherLinkUrl("");
        setExtraLinks([]);
        setOriginalSocialLinksJson(canonicalSocialLinksJson(parsedSocial));
        setRemoteAvatar(profile?.avatar ?? null);
        revokePreview();
        setAvatarPreview(null);
        avatarFileRef.current = null;
      } catch (err) {
        if (cancelled) return;
        setLoadError(profileErrMessage(err, t("errors.loadFailed")));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authUser?.roles, revokePreview, t]);

  const onPhotoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      setPhotoError(null);
      if (!f) return;
      if (!/^image\/(jpeg|png|gif)$/i.test(f.type)) {
        setPhotoError(t("errors.fileType"));
        return;
      }
      if (f.size > MAX_AVATAR_BYTES) {
        setPhotoError(t("errors.maxSize"));
        return;
      }
      revokePreview();
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;
      avatarFileRef.current = f;
      setAvatarPreview(url);
    },
    [revokePreview, t],
  );

  const clearPreset = useCallback((key: PresetKey) => {
    setPresetUrls((p) => ({ ...p, [key]: "" }));
  }, []);

  const removeExtra = useCallback((id: string) => {
    setExtraLinks((list) => list.filter((x) => x.id !== id));
  }, []);

  const addExtraLink = useCallback(() => {
    setExtraLinks((list) => [...list, { id: crypto.randomUUID(), url: "" }]);
  }, []);

  const handleSave = useCallback(async () => {
    const userId = authUser?.id;
    if (!userId) {
      setError(t("errors.loadFailed"));
      return;
    }

    const payload: {
      about?: string;
      location?: string;
      personal_link?: string;
      avatar?: string;
      social_links?: UserProfileSocialLinks;
    } = {};
    const nextBio = biography.trim();
    const nextLocation = location.trim();
    const nextWebsite = website.trim();
    if (nextBio !== originalBiography.trim()) payload.about = nextBio;
    if (nextLocation !== originalLocation.trim()) payload.location = nextLocation;
    if (nextWebsite !== originalWebsite.trim()) payload.personal_link = nextWebsite;

    const nextSocialLinks = canonicalSocialLinksObject(buildPresetSocialLinks(presetUrls));
    if (canonicalSocialLinksJson(nextSocialLinks) !== originalSocialLinksJson) {
      payload.social_links = nextSocialLinks;
    }

    if (Object.keys(payload).length === 0 && !avatarFileRef.current) {
      setError(t("errors.noChanges"));
      return;
    }

    setSubmitting(true);
    setError(null);
    setSavedFlash(false);
    let uploadedAvatarDisplayRef: string | null = null;
    try {
      if (avatarFileRef.current) {
        const uploaded = await uploadUploadedMediaFile(avatarFileRef.current);
        uploadedAvatarDisplayRef = uploaded.trim();
        payload.avatar = uploadedMediaPersistedRef(uploaded);
      }
      if (Object.keys(payload).length === 0) {
        setError(t("errors.noChanges"));
        return;
      }
      const updated = await updateUserProfile(userId, payload);
      const nextBioValue = updated.about.trim();
      const nextLocationValue = updated.location.trim();
      const nextWebsiteValue = updated.personal_link.trim();
      setBiography(nextBioValue);
      setLocation(nextLocationValue);
      setWebsite(nextWebsiteValue);
      setOriginalBiography(nextBioValue);
      setOriginalLocation(nextLocationValue);
      setOriginalWebsite(nextWebsiteValue);
      const refreshedSocial = parseSocialLinksObject(
        canonicalSocialLinksJson(updated.social_links),
      );
      setPresetUrls({
        facebook: refreshedSocial.facebook,
        twitter: refreshedSocial.twitter,
        instagram: refreshedSocial.instagram,
        linkedin: refreshedSocial.linkedin,
      });
      setOriginalSocialLinksJson(canonicalSocialLinksJson(refreshedSocial));
      const savedAvatar = updated.avatar?.trim() || null;
      setRemoteAvatar(
        savedAvatar && isSignedUploadedMediaRef(savedAvatar)
          ? savedAvatar
          : uploadedAvatarDisplayRef && isSignedUploadedMediaRef(uploadedAvatarDisplayRef)
            ? uploadedAvatarDisplayRef
            : savedAvatar ||
              (uploadedAvatarDisplayRef ? uploadedMediaPersistedRef(uploadedAvatarDisplayRef) : null),
      );
      revokePreview();
      setAvatarPreview(null);
      avatarFileRef.current = null;
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      setError(profileErrMessage(err, t("errors.updateFailed")));
    } finally {
      setSubmitting(false);
    }
  }, [
    authUser?.id,
    biography,
    location,
    originalBiography,
    originalLocation,
    originalSocialLinksJson,
    originalWebsite,
    presetUrls,
    revokePreview,
    t,
    website,
  ]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-12 text-center text-sm text-gray-500 sm:px-4">
        {t("loading")}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-3 sm:px-4">
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className="rounded-xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)]/50 p-6 sm:p-8"
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}
      >
        <h1 className="text-xs font-medium uppercase tracking-wide text-gray-500">{t("pageTitle")}</h1>

        <div className="mt-6 flex flex-col gap-4 border-b border-[var(--tott-card-border)] pb-8 sm:flex-row sm:items-center">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold text-[#1a1a1a] sm:h-28 sm:w-28"
            style={{ backgroundColor: theme.accentGold }}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : remoteAvatar ? (
              <UploadedMediaImage mediaRef={remoteAvatar} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <input
                id={photoInputId}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="sr-only"
                onChange={onPhotoChange}
              />
              <label
                htmlFor={photoInputId}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-[#C9A96E]/60 hover:bg-[var(--tott-dash-control-hover)]"
              >
                <CameraIcon />
                {t("changePhoto")}
              </label>
            </div>
            <p className="text-xs text-gray-500 sm:max-w-xs">
              {t("photoHint")}
              {photoError ? <span className="mt-1 block text-red-400">{photoError}</span> : null}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("fullName")}</label>
            <input type="text" value={displayReadOnlyValue(fullName)} readOnly className={readOnlyInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("email")}</label>
            <input type="email" value={displayReadOnlyValue(email)} readOnly className={readOnlyInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("role")}</label>
            <input type="text" value={displayReadOnlyValue(role)} readOnly className={readOnlyInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("company")}</label>
            <input type="text" value={displayReadOnlyValue(company)} readOnly className={readOnlyInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("location")}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-gray-500">{t("externalLink")}</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
              placeholder={t("externalLinkPlaceholder")}
            />
          </div>
        </div>

        <div className="mt-8 border-b border-[var(--tott-card-border)] pb-8">
          <label className="mb-1.5 block text-xs text-gray-500">{t("biography")}</label>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows={5}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">{t("socialLinks")}</h2>
          <ul className="flex flex-col gap-3">
            {PRESETS.map(({ key, Icon }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-3 py-2 pr-2 sm:gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-400 [&_svg]:h-[18px] [&_svg]:w-[18px]">
                  <Icon />
                </span>
                <input
                  type="url"
                  value={presetUrls[key]}
                  onChange={(e) => setPresetUrls((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={t(`presets.${key}`)}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-gray-500"
                  aria-label={t(`presets.${key}`)}
                />
                <button
                  type="button"
                  onClick={() => clearPreset(key)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-[var(--tott-dash-control-hover)] hover:text-foreground"
                  aria-label={t("removePresetAria", { label: t(`presets.${key}`) })}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}

            <li
              className={`flex items-center gap-3 rounded-lg border bg-[var(--tott-dash-control-bg)] px-3 py-2 pr-2 sm:gap-4 ${
                otherFocused ? "border-[#C9A96E]" : "border-[var(--tott-card-border)]"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-400 [&_svg]:h-[18px] [&_svg]:w-[18px]">
                <LinkIcon />
              </span>
              <input
                type="url"
                value={otherLinkUrl}
                onChange={(e) => setOtherLinkUrl(e.target.value)}
                onFocus={() => setOtherFocused(true)}
                onBlur={() => setOtherFocused(false)}
                placeholder={t("otherLinkPlaceholder")}
                className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-gray-500"
              />
              <span className="h-9 w-9 shrink-0" aria-hidden />
            </li>

            {extraLinks.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-3 py-2 pr-2 sm:gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-400 [&_svg]:h-[18px] [&_svg]:w-[18px]">
                  <LinkIcon />
                </span>
                <input
                  type="url"
                  value={row.url}
                  onChange={(e) =>
                    setExtraLinks((list) =>
                      list.map((x) => (x.id === row.id ? { ...x, url: e.target.value } : x)),
                    )
                  }
                  placeholder={t("additionalLinkPlaceholder")}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-gray-500"
                  aria-label={t("additionalLinkAria")}
                />
                <button
                  type="button"
                  onClick={() => removeExtra(row.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-[var(--tott-dash-control-hover)] hover:text-foreground"
                  aria-label={t("removeLinkAria")}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}

            <li>
              <button
                type="button"
                onClick={addExtraLink}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-[var(--tott-card-border)] bg-transparent px-3 py-3 text-left text-sm text-gray-400 transition-colors hover:border-[#C9A96E]/50 hover:text-foreground"
              >
                <span>{t("addNewLink")}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-md text-[#C9A96E]">
                  <PlusIcon />
                </span>
              </button>
            </li>
          </ul>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
            {error}
          </div>
        ) : null}

        <div className="mt-10">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={submitting}
            className="w-full rounded-lg py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: theme.accentGold }}
          >
            {submitting ? t("saving") : savedFlash ? t("saved") : t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
