"use client";

import { Suspense } from "react";
import {
  ArticlesTable,
  ArticleCardsSection,
} from "@/components/dashboard/admin/articles/articles-main";
import {
  draftedArticleCards,
  scheduledWithIconButtons,
  scheduledWithShareView,
} from "@/components/dashboard/admin/articles/data/articles-cards-data";
import { articleTabs, articlesTableData } from "@/lib/dashboard/articles-constants";

export default function AdminArticlesPage() {
  return (
    <div className="space-y-8 my-4 mx-10">
      <Suspense
        fallback={
          <div className="rounded-lg border border-[#444444] px-5 py-12 text-center text-sm text-gray-500">
            Loading articles…
          </div>
        }
      >
        <ArticlesTable
          tabs={articleTabs}
          rows={articlesTableData}
          addNewHref="/admin/articles/create"
        />
      </Suspense>

      <ArticleCardsSection
        title="Drafted Articles"
        items={draftedArticleCards}
        viewAllHref="/admin/articles?tab=drafts"
        compactGap
      />

      <ArticleCardsSection
        title="Scheduled Articles"
        items={scheduledWithIconButtons}
        viewAllHref="/admin/articles?tab=scheduled"
        compactGap
      />

      <ArticleCardsSection
        items={scheduledWithShareView}
        viewAllHref="/admin/articles?tab=scheduled"
        hideTitle
        compactGap
      />
    </div>
  );
}
