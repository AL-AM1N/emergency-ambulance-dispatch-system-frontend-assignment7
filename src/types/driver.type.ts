import type { Ambulance, AmbulanceType } from "./ambulance.type"
import type { UserStatus } from "./user.type"

export interface Driver {
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
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email: string
    status: UserStatus
  }
  ambulance?: {
    id: string
    vehicleNumber: string
    status: string
  } | null
}

export interface DriverDetail extends Driver {
  user: {
    id: string
    email: string
    status: UserStatus
  }
  ambulance?: (Ambulance & { ambulanceType?: AmbulanceType }) | null
}

export interface DriverProfileWithUser {
  id: string
  name: string
  email: string
  contactNumber: string
  licenseNumber: string
  vehicleNumber: string
  ambulanceType: string
  isAvailable: boolean
  createdAt: string
  user: {
    id: string
    email: string
    status: UserStatus
  }
  ambulance?: (Ambulance & { ambulanceType?: AmbulanceType }) | null
}

export interface UpdateDriverPayload {
  name?: string
  contactNumber?: string
  licenseNumber?: string
  vehicleNumber?: string
  ambulanceType?: string
}

export interface UpdateDriverStatusPayload {
  status: "ACTIVE" | "BLOCKED"
}

export interface DriverQuery {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  searchTerm?: string
}

export interface TripPatientSummary {
  id: string
  name: string
  email: string
  contactNumber: string
}

export interface TripDriverSummary {
  id: string
  name: string
  email: string
  contactNumber: string
  vehicleNumber: string
}
