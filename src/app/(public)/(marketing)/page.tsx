import {
  ActivityIcon,
  Ambulance as AmbulanceIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  Clock3Icon,
  MapPinIcon,
  PhoneCallIcon,
  RadioIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { EmergencyStrip } from "@/components/landing/emergency-strip"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: AmbulanceIcon,
    title: "Ambulance Dispatch",
    description:
      "Request an ambulance from your phone and get dispatched to the nearest available unit instantly.",
  },
  {
    icon: RadioIcon,
    title: "Live Response",
    description:
      "Track your emergency response in real time with live driver and vehicle status.",
  },
  {
    icon: MapPinIcon,
    title: "Hospital Select",
    description:
      "Choose a nearby hospital or let our dispatchers route you to the best emergency facility.",
  },
  {
    icon: Clock3Icon,
    title: "Priority Handling",
    description:
      "Severity-based priority queuing ensures critical cases are attended to first.",
  },
]

const steps = [
  {
    number: "01",
    title: "Request help",
    description:
      "Tell us your location and the type of emergency through the app in under a minute.",
  },
  {
    number: "02",
    title: "Get dispatched",
    description:
      "Our dispatch center assigns the nearest available ambulance based on severity.",
  },
  {
    number: "03",
    title: "Arrive at care",
    description:
      "Follow the live trip, arrive at the hospital and settle payment securely online.",
  },
]

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <BadgeCheckIcon className="size-4 text-red-600" />
              Trusted Emergency Dispatch Platform
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Emergency care,
              <span className="text-red-600"> dispatched in minutes.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              AmbuLink connects you with the nearest available ambulance, live
              tracking, and priority handling — so you can focus on what matters
              most.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/register" />}
              >
                <PhoneCallIcon className="size-4" />
                Request an Ambulance
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                render={<Link href="/services" />}
              >
                Explore Services
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <EmergencyStrip />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            What we do
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Complete emergency response, end to end
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-3 rounded-xl border bg-card p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <service.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              From call to care in three steps
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative rounded-xl border p-6">
                <p className="text-4xl font-black text-red-100">
                  {step.number}
                </p>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-16 text-center sm:flex-row sm:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready for an emergency?
            </h2>
            <p className="text-red-100">
              Register now and have an ambulance at your door in minutes.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            render={<Link href="/register" />}
          >
            <UsersIcon className="size-4" />
            Create your account
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ActivityIcon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-muted-foreground">Always available</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Clock3Icon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">Under 1 min</p>
              <p className="text-sm text-muted-foreground">
                Average request time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <RadioIcon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">Real-time</p>
              <p className="text-sm text-muted-foreground">
                Live trip tracking
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
