"use client"

import { useForm } from "@tanstack/react-form"
import { CheckCircle2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ContactReason = "EMERGENCY" | "GENERAL" | "PARTNERSHIP" | "OTHER"

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  type: z.enum(["EMERGENCY", "GENERAL", "PARTNERSHIP", "OTHER"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      type: "GENERAL" as ContactReason,
      message: "",
    },
    validators: {
      onChange: contactSchema,
      onSubmit: contactSchema,
    },
    onSubmit({ value }) {
      console.info("Contact message received:", value)
      toast.success("Message sent! We will get back to you shortly.")
      setSubmitted(true)
    },
  })

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2Icon className="size-10 text-green-600" />
        <h3 className="text-lg font-semibold">Thank you for reaching out!</h3>
        <p className="text-sm text-muted-foreground">
          Our team will respond to your message within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Full name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="John Doe"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Email address</Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="you@example.com"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <form.Field
        name="type"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Reason for contact</Label>
            <select
              id={field.name}
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.target.value as ContactReason)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="EMERGENCY">Emergency</option>
              <option value="GENERAL">General enquiry</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        )}
      />

      <form.Field
        name="message"
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Message</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Tell us how we can help…"
              rows={5}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      />

      <Button
        type="submit"
        disabled={form.state.isSubmitting}
        className="w-full"
      >
        {form.state.isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}
