"use client"

import type { ReactNode } from "react"
import { Toaster } from "react-hot-toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/context/auth.context"
import GoogleAuthProvider from "./google-auth.provider"
import MotionProvider from "./motion.provider"
import QueryProvider from "./query.provider"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <AuthProvider>
          <MotionProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: "0.75rem",
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                  },
                }}
              />
            </TooltipProvider>
          </MotionProvider>
        </AuthProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  )
}
