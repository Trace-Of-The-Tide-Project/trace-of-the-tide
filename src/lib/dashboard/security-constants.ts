import type { ComponentType } from "react";
import {
  ShieldIcon,
  UsersIcon,
  ActivityIcon,
  AlertTriangleIcon,
} from "@/components/ui/icons";

export type SecurityStatItem = {
  id: string;
  icon: ComponentType;
  label: string;
  value: string;
};

export const securityStats: SecurityStatItem[] = [
  { id: "status", icon: ShieldIcon, label: "System Status", value: "Secure" },
  { id: "admins", icon: UsersIcon, label: "Admin Users", value: "14" },
  { id: "sessions", icon: ActivityIcon, label: "Active Sessions", value: "4" },
  { id: "alerts", icon: AlertTriangleIcon, label: "Security Alerts", value: "1" },
];

export type SecurityAdminRoleRow = {
  id: string;
  configureTitle: string;
  title: string;
  description: string;
  userBadge: string;
};

export const securityAdminRoles: SecurityAdminRoleRow[] = [
  {
    id: "super",
    configureTitle: "Super Admin",
    title: "Super Admin",
    description: "Full access.",
    userBadge: "2 users",
  },
  {
    id: "finance",
    configureTitle: "Finance Admin",
    title: "Finance Admin",
    description: "Financial operations.",
    userBadge: "2 users",
  },
  {
    id: "content",
    configureTitle: "Content Admin",
    title: "Content Admin",
    description: "Content management.",
    userBadge: "2 users",
  },
  {
    id: "support",
    configureTitle: "Support Admin",
    title: "Support Admin",
    description: "User support & moderation.",
    userBadge: "2 users",
  },
];

export type ActiveSessionRow = {
  id: string;
  user: string;
  device: string;
  location: string;
  lastActive: string;
};

/** Legacy compact list (optional reuse). */
export const sampleActiveSessions: ActiveSessionRow[] = [
  {
    id: "s1",
    user: "You (current)",
    device: "Chrome · Windows",
    location: "Amman, JO",
    lastActive: "Now",
  },
  {
    id: "s2",
    user: "m.chen@example.com",
    device: "Safari · macOS",
    location: "London, UK",
    lastActive: "12 min ago",
  },
  {
    id: "s3",
    user: "admin@traceofthetide.com",
    device: "Firefox · Linux",
    location: "Berlin, DE",
    lastActive: "1 hour ago",
  },
  {
    id: "s4",
    user: "support@traceofthetide.com",
    device: "Edge · Windows",
    location: "New York, US",
    lastActive: "3 hours ago",
  },
];

export type AdminSessionTableRow = {
  id: string;
  user: string;
  ip: string;
  location: string;
  device: string;
  lastActive: string;
  status: "current" | "active" | "idle";
};

export const adminSessionTableRows: AdminSessionTableRow[] = [
  {
    id: "t1",
    user: "Super Admin",
    ip: "192.168.1.1",
    location: "Gaza, PS",
    device: "Chrome / Windows",
    lastActive: "Just now",
    status: "current",
  },
  {
    id: "t2",
    user: "Content Admin",
    ip: "192.168.1.42",
    location: "Amman, JO",
    device: "Safari / macOS",
    lastActive: "8 min ago",
    status: "active",
  },
  {
    id: "t3",
    user: "Finance Admin",
    ip: "10.0.0.12",
    location: "London, UK",
    device: "Edge / Windows",
    lastActive: "42 min ago",
    status: "idle",
  },
  {
    id: "t4",
    user: "Support Admin",
    ip: "172.16.0.5",
    location: "Berlin, DE",
    device: "Firefox / Linux",
    lastActive: "2 hours ago",
    status: "idle",
  },
];

export type SecurityLogEntry = {
  id: string;
  title: string;
  meta: string;
  timeAgo: string;
  variant: "success" | "warning";
};

export const securityLogEntries: SecurityLogEntry[] = [
  {
    id: "l1",
    title: "Login successful",
    meta: "Super Admin • 192.168.1.1",
    timeAgo: "2 min ago",
    variant: "success",
  },
  {
    id: "l2",
    title: "Password changed",
    meta: "Content Admin • 192.168.1.45",
    timeAgo: "1 hour ago",
    variant: "success",
  },
  {
    id: "l3",
    title: "Failed login attempt",
    meta: "Unknown • 203.0.113.88",
    timeAgo: "3 hours ago",
    variant: "warning",
  },
  {
    id: "l4",
    title: "API key rotated",
    meta: "Super Admin • 192.168.1.1",
    timeAgo: "Yesterday",
    variant: "success",
  },
  {
    id: "l5",
    title: "Role updated",
    meta: "Super Admin • Sarah Adam → Editor",
    timeAgo: "2 days ago",
    variant: "success",
  },
];
