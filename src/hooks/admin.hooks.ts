import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { AdminAPI } from "@/api"
import type {
  Ambulance,
  AmbulanceQuery,
  CreateAmbulancePayload,
  CreateHospitalPayload,
  Driver,
  EmergencyRequest,
  Hospital,
  HospitalQuery,
  RevenueReport,
  TripQuery,
  UpdateAmbulancePayload,
  UpdateDriverPayload,
  UpdateHospitalPayload,
} from "@/types"
import type {
  AssignAmbulancePayload,
  ChangePriorityPayload,
  SelectHospitalPayload,
} from "@/types/emergency-request.type"

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => AdminAPI.getDashboardStats(),
  })
}

export const useListEmergencyRequests = (query: TripQuery) => {
  return useQuery({
    queryKey: ["admin", "emergency-requests", query],
    queryFn: () => AdminAPI.listEmergencyRequests(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetAdminEmergencyRequest = (id: string) => {
  return useQuery({
    queryKey: ["admin", "emergency-request", id],
    queryFn: () => AdminAPI.getEmergencyRequest(id),
    enabled: Boolean(id),
  })
}

export const useChangePriority = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ChangePriorityPayload
    }) => AdminAPI.changePriority(id, payload),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-requests"],
      })
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-request"],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] })
      toast.success(`Priority updated to ${trip.priority}`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useAssignAmbulance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: AssignAmbulancePayload
    }) => AdminAPI.assignAmbulance(id, payload),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-requests"],
      })
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-request"],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] })
      toast.success(`Ambulance assigned to trip #${trip.id.slice(0, 8)}`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useSelectHospital = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SelectHospitalPayload
    }) => AdminAPI.selectHospital(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-requests"],
      })
      queryClient.invalidateQueries({
        queryKey: ["admin", "emergency-request"],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] })
      toast.success("Hospital selected for this trip")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateHospital = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateHospitalPayload) =>
      AdminAPI.createHospital(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hospitals"] })
      toast.success("Hospital created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useListHospitals = (query: HospitalQuery) => {
  return useQuery({
    queryKey: ["admin", "hospitals", query],
    queryFn: () => AdminAPI.listHospitals(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetAdminHospital = (id: string) => {
  return useQuery({
    queryKey: ["admin", "hospital", id],
    queryFn: () => AdminAPI.getHospital(id),
    enabled: Boolean(id),
  })
}

export const useUpdateHospital = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateHospitalPayload
    }) => AdminAPI.updateHospital(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hospitals"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "hospital"] })
      toast.success("Hospital updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteHospital = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => AdminAPI.deleteHospital(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hospitals"] })
      toast.success("Hospital deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateAmbulance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAmbulancePayload) =>
      AdminAPI.createAmbulance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ambulances"] })
      toast.success("Ambulance added successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useListAmbulances = (query: AmbulanceQuery) => {
  return useQuery({
    queryKey: ["admin", "ambulances", query],
    queryFn: () => AdminAPI.listAmbulances(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetAmbulance = (id: string) => {
  return useQuery({
    queryKey: ["admin", "ambulance", id],
    queryFn: () => AdminAPI.getAmbulance(id),
    enabled: Boolean(id),
  })
}

export const useUpdateAmbulance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAmbulancePayload
    }) => AdminAPI.updateAmbulance(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ambulances"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "ambulance"] })
      toast.success("Ambulance updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteAmbulance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => AdminAPI.deleteAmbulance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ambulances"] })
      toast.success("Ambulance deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useListDrivers = (query: {
  page?: number
  limit?: number
  searchTerm?: string
}) => {
  return useQuery({
    queryKey: ["admin", "drivers", query],
    queryFn: () => AdminAPI.listDrivers(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetDriver = (id: string) => {
  return useQuery({
    queryKey: ["admin", "driver", id],
    queryFn: () => AdminAPI.getDriver(id),
    enabled: Boolean(id),
  })
}

export const useUpdateDriver = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateDriverPayload
    }) => AdminAPI.updateDriver(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "driver"] })
      toast.success("Driver updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: "ACTIVE" | "BLOCKED"
    }) => AdminAPI.updateDriverStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "driver"] })
      toast.success("Driver status updated")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useListTrips = (query: TripQuery) => {
  return useQuery({
    queryKey: ["admin", "trips", query],
    queryFn: () => AdminAPI.listTrips(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetTrip = (id: string) => {
  return useQuery({
    queryKey: ["admin", "trip", id],
    queryFn: () => AdminAPI.getTrip(id),
    enabled: Boolean(id),
  })
}

export const useGetReportsTrips = (query: TripQuery) => {
  return useQuery({
    queryKey: ["admin", "reports", "trips", query],
    queryFn: () => AdminAPI.getReportsTrips(query),
  })
}

export const useGetReportsRevenue = (query: {
  startDate?: string
  endDate?: string
}) => {
  return useQuery({
    queryKey: ["admin", "reports", "revenue", query],
    queryFn: () => AdminAPI.getReportsRevenue(query),
  })
}

export type { Ambulance, Driver, EmergencyRequest, Hospital, RevenueReport }
