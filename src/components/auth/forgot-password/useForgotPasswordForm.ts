"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ForgotPasswordSubmitEvent = React.FormEvent<HTMLFormElement>;

export function useForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: ForgotPasswordSubmitEvent) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data.message as string) || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("forgot-password-email", email);
      }
      router.push("/auth/forgot-password/email-sent");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    handleSubmit,
  };
}
