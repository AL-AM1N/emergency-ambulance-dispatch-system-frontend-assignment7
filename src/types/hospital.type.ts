export type HospitalType = "GENERAL" | "EMERGENCY" | "TRAUMA" | "SPECIALIZED"

export const HOSPITAL_TYPES: HospitalType[] = [
  "GENERAL",
  "EMERGENCY",
  "TRAUMA",
  "SPECIALIZED",
]

export interface Hospital {
  id: string
  name: string
  address: string
  contactNumber: string | null
  email: string | null
  type: HospitalType
  latitude: number | null
  longitude: number | null
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateHospitalPayload {
  name: string
  address: string
  contactNumber?: string
  email?: string
  type?: HospitalType
  latitude?: number
  longitude?: number
}

export type UpdateHospitalPayload = Partial<CreateHospitalPayload>

export interface HospitalQuery {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  type?: HospitalType | ""
  searchTerm?: string
}
