"use client";

import {
  PenLineIcon,
  FilmIcon,
  MusicIcon,
  ThreadIcon,
  PaletteIcon,
  MapPinIcon,
  MegaphoneIcon,
} from "@/components/ui/icons";
import type { TemplateCardProps } from "../articles-create/TemplateCard";

const placeholderDesc = "Lorem ipsum dolor sit amet adipiscing elit s";

export const createTemplateFilters = [
  { id: "all", label: "Show all" },
  { id: "articles", label: "Articles" },
  { id: "films", label: "Films" },
  { id: "audio", label: "Audio" },
  { id: "thread", label: "Thread" },
  { id: "artwork", label: "Art work" },
];

export const createTemplates: (TemplateCardProps & { category: string })[] = [
  {
    number: "01",
    title: "Article",
    description: "Long-form written content with rich formatting",
    icon: <PenLineIcon />,
    href: "/admin/articles/create/article",
    category: "articles",
  },
  {
    number: "02",
    title: "Video",
    description: "Video content with description & context",
    icon: <FilmIcon />,
    href: "/admin/articles/create/video",
    category: "films",
  },
  {
    number: "03",
    title: "Audio",
    description: "Podcast, music, or audio storytelling",
    icon: <MusicIcon />,
    href: "/admin/articles/create/audio",
    category: "audio",
  },
  {
    number: "04",
    title: "Thread",
    description: "Sequential story or text series",
    icon: <ThreadIcon />,
    href: "/admin/articles/create/thread",
    category: "thread",
  },
  {
    number: "05",
    title: "Artwork",
    description: "Showcase photography, illustration, or design",
    icon: <PaletteIcon />,
    category: "artwork",
  },
  {
    number: "06",
    title: "Figma",
    description: placeholderDesc,
    icon: <PaletteIcon />,
    category: "artwork",
  },
  {
    number: "07",
    title: "Trip",
    description: "Plan and publish guided travel experiences",
    icon: <MapPinIcon />,
    href: "/admin/trips",
    category: "articles",
  },
  {
    number: "08",
    title: "Open Call",
    description: placeholderDesc,
    icon: <MegaphoneIcon />,
    href: "/admin/articles/create/open-call",
    category: "articles",
  },
];
