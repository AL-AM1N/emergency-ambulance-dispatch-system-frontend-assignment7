"use client"

import { useForm } from "@tanstack/react-form"
import { Loader2Icon, UserPlusIcon } from "lucide-react"
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
import { useRegisterPatient } from "@/hooks"
import { roleHome } from "@/lib/auth"
import { patientRegistrationSchema } from "@/validation"

export function PatientRegisterForm() {
  const registerPatient = useRegisterPatient()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      address: "",
    },
    validators: {
      onSubmit: patientRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await registerPatient.mutateAsync(value)
        window.location.assign(roleHome("PATIENT"))
      } catch {
        // Toast already shown by the hook.
      }
    },
  })

  const fields: Array<{
    name:
      | "name"
      | "email"
      | "password"
      | "confirmPassword"
      | "contactNumber"
      | "address"
    label: string
    type?: string
    placeholder?: string
    autoComplete?: string
  }> = [
    {
      name: "name",
      label: "Full name",
      placeholder: "John Doe",
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
      name: "address",
      label: "Address",
      placeholder: "123 Main Street, Metro City",
      autoComplete: "street-address",
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
          <UserPlusIcon className="size-6" />
        </div>
        <CardTitle className="text-xl">Create a patient account</CardTitle>
        <CardDescription>
          Register to request ambulances and track your emergency trips.
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
          {fields.map((fieldConfig) => (
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
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Driving an ambulance?{" "}
            <Link
              href="/register/driver"
              className="font-medium text-foreground hover:underline"
            >
              Register as a driver
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            Password must be at least 8 characters and include upper &amp;
            lowercase letters, a number and a special character.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
