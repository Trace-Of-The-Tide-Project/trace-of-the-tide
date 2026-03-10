import {
  LayoutDashboardIcon,
  FileTextIcon,
  PenLineIcon,
  HeartHandshakeIcon,
  UsersIcon,
  ShieldIcon,
  FolderIcon,
  CodeIcon,
  MessageSquareIcon,
  DollarSignIcon,
  BarChartIcon,
  AlertTriangleIcon,
  LockIcon,
  SettingsIcon,
  PersonIcon,
  EyeIcon,
  BellIcon,
  UserCheckIcon,
} from "@/components/ui/icons";
import type { DashboardConfig } from "./types";

export const adminConfig: DashboardConfig = {
  basePath: "/admin",
  sections: [
    {
      items: [
        {
          kind: "item",
          label: "Main Dashboard",
          href: "/admin",
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
              href: "/admin/articles",
              icon: FileTextIcon,
            },
            {
              kind: "item",
              label: "Create Articles",
              href: "/admin/articles/create",
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
              href: "/admin/supporters",
              icon: UsersIcon,
            },
            {
              kind: "item",
              label: "Analytics",
              href: "/admin/contributions-analytics",
              icon: BarChartIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "Management",
          icon: UsersIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Users",
              href: "/admin/users",
              icon: UsersIcon,
              badge: "12.4k",
            },
            {
              kind: "item",
              label: "Roles & Permissions",
              href: "/admin/roles",
              icon: ShieldIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "CONTENT",
          icon: FolderIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Content Library",
              href: "/admin/content",
              icon: FolderIcon,
            },
            {
              kind: "item",
              label: "Visual Editor (CMS)",
              href: "/admin/editor",
              icon: CodeIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "Community",
          icon: HeartHandshakeIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Engagements",
              href: "/admin/engagements",
              icon: HeartHandshakeIcon,
            },
            {
              kind: "item",
              label: "Messaging",
              href: "/admin/messaging",
              icon: MessageSquareIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "Business",
          icon: DollarSignIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Finance & Payout",
              href: "/admin/finance",
              icon: DollarSignIcon,
            },
            {
              kind: "item",
              label: "Analytics",
              href: "/admin/analytics",
              icon: BarChartIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "SYSTEM Settings",
          icon: SettingsIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Reports & Moderations",
              href: "/admin/reports",
              icon: AlertTriangleIcon,
              badge: 8,
            },
            {
              kind: "item",
              label: "Security & Auth",
              href: "/admin/security",
              icon: LockIcon,
            },
            {
              kind: "item",
              label: "System Settings",
              href: "/admin/settings",
              icon: SettingsIcon,
            },
          ],
        },
        {
          kind: "group",
          label: "Admin Settings",
          icon: SettingsIcon,
          defaultOpen: true,
          items: [
            {
              kind: "item",
              label: "Profile",
              href: "/admin/profile",
              icon: PersonIcon,
            },
            {
              kind: "item",
              label: "Availability",
              href: "/admin/availability",
              icon: EyeIcon,
            },
            {
              kind: "item",
              label: "Notifications",
              href: "/admin/notifications",
              icon: BellIcon,
            },
            {
              kind: "item",
              label: "Privacy",
              href: "/admin/privacy",
              icon: ShieldIcon,
            },
            {
              kind: "item",
              label: "Password",
              href: "/admin/password",
              icon: LockIcon,
            },
            {
              kind: "item",
              label: "Account",
              href: "/admin/account",
              icon: UserCheckIcon,
            },
          ],
        },
      ],
    },
  ],
};
