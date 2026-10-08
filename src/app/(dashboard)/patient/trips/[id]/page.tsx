"use client"

import {
  BanknoteIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneCallIcon,
  SirenIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import {
  PaymentStatusBadge,
  PriorityBadge,
  TripStatusBadge,
} from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetTripById } from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { PATIENT_ROUTES } from "@/routes"

export default function PatientTripDetailPage() {
  const params = useParams<{ id: string }>()
  const id = String(params?.id ?? "")
  const { data: trip, isLoading, isError } = useGetTripById(id)

  const needsPayment =
    trip && trip.status === "COMPLETED" && trip.payment?.status !== "COMPLETED"

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Trip details"
        description={trip ? `Trip #${shortId(trip.id)}` : undefined}
      />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading trip…
        </div>
      )}

      {!isLoading && isError && (
        <EmptyState
          icon={SirenIcon}
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
              <div className="flex items-center gap-2">
                <PriorityBadge priority={trip.priority} />
                <TripStatusBadge status={trip.status} />
              </div>
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
                {trip.additionalNote && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <StethoscopeIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Note</p>
                      <p>{trip.additionalNote}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
                {trip.driver && (
                  <div>
                    <p className="text-muted-foreground">Driver</p>
                    <p className="font-medium">{trip.driver.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {trip.driver.vehicleNumber}
                    </p>
                  </div>
                )}
                {trip.hospital && (
                  <div>
                    <p className="text-muted-foreground">Hospital</p>
                    <p className="font-medium">{trip.hospital.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Fare</p>
                  <p className="font-medium">
                    {formatCurrency(trip.fare)}{" "}
                    {trip.distanceKm ? (
                      <span className="text-xs text-muted-foreground">
                        ({trip.distanceKm} km)
                      </span>
                    ) : null}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment</p>
                  {trip.payment ? (
                    <PaymentStatusBadge status={trip.payment.status} />
                  ) : (
                    <span className="text-muted-foreground">Not started</span>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Requested</p>
                  <p className="font-medium">
                    {formatDateTime(trip.createdAt)}
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
            {needsPayment && trip.fare && (
              <Button
                render={
                  <Link href={`${PATIENT_ROUTES.payment}?tripId=${trip.id}`} />
                }
              >
                <BanknoteIcon className="size-4" />
                Pay {formatCurrency(trip.fare)}
              </Button>
            )}
            <Button
              variant="outline"
              render={<Link href={PATIENT_ROUTES.trips} />}
            >
              Back to trips
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
