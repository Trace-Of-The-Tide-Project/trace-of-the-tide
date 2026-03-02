import type { ComponentType } from "react";

export type SidebarItemConfig = {
  kind: "item";
  label: string;
  href: string;
  icon: ComponentType;
  badge?: string | number;
};

export type SidebarGroupConfig = {
  kind: "group";
  label: string;
  icon: ComponentType;
  defaultOpen?: boolean;
  items: SidebarItemConfig[];
};

export type SidebarSectionConfig = {
  heading?: string;
  items: (SidebarItemConfig | SidebarGroupConfig)[];
};

export type DashboardConfig = {
  basePath: string;
  sections: SidebarSectionConfig[];
};
