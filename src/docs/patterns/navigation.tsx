import { useState } from "react"
import {
  ActivityIcon,
  ArchiveIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  HistoryIcon,
  ImageIcon,
  ListChecksIcon,
  MonitorIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ToolMark } from "@/components/ui/tool-mark"
import { Tree, TreeItem, type TreeNode } from "@/components/ui/tree"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"
import { Keys, Meta } from "./shared"

// sidebar-01, sidebar-02

type SideItem = { id: string; label: string; icon: typeof FolderIcon; count?: number; badge?: number; kids?: { id: string; label: string; icon: typeof FolderIcon }[] }

const APP_SIDE: { label: string; items: SideItem[] }[] = [
  {
    label: "Library",
    items: [
      { id: "downloads", label: "Downloads", icon: DownloadIcon, count: 128 },
      { id: "desktop", label: "Desktop", icon: MonitorIcon, count: 12 },
      { id: "documents", label: "Documents", icon: FolderIcon },
    ],
  },
  {
    label: "Rules",
    items: [
      {
        id: "rules",
        label: "All rules",
        icon: ListChecksIcon,
        count: 9,
        kids: [
          { id: "r-shots", label: "Screenshots", icon: ImageIcon },
          { id: "r-inst", label: "Installers", icon: ArchiveIcon },
          { id: "r-rcpt", label: "Receipts", icon: FileIcon },
        ],
      },
    ],
  },
  {
    label: "Activity",
    items: [
      { id: "review", label: "Needs review", icon: ActivityIcon, badge: 3 },
      { id: "history", label: "History", icon: HistoryIcon },
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
]

function AppSidebar({ rail = false, collapsed = false }: { rail?: boolean; collapsed?: boolean }) {
  const [active, setActive] = useState("downloads")
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-104 overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-0 w-auto" defaultOpen={!collapsed}>
        <Sidebar collapsible={rail ? "icon" : "none"}>
          <SidebarHeader>
            <SidebarMenu marker={false}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Butler">
                  <ToolMark tool="butler" size={16} />
                  <span className="font-medium">Butler</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {APP_SIDE.map((g) => (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((it) => (
                      <SidebarMenuItem key={it.id}>
                        <SidebarMenuButton isActive={active === it.id} tooltip={it.label} onClick={() => setActive(it.id)}>
                          <it.icon />
                          <span>{it.label}</span>
                          {it.count !== undefined && <SidebarMenuBadge>{it.count}</SidebarMenuBadge>}
                          {it.badge !== undefined && <SidebarMenuBadge variant="accent">{it.badge}</SidebarMenuBadge>}
                        </SidebarMenuButton>
                        {it.kids && (
                          <>
                            <SidebarMenuAction aria-label={open ? "Collapse" : "Expand"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                              <ChevronRightIcon className="transition-transform aria-expanded:rotate-90" aria-expanded={open} />
                            </SidebarMenuAction>
                            {open && (
                              <SidebarMenuSub>
                                {it.kids.map((k) => (
                                  <SidebarMenuSubItem key={k.id}>
                                    <SidebarMenuSubButton render={<button type="button" />} isActive={active === k.id} onClick={() => setActive(k.id)}>
                                      <k.icon />
                                      <span>{k.label}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            {rail ? (
              <SidebarMenu marker={false}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Watching 3 folders" className="pointer-events-none">
                    <span className="grid size-4 place-items-center">
                      <span className="size-1.5 rounded-full bg-tool" aria-hidden />
                    </span>
                    <span>Watching 3 folders</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarTrigger className="w-full justify-start group-data-[collapsible=icon]:justify-center" />
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <div className="flex h-7 items-center gap-2 px-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-tool" aria-hidden />
                Watching 3 folders
                <Kbd className="ml-auto">⌘K</Kbd>
              </div>
            )}
          </SidebarFooter>
          {rail && <SidebarRail />}
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}

// sidebar-03

const DOCS_NAV: { id: string; label: string; kids?: { id: string; label: string }[] }[] = [
  {
    id: "start",
    label: "Getting started",
    kids: [
      { id: "install", label: "Install" },
      { id: "first", label: "First folder" },
    ],
  },
  {
    id: "rules",
    label: "Rules",
    kids: [
      { id: "match", label: "Matching" },
      { id: "actions", label: "Actions" },
      { id: "order", label: "Order and conflicts" },
    ],
  },
  { id: "schedules", label: "Schedules" },
  {
    id: "agents",
    label: "Agents",
    kids: [
      { id: "ask", label: "Asking for changes" },
      { id: "limits", label: "Limits" },
    ],
  },
  { id: "cli", label: "Command line" },
]

function DocsNav() {
  const [open, setOpen] = useState<string[]>(["rules"])
  const [active, setActive] = useState("actions")
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  return (
    <div className="flex h-104 overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-0 w-auto">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-faint transition-colors hover:bg-fill hover:text-muted-foreground"
            >
              <SearchIcon className="size-3.5" />
              <span className="flex-1 text-left">Search docs</span>
              <Kbd>/</Kbd>
            </button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Guide</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {DOCS_NAV.map((it) => {
                    const inSection = it.kids?.some((k) => k.id === active)
                    const isOpen = open.includes(it.id)
                    return (
                      <SidebarMenuItem key={it.id}>
                        <SidebarMenuButton isActive={active === it.id} onClick={() => (it.kids ? toggle(it.id) : setActive(it.id))}>
                          <span className={inSection ? "text-foreground" : undefined}>{it.label}</span>
                        </SidebarMenuButton>
                        {it.kids && (
                          <>
                            <SidebarMenuAction aria-label={isOpen ? "Collapse" : "Expand"} aria-expanded={isOpen} onClick={() => toggle(it.id)}>
                              <ChevronRightIcon className="transition-transform aria-expanded:rotate-90" aria-expanded={isOpen} />
                            </SidebarMenuAction>
                            {isOpen && (
                              <SidebarMenuSub>
                                {it.kids.map((k) => (
                                  <SidebarMenuSubItem key={k.id}>
                                    <SidebarMenuSubButton render={<button type="button" />} isActive={active === k.id} onClick={() => setActive(k.id)}>
                                      <span>{k.label}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </>
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex h-7 items-center px-2 font-mono text-xs text-faint">v0.4 · 2026-10</div>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}

// tree-01, tree-02

export const LAYERS: TreeNode[] = [
  {
    id: "home",
    name: "Home",
    kind: "frame",
    children: [
      {
        id: "nav",
        name: "Nav",
        kind: "frame",
        children: [
          { id: "logo", name: "Logo", kind: "rect" },
          { id: "links", name: "Links", kind: "text" },
        ],
      },
      {
        id: "hero",
        name: "Hero",
        kind: "frame",
        children: [
          { id: "headline", name: "Headline", kind: "text" },
          { id: "subhead", name: "Subhead", kind: "text" },
          { id: "cta", name: "Button", kind: "rect" },
        ],
      },
      { id: "cover", name: "Cover", kind: "image", locked: true },
      { id: "promo", name: "Promo banner", kind: "rect", hidden: true },
    ],
  },
  {
    id: "pricing",
    name: "Pricing",
    kind: "frame",
    children: [
      { id: "tiers", name: "Tiers", kind: "frame" },
      { id: "ptitle", name: "Title", kind: "text" },
    ],
  },
]

export function update(nodes: TreeNode[], id: string, fn: (n: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map((n) => (n.id === id ? fn(n) : n.children ? { ...n, children: update(n.children, id, fn) } : n))
}
function remove(nodes: TreeNode[], id: string): [TreeNode[], TreeNode | null] {
  let taken: TreeNode | null = null
  const rest = nodes.flatMap((n) => {
    if (n.id === id) {
      taken = n
      return []
    }
    if (!n.children) return [n]
    const [kids, t] = remove(n.children, id)
    if (t) taken = t
    return [{ ...n, children: kids }]
  })
  return [rest, taken]
}
function insert(nodes: TreeNode[], target: string, position: "into" | "below", node: TreeNode): TreeNode[] {
  return nodes.flatMap((n) => {
    if (n.id === target) return position === "into" ? [{ ...n, children: [node, ...(n.children ?? [])] }] : [n, node]
    return n.children ? [{ ...n, children: insert(n.children, target, position, node) }] : [n]
  })
}
const count = (nodes: TreeNode[]): number => nodes.reduce((a, n) => a + 1 + (n.children ? count(n.children) : 0), 0)

function LayerTree() {
  const [items, setItems] = useState(LAYERS)
  const [selected, setSelected] = useState(["cta"])
  const [expanded, setExpanded] = useState(["home", "hero"])
  return (
    <div className="flex w-72 flex-col overflow-hidden rounded-lg border bg-sidebar">
      <Tree
        className="h-80"
        items={items}
        selected={selected}
        onSelectedChange={setSelected}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onRename={(id, name) => setItems((t) => update(t, id, (n) => ({ ...n, name })))}
        onToggleHidden={(id) => setItems((t) => update(t, id, (n) => ({ ...n, hidden: !n.hidden })))}
        onToggleLocked={(id) => setItems((t) => update(t, id, (n) => ({ ...n, locked: !n.locked })))}
        onMove={(id, target, position) => {
          setItems((t) => {
            const [rest, node] = remove(t, id)
            return node ? insert(rest, target, position, node) : t
          })
          if (position === "into") setExpanded((e) => (e.includes(target) ? e : [...e, target]))
        }}
      />
      <div className="flex h-8 items-center gap-1.5 border-t px-3 text-xs text-faint">
        <span>{selected.length > 1 ? `${selected.length} selected` : `${count(items)} layers`}</span>
        <span className="ml-auto flex items-center gap-1">
          <Kbd>⇧</Kbd> range
        </span>
        <span className="flex items-center gap-1">
          <Kbd>↵</Kbd> rename
        </span>
      </div>
    </div>
  )
}

const ROW_STATES: [string, Partial<React.ComponentProps<typeof TreeItem>>][] = [
  ["rest", {}],
  ["hover", { hover: true }],
  ["selected", { selected: true }],
  ["open", { label: "Hero", hasChildren: true, open: true }],
  ["hidden", { hidden: true }],
  ["locked", { locked: true }],
  ["renaming", { selected: true, renaming: true }],
  ["drop into", { drop: "into" }],
  ["drop below", { drop: "below" }],
]

function TreeStates() {
  return (
    <div className="flex w-full max-w-md flex-col rounded-lg border bg-sidebar px-2 py-2">
      {ROW_STATES.map(([name, p]) => (
        <div key={name} className="flex items-center gap-4">
          <span className="w-20 shrink-0 px-2 font-mono text-xs text-faint">{name}</span>
          <div className="min-w-0 flex-1">
            <TreeItem depth={1} label="Button" onRenameCommit={() => {}} {...p} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NavigationPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Sidebars and trees">
        Sidebars and trees share one row, one indent step and the marker on the selected row.
      </PageHeader>

      <Section title="App sidebar" note="click a row · ↑↓ moves, ↵ selects · the Rules group opens">
        <Meta>
          <PatternId>sidebar-01</PatternId>
          <Uses
            ids={[
              ["sidebar", "Sidebar"],
              ["badge", "Count"],
              ["tool-mark", "Mark"],
            ]}
          />
        </Meta>
        <Example>
          <AppSidebar />
        </Example>
      </Section>

      <Section title="Icon rail" note="the toggle collapses to icons; selection survives">
        <Meta>
          <PatternId>sidebar-02</PatternId>
          <Uses
            ids={[
              ["sidebar", "Sidebar"],
              ["tooltip", "Tooltip"],
            ]}
          />
        </Meta>
        <Example>
          <div className="flex flex-wrap items-start gap-6">
            <AppSidebar rail collapsed />
            <AppSidebar rail />
          </div>
        </Example>
      </Section>

      <Section title="Docs nav" note="the active page carries the marker; its section stays dark">
        <Meta>
          <PatternId>sidebar-03</PatternId>
          <Uses
            ids={[
              ["sidebar", "Sidebar"],
              ["kbd", "Kbd"],
            ]}
          />
        </Meta>
        <Example>
          <DocsNav />
        </Example>
      </Section>

      <Section title="Layer tree" note="click, ⇧ range, ⌘ toggle · ↑↓←→ · ↵ renames · drag a row onto a frame or between rows">
        <Meta>
          <PatternId>tree-01</PatternId>
          <Uses
            ids={[
              ["tree", "Tree"],
              ["shell", "Editor shell"],
            ]}
          />
        </Meta>
        <Example>
          <LayerTree />
        </Example>
      </Section>

      <Section title="Layer row states">
        <Meta>
          <PatternId>tree-02</PatternId>
          <Uses ids={[["tree", "Tree"]]} />
        </Meta>
        <Example>
          <TreeStates />
        </Example>
      </Section>

      <Section title="Keyboard">
        <Keys
          rows={[
            ["↑ / ↓", "Moves through visible rows."],
            ["← / →", "Collapses or expands; ← on a child selects its parent."],
            ["↵", "Selects in a sidebar; renames in a tree."],
            ["⇧click · ⌘click", "Range and toggle selection in a tree."],
            ["⇧⌘H", "Hides or shows the selected layer."],
          ]}
        />
      </Section>

      <Related
        ids={[
          ["sidebar", "Sidebar"],
          ["tree", "Tree"],
          ["tabs", "Tabs"],
          ["shell", "Editor shell"],
        ]}
      />
    </>
  )
}
