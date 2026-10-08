"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useForm } from "@tanstack/react-form"
import { KeyRoundIcon, Loader2Icon, LockKeyholeIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useGoogleLogin, useLogin } from "@/hooks"
import { getStoredRole, roleHome } from "@/lib/auth"
import { attemptDemoLogin } from "@/lib/demo"
import type { DemoRole } from "@/types"
import { loginSchema } from "@/validation"

const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

const demoOptions: Array<{
  role: DemoRole
  label: string
  description: string
}> = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Dispatch center",
  },
  {
    role: "DRIVER",
    label: "Driver",
    description: "Ambulance operator",
  },
  {
    role: "PATIENT",
    label: "Patient",
    description: "Request emergency help",
  },
]

export function LoginForm() {
  const router = useRouter()
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
        await login.mutateAsync({
          email: value.email,
          password: value.password,
        })
        router.replace(roleHome(getStoredRole()))
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
        router.replace(result.home)
      } else {
        toast.error(result.message ?? "Demo login failed")
      }
    } finally {
      setDemoLoading(null)
    }
  }

  const handleGoogleSuccess = async (credential: string) => {
    try {
      await googleLogin.mutateAsync({ idToken: credential })
      router.replace(roleHome(getStoredRole()))
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">One-click demo access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {demoOptions.map((option) => (
            <Button
              key={option.role}
              variant="outline"
              className="w-full justify-between"
              disabled={demoLoading !== null}
              onClick={() => void handleDemoLogin(option.role)}
            >
              <span className="flex flex-col items-start">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {demoLoading === option.role && (
                <Loader2Icon className="size-4 animate-spin" />
              )}
            </Button>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            Demo logins are auto-provisioned on first use.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
