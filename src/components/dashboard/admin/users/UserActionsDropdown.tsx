"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { MoreDotsIcon } from "@/components/ui/icons";

type ActionItem = {
  id: string;
  labelKey: "viewProfile" | "editUser" | "changeRole" | "verifyUser" | "suspendUser";
  destructive?: boolean;
};

const ACTIONS: ActionItem[] = [
  { id: "view", labelKey: "viewProfile" },
  { id: "edit", labelKey: "editUser" },
  { id: "role", labelKey: "changeRole" },
  { id: "verify", labelKey: "verifyUser" },
  { id: "suspend", labelKey: "suspendUser", destructive: true },
];

type UserActionsDropdownProps = {
  userId: string;
  onAction?: (actionId: string, userId: string) => void;
};

function editUserHref(userId: string): string {
  return `/admin/users/${userId}/edit`;
}

function changeRoleHref(userId: string): string {
  return `/admin/users/${userId}/role`;
}

export function UserActionsDropdown({ userId, onAction }: UserActionsDropdownProps) {
  const t = useTranslations("Dashboard.usersManagement.rowActions");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `user-actions-${userId}`;

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setMenuPosition(null);
  }, []);

  const openMenu = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 160;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    setMenuPosition({ top: rect.bottom + 4, left });
    setIsOpen(true);
  }, []);

  const handleAction = useCallback(
    (actionId: string) => {
      if (actionId === "edit") {
        closeMenu();
        router.push(editUserHref(userId));
        return;
      }
      if (actionId === "role") {
        closeMenu();
        router.push(changeRoleHref(userId));
        return;
      }
      onAction?.(actionId, userId);
      closeMenu();
    },
    [closeMenu, onAction, router, userId],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const menu = document.getElementById(menuId);
      if (menu?.contains(target)) return;
      closeMenu();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu, isOpen, menuId]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className="rounded p-1.5 transition-colors hover:bg-[var(--tott-dash-ghost-hover)]"
        style={{ color: "#A3A3A3" }}
        aria-label={t("menuAria")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
      >
        <MoreDotsIcon />
      </button>
      {isOpen && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              id={menuId}
              role="menu"
              className="fixed z-300 min-w-[160px] rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] py-1 shadow-lg"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(action.id)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--tott-dash-surface-inset)] ${
                    action.destructive ? "text-red-400 hover:bg-red-500/10" : "text-foreground"
                  }`}
                >
                  {t(action.labelKey)}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
