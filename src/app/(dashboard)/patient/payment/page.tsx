"use client"

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SirenIcon,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { DashboardSkeleton, PageHeader } from "@/components/dashboard"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirmPayment, useCreatePayment, useGetTripById } from "@/hooks"
import { formatCurrency, shortId } from "@/lib/format"
import { PATIENT_ROUTES } from "@/routes"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

function CheckoutForm({
  tripId,
  amount,
  onSuccess,
}: {
  tripId: string
  amount: number
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const confirmPayment = useConfirmPayment()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setSubmitting(true)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setSubmitting(false)
      toast.error(error.message ?? "Payment could not be completed")
      return
    }

    if (paymentIntent) {
      try {
        await confirmPayment.mutateAsync({
          paymentIntentId: paymentIntent.id,
          tripId,
        })
        toast.success("Payment successful")
        onSuccess()
      } catch {
        // Toast already shown.
      }
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-4 text-sm">
        <p className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount due</span>
          <span className="text-lg font-bold">{formatCurrency(amount)}</span>
        </p>
      </div>
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || submitting}
      >
        {submitting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <BanknoteIcon className="size-4" />
            Pay now
          </>
        )}
      </Button>
    </form>
  )
}

function PaymentView() {
  const searchParams = useSearchParams()
  const tripId = searchParams.get("tripId") ?? ""
  const { data: trip, isLoading, isError } = useGetTripById(tripId)
  const createPayment = useCreatePayment()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!trip || paid) {
      return
    }
    if (trip.payment?.status === "COMPLETED") {
      setPaid(true)
      return
    }
    let active = true
    setClientSecret(null)
    createPayment
      .mutateAsync({ tripId: trip.id, method: "STRIPE" })
      .then((res) => {
        if (active && res.clientSecret) {
          setClientSecret(res.clientSecret)
        } else if (active) {
          setPaid(true)
        }
      })
      .catch(() => {
        // Toast already shown.
      })
    return () => {
      active = false
    }
  }, [trip?.id, trip?.payment?.status, createPayment, paid, trip])

  if (!tripId) {
    return (
      <EmptyState
        icon={SirenIcon}
        title="No trip selected"
        description="Choose a completed trip to pay for from your trips page."
      />
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={SirenIcon}
        title="Could not load the trip"
        description="Please try again later."
      />
    )
  }

  if (isLoading || (trip && !clientSecret && !paid)) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" /> Preparing checkout…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Payment"
        description={
          trip
            ? `Trip #${shortId(trip.id)} · ${trip.emergencyType.replace("_", " ")}`
            : undefined
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BanknoteIcon className="size-5 text-red-600" />
            Secure checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paid && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2Icon className="size-12 text-emerald-600" />
              <p className="text-lg font-semibold">Payment complete</p>
              <p className="text-sm text-muted-foreground">
                Thank you. Your trip has been paid for.
              </p>
              <Button render={<Link href={PATIENT_ROUTES.trips} />}>
                Back to trips
              </Button>
            </div>
          )}

          {!paid && clientSecret && trip && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <CheckoutForm
                tripId={trip.id}
                amount={trip.fare ?? 0}
                onSuccess={() => setPaid(true)}
              />
            </Elements>
          )}

          {!paid && !clientSecret && !stripePromise && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Online payments are not configured. Please contact support.
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        variant="ghost"
        size="sm"
        className="mt-4"
        render={<Link href={PATIENT_ROUTES.trips} />}
      >
        <ArrowLeftIcon className="size-4" />
        Back to trips
      </Button>
    </div>
  )
}

export default function PatientPaymentPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <PaymentView />
    </Suspense>
  )
}
