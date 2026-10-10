"use client"

import {
  Ambulance as AmbulanceIcon,
  Building2Icon,
  Loader2Icon,
} from "lucide-react"
import { useState } from "react"
import { ContentSwap, Stagger, StaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetHospitals } from "@/hooks"
import { toTitleCase } from "@/lib/format"
import { HOSPITAL_TYPES } from "@/types"

const FILTERS = ["" as const, ...HOSPITAL_TYPES]

export function HospitalsList() {
  const [type, setType] = useState<"" | (typeof HOSPITAL_TYPES)[number]>("")
  const { data, isLoading, isError } = useGetHospitals({ type })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter || "ALL"}
            variant={type === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setType(filter)}
          >
            {filter === "" ? "All" : toTitleCase(filter)}
          </Button>
        ))}
      </div>

      <ContentSwap
        stateKey={
          isLoading
            ? "loading"
            : isError
              ? "error"
              : data && data.length === 0
                ? "empty"
                : "ready"
        }
      >
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" /> Loading hospitals…
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Building2Icon className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Hospitals are currently unavailable. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Building2Icon className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No hospitals found{type ? ` in ${toTitleCase(type)}` : ""}.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {data.map((hospital) => (
              <StaggerItem key={hospital.id} hoverLift className="h-full">
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Building2Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {toTitleCase(hospital.type)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {hospital.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t pt-3 text-sm">
                      {hospital.contactNumber && (
                        <span className="inline-flex items-center gap-1.5">
                          <AmbulanceIcon className="size-4 text-muted-foreground" />
                          {hospital.contactNumber}
                        </span>
                      )}
                      {hospital.email && (
                        <span className="truncate text-muted-foreground">
                          {hospital.email}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </ContentSwap>
    </div>
  )
}
