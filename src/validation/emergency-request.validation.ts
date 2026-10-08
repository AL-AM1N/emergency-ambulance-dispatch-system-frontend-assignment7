import { z } from "zod"

const emergencyTypeEnum = z.enum([
  "MEDICAL",
  "ACCIDENT",
  "FIRE",
  "CARDIAC",
  "TRAUMA",
  "OBSTETRIC",
  "OTHER",
])

const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])

export const createEmergencyRequestSchema = z.object({
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters long"),
  patientContact: z
    .string()
    .min(5, "Contact number must be at least 5 characters long"),
  emergencyType: emergencyTypeEnum,
  priority: priorityEnum,
  pickupLocation: z
    .string()
    .min(5, "Pickup location must be at least 5 characters long")
    .max(255, "Pickup location must not exceed 255 characters"),
  additionalNote: z
    .string()
    .max(500, "Additional note must not exceed 500 characters"),
})

export type CreateEmergencyRequestFormValues = z.input<
  typeof createEmergencyRequestSchema
>

export const changePrioritySchema = z.object({
  priority: priorityEnum,
})

export const assignAmbulanceSchema = z.object({
  ambulanceId: z.string().min(1, "Please select an ambulance"),
})

export const selectHospitalSchema = z.object({
  hospitalId: z.string().min(1, "Please select a hospital"),
})
