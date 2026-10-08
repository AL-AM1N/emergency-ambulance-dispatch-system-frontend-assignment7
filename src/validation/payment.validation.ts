import { z } from "zod"

export const createPaymentSchema = z.object({
  tripId: z.string().min(1, "Trip id is required"),
  method: z.enum(["STRIPE", "SSLCOMMERZ"]).optional().default("STRIPE"),
})

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment intent id is required"),
  tripId: z.string().min(1, "Trip id is required"),
})

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>
