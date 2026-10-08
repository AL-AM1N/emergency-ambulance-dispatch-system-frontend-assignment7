"use client"

import { useRouter } from "next/navigation"
import { type ReactNode, useEffect } from "react"
import { useAuth } from "@/context/auth.context"
import type { Role } from "@/types"
import AccessDenied from "./access-denied"
import AuthLoading from "./auth-loading"

export default function RoleGuard({
  children,
  roles,
}: {
  children: ReactNode
  roles: Role[]
}) {
  const router = useRouter()
  const { role, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <AuthLoading label="Redirecting..." />
  }

  if (role && roles.includes(role)) {
    return <>{children}</>
  }

  return <AccessDenied />
}
