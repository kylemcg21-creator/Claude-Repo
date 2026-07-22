"use client"

// Draggable Card — Aceternity UI, as published on 21st.dev.
// Source: https://ui.aceternity.com/components/draggable-card (MIT)
// Install (registry): npx shadcn@latest add "https://21st.dev/r/aceternity/draggable-card"
//
// Three adaptations for this project, nothing else changed:
//   1. Imports come from `framer-motion` (already a dependency) instead of the
//      newer `motion/react` package — the hooks are identical re-exports.
//   2. 3D depth is set via an inline `transformStyle: "preserve-3d"` instead of
//      Tailwind v4's `transform-3d` utility, since this project is on Tailwind v3.
//   3. Dropped the upstream `onDragEnd` velocity/`animate()` block: it computed a
//      value and animated it to nothing (no motion value, no onUpdate), so it was
//      a no-op. Drag release inertia still comes from framer's own `dragMomentum`.

import { cn } from "@/lib/utils"
import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationControls,
} from "framer-motion"

export const DraggableCardBody = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })
  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  }

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig)

  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]), springConfig)

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig,
  )

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        })
      }
    }

    updateConstraints()

    window.addEventListener("resize", updateConstraints)

    return () => {
      window.removeEventListener("resize", updateConstraints)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { width, height, left, top } = cardRef.current?.getBoundingClientRect() ?? {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    }
    const centerX = left + width / 2
    const centerY = top + height / 2
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    mouseX.set(deltaX)
    mouseY.set(deltaY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = "grabbing"
      }}
      onDragEnd={() => {
        document.body.style.cursor = "default"

        // Spring the tilt back to flat on release.
        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        })
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-96 w-80 overflow-hidden rounded-md bg-neutral-100 p-6 shadow-2xl dark:bg-neutral-900",
        className,
      )}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 select-none rounded-[inherit] bg-white"
      />
    </motion.div>
  )
}

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return <div className={cn("[perspective:3000px]", className)}>{children}</div>
}
