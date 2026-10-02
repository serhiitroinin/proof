import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { NumberRoll } from "@/components/ui/number-roll"


function Figure({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="figure" className={cn("group/figure flex min-w-0 flex-col gap-2", className)} {...props} />
}

const figureValueVariants = cva(
  "inline-flex items-baseline gap-[0.18em] font-heading leading-none font-semibold tracking-tight tabular-nums text-foreground",
  {
    variants: {
      size: {
        sm: "text-2xl",
        default: "text-4xl",
        lg: "text-5xl",
      },
      units: {
        plain: "",
        accent: "[&_[data-slot=figure-unit]]:font-mono [&_[data-slot=figure-unit]]:tracking-wide [&_[data-slot=figure-unit]]:text-tool-text",
        mono: "font-mono font-medium tracking-tighter [&_[data-slot=figure-unit]]:font-mono [&_[data-slot=figure-unit]]:text-faint",
      },
    },
    defaultVariants: { size: "default", units: "plain" },
  }
)

function FigureValue({
  className,
  size = "default",
  units = "plain",
  value,
  format,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof figureValueVariants> & {
    /** A number rolls like an odometer when it changes; a string is set as is. */
    value?: number | string
    format?: (n: number) => string
    children?: React.ReactNode
  }) {
  return (
    <span data-slot="figure-value" className={cn(figureValueVariants({ size, units }), className)} {...props}>
      {value !== undefined && (typeof value === "number" ? <NumberRoll value={value} format={format} /> : <span>{value}</span>)}
      {children}
    </span>
  )
}

function FigureUnit({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="figure-unit"
      className={cn("text-[0.36em] font-medium tracking-normal text-muted-foreground", className)}
      {...props}
    />
  )
}

function FigureCaption({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="figure-caption" className={cn("text-xs font-medium tracking-wide text-muted-foreground", className)} {...props} />
  )
}

const figureStatusVariants = cva(
  "flex items-center gap-1.5 text-xs leading-4 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_[data-slot=motif-dot]]:mx-0.5",
  {
    variants: {
      tone: {
        default: "text-muted-foreground",
        foreground: "text-foreground",
        tool: "text-tool-text",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }
)

function FigureStatus({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof figureStatusVariants>) {
  return <div data-slot="figure-status" data-tone={tone} className={cn(figureStatusVariants({ tone }), className)} {...props} />
}

function FigureSparkline({
  data: values,
  width = 64,
  height = 24,
  tone = "faint",
  dot = false,
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "width" | "height"> & {
  data: number[]
  width?: number
  height?: number
  tone?: "faint" | "foreground" | "tool"
  dot?: boolean
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pt = (v: number, i: number) =>
    [(i / Math.max(1, values.length - 1)) * (width - 4) + 2, height - 2 - ((v - min) / (max - min || 1)) * (height - 4)] as const
  const pts = values.map(pt)
  const last = pts[pts.length - 1]
  return (
    <svg
      data-slot="figure-sparkline"
      data-tone={tone}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className={cn("block shrink-0 overflow-visible self-end", className)}
      {...props}
    >
      <polyline
        points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-faint in-data-[tone=foreground]:stroke-foreground in-data-[tone=tool]:stroke-tool"
      />
      {dot && last && <circle cx={last[0]} cy={last[1]} r={2.5} className="fill-tool" />}
    </svg>
  )
}

export { Figure, FigureValue, FigureUnit, FigureCaption, FigureStatus, FigureSparkline }
