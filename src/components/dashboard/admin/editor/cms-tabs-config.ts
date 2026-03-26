import type { ComponentType } from "react";
import { HomeIcon, FileTextIcon, LinkIcon, PaletteIcon } from "@/components/ui/icons";

export type CmsTabId = "home" | "static" | "nav" | "branding";

export const CMS_TABS: { id: CmsTabId; label: string; icon?: ComponentType }[] = [
  { id: "home", label: "Home Page", icon: HomeIcon },
  { id: "static", label: "Static Pages", icon: FileTextIcon },
  { id: "nav", label: "Navigations & Footer", icon: LinkIcon },
  { id: "branding", label: "Branding", icon: PaletteIcon },
];
