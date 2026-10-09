"use client"

import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  KeyRoundIcon,
  MailIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth.context"
import { formatDate } from "@/lib/format"

export default function AdminProfilePage() {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) {
    return (
      <div className="grid h-64 animate-pulse place-items-center rounded-xl bg-muted" />
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Your administrator account details."
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {user.name}
              <BadgeCheckIcon className="size-4 text-emerald-600" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Administrator account
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">Administrator</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <KeyRoundIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Sign-in method</p>
                <p className="font-medium">
                  {user.authProvider === "GOOGLE"
                    ? "Google"
                    : "Email and password"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Member since</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <UserRoundIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              Administrator profiles are managed by the system owner — contact
              them if your name or email needs to be updated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
