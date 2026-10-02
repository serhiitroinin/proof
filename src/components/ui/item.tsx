import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Separator } from "@/components/ui/separator"

const itemGroupVariants = cva("group/item-group flex w-full flex-col", {
  variants: {
    variant: {
      default: "gap-4 has-data-[size=sm]:gap-2 has-data-[size=xs]:gap-1",
      outline:
        "gap-0 overflow-hidden rounded-lg border border-card-border bg-card text-card-foreground *:data-[slot=item]:rounded-none *:data-[slot=item]:border-0",
    },
  },
  defaultVariants: { variant: "default" },
})

// `marker` defaults to on when the group contains a selectable item. Pass `marker={false}` to drop it.
function ItemGroup({
  className,
  variant = "default",
  marker,
  children,
  onPointerOver,
  onPointerLeave,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemGroupVariants> & { marker?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [selectable, setSelectable] = React.useState(false)
  const [hover, setHover] = React.useState<HTMLElement | null>(null)
  const [pos, setPos] = React.useState<{ y: number; h: number; selected: boolean } | null>(null)
  const enabled = marker ?? selectable

  const selectedEl = React.useCallback(
    () =>
      ref.current?.querySelector<HTMLElement>(
        '[data-slot=item][aria-selected="true"], [data-slot=item][data-state="selected"]'
      ) ?? null,
    []
  )

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      const sel = selectedEl()
      setSelectable(!!root.querySelector("[data-slot=item][aria-selected], [data-slot=item][data-state]"))
      const target = hover ?? sel
      if (!target) return setPos(null)
      const r = target.getBoundingClientRect()
      const b = root.getBoundingClientRect()
      setPos({ y: r.top - b.top + root.scrollTop + r.height * 0.22, h: r.height * 0.56, selected: target === sel })
    }
    measure()
    const mo = new MutationObserver(measure)
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ["aria-selected", "data-state"], childList: true })
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [hover, children, selectedEl])

  return (
    <div
      ref={ref}
      role="list"
      data-slot="item-group"
      data-variant={variant}
      className={cn(itemGroupVariants({ variant }), enabled && "relative", className)}
      onPointerOver={(e) => {
        onPointerOver?.(e)
        if (!enabled) return
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-slot=item]")
        if (el && ref.current?.contains(el)) setHover(el)
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setHover(null)
      }}
      {...props}
    >
      {children}
      {enabled && pos && (
        <span
          aria-hidden
          data-slot="item-group-marker"
          data-ghost={!pos.selected || undefined}
          style={{ "--marker-y": `${pos.y}px`, "--marker-h": `${pos.h}px` } as React.CSSProperties}
          className="pointer-events-none absolute top-0 left-0 z-10 h-(--marker-h) w-0.5 translate-y-(--marker-y) rounded-full bg-tool transition-[transform,height,background-color] duration-[264ms] ease-standard data-ghost:bg-border-heavy"
        />
      )}
    </div>
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [a]:transition-colors [a]:hover:bg-fill [a]:active:bg-fill-active aria-selected:bg-tool-subtle aria-selected:text-tool-text aria-selected:hover:bg-tool-subtle data-[state=selected]:bg-tool-subtle data-[state=selected]:text-tool-text data-[state=selected]:hover:bg-tool-subtle",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline:
          "border-card-border bg-card text-card-foreground aria-selected:border-tool-border data-[state=selected]:border-tool-border",
        muted: "border-transparent bg-muted",
      },
      size: {
        default: "gap-3 px-4 py-3",
        sm: "gap-3 px-3 py-2",
        xs: "gap-2 px-2 py-1 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 text-muted-foreground group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 rounded-md bg-fill text-muted-foreground group-data-[size=sm]/item:size-6 group-data-[size=xs]/item:size-5 group-data-[size=xs]/item:bg-transparent [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=sm]/item:text-xs group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
