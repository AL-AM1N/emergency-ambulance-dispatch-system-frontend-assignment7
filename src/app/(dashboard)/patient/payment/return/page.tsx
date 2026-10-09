"use client"

import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConfirmPayment } from "@/hooks"
import { PATIENT_ROUTES } from "@/routes"

type ReturnStatus = "verifying" | "success" | "error"

function PaymentReturnView() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get("payment_intent") ?? ""
  const tripId = searchParams.get("tripId") ?? ""
  const { mutate: confirmPayment } = useConfirmPayment()
  const startedRef = useRef(false)
  const [status, setStatus] = useState<ReturnStatus>("verifying")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (startedRef.current) {
      return
    }
    if (!paymentIntentId || !tripId) {
      setStatus("error")
      setError("Missing payment details. If you were charged, contact support.")
      return
    }

    startedRef.current = true
    confirmPayment(
      { paymentIntentId, tripId },
      {
        onSuccess: () => setStatus("success"),
        onError: (mutationError) => {
          setStatus("error")
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : "We could not verify your payment.",
          )
        },
      },
    )
  }, [confirmPayment, paymentIntentId, tripId])

  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Payment"
        description="Confirming the result of your payment."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          {status === "verifying" && (
            <>
              <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
              <p className="font-medium">Verifying payment…</p>
              <p className="text-sm text-muted-foreground">
                Please wait while we confirm your transaction.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2Icon className="size-12 text-emerald-600" />
              <p className="text-lg font-semibold">Payment complete</p>
              <p className="text-sm text-muted-foreground">
                Thank you. Your trip has been paid for.
              </p>
              <Button render={<Link href={PATIENT_ROUTES.trips} />}>
                Back to trips
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircleIcon className="size-12 text-destructive" />
              <p className="text-lg font-semibold">Payment not verified</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                render={<Link href={PATIENT_ROUTES.trips} />}
              >
                Back to trips
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PatientPaymentReturnPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <PaymentReturnView />
    </Suspense>
  )
}
