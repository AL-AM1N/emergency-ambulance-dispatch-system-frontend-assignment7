"use client"

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  MapPinIcon,
  PhoneCallIcon,
  RouteIcon,
  SirenIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { ContentSwap } from "@/components/motion"
import { EmptyState } from "@/components/shared/empty-state"
import { CardSkeleton } from "@/components/shared/skeletons"
import { TripStatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useAcceptTrip,
  useGetDriverTripById,
  useUpdateTripStatus,
} from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { DRIVER_ROUTES } from "@/routes"
import type { DriverTripStatusStep, TripStatus } from "@/types"

const NEXT_ACTION: Partial<
  Record<TripStatus, { step: DriverTripStatusStep; label: string }>
> = {
  ACCEPTED: { step: "EN_ROUTE", label: "Start en route" },
  EN_ROUTE: { step: "PICKED_UP", label: "Mark patient picked up" },
  PICKED_UP: { step: "HOSPITAL_ARRIVED", label: "Arrived at hospital" },
  HOSPITAL_ARRIVED: { step: "COMPLETED", label: "Complete trip" },
}

export default function DriverTripDetailPage() {
  const params = useParams<{ id: string }>()
  const id = String(params?.id ?? "")
  const { data: trip, isLoading, isError } = useGetDriverTripById(id)
  const acceptTrip = useAcceptTrip()
  const updateStatus = useUpdateTripStatus()

  const action = trip ? NEXT_ACTION[trip.status] : undefined

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Trip details"
        description={trip ? `Trip #${shortId(trip.id)}` : undefined}
      />

      <ContentSwap
        stateKey={
          isLoading ? "loading" : isError ? "error" : trip ? "ready" : "empty"
        }
      >
        {isLoading && <CardSkeleton lines={6} />}

        {!isLoading && isError && (
          <EmptyState
            icon={RouteIcon}
            title="Could not load the trip"
            description="It may have been removed, or you do not have access."
          />
        )}

        {!isLoading && !isError && trip && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <SirenIcon className="size-5 text-red-600" />
                  {trip.emergencyType.replace("_", " ")} emergency
                </CardTitle>
                <TripStatusBadge status={trip.status} />
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Patient</p>
                      <p className="font-medium">{trip.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneCallIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{trip.patientContact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Pickup location</p>
                      <p className="font-medium">{trip.pickupLocation}</p>
                    </div>
                  </div>
                  {trip.hospital && (
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Hospital</p>
                      <p className="font-medium">
                        {trip.hospital.name} — {trip.hospital.address}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Fare</p>
                    <p className="font-medium">
                      {trip.fare
                        ? `${formatCurrency(trip.fare)}${trip.distanceKm ? ` (${trip.distanceKm} km)` : ""}`
                        : "Calculated on arrival"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned</p>
                    <p className="font-medium">
                      {formatDateTime(trip.assignedAt)}
                    </p>
                  </div>
                  {trip.completedAt && (
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-medium">
                        {formatDateTime(trip.completedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              {trip.status === "ASSIGNED" && (
                <Button onClick={() => acceptTrip.mutate(trip.id)}>
                  <CheckCircle2Icon className="size-4" />
                  Accept trip
                </Button>
              )}
              {action && trip.status !== "COMPLETED" && (
                <Button
                  onClick={() =>
                    updateStatus.mutate({ id: trip.id, status: action.step })
                  }
                >
                  <ArrowRightIcon className="size-4" />
                  {action.label}
                </Button>
              )}
              <Button
                variant="outline"
                render={<Link href={DRIVER_ROUTES.trips} />}
              >
                Back to trips
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Journey progress</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                {(
                  [
                    "ASSIGNED",
                    "EN_ROUTE",
                    "PICKED_UP",
                    "HOSPITAL_ARRIVED",
                    "COMPLETED",
                  ] as const
                ).map((step, index) => {
                  const order = [
                    "ASSIGNED",
                    "EN_ROUTE",
                    "PICKED_UP",
                    "HOSPITAL_ARRIVED",
                    "COMPLETED",
                  ]
                  const active = order.indexOf(trip.status) >= index
                  return (
                    <div
                      key={step}
                      className={`rounded-lg border p-3 ${active ? "border-red-300 bg-red-50" : "opacity-50"}`}
                    >
                      <p className="font-medium">{step.replace("_", " ")}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </ContentSwap>
    </div>
  )
}
