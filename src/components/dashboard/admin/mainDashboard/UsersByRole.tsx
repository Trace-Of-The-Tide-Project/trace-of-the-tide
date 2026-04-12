import Link from "next/link";
import type { ComponentType } from "react";

type RoleBar = {
  id: string;
  icon: ComponentType;
  label: string;
  count: string;
  percentage: number;
  change?: string;
};

type UsersByRoleProps = {
  roles: RoleBar[];
  totalLabel?: string;
  totalValue?: string;
  viewAllHref?: string;
};

export function UsersByRole({ roles, totalLabel, totalValue, viewAllHref }: UsersByRoleProps) {
  return (
    <div className="rounded-xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface)] p-7">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Users by Role</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-foreground"
          >
            View all
          </Link>
        )}
      </div>

      <div className="divide-y divide-[#333]/40">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="py-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500"><Icon /></span>
                  <span className="text-sm font-medium text-foreground">{role.label}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">{role.count}</span>
                  {role.change && (
                    <span className="text-emerald-400">{role.change}</span>
                  )}
                </div>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#222]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${role.percentage}%`,
                    background: "linear-gradient(to right, rgba(203,161,88,0.35), #CBA158)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalLabel && totalValue && (
        <div className="mt-3 flex items-center justify-between border-t border-[var(--tott-card-border)] pt-4 text-sm text-gray-500">
          <span>{totalLabel}</span>
          <span className="font-semibold text-foreground">{totalValue}</span>
        </div>
      )}
    </div>
  );
}
