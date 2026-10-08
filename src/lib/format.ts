import { format, parseISO } from "date-fns"

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "—"
  }
  try {
    return format(
      typeof value === "string" ? parseISO(value) : value,
      "MMM d, yyyy",
    )
  } catch {
    return "—"
  }
}

export function formatDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return "—"
  }
  try {
    return format(
      typeof value === "string" ? parseISO(value) : value,
      "MMM d, yyyy h:mm a",
    )
  } catch {
    return "—"
  }
}

export function formatCurrency(
  value: number | string | null | undefined,
): string {
  const amount = Number(value)
  if (Number.isNaN(amount) || value == null) {
    return "$0.00"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function toTitleCase(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }
  return value
}

export function shortId(id: string | undefined | null): string {
  if (!id) {
    return "—"
  }
  return id.slice(0, 8)
}
