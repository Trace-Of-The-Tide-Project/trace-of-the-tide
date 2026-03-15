"use client";

import { useState } from "react";
import Link from "next/link";
import { PersonIcon, EmailIcon, LockIcon, PhoneIcon } from "@/components/ui/icons";
import { AuthInput } from "@/components/ui/AuthInput";
import { theme } from "@/lib/theme";
import { useRegisterForm } from "./useRegisterForm";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, agreedToTerms, setAgreedToTerms, handleSubmit } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AuthInput
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="saja"
          required
          autoComplete="username"
          icon={<PersonIcon />}
        />
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="saja@trace.ps"
          required
          autoComplete="email"
          icon={<EmailIcon />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AuthInput
          id="full_name"
          name="full_name"
          type="text"
          label="Full name"
          placeholder="Saja Khalil"
          required
          autoComplete="name"
          icon={<PersonIcon />}
        />
        <AuthInput
          id="phone_number"
          name="phone_number"
          type="tel"
          label="Phone number"
          placeholder="+970 59 123 4567"
          autoComplete="tel"
          icon={<PhoneIcon />}
        />
      </div>
      <AuthInput
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Password (+8 characters)"
        required
        minLength={8}
        autoComplete="new-password"
        icon={<LockIcon />}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-neutral-500 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
            suppressHydrationWarning
          >
            👁
          </button>
        }
      />
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className={`mt-1 rounded bg-black text-[${theme.accentGoldFocus}] focus:ring-[${theme.accentGoldFocus}]`}
          style={{ borderColor: theme.inputBorder }}
          suppressHydrationWarning
        />
        <label htmlFor="terms" className="text-sm text-white cursor-default select-none">
          I agree to the{" "}
          <Link href="/terms" className="hover:underline" style={{ color: theme.accentGold }}>
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline" style={{ color: theme.accentGold }}>
            privacy policy
          </Link>
          .
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
        suppressHydrationWarning
      >
        {loading ? "Creating account…" : "Create a new account"}
      </button>
    </form>
  );
}
