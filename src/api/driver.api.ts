import { apiClient } from "@/lib/apiClient"
import type {
  ApiResponse,
  DriverProfileWithUser,
  EmergencyRequest,
  Meta,
  Notification,
  TripQuery,
} from "@/types"
import type { DriverTripStatusStep } from "@/types/emergency-request.type"

interface PaginatedData<T> {
  result: T
  meta: Meta
}

const getProfile = async () => {
  const res =
    await apiClient<ApiResponse<DriverProfileWithUser>>("/driver/profile")
  return res.data
}

const updateAvailability = async (isAvailable: boolean) => {
  const res = await apiClient<
    ApiResponse<{ id: string; isAvailable: boolean }>
  >("/driver/availability", { method: "PATCH", body: { isAvailable } })
  return res.data
}

const getCurrentTrip = async () => {
  const res = await apiClient<ApiResponse<EmergencyRequest | null>>(
    "/driver/trips/current",
  )
  return res.data
}

const getMyTrips = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<EmergencyRequest[]> & { meta: Meta }>(
    "/driver/trips",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        status: query.status,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<
    EmergencyRequest[]
  >
}

const getTripById = async (id: string) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/driver/trips/${id}`,
  )
  return res.data
}

const acceptTrip = async (id: string) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/driver/trips/${id}/accept`,
    { method: "POST" },
  )
  return res.data
}

const updateTripStatus = async (id: string, status: DriverTripStatusStep) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/driver/trips/${id}/status`,
    { method: "PATCH", body: { status } },
  )
  return res.data
}

const getNotifications = async () => {
  const res = await apiClient<ApiResponse<Notification[]>>(
    "/driver/notifications",
  )
  return res.data
}

const markNotificationRead = async (id: string) => {
  const res = await apiClient<ApiResponse<Notification>>(
    `/driver/notifications/${id}/read`,
    { method: "PATCH" },
  )
  return res.data
}

export const DriverAPI = {
  getProfile,
  updateAvailability,
  getCurrentTrip,
  getMyTrips,
  getTripById,
  acceptTrip,
  updateTripStatus,
  getNotifications,
  markNotificationRead,
}
