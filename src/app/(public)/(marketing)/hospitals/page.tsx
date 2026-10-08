import { HospitalsList } from "@/components/landing/hospitals-list"

export default function HospitalsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Hospitals
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Partner hospital network
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Our dispatch center coordinates with hospitals across the region
              to route patients to the right facility.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <HospitalsList />
      </section>
    </div>
  )
}
