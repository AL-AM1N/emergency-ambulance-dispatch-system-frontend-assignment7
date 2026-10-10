"use client"

import { PhoneCall, ShieldAlertIcon } from "lucide-react"
import { ContentSwap, Stagger, StaggerItem } from "@/components/motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetEmergencyInfo } from "@/hooks"
import { formatPhone } from "@/lib/format"

export function EmergencyStrip() {
  const { data, isLoading, isError } = useGetEmergencyInfo()

  const primaryContacts = data?.contacts.filter((contact) => contact.isActive)

  const stateKey = isLoading ? "loading" : isError || !data ? "error" : "ready"

  return (
    <ContentSwap stateKey={stateKey}>
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-3 p-5">
                <Skeleton className="size-11 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (isError || !data) && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <ShieldAlertIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Emergency information is temporarily unavailable.
          </p>
          <p className="font-semibold text-red-600">
            In an emergency, always call your local emergency number first.
          </p>
        </div>
      )}

      {!isLoading && !isError && data && (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {primaryContacts?.slice(0, 4).map((contact) => (
            <StaggerItem key={contact.id}>
              <Card>
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
            </StaggerItem>
          ))}
          {primaryContacts?.length === 0 && (
            <StaggerItem className="sm:col-span-2 lg:col-span-4">
              <Card>
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <PhoneCall className="size-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Emergency contact information is being configured. Please
                    call your local emergency number.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          )}
        </Stagger>
      )}
    </ContentSwap>
  )
}
