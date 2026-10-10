"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useForm } from "@tanstack/react-form"
import {
  AmbulanceIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useGoogleLogin, useLogin } from "@/hooks"
import { roleHome, tokenToRole } from "@/lib/auth"
import { attemptDemoLogin } from "@/lib/demo"
import type { DemoRole } from "@/types"
import { loginSchema } from "@/validation"

const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

const demoOptions: Array<{
  role: DemoRole
  label: string
  description: string
  icon: typeof ShieldCheckIcon
}> = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Dispatch center",
    icon: ShieldCheckIcon,
  },
  {
    role: "DRIVER",
    label: "Driver",
    description: "Ambulance operator",
    icon: AmbulanceIcon,
  },
  {
    role: "PATIENT",
    label: "Patient",
    description: "Request emergency help",
    icon: UserRoundIcon,
  },
]

export function LoginForm() {
  const login = useLogin()
  const googleLogin = useGoogleLogin()
  const [demoLoading, setDemoLoading] = useState<DemoRole | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await login.mutateAsync({
          email: value.email,
          password: value.password,
        })
        window.location.assign(roleHome(tokenToRole(result.accessToken)))
      } catch {
        // Toast already shown by the hook.
      }
    },
  })

  const handleDemoLogin = async (role: DemoRole) => {
    setDemoLoading(role)
    try {
      const result = await attemptDemoLogin(role)
      if (result.ok && result.home) {
        toast.success(`${role} demo session ready`)
        window.location.assign(result.home)
      } else {
        toast.error(result.message ?? "Demo login failed")
      }
    } finally {
      setDemoLoading(null)
    }
  }

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const result = await googleLogin.mutateAsync({ idToken: credential })
      window.location.assign(roleHome(tokenToRole(result.accessToken)))
    } catch {
      // Toast already shown by the hook.
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <LockKeyholeIcon className="size-6" />
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Log in to access your dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="email"
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>Password</Label>
                    <Link
                      href="/contact"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Logging in…
                </>
              ) : (
                <>
                  <KeyRoundIcon className="size-4" />
                  Log in
                </>
              )}
            </Button>
          </form>

          {hasGoogleClientId && (
            <>
              <div className="my-4 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(response) => {
                    if (response.credential) {
                      void handleGoogleSuccess(response.credential)
                    }
                  }}
                  onError={() => toast.error("Google sign-in failed")}
                />
              </div>
            </>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>

      <div className="relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-red-500/10 via-orange-400/10 to-rose-500/10 p-4 shadow-sm backdrop-blur-md dark:border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -left-10 size-32 rounded-full bg-red-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-14 size-36 rounded-full bg-orange-400/30 blur-3xl"
        />

        <div className="relative">
          <p className="mb-3 text-sm font-medium">One-click demo access</p>
          <div className="grid grid-cols-3 gap-2">
            {demoOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.role}
                  variant="ghost"
                  title={option.description}
                  className="h-auto flex-col gap-1.5 border border-white/30 bg-white/20 py-3 text-foreground shadow-sm backdrop-blur-md hover:bg-white/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  disabled={demoLoading !== null}
                  onClick={() => void handleDemoLogin(option.role)}
                >
                  {demoLoading === option.role ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Icon className="size-4 text-red-600" />
                  )}
                  <span className="text-xs font-medium">{option.label}</span>
                </Button>
              )
            })}
          </div>
          <p className="pt-3 text-xs text-muted-foreground">
            Demo logins are auto-provisioned on first use.
          </p>
        </div>
      </div>
    </div>
  )
}
