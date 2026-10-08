export type Role = "ADMIN" | "DRIVER" | "PATIENT"

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED"

export type AuthProvider = "GOOGLE" | "CREDENTIAL"

export interface User {
  id: string
  name: string
  email: string
  password: null | string
  googleId: null | string
  role: Role
  status: UserStatus
  authProvider: AuthProvider
  emailVerified: boolean
  needPasswordChange: boolean
  imageUrl: null | string
  isDeleted: boolean
  deletedAt: null | string
  createdAt: string
  updatedAt: string
  patient?: PatientProfile | null
  driver?: DriverProfile | null
}

export interface PatientProfile {
  id: string
  userId: string
  name: string
  email: string
  contactNumber: string
  address: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface DriverProfile {
  id: string
  userId: string
  name: string
  email: string
  contactNumber: string
  licenseNumber: string
  vehicleNumber: string
  ambulanceType: string
  isAvailable: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
