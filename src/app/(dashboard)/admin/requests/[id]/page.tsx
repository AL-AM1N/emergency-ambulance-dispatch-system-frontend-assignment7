"use client"

import {
  AmbulanceIcon,
  HospitalIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneCallIcon,
  SirenIcon,
  TagIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import {
  PriorityBadge,
  TripStatusBadge,
} from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  useAssignAmbulance,
  useChangePriority,
  useGetAdminEmergencyRequest,
  useListAmbulances,
  useListHospitals,
  useSelectHospital,
} from "@/hooks"
import { formatDateTime, shortId } from "@/lib/format"
import { ADMIN_ROUTES } from "@/routes"
import { PRIORITIES } from "@/types"

const STEPS = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "PICKED_UP",
  "HOSPITAL_ARRIVED",
  "COMPLETED",
]

export default function AdminRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = String(params?.id ?? "")
  const { data: request, isLoading, isError } = useGetAdminEmergencyRequest(id)

  const { data: ambulancesData } = useListAmbulances({
    page: 1,
    limit: 100,
    status: "AVAILABLE",
  })
  const { data: hospitalsData } = useListHospitals({ page: 1, limit: 100 })

  const changePriority = useChangePriority()
  const assignAmbulance = useAssignAmbulance()
  const selectHospital = useSelectHospital()

  const ambulances = ambulancesData?.result ?? []
  const hospitals = hospitalsData?.result ?? []

  const activeStep = Math.max(
    STEPS.indexOf(request?.status ?? "PENDING"),
    request?.status === "CANCELLED" ? STEPS.length : 0,
  )

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Manage request"
        description={request ? `Request #${shortId(request.id)}` : undefined}
        actions={
          <Button
            variant="outline"
            render={<Link href={ADMIN_ROUTES.requests} />}
          >
            Back to requests
          </Button>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading request…
        </div>
      )}

      {!isLoading && isError && (
        <EmptyState
          icon={SirenIcon}
          title="Could not load the request"
          description="It may have been removed, or you do not have access."
        />
      )}

      {!isLoading && !isError && request && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <SirenIcon className="size-5 text-red-600" />
                {request.emergencyType.replace("_", " ")} emergency
              </CardTitle>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={request.priority} />
                <TripStatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Patient</p>
                  <p className="font-medium">{request.patientName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneCallIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{request.patientContact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Pickup location</p>
                  <p className="font-medium">{request.pickupLocation}</p>
                </div>
              </div>
              {request.additionalNote && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Additional note</p>
                  <p className="font-medium">{request.additionalNote}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Requested</p>
                <p className="font-medium">
                  {formatDateTime(request.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fare</p>
                <p className="font-medium">
                  {request.fare
                    ? `$${request.fare.toFixed(2)}${request.distanceKm ? ` (${request.distanceKm} km)` : ""}`
                    : "Calculated on arrival"}
                </p>
              </div>
              {request.driver && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Assigned driver</p>
                  <p className="font-medium">
                    {request.driver.name} ({request.driver.contactNumber}) —{" "}
                    {request.driver.vehicleNumber}
                  </p>
                </div>
              )}
              {request.hospital && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Hospital</p>
                  <p className="font-medium">
                    {request.hospital.name} — {request.hospital.address}
                  </p>
                </div>
              )}
              {request.cancelledReason && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Cancellation reason</p>
                  <p className="font-medium">{request.cancelledReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dispatch controls</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <TagIcon className="size-4" /> Priority
                </Label>
                <select
                  id="priority"
                  value={request.priority}
                  onChange={(event) =>
                    changePriority.mutate({
                      id: request.id,
                      payload: {
                        priority: event.target
                          .value as (typeof PRIORITIES)[number],
                      },
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambulance" className="flex items-center gap-2">
                  <AmbulanceIcon className="size-4" /> Assign ambulance
                </Label>
                <select
                  id="ambulance"
                  value={request.ambulanceId ?? ""}
                  onChange={(event) => {
                    const ambulanceId = event.target.value
                    if (ambulanceId) {
                      assignAmbulance.mutate({
                        id: request.id,
                        payload: { ambulanceId },
                      })
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    {request.ambulance ? "Assigned" : "Choose available…"}
                  </option>
                  {ambulances.map((ambulance) => (
                    <option key={ambulance.id} value={ambulance.id}>
                      {ambulance.vehicleNumber}
                      {ambulance.driver
                        ? ` — ${ambulance.driver.name}`
                        : " (no driver)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital" className="flex items-center gap-2">
                  <HospitalIcon className="size-4" /> Destination hospital
                </Label>
                <select
                  id="hospital"
                  value={request.hospitalId ?? ""}
                  onChange={(event) => {
                    const hospitalId = event.target.value
                    if (hospitalId) {
                      selectHospital.mutate({
                        id: request.id,
                        payload: { hospitalId },
                      })
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    {request.hospital ? "Selected" : "Choose hospital…"}
                  </option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {request.status === "CANCELLED" ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  This request was cancelled
                  {request.cancelledReason
                    ? ` — ${request.cancelledReason}`
                    : ""}
                  .
                </div>
              ) : (
                <ol className="flex flex-wrap items-center gap-2 text-xs">
                  {STEPS.map((step, index) => (
                    <li key={step} className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 ${index <= activeStep ? "border-red-300 bg-red-50 font-medium text-red-700" : "text-muted-foreground"}`}
                      >
                        {index + 1}. {step.replace("_", " ")}
                      </span>
                      {index < STEPS.length - 1 && <span>→</span>}
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
