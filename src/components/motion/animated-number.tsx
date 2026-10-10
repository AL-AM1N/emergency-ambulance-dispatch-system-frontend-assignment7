"use client"

import { animate, useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { EASE_OUT } from "@/lib/motion"

type AnimatedNumberProps = {
  value: number
  format?: (value: number) => string
  className?: string
  duration?: number
}

export function AnimatedNumber({
  value,
  format,
  className,
  duration = 0.9,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {format ? format(display) : Math.round(display).toLocaleString()}
    </span>
  )
}
