"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "cn"

// `stalled` is set by the caller, or after `stallAfter` ms without change once progress has started.
function Progress({
  className,
  children,
  value,
  variant = "default",
  error = false,
  stalled,
  stallAfter = 2000,
  ...props
}: ProgressPrimitive.Root.Props & {
  variant?: "default" | "bar" | "tool"
  error?: boolean
  stalled?: boolean
  stallAfter?: number
}) {
  const auto = useStall(value, stallAfter)
  const isStalled = stalled ?? (auto && !error)
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      data-variant={variant}
      data-error={error || undefined}
      data-stalled={isStalled || undefined}
      className={cn("group/progress flex w-full flex-wrap items-center gap-x-3 gap-y-2", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

// True once a value has changed and then held still for `after` ms short of completion.
function useStall(value: number | null | undefined, after: number) {
  const [stalledAt, setStalledAt] = React.useState<number | null | undefined>()
  const seen = React.useRef<number | null | undefined>(value)
  const moved = React.useRef(false)
  React.useEffect(() => {
    if (value !== seen.current) moved.current = true
    seen.current = value
    if (!moved.current || value == null || value >= 100 || after <= 0) return
    const t = setTimeout(() => setStalledAt(value), after)
    return () => clearTimeout(t)
  }, [value, after])
  return stalledAt !== undefined && stalledAt === value
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex w-full items-center",
        // bar, tool
        "group-data-[variant=bar]/progress:h-1 group-data-[variant=bar]/progress:overflow-hidden group-data-[variant=bar]/progress:rounded-full group-data-[variant=bar]/progress:bg-fill-active group-data-[variant=bar]/progress:shadow-well",
        "group-data-[variant=tool]/progress:h-1 group-data-[variant=tool]/progress:overflow-hidden group-data-[variant=tool]/progress:rounded-full group-data-[variant=tool]/progress:bg-fill-active group-data-[variant=tool]/progress:shadow-well",
        // motif: the hairline track hides once the line is complete
        "group-data-[variant=default]/progress:h-2.5 group-data-[variant=default]/progress:before:absolute group-data-[variant=default]/progress:before:inset-x-0 group-data-[variant=default]/progress:before:top-1/2 group-data-[variant=default]/progress:before:h-px group-data-[variant=default]/progress:before:-translate-y-1/2 group-data-[variant=default]/progress:before:bg-border-strong group-data-[variant=default]/progress:before:transition-opacity group-data-[variant=default]/progress:before:duration-[220ms] group-data-complete/progress:before:opacity-0",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "relative h-full transition-[width] duration-[440ms] ease-standard",
        // bar, tool
        "group-data-[variant=bar]/progress:rounded-full group-data-[variant=bar]/progress:bg-primary",
        "group-data-[variant=tool]/progress:rounded-full group-data-[variant=tool]/progress:bg-tool",
        // motif
        "group-data-[variant=default]/progress:bg-[linear-gradient(to_bottom,transparent_4.25px,var(--foreground)_4.25px_5.75px,transparent_5.75px)]",
        "group-data-[variant=default]/progress:after:absolute group-data-[variant=default]/progress:after:top-1/2 group-data-[variant=default]/progress:after:right-0 group-data-[variant=default]/progress:after:size-2.5 group-data-[variant=default]/progress:after:translate-x-1/2 group-data-[variant=default]/progress:after:-translate-y-1/2 group-data-[variant=default]/progress:after:rounded-full group-data-[variant=default]/progress:after:bg-tool",
        "group-data-complete/progress:after:animate-pop",
        "group-data-stalled/progress:after:animate-breathe",
        "group-data-error/progress:bg-[linear-gradient(to_bottom,transparent_4.25px,var(--foreground)_4.25px_5.75px,transparent_5.75px)] group-data-error/progress:bg-[length:calc(100%-8px)_100%] group-data-error/progress:bg-no-repeat group-data-error/progress:after:top-[16px] group-data-error/progress:after:bg-destructive! group-data-error/progress:after:[--fall:-11px] group-data-error/progress:after:animate-fall",
        "group-data-indeterminate/progress:w-full group-data-indeterminate/progress:bg-[radial-gradient(circle,var(--tool)_4.25px,transparent_5px),linear-gradient(to_bottom,transparent_4.25px,var(--foreground)_4.25px_5.75px,transparent_5.75px)]! group-data-indeterminate/progress:bg-[length:10px_10px,16px_10px]! group-data-indeterminate/progress:bg-no-repeat group-data-indeterminate/progress:animate-[shimmer_1.6s_var(--ease-standard)_infinite_alternate] group-data-indeterminate/progress:after:hidden",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium group-data-error/progress:text-destructive", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn("ml-auto font-mono text-xs text-faint tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  )
}

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue }
