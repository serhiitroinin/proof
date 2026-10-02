import * as React from "react"
import { cn } from "cn"

// One ink line with the tool dot at its tip. Timings are multiples of 220ms (--dur).
//
//   done     the line draws, then the dot pops in at the end.
//   error    the line breaks at 58% and the dot falls off the break.
//   stalled  the dot breathes while the line holds still.
//   running  the dot rides the tip; the caller tweens `progress`.
//
// Change `key` to replay.

type MotifState = "idle" | "running" | "done" | "error" | "stalled"

type MotifProps = Omit<React.ComponentProps<"svg">, "width"> & {
  /** 0..1. Ignored for `done` (always 1). */
  progress?: number
  state?: MotifState
  /** Pixel width of the line, including the dot. */
  width?: number
  /** Dot diameter in px. The line is 1.5px regardless. */
  size?: number
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

function Motif({ progress = 1, state = "idle", width = 160, size = 8, className, ...props }: MotifProps) {
  if (state === "error") return <MotifBroken width={width} size={size} className={className} {...props} />
  const p = state === "done" ? 1 : clamp01(progress)
  const h = size * 2.4
  const y = h / 2
  const hx = size / 2
  const pad = hx + 2
  const x = pad + p * (width - 2 * pad)
  return (
    <svg
      data-slot="motif"
      data-state={state}
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      className={cn("block shrink-0 overflow-visible", className)}
      aria-hidden
      {...props}
    >
      {p < 1 && (
        <path
          data-slot="motif-track"
          d={`M${x + hx + 3} ${y}H${width - 1}`}
          fill="none"
          className="stroke-border-strong stroke-1 [stroke-linecap:round]"
        />
      )}
      <path
        data-slot="motif-line"
        d={`M1 ${y}H${x}`}
        pathLength={1}
        fill="none"
        className={cn(
          "stroke-foreground stroke-[1.5] [stroke-linecap:round]",
          state === "done" && "animate-draw [stroke-dasharray:1]"
        )}
      />
      <circle
        data-slot="motif-dot"
        cx={x}
        cy={y}
        r={hx}
        className={cn(
          "fill-tool [transform-box:fill-box] origin-center",
          state === "done" && "animate-pop [animation-delay:880ms]",
          state === "stalled" && "animate-breathe"
        )}
      />
    </svg>
  )
}

function MotifBroken({ width = 160, size = 8, className, ...props }: Omit<MotifProps, "progress" | "state">) {
  const h = size * 3.4
  const y = size * 1.1
  const hx = size / 2
  const gap = width * 0.58
  const fy = h - size * 0.7
  return (
    <svg
      data-slot="motif"
      data-state="error"
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      className={cn("block shrink-0 overflow-visible", className)}
      aria-hidden
      {...props}
    >
      <path
        data-slot="motif-line"
        d={`M1 ${y}H${gap - 7}`}
        pathLength={1}
        fill="none"
        className="animate-draw stroke-foreground stroke-[1.5] [animation-duration:660ms] [stroke-dasharray:1] [stroke-linecap:round]"
      />
      <path
        data-slot="motif-rest"
        d={`M${gap + 9} ${y}H${width * 0.78}`}
        fill="none"
        className="animate-enter stroke-foreground stroke-[1.5] [animation-delay:660ms] [animation-duration:330ms] [stroke-linecap:round] [transform-box:fill-box] origin-left"
      />
      <path
        data-slot="motif-track"
        d={`M${width * 0.78 + 6} ${y}H${width - 1}`}
        fill="none"
          className="stroke-border-strong stroke-1 [stroke-linecap:round]"
      />
      <circle
        data-slot="motif-dot"
        cx={gap + 2}
        cy={fy}
        r={hx}
        style={{ "--fall": `${y - fy}px` } as React.CSSProperties}
        className="animate-fall fill-destructive [animation-delay:660ms] [transform-box:fill-box] origin-center"
      />
    </svg>
  )
}

// Pass `land={false}` for a still dot.
function MotifDot({
  size = 8,
  land = true,
  tone = "tool",
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "width" | "height"> & { size?: number; land?: boolean; tone?: "tool" | "destructive" | "foreground" }) {
  return (
    <svg
      data-slot="motif-dot"
      data-tone={tone}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0 overflow-visible", className)}
      aria-hidden
      {...props}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        className={cn(
          "[transform-box:fill-box] origin-center",
          tone === "tool" && "fill-tool",
          tone === "destructive" && "fill-destructive",
          tone === "foreground" && "fill-foreground",
          land && "animate-pop"
        )}
      />
    </svg>
  )
}

export { Motif, MotifBroken, MotifDot }
export type { MotifProps, MotifState }
