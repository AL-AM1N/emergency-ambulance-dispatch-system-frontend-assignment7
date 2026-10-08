export type AmbulanceStatus = "AVAILABLE" | "BUSY" | "MAINTENANCE" | "INACTIVE"

export const AMBULANCE_STATUSES: AmbulanceStatus[] = [
  "AVAILABLE",
  "BUSY",
  "MAINTENANCE",
  "INACTIVE",
]

export type AmbulanceTypeName = "BLS" | "ALS" | "PATIENT_TRANSPORT" | "NEONATAL"

export interface AmbulanceType {
  id: string
  name: string
  description: string | null
  baseFare: number
  perKmRate: number
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DriverSummary {
  id: string
  name: string
  email: string
  contactNumber: string
}

export interface Ambulance {
  id: string
  vehicleNumber: string
  ambulanceTypeId: string
  status: AmbulanceStatus
  driverId: string | null
  currentLatitude: number | null
  currentLongitude: number | null
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  ambulanceType?: AmbulanceType
  driver?: DriverSummary | null
}

export interface CreateAmbulancePayload {
  vehicleNumber: string
  ambulanceTypeId: string
  status?: AmbulanceStatus
  driverId?: string
  currentLatitude?: number
  currentLongitude?: number
}

export type UpdateAmbulancePayload = Partial<CreateAmbulancePayload>

export interface AmbulanceQuery {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  status?: AmbulanceStatus | ""
  searchTerm?: string
}
