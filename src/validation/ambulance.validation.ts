import { z } from "zod"
import { AMBULANCE_STATUSES } from "@/types"

export const createAmbulanceSchema = z.object({
  vehicleNumber: z
    .string()
    .min(2, "Vehicle number must be at least 2 characters long"),
  ambulanceTypeId: z.string().min(1, "Please select an ambulance type"),
  status: z
    .enum(AMBULANCE_STATUSES as [string, ...string[]])
    .optional()
    .default("AVAILABLE"),
  driverId: z.string().optional().default(""),
  currentLatitude: z.coerce.number().optional(),
  currentLongitude: z.coerce.number().optional(),
})

export const updateAmbulanceSchema = createAmbulanceSchema.partial()

export type AmbulanceFormValues = z.infer<typeof createAmbulanceSchema>
