"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signup } from "@/services/auth.service";
import type { SignupRequest } from "@/types/auth.types";

type RegisterSubmitEvent = React.FormEvent<HTMLFormElement>;

export function useRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  async function handleSubmit(e: RegisterSubmitEvent) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;

    const data: SignupRequest = {
      username: (form.elements.namedItem("username") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value.trim(),
      phone_number: (form.elements.namedItem("phone_number") as HTMLInputElement).value.trim(),
    };

    if (!agreedToTerms) {
      setError("Please agree to the terms and privacy policy.");
      return;
    }
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!data.username || !data.email || !data.full_name) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await signup(data);
      router.push("/");
      router.refresh();
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Signup error:", err);
      }
      const errWithResponse = err as {
        response?: { status?: number; data?: Record<string, unknown> };
        message?: string;
      };
      const data = errWithResponse.response?.data;
      let msg: string | undefined;
      if (data) {
        const inner = data.data as { message?: string } | undefined;
        const rawMsg = (inner?.message ?? data.message) as string | string[] | undefined;
        msg = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg;
        if (!msg && typeof data.error === "string") msg = data.error;
      }
      if (!msg && (axios.isAxiosError(err) || errWithResponse.message)) {
        msg = (err as Error).message;
      }
      setError(msg ?? `Registration failed (${errWithResponse.response?.status ?? "network error"}).`);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    agreedToTerms,
    setAgreedToTerms,
    handleSubmit,
  };
}
