"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Trigger variant styles are scoped to the direct parent list ([[data-variant=x]>&]), so
// nested tabs do not inherit the outer list's variant or orientation.
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-4 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "relative isolate inline-flex w-fit items-center justify-center text-muted-foreground data-vertical:flex-col data-vertical:items-stretch",
  {
    variants: {
      variant: {
        default:
          "gap-0.5 rounded-md bg-fill p-0.5 shadow-well data-horizontal:h-8 data-vertical:h-fit",
        line: "gap-4 bg-transparent data-horizontal:h-9 data-horizontal:border-b data-vertical:gap-1 data-vertical:border-r",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsIndicatorVariants = cva(
  // Base UI writes --active-tab-* relative to the list's padding box. The two edges are
  // transitioned separately so they can move at different times.
  "pointer-events-none absolute z-0 data-[orientation=horizontal]:left-(--active-tab-left) data-[orientation=horizontal]:right-(--active-tab-right) data-[orientation=vertical]:top-(--active-tab-top) data-[orientation=vertical]:bottom-(--active-tab-bottom) data-[activation-direction=right]:[transition:right_242ms_var(--ease-standard),left_330ms_var(--ease-standard)_77ms] data-[activation-direction=left]:[transition:left_242ms_var(--ease-standard),right_330ms_var(--ease-standard)_77ms] data-[activation-direction=down]:[transition:bottom_242ms_var(--ease-standard),top_330ms_var(--ease-standard)_77ms] data-[activation-direction=up]:[transition:top_242ms_var(--ease-standard),bottom_330ms_var(--ease-standard)_77ms] data-instant:transition-none!",
  {
    variants: {
      variant: {
        // Segmented: the thumb is 2px inside the tray, so its radius is the tray's minus 2px.
        default:
          "rounded-[calc(var(--radius-md)-2px)] bg-card shadow-thumb sheen data-[orientation=horizontal]:inset-y-0.5 data-[orientation=vertical]:inset-x-0.5",
        // Line: the bar overlaps the list's rule by one pixel so the two read as one line.
        line: "rounded-full bg-primary data-[orientation=horizontal]:-bottom-px data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:-right-px data-[orientation=vertical]:w-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  activateOnFocus = true,
  onKeyDownCapture,
  onPointerDownCapture,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  // Arrow keys activate on focus (Base UI defaults to false) and the indicator jumps; a
  // pointer brings the motion back.
  const [instant, setInstant] = React.useState(false)
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      activateOnFocus={activateOnFocus}
      className={cn(tabsListVariants({ variant }), className)}
      onKeyDownCapture={(e) => {
        onKeyDownCapture?.(e)
        if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") setInstant(true)
      }}
      onPointerDownCapture={(e) => {
        onPointerDownCapture?.(e)
        setInstant(false)
      }}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        data-instant={instant || undefined}
        className={tabsIndicatorVariants({ variant })}
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex h-8 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] outline-none data-horizontal:flex-1 data-vertical:w-full data-vertical:justify-start hover:text-foreground focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-faint aria-disabled:pointer-events-none aria-disabled:text-faint data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5 hover:[&_svg]:text-foreground data-active:[&_svg]:text-foreground",
        "[[data-variant=default]>&]:h-7 [[data-variant=default]>&]:rounded-[calc(var(--radius-md)-2px)] [[data-variant=default]>&]:px-3 [[data-variant=default]>&]:focus-visible:ring-inset",
        "[[data-variant=line]>&]:rounded-sm [[data-variant=line]>&]:px-1 [[data-variant=line]>&]:data-horizontal:h-9 [[data-variant=line]>&]:data-vertical:px-2",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
