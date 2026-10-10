"use client"

import { RouteIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { EmptyState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/skeletons"
import { TripStatusBadge } from "@/components/shared/status-badge"
import TablePagination from "@/components/shared/table-pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetDriverTrips } from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { pickParam, updateSearchParams } from "@/lib/url"
import { DRIVER_ROUTES } from "@/routes"
import { TRIP_STATUSES, type TripStatus } from "@/types"

function TripsView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const status = pickParam(searchParams, "status") as TripStatus | ""

  const { data, isLoading, isError } = useGetDriverTrips({
    page,
    limit: 10,
    status,
  })

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  return (
    <div>
      <PageHeader
        title="My Trips"
        description="Trips assigned to your ambulance."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) =>
            navigate({ status: event.target.value, page: 1 })
          }
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          {TRIP_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>
        {status && (
          <Button variant="ghost" size="sm" onClick={() => router.replace("?")}>
            Reset
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && <TableSkeleton columns={7} />}

          {!isLoading && isError && (
            <div className="p-6">
              <EmptyState
                icon={RouteIcon}
                title="Could not load trips"
                description="Please try refreshing the page."
              />
            </div>
          )}

          {!isLoading && !isError && data && data.result.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={RouteIcon}
                title="No trips found"
                description="Assigned trips will appear here."
              />
            </div>
          )}

          {!isLoading && !isError && data && data.result.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.result.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-mono text-xs">
                        {shortId(trip.id)}
                      </TableCell>
                      <TableCell>
                        {trip.emergencyType.replace("_", " ")}
                      </TableCell>
                      <TableCell>{trip.patientName}</TableCell>
                      <TableCell>
                        <TripStatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>{formatCurrency(trip.fare)}</TableCell>
                      <TableCell>{formatDateTime(trip.assignedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <Link href={`${DRIVER_ROUTES.trips}/${trip.id}`} />
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t p-4">
                <TablePagination
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={(next) => navigate({ page: next })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DriverTripsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <TripsView />
    </Suspense>
  )
}
