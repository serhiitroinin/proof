import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// `color="off"` is NO_COLOR: every tone drops to the foreground; bold, dim and inverse stay.

function Terminal({
  className,
  color = "on",
  ...props
}: React.ComponentProps<"pre"> & { color?: "on" | "off" }) {
  return (
    <pre
      data-slot="terminal"
      data-color={color}
      className={cn(
        "group/term m-0 w-full overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6 whitespace-pre text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TerminalLine({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="terminal-line" className={cn("min-h-6", className)} {...props} />
}

function TerminalPrompt({ className, children, glyph = "❯", ...props }: React.ComponentProps<"span"> & { glyph?: string }) {
  return (
    <span data-slot="terminal-prompt" className={cn("inline", className)} {...props}>
      <TerminalText tone="accent">{glyph}</TerminalText> {children}
    </span>
  )
}

const terminalTextVariants = cva("", {
  variants: {
    tone: {
      default: "",
      bold: "font-semibold",
      muted: "text-muted-foreground",
      faint: "text-faint",
      accent: "text-tool group-data-[color=off]/term:text-foreground",
      ok: "text-success group-data-[color=off]/term:text-foreground",
      warn: "text-warning group-data-[color=off]/term:text-foreground",
      error: "text-destructive group-data-[color=off]/term:text-foreground",
      inverse: "bg-foreground text-background group-data-[color=off]/term:bg-foreground",
    },
  },
  defaultVariants: { tone: "default" },
})

function TerminalText({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof terminalTextVariants>) {
  return <span data-slot="terminal-text" data-tone={tone} className={cn(terminalTextVariants({ tone }), className)} {...props} />
}

const BRAILLE = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]

function TerminalSpinner({ className, ...props }: React.ComponentProps<"span">) {
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % BRAILLE.length), 80)
    return () => clearInterval(t)
  }, [])
  return (
    <span data-slot="terminal-spinner" role="status" aria-label="Working" className={cn("inline-block w-[1ch]", className)} {...props}>
      <TerminalText tone="accent">{BRAILLE[i]}</TerminalText>
    </span>
  )
}

function TerminalCaret({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="terminal-caret"
      aria-hidden
      className={cn("inline-block h-[1.1em] w-[0.6ch] translate-y-[0.2em] bg-foreground animate-[breathe_1056ms_steps(2,end)_infinite]", className)}
      {...props}
    />
  )
}

function TerminalBar({
  value,
  width = 24,
  tone = "accent",
  className,
  ...props
}: React.ComponentProps<"span"> & { value: number; width?: number; tone?: "accent" | "ok" | "warn" | "error" | "default" }) {
  const n = Math.round(Math.max(0, Math.min(1, value)) * width)
  return (
    <span data-slot="terminal-bar" className={cn("inline", className)} {...props}>
      <TerminalText tone={tone}>{"█".repeat(n)}</TerminalText>
      <TerminalText tone="faint">{"░".repeat(width - n)}</TerminalText>
    </span>
  )
}

function TerminalRule({
  value = 1,
  width = 28,
  state = "running",
  className,
  ...props
}: React.ComponentProps<"span"> & { value?: number; width?: number; state?: "running" | "done" | "error" }) {
  const p = Math.max(0, Math.min(1, value))
  const at = Math.round(p * width)
  if (state === "error") {
    const gap = Math.round(width * 0.58)
    return (
      <span data-slot="terminal-rule" data-state="error" className={cn("inline", className)} {...props}>
        <TerminalText tone="default">{"━".repeat(gap)}</TerminalText>
        <TerminalText tone="error">{" ✕ "}</TerminalText>
        <TerminalText tone="faint">{"─".repeat(Math.max(0, width - gap - 3))}</TerminalText>
      </span>
    )
  }
  return (
    <span data-slot="terminal-rule" data-state={state} className={cn("inline", className)} {...props}>
      <TerminalText tone="default">{"━".repeat(at)}</TerminalText>
      <TerminalText tone="accent">●</TerminalText>
      <TerminalText tone="faint">{"─".repeat(Math.max(0, width - at))}</TerminalText>
    </span>
  )
}

export { Terminal, TerminalLine, TerminalPrompt, TerminalText, TerminalSpinner, TerminalCaret, TerminalBar, TerminalRule, terminalTextVariants }
