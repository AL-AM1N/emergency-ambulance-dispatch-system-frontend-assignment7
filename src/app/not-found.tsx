import Link from "next/link"
import { Brand } from "@/components/brand/brand"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Brand />
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-6xl font-black tracking-tight text-red-600">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Button render={<Link href="/" />}>Back to Home</Button>
    </div>
  )
}
