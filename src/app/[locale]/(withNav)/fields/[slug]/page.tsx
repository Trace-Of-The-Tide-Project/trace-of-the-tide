import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { publicContentHrefForDetail } from "@/lib/content/public-article-preview-href";
import { getArticleById, getArticles } from "@/services/articles.service";
async function resolveArticleId(slug: string): Promise<string | null> {
  const direct = await getArticleById(slug);
  if (direct?.id) return direct.id;

  try {
    const { data } = await getArticles({ limit: 200 });
    const match = data.find((a) => a.slug === slug);
    return match?.id ?? null;
  } catch {
    return null;
  }
}

export default async function FieldArticleSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const s = slug?.trim();
  if (!s) notFound();

  const id = await resolveArticleId(s);
  if (!id) notFound();

  const article = await getArticleById(id);
  if (!article) notFound();

  redirect({
    href: publicContentHrefForDetail(article),
    locale,
  });
}