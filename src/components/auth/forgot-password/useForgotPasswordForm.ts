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
    if (typeof window !== "undefined") {
      sessionStorage.setItem("forgot-password-email", email);
    }
    setTimeout(() => {
      router.push("/auth/forgot-password/email-sent");
      router.refresh();
      setLoading(false);
    }, 800);
  }

  return {
    loading,
    error,
    handleSubmit,
  };
}
