"use client";

import { useState } from "react";
import Image from "next/image";
import { theme } from "@/lib/theme";
import { ShareYourStory } from "@/components/contribute/ShareYourStory";
import { ContentBreadcrumb } from "./ContentBreadcrumb";
import { ContentArticleHeader } from "./ContentArticleHeader";
import { ContentArticleBody } from "./ContentArticleBody";
import { ContentAuthorCard } from "./ContentAuthorCard";
import { ContentCollection } from "./ContentCollection";
import { RelatedContent } from "./RelatedContent";
import type { RelatedContentCardData } from "./RelatedContentCard";

export type ThreadEntry = {
  image: string;
  title: string;
  edition?: string;
  category?: string;
  publishedDate?: string;
  readingTime?: string;
  sections: { heading?: string; paragraphs: string[]; quote?: string }[];
};

type ThreadsPageLayoutProps = {
  breadcrumbs: { label: string; href?: string }[];
  mainTitle: string;
  mainPublishedDate?: string;
  mainReadingTime?: string;
  entries: ThreadEntry[];
  initialVisibleCount?: number;
  loadMoreCount?: number;
  author: {
    name: string;
    initials: string;
    link?: string;
    color?: string;
  };
  collection: {
    articleCount: number;
    duration: string;
    items: {
      image: string;
      title: string;
      author: string;
      date: string;
      description: string;
    }[];
  };
  relatedContent: RelatedContentCardData[];
};

export function ThreadsPageLayout({
  breadcrumbs,
  mainTitle,
  mainPublishedDate,
  mainReadingTime,
  entries,
  initialVisibleCount = 2,
  loadMoreCount = 2,
  author,
  collection,
  relatedContent,
}: ThreadsPageLayoutProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;
  const remaining = entries.length - visibleCount;

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + loadMoreCount, entries.length));
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: theme.bgDark }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-4 sm:px-10">
        <ContentBreadcrumb items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
          {/* Left — timeline */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Main timeline title + meta */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
                {mainTitle}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
                {mainPublishedDate && (
                  <>
                    <span>Published: {mainPublishedDate}</span>
                    <span className="text-gray-600">·</span>
                  </>
                )}
                {mainReadingTime && <span>{mainReadingTime}</span>}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-1">
          {/* Vertical dotted line — centered in number column */}
          <div
            className="absolute left-3 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-600"
            aria-hidden
          />

          <ul className="space-y-12">
            {visibleEntries.map((entry, index) => (
              <li key={index} className="relative flex gap-6">
                {/* Number column: line runs through center */}
                <div className="relative z-10 flex w-6 shrink-0 items-start justify-center pt-0.5">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: theme.accentGold }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Content block */}
                <div className="min-w-0 flex-1">
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#1a1a1a] sm:max-w-2xl">
                      <Image
                        src={entry.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 672px"
                      />
                    </div>
                    <ContentArticleHeader
                      title={entry.title}
                      edition={entry.edition}
                      category={entry.category}
                      publishedDate={entry.publishedDate}
                      readingTime={entry.readingTime}
                    />
                    <ContentArticleBody sections={entry.sections} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Show more */}
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={showMore}
                className="rounded-lg px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accentGold }}
              >
                Show more
                {remaining > 0 && ` (${remaining} left)`}
              </button>
            </div>
          )}
            </div>
          </div>

          {/* Right — sidebar: author only, no contributors */}
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-6 lg:w-[24rem] lg:self-start">
            <div
              className="rounded-2xl border border-gray-800 p-5"
              style={{ backgroundColor: theme.bgDark }}
            >
              <ContentAuthorCard {...author} />
            </div>
            <ContentCollection {...collection} />
          </aside>
        </div>
      </div>

      <RelatedContent items={relatedContent} />
      <ShareYourStory />
    </div>
  );
}
