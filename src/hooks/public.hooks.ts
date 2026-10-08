import { useQuery } from "@tanstack/react-query"
import { PublicAPI } from "@/api"
import type { PublicHospitalQuery } from "@/types"

export const useGetAmbulanceTypes = () => {
  return useQuery({
    queryKey: ["public", "ambulance-types"],
    queryFn: () => PublicAPI.getAmbulanceTypes(),
    staleTime: 5 * 60_000,
  })
}

export const useGetHospitals = (query?: PublicHospitalQuery) => {
  return useQuery({
    queryKey: ["public", "hospitals", query?.type],
    queryFn: () => PublicAPI.getHospitals(query),
    staleTime: 5 * 60_000,
  })
}

export const useGetHospital = (id: string) => {
  return useQuery({
    queryKey: ["public", "hospitals", id],
    queryFn: () => PublicAPI.getHospitalById(id),
    enabled: Boolean(id),
  })
}

export const useGetEmergencyInfo = () => {
  return useQuery({
    queryKey: ["public", "emergency-info"],
    queryFn: () => PublicAPI.getEmergencyInfo(),
    staleTime: 5 * 60_000,
  })
}
