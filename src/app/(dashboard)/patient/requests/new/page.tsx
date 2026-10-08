"use client"

import { useForm } from "@tanstack/react-form"
import { Loader2Icon, MapPinIcon, SirenIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth.context"
import { useCreateEmergencyRequest } from "@/hooks"
import { PATIENT_ROUTES } from "@/routes"
import {
  EMERGENCY_TYPES,
  type EmergencyType,
  PRIORITIES,
  type Priority,
} from "@/types"
import { createEmergencyRequestSchema } from "@/validation"

interface Coords {
  latitude: number
  longitude: number
}

export default function NewRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const createRequest = useCreateEmergencyRequest()
  const [locating, setLocating] = useState(false)
  const [coords, setCoords] = useState<Coords | null>(null)

  const form = useForm({
    defaultValues: {
      patientName: user?.name ?? "",
      patientContact: user?.patient?.contactNumber ?? "",
      emergencyType: "MEDICAL" as EmergencyType,
      priority: "MEDIUM" as Priority,
      pickupLocation: "",
      additionalNote: "",
    },
    validators: {
      onSubmit: createEmergencyRequestSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const trip = await createRequest.mutateAsync({
          patientName: value.patientName,
          patientContact: value.patientContact,
          emergencyType: value.emergencyType,
          priority: value.priority,
          pickupLocation: value.pickupLocation,
          pickupLatitude: coords?.latitude,
          pickupLongitude: coords?.longitude,
          additionalNote: value.additionalNote || undefined,
        })
        router.push(`${PATIENT_ROUTES.requests}/${trip.id}`)
      } catch {
        // Toast already shown by the hook.
      }
    },
  })

  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCoords({ latitude, longitude })
        form.setFieldValue(
          "pickupLocation",
          `Current location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
        )
        setLocating(false)
      },
      () => setLocating(false),
    )
  }

  const selects: Array<
    | { type: "emergencyType"; options: EmergencyType[]; label: string }
    | { type: "priority"; options: Priority[]; label: string }
  > = [
    {
      type: "emergencyType",
      label: "Emergency type",
      options: EMERGENCY_TYPES,
    },
    {
      type: "priority",
      label: "Priority (your estimate)",
      options: PRIORITIES,
    },
  ]

  return (
    <div>
      <PageHeader
        title="New Emergency Request"
        description="Describe your situation. A dispatcher will be notified immediately."
      />

      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SirenIcon className="size-5 text-red-600" />
              Request an ambulance
            </CardTitle>
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
              <form.Field
                name="patientName"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Patient name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="John Doe"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="patientContact"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Contact number</Label>
                    <Input
                      id={field.name}
                      type="tel"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="+1 555 000 1234"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {selects.map((config) => (
                  <form.Field
                    key={config.type}
                    name={config.type}
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor={field.name}>{config.label}</Label>
                        <select
                          id={field.name}
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(
                              event.target.value as EmergencyType & Priority,
                            )
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {config.options.map((option) => (
                            <option key={option} value={option}>
                              {option.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    )}
                  />
                ))}
              </div>

              <form.Field
                name="pickupLocation"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Pickup location</Label>
                    <div className="flex gap-2">
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="123 Main Street, Metro City"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={locateMe}
                        disabled={locating}
                        aria-label="Use my current location"
                      >
                        {locating ? (
                          <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                          <MapPinIcon className="size-4" />
                        )}
                      </Button>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <form.Field
                name="additionalNote"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      Additional note{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      id={field.name}
                      rows={3}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="e.g. patient has difficulty breathing"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>Submit request</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(PATIENT_ROUTES.requests)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
