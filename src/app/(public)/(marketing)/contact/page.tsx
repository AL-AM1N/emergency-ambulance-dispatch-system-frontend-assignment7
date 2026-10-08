import { Clock3Icon, MailIcon, MapPinIcon, PhoneCallIcon } from "lucide-react"
import { ContactForm } from "@/components/landing/contact-form"

const channels = [
  {
    icon: PhoneCallIcon,
    title: "Emergency hotline",
    value: "Available 24/7",
    detail:
      "Call the emergency number listed on the home page for immediate assistance.",
  },
  {
    icon: MailIcon,
    title: "Email support",
    value: "support@ambulink.example",
    detail:
      "For bookings, payments or general enquiries. We reply within 24 hours.",
  },
  {
    icon: MapPinIcon,
    title: "Dispatch center",
    value: "123 Response Way, Metro City",
    detail:
      "Visit us for partnerships, driver onboarding or hospital integration.",
  },
  {
    icon: Clock3Icon,
    title: "Office hours",
    value: "24/7 operations",
    detail: "Our dispatch and support teams are always on duty.",
  },
]

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Contact
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              We are here to help
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a question about a trip, a partnership, or our services? Send
              us a message and our team will respond shortly.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {channels.map((channel) => (
              <div
                key={channel.title}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <channel.icon className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{channel.title}</h2>
                  <p className="text-sm font-medium text-red-600">
                    {channel.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {channel.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-bold tracking-tight">
                Send a message
              </h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                Fill in the form and we will be in touch.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
