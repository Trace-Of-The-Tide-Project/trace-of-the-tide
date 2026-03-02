"use client";
import { useState, useCallback, useEffect } from "react";
import { MenuIcon } from "@/components/ui/icons";
import type { DashboardConfig } from "@/lib/dashboard/types";
import { DashboardSidebar } from "./DashboardSidebar";
import HexBackground from "@/components/ui/HexBackground";

type DashboardLayoutProps = {
  config: DashboardConfig;
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardLayout({ config, header, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-[calc(100dvh-72px)] bg-black">
      {/* Hex background — only behind the topbar area */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-35 overflow-hidden">
        <HexBackground />
      </div>

      <div className="relative">
        {/* Mobile topbar */}
        <div className="flex h-14 shrink-0 items-center gap-4 px-10 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </button>
          <span className="text-sm font-medium text-white">Dashboard</span>
        </div>

        <div className="flex flex-col gap-6 px-4 py-6 sm:px-8 md:px-16 lg:px-24 xl:px-40 xl:py-12">
          {/* Header area */}
          {header && (
            <div className="border-b border-[#333] ">
              {header}
            </div>
          )}

          {/* Sidebar + content row */}
          <div className="flex items-stretch gap-6">
            {/* Desktop sidebar */}
            <aside className="hidden w-70 shrink-0 lg:block">
              <div className="flex h-full flex-col rounded-xl border border-[#333] bg-[#0a0a0a]">
                <DashboardSidebar config={config} />
              </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1 rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "visible" : "invisible"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={closeMobile}
          className={`absolute inset-0 transition-opacity duration-300 ${
            mobileOpen ? "bg-black/60 opacity-100" : "opacity-0"
          }`}
          aria-label="Close sidebar"
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DashboardSidebar config={config} onItemClick={closeMobile} />
        </div>
      </div>
    </div>
  );
}
