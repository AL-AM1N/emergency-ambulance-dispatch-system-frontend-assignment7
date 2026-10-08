import {
  CheckCircle2Icon,
  EyeIcon,
  RadioIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: ZapIcon,
    title: "Speed",
    description:
      "Every second counts. Our dispatch engine prioritizes the nearest available unit and routes it to you fast.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Care",
    description:
      "Every driver is verified, every ambulance is equipped, and every trip is handled with empathy and precision.",
  },
  {
    icon: EyeIcon,
    title: "Transparency",
    description:
      "Live tracking, clear pricing and full trip history so you always know what is happening.",
  },
]

const milestones = [
  {
    year: "2023",
    title: "The idea",
    description:
      "AmbuLink was founded to close the gap between emergency callers and available ambulance units.",
  },
  {
    year: "2024",
    title: "Live dispatch",
    description:
      "Launched our first dispatch center with priority queuing and hospital routing for partner hospitals.",
  },
  {
    year: "2025",
    title: "City wide rollout",
    description:
      "Expanded coverage to all major zones with a growing fleet of BLS, ALS, neonatal and patient transport units.",
  },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              About us
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Emergency dispatch, made reliable
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              AmbuLink is an emergency ambulance dispatch platform that brings
              patients, drivers, dispatchers and hospitals together on one
              real-time system.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border bg-card p-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <value.icon className="size-5" />
              </div>
              <h2 className="mt-4 font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Our journey
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Milestones along the way
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="rounded-xl border bg-card p-6"
              >
                <p className="text-sm font-bold text-red-600">
                  {milestone.year}
                </p>
                <h3 className="mt-2 font-semibold">{milestone.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-10 text-center">
          <CheckCircle2Icon className="size-10 text-red-600" />
          <h2 className="text-2xl font-bold tracking-tight">
            Mission-driven emergency care
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Our mission is simple: shorten response times, improve coordination,
            and give every caller confidence that help is on the way.
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <RadioIcon className="size-4" />
            Powered by a dedicated dispatch network
          </div>
          <Button render={<Link href="/register" />}>Join AmbuLink</Button>
        </div>
      </section>
    </div>
  )
}
