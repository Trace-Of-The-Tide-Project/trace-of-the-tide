"use client";

import { EmailIcon } from "@/components/ui/icons";
import { AuthInput } from "@/components/ui/AuthInput";
import { theme } from "@/lib/theme";
import { useForgotPasswordForm } from "./useForgotPasswordForm";

export function ForgotPasswordForm() {
  const { loading, error, handleSubmit } = useForgotPasswordForm();

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email address"
        required
        autoComplete="email"
        icon={<EmailIcon />}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
      >
        {loading ? "Sending…" : "Send reset email"}
      </button>
    </form>
  );
}
