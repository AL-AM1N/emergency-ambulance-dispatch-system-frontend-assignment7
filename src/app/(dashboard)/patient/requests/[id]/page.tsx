"use client"

import {
  BanknoteIcon,
  MapPinIcon,
  PhoneCallIcon,
  SirenIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { CardSkeleton } from "@/components/shared/skeletons"
import {
  PaymentStatusBadge,
  PriorityBadge,
  TripStatusBadge,
} from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCancelEmergencyRequest, useGetEmergencyRequest } from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { PATIENT_ROUTES } from "@/routes"
import type { TripStatus } from "@/types"

const CANCELLABLE: TripStatus[] = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
]

export default function PatientRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = String(params?.id ?? "")
  const { data: trip, isLoading, isError } = useGetEmergencyRequest(id)
  const cancelRequest = useCancelEmergencyRequest()
  const [cancelling, setCancelling] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const canCancel = trip ? CANCELLABLE.includes(trip.status) : false

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelRequest.mutateAsync(id)
      setCancelOpen(false)
    } catch {
      // Toast already shown.
    } finally {
      setCancelling(false)
    }
  }

  const needsPayment =
    trip &&
    trip.status === "COMPLETED" &&
    !(trip.payment && trip.payment.status === "COMPLETED") &&
    Boolean(trip.fare)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Request details"
        description={trip ? `Request #${shortId(trip.id)}` : undefined}
      />

      {isLoading && <CardSkeleton lines={6} />}

      {!isLoading && isError && (
        <EmptyState
          icon={SirenIcon}
          title="Could not load the request"
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
                    <p className="text-xs text-muted-foreground">
                      {trip.hospital.address}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Fare</p>
                  <p className="font-medium">
                    {formatCurrency(trip.fare)} J{" "}
                    <span className="text-xs text-muted-foreground">
                      / {trip.distanceKm ? `${trip.distanceKm} km` : "—"}
                    </span>
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
            {canCancel && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setCancelOpen(true)}
                >
                  Cancel request
                </Button>
                <ConfirmDialog
                  open={cancelOpen}
                  onOpenChange={setCancelOpen}
                  title="Cancel this request?"
                  description="The ambulance assignment will be released. This action cannot be undone."
                  confirmLabel="Yes, cancel"
                  pendingLabel="Cancelling…"
                  isPending={cancelling}
                  onConfirm={() => void handleCancel()}
                />
              </>
            )}

            {needsPayment && (
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
              render={<Link href={PATIENT_ROUTES.requests} />}
            >
              Back to requests
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
