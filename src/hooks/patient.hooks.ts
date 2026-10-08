import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { PatientAPI } from "@/api"
import type {
  CreateEmergencyRequestPayload,
  TripQuery,
} from "@/types/emergency-request.type"

export const useCreateEmergencyRequest = () => {
  return useMutation({
    mutationFn: (payload: CreateEmergencyRequestPayload) =>
      PatientAPI.createEmergencyRequest(payload),
    onSuccess: () => {
      toast.success("Emergency request submitted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetMyEmergencyRequests = (query: TripQuery) => {
  return useQuery({
    queryKey: ["patient", "emergency-requests", query],
    queryFn: () => PatientAPI.getMyEmergencyRequests(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetEmergencyRequest = (id: string) => {
  return useQuery({
    queryKey: ["patient", "emergency-request", id],
    queryFn: () => PatientAPI.getEmergencyRequest(id),
    enabled: Boolean(id),
  })
}

export const useCancelEmergencyRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => PatientAPI.cancelEmergencyRequest(id),
    onSuccess: () => {
      toast.success("Emergency request cancelled")
      queryClient.invalidateQueries({
        queryKey: ["patient", "emergency-requests"],
      })
      queryClient.invalidateQueries({ queryKey: ["patient", "trips"] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetMyTrips = (query: TripQuery) => {
  return useQuery({
    queryKey: ["patient", "trips", query],
    queryFn: () => PatientAPI.getMyTrips(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetTripById = (id: string) => {
  return useQuery({
    queryKey: ["patient", "trip", id],
    queryFn: () => PatientAPI.getTripById(id),
    enabled: Boolean(id),
  })
}

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["patient", "notifications"],
    queryFn: () => PatientAPI.getNotifications(),
    refetchInterval: 60_000,
  })
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => PatientAPI.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", "notifications"] })
    },
  })
}
