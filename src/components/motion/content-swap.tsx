"use client"

import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import { EASE_OUT } from "@/lib/motion"

export function ContentSwap({
  stateKey,
  children,
  className,
}: {
  stateKey: string
  children: ReactNode
  className?: string
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stateKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
