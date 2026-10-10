"use client"

import { type HTMLMotionProps, motion, type Variants } from "motion/react"
import { fadeInUp } from "@/lib/motion"

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number
  variants?: Variants
  inView?: boolean
}

export function FadeIn({
  delay = 0,
  variants = fadeInUp,
  inView = false,
  transition,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      transition={delay ? { delay } : transition}
      {...(inView
        ? {
            whileInView: "visible",
            viewport: { once: true, margin: "0px 0px -80px 0px" },
          }
        : { animate: "visible" })}
      {...props}
    />
  )
}
