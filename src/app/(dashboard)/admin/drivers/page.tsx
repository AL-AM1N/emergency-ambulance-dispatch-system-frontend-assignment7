"use client"

import {
  Loader2Icon,
  PencilIcon,
  SearchIcon,
  ShieldBanIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { ContentSwap } from "@/components/motion"
import { EmptyState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/skeletons"
import TablePagination from "@/components/shared/table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useListDrivers, useUpdateDriver, useUpdateDriverStatus } from "@/hooks"
import { pickParam, updateSearchParams } from "@/lib/url"
import type { Driver } from "@/types"

function DriverStatusBadge({ status }: { status: string }) {
  const blocked = status === "BLOCKED"
  return (
    <Badge
      className={
        blocked
          ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      }
    >
      {status}
    </Badge>
  )
}

function DriverFormDialog({
  driver,
  onClose,
}: {
  driver: Driver
  onClose: () => void
}) {
  const updateDriver = useUpdateDriver()

  const [contactNumber, setContactNumber] = useState(driver.contactNumber)
  const [licenseNumber, setLicenseNumber] = useState(driver.licenseNumber)
  const [vehicleNumber, setVehicleNumber] = useState(driver.vehicleNumber)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!contactNumber.trim() || !licenseNumber.trim()) {
      setError("Contact number and license number are required.")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      await updateDriver.mutateAsync({
        id: driver.id,
        payload: {
          contactNumber: contactNumber.trim(),
          licenseNumber: licenseNumber.trim(),
          vehicleNumber: vehicleNumber.trim() || undefined,
        },
      })
      onClose()
    } catch {
      // Toast already shown by the hook.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit driver</DialogTitle>
          <DialogDescription>
            Update contact and vehicle details for {driver.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="contactNumber">Contact number</Label>
            <Input
              id="contactNumber"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber">License number</Label>
            <Input
              id="licenseNumber"
              value={licenseNumber}
              onChange={(event) => setLicenseNumber(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vehicleNumber">
              Vehicle number{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(event) => setVehicleNumber(event.target.value)}
            />
          </div>
          <FieldError errors={error ? [{ message: error }] : []} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2Icon className="size-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DriversView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const searchTerm = pickParam(searchParams, "q")

  const [editing, setEditing] = useState<Driver | null>(null)

  const { data, isLoading, isError } = useListDrivers({
    page,
    limit: 10,
    searchTerm,
  })
  const updateStatus = useUpdateDriverStatus()

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  const drivers = data?.result ?? []

  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Manage driver accounts and access."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchTerm}
            placeholder="Search drivers…"
            aria-label="Search drivers"
            className="w-60 pl-9"
            onChange={(event) => navigate({ q: event.target.value, page: 1 })}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={() => router.replace("?")}>
            Reset
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <ContentSwap
            stateKey={
              isLoading
                ? "loading"
                : isError
                  ? "error"
                  : drivers.length === 0
                    ? "empty"
                    : "ready"
            }
          >
            {isLoading && <TableSkeleton columns={6} />}

            {!isLoading && isError && (
              <div className="p-6">
                <EmptyState
                  icon={UsersIcon}
                  title="Could not load drivers"
                  description="Please try refreshing the page."
                />
              </div>
            )}

            {!isLoading && !isError && drivers.length === 0 && (
              <div className="p-6">
                <EmptyState
                  icon={UsersIcon}
                  title="No drivers found"
                  description="Drivers who register on the platform will appear here."
                />
              </div>
            )}

            {!isLoading && !isError && drivers.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {driver.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {driver.vehicleNumber}
                        </TableCell>
                        <TableCell>
                          {driver.ambulanceType.replace("_", " ") ?? "—"}
                        </TableCell>
                        <TableCell>
                          <DriverStatusBadge
                            status={driver.user?.status ?? "ACTIVE"}
                          />
                        </TableCell>
                        <TableCell>
                          {driver.isAvailable ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit driver"
                              onClick={() => setEditing(driver)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                            {(driver.user?.status ?? "ACTIVE") === "ACTIVE" ? (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Block driver"
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: driver.id,
                                    status: "BLOCKED",
                                  })
                                }
                              >
                                <ShieldBanIcon className="size-4 text-rose-600" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Activate driver"
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: driver.id,
                                    status: "ACTIVE",
                                  })
                                }
                              >
                                <ShieldCheckIcon className="size-4 text-emerald-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t p-4">
                  <TablePagination
                    page={data?.meta.page ?? 1}
                    totalPages={data?.meta.totalPages ?? 1}
                    onPageChange={(next) => navigate({ page: next })}
                  />
                </div>
              </>
            )}
          </ContentSwap>
        </CardContent>
      </Card>

      {editing && (
        <DriverFormDialog driver={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

export default function AdminDriversPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DriversView />
    </Suspense>
  )
}
