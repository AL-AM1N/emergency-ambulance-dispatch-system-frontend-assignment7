import type { Metadata } from "next"
import { PatientRegisterForm } from "@/components/auth/patient-register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create your AmbuLink patient account.",
}

export default function RegisterPage() {
  return <PatientRegisterForm />
}
