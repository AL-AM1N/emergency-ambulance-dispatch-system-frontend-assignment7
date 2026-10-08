"use client"

import { useRouter } from "next/navigation"
import { type ReactNode, useEffect } from "react"
import { useAuth } from "@/context/auth.context"
import AuthLoading from "./auth-loading"

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

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

  return <>{children}</>
}
