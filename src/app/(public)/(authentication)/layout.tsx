"use client"

import { Link2OffIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AuthLoading from "@/components/auth/auth-loading"
import { Brand } from "@/components/brand/brand"
import { useAuth } from "@/context/auth.context"
import { roleHome } from "@/lib/auth"

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      router.replace(roleHome(role))
    }
  }, [isLoading, isAuthenticated, role, router])

  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand showSubtitle />
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Link2OffIcon className="size-4" />
            Back to site
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
