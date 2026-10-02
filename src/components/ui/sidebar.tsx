"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// ⌘B / Ctrl+B toggles. Under 768px the sidebar is a sheet.

const SIDEBAR_WIDTH = "15rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const MOBILE_QUERY = "(max-width: 767px)"

function useIsMobile() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOBILE_QUERY)
      mq.addEventListener("change", cb)
      return () => mq.removeEventListener("change", cb)
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value
      if (setOpenProp) setOpenProp(next)
      else _setOpen(next)
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(
    () => (isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o)),
    [isMobile, setOpen]
  )

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// Arrow keys move focus between menu buttons; Home and End jump.
function onMenuKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return
  const root = event.currentTarget
  const items = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-slot=sidebar-menu-button]:not([disabled]), [data-slot=sidebar-menu-sub-button]:not([disabled])"
    )
  )
  const i = items.indexOf(document.activeElement as HTMLElement)
  if (i < 0) return
  event.preventDefault()
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length
  items[next]?.focus()
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        data-side={side}
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col border-sidebar-border bg-sidebar text-sidebar-foreground data-[side=left]:border-r data-[side=right]:border-l",
          className
        )}
        onKeyDown={onMenuKeyDown}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          side={side}
          showCloseButton={false}
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground"
          style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col" onKeyDown={onMenuKeyDown}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-container"
        className={cn(
          "relative flex h-full w-(--sidebar-width) flex-col transition-[width] duration-[220ms] ease-standard",
          "group-data-[collapsible=offcanvas]:w-0",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l group-data-[side=left]:group-data-[collapsible=offcanvas]:border-r-0 group-data-[side=right]:group-data-[collapsible=offcanvas]:border-l-0 border-sidebar-border",
          className
        )}
        onKeyDown={onMenuKeyDown}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            "flex h-full w-full flex-col overflow-hidden bg-sidebar",
            variant === "floating" && "rounded-lg border border-sidebar-border shadow-sm",
            variant === "inset" && "rounded-lg"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-colors ease-standard group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-sidebar-border",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-0 w-full min-w-0 flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-card-border md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input data-slot="sidebar-input" data-sidebar="input" className={cn("h-8 w-full bg-card", className)} {...props} />
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("mt-auto flex flex-col gap-2 border-t border-sidebar-border p-2 text-xs text-faint", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" data-sidebar="separator" className={cn("mx-2 w-auto bg-sidebar-border", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" data-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col px-2 py-1", className)} {...props} />
}

function SidebarGroupLabel({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "flex h-7 shrink-0 items-center px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground outline-none transition-[height,margin,padding,opacity] duration-[220ms] ease-standard select-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:my-1.5 group-data-[collapsible=icon]:h-px group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:bg-sidebar-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:text-transparent",
        className
      ),
      ...props,
    },
  })
}

function SidebarGroupAction({ className, render, ...props }: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    render,
    props: {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      className: cn(
        "absolute top-2.5 right-3 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-faint outline-none transition-colors hover:bg-fill hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props,
    },
  })
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
}

const MENU_BUTTONS = "[data-slot=sidebar-menu-button], [data-slot=sidebar-menu-sub-button]"

type MarkerPos = { y: number; h: number; ghost: boolean }

// The menu measures the hovered or active button and moves the marker there.
function SidebarMenu({ className, marker = true, onPointerOver, onPointerLeave, children, ...props }: React.ComponentProps<"ul"> & { marker?: boolean }) {
  const ref = React.useRef<HTMLUListElement>(null)
  const [pos, setPos] = React.useState<MarkerPos | null>(null)

  const measure = React.useCallback((el: HTMLElement | null, ghost: boolean) => {
    const list = ref.current
    if (!el || !list) {
      setPos((p) => (p === null ? p : null))
      return
    }
    const top = el.getBoundingClientRect().top - list.getBoundingClientRect().top
    const h = el.offsetHeight
    const next = { y: Math.round(top + h * 0.22), h: Math.round(h * 0.56), ghost }
    setPos((p) => (p && p.y === next.y && p.h === next.h && p.ghost === next.ghost ? p : next))
  }, [])

  // The hovered button, so re-renders (including the one setPos causes) keep the ghost in place.
  const hovered = React.useRef<HTMLElement | null>(null)
  const sync = React.useCallback(() => {
    const list = ref.current
    const el = hovered.current && list?.contains(hovered.current) ? hovered.current : null
    if (el) measure(el, el.dataset.active !== "true")
    else measure(list?.querySelector<HTMLElement>("[data-slot=sidebar-menu-button][data-active=true], [data-slot=sidebar-menu-sub-button][data-active=true]") ?? null, false)
  }, [measure])

  React.useLayoutEffect(() => {
    if (marker) sync()
  })

  return (
    <ul
      ref={ref}
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("relative flex w-full min-w-0 flex-col gap-px", className)}
      onPointerOver={(event) => {
        onPointerOver?.(event)
        if (!marker) return
        const el = (event.target as HTMLElement).closest<HTMLElement>(MENU_BUTTONS)
        if (el && ref.current?.contains(el)) {
          hovered.current = el
          sync()
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        hovered.current = null
        if (marker) sync()
      }}
      {...props}
    >
      {marker && (
        <span
          aria-hidden
          data-slot="sidebar-menu-marker"
          data-ghost={pos?.ghost ? "" : undefined}
          data-hidden={pos ? undefined : ""}
          className="pointer-events-none absolute top-0 left-0 z-10 h-(--marker-h) w-0.5 translate-y-(--marker-y) rounded-full bg-tool transition-[translate,height,opacity,background-color] duration-[264ms] ease-standard data-ghost:bg-border-heavy data-hidden:opacity-0"
          style={{ "--marker-y": `${pos?.y ?? 0}px`, "--marker-h": `${pos?.h ?? 0}px` } as React.CSSProperties}
        />
      )}
      {children}
    </ul>
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-sm text-left text-sm text-sidebar-foreground outline-none transition-[background-color,color] duration-[154ms] ease-standard select-none hover:bg-fill focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-fill-active disabled:pointer-events-none disabled:text-faint aria-disabled:pointer-events-none aria-disabled:text-faint data-[active=true]:bg-fill data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground data-[state=open]:hover:bg-fill group-has-data-[sidebar=menu-action]/menu-item:pr-8 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-faint [&>svg]:transition-colors hover:[&>svg]:text-muted-foreground data-[active=true]:[&>svg]:text-tool [&>span]:truncate group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:[&>:not(svg)]:hidden",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-card shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-fill",
      },
      size: {
        default: "h-8 px-2",
        sm: "h-7 px-2 text-xs",
        lg: "h-12 px-2 group-data-[collapsible=icon]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  }) {
  const { isMobile, state } = useSidebar()
  const button = useRender({
    defaultTagName: "button",
    render,
    props: {
      type: render ? undefined : "button",
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      "aria-current": isActive && render ? "page" : undefined,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props,
    },
  })

  if (!tooltip || state !== "collapsed" || isMobile) return button
  const tip = typeof tooltip === "string" ? { children: tooltip } : tooltip
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="right" align="center" {...tip} />
    </Tooltip>
  )
}

function SidebarMenuAction({ className, render, showOnHover = false, ...props }: useRender.ComponentProps<"button"> & { showOnHover?: boolean }) {
  return useRender({
    defaultTagName: "button",
    render,
    props: {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-faint outline-none transition-[color,background-color,opacity] hover:bg-fill-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring peer-hover/menu-button:text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-3.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-muted-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      ),
      ...props,
    },
  })
}

function SidebarMenuBadge({ className, variant = "count", ...props }: React.ComponentProps<"span"> & { variant?: "count" | "accent" }) {
  return (
    <span
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      data-variant={variant}
      className={cn(
        "pointer-events-none ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-sm px-1 text-xs tabular-nums select-none",
        variant === "count" && "font-mono text-faint",
        variant === "accent" && "bg-tool-subtle font-medium text-tool-text",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  // Widths vary per row from the stable id so the bones do not line up.
  const id = React.useId()
  const width = `${50 + (id.charCodeAt(id.length - 2) % 5) * 10}%`
  return (
    <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" className={cn("flex h-8 items-center gap-2 rounded-sm px-2", className)} {...props}>
      {showIcon && <Skeleton className="size-4 rounded-sm" data-sidebar="menu-skeleton-icon" />}
      <Skeleton className="h-3 max-w-(--skeleton-width) flex-1 rounded-sm" data-sidebar="menu-skeleton-text" style={{ "--skeleton-width": width } as React.CSSProperties} />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn("my-0.5 ml-4 flex min-w-0 flex-col gap-px border-l border-sidebar-border pl-1.5 group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  )
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" className={cn("group/menu-sub-item relative", className)} {...props} />
}

function SidebarMenuSubButton({
  isActive = false,
  size = "md",
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & { size?: "sm" | "md"; isActive?: boolean }) {
  return useRender({
    defaultTagName: "a",
    render,
    props: {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      "aria-current": isActive ? "page" : undefined,
      className: cn(
        "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-sm px-2 text-muted-foreground outline-none transition-[background-color,color] duration-[154ms] ease-standard select-none hover:bg-fill hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-fill-active disabled:pointer-events-none disabled:text-faint aria-disabled:pointer-events-none aria-disabled:text-faint [&>span]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-faint",
        "data-[active=true]:bg-fill data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground data-[active=true]:[&>svg]:text-tool",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props,
    },
  })
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
}
