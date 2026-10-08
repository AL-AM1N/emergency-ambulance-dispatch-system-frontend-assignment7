import Link from "next/link"

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#dc2626" />
      <path d="M24 11H16v5h-5v8h5v5h8v-5h5v-8h-5v-5Z" fill="white" />
    </svg>
  )
}

export function Brand({
  showSubtitle = false,
  href = "/",
}: {
  showSubtitle?: boolean
  href?: string
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <BrandMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-foreground">
          AmbuLink
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-muted-foreground">
            Emergency Dispatch
          </span>
        )}
      </span>
    </Link>
  )
}
