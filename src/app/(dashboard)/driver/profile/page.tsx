"use client"

import {
  AmbulanceIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  IdCardIcon,
  MailIcon,
  PhoneCallIcon,
  UserRoundIcon,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { ContentSwap } from "@/components/motion"
import { CardSkeleton } from "@/components/shared/skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useGetDriverProfile, useUpdateAvailability } from "@/hooks"
import { formatDate } from "@/lib/format"

export default function DriverProfilePage() {
  const { data: profile, isLoading } = useGetDriverProfile()
  const updateAvailability = useUpdateAvailability()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Your driver account and ambulance details."
      />

      <ContentSwap stateKey={isLoading || !profile ? "loading" : "ready"}>
        {(isLoading || !profile) && <CardSkeleton lines={4} />}

        {!isLoading && profile && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {profile.name}
                    <BadgeCheckIcon className="size-4 text-emerald-600" />
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Driver account
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneCallIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Contact number</p>
                      <p className="font-medium">{profile.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IdCardIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">License number</p>
                      <p className="font-medium">{profile.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Registered</p>
                      <p className="font-medium">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Availability</span>
                  <Switch
                    checked={profile.isAvailable}
                    onCheckedChange={(checked) =>
                      updateAvailability.mutate(checked)
                    }
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">
                  Keep your availability on to receive new dispatch requests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AmbulanceIcon className="size-4 text-red-600" />
                  Ambulance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.ambulance ? (
                  <div className="grid gap-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="font-medium">
                        {profile.ambulance.vehicleNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">
                        {profile.ambulance.status.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {profile.ambulance.ambulanceType?.name.replace(
                          "_",
                          " ",
                        ) ?? "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ambulance is currently assigned to you.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
              <UserRoundIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                To update your name, vehicle or license details, contact the
                dispatch center — profile changes are managed by administrators.
              </p>
            </div>
          </div>
        )}
      </ContentSwap>
    </div>
  )
}
