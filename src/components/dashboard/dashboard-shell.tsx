"use client"

import { ArrowLeftIcon, LogOutIcon, UserCircleIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth.context"
import { useLogout } from "@/hooks/auth.hooks"
import { ADMIN_ROUTES, DRIVER_ROUTES, PATIENT_ROUTES } from "@/routes"
import type { Role } from "@/types"
import { DashboardSidebar } from "./dashboard-sidebar"

const profileHref: Record<Role, string> = {
  ADMIN: ADMIN_ROUTES.profile,
  DRIVER: DRIVER_ROUTES.profile,
  PATIENT: PATIENT_ROUTES.profile,
}

export default function DashboardShell({
  children,
  userRole,
}: {
  children: ReactNode
  userRole: Role
}) {
  const { user } = useAuth()
  const logout = useLogout()

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U"

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-medium outline-none hover:bg-accent"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {initial}
                  </span>
                  <span className="hidden sm:inline">
                    {user?.name ?? "Account"}
                  </span>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href={profileHref[userRole]} />}>
                <UserCircleIcon className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/" />}>
                <ArrowLeftIcon className="size-4" />
                Back to site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout.mutate(undefined)
                }}
              >
                <LogOutIcon className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
