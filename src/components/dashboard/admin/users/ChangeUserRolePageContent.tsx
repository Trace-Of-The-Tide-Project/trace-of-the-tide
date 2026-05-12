"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";
import { formatUserRoleLabel } from "@/lib/dashboard/user-table-formatters";
import { theme } from "@/lib/theme";
import {
  assignUserRole,
  getRoles,
  getUserRoles,
  resolveRoleId,
  resolveRoleName,
  revokeUserRole,
  type RoleListItem,
  type UserRoleAssignment,
} from "@/services/roles.service";
import { getUserById } from "@/services/users.service";

const selectClass =
  "w-full cursor-pointer appearance-none rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] py-3 pl-4 pr-10 text-sm text-foreground outline-none focus:border-[#C9A96E]";

function normalizeRouteUserId(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value?.trim()) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function userErrMessage(e: unknown, fallback: string): string {
  if (isAxiosError(e)) {
    const d = e.response?.data;
    if (typeof d === "string" && d.trim()) return d;
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      const nested = o.data;
      if (nested && typeof nested === "object") {
        const m = (nested as Record<string, unknown>).message;
        if (typeof m === "string" && m.trim()) return m;
      }
      if (typeof o.message === "string" && o.message.trim()) return o.message;
      if (typeof o.error === "string" && o.error.trim()) return o.error;
      const errs = o.errors;
      if (Array.isArray(errs) && errs.length > 0 && typeof errs[0] === "string") return errs.join(" ");
    }
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

function resolveAssignmentRoleId(
  assignment: UserRoleAssignment,
  availableRoles: readonly RoleListItem[],
): string | null {
  return resolveRoleId(assignment, availableRoles);
}

export function ChangeUserRolePageContent() {
  const t = useTranslations("Dashboard.usersManagement.changeRolePage");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = normalizeRouteUserId(params.id);

  const roleFieldId = useId();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [availableRoles, setAvailableRoles] = useState<RoleListItem[]>([]);
  const [currentAssignments, setCurrentAssignments] = useState<UserRoleAssignment[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [originalRoleId, setOriginalRoleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoadError(t("errors.loadFailed"));
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setSuccess(false);
    setError(null);

    void (async () => {
      try {
        const [user, userRoles, roles] = await Promise.all([
          getUserById(userId),
          getUserRoles(userId),
          getRoles(),
        ]);
        if (cancelled) return;

        const resolvedAssignments = userRoles.roles.map((assignment) => ({
          roleId: resolveRoleId(assignment, roles),
          roleName: assignment.roleName,
        }));
        const initialRoleId =
          resolvedAssignments.find((assignment) => assignment.roleId)?.roleId ?? roles[0]?.id ?? "";

        setUsername(user.username);
        setEmail(user.email);
        setAvailableRoles(roles);
        setCurrentAssignments(resolvedAssignments);
        setSelectedRoleId(initialRoleId);
        setOriginalRoleId(initialRoleId);
      } catch (err) {
        if (cancelled) return;
        setLoadError(userErrMessage(err, t("errors.loadFailed")));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [t, userId]);

  const roleOptions = useMemo(
    () =>
      availableRoles.map((role) => ({
        value: role.id,
        label: formatUserRoleLabel(role.name),
      })),
    [availableRoles],
  );

  const currentRoleLabel = useMemo(() => {
    const names = currentAssignments.map((assignment) => assignment.roleName).filter(Boolean);
    if (names.length === 0) return t("currentRoleNone");
    return names.map((name) => formatUserRoleLabel(name)).join(", ");
  }, [currentAssignments, t]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);

      const nextRoleId = selectedRoleId.trim();
      const nextRole = availableRoles.find((role) => role.id === nextRoleId);
      if (!nextRoleId || !nextRole?.name.trim()) {
        setError(t("errors.required"));
        return;
      }
      if (nextRoleId === originalRoleId) {
        setError(t("errors.noChanges"));
        return;
      }

      setSubmitting(true);
      try {
        for (const assignment of currentAssignments) {
          const currentRoleId = resolveAssignmentRoleId(assignment, availableRoles);
          const currentRoleName = resolveRoleName(assignment, availableRoles);
          if (!currentRoleName || currentRoleId === nextRoleId) continue;
          try {
            await revokeUserRole(userId, {
              roleName: currentRoleName,
              roleId: currentRoleId ?? undefined,
            });
          } catch (err) {
            setError(
              t("errors.revokeFailed", {
                message: userErrMessage(err, t("errors.updateFailed")),
              }),
            );
            return;
          }
        }

        const alreadyAssigned = currentAssignments.some((assignment) => {
          const currentRoleId = resolveAssignmentRoleId(assignment, availableRoles);
          return currentRoleId === nextRoleId;
        });
        if (!alreadyAssigned) {
          try {
            await assignUserRole(userId, {
              roleName: nextRole.name,
              roleId: nextRole.id,
            });
          } catch (err) {
            setError(
              t("errors.assignFailed", {
                message: userErrMessage(err, t("errors.updateFailed")),
              }),
            );
            return;
          }
        }

        setCurrentAssignments([
          { roleId: nextRole.id, roleName: nextRole.name },
        ]);
        setOriginalRoleId(nextRoleId);
        setSuccess(true);
      } finally {
        setSubmitting(false);
      }
    },
    [availableRoles, currentAssignments, originalRoleId, selectedRoleId, t, userId],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-3 py-12 text-center text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
        {t("loading")}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          {loadError}
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="text-sm font-medium underline hover:no-underline"
          style={{ color: theme.accentGold }}
        >
          {t("backToList")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <p className="text-sm text-gray-500">{t("intro")}</p>

      <div className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-3 text-sm">
        <p className="text-foreground">
          <span className="text-gray-500">{t("username")}: </span>
          {username || "—"}
        </p>
        <p className="mt-1 text-foreground">
          <span className="text-gray-500">{t("email")}: </span>
          {email || "—"}
        </p>
        <p className="mt-1 text-foreground">
          <span className="text-gray-500">{t("currentRole")}: </span>
          {currentRoleLabel}
        </p>
      </div>

      {success ? (
        <div
          className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
          role="status"
        >
          <p className="font-medium">{t("successTitle")}</p>
          <p className="mt-1 text-emerald-200/90">{t("successHint")}</p>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="mt-3 text-sm font-medium underline hover:no-underline"
            style={{ color: theme.accentGold }}
          >
            {t("viewUsersList")}
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor={roleFieldId} className="mb-1.5 block text-xs text-gray-500">
            {t("role")}
          </label>
          <div className="relative">
            <select
              id={roleFieldId}
              name="role_id"
              value={selectedRoleId}
              onChange={(ev) => setSelectedRoleId(ev.target.value)}
              className={selectClass}
              disabled={submitting || roleOptions.length === 0}
            >
              {roleOptions.length === 0 ? (
                <option value="">{t("noRolesAvailable")}</option>
              ) : (
                roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || roleOptions.length === 0}
          className="w-full rounded-lg py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "#C9A96E" }}
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
