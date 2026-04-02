"use client";

import { useState } from "react";
import {
  ShieldIcon,
  ActivityIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
  DownloadIcon,
  SquareCheckIcon,
  AlertTriangleIcon,
} from "@/components/ui/icons";
import { ConfigureRoleModal } from "@/components/dashboard/modals/ConfigureRoleModal";
import { PermissionToggle } from "@/components/dashboard/admin/roles/PermissionToggle";
import {
  securityAdminRoles,
  adminSessionTableRows,
  securityLogEntries,
  type AdminSessionTableRow,
} from "@/lib/dashboard/security-constants";

const ACCENT = "#E8DDC0";

const SECURITY_TABS = [
  { id: "roles", label: "Admin Roles", icon: ShieldIcon },
  { id: "sessions", label: "Active sessions", icon: ActivityIcon },
  { id: "settings", label: "Security Settings", icon: SettingsIcon },
  { id: "logs", label: "Security Logs", icon: UsersIcon },
] as const;

type SecurityTabId = (typeof SECURITY_TABS)[number]["id"];

const SESSION_TIMEOUTS = ["15 minutes", "30 minuts", "60 minutes"] as const;

export function SecurityContent() {
  const [activeTab, setActiveTab] = useState<SecurityTabId>("roles");
  const [configureOpen, setConfigureOpen] = useState(false);
  const [configureRoleTitle, setConfigureRoleTitle] = useState("Super Admin");

  const [sessions, setSessions] = useState<AdminSessionTableRow[]>(() => [...adminSessionTableRows]);

  const [require2fa, setRequire2fa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<string>("30 minuts");
  const [lockoutAttempts, setLockoutAttempts] = useState(5);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  const openConfigure = (title: string) => {
    setConfigureRoleTitle(title);
    setConfigureOpen(true);
  };

  const endSession = (id: string) => {
    setSessions((prev) => prev.filter((r) => r.id !== id));
  };

  const endAllOtherSessions = () => {
    setSessions((prev) => prev.filter((r) => r.status === "current"));
  };

  const tabIconClass = "text-[#E8DDC0] [&_svg]:h-4 [&_svg]:w-4";

  const statusLabel = (s: AdminSessionTableRow["status"]) => {
    if (s === "current") return "Current";
    if (s === "active") return "Active";
    return "Idle";
  };

  const statusClass = (s: AdminSessionTableRow["status"]) => {
    if (s === "idle") return "text-gray-500";
    return "text-emerald-400";
  };

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
        <div className="flex w-fit flex-wrap items-center gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
          {SECURITY_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all sm:px-5 ${
                  activeTab === tab.id
                    ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
                }`}
              >
                <span className={tabIconClass}>
                  <Icon />
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "roles" && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-white">Admin Roles</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure admin role permissions and access levels.
            </p>
            <div className="mt-6 space-y-3">
              {securityAdminRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#2f2f2f] bg-[#121212] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#333] bg-[#121212] text-[#E8DDC0]"
                      aria-hidden
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        <ShieldIcon />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{role.title}</p>
                      <span className="mt-1 inline-block rounded-full border border-[#444] bg-[#1a1a1a] px-2.5 py-0.5 text-xs text-gray-400">
                        {role.userBadge}
                      </span>
                      <p className="mt-2 text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openConfigure(role.configureTitle)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#444] bg-[#232323] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a] sm:self-center"
                  >
                    <span className="text-white [&_svg]:h-4 [&_svg]:w-4">
                      <SettingsIcon />
                    </span>
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Active Sessions</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor and manage active admin sessions.
                </p>
              </div>
              <button
                type="button"
                onClick={endAllOtherSessions}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="[&_svg]:h-4 [&_svg]:w-4">
                  <XIcon />
                </span>
                End all other sessions
              </button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-[#2f2f2f] bg-[#121212]">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2f2f2f] bg-[#121212]">
                    {(
                      ["User", "IP Address", "Location", "Device", "Last Active", "Status", ""] as const
                    ).map((h) => (
                      <th
                        key={h || "actions"}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#E8DDC0] ${
                          h === "" ? "w-24 text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2f2f2f]">
                  {sessions.map((row) => (
                    <tr key={row.id} className="bg-[#121212]">
                      <td className="px-4 py-3 font-semibold text-white">{row.user}</td>
                      <td className="px-4 py-3 text-gray-400">{row.ip}</td>
                      <td className="px-4 py-3 text-gray-400">{row.location}</td>
                      <td className="px-4 py-3 text-gray-400">{row.device}</td>
                      <td className="px-4 py-3 text-gray-400">{row.lastActive}</td>
                      <td className={`px-4 py-3 font-medium ${statusClass(row.status)}`}>
                        {statusLabel(row.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.status === "current" ? (
                          <span className="text-xs text-gray-600">—</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => endSession(row.id)}
                            className="rounded-lg border border-[#444] bg-[#232323] px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-[#2a2a2a]"
                          >
                            End
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-white">Security Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Authentication and platform-wide security controls.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[#2f2f2f] bg-[#121212] p-5 sm:p-6">
                <h3 className="text-base font-bold text-white">Authentication</h3>
                <p className="mt-1 text-sm text-gray-500">Configure login and access settings</p>

                <div className="mt-6 space-y-5 border-t border-[#2f2f2f] pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">Require 2FA for Admins</p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        All admin accounts must use two-factor authentication
                      </p>
                    </div>
                    <PermissionToggle
                      checked={require2fa}
                      onChange={setRequire2fa}
                      checkedColor={ACCENT}
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">Session Timeout</p>
                      <p className="mt-0.5 text-sm text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full max-w-[200px] rounded-lg border border-[#444] bg-[#121212] px-3 py-2 text-sm text-white focus:border-[#555] focus:outline-none sm:w-auto"
                    >
                      {SESSION_TIMEOUTS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">Failed Login Lockout</p>
                      <p className="mt-0.5 text-sm text-gray-500">Lock account after failed attempts</p>
                    </div>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      value={lockoutAttempts}
                      onChange={(e) => setLockoutAttempts(Number(e.target.value) || 5)}
                      className="w-full max-w-[100px] rounded-lg border border-[#444] bg-[#121212] px-3 py-2 text-sm text-white focus:border-[#555] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#2f2f2f] bg-[#121212] p-5 sm:p-6">
                <h3 className="text-base font-bold text-white">System Controls</h3>
                <p className="mt-1 text-sm text-gray-500">Platform-wide security controls</p>

                <div className="mt-6 space-y-5 border-t border-[#2f2f2f] pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">Maintenance Mode</p>
                      <p className="mt-0.5 text-sm text-gray-500">Restrict access to admins only</p>
                    </div>
                    <PermissionToggle
                      checked={maintenanceMode}
                      onChange={setMaintenanceMode}
                      checkedColor={ACCENT}
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">IP Whitelist</p>
                      <p className="mt-0.5 text-sm text-gray-500">Restrict admin access by IP</p>
                    </div>
                    <PermissionToggle
                      checked={ipWhitelist}
                      onChange={setIpWhitelist}
                      checkedColor={ACCENT}
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#444] bg-[#2a2a2a] py-3 text-sm font-medium text-white transition-colors hover:bg-[#333]"
                  >
                    <span className="text-[#E8DDC0] [&_svg]:h-4 [&_svg]:w-4">
                      <DownloadIcon />
                    </span>
                    Backup &amp; Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-white">Security Logs</h2>
            <p className="mt-1 text-sm text-gray-500">Recent security events and activities</p>
            <div className="mt-6 space-y-3">
              {securityLogEntries.map((entry) => {
                const isWarning = entry.variant === "warning";
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 rounded-xl border bg-[#121212] px-4 py-4 sm:gap-5 sm:px-5 ${
                      isWarning ? "border-red-600/45" : "border-[#2f2f2f]"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#333] bg-[#1a1a1a] text-[#E8DDC0]"
                      aria-hidden
                    >
                      <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                        {isWarning ? <AlertTriangleIcon /> : <SquareCheckIcon />}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{entry.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{entry.meta}</p>
                    </div>
                    <p className="shrink-0 text-sm text-gray-500">{entry.timeAgo}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ConfigureRoleModal
        open={configureOpen}
        onClose={() => setConfigureOpen(false)}
        roleDisplayName={configureRoleTitle}
      />
    </div>
  );
}
