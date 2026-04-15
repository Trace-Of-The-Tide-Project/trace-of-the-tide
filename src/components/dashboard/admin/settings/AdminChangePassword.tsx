"use client";

import { useCallback, useId, useState, type FormEvent } from "react";
import { EyeIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import { settingsCardClass } from "./SettingsPrimitives";

const inputWrapClass =
  "relative flex items-center rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-control-bg)] focus-within:border-[#C9A96E]";
const inputClass =
  "w-full border-0 bg-transparent py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-gray-500 outline-none";

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
};

function PasswordField({ id, label, placeholder, value, onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-gray-500">
        {label}
      </label>
      <div className={inputWrapClass}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          autoComplete={label.toLowerCase().includes("current") ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 transition-colors hover:bg-[var(--tott-dash-control-hover)] hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

export function AdminChangePassword() {
  const baseId = useId();
  const currentId = `${baseId}-current`;
  const newId = `${baseId}-new`;
  const confirmId = `${baseId}-confirm`;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    },
    [],
  );

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className={settingsCardClass}
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset" }}
      >
        <h1 className="text-lg font-bold text-foreground">Change Password</h1>

        <div className="mt-6 space-y-5">
          <PasswordField
            id={currentId}
            label="Current password"
            placeholder="Enter your current password"
            value={current}
            onChange={setCurrent}
          />
          <PasswordField
            id={newId}
            label="New password"
            placeholder="New password (+8 characters)"
            value={next}
            onChange={setNext}
          />
          <PasswordField
            id={confirmId}
            label="Confirm new password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={setConfirm}
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.accentGold }}
          >
            {savedFlash ? "Saved" : "Change my password"}
          </button>
        </div>
      </form>
    </div>
  );
}
