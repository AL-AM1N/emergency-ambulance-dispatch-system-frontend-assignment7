import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const CELL_WIDTHS = ["w-24", "w-16", "w-20", "w-16", "w-24", "w-20"]

interface TableSkeletonProps {
  columns?: number
  rows?: number
}

export function TableSkeleton({ columns = 5, rows = 5 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton
                  className={cn(
                    "h-4",
                    CELL_WIDTHS[colIndex % CELL_WIDTHS.length],
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface StatCardsSkeletonProps {
  count?: number
  className?: string
}

export function StatCardsSkeleton({
  count = 4,
  className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
}: StatCardsSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  lines?: number
  className?: string
}

export function CardSkeleton({ lines = 4, className }: CardSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}
