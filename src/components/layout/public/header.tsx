"use client"

import { MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Brand } from "@/components/brand/brand"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth.context"
import { roleHome } from "@/lib/auth"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Hospitals", href: "/hospitals" },
  { title: "Contact", href: "/contact" },
  { title: "FAQ", href: "/faq" },
]

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated, role } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showDashboard = mounted && isAuthenticated && Boolean(role)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Brand showSubtitle />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {showDashboard ? (
            <Button size="sm" render={<Link href={roleHome(role)} />}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  pathname === item.href
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {showDashboard ? (
                <Button
                  size="sm"
                  className="flex-1"
                  render={<Link href={roleHome(role)} />}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    render={<Link href="/login" />}
                  >
                    Log in
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    render={<Link href="/register" />}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
