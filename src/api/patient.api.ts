import { apiClient } from "@/lib/apiClient"
import type {
  ApiResponse,
  EmergencyRequest,
  Meta,
  Notification,
  TripQuery,
} from "@/types"
import type { CreateEmergencyRequestPayload } from "@/types/emergency-request.type"

interface PaginatedData<T> {
  result: T
  meta: Meta
}

const createEmergencyRequest = async (
  payload: CreateEmergencyRequestPayload,
) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    "/patient/emergency-requests",
    { method: "POST", body: payload },
  )
  return res.data
}

const getMyEmergencyRequests = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<EmergencyRequest[]> & { meta: Meta }>(
    "/patient/emergency-requests",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        status: query.status,
        priority: query.priority,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<
    EmergencyRequest[]
  >
}

const getEmergencyRequest = async (id: string) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/patient/emergency-requests/${id}`,
  )
  return res.data
}

const cancelEmergencyRequest = async (id: string) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/patient/emergency-requests/${id}/cancel`,
    { method: "PATCH" },
  )
  return res.data
}

const getMyTrips = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<EmergencyRequest[]> & { meta: Meta }>(
    "/patient/trips",
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
    `/patient/trips/${id}`,
  )
  return res.data
}

const getNotifications = async () => {
  const res = await apiClient<ApiResponse<Notification[]>>(
    "/patient/notifications",
  )
  return res.data
}

const markNotificationRead = async (id: string) => {
  const res = await apiClient<ApiResponse<Notification>>(
    `/patient/notifications/${id}/read`,
    { method: "PATCH" },
  )
  return res.data
}

export const PatientAPI = {
  createEmergencyRequest,
  getMyEmergencyRequests,
  getEmergencyRequest,
  cancelEmergencyRequest,
  getMyTrips,
  getTripById,
  getNotifications,
  markNotificationRead,
}
