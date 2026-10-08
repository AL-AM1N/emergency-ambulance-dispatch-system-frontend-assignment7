"use client"

import RoleGuard from "@/components/auth/role-guard"
import DashboardShell from "@/components/dashboard/dashboard-shell"

export default function DriverDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard roles={["DRIVER"]}>
      <DashboardShell userRole="DRIVER">{children}</DashboardShell>
    </RoleGuard>
  )
}
