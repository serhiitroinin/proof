"use client"

import * as React from "react"
import { cn } from "cn"

import { Kbd, KbdGroup } from "@/components/ui/kbd"

// Browsers without `field-sizing: content` (Firefox) grow the control from scrollHeight.
const fieldSizing = typeof CSS !== "undefined" && CSS.supports("field-sizing", "content")

type TextareaControlProps = React.ComponentProps<"textarea"> & {
  /** Height in lines before any text. Defaults to `rows`, then 3. */
  minRows?: number
  /** Height in lines before the control scrolls. */
  maxRows?: number
}

/** The bare control: grows with its text, no frame. Use inside a frame such as InputGroup. */
function TextareaControl({ minRows, maxRows = 12, rows, className, style, onInput, ref, ...props }: TextareaControlProps) {
  const inner = React.useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => inner.current as HTMLTextAreaElement)

  const fit = React.useCallback(() => {
    const el = inner.current
    if (fieldSizing || !el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])
  React.useLayoutEffect(fit, [fit, props.value])

  return (
    <textarea
      ref={inner}
      data-slot="textarea-control"
      rows={1}
      style={{ "--min-rows": minRows ?? rows ?? 3, "--max-rows": maxRows, ...style } as React.CSSProperties}
      onInput={(e) => {
        fit()
        onInput?.(e)
      }}
      className={cn(
        "field-sizing-content min-h-[calc(var(--min-rows)*1.25rem+1rem)] max-h-[calc(var(--max-rows)*1.25rem+1rem)] w-full min-w-0 resize-none overflow-y-auto bg-transparent px-3 py-2 text-sm text-foreground caret-tool outline-none [scrollbar-width:thin] selection:bg-selection placeholder:text-faint disabled:cursor-not-allowed disabled:text-faint read-only:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type TextareaProps = TextareaControlProps & {
  /** Soft character limit. Shows the count; past it the field turns invalid and the line breaks. */
  limit?: number
  /** Called on ⌘↵ or Ctrl+↵. Shows the shortcut in the footer. */
  onCommit?: (value: string) => void
  /** Extra footer content, before the count. */
  footer?: React.ReactNode
}

/**
 * A framed, growing textarea. `className` styles the frame; every other prop goes to the
 * control, so `id`, `aria-*` and form props work as on a native textarea.
 */
function Textarea({ className, limit, onCommit, footer, onChange, onKeyDown, ...props }: TextareaProps) {
  const [typed, setTyped] = React.useState(() => String(props.defaultValue ?? "").length)
  const length = props.value !== undefined ? String(props.value).length : typed
  const countId = React.useId()

  const over = limit !== undefined && length > limit
  const invalid = over || (props["aria-invalid"] !== undefined && props["aria-invalid"] !== false && props["aria-invalid"] !== "false")
  const hasFooter = limit !== undefined || onCommit !== undefined || footer !== undefined

  return (
    <div
      data-slot="textarea"
      data-invalid={invalid || undefined}
      data-disabled={props.disabled || undefined}
      data-readonly={props.readOnly || undefined}
      className={cn(
        "group/textarea flex w-full min-w-0 cursor-text flex-col rounded-md border border-border-strong bg-card shadow-well transition-[background-color,border-color,box-shadow] hover:border-border-heavy has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:shadow-none has-[textarea:focus-visible]:ring-1 has-[textarea:focus-visible]:ring-ring data-readonly:border-dashed data-readonly:bg-muted data-readonly:shadow-none data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:border-solid data-disabled:bg-muted data-disabled:shadow-none data-invalid:border-destructive data-invalid:hover:border-destructive data-invalid:has-[textarea:focus-visible]:border-destructive data-invalid:has-[textarea:focus-visible]:ring-destructive",
        className
      )}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          e.currentTarget.querySelector("textarea")?.focus()
        }
      }}
    >
      <TextareaControl
        aria-describedby={limit !== undefined ? cn(props["aria-describedby"], countId) : props["aria-describedby"]}
        {...props}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          setTyped(e.target.value.length)
          onChange?.(e)
        }}
        onKeyDown={(e) => {
          if (onCommit && e.key === "Enter" && (e.metaKey || e.ctrlKey) && !props.disabled && !props.readOnly) {
            e.preventDefault()
            onCommit(e.currentTarget.value)
          }
          onKeyDown?.(e)
        }}
      />
      {hasFooter && (
        <div
          data-slot="textarea-footer"
          className="flex min-h-8 items-center gap-2 px-3 pb-2 group-data-disabled/textarea:opacity-50"
        >
          {footer}
          <span className="flex-1" />
          {onCommit && (
            <KbdGroup className="opacity-0 transition-opacity group-has-[textarea:focus-visible]/textarea:opacity-100">
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
            </KbdGroup>
          )}
          {limit !== undefined && <TextareaCount id={countId} length={length} limit={limit} />}
        </div>
      )}
    </div>
  )
}

// The motif as a meter: the dot rides toward the limit. Past it the line breaks and the dot drops.
function TextareaCount({ id, length, limit }: { id: string; length: number; limit: number }) {
  const left = limit - length
  const near = left >= 0 && left <= Math.max(10, Math.round(limit * 0.1))
  return (
    <div data-slot="textarea-count" className="flex items-center gap-2">
      <TextareaMeter progress={length / limit} over={left < 0} />
      <span
        aria-hidden
        data-near={near || undefined}
        data-over={left < 0 || undefined}
        className="min-w-8 text-right font-mono text-xs text-faint tabular-nums data-near:text-warning data-over:text-destructive"
      >
        {left < 0 ? left : `${length}/${limit}`}
      </span>
      <span id={id} aria-live="polite" className="sr-only">
        {left < 0 ? `${-left} characters over the limit` : near ? `${left} characters left` : `Limit ${limit} characters`}
      </span>
    </div>
  )
}

function TextareaMeter({ progress, over }: { progress: number; over: boolean }) {
  const w = 48
  const y = 7
  const r = 3
  const x = r + 1 + Math.min(1, progress) * (w - 2 * r - 2)
  if (over)
    return (
      <svg data-slot="textarea-meter" data-over="" width={w} height={14} viewBox={`0 0 ${w} 14`} className="shrink-0 overflow-visible" aria-hidden>
        <path d={`M1 ${y}H${w - 12}`} className="stroke-destructive stroke-[1.5] [stroke-linecap:round]" />
        <circle
          cx={w - r - 1}
          cy={y + 5}
          r={r}
          style={{ "--fall": "-5px" } as React.CSSProperties}
          className="animate-fall fill-destructive [transform-box:fill-box] origin-center"
        />
      </svg>
    )
  return (
    <svg data-slot="textarea-meter" width={w} height={14} viewBox={`0 0 ${w} 14`} className="shrink-0 overflow-visible" aria-hidden>
      {x < w - r - 4 && <path d={`M${x + r + 3} ${y}H${w - 1}`} className="stroke-border-strong stroke-1 [stroke-linecap:round]" />}
      <path d={`M1 ${y}H${x}`} className="stroke-foreground stroke-[1.5] [stroke-linecap:round] transition-[d] duration-200 ease-standard" />
      <circle cx={x} cy={y} r={r} className="fill-tool transition-[cx] duration-200 ease-standard" />
    </svg>
  )
}

export { Textarea, TextareaControl }
export type { TextareaProps, TextareaControlProps }
