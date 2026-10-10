"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { AnimatedNumber } from "@/components/motion"
import { Card, CardContent } from "@/components/ui/card"
import { springSoft } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  hint?: string
  className?: string
  format?: (value: number) => string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  className,
  format,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springSoft}
      className={cn("h-full", className)}
    >
      <Card className="h-full">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {typeof value === "number" ? (
                <AnimatedNumber value={value} format={format} />
              ) : (
                value
              )}
            </p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
