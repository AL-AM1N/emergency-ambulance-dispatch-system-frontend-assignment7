import { z } from "zod"

export const updateDriverSchema = z.object({
  name: z.string().min(3).optional(),
  contactNumber: z.string().optional().default(""),
  licenseNumber: z.string().min(3).optional(),
  vehicleNumber: z.string().min(2).optional(),
  ambulanceType: z.string().optional().default(""),
})

export const updateDriverStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED"], {
    message: "Status must be ACTIVE or BLOCKED",
  }),
})

export const driverProfileUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  contactNumber: z.string().optional().default(""),
  licenseNumber: z
    .string()
    .min(3, "License number must be at least 3 characters"),
  vehicleNumber: z
    .string()
    .min(2, "Vehicle number must be at least 2 characters"),
  ambulanceType: z.string().optional().default(""),
})

export type DriverUpdateFormValues = z.infer<typeof driverProfileUpdateSchema>
