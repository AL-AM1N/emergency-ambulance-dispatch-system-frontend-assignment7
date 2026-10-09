"use client"

import { useForm } from "@tanstack/react-form"
import { AmbulanceIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegisterDriver } from "@/hooks"
import { roleHome } from "@/lib/auth"
import type { AmbulanceTypeName } from "@/types"
import { driverRegistrationSchema } from "@/validation"

const AMBULANCE_TYPE_OPTIONS: AmbulanceTypeName[] = [
  "BLS",
  "ALS",
  "PATIENT_TRANSPORT",
  "NEONATAL",
]

export function DriverRegisterForm() {
  const registerDriver = useRegisterDriver()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      licenseNumber: "",
      vehicleNumber: "",
      ambulanceType: "",
    },
    validators: {
      onSubmit: driverRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await registerDriver.mutateAsync(value)
        window.location.assign(roleHome("DRIVER"))
      } catch {
        // Toast already shown by the hook.
      }
    },
  })

  const textFields: Array<{
    name:
      | "name"
      | "email"
      | "password"
      | "confirmPassword"
      | "contactNumber"
      | "licenseNumber"
      | "vehicleNumber"
    label: string
    type?: string
    placeholder?: string
    autoComplete?: string
  }> = [
    {
      name: "name",
      label: "Full name",
      placeholder: "Jane Driver",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      name: "contactNumber",
      label: "Contact number",
      type: "tel",
      placeholder: "+1 555 000 1234",
      autoComplete: "tel",
    },
    {
      name: "licenseNumber",
      label: "Driver license number",
      placeholder: "DL-123456",
    },
    {
      name: "vehicleNumber",
      label: "Ambulance vehicle number",
      placeholder: "AMB-0001",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      autoComplete: "new-password",
    },
  ]

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AmbulanceIcon className="size-6" />
        </div>
        <CardTitle className="text-xl">Become an AmbuLink driver</CardTitle>
        <CardDescription>
          Register your details and ambulance to start receiving dispatch
          requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          {textFields.map((fieldConfig) => (
            <form.Field
              key={fieldConfig.name}
              name={fieldConfig.name}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>{fieldConfig.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={fieldConfig.type ?? "text"}
                    autoComplete={fieldConfig.autoComplete}
                    placeholder={fieldConfig.placeholder}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />
          ))}

          <form.Field
            name="ambulanceType"
            children={(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Ambulance type</Label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a type…</option>
                  {AMBULANCE_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Registering…
              </>
            ) : (
              "Create driver account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Need emergency help instead?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Register as a patient
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
