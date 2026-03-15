"use client";

import { useState } from "react";
import { GripVerticalIcon, PlusIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";

type NavLink = { id: string; text: string; path: string; enabled: boolean };

const INITIAL_NAV_LINKS: NavLink[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
  text: "",
  path: "",
  enabled: true,
}));

function NavFooterToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "" : "bg-[#333]"}`}
      style={checked ? { backgroundColor: theme.accentGoldFocus } : undefined}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export function NavigationsFooterTab() {
  const [navLinks, setNavLinks] = useState(INITIAL_NAV_LINKS);

  const updateNavLink = (id: string, field: keyof NavLink, value: string | boolean) => {
    setNavLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2" role="region" aria-label="Navigations and footer configuration">
      <div
        className="isolate min-w-0 overflow-visible rounded-xl border border-[#444] p-6"
        role="group"
        aria-label="Header navigation configuration"
      >
        <h3 className="text-sm font-semibold text-white">Header Navigation</h3>
        <p className="mt-1 text-xs text-gray-500">Configure main navigation links</p>
        <div className="mt-4 space-y-4">
          {navLinks.map((link) => (
            <div key={link.id} className="flex min-w-0 items-center gap-3">
              <span className="cursor-grab text-gray-500" aria-label="Reorder">
                <GripVerticalIcon />
              </span>
              <input
                type="text"
                placeholder="Text"
                value={link.text}
                onChange={(e) => updateNavLink(link.id, "text", e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
              <input
                type="text"
                placeholder="/text"
                value={link.path}
                onChange={(e) => updateNavLink(link.id, "path", e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
              <NavFooterToggle
                checked={link.enabled}
                onChange={(v) => updateNavLink(link.id, "enabled", v)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#444] bg-[#333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
        >
          <PlusIcon className="[&>svg]:h-4 [&>svg]:w-4" />
          Add Link
        </button>
      </div>
      <div
        className="isolate overflow-hidden rounded-xl border border-[#444] p-6"
        role="group"
        aria-label="Footer configuration"
      >
        <h3 className="text-sm font-semibold text-white">Footer</h3>
        <p className="mt-1 text-xs text-gray-500">Configure footer content and links</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Footer Text</label>
            <textarea
              placeholder="© 2024 TTT. All rights reserved."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Social Links</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Twitter URL"
                className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Instagram URL"
                className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Linkedin URL"
                className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#444] bg-[#333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
        >
          <PlusIcon className="[&>svg]:h-4 [&>svg]:w-4" />
          Add Link
        </button>
      </div>
    </div>
  );
}
