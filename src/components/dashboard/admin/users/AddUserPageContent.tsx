"use client";

import { useCallback, useId, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { EyeIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import { createUser } from "@/services/users.service";

const inputWrapClass =
  "rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] focus-within:border-[#C9A96E]";
const inputClass =
  "w-full rounded-lg border-0 bg-transparent py-3 px-4 text-sm text-foreground placeholder:text-gray-500 outline-none";

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function createUserErrMessage(e: unknown, fallback: string): string {
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

export function AddUserPageContent() {
  const t = useTranslations("Dashboard.usersManagement.addUserPage");
  const router = useRouter();
  const baseId = useId();
  const fullNameId = `${baseId}-fullName`;
  const emailId = `${baseId}-email`;
  const passwordId = `${baseId}-password`;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);
      if (!fullName.trim() || !email.trim() || !password) {
        setError(t("errors.required"));
        return;
      }
      setSubmitting(true);
      try {
        await createUser({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        });
        setSuccess(true);
        setFullName("");
        setEmail("");
        setPassword("");
      } catch (err) {
        setError(createUserErrMessage(err, t("errors.createFailed")));
      } finally {
        setSubmitting(false);
      }
    },
    [fullName, email, password, t],
  );

  return (
    <div className="mx-auto max-w-lg space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <p className="text-sm text-gray-500">{t("intro")}</p>

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
          <label htmlFor={emailId} className="mb-1.5 block text-xs text-gray-500">
            {t("email")}
          </label>
          <div className={inputWrapClass}>
            <input
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder={t("emailPlaceholder")}
              className={inputClass}
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor={passwordId} className="mb-1.5 block text-xs text-gray-500">
            {t("password")}
          </label>
          <div className={`relative flex items-center ${inputWrapClass}`}>
            <input
              id={passwordId}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={`${inputClass} pr-12`}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 transition-colors hover:bg-[var(--tott-dash-control-hover)] hover:text-foreground"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
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
