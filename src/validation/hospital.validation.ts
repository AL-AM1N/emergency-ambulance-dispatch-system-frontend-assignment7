import { z } from "zod"
import { HOSPITAL_TYPES } from "@/types"

export const createHospitalSchema = z.object({
  name: z.string().min(2, "Hospital name must be at least 2 characters"),
  address: z.string().min(3, "Hospital address must be at least 3 characters"),
  contactNumber: z.string().optional().default(""),
  email: z.email("Please enter a valid email").optional().or(z.literal("")),
  type: z
    .enum(HOSPITAL_TYPES as [string, ...string[]])
    .optional()
    .default("GENERAL"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

export const updateHospitalSchema = createHospitalSchema.partial()

export type HospitalFormValues = z.infer<typeof createHospitalSchema>
