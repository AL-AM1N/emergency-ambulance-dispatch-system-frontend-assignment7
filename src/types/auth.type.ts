import type { User } from "./user.type"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPatientPayload {
  name: string
  email: string
  password: string
  patient?: {
    contactNumber?: string
    address?: string
  }
}

export interface RegisterDriverPayload {
  name: string
  email: string
  password: string
  contactNumber?: string
  licenseNumber: string
  vehicleNumber: string
  ambulanceType?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse<Profile> {
  accessToken: string
  refreshToken: string
  user: User
  patient?: Profile
  driver?: Profile
}

export interface GoogleLoginPayload {
  idToken: string
}

export type DemoRole = "ADMIN" | "DRIVER" | "PATIENT"

export interface DemoCredential {
  role: DemoRole
  email: string
  password: string
}
