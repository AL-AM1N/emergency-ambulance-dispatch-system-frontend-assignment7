"use client"

import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  UserIcon,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth.context"
import { formatDate } from "@/lib/format"

export default function PatientProfilePage() {
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
        description="Your account and contact information."
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
            <p className="text-sm text-muted-foreground">Patient account</p>
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
              <PhoneCallIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Contact number</p>
                <p className="font-medium">
                  {user.patient?.contactNumber || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{user.patient?.address || "—"}</p>
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
            <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              To update your contact details, please contact our support team —
              profile changes are managed by the dispatch center.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
