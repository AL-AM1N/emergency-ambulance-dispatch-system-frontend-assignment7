"use client"

import { type HTMLMotionProps, motion } from "motion/react"
import { staggerContainer, staggerItem } from "@/lib/motion"

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number
  delayChildren?: number
  inView?: boolean
}

export function Stagger({
  stagger = 0.08,
  delayChildren = 0.04,
  inView = false,
  variants,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      variants={variants ?? staggerContainer(stagger, delayChildren)}
      initial="hidden"
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

type StaggerItemProps = HTMLMotionProps<"div"> & {
  hoverLift?: boolean
}

export function StaggerItem({ hoverLift = false, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={hoverLift ? { y: -4 } : undefined}
      {...props}
    />
  )
}
