"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { EASE_OUT } from "@/lib/motion"

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
