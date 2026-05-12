"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import { getUserById, updateUser, type AdminUserStatus } from "@/services/users.service";

const inputWrapClass =
  "rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] focus-within:border-[#C9A96E]";
const inputClass =
  "w-full rounded-lg border-0 bg-transparent py-3 px-4 text-sm text-foreground placeholder:text-gray-500 outline-none";
const selectClass =
  "w-full cursor-pointer appearance-none rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] py-3 pl-4 pr-10 text-sm text-foreground outline-none focus:border-[#C9A96E]";

const EDITABLE_STATUSES = ["active", "suspended", "inactive"] as const;

type EditableUserStatus = (typeof EDITABLE_STATUSES)[number];

function isEditableUserStatus(value: string): value is EditableUserStatus {
  return (EDITABLE_STATUSES as readonly string[]).includes(value);
}

function resolveEditableStatus(status: string): EditableUserStatus {
  const normalized = status.trim().toLowerCase();
  return isEditableUserStatus(normalized) ? normalized : "active";
}

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
      const errs = o.errors;
      if (Array.isArray(errs) && errs.length > 0 && typeof errs[0] === "string") return errs.join(" ");
    }
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

function normalizeRouteUserId(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value?.trim()) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

export function EditUserPageContent() {
  const t = useTranslations("Dashboard.usersManagement.editUserPage");
  const tStatus = useTranslations("Dashboard.usersManagement.statusLabels");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = normalizeRouteUserId(params.id);

  const baseId = useId();
  const fullNameId = `${baseId}-fullName`;
  const statusId = `${baseId}-status`;

  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<EditableUserStatus>("active");
  const [originalFullName, setOriginalFullName] = useState("");
  const [originalStatus, setOriginalStatus] = useState<EditableUserStatus>("active");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoadError(t("errors.loadFailed"));
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setSuccess(false);
    setError(null);

    void (async () => {
      try {
        const user = await getUserById(userId);
        if (cancelled) return;
        const nextFullName = user.full_name;
        const nextStatus = resolveEditableStatus(user.status);
        setFullName(nextFullName);
        setStatus(nextStatus);
        setOriginalFullName(nextFullName);
        setOriginalStatus(nextStatus);
        setUsername(user.username);
        setEmail(user.email);
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
  }, [t, userId]);

  const statusOptions = useMemo(
    () =>
      EDITABLE_STATUSES.map((value) => ({
        value,
        label: tStatus(value),
      })),
    [tStatus],
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);
      if (!fullName.trim()) {
        setError(t("errors.required"));
        return;
      }

      const nextFullName = fullName.trim();
      const payload: {
        full_name?: string;
        status?: Exclude<AdminUserStatus, "pending">;
      } = {};

      if (nextFullName !== originalFullName.trim()) {
        payload.full_name = nextFullName;
      }
      if (status !== originalStatus) {
        payload.status = status as Exclude<AdminUserStatus, "pending">;
      }
      if (Object.keys(payload).length === 0) {
        setError(t("errors.noChanges"));
        return;
      }

      setSubmitting(true);
      try {
        await updateUser(userId, payload);
        setOriginalFullName(nextFullName);
        setOriginalStatus(status);
        setSuccess(true);
      } catch (err) {
        setError(userErrMessage(err, t("errors.updateFailed")));
      } finally {
        setSubmitting(false);
      }
    },
    [fullName, originalFullName, originalStatus, status, t, userId],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-3 py-12 text-center text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
        {t("loading")}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          {loadError}
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="text-sm font-medium underline hover:no-underline"
          style={{ color: theme.accentGold }}
        >
          {t("backToList")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <p className="text-sm text-gray-500">{t("intro")}</p>

      <div className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-3 text-sm">
        <p className="text-foreground">
          <span className="text-gray-500">{t("username")}: </span>
          {username || "—"}
        </p>
        <p className="mt-1 text-foreground">
          <span className="text-gray-500">{t("email")}: </span>
          {email || "—"}
        </p>
      </div>

      {success ? (
        <div
          className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
          role="status"
        >
          <p className="font-medium">{t("successTitle")}</p>
          <p className="mt-1 text-emerald-200/90">{t("successHint")}</p>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="mt-3 text-sm font-medium underline hover:no-underline"
            style={{ color: theme.accentGold }}
          >
            {t("viewUsersList")}
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor={fullNameId} className="mb-1.5 block text-xs text-gray-500">
            {t("fullName")}
          </label>
          <div className={inputWrapClass}>
            <input
              id={fullNameId}
              type="text"
              name="full_name"
              autoComplete="name"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              placeholder={t("fullNamePlaceholder")}
              className={inputClass}
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor={statusId} className="mb-1.5 block text-xs text-gray-500">
            {t("status")}
          </label>
          <div className="relative">
            <select
              id={statusId}
              name="status"
              value={status}
              onChange={(ev) => {
                const next = ev.target.value;
                if (isEditableUserStatus(next)) setStatus(next);
              }}
              className={selectClass}
              disabled={submitting}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "#C9A96E" }}
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
