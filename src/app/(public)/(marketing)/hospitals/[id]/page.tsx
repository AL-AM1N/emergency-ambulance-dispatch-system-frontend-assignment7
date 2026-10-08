"use client"

import {
  ArrowLeftIcon,
  Building2Icon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGetHospital } from "@/hooks"
import { toTitleCase } from "@/lib/format"

export default function HospitalDetailPage() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetHospital(String(params?.id ?? ""))

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        render={<Link href="/hospitals" />}
      >
        <ArrowLeftIcon className="size-4" />
        All hospitals
      </Button>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading hospital…
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Building2Icon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This hospital could not be loaded.
          </p>
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Building2Icon className="size-5" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {data.name}
                  </h1>
                </div>
                <p className="mt-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {toTitleCase(data.type)}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4 text-sm">
              <p className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {data.address}
              </p>
              {data.contactNumber && (
                <p className="flex items-center gap-3">
                  <PhoneCallIcon className="size-4 shrink-0 text-muted-foreground" />
                  {data.contactNumber}
                </p>
              )}
              {data.email && (
                <p className="flex items-center gap-3">
                  <MailIcon className="size-4 shrink-0 text-muted-foreground" />
                  {data.email}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            This hospital is part of the AmbuLink dispatch network. In an
            emergency, request an ambulance and select your preferred hospital
            from your patient dashboard.
          </div>
        </div>
      )}
    </div>
  )
}
