"use client"

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BanknoteIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SirenIcon,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
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
      confirmParams: {
        return_url: `${window.location.origin}${PATIENT_ROUTES.paymentReturn}?tripId=${tripId}`,
      },
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
  const { mutate: createIntent } = useCreatePayment()
  const startedRef = useRef(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentError, setIntentError] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)

  const startPayment = useCallback(() => {
    if (!stripePromise || !trip || paid || startedRef.current) {
      return
    }
    if (trip.payment?.status === "COMPLETED") {
      setPaid(true)
      return
    }
    if (
      trip.status !== "COMPLETED" ||
      trip.fare === null ||
      trip.fare === undefined
    ) {
      return
    }

    startedRef.current = true
    createIntent(
      { tripId: trip.id, method: "STRIPE" },
      {
        onSuccess: (res) => {
          if (res.clientSecret) {
            setClientSecret(res.clientSecret)
          } else {
            setPaid(true)
          }
        },
        onError: (error) => {
          setIntentError(
            error instanceof Error
              ? error.message
              : "Could not start the payment.",
          )
        },
      },
    )
  }, [createIntent, paid, trip])

  useEffect(() => {
    startPayment()
  }, [startPayment])

  const paymentUnavailable =
    Boolean(trip) &&
    trip?.payment?.status !== "COMPLETED" &&
    (trip?.status !== "COMPLETED" ||
      trip?.fare === null ||
      trip?.fare === undefined)

  const handleRetry = () => {
    startedRef.current = false
    setIntentError(null)
    startPayment()
  }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" /> Preparing checkout…
      </div>
    )
  }

  if (paymentUnavailable) {
    return (
      <EmptyState
        icon={SirenIcon}
        title="Payment not available yet"
        description={
          trip?.fare === null || trip?.fare === undefined
            ? "The fare for this trip has not been generated yet. Please try again later."
            : "Payment can only be made once the trip has been completed."
        }
      />
    )
  }

  if (intentError) {
    return (
      <div className="mx-auto max-w-md">
        <PageHeader title="Payment" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircleIcon className="size-10 text-destructive" />
            <p className="font-medium">Could not start the payment</p>
            <p className="text-sm text-muted-foreground">{intentError}</p>
            <Button size="sm" onClick={handleRetry}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (trip && stripePromise && !clientSecret && !paid) {
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
