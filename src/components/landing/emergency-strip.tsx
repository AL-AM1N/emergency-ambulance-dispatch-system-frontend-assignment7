"use client"

import { Loader2Icon, PhoneCall, ShieldAlertIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useGetEmergencyInfo } from "@/hooks"
import { formatPhone } from "@/lib/format"

export function EmergencyStrip() {
  const { data, isLoading, isError } = useGetEmergencyInfo()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" /> Loading emergency
        information…
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <ShieldAlertIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Emergency information is temporarily unavailable.
        </p>
        <p className="font-semibold text-red-600">
          In an emergency, always call your local emergency number first.
        </p>
      </div>
    )
  }

  const primaryContacts = data.contacts.filter(
    (contact) => contact.isActive && contact.type === "EMERGENCY",
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {primaryContacts.slice(0, 4).map((contact) => (
        <Card key={contact.id}>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <PhoneCall className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight">
                {formatPhone(contact.phone)}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {contact.name}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      {primaryContacts.length === 0 && (
        <Card className="sm:col-span-2 lg:col-span-4">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <PhoneCall className="size-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              Emergency contact information is being configured. Please call
              your local emergency number.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
