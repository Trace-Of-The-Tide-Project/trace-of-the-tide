/** Title-case role slug for pills and export (e.g. `editor` → Editor). */
export function formatUserRoleLabel(role: string): string {
  const s = role.trim().toLowerCase();
  if (!s) return "User";
  return s
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatUserStatusLabel(status: string): string {
  const s = status.trim().toLowerCase();
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** e.g. Jan 15, 2024 */
export function formatUserJoinedDate(iso: string | null | undefined): string {
  if (!iso?.trim()) return "—";
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Relative time for “last active” (uses fixed `nowMs` for CSV export). */
export function formatUserLastActiveRelative(iso: string | null | undefined, nowMs: number): string {
  if (!iso?.trim()) return "—";
  const t = Date.parse(iso.trim());
  if (!Number.isFinite(t)) return "—";
  const diff = Math.max(0, nowMs - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  const week = Math.floor(day / 7);
  if (day < 30) return `${week} week${week === 1 ? "" : "s"} ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} month${month === 1 ? "" : "s"} ago`;
  const year = Math.floor(day / 365);
  return `${Math.max(1, year)} year${year === 1 ? "" : "s"} ago`;
}

export function formatContributionsCount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  return String(Math.trunc(n));
}
