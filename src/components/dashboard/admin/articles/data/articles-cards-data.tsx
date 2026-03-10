"use client";

import {
  FileTextIcon,
  ChevronRightIcon,
  ContributeIcon,
  SquareCheckIcon,
  XIcon,
  ShareIcon,
  EyeIcon,
} from "@/components/ui/icons";
import type { ArticleCardItem } from "../articles-main/ArticleCardsSection";

export const draftedArticleCards: ArticleCardItem[] = [
  {
    id: "d1",
    icon: <FileTextIcon />,
    statusLabel: "Drafted Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "2 hours ago",
    useHexIcon: true,
    compact: true,
    actions: [
      {
        label: "Continue Writing",
        icon: <ChevronRightIcon />,
        href: "/admin/articles/create",
      },
    ],
  },
  {
    id: "d2",
    icon: <FileTextIcon />,
    statusLabel: "Drafted Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "5 hours ago",
    useHexIcon: true,
    compact: true,
    actions: [
      {
        label: "Continue Writing",
        icon: <ChevronRightIcon />,
        href: "/admin/articles/create",
      },
    ],
  },
];

/** Scheduled articles with icon-only buttons (Stats, Delete) */
export const scheduledWithIconButtons: ArticleCardItem[] = [
  {
    id: "s1",
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "January 22, 2025",
    useHexIcon: true,
    compact: true,
    actions: [
      { icon: <ContributeIcon />, ariaLabel: "Stats", onClick: () => {} },
      { icon: <XIcon />, ariaLabel: "Delete", onClick: () => {} },
    ],
  },
  {
    id: "s6",
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "January 22, 2025",
    useHexIcon: true,
    compact: true,
    actions: [
      { icon: <ContributeIcon />, ariaLabel: "Stats", onClick: () => {} },
      { icon: <XIcon />, ariaLabel: "Delete", onClick: () => {} },
    ],
  },
];

/** Scheduled articles with Share and View buttons */
export const scheduledWithShareView: ArticleCardItem[] = [
  {
    id: "s2",
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "January 22, 2025",
    views: "1,234",
    useHexIcon: true,
    compact: true,
    actions: [
      { label: "Share", icon: <ShareIcon />, onClick: () => {} },
      { label: "View", icon: <EyeIcon />, href: "#" },
    ],
  },
  {
    id: "s3",
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "January 22, 2025",
    views: "1,234",
    useHexIcon: true,
    compact: true,
    actions: [
      { label: "Share", icon: <ShareIcon />, onClick: () => {} },
      { label: "View", icon: <EyeIcon />, href: "#" },
    ],
  },
  {
    id: "s4",
    icon: <SquareCheckIcon />,
    statusLabel: "Scheduled Article",
    title: "British Restrict Jewish Immigration to Palestine",
    subtitle: "January 22, 2025",
    views: "1,234",
    useHexIcon: true,
    compact: true,
    actions: [
      { label: "Share", icon: <ShareIcon />, onClick: () => {} },
      { label: "View", icon: <EyeIcon />, href: "#" },
    ],
  },
];
