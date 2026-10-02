import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Compact inspector fields. Wrap them in <Field> for a full label and help text.

const numberFieldVariants = cva(
  "group/number-field flex min-w-0 items-center gap-1.5 rounded-md border border-border-strong bg-card px-2 font-mono text-xs tabular-nums shadow-well transition-[color,background-color,border-color,box-shadow] hover:border-border-heavy has-disabled:border-border has-disabled:bg-muted has-disabled:text-faint has-disabled:shadow-none has-focus-visible:border-ring has-focus-visible:shadow-none has-focus-visible:ring-1 has-focus-visible:ring-ring has-aria-invalid:border-destructive",
  {
    variants: {
      size: {
        sm: "h-6",
        default: "h-7",
        lg: "h-8 text-sm",
      },
    },
    defaultVariants: { size: "default" },
  }
)

type NumberFieldProps = Omit<React.ComponentProps<"input">, "size" | "value" | "onChange"> &
  VariantProps<typeof numberFieldVariants> & {
    /** The leading label: X, Y, W, H, gap… */
    label?: React.ReactNode
    /** Trailing unit: px, %, °. */
    unit?: React.ReactNode
    value: number
    onChange?: (value: number) => void
    step?: number
    min?: number
    max?: number
  }

function NumberField({ className, size, label, unit, value, onChange, step = 1, min, max, disabled, id, ...props }: NumberFieldProps) {
  const [text, setText] = React.useState<string | null>(null)
  const clamp = (v: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, v))
  const commit = (raw: string) => {
    const v = parseFloat(raw)
    if (!Number.isNaN(v)) onChange?.(clamp(v))
    setText(null)
  }
  return (
    <label data-slot="number-field" data-size={size ?? "default"} className={cn(numberFieldVariants({ size }), className)}>
      {label !== undefined && (
        <span data-slot="number-field-label" className="min-w-3 shrink-0 text-center text-faint select-none group-has-focus-visible/number-field:text-muted-foreground">
          {label}
        </span>
      )}
      <input
        id={id}
        data-slot="number-field-input"
        type="text"
        inputMode="decimal"
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-faint disabled:cursor-not-allowed"
        value={text ?? String(value)}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(e.currentTarget.value)
          else if (e.key === "Escape") setText(null)
          else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            const d = (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? step * 10 : step)
            const base = text !== null && !Number.isNaN(parseFloat(text)) ? parseFloat(text) : value
            onChange?.(clamp(base + d))
            setText(null)
          }
        }}
        {...props}
      />
      {unit !== undefined && (
        <span data-slot="number-field-unit" className="shrink-0 text-faint select-none">
          {unit}
        </span>
      )}
    </label>
  )
}

type HexFieldProps = Omit<React.ComponentProps<"input">, "size" | "value" | "onChange"> &
  VariantProps<typeof numberFieldVariants> & {
    /** Six hex digits without the hash. */
    value: string
    onChange?: (hex: string) => void
    /** 0..100. Shown as the trailing unit. */
    alpha?: number
  }

function HexField({ className, size, value, onChange, alpha, disabled, ...props }: HexFieldProps) {
  const hex = `#${value.padEnd(6, "0").slice(0, 6)}`
  return (
    <label data-slot="hex-field" data-size={size ?? "default"} className={cn(numberFieldVariants({ size }), "uppercase", className)}>
      <span
        data-slot="hex-field-swatch"
        aria-hidden
        className="size-3.5 shrink-0 rounded-xs border border-border-strong bg-(--swatch) opacity-(--swatch-alpha)"
        style={{ "--swatch": hex, "--swatch-alpha": alpha === undefined ? 1 : alpha / 100 } as React.CSSProperties}
      />
      <input
        data-slot="hex-field-input"
        type="text"
        spellCheck={false}
        maxLength={6}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-faint disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange?.(e.target.value.replace(/[^0-9a-f]/gi, "").toUpperCase())}
        {...props}
      />
      {alpha !== undefined && (
        <span data-slot="hex-field-alpha" className="shrink-0 text-faint select-none">
          {alpha}%
        </span>
      )}
    </label>
  )
}

export { NumberField, HexField, numberFieldVariants }
export type { NumberFieldProps, HexFieldProps }
