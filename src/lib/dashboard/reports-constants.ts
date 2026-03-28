export type ReportItem = {
  id: string;
  title: string;
  timeAgo: string;
  reporter: string;
  typeLabel: "Comment" | "Content";
  status: "Pending" | "Under review";
};

export type ReportedUserItem = {
  id: string;
  avatarInitial: string;
  displayName: string;
  email: string;
  reportCount: number;
  reasonSummary: string;
  timeAgo: string;
  status: "Pending" | "Under review";
};

export const sampleReportedUsers: ReportedUserItem[] = [
  {
    id: "u1",
    avatarInitial: "A",
    displayName: "Suspicious Account",
    email: "suspicious@temp.com",
    reportCount: 5,
    reasonSummary: "Multiple spam reports",
    timeAgo: "3 hours ago",
    status: "Pending",
  },
  {
    id: "u2",
    avatarInitial: "A",
    displayName: "Suspicious Account",
    email: "suspicious@temp.com",
    reportCount: 5,
    reasonSummary: "Multiple spam reports",
    timeAgo: "3 hours ago",
    status: "Pending",
  },
];

export type AuditLogEntry = {
  id: string;
  title: string;
  /** e.g. "by Super Admin • Spam User…" */
  meta: string;
  timeAgo: string;
};

export const sampleAuditLog: AuditLogEntry[] = [
  {
    id: "a1",
    title: "User suspended",
    meta: "by Super Admin • Spam User…",
    timeAgo: "1 hour ago",
  },
  {
    id: "a2",
    title: "Article hidden from feed",
    meta: "by Content Admin • Flagged Article…",
    timeAgo: "3 hours ago",
  },
  {
    id: "a3",
    title: "User warned",
    meta: "by Super Admin • Ali Adam…",
    timeAgo: "5 hours ago",
  },
  {
    id: "a4",
    title: "Report dismissed",
    meta: "by Support Admin • False Report #123",
    timeAgo: "Yesterday",
  },
  {
    id: "a5",
    title: "Role updated",
    meta: "by Super Admin • Sarah Adam → Editor…",
    timeAgo: "2 days ago",
  },
];

export const sampleReports: ReportItem[] = [
  {
    id: "r1",
    title: "Inappropriate language in comments",
    timeAgo: "2 hours ago",
    reporter: "Maria Qais",
    typeLabel: "Comment",
    status: "Pending",
  },
  {
    id: "r2",
    title: "Inappropriate language in comments",
    timeAgo: "1 day ago",
    reporter: "Maria Qais",
    typeLabel: "Content",
    status: "Under review",
  },
  {
    id: "r3",
    title: "Inappropriate language in comments",
    timeAgo: "2 days ago",
    reporter: "Maria Qais",
    typeLabel: "Comment",
    status: "Pending",
  },
];
