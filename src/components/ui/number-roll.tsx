import * as React from "react"
import { cn } from "cn"

// Digits are keyed from the right, so only the places that changed move.

type NumberRollProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number | string
  /** `figure` is the 36px display figure; `inline` inherits the surrounding text. */
  variant?: "inline" | "figure"
  /** Formatter for numeric values. Defaults to en-US grouping. */
  format?: (n: number) => string
}

const SHIFT = [
  "translate-y-0",
  "-translate-y-[10%]",
  "-translate-y-[20%]",
  "-translate-y-[30%]",
  "-translate-y-[40%]",
  "-translate-y-[50%]",
  "-translate-y-[60%]",
  "-translate-y-[70%]",
  "-translate-y-[80%]",
  "-translate-y-[90%]",
] as const

const DIGITS = Array.from({ length: 10 }, (_, i) => i)

function NumberRoll({ value, variant = "inline", format = (n) => n.toLocaleString("en-US"), className, ...props }: NumberRollProps) {
  const text = typeof value === "number" ? format(value) : value
  const chars = Array.from(text)
  // Position from the right among digits only, so "1,204" -> "1,248" rolls two places.
  let place = 0
  const cells = chars
    .slice()
    .reverse()
    .map((ch, i) => {
      const digit = /\d/.test(ch) ? Number(ch) : null
      const key = digit !== null ? `d${place}` : `c${i}`
      const pos = digit !== null ? place++ : 0
      return { ch, digit, key, pos }
    })
    .reverse()
  return (
    <span
      data-slot="number-roll"
      data-variant={variant}
      role="text"
      aria-label={text}
      className={cn(
        "inline-flex h-[1em] items-stretch leading-none tabular-nums",
        variant === "figure" && "text-4xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {cells.map((c) =>
        c.digit === null ? (
          <span key={c.key} aria-hidden className="block h-[1em] leading-none">
            {c.ch}
          </span>
        ) : (
          <span key={c.key} aria-hidden className="block h-[1em] overflow-hidden leading-none">
            <span
              data-slot="number-roll-strip"
              style={{ "--place": c.pos } as React.CSSProperties}
              className={cn(
                "flex flex-col transition-transform duration-[440ms] ease-standard [transition-delay:calc(var(--place)*33ms)]",
                SHIFT[c.digit]
              )}
            >
              {DIGITS.map((d) => (
                <span key={d} className="block h-[1em] leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      )}
    </span>
  )
}

export { NumberRoll }
export type { NumberRollProps }
