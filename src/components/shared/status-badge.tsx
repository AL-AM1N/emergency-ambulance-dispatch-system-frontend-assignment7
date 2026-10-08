import type { ComponentProps } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  AmbulanceStatus,
  PaymentStatus,
  Priority,
  TripStatus,
} from "@/types"

const tripStatusStyles: Record<TripStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  ASSIGNED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  ACCEPTED: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  EN_ROUTE: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  PICKED_UP: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  HOSPITAL_ARRIVED: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  COMPLETED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CANCELLED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
}

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  MEDIUM: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  HIGH: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  CRITICAL: "bg-rose-100 text-rose-700 hover:bg-rose-100",
}

const ambulanceStatusStyles: Record<AmbulanceStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  BUSY: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  MAINTENANCE: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  INACTIVE: "bg-rose-100 text-rose-700 hover:bg-rose-100",
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  COMPLETED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  FAILED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
}

type BadgeProps = ComponentProps<typeof Badge>

export function TripStatusBadge({
  status,
  className,
}: { status: TripStatus } & BadgeProps) {
  return (
    <Badge className={cn(tripStatusStyles[status], className)}>
      {status.replace("_", " ")}
    </Badge>
  )
}

export function PriorityBadge({
  priority,
  className,
}: { priority: Priority } & BadgeProps) {
  return (
    <Badge className={cn(priorityStyles[priority], className)}>
      {priority}
    </Badge>
  )
}

export function AmbulanceStatusBadge({
  status,
  className,
}: { status: AmbulanceStatus } & BadgeProps) {
  return (
    <Badge className={cn(ambulanceStatusStyles[status], className)}>
      {status.replace("_", " ")}
    </Badge>
  )
}

export function PaymentStatusBadge({
  status,
  className,
}: { status: PaymentStatus } & BadgeProps) {
  return (
    <Badge className={cn(paymentStatusStyles[status], className)}>
      {status.replace("_", " ")}
    </Badge>
  )
}
