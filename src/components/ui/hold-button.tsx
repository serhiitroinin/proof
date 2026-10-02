import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button, type buttonVariants } from "@/components/ui/button"
import { MotifDot } from "@/components/ui/motif"

// The fill is linear over `duration` ms so the hand can read the clock.

type HoldButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> &
  VariantProps<typeof buttonVariants> & {
    /** Hold time in ms. Default 1100 (5 dur). */
    duration?: number
    onConfirm?: () => void
    /** Label while done. Defaults to `children`. */
    doneLabel?: React.ReactNode
    /** How long the done state shows before resetting, in ms. */
    resetAfter?: number
  }

function HoldButton({
  children,
  duration = 1100,
  onConfirm,
  doneLabel,
  resetAfter = 1800,
  variant = "outline",
  className,
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  ...props
}: HoldButtonProps) {
  const [held, setHeld] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const confirm = React.useRef(onConfirm)
  React.useEffect(() => {
    confirm.current = onConfirm
  })

  React.useEffect(() => {
    if (!held || done) return
    const t = setTimeout(() => {
      setDone(true)
      setHeld(false)
      confirm.current?.()
    }, duration)
    return () => clearTimeout(t)
  }, [held, done, duration])

  React.useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setDone(false), resetAfter)
    return () => clearTimeout(t)
  }, [done, resetAfter])

  const start = () => !done && !disabled && setHeld(true)
  const stop = () => setHeld(false)
  const isKey = (e: React.KeyboardEvent) => e.key === " " || e.key === "Enter"
  const state = done ? "done" : held ? "held" : "idle"

  return (
    <Button
      data-slot="hold-button"
      data-state={state}
      variant={done ? "destructive" : variant}
      disabled={disabled}
      aria-live="polite"
      style={{ "--hold": `${duration}ms` } as React.CSSProperties}
      className={cn("relative overflow-visible select-none", className)}
      onPointerDown={(e) => {
        onPointerDown?.(e)
        if (e.button === 0) start()
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e)
        stop()
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        stop()
      }}
      onPointerCancel={(e) => {
        onPointerCancel?.(e)
        stop()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (isKey(e)) {
          e.preventDefault()
          if (!e.repeat) start()
        }
      }}
      onKeyUp={(e) => {
        onKeyUp?.(e)
        if (isKey(e)) {
          e.preventDefault()
          stop()
        }
      }}
      {...props}
    >
      {done && doneLabel !== undefined ? doneLabel : children}
      <span
        aria-hidden
        data-slot="hold-button-line"
        className={cn(
          "pointer-events-none absolute right-2 -bottom-2 left-2 h-[1.5px] origin-left rounded-[1px] bg-foreground transition-transform duration-[264ms] ease-standard",
          state === "idle" && "scale-x-0",
          state === "held" && "scale-x-100 duration-(--hold) ease-linear",
          state === "done" && "scale-x-100 bg-destructive transition-none"
        )}
      />
      {done && <MotifDot tone="destructive" className="pointer-events-none absolute -right-0.5 -bottom-[9.5px]" />}
    </Button>
  )
}

export { HoldButton }
export type { HoldButtonProps }
