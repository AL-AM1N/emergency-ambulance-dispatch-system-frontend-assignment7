"use client"

import { createContext, type ReactNode, useContext, useMemo } from "react"
import { useGetMe } from "@/hooks/auth.hooks"
import { getStoredRole, hasSession } from "@/lib/auth"
import type { Role, User } from "@/types"

interface AuthContextValue {
  user: User | null
  role: Role | null
  isLoading: boolean
  isAuthenticated: boolean
  refetchUser: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasExistingSession = hasSession()
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetMe({ enabled: hasExistingSession })

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? getStoredRole() ?? null
    return {
      user: user ?? null,
      role,
      isLoading,
      isAuthenticated: role !== null && !error,
      refetchUser: () => {
        void refetch()
      },
    }
  }, [user, isLoading, refetch, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
