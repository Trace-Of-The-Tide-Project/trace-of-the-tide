/** Dispatched from Users page header; handled in UsersManagementContent. */
export const USERS_CSV_EXPORT_EVENT = "trace-of-the-tide:users-csv-export";

export function requestUsersCsvExport(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(USERS_CSV_EXPORT_EVENT));
}
