import {
  BanknoteIcon,
  ShieldCheckIcon,
  SirenIcon,
  UserRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { AmbulanceTypesGrid } from "@/components/landing/ambulance-types-grid"
import { Button } from "@/components/ui/button"

const highlights = [
  {
    icon: SirenIcon,
    title: "Priority severity routing",
    description:
      "Every request is triaged by urgency so the most critical cases get dispatched to the fastest ambulance.",
  },
  {
    icon: UserRoundIcon,
    title: "Trained & verified drivers",
    description:
      "All ambulance drivers are licensed, background checked and continuously rated by dispatchers.",
  },
  {
    icon: BanknoteIcon,
    title: "Transparent pricing",
    description:
      "Base fare plus a clear per-km rate set by ambulance type. Pay securely by card after the trip.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Safety first",
    description:
      "Live trip monitoring, hospital handover tracking and 24/7 support throughout every journey.",
  },
]

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Services
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Ambulance services for every situation
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              From basic life support to neonatal care, our fleet is equipped
              and dispatched based on the severity of your emergency.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Our fleet</h2>
          <p className="mt-1 text-muted-foreground">
            Transparent base fares and per-kilometre rates for each ambulance
            type.
          </p>
        </div>
        <AmbulanceTypesGrid />
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight">
              Why choose AmbuLink
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-xl border bg-card p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <highlight.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{highlight.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Request an ambulance now
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Create an account in under a minute and get access to live dispatch,
            tracking and secure payments.
          </p>
          <Button size="lg" render={<Link href="/register" />}>
            Get Started
          </Button>
        </div>
      </section>
    </div>
  )
}
