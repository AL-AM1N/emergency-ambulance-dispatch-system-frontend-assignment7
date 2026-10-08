import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { AuthAPI } from "@/api"
import { hasSession } from "@/lib/auth"
import type { GoogleLoginPayload, LoginPayload } from "@/types"
import type {
  DriverRegistrationFormValues,
  PatientRegistrationFormValues,
} from "@/validation"

export const AUTH_QUERY_KEY = ["auth", "me"] as const

export const useGetMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEY],
    queryFn: () => AuthAPI.getMe(),
    enabled: options?.enabled ?? hasSession(),
    retry: false,
    staleTime: 60_000,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthAPI.login(payload),
    onSuccess: () => {
      queryClient.clear()
      toast.success("Logged in successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRegisterPatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PatientRegistrationFormValues) =>
      AuthAPI.registerPatient({
        name: values.name,
        email: values.email,
        password: values.password,
        patient: {
          contactNumber: values.contactNumber,
          address: values.address,
        },
      }),
    onSuccess: () => {
      queryClient.clear()
      toast.success("Patient account registered successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRegisterDriver = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: DriverRegistrationFormValues) =>
      AuthAPI.registerDriver({
        name: values.name,
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
        licenseNumber: values.licenseNumber,
        vehicleNumber: values.vehicleNumber,
        ambulanceType: values.ambulanceType,
      }),
    onSuccess: () => {
      queryClient.clear()
      toast.success("Driver account registered successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GoogleLoginPayload) => AuthAPI.googleLogin(payload),
    onSuccess: () => {
      queryClient.clear()
      toast.success("Logged in with Google")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSettled: () => {
      queryClient.clear()
      window.location.href = "/"
    },
  })
}
