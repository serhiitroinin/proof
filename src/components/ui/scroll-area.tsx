import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "cn"

// The root carries data-edge="true" once the viewport has scrolled. Sticky headers draw
// their bottom rule only then.
const EDGE =
  "[&_[data-slot=scroll-area-header]]:sticky [&_[data-slot=scroll-area-header]]:top-0 [&_[data-slot=scroll-area-header]]:z-10 [&_[data-slot=scroll-area-header]]:border-b [&_[data-slot=scroll-area-header]]:border-transparent [&_[data-slot=scroll-area-header]]:transition-colors data-[edge=true]:[&_[data-slot=scroll-area-header]]:border-border-strong " +
  "[&_[data-slot=table-header]_th]:sticky [&_[data-slot=table-header]_th]:top-0 [&_[data-slot=table-header]_th]:z-10 [&_[data-slot=table-header]_th]:bg-muted [&_[data-slot=table-header]_th]:shadow-[0_1px_0_0_transparent] [&_[data-slot=table-header]_th]:transition-shadow data-[edge=true]:[&_[data-slot=table-header]_th]:shadow-[0_1px_0_0_var(--border-strong)]"

function ScrollArea({
  className,
  children,
  variant = "default",
  onScroll,
  ...props
}: ScrollAreaPrimitive.Root.Props & { variant?: "default" | "outline"; onScroll?: React.UIEventHandler<HTMLDivElement> }) {
  const [edge, setEdge] = React.useState(false)
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      data-variant={variant}
      data-edge={edge}
      className={cn(
        "relative",
        variant === "outline" && "rounded-lg border border-card-border bg-card text-card-foreground",
        EDGE,
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        onScroll={(e) => {
          onScroll?.(e)
          setEdge(e.currentTarget.scrollTop > 0)
        }}
        className="size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-0.5 transition-opacity select-none data-horizontal:h-2 data-horizontal:flex-col data-vertical:h-full data-vertical:w-2",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border-heavy transition-colors hover:bg-border-control"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

// A sticky header. Its bottom rule appears once content is under it.
function ScrollAreaHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-area-header"
      className={cn("flex h-8 items-center bg-card px-3 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

export { ScrollArea, ScrollAreaHeader, ScrollBar }
