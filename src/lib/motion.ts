import type { Transition, Variants } from "motion/react"

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
}

export const transitionBase: Transition = {
  duration: 0.4,
  ease: EASE_OUT,
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitionBase },
}

export function staggerContainer(
  stagger = 0.08,
  delayChildren = 0.04,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
}
