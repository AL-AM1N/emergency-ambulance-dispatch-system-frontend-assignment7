"use client"

import { LoaderIcon } from "lucide-react"
import { motion } from "motion/react"

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full items-center justify-center"
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        <LoaderIcon className="size-6 animate-spin" />
        <span>{label}</span>
      </div>
    </motion.div>
  )
}
