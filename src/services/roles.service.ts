import { api } from "./api";

export type RoleListItem = {
  id: string;
  name: string;
};

export type UserRoleAssignment = {
  roleId: string | null;
  roleName: string;
};

export type UserRolesResult = {
  roles: UserRoleAssignment[];
  results: number;
};

function extractRoleName(raw: Record<string, unknown>): string {
  if (typeof raw.name === "string" && raw.name.trim()) return raw.name.trim();
  const nestedRole = raw.role;
  if (nestedRole && typeof nestedRole === "object" && !Array.isArray(nestedRole)) {
    const role = nestedRole as Record<string, unknown>;
    if (typeof role.name === "string" && role.name.trim()) return role.name.trim();
  }
  if (typeof raw.slug === "string" && raw.slug.trim()) return raw.slug.trim();
  return "";
}

function normalizeRoleRow(raw: unknown): RoleListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    typeof o.id === "string"
      ? o.id
      : o.role && typeof o.role === "object" && typeof (o.role as Record<string, unknown>).id === "string"
        ? ((o.role as Record<string, unknown>).id as string)
        : null;
  const name = extractRoleName(o);
  if (!id || !name) return null;
  return { id, name };
}

function parseUserRoleAssignment(raw: unknown): UserRoleAssignment | null {
  if (typeof raw === "string" && raw.trim()) {
    return { roleId: null, roleName: raw.trim() };
  }
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const roleName = extractRoleName(o);
  const nestedRole = o.role;
  const roleId =
    typeof o.role_id === "string"
      ? o.role_id
      : nestedRole && typeof nestedRole === "object" && typeof (nestedRole as Record<string, unknown>).id === "string"
        ? ((nestedRole as Record<string, unknown>).id as string)
        : typeof o.id === "string" && roleName
          ? null
          : typeof o.id === "string"
            ? o.id
            : null;
  if (!roleName) return null;
  return { roleId, roleName };
}

function unwrapListData(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  if (Array.isArray(o.data)) return o.data;
  if (Array.isArray(o.userRoles)) return o.userRoles;
  if (Array.isArray(o.roles)) return o.roles;
  return [];
}

/** GET /roles — admin only. */
export async function getRoles(): Promise<RoleListItem[]> {
  const { data } = await api.get<unknown>("/roles", { params: { limit: 100, page: 1 } });
  return unwrapListData(data).map(normalizeRoleRow).filter((role): role is RoleListItem => role !== null);
}

/** GET /users/:id/roles */
export async function getUserRoles(userId: string): Promise<UserRolesResult> {
  const { data } = await api.get<unknown>(`/users/${encodeURIComponent(userId)}/roles`);
  const roles = unwrapListData(data)
    .map(parseUserRoleAssignment)
    .filter((role): role is UserRoleAssignment => role !== null);
  const results =
    data && typeof data === "object" && typeof (data as Record<string, unknown>).results === "number"
      ? Number((data as Record<string, unknown>).results)
      : roles.length;
  return { roles, results };
}

type RoleMutationBody = {
  name: string;
  role_id?: string;
};

function buildRoleMutationBody(roleName: string, roleId?: string): RoleMutationBody {
  const name = roleName.trim();
  if (!name) throw new Error("Role name is required");
  const body: RoleMutationBody = { name };
  const role_id = roleId?.trim();
  if (role_id) body.role_id = role_id;
  return body;
}

/** PATCH /roles/assign/:userId — admin only. */
export async function assignUserRole(
  userId: string,
  payload: { roleName: string; roleId?: string },
): Promise<void> {
  await api.patch(
    `/roles/assign/${encodeURIComponent(userId)}`,
    buildRoleMutationBody(payload.roleName, payload.roleId),
  );
}

/** PATCH /roles/revoke/:userId — admin only. */
export async function revokeUserRole(
  userId: string,
  payload: { roleName: string; roleId?: string },
): Promise<void> {
  await api.patch(
    `/roles/revoke/${encodeURIComponent(userId)}`,
    buildRoleMutationBody(payload.roleName, payload.roleId),
  );
}

export function resolveRoleId(
  assignment: UserRoleAssignment,
  availableRoles: readonly RoleListItem[],
): string | null {
  if (assignment.roleId) return assignment.roleId;
  const match = availableRoles.find(
    (role) => role.name.trim().toLowerCase() === assignment.roleName.trim().toLowerCase(),
  );
  return match?.id ?? null;
}

export function resolveRoleName(
  assignment: UserRoleAssignment,
  availableRoles: readonly RoleListItem[],
): string | null {
  const explicit = assignment.roleName.trim();
  if (explicit) return explicit;
  const roleId = resolveRoleId(assignment, availableRoles);
  if (!roleId) return null;
  return availableRoles.find((role) => role.id === roleId)?.name.trim() ?? null;
}
