"use client";

import { ShieldIcon } from "@/components/ui/icons";
import { unusualLogins } from "@/lib/dashboard/admin-dashboard-constants";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">Security & Auth</h1>
        <p className="mt-1 text-sm text-gray-500">
          Authentication settings, security policies, and login activity.
        </p>
      </div>

      <section className="rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500"><ShieldIcon /></span>
            <h2 className="text-lg font-bold text-white">Unusual login activity</h2>
            <span
              className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}
            >
              Warning
            </span>
          </div>
        </div>
        <p className="mb-5 text-sm text-gray-500">
          3 editor accounts accessed from new locations. Review and verify if access is expected.
        </p>

        <div className="flex flex-col gap-3">
          {unusualLogins.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#333] bg-[#111] px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.editor}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  New location: {item.location} · {item.time}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2 text-xs font-medium transition-colors hover:border-gray-500"
                style={{ color: "#CBA158" }}
              >
                Flag
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-bold text-white">Authentication settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage login policies, session timeouts, and 2FA requirements.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Coming soon.
        </p>
      </div>
    </div>
  );
}
