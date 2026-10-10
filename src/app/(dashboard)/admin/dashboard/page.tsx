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
import { ContentSwap, FadeIn, Stagger, StaggerItem } from "@/components/motion"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCardsSkeleton } from "@/components/shared/skeletons"
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

  const ambulanceData = stats
    ? [
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
    : []

  const revenueData =
    revenue?.dailyRevenue.map((bucket) => ({
      date: bucket.date.slice(5),
      amount: bucket.amount,
    })) ?? []

  const stateKey = isError ? "error" : isLoading || !stats ? "loading" : "ready"

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

      <ContentSwap stateKey={stateKey}>
        {isError && (
          <EmptyState
            icon={ActivityIcon}
            title="Could not load dashboard"
            description="Please try refreshing the page."
          />
        )}

        {(isLoading || !stats) && !isError && (
          <StatCardsSkeleton count={4} className="grid gap-4 md:grid-cols-4" />
        )}

        {!isError && !isLoading && stats && (
          <>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  icon={SirenIcon}
                  hint={`${stats.pendingRequests} pending`}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Active Trips"
                  value={stats.activeTrips}
                  icon={ActivityIcon}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Completed"
                  value={stats.completedTrips}
                  icon={CheckCircle2Icon}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Cancelled"
                  value={stats.cancelledTrips}
                  icon={BanknoteIcon}
                />
              </StaggerItem>
            </Stagger>

            <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <StatCard
                  title="Fleet"
                  value={`${stats.ambulances.available}/${stats.ambulances.total}`}
                  icon={AmbulanceIcon}
                  hint="available"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Drivers"
                  value={stats.totalDrivers}
                  icon={UsersIcon}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Hospitals"
                  value={stats.totalHospitals}
                  icon={ActivityIcon}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title="Revenue"
                  value={stats.totalRevenue}
                  icon={BanknoteIcon}
                  format={formatCurrency}
                />
              </StaggerItem>
            </Stagger>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <Card className="h-full">
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
                            <linearGradient
                              id="revenue"
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
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
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
              </FadeIn>

              <FadeIn delay={0.08}>
                <Card className="h-full">
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
              </FadeIn>
            </div>

            <FadeIn className="mt-6">
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
                        <Bar
                          dataKey="value"
                          fill="#dc2626"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </>
        )}
      </ContentSwap>
    </div>
  )
}
