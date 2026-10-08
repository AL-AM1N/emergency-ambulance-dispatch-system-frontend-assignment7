"use client"

import { TriangleAlertIcon } from "lucide-react"
import { Brand } from "@/components/brand/brand"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
          <Brand />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-rose-100 p-4">
              <TriangleAlertIcon className="size-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              {error.message ||
                "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  )
}
