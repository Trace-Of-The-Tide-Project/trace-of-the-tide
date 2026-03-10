"use client"

import { useEffect, useState } from "react"
import {
  AUTH_STATE_CHANGED_EVENT,
  getStoredUser,
} from "@/services/auth.service"
import type { AuthUser } from "@/types/auth.types"

export function useStoredAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser())

    syncUser()
    window.addEventListener("storage", syncUser)
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncUser)

    return () => {
      window.removeEventListener("storage", syncUser)
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncUser)
    }
  }, [])

  return user
}
