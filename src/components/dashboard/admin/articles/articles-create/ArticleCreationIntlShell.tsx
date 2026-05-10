"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { theme } from "@/lib/theme";

const STORAGE_KEY = "tott-article-creation-ui-locale";

function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

function ArticleCreationLanguageBar({
  creationLocale,
  onSelect,
}: {
  creationLocale: AppLocale;
  onSelect: (locale: AppLocale) => void;
}) {
  const t = useTranslations("Dashboard.articles.create");
  const segment =
    "min-w-[4.5rem] rounded-md px-3 py-1.5 text-xs font-medium transition-colors select-none";
  const inactive =
    "text-gray-500 hover:bg-[var(--tott-dash-ghost-hover)] hover:text-foreground dark:text-gray-400";
  const active = "text-black";

  return (
    <div className="mb-4 flex flex-wrap items-center justify-end gap-2 border-b border-[var(--tott-card-border)] pb-3">
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-xs font-medium text-foreground">{t("uiLanguage.label")}</span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">{t("uiLanguage.hint")}</span>
      </div>
      <div
        className="inline-flex gap-0.5 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] p-0.5"
        role="group"
        aria-label={t("uiLanguage.label")}
      >
        <button
          type="button"
          className={`${segment} ${creationLocale === "en" ? active : inactive}`}
          style={creationLocale === "en" ? { backgroundColor: theme.accentGold } : undefined}
          onClick={() => onSelect("en")}
        >
          {t("uiLanguage.en")}
        </button>
        <button
          type="button"
          className={`${segment} ${creationLocale === "ar" ? active : inactive}`}
          style={creationLocale === "ar" ? { backgroundColor: theme.accentGold } : undefined}
          onClick={() => onSelect("ar")}
        >
          {t("uiLanguage.ar")}
        </button>
      </div>
    </div>
  );
}

type ArticleCreationIntlShellProps = {
  routeLocale: AppLocale;
  messagesEn: AbstractIntlMessages;
  messagesAr: AbstractIntlMessages;
  children: React.ReactNode;
};

export function ArticleCreationIntlShell({
  routeLocale,
  messagesEn,
  messagesAr,
  children,
}: ArticleCreationIntlShellProps) {
  const [creationLocale, setCreationLocale] = useState<AppLocale>(routeLocale);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && isAppLocale(raw)) setCreationLocale(raw);
    } catch {
      /* ignore */
    }
  }, []);

  const messages = useMemo(
    () => (creationLocale === "ar" ? messagesAr : messagesEn),
    [creationLocale, messagesAr, messagesEn],
  );

  const onSelect = useCallback((locale: AppLocale) => {
    setCreationLocale(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, []);

  const dir = creationLocale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={creationLocale} messages={messages}>
      <div lang={creationLocale} dir={dir} className="min-w-0">
        <ArticleCreationLanguageBar creationLocale={creationLocale} onSelect={onSelect} />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
