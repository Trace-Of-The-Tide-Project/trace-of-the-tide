/**
 * HTML `datetime-local` values are interpreted in the user's local timezone.
 * Returns true if `end` is strictly before `start` (invalid range).
 */
export function isEndDatetimeBeforeStart(end: string, start: string): boolean {
  if (!end.trim() || !start.trim()) return false;
  const te = new Date(end).getTime();
  const ts = new Date(start).getTime();
  if (Number.isNaN(te) || Number.isNaN(ts)) return false;
  return te < ts;
}
