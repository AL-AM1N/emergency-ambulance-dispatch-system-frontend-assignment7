import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How do I request an ambulance?",
    answer:
      "Create a free account as a patient, then open the app and fill in your location, a short description and your preferred ambulance type. Our dispatch center immediately assigns the nearest available unit.",
  },
  {
    question: "How are ambulance fees calculated?",
    answer:
      "Each ambulance type has a transparent base fare plus a per-kilometre rate. The estimated fare is shown when you confirm your request, and the final amount is settled securely by card after the trip.",
  },
  {
    question: "Can I track my ambulance in real time?",
    answer:
      "Yes. As a patient you can follow the live status of your request from assignment to pickup to the hospital, including the assigned driver and vehicle details.",
  },
  {
    question: "How does the dispatch center decide which ambulance to send?",
    answer:
      "Requests are triaged by urgency and distance. Critical cases are prioritized, and the closest suitable ambulance matching your selected type is dispatched first.",
  },
  {
    question: "Can I cancel a request?",
    answer:
      "You can cancel a request while it is still pending, assigned or en route to you. Once the emergency has started (pickup completed), cancellations are no longer available.",
  },
  {
    question: "Can I become a driver on AmbuLink?",
    answer:
      "Yes. Register with a driver account using your license and vehicle details. Once your ambulance is assigned to the fleet, you can accept incoming emergency trip requests from our dispatch center.",
  },
  {
    question: "Which hospitals can I be taken to?",
    answer:
      "At the time of your request you can be routed to any partner hospital in the network, or let our dispatchers select the closest appropriate facility based on your condition.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. Payments are processed through Stripe's secure card authentication with test-mode keys during development. We never store your card details.",
  },
]

export default function FaqPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              FAQ
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Everything you need to know about requesting, tracking and paying
              for emergency transport.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-xl border bg-card"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDownIcon className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
          <h2 className="text-xl font-bold tracking-tight">
            Still have questions?
          </h2>
          <p className="text-sm text-muted-foreground">
            Reach out to our team and we will get back to you quickly.
          </p>
          <Button render={<Link href="/contact" />}>Contact us</Button>
        </div>
      </section>
    </div>
  )
}
