import type { ReadonlyURLSearchParams } from "next/navigation"

export function updateSearchParams(
  searchParams: ReadonlyURLSearchParams,
  updates: Record<string, string | number | undefined | null>,
): string {
  const params = new URLSearchParams(searchParams.toString())
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || value === "") {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export function pickParam(
  searchParams: ReadonlyURLSearchParams,
  key: string,
  defaultValue = "",
): string {
  return searchParams.get(key) ?? defaultValue
}
