import type { Metadata } from "next"
import { DriverRegisterForm } from "@/components/auth/driver-register-form"

export const metadata: Metadata = {
  title: "Register as driver",
  description: "Join the AmbuLink driver network.",
}

export default function RegisterDriverPage() {
  return <DriverRegisterForm />
}
