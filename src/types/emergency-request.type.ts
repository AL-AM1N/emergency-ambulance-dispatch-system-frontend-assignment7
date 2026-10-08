import type { Ambulance } from "./ambulance.type"
import type { TripDriverSummary, TripPatientSummary } from "./driver.type"
import type { Hospital } from "./hospital.type"
import type { Payment } from "./payment.type"

export type EmergencyType =
  | "MEDICAL"
  | "ACCIDENT"
  | "FIRE"
  | "CARDIAC"
  | "TRAUMA"
  | "OBSTETRIC"
  | "OTHER"

export const EMERGENCY_TYPES: EmergencyType[] = [
  "MEDICAL",
  "ACCIDENT",
  "FIRE",
  "CARDIAC",
  "TRAUMA",
  "OBSTETRIC",
  "OTHER",
]

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

export type TripStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "EN_ROUTE"
  | "PICKED_UP"
  | "HOSPITAL_ARRIVED"
  | "COMPLETED"
  | "CANCELLED"

export const TRIP_STATUSES: TripStatus[] = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "PICKED_UP",
  "HOSPITAL_ARRIVED",
  "COMPLETED",
  "CANCELLED",
]

export interface EmergencyRequest {
  id: string
  patientId: string
  patientName: string
  patientContact: string
  emergencyType: EmergencyType
  priority: Priority
  pickupLocation: string
  pickupLatitude: number | null
  pickupLongitude: number | null
  additionalNote: string | null
  status: TripStatus
  ambulanceId: string | null
  driverId: string | null
  hospitalId: string | null
  fare: number | null
  distanceKm: number | null
  assignedAt: string | null
  acceptedAt: string | null
  pickedUpAt: string | null
  arrivedAt: string | null
  completedAt: string | null
  cancelledAt: string | null
  cancelledReason: string | null
  createdAt: string
  updatedAt: string
  patient?: TripPatientSummary
  ambulance?:
    | (Ambulance & { ambulanceType?: Ambulance["ambulanceType"] })
    | null
  driver?: TripDriverSummary | null
  hospital?: Hospital | null
  payment?: Payment | null
}

export interface CreateEmergencyRequestPayload {
  patientName: string
  patientContact: string
  emergencyType: EmergencyType
  priority?: Priority
  pickupLocation: string
  pickupLatitude?: number
  pickupLongitude?: number
  additionalNote?: string
}

export interface ChangePriorityPayload {
  priority: Priority
}

export interface AssignAmbulancePayload {
  ambulanceId: string
}

export interface SelectHospitalPayload {
  hospitalId: string
}

export interface TripQuery {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  status?: TripStatus | ""
  priority?: Priority | ""
  driverId?: string
  ambulanceId?: string
  startDate?: string
  endDate?: string
}

export type DriverTripStatusStep =
  | "EN_ROUTE"
  | "PICKED_UP"
  | "HOSPITAL_ARRIVED"
  | "COMPLETED"
