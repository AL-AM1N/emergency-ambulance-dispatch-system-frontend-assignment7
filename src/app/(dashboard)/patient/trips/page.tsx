"use client"

import { BanknoteIcon, Loader2Icon, SirenIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { EmptyState } from "@/components/shared/empty-state"
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
import { useGetMyTrips } from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { pickParam, updateSearchParams } from "@/lib/url"
import { PATIENT_ROUTES } from "@/routes"
import { TRIP_STATUSES, type TripStatus } from "@/types"

function TripsView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const status = pickParam(searchParams, "status") as TripStatus | ""

  const { data, isLoading, isError } = useGetMyTrips({
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
        description="Completed and in-progress ambulance trips."
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
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" /> Loading trips…
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-6">
              <EmptyState
                icon={SirenIcon}
                title="Could not load trips"
                description="Please try refreshing the page."
              />
            </div>
          )}

          {!isLoading && !isError && data && data.result.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={SirenIcon}
                title="No trips found"
                description="Your ambulance trips will appear here once dispatched."
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
                    <TableHead>Status</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Completed</TableHead>
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
                      <TableCell>
                        <TripStatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>{trip.driver?.name ?? "—"}</TableCell>
                      <TableCell>{formatCurrency(trip.fare)}</TableCell>
                      <TableCell>{formatDateTime(trip.completedAt)}</TableCell>
                      <TableCell className="flex justify-end gap-1">
                        {trip.status === "COMPLETED" &&
                          !(
                            trip.payment && trip.payment.status === "COMPLETED"
                          ) && (
                            <Button
                              variant="outline"
                              size="sm"
                              render={
                                <Link
                                  href={`${PATIENT_ROUTES.payment}?tripId=${trip.id}`}
                                />
                              }
                            >
                              <BanknoteIcon className="size-4" />
                              Pay
                            </Button>
                          )}
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

export default function PatientTripsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <TripsView />
    </Suspense>
  )
}
