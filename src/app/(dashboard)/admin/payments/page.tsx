"use client"

import { BanknoteIcon, CreditCardIcon, ReceiptIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCardsSkeleton, TableSkeleton } from "@/components/shared/skeletons"
import { StatCard } from "@/components/shared/stat-card"
import { PaymentStatusBadge } from "@/components/shared/status-badge"
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
import { useGetReportsRevenue, useListTrips } from "@/hooks"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { pickParam, updateSearchParams } from "@/lib/url"
import { ADMIN_ROUTES } from "@/routes"

function PaymentsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(pickParam(searchParams, "page", "1"))

  const { data, isLoading, isError } = useListTrips({ page, limit: 10 })
  const { data: revenue } = useGetReportsRevenue({})

  const paidTrips = (data?.result ?? []).filter((trip) => trip.payment)
  const totalPaid = paidTrips.reduce(
    (sum, trip) => sum + (trip.payment?.amount ?? 0),
    0,
  )

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Review payments collected across completed trips."
      />

      {isLoading ? (
        <StatCardsSkeleton count={3} className="grid gap-4 sm:grid-cols-3" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Revenue (all time)"
            value={formatCurrency(revenue?.totalRevenue ?? 0)}
            icon={BanknoteIcon}
          />
          <StatCard
            title="Transactions (all time)"
            value={revenue?.totalTransactions ?? 0}
            icon={ReceiptIcon}
          />
          <StatCard
            title="Collected (this page)"
            value={formatCurrency(totalPaid)}
            icon={CreditCardIcon}
          />
        </div>
      )}

      <div className="mt-4">
        <Card>
          <CardContent className="p-0">
            {isLoading && <TableSkeleton columns={7} />}

            {!isLoading && isError && (
              <div className="p-6">
                <EmptyState
                  icon={CreditCardIcon}
                  title="Could not load payments"
                  description="Please try refreshing the page."
                />
              </div>
            )}

            {!isLoading && !isError && data && data.result.length === 0 && (
              <div className="p-6">
                <EmptyState
                  icon={CreditCardIcon}
                  title="No trips yet"
                  description="Payments from completed trips will appear here."
                />
              </div>
            )}

            {!isLoading && !isError && data && data.result.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trip</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-mono text-xs">
                          {shortId(trip.id)}
                        </TableCell>
                        <TableCell>{trip.patientName}</TableCell>
                        <TableCell>
                          {trip.payment
                            ? formatCurrency(trip.payment.amount)
                            : "—"}
                        </TableCell>
                        <TableCell>{trip.payment?.method ?? "—"}</TableCell>
                        <TableCell>
                          {trip.payment ? (
                            <PaymentStatusBadge status={trip.payment.status} />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          {trip.payment?.paidAt
                            ? formatDateTime(trip.payment.paidAt)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            render={
                              <Link
                                href={`${ADMIN_ROUTES.requests}/${trip.id}`}
                              />
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
    </div>
  )
}

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <PaymentsView />
    </Suspense>
  )
}
