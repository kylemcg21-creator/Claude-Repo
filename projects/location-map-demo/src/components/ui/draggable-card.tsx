"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, type PanInfo } from "framer-motion"

interface DraggableCardProps {
  children: React.ReactNode
  /** Ref to the element the card is allowed to be dragged within. */
  constraintsRef?: React.RefObject<HTMLElement>
  className?: string
  /** How far the pointer may move (px) before a press counts as a drag, not a click. */
  dragThreshold?: number
}

/**
 * A moveable surface that lets its child be dragged (flung) around a bounded
 * area while the child stays fully interactive.
 *
 * The "react to" part is delegated to the child: on release the card settles
 * with spring momentum, lifts on grab, and — crucially — a real drag never
 * leaks through as a click, so an interactive child (e.g. a card that expands
 * on click) does not toggle when you were only repositioning it.
 *
 * Built on framer-motion's `drag` primitive, the same foundation the 21st.dev
 * draggable components use, so no extra dependency is required.
 */
export function DraggableCard({
  children,
  constraintsRef,
  className,
  dragThreshold = 6,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  // Tracks whether the most recent gesture moved far enough to be a drag.
  const didDrag = useRef(false)

  const handleDragStart = () => {
    didDrag.current = false
    setIsDragging(true)
  }

  const handleDrag = (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (Math.hypot(info.offset.x, info.offset.y) > dragThreshold) {
      didDrag.current = true
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Capture phase runs before the child's own onClick — swallow the click that
  // browsers synthesize at the end of a drag so the child doesn't react to it.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault()
      e.stopPropagation()
      didDrag.current = false
    }
  }

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.12}
      dragMomentum
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClickCapture={handleClickCapture}
      whileDrag={{ scale: 1.04, zIndex: 50 }}
      animate={{
        boxShadow: isDragging
          ? "0 30px 60px -12px rgba(0,0,0,0.35)"
          : "0 10px 30px -15px rgba(0,0,0,0.25)",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={`inline-block touch-none rounded-2xl ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${className ?? ""}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  )
}
