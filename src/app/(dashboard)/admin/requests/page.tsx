"use client"

import { Loader2Icon, SirenIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { EmptyState } from "@/components/shared/empty-state"
import {
  PriorityBadge,
  TripStatusBadge,
} from "@/components/shared/status-badge"
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
import { useListEmergencyRequests } from "@/hooks"
import { formatDateTime, shortId } from "@/lib/format"
import { pickParam, updateSearchParams } from "@/lib/url"
import { ADMIN_ROUTES } from "@/routes"
import {
  PRIORITIES,
  type Priority,
  TRIP_STATUSES,
  type TripStatus,
} from "@/types"

function RequestsView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const status = pickParam(searchParams, "status") as TripStatus | ""
  const priority = pickParam(searchParams, "priority") as Priority | ""

  const { data, isLoading, isError } = useListEmergencyRequests({
    page,
    limit: 10,
    status,
    priority,
  })

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  return (
    <div>
      <PageHeader
        title="Emergency Requests"
        description="Review, prioritize and dispatch incoming requests."
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
        <select
          aria-label="Filter by priority"
          value={priority}
          onChange={(event) =>
            navigate({ priority: event.target.value, page: 1 })
          }
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {(status || priority) && (
          <Button variant="ghost" size="sm" onClick={() => router.replace("?")}>
            Reset
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" /> Loading requests…
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-6">
              <EmptyState
                icon={SirenIcon}
                title="Could not load requests"
                description="Please try refreshing the page."
              />
            </div>
          )}

          {!isLoading && !isError && data && data.result.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={SirenIcon}
                title="No requests found"
                description="New emergency requests will appear here."
              />
            </div>
          )}

          {!isLoading && !isError && data && data.result.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.result.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs">
                        {shortId(request.id)}
                      </TableCell>
                      <TableCell>{request.patientName}</TableCell>
                      <TableCell>
                        {request.emergencyType.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={request.priority} />
                      </TableCell>
                      <TableCell>
                        <TripStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>{formatDateTime(request.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <Link
                              href={`${ADMIN_ROUTES.requests}/${request.id}`}
                            />
                          }
                        >
                          Manage
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

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RequestsView />
    </Suspense>
  )
}
