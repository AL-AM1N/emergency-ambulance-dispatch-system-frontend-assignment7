"use client"

import { Ambulance as AmbulanceIcon, Loader2Icon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useGetAmbulanceTypes } from "@/hooks"
import { formatCurrency } from "@/lib/format"

export function AmbulanceTypesGrid() {
  const { data, isLoading, isError } = useGetAmbulanceTypes()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" /> Loading ambulance types…
      </div>
    )
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <AmbulanceIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Ambulance types are currently unavailable.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((type) => (
        <Card key={type.id}>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <AmbulanceIcon className="size-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {type.name.replace("_", " ")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {type.description || "Emergency transport service."}
            </p>
            <div className="mt-auto flex items-end justify-between border-t pt-3">
              <div>
                <p className="text-sm font-semibold">
                  Base {formatCurrency(type.baseFare)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(type.perKmRate)} / km
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Capacity {type.capacity}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
