"use client"

import RoleGuard from "@/components/auth/role-guard"
import DashboardShell from "@/components/dashboard/dashboard-shell"

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard roles={["PATIENT"]}>
      <DashboardShell userRole="PATIENT">{children}</DashboardShell>
    </RoleGuard>
  )
}
