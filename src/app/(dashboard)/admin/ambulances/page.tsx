"use client"

import {
  AmbulanceIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { ContentSwap } from "@/components/motion"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/skeletons"
import { AmbulanceStatusBadge } from "@/components/shared/status-badge"
import TablePagination from "@/components/shared/table-pagination"
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
import {
  useCreateAmbulance,
  useDeleteAmbulance,
  useGetAmbulanceTypes,
  useListAmbulances,
  useListDrivers,
  useUpdateAmbulance,
} from "@/hooks"
import { pickParam, updateSearchParams } from "@/lib/url"
import { AMBULANCE_STATUSES, type Ambulance } from "@/types"

function AmbulanceFormDialog({
  ambulance,
  onClose,
}: {
  ambulance?: Ambulance
  onClose: () => void
}) {
  const { data: typesData } = useGetAmbulanceTypes()
  const { data: driversData } = useListDrivers({ page: 1, limit: 100 })
  const createAmbulance = useCreateAmbulance()
  const updateAmbulance = useUpdateAmbulance()

  const [vehicleNumber, setVehicleNumber] = useState(
    ambulance?.vehicleNumber ?? "",
  )
  const [ambulanceTypeId, setAmbulanceTypeId] = useState(
    ambulance?.ambulanceTypeId ?? "",
  )
  const [status, setStatus] = useState(ambulance?.status ?? "AVAILABLE")
  const [driverId, setDriverId] = useState(ambulance?.driverId ?? "")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const types = typesData ?? []
  const drivers = driversData?.result ?? []

  const options = types
    .filter((type) => type.isActive)
    .map((type) => ({ value: type.id, label: type.name.replace("_", " ") }))

  const submit = async () => {
    if (!vehicleNumber.trim()) {
      setError("Vehicle number is required.")
      return
    }
    if (!types.some((type) => type.id === ambulanceTypeId)) {
      setError("Please choose an ambulance type.")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      if (ambulance) {
        await updateAmbulance.mutateAsync({
          id: ambulance.id,
          payload: {
            vehicleNumber: vehicleNumber.trim(),
            status,
            ambulanceTypeId,
            driverId: driverId || undefined,
          },
        })
      } else {
        await createAmbulance.mutateAsync({
          vehicleNumber: vehicleNumber.trim(),
          ambulanceTypeId,
          status,
          driverId: driverId || undefined,
        })
      }
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
          <DialogTitle>
            {ambulance ? "Edit ambulance" : "Add ambulance"}
          </DialogTitle>
          <DialogDescription>
            {ambulance
              ? "Update the ambulance details below."
              : "Register a new ambulance in the fleet."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="vehicleNumber">Vehicle number</Label>
            <Input
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(event) => setVehicleNumber(event.target.value)}
              placeholder="AMB-1024"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ambulanceTypeId">Type</Label>
            <select
              id="ambulanceTypeId"
              value={ambulanceTypeId}
              onChange={(event) => setAmbulanceTypeId(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Choose a type…</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Ambulance["status"])
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {AMBULANCE_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="driverId">
              Assigned driver{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <select
              id="driverId"
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">No driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.vehicleNumber})
                </option>
              ))}
            </select>
          </div>

          <FieldError errors={error ? [{ message: error }] : []} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2Icon className="size-4 animate-spin" />}
            {ambulance ? "Save changes" : "Add ambulance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AmbulancesView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const status = pickParam(searchParams, "status") as Ambulance["status"] | ""
  const searchTerm = pickParam(searchParams, "q")

  const [editing, setEditing] = useState<Ambulance | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Ambulance | null>(null)

  const { data, isLoading, isError } = useListAmbulances({
    page,
    limit: 10,
    status,
    searchTerm,
  })
  const deleteAmbulance = useDeleteAmbulance()

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  const ambulances = data?.result ?? []

  return (
    <div>
      <PageHeader
        title="Ambulances"
        description="Manage the ambulance fleet."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="size-4" />
            Add ambulance
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchTerm}
            placeholder="Search by vehicle number…"
            aria-label="Search ambulances"
            className="w-60 pl-9"
            onChange={(event) => navigate({ q: event.target.value, page: 1 })}
          />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) =>
            navigate({ status: event.target.value, page: 1 })
          }
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          {AMBULANCE_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>
        {(status || searchTerm) && (
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
                  : ambulances.length === 0
                    ? "empty"
                    : "ready"
            }
          >
            {isLoading && <TableSkeleton columns={6} />}

            {!isLoading && isError && (
              <div className="p-6">
                <EmptyState
                  icon={AmbulanceIcon}
                  title="Could not load ambulances"
                  description="Please try refreshing the page."
                />
              </div>
            )}

            {!isLoading && !isError && ambulances.length === 0 && (
              <div className="p-6">
                <EmptyState
                  icon={AmbulanceIcon}
                  title="No ambulances found"
                  description="Add your first ambulance to start dispatching."
                />
              </div>
            )}

            {!isLoading && !isError && ambulances.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ambulances.map((ambulance) => (
                      <TableRow key={ambulance.id}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            <AmbulanceIcon className="size-4 text-muted-foreground" />
                            {ambulance.vehicleNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          {ambulance.ambulanceType?.name.replace("_", " ") ??
                            "—"}
                        </TableCell>
                        <TableCell>
                          <AmbulanceStatusBadge status={ambulance.status} />
                        </TableCell>
                        <TableCell>{ambulance.driver?.name ?? "—"}</TableCell>
                        <TableCell>
                          {new Date(ambulance.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit ambulance"
                              onClick={() => setEditing(ambulance)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete ambulance"
                              onClick={() => setDeleting(ambulance)}
                            >
                              <Trash2Icon className="size-4 text-rose-600" />
                            </Button>
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

      {creating && <AmbulanceFormDialog onClose={() => setCreating(false)} />}
      {editing && (
        <AmbulanceFormDialog
          ambulance={editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          open
          onOpenChange={() => setDeleting(null)}
          title="Delete ambulance"
          description={`Remove ${deleting.vehicleNumber} from the fleet? This cannot be undone.`}
          confirmLabel="Delete"
          pendingLabel="Deleting…"
          isPending={deleteAmbulance.isPending}
          onConfirm={() => {
            deleteAmbulance.mutate(deleting.id)
            setDeleting(null)
          }}
        />
      )}
    </div>
  )
}

export default function AdminAmbulancesPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AmbulancesView />
    </Suspense>
  )
}
