import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { toggleVariants } from "@/components/ui/toggle"

// Base UI has no indicator for toggle groups, so the group measures the pressed item and
// paints the thumb itself. Until the first measurement, and in multiple mode, each pressed
// item paints its own thumb.
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 0.5,
  orientation: "horizontal",
})

type Thumb = { a: number; b: number; lead: "left" | "right" | "top" | "bottom" }

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0.5,
  orientation = "horizontal",
  multiple,
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = React.useState<Thumb | null>(null)
  const live = (variant ?? "default") === "default" && !multiple

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || !live) {
      setThumb(null)
      return
    }
    const horizontal = orientation === "horizontal"
    let last: number | null = null
    const measure = () => {
      const on = root.querySelector<HTMLElement>(":scope > [data-slot=toggle-group-item][data-pressed]")
      if (!on) {
        last = null
        setThumb(null)
        return
      }
      const a = horizontal ? on.offsetLeft : on.offsetTop
      const b = horizontal
        ? root.clientWidth - on.offsetLeft - on.offsetWidth
        : root.clientHeight - on.offsetTop - on.offsetHeight
      const forward = last === null || a >= last
      last = a
      setThumb({ a, b, lead: horizontal ? (forward ? "right" : "left") : forward ? "bottom" : "top" })
    }
    measure()
    const mo = new MutationObserver(measure)
    mo.observe(root, { attributes: true, subtree: true, attributeFilter: ["data-pressed"] })
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [live, orientation])

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant ?? "default"}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      data-live={thumb ? "" : undefined}
      multiple={multiple}
      style={
        {
          "--gap": spacing,
          "--thumb-a": thumb ? `${thumb.a}px` : undefined,
          "--thumb-b": thumb ? `${thumb.b}px` : undefined,
        } as React.CSSProperties
      }
      className={cn(
        "group/toggle-group relative isolate flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-vertical:flex-col data-vertical:items-stretch data-[variant=default]:bg-fill data-[variant=default]:p-0.5 data-[variant=default]:shadow-well",
        className
      )}
      {...props}
    >
      {thumb && (
        <span
          aria-hidden
          data-slot="toggle-group-thumb"
          data-lead={thumb.lead}
          className="pointer-events-none absolute z-0 rounded-[calc(var(--radius-md)-2px)] bg-card shadow-thumb sheen group-data-horizontal/toggle-group:inset-y-0.5 group-data-horizontal/toggle-group:left-(--thumb-a) group-data-horizontal/toggle-group:right-(--thumb-b) group-data-vertical/toggle-group:inset-x-0.5 group-data-vertical/toggle-group:top-(--thumb-a) group-data-vertical/toggle-group:bottom-(--thumb-b) data-[lead=right]:[transition:right_220ms_var(--ease-standard),left_220ms_var(--ease-standard)_77ms] data-[lead=left]:[transition:left_220ms_var(--ease-standard),right_220ms_var(--ease-standard)_77ms] data-[lead=bottom]:[transition:bottom_220ms_var(--ease-standard),top_220ms_var(--ease-standard)_77ms] data-[lead=top]:[transition:top_220ms_var(--ease-standard),bottom_220ms_var(--ease-standard)_77ms]"
        />
      )}
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "relative z-10 shrink-0 focus:z-20 focus-visible:z-20",
        // Segmented tray: thumb radius is the tray's minus its 2px inset.
        "group-data-[variant=default]/toggle-group:rounded-[calc(var(--radius-md)-2px)] group-data-[variant=default]/toggle-group:text-muted-foreground group-data-[variant=default]/toggle-group:hover:bg-transparent group-data-[variant=default]/toggle-group:hover:text-foreground group-data-[variant=default]/toggle-group:focus-visible:ring-offset-0 group-data-[variant=default]/toggle-group:data-pressed:bg-card group-data-[variant=default]/toggle-group:data-pressed:text-foreground group-data-[variant=default]/toggle-group:data-pressed:shadow-thumb group-data-[variant=default]/toggle-group:data-pressed:sheen group-data-[variant=default]/toggle-group:data-pressed:hover:bg-card group-data-[variant=default]/toggle-group:aria-pressed:bg-card group-data-[variant=default]/toggle-group:aria-pressed:text-foreground group-data-[variant=default]/toggle-group:aria-pressed:shadow-thumb group-data-[variant=default]/toggle-group:aria-pressed:sheen group-data-[variant=default]/toggle-group:aria-pressed:hover:bg-card group-data-[variant=default]/toggle-group:data-[size=default]:h-7 group-data-[variant=default]/toggle-group:data-[size=default]:min-w-7 group-data-[variant=default]/toggle-group:data-[size=sm]:h-6 group-data-[variant=default]/toggle-group:data-[size=sm]:min-w-6 group-data-[variant=default]/toggle-group:data-[size=lg]:h-9 group-data-[variant=default]/toggle-group:data-[size=lg]:min-w-9",
        // Live thumb: the group paints the thumb, so the pressed item goes flat.
        "group-data-[variant=default]/toggle-group:group-data-live/toggle-group:data-pressed:bg-transparent group-data-[variant=default]/toggle-group:group-data-live/toggle-group:data-pressed:bg-none group-data-[variant=default]/toggle-group:group-data-live/toggle-group:data-pressed:shadow-none group-data-[variant=default]/toggle-group:group-data-live/toggle-group:data-pressed:hover:bg-transparent",
        // Joined outline: inner corners square, shared hairlines.
        "group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
