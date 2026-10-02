import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"


const windowVariants = cva(
  "group/window relative flex w-full flex-col overflow-hidden rounded-xl border border-card-border bg-card text-sm text-card-foreground shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "",
        terminal: "font-mono text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Window({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof windowVariants>) {
  return <div data-slot="window" data-variant={variant} className={cn(windowVariants({ variant }), className)} {...props} />
}

function WindowBar({ className, children, lights = true, ...props }: React.ComponentProps<"div"> & { lights?: boolean }) {
  return (
    <div
      data-slot="window-bar"
      className={cn(
        "flex h-11 shrink-0 items-center gap-3 border-b border-border bg-muted px-3 group-data-[variant=terminal]/window:bg-card",
        className
      )}
      {...props}
    >
      {lights && <WindowLights />}
      {children}
    </div>
  )
}

function WindowLights({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="window-lights" aria-hidden className={cn("flex shrink-0 items-center gap-2", className)} {...props}>
      <span className="size-3 rounded-full border border-destructive/40 bg-destructive" />
      <span className="size-3 rounded-full border border-warning/40 bg-warning" />
      <span className="size-3 rounded-full border border-success/40 bg-success" />
    </div>
  )
}

function WindowTitle({ className, center = false, ...props }: React.ComponentProps<"div"> & { center?: boolean }) {
  return (
    <div
      data-slot="window-title"
      data-center={center || undefined}
      className={cn(
        "flex min-w-0 items-center gap-2 truncate text-sm font-medium text-foreground data-center:absolute data-center:inset-x-0 data-center:justify-center data-center:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function WindowToolbar({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "center" | "end" }) {
  return (
    <div
      data-slot="window-toolbar"
      data-align={align}
      className={cn("flex min-w-0 items-center gap-2 data-[align=end]:ml-auto data-[align=center]:mx-auto", className)}
      {...props}
    />
  )
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-body"
      className={cn("flex min-h-0 flex-1 bg-background group-data-[variant=terminal]/window:bg-popover", className)}
      {...props}
    />
  )
}

function WindowSidebar({
  className,
  side = "left",
  width = "default",
  ...props
}: React.ComponentProps<"aside"> & { side?: "left" | "right"; width?: "default" | "narrow" | "wide" }) {
  return (
    <aside
      data-slot="window-sidebar"
      data-side={side}
      data-width={width}
      className={cn(
        "flex min-h-0 shrink-0 flex-col gap-1 overflow-y-auto border-sidebar-border bg-sidebar p-2 text-sidebar-foreground data-[side=left]:order-first data-[side=left]:border-r data-[side=right]:order-last data-[side=right]:border-l data-[width=default]:w-56 data-[width=narrow]:w-44 data-[width=wide]:w-64",
        className
      )}
      {...props}
    />
  )
}

function WindowMain({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="window-main" className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)} {...props} />
  )
}

function WindowHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-header"
      className={cn("flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4", className)}
      {...props}
    />
  )
}

// Position children absolutely inside the canvas.
function WindowCanvas({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-canvas"
      className={cn(
        "relative min-h-0 flex-1 overflow-hidden bg-background bg-[radial-gradient(circle,var(--border-heavy)_1px,transparent_1.5px)] bg-[length:16px_16px] bg-center",
        className
      )}
      {...props}
    />
  )
}

function WindowFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-footer"
      className={cn("flex h-12 shrink-0 items-center gap-3 border-t border-border bg-card px-4", className)}
      {...props}
    />
  )
}

export { Window, WindowBar, WindowLights, WindowTitle, WindowToolbar, WindowBody, WindowSidebar, WindowMain, WindowHeader, WindowCanvas, WindowFooter }
