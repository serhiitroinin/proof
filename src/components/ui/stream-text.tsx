import * as React from "react"
import { cn } from "cn"

// Each word rises a beat after the one before. Change `key` to replay.

type StreamTextProps = Omit<React.ComponentProps<"p">, "children"> & {
  children: string
  /** Delay between words in ms. */
  step?: number
}

function StreamText({ children, step = 28, className, ...props }: StreamTextProps) {
  const words = children.split(/\s+/).filter(Boolean)
  return (
    <p data-slot="stream-text" style={{ "--step": `${step}ms` } as React.CSSProperties} className={cn("text-sm leading-6", className)} {...props}>
      {words.map((w, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties} className="inline-block animate-rise [animation-delay:calc(var(--i)*var(--step))]">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  )
}

export { StreamText }
export type { StreamTextProps }
