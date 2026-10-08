import { apiClient } from "@/lib/apiClient"
import { clearSession, setSession } from "@/lib/auth"
import type {
  ApiResponse,
  GoogleLoginPayload,
  LoginPayload,
  LoginResponse,
  RegisterDriverPayload,
  RegisterPatientPayload,
  User,
} from "@/types"

const login = async (payload: LoginPayload) => {
  const res = await apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  })
  setSession(res.data.accessToken)
  return res.data
}

const registerPatient = async (
  payload: RegisterPatientPayload & { confirmPassword?: string },
) => {
  const res = await apiClient<
    ApiResponse<{
      accessToken: string
      refreshToken: string
      user: User
    }>
  >("/auth/register/patient", {
    method: "POST",
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      patient: {
        contactNumber: payload.patient?.contactNumber,
        address: payload.patient?.address,
      },
    },
  })
  setSession(res.data.accessToken)
  return res.data
}

const registerDriver = async (
  payload: RegisterDriverPayload & { confirmPassword?: string },
) => {
  const res = await apiClient<
    ApiResponse<{
      accessToken: string
      refreshToken: string
      user: User
    }>
  >("/auth/register/driver", {
    method: "POST",
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      contactNumber: payload.contactNumber,
      licenseNumber: payload.licenseNumber,
      vehicleNumber: payload.vehicleNumber,
      ambulanceType: payload.ambulanceType,
    },
  })
  setSession(res.data.accessToken)
  return res.data
}

const googleLogin = async (payload: GoogleLoginPayload) => {
  const res = await apiClient<ApiResponse<LoginResponse>>("/auth/google", {
    method: "POST",
    body: payload,
  })
  setSession(res.data.accessToken)
  return res.data
}

const getMe = async () => {
  const res = await apiClient<ApiResponse<User>>("/auth/me")
  return res.data
}

const logout = async () => {
  try {
    await apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" })
  } finally {
    clearSession()
  }
}

export const AuthAPI = {
  login,
  registerPatient,
  registerDriver,
  googleLogin,
  getMe,
  logout,
}
