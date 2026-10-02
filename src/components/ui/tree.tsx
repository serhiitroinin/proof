"use client"

import * as React from "react"
import { cn } from "cn"
import {
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  FolderIcon,
  HashIcon,
  ImageIcon,
  LockIcon,
  SquareIcon,
  TypeIcon,
  UnlockIcon,
} from "lucide-react"

// Keyboard: ↑↓ move, ←→ close and open, ↵ renames, ⇧ extends a range, ⌘ toggles, ⇧⌘H hides.
// Rows are draggable when `onMove` is given.

type TreeNode = {
  id: string
  name: string
  kind?: string
  icon?: React.ReactNode
  children?: TreeNode[]
  hidden?: boolean
  locked?: boolean
}

const KIND_ICON: Record<string, React.ReactNode> = {
  frame: <HashIcon />,
  text: <TypeIcon />,
  rect: <SquareIcon />,
  image: <ImageIcon />,
  file: <FileIcon />,
  folder: <FolderIcon />,
}

type Drop = { id: string; position: "into" | "below" } | null

type TreeProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  items: TreeNode[]
  selected?: string[]
  defaultSelected?: string[]
  onSelectedChange?: (ids: string[]) => void
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (ids: string[]) => void
  /** Enables rename on ↵ and double-click. */
  onRename?: (id: string, name: string) => void
  /** Enables the eye action. */
  onToggleHidden?: (id: string) => void
  /** Enables the lock action. */
  onToggleLocked?: (id: string) => void
  /** Enables drag and drop between rows. */
  onMove?: (id: string, target: string, position: "into" | "below") => void
  /** Highlights matching text in names. */
  query?: string
  icons?: Record<string, React.ReactNode>
}

type Flat = { node: TreeNode; depth: number; parent: string | null }

function flatten(items: TreeNode[], expanded: Set<string>, depth = 0, parent: string | null = null): Flat[] {
  return items.flatMap((node) => {
    const row: Flat = { node, depth, parent }
    const kids = node.children && expanded.has(node.id) ? flatten(node.children, expanded, depth + 1, node.id) : []
    return [row, ...kids]
  })
}

function useControlled<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [state, setState] = React.useState(defaultValue)
  const current = value ?? state
  const set = React.useCallback(
    (v: T) => {
      setState(v)
      onChange?.(v)
    },
    [onChange]
  )
  return [current, set] as const
}

function Tree({
  className,
  items,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  onRename,
  onToggleHidden,
  onToggleLocked,
  onMove,
  query = "",
  icons = KIND_ICON,
  onKeyDown,
  ...props
}: TreeProps) {
  const [selected, setSelected] = useControlled(selectedProp, defaultSelected, onSelectedChange)
  const [expanded, setExpanded] = useControlled(expandedProp, defaultExpanded, onExpandedChange)
  const [renaming, setRenaming] = React.useState<string | null>(null)
  const [drop, setDrop] = React.useState<Drop>(null)
  const anchor = React.useRef<string | null>(null)
  const open = React.useMemo(() => new Set(expanded), [expanded])
  const rows = React.useMemo(() => flatten(items, open), [items, open])
  const ids = rows.map((r) => r.node.id)
  const focus = selected[selected.length - 1] ?? null

  const toggle = (id: string) => setExpanded(open.has(id) ? expanded.filter((x) => x !== id) : [...expanded, id])

  const pick = (id: string, e?: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }) => {
    if (e?.shiftKey && anchor.current) {
      const a = ids.indexOf(anchor.current)
      const b = ids.indexOf(id)
      if (a >= 0 && b >= 0) return setSelected(ids.slice(Math.min(a, b), Math.max(a, b) + 1))
    }
    if (e?.metaKey || e?.ctrlKey) {
      anchor.current = id
      return setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
    }
    anchor.current = id
    setSelected([id])
  }

  const move = (delta: number, e: React.KeyboardEvent) => {
    if (!ids.length) return
    const i = focus ? ids.indexOf(focus) : -1
    const n = Math.min(ids.length - 1, Math.max(0, i + delta))
    pick(ids[n], { shiftKey: e.shiftKey, metaKey: false, ctrlKey: false })
  }

  return (
    <div
      role="tree"
      aria-multiselectable
      tabIndex={0}
      data-slot="tree"
      className={cn(
        "group/tree flex min-h-0 flex-col overflow-auto px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        className
      )}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented || renaming) return
        const row = focus ? rows.find((r) => r.node.id === focus) : undefined
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault()
            move(1, e)
            break
          case "ArrowUp":
            e.preventDefault()
            move(-1, e)
            break
          case "ArrowRight":
            if (!row) return
            e.preventDefault()
            if (row.node.children?.length && !open.has(row.node.id)) toggle(row.node.id)
            else if (row.node.children?.length) move(1, e)
            break
          case "ArrowLeft":
            if (!row) return
            e.preventDefault()
            if (row.node.children?.length && open.has(row.node.id)) toggle(row.node.id)
            else if (row.parent) pick(row.parent)
            break
          case "Enter":
            if (row && onRename) {
              e.preventDefault()
              setRenaming(row.node.id)
            }
            break
          case "h":
          case "H":
            if (e.shiftKey && e.metaKey && onToggleHidden) {
              e.preventDefault()
              selected.forEach((id) => onToggleHidden(id))
            }
            break
          case "Escape":
            setSelected([])
            break
        }
      }}
      {...props}
    >
      {rows.map(({ node, depth }) => (
        <TreeItem
          key={node.id}
          depth={depth}
          label={node.name}
          icon={node.icon ?? (node.kind ? icons[node.kind] : undefined) ?? <SquareIcon />}
          hasChildren={!!node.children?.length}
          open={open.has(node.id)}
          selected={selected.includes(node.id)}
          hidden={node.hidden}
          locked={node.locked}
          renaming={renaming === node.id}
          query={query}
          drop={drop?.id === node.id ? drop.position : undefined}
          onToggle={() => toggle(node.id)}
          onSelect={(e) => pick(node.id, e)}
          onRenameStart={onRename ? () => setRenaming(node.id) : undefined}
          onRenameCommit={(name) => {
            setRenaming(null)
            if (name !== null && name.trim() && name !== node.name) onRename?.(node.id, name.trim())
          }}
          onEye={onToggleHidden ? () => onToggleHidden(node.id) : undefined}
          onLock={onToggleLocked ? () => onToggleLocked(node.id) : undefined}
          draggable={!!onMove}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", node.id)
            e.dataTransfer.effectAllowed = "move"
          }}
          onDragOver={(e) => {
            if (!onMove) return
            e.preventDefault()
            const r = e.currentTarget.getBoundingClientRect()
            const position = node.children && e.clientY < r.top + r.height * 0.7 ? "into" : "below"
            if (drop?.id !== node.id || drop.position !== position) setDrop({ id: node.id, position })
          }}
          onDragLeave={() => setDrop((d) => (d?.id === node.id ? null : d))}
          onDrop={(e) => {
            e.preventDefault()
            const id = e.dataTransfer.getData("text/plain")
            if (id && id !== node.id && drop) onMove?.(id, node.id, drop.position)
            setDrop(null)
          }}
          onDragEnd={() => setDrop(null)}
        />
      ))}
    </div>
  )
}

type TreeItemProps = Omit<React.ComponentProps<"div">, "hidden" | "onSelect"> & {
  depth?: number
  label: string
  icon?: React.ReactNode
  hasChildren?: boolean
  open?: boolean
  selected?: boolean
  hidden?: boolean
  locked?: boolean
  renaming?: boolean
  /** Keep the actions visible, as on hover. */
  hover?: boolean
  drop?: "into" | "below"
  query?: string
  onToggle?: () => void
  onSelect?: (e: React.MouseEvent) => void
  onRenameStart?: () => void
  onRenameCommit?: (name: string | null) => void
  onEye?: () => void
  onLock?: () => void
}

function TreeItem({
  className,
  depth = 0,
  label,
  icon,
  hasChildren,
  open,
  selected,
  hidden,
  locked,
  renaming,
  hover,
  drop,
  query = "",
  onToggle,
  onSelect,
  onRenameStart,
  onRenameCommit,
  onEye,
  onLock,
  onClick,
  onDoubleClick,
  ...props
}: TreeItemProps) {
  return (
    <div
      role="treeitem"
      data-slot="tree-item"
      aria-selected={!!selected}
      aria-expanded={hasChildren ? !!open : undefined}
      aria-level={depth + 1}
      data-hidden={hidden || undefined}
      data-locked={locked || undefined}
      data-hover={hover || undefined}
      data-drop={drop}
      style={{ "--depth": depth } as React.CSSProperties}
      className={cn(
        "group/tree-item relative flex h-7 shrink-0 cursor-default items-center gap-1.5 rounded-sm py-0 pr-1 pl-[calc(4px+var(--depth)*16px)] text-sm text-foreground select-none transition-[background-color,color] hover:bg-fill aria-selected:bg-tool-subtle aria-selected:text-tool-text aria-selected:hover:bg-tool-subtle",
        "before:pointer-events-none before:absolute before:inset-y-0 before:left-3 before:w-[calc(var(--depth)*16px)] before:bg-[repeating-linear-gradient(to_right,var(--color-border)_0_1px,transparent_1px_16px)]",
        "data-hidden:text-faint data-hidden:[&_[data-slot=tree-item-label]]:opacity-70 data-hidden:[&_[data-slot=tree-item-icon]]:opacity-70",
        "data-[drop=into]:bg-tool-subtle data-[drop=into]:ring-[1.5px] data-[drop=into]:ring-tool data-[drop=into]:ring-inset",
        "data-[drop=below]:after:absolute data-[drop=below]:after:right-1 data-[drop=below]:after:-bottom-px data-[drop=below]:after:left-7 data-[drop=below]:after:h-0.5 data-[drop=below]:after:rounded-full data-[drop=below]:after:bg-tool data-[drop=below]:before:inset-y-auto data-[drop=below]:before:-bottom-1 data-[drop=below]:before:left-6 data-[drop=below]:before:size-2 data-[drop=below]:before:rounded-full data-[drop=below]:before:border-2 data-[drop=below]:before:border-tool data-[drop=below]:before:bg-background data-[drop=below]:before:bg-none",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        onSelect?.(e)
      }}
      onDoubleClick={(e) => {
        onDoubleClick?.(e)
        onRenameStart?.()
      }}
      {...props}
    >
      <span
        data-slot="tree-item-twist"
        data-open={open || undefined}
        aria-hidden
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-sm text-muted-foreground transition-transform hover:bg-fill-active data-open:rotate-90 [&_svg]:size-3",
          !hasChildren && "invisible"
        )}
        onClick={(e) => {
          e.stopPropagation()
          onToggle?.()
        }}
      >
        <ChevronRightIcon />
      </span>
      <span
        data-slot="tree-item-icon"
        className="grid size-4 shrink-0 place-items-center text-muted-foreground in-aria-selected:text-tool-text [&_svg]:size-3"
      >
        {icon}
      </span>
      {renaming ? (
        <input
          data-slot="tree-item-rename"
          autoFocus
          defaultValue={label}
          onFocus={(e) => e.currentTarget.select()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === "Enter") onRenameCommit?.(e.currentTarget.value)
            if (e.key === "Escape") onRenameCommit?.(null)
          }}
          onBlur={(e) => onRenameCommit?.(e.currentTarget.value)}
          className="-ml-1 h-5 min-w-0 flex-1 rounded-sm bg-card px-1 text-sm text-foreground ring-[1.5px] ring-ring outline-none"
        />
      ) : (
        <span data-slot="tree-item-label" className="min-w-0 flex-1 truncate">
          <Highlight text={label} query={query} />
        </span>
      )}
      {(onEye || onLock) && !renaming && (
        <span data-slot="tree-item-actions" className="ml-auto flex shrink-0 items-center">
          {onEye && (
            <TreeItemAction set={hidden} label={hidden ? "Show" : "Hide"} onClick={onEye}>
              {hidden ? <EyeOffIcon /> : <EyeIcon />}
            </TreeItemAction>
          )}
          {onLock && (
            <TreeItemAction set={locked} label={locked ? "Unlock" : "Lock"} onClick={onLock}>
              {locked ? <LockIcon /> : <UnlockIcon />}
            </TreeItemAction>
          )}
        </span>
      )}
    </div>
  )
}

// Shown on row hover, or always when set.
function TreeItemAction({
  set,
  label,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { set?: boolean; label: string }) {
  return (
    <button
      type="button"
      data-slot="tree-item-action"
      data-set={set || undefined}
      aria-label={label}
      tabIndex={-1}
      className={cn(
        "invisible grid size-5 shrink-0 place-items-center rounded-sm text-muted-foreground outline-none hover:bg-fill-active hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring data-set:visible data-set:text-foreground group-hover/tree-item:visible group-data-hover/tree-item:visible in-aria-selected:data-set:text-tool-text [&_svg]:size-3",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      {...props}
    />
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase()
  const i = q ? text.toLowerCase().indexOf(q) : -1
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-selection text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export { Tree, TreeItem, TreeItemAction }
export type { TreeNode, TreeProps, TreeItemProps }
