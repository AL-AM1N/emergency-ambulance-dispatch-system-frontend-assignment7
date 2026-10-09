"use client"

import {
  ActivityIcon,
  BanknoteIcon,
  BarChart3Icon,
  DownloadIcon,
  FileBarChartIcon,
  Loader2Icon,
} from "lucide-react"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGetReportsRevenue, useGetReportsTrips } from "@/hooks"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { TRIP_STATUSES } from "@/types"

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [appliedRange, setAppliedRange] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: "", endDate: "" })

  const { data: revenue, isLoading: revenueLoading } =
    useGetReportsRevenue(appliedRange)
  const { data: tripsReport, isLoading: tripsLoading } =
    useGetReportsTrips(appliedRange)

  const revenueData =
    revenue?.dailyRevenue.map((bucket) => ({
      date: bucket.date.slice(5),
      amount: bucket.amount,
    })) ?? []

  const byStatus =
    tripsReport?.summary?.byStatus.map((entry) => ({
      name: entry.status.replace("_", " "),
      value: entry._count._all,
    })) ?? []

  const applyRange = () => {
    setAppliedRange({ startDate, endDate })
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Revenue and operational analytics."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="startDate">From</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-44"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endDate">To</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-44"
            />
          </div>
          <Button onClick={applyRange}>Apply range</Button>
          {(appliedRange.startDate || appliedRange.endDate) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStartDate("")
                setEndDate("")
                setAppliedRange({ startDate: "", endDate: "" })
              }}
            >
              Reset
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={formatCurrency(revenue?.totalRevenue ?? 0)}
          icon={BanknoteIcon}
        />
        <StatCard
          title="Transactions"
          value={revenue?.totalTransactions ?? 0}
          icon={BarChart3Icon}
        />
        <StatCard
          title="Total Trips"
          value={tripsReport?.summary?.total ?? 0}
          icon={ActivityIcon}
        />
        <StatCard
          title="Period"
          value={
            revenue?.period.startDate
              ? `${revenue.period.startDate?.slice(5) ?? "—"} – ${revenue.period.endDate?.slice(5) ?? "now"}`
              : "All time"
          }
          icon={FileBarChartIcon}
        />
      </div>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Revenue by day</CardTitle>
            <Button
              variant="outline"
              size="sm"
              disabled={revenueLoading}
              onClick={() => {
                const rows = [
                  ["date", "amount", "tripId", "paidAt", "transactionId"],
                  ...(revenue?.transactions.map((t) => [
                    t.paidAt?.slice(0, 10) ?? "",
                    String(t.amount),
                    t.tripId,
                    t.paidAt ? formatDateTime(t.paidAt) : "",
                    t.transactionId ?? "",
                  ]) ?? []),
                ]
                downloadCsv("revenue-report.csv", rows)
              }}
            >
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {revenueLoading && (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" /> Loading report…
              </div>
            )}
            {!revenueLoading &&
              (revenueData.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No revenue in the selected period.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="rep-revenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#dc2626"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#dc2626"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fill="url(#rep-revenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trips by status</CardTitle>
          </CardHeader>
          <CardContent>
            {tripsLoading && (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" /> Loading report…
              </div>
            )}
            {!tripsLoading &&
              (byStatus.length === 0 ? (
                <EmptyState
                  icon={BarChart3Icon}
                  title="No trip data"
                  description="Trips will appear once requests are created."
                />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status tally</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-4">
              {TRIP_STATUSES.map((status) => {
                const count =
                  tripsReport?.summary?.byStatus.find(
                    (entry) => entry.status === status,
                  )?._count._all ?? 0
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {status.replace("_", " ")}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
