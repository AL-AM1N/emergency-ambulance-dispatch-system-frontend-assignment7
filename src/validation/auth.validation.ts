import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const patientRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must not exceed 100 characters"),
    email: z.email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z.string(),
    address: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const driverRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must not exceed 100 characters"),
    email: z.email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z.string(),
    licenseNumber: z
      .string()
      .min(3, "License number must be at least 3 characters long"),
    vehicleNumber: z
      .string()
      .min(2, "Vehicle number must be at least 2 characters long"),
    ambulanceType: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google id token is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type PatientRegistrationFormValues = z.infer<
  typeof patientRegistrationSchema
>
export type DriverRegistrationFormValues = z.infer<
  typeof driverRegistrationSchema
>
