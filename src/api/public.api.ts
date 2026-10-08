import { apiClient } from "@/lib/apiClient"
import type {
  AmbulanceType,
  ApiResponse,
  EmergencyInfo,
  Hospital,
  HospitalQuery,
  PublicHospitalQuery,
} from "@/types"

const getAmbulanceTypes = async () => {
  const res = await apiClient<ApiResponse<AmbulanceType[]>>(
    "/public/ambulance-types",
  )
  return res.data
}

const getHospitals = async (query?: PublicHospitalQuery) => {
  const res = await apiClient<ApiResponse<Hospital[]>>("/public/hospitals", {
    params: { type: query?.type },
  })
  return res.data
}

const getHospitalById = async (id: string) => {
  const res = await apiClient<ApiResponse<Hospital>>(`/public/hospitals/${id}`)
  return res.data
}

const getEmergencyInfo = async () => {
  const res = await apiClient<ApiResponse<EmergencyInfo>>(
    "/public/emergency-info",
  )
  return res.data
}

export const PublicAPI = {
  getAmbulanceTypes,
  getHospitals,
  getHospitalById,
  getEmergencyInfo,
}

export type { HospitalQuery }
