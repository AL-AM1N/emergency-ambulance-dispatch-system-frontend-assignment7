import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { DriverAPI } from "@/api"
import type {
  DriverTripStatusStep,
  TripQuery,
} from "@/types/emergency-request.type"

export const useGetDriverProfile = () => {
  return useQuery({
    queryKey: ["driver", "profile"],
    queryFn: () => DriverAPI.getProfile(),
  })
}

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      DriverAPI.updateAvailability(isAvailable),
    onSuccess: (_data, isAvailable) => {
      queryClient.invalidateQueries({ queryKey: ["driver", "profile"] })
      toast.success(
        isAvailable ? "You are now available for trips" : "You are now offline",
      )
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetCurrentTrip = () => {
  return useQuery({
    queryKey: ["driver", "current-trip"],
    queryFn: () => DriverAPI.getCurrentTrip(),
    refetchInterval: 30_000,
  })
}

export const useGetDriverTrips = (query: TripQuery) => {
  return useQuery({
    queryKey: ["driver", "trips", query],
    queryFn: () => DriverAPI.getMyTrips(query),
    placeholderData: (previous) => previous,
  })
}

export const useGetDriverTripById = (id: string) => {
  return useQuery({
    queryKey: ["driver", "trip", id],
    queryFn: () => DriverAPI.getTripById(id),
    enabled: Boolean(id),
  })
}

export const useAcceptTrip = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => DriverAPI.acceptTrip(id),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ["driver", "current-trip"] })
      queryClient.invalidateQueries({ queryKey: ["driver", "trips"] })
      toast.success(`Trip #${trip.id.slice(0, 8)} accepted`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateTripStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: DriverTripStatusStep
    }) => DriverAPI.updateTripStatus(id, status),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ["driver", "current-trip"] })
      queryClient.invalidateQueries({ queryKey: ["driver", "trips"] })
      toast.success(`Trip ${trip.status.toLowerCase().replace("_", " ")}`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetDriverNotifications = () => {
  return useQuery({
    queryKey: ["driver", "notifications"],
    queryFn: () => DriverAPI.getNotifications(),
    refetchInterval: 60_000,
  })
}

export const useMarkDriverNotificationRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => DriverAPI.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "notifications"] })
    },
  })
}
