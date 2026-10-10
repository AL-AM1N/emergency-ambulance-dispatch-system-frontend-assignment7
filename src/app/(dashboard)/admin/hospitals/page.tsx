"use client"

import {
  Building2Icon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/skeletons"
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
  useCreateHospital,
  useDeleteHospital,
  useListHospitals,
  useUpdateHospital,
} from "@/hooks"
import { pickParam, updateSearchParams } from "@/lib/url"
import { HOSPITAL_TYPES, type Hospital } from "@/types"

function HospitalFormDialog({
  hospital,
  onClose,
}: {
  hospital?: Hospital
  onClose: () => void
}) {
  const createHospital = useCreateHospital()
  const updateHospital = useUpdateHospital()

  const [name, setName] = useState(hospital?.name ?? "")
  const [address, setAddress] = useState(hospital?.address ?? "")
  const [contactNumber, setContactNumber] = useState(
    hospital?.contactNumber ?? "",
  )
  const [email, setEmail] = useState(hospital?.email ?? "")
  const [type, setType] = useState(hospital?.type ?? "GENERAL")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!name.trim() || !address.trim()) {
      setError("Name and address are required.")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      if (hospital) {
        await updateHospital.mutateAsync({
          id: hospital.id,
          payload: {
            name: name.trim(),
            address: address.trim(),
            contactNumber: contactNumber || undefined,
            email: email || undefined,
            type,
          },
        })
      } else {
        await createHospital.mutateAsync({
          name: name.trim(),
          address: address.trim(),
          contactNumber: contactNumber || undefined,
          email: email || undefined,
          type,
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
            {hospital ? "Edit hospital" : "Add hospital"}
          </DialogTitle>
          <DialogDescription>
            {hospital
              ? "Update the hospital details below."
              : "Register a new partner hospital."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Hospital name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="St. Mary's General Hospital"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="100 Hospital Road, Metro City"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactNumber">
                Contact number{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="contactNumber"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                placeholder="+1 555 000 2000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="frontdesk@hospital.example"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as Hospital["type"])
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {HOSPITAL_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
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
            {hospital ? "Save changes" : "Add hospital"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HospitalsView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(pickParam(searchParams, "page", "1"))
  const type = pickParam(searchParams, "type") as Hospital["type"] | ""
  const searchTerm = pickParam(searchParams, "q")

  const [editing, setEditing] = useState<Hospital | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Hospital | null>(null)

  const { data, isLoading, isError } = useListHospitals({
    page,
    limit: 10,
    type,
    searchTerm,
  })
  const deleteHospital = useDeleteHospital()

  const navigate = (updates: Record<string, string | number>) => {
    router.replace(updateSearchParams(searchParams, updates))
  }

  const hospitals = data?.result ?? []

  return (
    <div>
      <PageHeader
        title="Hospitals"
        description="Manage partner hospitals and facilities."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="size-4" />
            Add hospital
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchTerm}
            placeholder="Search hospitals…"
            aria-label="Search hospitals"
            className="w-60 pl-9"
            onChange={(event) => navigate({ q: event.target.value, page: 1 })}
          />
        </div>
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(event) => navigate({ type: event.target.value, page: 1 })}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All types</option>
          {HOSPITAL_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {(type || searchTerm) && (
          <Button variant="ghost" size="sm" onClick={() => router.replace("?")}>
            Reset
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && <TableSkeleton columns={5} />}

          {!isLoading && isError && (
            <div className="p-6">
              <EmptyState
                icon={Building2Icon}
                title="Could not load hospitals"
                description="Please try refreshing the page."
              />
            </div>
          )}

          {!isLoading && !isError && hospitals.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={Building2Icon}
                title="No hospitals found"
                description="Add your first partner hospital."
              />
            </div>
          )}

          {!isLoading && !isError && hospitals.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">
                        {hospital.name}
                      </TableCell>
                      <TableCell>{hospital.type}</TableCell>
                      <TableCell className="max-w-56 truncate">
                        {hospital.address}
                      </TableCell>
                      <TableCell>{hospital.contactNumber ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Edit hospital"
                            onClick={() => setEditing(hospital)}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Delete hospital"
                            onClick={() => setDeleting(hospital)}
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
        </CardContent>
      </Card>

      {creating && <HospitalFormDialog onClose={() => setCreating(false)} />}
      {editing && (
        <HospitalFormDialog
          hospital={editing}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          open
          onOpenChange={() => setDeleting(null)}
          title="Delete hospital"
          description={`Remove ${deleting.name} from the network? This cannot be undone.`}
          confirmLabel="Delete"
          pendingLabel="Deleting…"
          isPending={deleteHospital.isPending}
          onConfirm={() => {
            deleteHospital.mutate(deleting.id)
            setDeleting(null)
          }}
        />
      )}
    </div>
  )
}

export default function AdminHospitalsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HospitalsView />
    </Suspense>
  )
}
