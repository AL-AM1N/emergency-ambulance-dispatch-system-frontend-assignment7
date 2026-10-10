"use client"

import {
  AmbulanceIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Clock3Icon,
  PlusIcon,
  SirenIcon,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { ContentSwap, Stagger, StaggerItem } from "@/components/motion"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCardsSkeleton, TableSkeleton } from "@/components/shared/skeletons"
import { StatCard } from "@/components/shared/stat-card"
import {
  PriorityBadge,
  TripStatusBadge,
} from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetMyTrips } from "@/hooks"
import { formatDateTime, shortId } from "@/lib/format"
import { PATIENT_ROUTES } from "@/routes"

export default function PatientDashboardPage() {
  const { data, isLoading, isError } = useGetMyTrips({ page: 1, limit: 5 })

  const trips = data?.result ?? []
  const completed = trips.filter((trip) =>
    ["COMPLETED", "HOSPITAL_ARRIVED"].includes(trip.status),
  ).length

  const tableState = isLoading
    ? "loading"
    : isError
      ? "error"
      : trips.length === 0
        ? "empty"
        : "ready"

  return (
    <div>
      <PageHeader
        title="Patient Dashboard"
        description="Track your emergency requests and trips."
        actions={
          <Button render={<Link href={PATIENT_ROUTES.newRequest} />}>
            <PlusIcon className="size-4" />
            New Request
          </Button>
        }
      />

      <ContentSwap stateKey={isLoading ? "loading" : "ready"}>
        {isLoading ? (
          <StatCardsSkeleton count={4} />
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <StatCard
                title="Total Trips"
                value={data?.meta.total ?? 0}
                icon={SirenIcon}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Active"
                value={
                  trips.filter((trip) =>
                    [
                      "ASSIGNED",
                      "ACCEPTED",
                      "EN_ROUTE",
                      "PICKED_UP",
                      "HOSPITAL_ARRIVED",
                    ].includes(trip.status),
                  ).length
                }
                icon={AmbulanceIcon}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Completed"
                value={completed}
                icon={CheckCircle2Icon}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Pending"
                value={trips.filter((trip) => trip.status === "PENDING").length}
                icon={Clock3Icon}
              />
            </StaggerItem>
          </Stagger>
        )}
      </ContentSwap>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Trips</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={PATIENT_ROUTES.trips} />}
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ContentSwap stateKey={tableState}>
            {isLoading && <TableSkeleton columns={6} />}

            {!isLoading && isError && (
              <EmptyState
                icon={SirenIcon}
                title="Could not load trips"
                description="Please try refreshing the page."
              />
            )}

            {!isLoading && !isError && trips.length === 0 && (
              <EmptyState
                icon={SirenIcon}
                title="No trips yet"
                description="When you request an ambulance, your trips will appear here."
              />
            )}

            {!isLoading && !isError && trips.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-mono text-xs">
                        {shortId(trip.id)}
                      </TableCell>
                      <TableCell>
                        {trip.emergencyType.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={trip.priority} />
                      </TableCell>
                      <TableCell>
                        <TripStatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>{formatDateTime(trip.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <Link href={`${PATIENT_ROUTES.trips}/${trip.id}`} />
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ContentSwap>
        </CardContent>
      </Card>
    </div>
  )
}
