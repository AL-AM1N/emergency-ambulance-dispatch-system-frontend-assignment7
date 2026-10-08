import { Brand } from "@/components/brand/brand"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-3">
        <Brand />
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-red-600" />
      </div>
    </div>
  )
}
