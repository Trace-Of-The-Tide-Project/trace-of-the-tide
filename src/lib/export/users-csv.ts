import type { AdminUserListItem } from "@/services/users.service";
import {
  formatContributionsCount,
  formatUserJoinedDate,
  formatUserLastActiveRelative,
  formatUserRoleLabel,
  formatUserStatusLabel,
} from "@/lib/dashboard/user-table-formatters";

function csvCell(value: string): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const HEADERS = [
  "Contributor",
  "Email",
  "Role",
  "Status",
  "Joined",
  "Last active",
  "Contributions",
] as const;

/** UTF-8 with BOM so Excel opens special characters correctly. */
export function buildUsersCsv(users: AdminUserListItem[], exportedAtMs = Date.now()): string {
  const lines = [HEADERS.join(",")];
  for (const u of users) {
    const name =
      u.full_name?.trim() || u.username?.trim() || "—";
    lines.push(
      [
        csvCell(name),
        csvCell(u.email),
        csvCell(formatUserRoleLabel(u.role)),
        csvCell(formatUserStatusLabel(u.status)),
        csvCell(formatUserJoinedDate(u.joined_at)),
        csvCell(formatUserLastActiveRelative(u.last_active_at, exportedAtMs)),
        csvCell(formatContributionsCount(u.contributions_count)),
      ].join(","),
    );
  }
  return `\uFEFF${lines.join("\r\n")}`;
}

export function downloadUsersCsv(users: AdminUserListItem[], filenameBase = "users-export"): void {
  const csv = buildUsersCsv(users);
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const filename = `${filenameBase}-${stamp}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
