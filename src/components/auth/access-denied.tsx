import { ShieldAlertIcon } from "lucide-react"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-red-100 p-4">
          <ShieldAlertIcon className="size-8 text-red-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">
            You do not have access to this page
          </h1>
          <p className="text-muted-foreground">
            Go back to{" "}
            <Link href="/" className="underline">
              home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
