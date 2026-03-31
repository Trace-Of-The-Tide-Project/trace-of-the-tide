import type { ComponentType } from "react";
import {
  PersonalStoryIcon,
  PenLineIcon,
  IdCardIcon,
  PaletteIcon,
  MusicIcon,
  BookIcon,
  CameraIcon,
  FileTextIcon,
  GlobeIcon,
} from "@/components/ui/icons";

export type ContributionTypeName =
  | "Personal Story"
  | "Testimony"
  | "Biography"
  | "Artwork"
  | "Music"
  | "Literature"
  | "Photography"
  | "History document"
  | "Other";

export const CONTRIBUTION_TYPE_ORDER: ContributionTypeName[] = [
  "Personal Story",
  "Testimony",
  "Biography",
  "Artwork",
  "Music",
  "Literature",
  "Photography",
  "History document",
  "Other",
];

export const CONTRIBUTION_TYPE_ICON_BY_NAME: Record<ContributionTypeName, ComponentType> = {
  "Personal Story": PersonalStoryIcon,
  Testimony: PenLineIcon,
  Biography: IdCardIcon,
  Artwork: PaletteIcon,
  Music: MusicIcon,
  Literature: BookIcon,
  Photography: CameraIcon,
  "History document": FileTextIcon,
  Other: GlobeIcon,
};

export function getContributionTypeIcon(name: string): ComponentType {
  return (
    (CONTRIBUTION_TYPE_ICON_BY_NAME as Record<string, ComponentType>)[name] ?? GlobeIcon
  );
}

