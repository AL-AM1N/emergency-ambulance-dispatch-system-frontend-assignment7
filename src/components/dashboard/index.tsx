export { default as DashboardShell } from "./dashboard-shell"
export { DashboardSidebar } from "./dashboard-sidebar"
export { PageHeader } from "./page-header"

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}
