"use client"

import {
  ActivityIcon,
  AmbulanceIcon,
  BanknoteIcon,
  CheckCircle2Icon,
  SirenIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import { useGetDashboardStats, useGetReportsRevenue } from "@/hooks"
import { formatCurrency } from "@/lib/format"
import { ADMIN_ROUTES } from "@/routes"

const AMBULANCE_COLORS: Record<string, string> = {
  AVAILABLE: "#16a34a",
  BUSY: "#f59e0b",
  MAINTENANCE: "#64748b",
  INACTIVE: "#e11d48",
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useGetDashboardStats()
  const { data: revenue } = useGetReportsRevenue({})

  if (isError) {
    return (
      <EmptyState
        icon={ActivityIcon}
        title="Could not load dashboard"
        description="Please try refreshing the page."
      />
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  const ambulanceData = [
    {
      name: "Available",
      value: stats.ambulances.available,
      color: AMBULANCE_COLORS.AVAILABLE,
    },
    {
      name: "Busy",
      value: stats.ambulances.busy,
      color: AMBULANCE_COLORS.BUSY,
    },
    {
      name: "Maintenance",
      value: stats.ambulances.maintenance,
      color: AMBULANCE_COLORS.MAINTENANCE,
    },
  ].filter((item) => item.value > 0)

  const revenueData =
    revenue?.dailyRevenue.map((bucket) => ({
      date: bucket.date.slice(5),
      amount: bucket.amount,
    })) ?? []

  return (
    <div>
      <PageHeader
        title="Dispatch Overview"
        description="Real-time overview of the dispatch network."
        actions={
          <Button render={<Link href={ADMIN_ROUTES.requests} />}>
            View Requests
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={SirenIcon}
          hint={`${stats.pendingRequests} pending`}
        />
        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          icon={ActivityIcon}
        />
        <StatCard
          title="Completed"
          value={stats.completedTrips}
          icon={CheckCircle2Icon}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelledTrips}
          icon={BanknoteIcon}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Fleet"
          value={`${stats.ambulances.available}/${stats.ambulances.total}`}
          icon={AmbulanceIcon}
          hint="available"
        />
        <StatCard title="Drivers" value={stats.totalDrivers} icon={UsersIcon} />
        <StatCard
          title="Hospitals"
          value={stats.totalHospitals}
          icon={ActivityIcon}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={BanknoteIcon}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No revenue data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
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
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {ambulanceData.length === 0 ? (
              <p className="py-16 text-sm text-muted-foreground">
                No ambulances registered.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={ambulanceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {ambulanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Volume (this week)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.pendingRequests +
              stats.activeTrips +
              stats.completedTrips ===
            0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No request activity yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { name: "Pending", value: stats.pendingRequests },
                    { name: "Active", value: stats.activeTrips },
                    { name: "Completed", value: stats.completedTrips },
                    { name: "Cancelled", value: stats.cancelledTrips },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
