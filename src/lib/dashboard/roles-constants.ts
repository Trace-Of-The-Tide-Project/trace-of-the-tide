import type { ComponentType } from "react";
import {
  UsersIcon,
  HeartHandshakeIcon,
  FileTextIcon,
  BarChartIcon,
  ShieldIcon,
  PersonIcon,
} from "@/components/ui/icons";

export type RoleStat = {
  id: string;
  icon: ComponentType;
  value: string;
  label: string;
};

export const roleStats: RoleStat[] = [
  { id: "users", icon: UsersIcon, value: "10,234", label: "Users" },
  { id: "contributors", icon: HeartHandshakeIcon, value: "1,543", label: "Contributors" },
  { id: "authors", icon: FileTextIcon, value: "589", label: "Authors" },
  { id: "editors", icon: BarChartIcon, value: "156", label: "Editors" },
  { id: "admins", icon: ShieldIcon, value: "24", label: "Admins" },
];

export type RoleHierarchyItem = {
  id: string;
  icon: ComponentType;
  label: string;
};

export const roleHierarchy: RoleHierarchyItem[] = [
  { id: "user", icon: PersonIcon, label: "User" },
  { id: "contributor", icon: HeartHandshakeIcon, label: "Contributor" },
  { id: "author", icon: FileTextIcon, label: "Author" },
  { id: "editor", icon: BarChartIcon, label: "Editor" },
  { id: "admin", icon: ShieldIcon, label: "Admin" },
];

export const MATRIX_ROLES = ["User", "Contributor", "Author", "Editor", "Admin"] as const;

export const PERMISSIONS = [
  "View Content",
  "Create Content",
  "Edit Own Content",
  "Edit All Content",
  "Delete Content",
  "Manage Users",
  "Manage Donations",
  "Access Analytics",
  "Moderate Content",
  "System Settings",
] as const;

export type EditorAppStatus = "pending" | "approved" | "rejected";

export type EditorApplication = {
  id: string;
  name: string;
  email: string;
  appliedAt: string; // e.g. "Feb 1, 2024"
  yearsInPublishing: number;
  publishedArticles: number;
  status: EditorAppStatus;
};

export const sampleEditorApplications: EditorApplication[] = [
  {
    id: "1",
    name: "Ahmed Sameer",
    email: "Ahmed-sameer@example.com",
    appliedAt: "Feb 1, 2024",
    yearsInPublishing: 5,
    publishedArticles: 12,
    status: "pending",
  },
  {
    id: "2",
    name: "Maria Chen",
    email: "maria.chen@example.com",
    appliedAt: "Jan 28, 2024",
    yearsInPublishing: 3,
    publishedArticles: 8,
    status: "pending",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "j.wilson@example.com",
    appliedAt: "Jan 15, 2024",
    yearsInPublishing: 7,
    publishedArticles: 24,
    status: "approved",
  },
  {
    id: "4",
    name: "Sofia Rodriguez",
    email: "sofia.r@example.com",
    appliedAt: "Jan 10, 2024",
    yearsInPublishing: 2,
    publishedArticles: 3,
    status: "rejected",
  },
];
