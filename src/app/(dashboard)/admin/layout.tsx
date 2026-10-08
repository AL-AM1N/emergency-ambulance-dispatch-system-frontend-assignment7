"use client"

import RoleGuard from "@/components/auth/role-guard"
import DashboardShell from "@/components/dashboard/dashboard-shell"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <DashboardShell userRole="ADMIN">{children}</DashboardShell>
    </RoleGuard>
  )
}
