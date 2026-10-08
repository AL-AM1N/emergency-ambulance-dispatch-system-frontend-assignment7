import { type FetchError, ofetch } from "ofetch"
import { clearSession, getAccessToken, setSession } from "@/lib/auth"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"

export interface ApiClientOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  params?: Record<string, string | number | boolean | null | undefined>
  headers?: Record<string, string>
}

export interface ApiClientError {
  status: number
  message: string
  data?: unknown
}

const rawClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
})

function buildUrl(path: string, params?: ApiClientOptions["params"]): string {
  if (!params) {
    return path
  }
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue
    }
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

function toError(error: unknown): ApiClientError {
  const fetchError = error as FetchError
  const status =
    fetchError?.statusCode ??
    fetchError?.status ??
    fetchError?.response?.status ??
    500
  const envelope = fetchError?.data as { message?: string } | undefined
  return {
    status,
    message: envelope?.message ?? fetchError?.message ?? "Something went wrong",
    data: fetchError?.data,
  }
}

let refreshing = false
const queued: Array<{
  resolve: (value: boolean) => void
  reject: (reason: unknown) => void
}> = []

async function refreshSession(): Promise<boolean> {
  if (refreshing) {
    return new Promise<boolean>((resolve, reject) => {
      queued.push({ resolve, reject })
    })
  }

  refreshing = true

  try {
    const response = (await rawClient("/auth/refresh-token", {
      method: "POST",
    })) as { success: boolean; data?: { accessToken?: string } }
    const accessToken = response?.data?.accessToken
    if (!accessToken) {
      throw new Error("No access token in refresh response")
    }
    setSession(accessToken)
    for (const pending of queued) {
      pending.resolve(true)
    }
    queued.length = 0
    return true
  } catch (error) {
    clearSession()
    for (const pending of queued) {
      pending.reject(error)
    }
    queued.length = 0
    return false
  } finally {
    refreshing = false
  }
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...options.headers,
  }
  const accessToken = getAccessToken()
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const doRequest = async (): Promise<T> => {
    return (await rawClient(buildUrl(path, options.params), {
      method: options.method ?? "GET",
      body: options.body as BodyInit | Record<string, unknown> | undefined,
      headers,
    })) as T
  }

  try {
    return await doRequest()
  } catch (error) {
    const apiError = toError(error)

    if (apiError.status === 401 && accessToken) {
      const refreshed = await refreshSession()
      if (refreshed) {
        headers.Authorization = `Bearer ${getAccessToken()}`
        return doRequest()
      }
    }

    throw error
  }
}

export const API_BASE_URL = BASE_URL
export { refreshSession }
