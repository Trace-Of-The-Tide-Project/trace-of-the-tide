/**
 * Example: Using signup in a React form submission handler
 * Copy this pattern into your RegisterForm or similar component.
 */

"use client"

import { useState } from "react"
import { signup } from "@/services/auth.service"
import type { SignupRequest } from "@/types/auth.types"

export function useSignupExample() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const data: SignupRequest = {
      username: (form.elements.namedItem("username") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value.trim(),
      phone_number: (form.elements.namedItem("phone_number") as HTMLInputElement).value.trim(),
    }

    // Validation
    if (!data.username || !data.email || !data.password || !data.full_name) {
      setError("Please fill in all required fields.")
      return
    }
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    try {
      const result = await signup(data)
      if ("pendingEmailVerification" in result) {
        // No session yet — user must open the emailed link (/auth/verify-email?token=…)
        console.log("Verify email sent to:", result.email)
        return
      }
      // access_token is stored in localStorage when the API returns a session
      console.log("Signed up:", result.user)
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(message ?? "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return { handleSignupSubmit, loading, error }
}
