import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  hint?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
