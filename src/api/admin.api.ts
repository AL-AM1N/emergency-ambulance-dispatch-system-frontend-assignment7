import { apiClient } from "@/lib/apiClient"
import type {
  Ambulance,
  AmbulanceQuery,
  ApiResponse,
  CreateAmbulancePayload,
  CreateHospitalPayload,
  DashboardStats,
  Driver,
  DriverDetail,
  EmergencyRequest,
  Hospital,
  HospitalQuery,
  Meta,
  RevenueReport,
  TripQuery,
  TripReportResponse,
  UpdateAmbulancePayload,
  UpdateDriverPayload,
  UpdateHospitalPayload,
} from "@/types"
import type {
  AssignAmbulancePayload,
  ChangePriorityPayload,
  SelectHospitalPayload,
  TripStatus,
} from "@/types/emergency-request.type"

interface PaginatedData<T> {
  result: T
  meta: Meta
}

const listEmergencyRequests = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<EmergencyRequest[]> & { meta: Meta }>(
    "/admin/emergency-requests",
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
    `/admin/emergency-requests/${id}`,
  )
  return res.data
}

const changePriority = async (id: string, payload: ChangePriorityPayload) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/admin/emergency-requests/${id}/priority`,
    { method: "PATCH", body: payload },
  )
  return res.data
}

const assignAmbulance = async (id: string, payload: AssignAmbulancePayload) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/admin/emergency-requests/${id}/assign`,
    { method: "POST", body: payload },
  )
  return res.data
}

const selectHospital = async (id: string, payload: SelectHospitalPayload) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/admin/emergency-requests/${id}/hospital`,
    { method: "PATCH", body: payload },
  )
  return res.data
}

const createHospital = async (payload: CreateHospitalPayload) => {
  const res = await apiClient<ApiResponse<Hospital>>("/admin/hospitals", {
    method: "POST",
    body: payload,
  })
  return res.data
}

const listHospitals = async (query: HospitalQuery = {}) => {
  const res = await apiClient<ApiResponse<Hospital[]> & { meta: Meta }>(
    "/admin/hospitals",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        type: query.type,
        searchTerm: query.searchTerm,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<
    Hospital[]
  >
}

const getHospital = async (id: string) => {
  const res = await apiClient<ApiResponse<Hospital>>(`/admin/hospitals/${id}`)
  return res.data
}

const updateHospital = async (id: string, payload: UpdateHospitalPayload) => {
  const res = await apiClient<ApiResponse<Hospital>>(`/admin/hospitals/${id}`, {
    method: "PATCH",
    body: payload,
  })
  return res.data
}

const deleteHospital = async (id: string) => {
  const res = await apiClient<ApiResponse<Hospital>>(`/admin/hospitals/${id}`, {
    method: "DELETE",
  })
  return res.data
}

const createAmbulance = async (payload: CreateAmbulancePayload) => {
  const res = await apiClient<ApiResponse<Ambulance>>("/admin/ambulances", {
    method: "POST",
    body: payload,
  })
  return res.data
}

const listAmbulances = async (query: AmbulanceQuery = {}) => {
  const res = await apiClient<ApiResponse<Ambulance[]> & { meta: Meta }>(
    "/admin/ambulances",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        status: query.status,
        searchTerm: query.searchTerm,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<
    Ambulance[]
  >
}

const getAmbulance = async (id: string) => {
  const res = await apiClient<ApiResponse<Ambulance>>(`/admin/ambulances/${id}`)
  return res.data
}

const updateAmbulance = async (id: string, payload: UpdateAmbulancePayload) => {
  const res = await apiClient<ApiResponse<Ambulance>>(
    `/admin/ambulances/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  )
  return res.data
}

const deleteAmbulance = async (id: string) => {
  const res = await apiClient<ApiResponse<Ambulance>>(
    `/admin/ambulances/${id}`,
    {
      method: "DELETE",
    },
  )
  return res.data
}

const listDrivers = async (
  query: { page?: number; limit?: number; searchTerm?: string } = {},
) => {
  const res = await apiClient<ApiResponse<Driver[]> & { meta: Meta }>(
    "/admin/drivers",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: "createdAt",
        sortOrder: "desc",
        searchTerm: query.searchTerm,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<Driver[]>
}

const getDriver = async (id: string) => {
  const res = await apiClient<ApiResponse<DriverDetail>>(`/admin/drivers/${id}`)
  return res.data
}

const updateDriver = async (id: string, payload: UpdateDriverPayload) => {
  const res = await apiClient<ApiResponse<DriverDetail>>(
    `/admin/drivers/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  )
  return res.data
}

const updateDriverStatus = async (id: string, status: "ACTIVE" | "BLOCKED") => {
  const res = await apiClient<
    ApiResponse<{ id: string; driver: Driver | null }>
  >(`/admin/drivers/${id}/status`, { method: "PATCH", body: { status } })
  return res.data
}

const listTrips = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<EmergencyRequest[]> & { meta: Meta }>(
    "/admin/trips",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        status: query.status,
        driverId: query.driverId,
        ambulanceId: query.ambulanceId,
        startDate: query.startDate,
        endDate: query.endDate,
      },
    },
  )
  return { result: res.data, meta: res.meta } satisfies PaginatedData<
    EmergencyRequest[]
  >
}

const getTrip = async (id: string) => {
  const res = await apiClient<ApiResponse<EmergencyRequest>>(
    `/admin/trips/${id}`,
  )
  return res.data
}

const getDashboardStats = async () => {
  const res = await apiClient<ApiResponse<DashboardStats>>(
    "/admin/dashboard/stats",
  )
  return res.data
}

const getReportsTrips = async (query: TripQuery = {}) => {
  const res = await apiClient<ApiResponse<TripReportResponse>>(
    "/admin/reports/trips",
    {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        sortBy: query.sortBy ?? "createdAt",
        sortOrder: query.sortOrder ?? "desc",
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
      },
    },
  )
  return res.data
}

const getReportsRevenue = async (
  query: { startDate?: string; endDate?: string } = {},
) => {
  const res = await apiClient<ApiResponse<RevenueReport>>(
    "/admin/reports/revenue",
    {
      params: {
        startDate: query.startDate,
        endDate: query.endDate,
      },
    },
  )
  return res.data
}

export const AdminAPI = {
  listEmergencyRequests,
  getEmergencyRequest,
  changePriority,
  assignAmbulance,
  selectHospital,
  createHospital,
  listHospitals,
  getHospital,
  updateHospital,
  deleteHospital,
  createAmbulance,
  listAmbulances,
  getAmbulance,
  updateAmbulance,
  deleteAmbulance,
  listDrivers,
  getDriver,
  updateDriver,
  updateDriverStatus,
  listTrips,
  getTrip,
  getDashboardStats,
  getReportsTrips,
  getReportsRevenue,
}

export type { TripStatus }
