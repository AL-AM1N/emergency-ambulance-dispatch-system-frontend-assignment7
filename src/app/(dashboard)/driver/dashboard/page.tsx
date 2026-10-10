"use client"

import {
  AmbulanceIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
  RouteIcon,
  SirenIcon,
  UserRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import {
  CardSkeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/shared/skeletons"
import { StatCard } from "@/components/shared/stat-card"
import { TripStatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useAcceptTrip,
  useGetCurrentTrip,
  useGetDriverProfile,
  useGetDriverTrips,
  useUpdateAvailability,
  useUpdateTripStatus,
} from "@/hooks"
import { formatCurrency, shortId } from "@/lib/format"
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

function CurrentTripCard() {
  const { data: trip, isLoading } = useGetCurrentTrip()
  const acceptTrip = useAcceptTrip()
  const updateStatus = useUpdateTripStatus()

  if (isLoading) {
    return <CardSkeleton lines={5} />
  }

  if (!trip) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <RouteIcon className="size-8 text-muted-foreground" />
          </div>
          <p className="font-medium">No active trip</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            You are free. New dispatch requests will appear here as soon as the
            dispatch center assigns them to you.
          </p>
        </CardContent>
      </Card>
    )
  }

  const action = NEXT_ACTION[trip.status]

  return (
    <Card className="border-l-4 border-l-red-600">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <SirenIcon className="size-5 text-red-600" />
          Active trip
        </CardTitle>
        <TripStatusBadge status={trip.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Emergency</p>
            <p className="font-medium">
              {trip.emergencyType.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Priority</p>
            <p className="font-medium">{trip.priority}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">Pickup location</p>
            <p className="font-medium">{trip.pickupLocation}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Patient</p>
            <p className="font-medium">{trip.patientName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-medium">{trip.patientContact}</p>
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
              {trip.fare ? formatCurrency(trip.fare) : "Calculated on arrival"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
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
            render={<Link href={`${DRIVER_ROUTES.trips}/${trip.id}`} />}
          >
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DriverDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetDriverProfile()
  const { data: tripsData, isLoading: tripsLoading } = useGetDriverTrips({
    page: 1,
    limit: 5,
  })
  const updateAvailability = useUpdateAvailability()

  const trips = tripsData?.result ?? []

  return (
    <div>
      <PageHeader
        title="Driver Dashboard"
        description="Monitor your availability and active assignments."
      />

      {tripsLoading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="My Trips"
            value={tripsData?.meta.total ?? 0}
            icon={RouteIcon}
          />
          <StatCard
            title="Completed"
            value={trips.filter((trip) => trip.status === "COMPLETED").length}
            icon={CheckCircle2Icon}
          />
          <StatCard
            title="Vehicle"
            value={profile?.vehicleNumber ?? "—"}
            icon={AmbulanceIcon}
          />
          <StatCard
            title="Availability"
            value={profile?.isAvailable ? "Online" : "Offline"}
            icon={UserRoundIcon}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentTripCard />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Availability
                {profileLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <Switch
                    checked={Boolean(profile?.isAvailable)}
                    onCheckedChange={(checked) =>
                      updateAvailability.mutate(checked)
                    }
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {profile?.isAvailable
                ? "You are online and will receive dispatch requests."
                : "You are offline and will not receive dispatch requests."}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Trips</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={DRIVER_ROUTES.trips} />}
              >
                View all
                <ArrowRightIcon className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {tripsLoading && <TableSkeleton columns={3} rows={3} />}
              {!tripsLoading && trips.length === 0 && (
                <div className="p-4">
                  <EmptyState
                    icon={SirenIcon}
                    title="No trips yet"
                    description="Your assigned trips will show up here."
                  />
                </div>
              )}
              {!tripsLoading && trips.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fare</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-mono text-xs">
                          {shortId(trip.id)}
                        </TableCell>
                        <TableCell>
                          <TripStatusBadge status={trip.status} />
                        </TableCell>
                        <TableCell>{formatCurrency(trip.fare)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
