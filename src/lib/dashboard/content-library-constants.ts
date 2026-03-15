import type { ComponentType } from "react";
import { MusicIcon } from "@/components/ui/icons";

export type ContentStatus = "Published" | "Draft" | "Flagged" | "Archived";

export type ContentItem = {
  id: string;
  title: string;
  type: string;
  typeIcon: ComponentType;
  author: string;
  status: ContentStatus;
  category: string;
  viewCount: number;
  created: string;
};

export const sampleContentItems: ContentItem[] = [
  {
    id: "1",
    title: "Exploring Modern Jazz",
    type: "Music",
    typeIcon: MusicIcon,
    author: "Nour sameer",
    status: "Published",
    category: "Music",
    viewCount: 127,
    created: "Feb 2, 2024",
  },
  {
    id: "2",
    title: "Exploring Modern Jazz",
    type: "Music",
    typeIcon: MusicIcon,
    author: "Nour sameer",
    status: "Draft",
    category: "Music",
    viewCount: 127,
    created: "Feb 2, 2024",
  },
  {
    id: "3",
    title: "Exploring Modern Jazz",
    type: "Music",
    typeIcon: MusicIcon,
    author: "Nour sameer",
    status: "Flagged",
    category: "Music",
    viewCount: 127,
    created: "Feb 2, 2024",
  },
  {
    id: "4",
    title: "Exploring Modern Jazz",
    type: "Music",
    typeIcon: MusicIcon,
    author: "Nour sameer",
    status: "Archived",
    category: "Music",
    viewCount: 127,
    created: "Feb 2, 2024",
  },
];

export const CONTENT_TYPES = ["All Types", "Music", "Article", "Video", "Podcast"] as const;
export const CONTENT_CATEGORIES = ["All Categories", "Music", "Culture", "News", "Opinion"] as const;
