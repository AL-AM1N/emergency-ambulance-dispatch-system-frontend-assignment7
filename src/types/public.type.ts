import type { HospitalType } from "./hospital.type"

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SystemInfo {
  name: string
  version: string
  description: string
  howItWorks: string[]
}

export interface EmergencyInfo {
  contacts: EmergencyContact[]
  system: SystemInfo
  safetyGuidelines: string[]
}

export interface PublicHospitalQuery {
  type?: HospitalType | ""
}

export interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  activeTrips: number
  completedTrips: number
  cancelledTrips: number
  ambulances: {
    total: number
    available: number
    busy: number
    maintenance: number
  }
  totalPatients: number
  totalDrivers: number
  totalHospitals: number
  totalRevenue: number
}
