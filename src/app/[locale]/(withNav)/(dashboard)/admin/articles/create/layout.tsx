import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { AbstractIntlMessages } from "next-intl";
import { ArticleCreationIntlShell } from "@/components/dashboard/admin/articles/articles-create/ArticleCreationIntlShell";
import { loadMessages } from "@/i18n/load-messages";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export default async function AdminArticlesCreateLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const routeLocale = locale as AppLocale;
  const [messagesEn, messagesAr] = await Promise.all([
    loadMessages("en"),
    loadMessages("ar"),
  ]);

  return (
    <ArticleCreationIntlShell
      routeLocale={routeLocale}
      messagesEn={messagesEn as AbstractIntlMessages}
      messagesAr={messagesAr as AbstractIntlMessages}
    >
      {children}
    </ArticleCreationIntlShell>
  );
}
