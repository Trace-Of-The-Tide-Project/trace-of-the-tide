"use client";

import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import type { ArticleCardAction } from "./ArticleCard";
import type { ReactNode } from "react";

export type ArticleCardItem = {
  id: string;
  icon: ReactNode;
  statusLabel: string;
  title: string;
  subtitle: string;
  views?: string;
  actions: ArticleCardAction[];
  useHexIcon?: boolean;
  compact?: boolean;
};

type ArticleCardsSectionProps = {
  title?: string;
  items: ArticleCardItem[];
  viewAllHref?: string;
  hideTitle?: boolean;
  /** Use smaller gap between cards (e.g. for compact scheduled items) */
  compactGap?: boolean;
};

export function ArticleCardsSection({
  title = "",
  items,
  viewAllHref,
  hideTitle = false,
  compactGap = false,
}: ArticleCardsSectionProps) {
  return (
    <div>
      {(title || viewAllHref) && (
        <div className="mb-4 flex items-center justify-between">
          {!hideTitle && title ? (
            <h3 className="text-lg font-bold text-white">{title}</h3>
          ) : (
            <span />
          )}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              View all
            </Link>
          )}
        </div>
      )}

      <div className={`flex flex-col ${compactGap ? "gap-3" : "gap-6"}`}>
        {items.map((item) => (
          <ArticleCard
            key={item.id}
            icon={item.icon}
            statusLabel={item.statusLabel}
            title={item.title}
            subtitle={item.subtitle}
            views={item.views}
            actions={item.actions}
            useHexIcon={item.useHexIcon}
            compact={item.compact}
          />
        ))}
      </div>
    </div>
  );
}
