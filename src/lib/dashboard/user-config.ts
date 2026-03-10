import {
  LayoutDashboardIcon,
  FileTextIcon,
  PenLineIcon,
  HeartHandshakeIcon,
  UsersIcon,
  BarChartIcon,
  SettingsIcon,
  PersonIcon,
  EyeIcon,
  BellIcon,
  ShieldIcon,
  LockIcon,
  UserCheckIcon,
} from "@/components/ui/icons";
import type { DashboardConfig } from "./types";

export const userConfig: DashboardConfig = {
  basePath: "/profile",
  sections: [
    {
      items: [
        {
          kind: "item",
          label: "Main Dashboard",
          href: "/profile",
          icon: LayoutDashboardIcon,
        },
        {
          kind: "group",
          label: "Articles",
          icon: FileTextIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "All Articles",
              href: "/profile/articles",
              icon: FileTextIcon,
            },
            {
              kind: "item",
              label: "Create Articles",
              href: "/profile/articles/create",
              icon: PenLineIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "Contributions",
          icon: HeartHandshakeIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Supporters",
              href: "/profile/supporters",
              icon: UsersIcon,
            },
            {
              kind: "item",
              label: "Analytics",
              href: "/profile/analytics",
              icon: BarChartIcon,
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          kind: "group",
          label: "Settings",
          icon: SettingsIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Profile",
              href: "/profile/settings",
              icon: PersonIcon,
            },
            {
              kind: "item",
              label: "Availability",
              href: "/profile/settings/availability",
              icon: EyeIcon,
            },
            {
              kind: "item",
              label: "Notifications",
              href: "/profile/settings/notifications",
              icon: BellIcon,
            },
            {
              kind: "item",
              label: "Privacy",
              href: "/profile/settings/privacy",
              icon: ShieldIcon,
            },
            {
              kind: "item",
              label: "Password",
              href: "/profile/settings/password",
              icon: LockIcon,
            },
            {
              kind: "item",
              label: "Account",
              href: "/profile/settings/account",
              icon: UserCheckIcon,
            },
          ],
        },
      ],
    },
  ],
};
