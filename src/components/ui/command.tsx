"use client"

import * as React from "react"
import { cn } from "cn"
import { SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { MotifBroken } from "@/components/ui/motif"

// A Base UI Dialog around a hand-rolled listbox. The filter is a case-insensitive substring
// match over `value` and `keywords`.

type CommandContextValue = {
  query: string
  setQuery: (q: string) => void
  active: string | null
  setActive: (v: string | null) => void
  filter: (value: string, query: string, keywords?: string[]) => boolean
  shouldFilter: boolean
  listRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  handlers: React.RefObject<Map<string, () => void>>
  empty: boolean
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommand(part: string) {
  const ctx = React.useContext(CommandContext)
  if (!ctx) throw new Error(`${part} must be used inside <Command>`)
  return ctx
}

const defaultFilter = (value: string, query: string, keywords: string[] = []) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [value, ...keywords].some((s) => s.toLowerCase().includes(q))
}

const ITEM = '[data-slot=command-item]:not([data-disabled])'

type CommandProps = Omit<React.ComponentProps<"div">, "onChange" | "onSelect" | "defaultValue"> & {
  /** Highlighted item value (controlled). */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  /** Search query (controlled). */
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  filter?: CommandContextValue["filter"]
  shouldFilter?: boolean
  /** Called with the item value when a row is run by click or Enter. */
  onSelect?: (value: string) => void
}

function Command({
  className,
  children,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  filter = defaultFilter,
  shouldFilter = true,
  onSelect,
  onKeyDown,
  ...props
}: CommandProps) {
  const [queryState, setQueryState] = React.useState(defaultQuery)
  const [activeState, setActiveState] = React.useState<string | null>(defaultValue)
  const query = queryProp ?? queryState
  const active = valueProp === undefined ? activeState : valueProp
  const [empty, setEmpty] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const handlers = React.useRef(new Map<string, () => void>())
  const onSelectRef = React.useRef(onSelect)
  React.useEffect(() => {
    onSelectRef.current = onSelect
  })

  const setQuery = React.useCallback(
    (q: string) => {
      setQueryState(q)
      onQueryChange?.(q)
    },
    [onQueryChange]
  )
  const setActive = React.useCallback(
    (v: string | null) => {
      setActiveState(v)
      onValueChange?.(v)
    },
    [onValueChange]
  )

  const items = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])

  // After every commit: hide the empty state when a row matches, and keep the highlight on a
  // visible row (first match when the previous one filtered away).
  React.useLayoutEffect(() => {
    const root = listRef.current
    const sync = () => {
      const els = items()
      const isEmpty = els.length === 0
      setEmpty(isEmpty)
      const values = els.map((el) => el.dataset.value ?? "")
      if (active !== null && values.includes(active)) return
      setActive(values[0] ?? null)
    }
    sync()
    if (!root) return
    const mo = new MutationObserver(sync)
    mo.observe(root, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [query, active, setActive])

  const run = (value: string) => {
    handlers.current.get(value)?.()
    onSelectRef.current?.(value)
  }

  const move = (delta: number | "first" | "last") => {
    const els = items()
    if (!els.length) return
    const i = els.findIndex((el) => el.dataset.value === active)
    const n =
      delta === "first" ? 0 : delta === "last" ? els.length - 1 : Math.min(els.length - 1, Math.max(0, i + delta))
    const el = els[n]
    setActive(el.dataset.value ?? null)
    el.scrollIntoView({ block: "nearest" })
  }

  const ctx = React.useMemo<CommandContextValue>(
    () => ({ query, setQuery, active, setActive, filter, shouldFilter, listRef, inputRef, handlers, empty }),
    [query, setQuery, active, setActive, filter, shouldFilter, empty]
  )

  return (
    <CommandContext.Provider value={ctx}>
      <div
        data-slot="command"
        className={cn(
          "group/command flex h-full w-full flex-col overflow-hidden rounded-md border border-card-border bg-popover text-sm text-foreground shadow-lg in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:border-0 in-data-[slot=dialog-content]:shadow-none",
          className
        )}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.defaultPrevented) return
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault()
              move(e.metaKey ? "last" : 1)
              break
            case "ArrowUp":
              e.preventDefault()
              move(e.metaKey ? "first" : -1)
              break
            case "Home":
              e.preventDefault()
              move("first")
              break
            case "End":
              e.preventDefault()
              move("last")
              break
            case "Enter":
              if (active !== null && (e.target as HTMLElement).tagName !== "BUTTON") {
                e.preventDefault()
                run(active)
              }
              break
            case "Escape":
              // First press clears the query; a second one bubbles up to close the dialog.
              if (query) {
                e.preventDefault()
                e.stopPropagation()
                setQuery("")
              }
              break
          }
        }}
        {...props}
      >
        <CommandRun.Provider value={run}>{children}</CommandRun.Provider>
      </div>
    </CommandContext.Provider>
  )
}

const CommandRun = React.createContext<(value: string) => void>(() => {})

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  children?: React.ReactNode
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn("top-[18%] w-[420px] -translate-y-0 gap-0 p-0 sm:max-w-[420px]", className)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  children,
  value: valueProp,
  onChange,
  autoFocus = true,
  ...props
}: Omit<React.ComponentProps<"input">, "value"> & { value?: string }) {
  const { query, setQuery, inputRef, active } = useCommand("CommandInput")
  return (
    <div data-slot="command-input-wrapper" className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        data-slot="command-input"
        role="combobox"
        aria-expanded
        aria-autocomplete="list"
        aria-activedescendant={active ? `command-item-${slug(active)}` : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        value={valueProp ?? query}
        onChange={(e) => {
          onChange?.(e)
          setQuery(e.target.value)
        }}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-hidden placeholder:text-faint disabled:cursor-not-allowed disabled:text-faint",
          className
        )}
        {...props}
      />
      {children ?? <Kbd>esc</Kbd>}
    </div>
  )
}

function CommandList({ className, children, ...props }: React.ComponentProps<"div">) {
  const { listRef, active } = useCommand("CommandList")
  const [pos, setPos] = React.useState<{ y: number; h: number } | null>(null)

  React.useLayoutEffect(() => {
    const root = listRef.current
    if (!root) return
    const measure = () => {
      const el = active === null ? null : root.querySelector<HTMLElement>(`[data-slot=command-item][data-value="${CSS.escape(active)}"]`)
      if (!el) return setPos(null)
      const r = el.getBoundingClientRect()
      const b = root.getBoundingClientRect()
      setPos({ y: r.top - b.top + root.scrollTop + r.height * 0.22, h: r.height * 0.56 })
    }
    measure()
    root.addEventListener("scroll", measure)
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => {
      root.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [active, children, listRef])

  return (
    <div
      ref={listRef}
      role="listbox"
      data-slot="command-list"
      className={cn("relative max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1", className)}
      {...props}
    >
      {children}
      {pos && (
        <span
          aria-hidden
          data-slot="command-marker"
          style={{ "--marker-y": `${pos.y}px`, "--marker-h": `${pos.h}px` } as React.CSSProperties}
          className="pointer-events-none absolute top-0 left-0 z-10 h-(--marker-h) w-0.5 translate-y-(--marker-y) rounded-full bg-tool transition-[transform,height] duration-[264ms] ease-standard"
        />
      )}
    </div>
  )
}

function CommandEmpty({ className, children, ...props }: React.ComponentProps<"div">) {
  const { empty, query } = useCommand("CommandEmpty")
  if (!empty) return null
  return (
    <div
      role="presentation"
      data-slot="command-empty"
      className={cn("flex flex-col items-center gap-3 px-2 py-6 text-center text-sm text-muted-foreground animate-enter", className)}
      {...props}
    >
      <MotifBroken key={query} width={72} size={6} />
      <span>{children ?? <>Nothing matches &ldquo;{query}&rdquo;.</>}</span>
    </div>
  )
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<"div"> & { heading?: React.ReactNode }) {
  return (
    <div
      role="group"
      data-slot="command-group"
      className={cn("not-has-[[data-slot=command-item]]:hidden", className)}
      {...props}
    >
      {heading && (
        <div data-slot="command-group-heading" className="flex h-6 items-center px-2 text-xs font-medium text-faint">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  value,
  keywords,
  disabled,
  onSelect,
  children,
  onPointerMove,
  onClick,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  value: string
  keywords?: string[]
  disabled?: boolean
  onSelect?: (value: string) => void
}) {
  const { query, filter, shouldFilter, active, setActive, handlers } = useCommand("CommandItem")
  const run = React.useContext(CommandRun)
  const visible = !shouldFilter || filter(value, query, keywords)

  React.useLayoutEffect(() => {
    if (!visible) return
    const map = handlers.current
    map.set(value, () => onSelect?.(value))
    return () => {
      map.delete(value)
    }
  })

  if (!visible) return null
  const selected = active === value
  return (
    <div
      id={`command-item-${slug(value)}`}
      role="option"
      data-slot="command-item"
      data-value={value}
      data-disabled={disabled || undefined}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex h-8 cursor-default items-center gap-2 rounded-sm px-2 text-sm outline-hidden select-none aria-selected:bg-fill aria-selected:text-foreground data-disabled:pointer-events-none data-disabled:text-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[svg]:text-muted-foreground aria-selected:*:[svg]:text-foreground data-disabled:*:[svg]:text-faint active:bg-fill-active",
        className
      )}
      onPointerMove={(e) => {
        onPointerMove?.(e)
        if (!disabled && !selected) setActive(value)
      }}
      onClick={(e) => {
        onClick?.(e)
        if (!disabled) run(value)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto font-mono text-xs tracking-tight text-faint", className)}
      {...props}
    />
  )
}

function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn("flex h-9 shrink-0 items-center gap-2 border-t px-3 text-xs text-muted-foreground [&_kbd]:h-4 [&_kbd]:min-w-4", className)}
      {...props}
    />
  )
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandFooter,
}
