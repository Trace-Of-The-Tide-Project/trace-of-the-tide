"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangleIcon, MoreDotsIcon } from "@/components/ui/icons";
import { sampleDonations, samplePayouts, sampleSuspiciousActivity } from "@/lib/dashboard/finance-constants";

const FINANCE_TABS = ["Donations", "Payouts", "Suspicious Activity", "Invoices"] as const;
type FinanceTab = (typeof FINANCE_TABS)[number];

function RowActions() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; placeAbove: boolean } | null>(
    null,
  );

  const menuWidth = 160;
  const menuMargin = 8;

  const updatePosition = useMemo(() => {
    return () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      // Default: open below, aligned right edge to button.
      const left = Math.min(
        Math.max(8, rect.right - menuWidth),
        Math.max(8, viewportW - menuWidth - 8),
      );

      // Rough menu height: divider + 2 items + padding.
      const estimatedHeight = 2 * 40 + 12 + 8;
      const spaceBelow = viewportH - rect.bottom;
      const placeAbove = spaceBelow < estimatedHeight + menuMargin;
      const top = placeAbove ? rect.top - menuMargin : rect.bottom + menuMargin;

      setMenuPos({ top, left, placeAbove });
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onReposition() {
      updatePosition();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, updatePosition]);

  return (
    <div className="relative flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreDotsIcon />
      </button>
      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-9999 w-[160px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] p-2 shadow-xl"
            style={{
              left: menuPos.left,
              top: menuPos.placeAbove ? undefined : menuPos.top,
              bottom: menuPos.placeAbove ? window.innerHeight - menuPos.top : undefined,
            }}
          >
            <div className="mb-1 border-t border-[#3a3a3a]" />
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              View Details
            </button>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Refund
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function FinanceContent() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("Donations");
  const [payouts, setPayouts] = useState(samplePayouts);

  return (
    <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex w-fit gap-1 rounded-lg border border-[#444] bg-[#232323] p-1">
        {FINANCE_TABS.map((tab) => {
          const label =
            tab === "Payouts"
              ? "Payouts (3)"
              : tab === "Suspicious Activity"
                ? "Suspicious Activity (2)"
                : tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "border border-[#4A4A4A] bg-[#333333] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  : "border border-transparent bg-transparent text-[#AAAAAA] hover:text-[#E0E0E0]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "Payouts" ? (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-white">Pending Payouts</h2>
          <p className="mt-1 text-sm text-gray-500">Creator payout requests awaiting approval</p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#2f2f2f]">
            <div className="grid grid-cols-[1.3fr_0.8fr_1fr_0.9fr_1fr] items-center bg-[#121212] px-6 py-4 text-sm border-b border-[#2f2f2f]">
              <div className="text-sm text-[#CBA158]">Creator</div>
              <div className="text-sm text-[#CBA158]">Amount</div>
              <div className="text-sm text-[#CBA158]">Requested</div>
              <div className="text-sm text-[#CBA158]">Status</div>
              <div className="text-sm text-[#CBA158] text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#2f2f2f]">
              {payouts.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.3fr_0.8fr_1fr_0.9fr_1fr] items-center px-6 py-4"
                >
                  <div className="text-sm font-medium text-white">{row.creator}</div>
                  <div className="text-sm text-gray-500">{row.amount}</div>
                  <div className="text-sm text-gray-400">{row.requested}</div>
                  <div
                    className={`text-sm font-medium ${
                      row.status === "Pending" ? "text-[#F59E0B]" : "text-blue-400"
                    }`}
                  >
                    {row.status}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPayouts((prev) => prev.filter((p) => p.id !== row.id));
                      }}
                      className="inline-flex h-[36px] items-center gap-2 rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] px-4 text-sm font-medium text-emerald-400 transition-colors hover:bg-[#333333]"
                    >
                      <span className="[&_svg]:h-4 [&_svg]:w-4">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayouts((prev) => prev.filter((p) => p.id !== row.id));
                      }}
                      className="inline-flex h-[36px] items-center gap-2 rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] px-4 text-sm font-medium text-red-400 transition-colors hover:bg-[#333333]"
                    >
                      <span className="[&_svg]:h-4 [&_svg]:w-4">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </span>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "Suspicious Activity" ? (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-white">Suspicious Activity</h2>
          <p className="mt-1 text-sm text-gray-500">Flagged transactions requiring review</p>

          <div className="mt-6 space-y-4">
            {sampleSuspiciousActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-6 rounded-2xl border border-red-500/60 bg-[#121212] px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] text-gray-300">
                    <AlertTriangleIcon />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.meta}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    className="h-[36px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] px-4 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
                  >
                    Investigate
                  </button>
                  <button
                    type="button"
                    className="h-[36px] rounded-lg border border-[#2f2f2f] bg-[#2a2a2a] px-4 text-sm font-medium text-red-400 transition-colors hover:bg-[#333333]"
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab !== "Donations" ? (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-10 text-center text-gray-500">
          {activeTab} coming soon.
        </div>
      ) : (
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-white">Recent Donations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest donation transactions on the platform
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#2f2f2f]">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.9fr_0.9fr_56px] items-center bg-[#121212] px-6 py-4 text-sm border-b border-[#2f2f2f]">
              <div className="text-sm text-[#CBA158]">Donor</div>
              <div className="text-sm text-[#CBA158]">Recipient</div>
              <div className="text-sm text-[#CBA158]">Amount</div>
              <div className="text-sm text-[#CBA158]">Date</div>
              <div className="text-sm text-[#CBA158]">Status</div>
              <div />
            </div>

            <div className="divide-y divide-[#2f2f2f]">
              {sampleDonations.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.4fr_1fr_0.8fr_0.9fr_0.9fr_56px] items-center px-6 py-4"
                >
                  <div className="text-sm font-medium text-white">{row.donor}</div>
                  <div className="text-sm text-gray-200">{row.recipient}</div>
                  <div className="text-sm text-gray-500">{row.amount}</div>
                  <div className="text-sm text-gray-400">{row.date}</div>
                  <div
                    className={`text-sm font-medium ${
                      row.status === "Completed" ? "text-emerald-400" : "text-[#F59E0B]"
                    }`}
                  >
                    {row.status}
                  </div>
                  <RowActions />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

