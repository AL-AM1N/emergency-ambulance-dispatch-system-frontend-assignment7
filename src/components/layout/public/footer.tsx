import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { Brand } from "@/components/brand/brand"

const footerLinks = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Patients",
    items: [
      { label: "Request an Ambulance", href: "/register" },
      { label: "Hospitals", href: "/hospitals" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Partners",
    items: [
      { label: "Drive with AmbuLink", href: "/register/driver" },
      { label: "Ambulance Types", href: "/services" },
      { label: "Emergency Info", href: "/" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <Brand />
            <p className="text-sm text-muted-foreground">
              On-demand emergency ambulance dispatch, connecting patients,
              drivers and dispatchers in minutes.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AmbuLink. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/"
              aria-label="AmbuLink website"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <GlobeIcon className="size-4" />
            </a>
            <a
              href="mailto:support@ambulink.example"
              aria-label="Email support"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <MailIcon className="size-4" />
            </a>
            <a
              href="tel:+15550000000"
              aria-label="Call support"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <PhoneIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
