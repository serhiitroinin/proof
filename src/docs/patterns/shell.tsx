import { useState } from "react"
import { FileIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolMark } from "@/components/ui/tool-mark"
import { ToolScope } from "@/components/ui/tool-scope"
import { Tree, type TreeNode } from "@/components/ui/tree"
import { Window, WindowBar, WindowBody, WindowMain, WindowToolbar } from "@/components/ui/window"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"
import { Inspector, type Box, type InspectedLayer } from "./inspector"
import { LAYERS, update } from "./navigation"
import { Meta } from "./shared"

const PAGES = ["Home", "Pricing", "About"]
const ASSETS = ["Button", "Card", "Nav", "Badge", "Input", "Avatar"]

const BOXES: Record<string, Box> = {
  home: [0, 0, 480, 640],
  nav: [0, 0, 480, 56],
  logo: [24, 16, 24, 24],
  links: [280, 20, 176, 16],
  hero: [0, 56, 480, 320],
  headline: [24, 96, 360, 40],
  subhead: [24, 148, 320, 20],
  cta: [24, 188, 96, 28],
  cover: [0, 376, 480, 200],
  promo: [0, 576, 480, 64],
  pricing: [520, 0, 320, 400],
  tiers: [24, 72, 272, 280],
  ptitle: [24, 24, 200, 32],
}

type Found = { node: TreeNode; parents: string[] } | null
function find(nodes: TreeNode[], id: string, parents: string[] = []): Found {
  for (const n of nodes) {
    if (n.id === id) return { node: n, parents }
    const hit = n.children && find(n.children, id, [...parents, n.id])
    if (hit) return hit
  }
  return null
}
function filter(nodes: TreeNode[], q: string): TreeNode[] {
  const k = q.trim().toLowerCase()
  if (!k) return nodes
  return nodes.flatMap((n) => {
    const kids = n.children ? filter(n.children, k) : []
    return n.name.toLowerCase().includes(k) || kids.length ? [{ ...n, children: kids.length ? kids : undefined }] : []
  })
}
const allIds = (nodes: TreeNode[]): string[] => nodes.flatMap((n) => [n.id, ...(n.children ? allIds(n.children) : [])])
const count = (nodes: TreeNode[]): number => nodes.reduce((a, n) => a + 1 + (n.children ? count(n.children) : 0), 0)

function CanvasBox({
  id,
  sel,
  hov,
  hidden,
  className,
  children,
  onPick,
  onHover,
}: {
  id: string
  sel: string
  hov: string | null
  hidden?: boolean
  className?: string
  children?: React.ReactNode
  onPick: (id: string) => void
  onHover: (id: string | null) => void
}) {
  if (hidden) return null
  return (
    <div
      data-selected={sel === id || undefined}
      data-hovered={hov === id || undefined}
      className={`relative cursor-default rounded-xs ring-tool transition-shadow data-hovered:ring-1 data-selected:ring-2 ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation()
        onPick(id)
      }}
      onPointerEnter={() => onHover(id)}
      onPointerLeave={() => onHover(null)}
    >
      {children}
    </div>
  )
}

function EditorShell() {
  const [items, setItems] = useState(LAYERS)
  const [boxes, setBoxes] = useState(BOXES)
  const [selected, setSelected] = useState(["cta"])
  const [expanded, setExpanded] = useState(["home", "hero"])
  const [hov, setHov] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [tab, setTab] = useState("layers")
  const [page, setPage] = useState("Home")

  const sel = selected[selected.length - 1] ?? "home"
  const found = find(items, sel)
  const hidden = (id: string) => {
    const f = find(items, id)
    return !!f && (!!f.node.hidden || f.parents.some((p) => find(items, p)?.node.hidden))
  }
  const pick = (id: string) => {
    setSelected([id])
    const f = find(items, id)
    if (f) setExpanded((e) => Array.from(new Set([...e, ...f.parents])))
  }
  const shown = filter(items, q)
  const layer: InspectedLayer = {
    name: found?.node.name ?? "Home",
    kind: (found?.node.kind as InspectedLayer["kind"]) ?? "frame",
    box: boxes[sel] ?? [0, 0, 0, 0],
  }
  const box = { id: "", sel, hov, onPick: pick, onHover: setHov }

  return (
    <ToolScope tool="vellum">
      <Window className="h-140">
        <WindowBar>
          <WindowToolbar>
            <ToolMark tool="vellum" size={18} />
            <span className="text-sm font-medium">Landing</span>
            <span className="text-xs text-faint">/ {page}</span>
          </WindowToolbar>
          <WindowToolbar align="end">
            <Badge variant="outline">
              <span className="font-mono">main</span>
            </Badge>
            <Button size="sm">Share</Button>
          </WindowToolbar>
        </WindowBar>
        <WindowBody>
          {/* A plain aside so the tree can run edge to edge. */}
          <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="border-b p-2">
              <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
                <TabsList className="w-full *:flex-1">
                  <TabsTrigger value="layers">Layers</TabsTrigger>
                  <TabsTrigger value="pages">Pages</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {tab === "layers" && (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="px-2 pt-2 pb-1">
                  <InputGroup className="h-7">
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-label="Find layer"
                      placeholder="Find layer"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setQ("")}
                    />
                    {q && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton aria-label="Clear" size="icon-xs" onClick={() => setQ("")}>
                          <XIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </div>
                {shown.length ? (
                  <Tree
                    className="flex-1"
                    items={shown}
                    query={q}
                    selected={selected}
                    onSelectedChange={setSelected}
                    expanded={q ? allIds(shown) : expanded}
                    onExpandedChange={setExpanded}
                    onRename={(id, name) => setItems((t) => update(t, id, (n) => ({ ...n, name })))}
                    onToggleHidden={(id) => setItems((t) => update(t, id, (n) => ({ ...n, hidden: !n.hidden })))}
                    onToggleLocked={(id) => setItems((t) => update(t, id, (n) => ({ ...n, locked: !n.locked })))}
                  />
                ) : (
                  <div className="flex-1 px-3 py-2.5 text-xs text-muted-foreground">No layer matches “{q}”.</div>
                )}
              </div>
            )}
            {tab === "pages" && (
              <div className="flex flex-1 flex-col gap-0.5 p-2">
                {PAGES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    data-active={p === page || undefined}
                    className="flex h-7 items-center gap-2 rounded-sm px-2 text-sm text-muted-foreground transition-colors hover:bg-fill hover:text-foreground data-active:bg-tool-subtle data-active:text-tool-text"
                    onClick={() => setPage(p)}
                  >
                    <FileIcon className="size-3.5" />
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  className="mt-1 flex h-7 items-center gap-2 rounded-md border border-dashed border-border-strong px-2 text-xs font-medium text-muted-foreground transition-colors hover:border-border-heavy hover:text-foreground"
                >
                  <PlusIcon className="size-3.5" />
                  Add page
                </button>
              </div>
            )}
            {tab === "assets" && (
              <div className="grid flex-1 grid-cols-2 content-start gap-2 p-2">
                {ASSETS.map((a) => (
                  <div key={a} className="flex flex-col gap-1.5 rounded-md border bg-card p-2 text-xs text-muted-foreground">
                    <span className="h-10 rounded-sm bg-fill" aria-hidden />
                    {a}
                  </div>
                ))}
              </div>
            )}
            <div className="flex h-8 shrink-0 items-center gap-1.5 border-t px-3 text-xs text-faint">
              <span>{count(items)} layers</span>
              <span className="ml-auto flex items-center gap-1">
                <Kbd>↵</Kbd> rename
              </span>
            </div>
          </aside>

          <WindowMain>
            <div className="flex flex-1 items-start gap-10 overflow-auto bg-muted p-10" onClick={() => pick("home")}>
              <CanvasBox {...box} id="home" className="flex w-72 shrink-0 flex-col overflow-hidden rounded-md border bg-card shadow-sm">
                <CanvasBox {...box} id="nav" className="flex h-10 items-center justify-between px-4">
                  <CanvasBox {...box} id="logo" className="size-4 rounded-sm bg-foreground" />
                  <CanvasBox {...box} id="links" className="flex gap-2">
                    {["Product", "Pricing", "Docs"].map((l) => (
                      <span key={l} className="h-1.5 w-8 rounded-full bg-fill-active" />
                    ))}
                  </CanvasBox>
                </CanvasBox>
                <CanvasBox {...box} id="hero" className="flex flex-col gap-3 px-4 pt-6 pb-8">
                  <CanvasBox {...box} id="headline" className="flex flex-col gap-1.5">
                    <span className="h-3 w-4/5 rounded-full bg-foreground" />
                    <span className="h-3 w-3/5 rounded-full bg-foreground" />
                  </CanvasBox>
                  <CanvasBox {...box} id="subhead" className="flex flex-col gap-1">
                    <span className="h-1.5 w-11/12 rounded-full bg-fill-active" />
                    <span className="h-1.5 w-2/3 rounded-full bg-fill-active" />
                  </CanvasBox>
                  <CanvasBox {...box} id="cta" className="mt-1 flex h-7 w-24 items-center justify-center rounded-md bg-primary">
                    <span className="h-1.5 w-10 rounded-full bg-primary-foreground/80" />
                  </CanvasBox>
                </CanvasBox>
                <CanvasBox {...box} id="cover" hidden={hidden("cover")} className="h-24 bg-tool-subtle" />
                <CanvasBox {...box} id="promo" hidden={hidden("promo")} className="flex h-10 items-center justify-center bg-fill text-xs text-muted-foreground">
                  Promo banner
                </CanvasBox>
              </CanvasBox>
              <CanvasBox {...box} id="pricing" className="flex w-48 shrink-0 flex-col gap-3 rounded-md border bg-card p-4 shadow-sm">
                <CanvasBox {...box} id="ptitle" className="h-3 w-2/3 rounded-full bg-foreground" />
                <CanvasBox {...box} id="tiers" className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-20 rounded-sm bg-fill" />
                  ))}
                </CanvasBox>
              </CanvasBox>
            </div>
          </WindowMain>

          <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-l border-sidebar-border bg-sidebar text-sidebar-foreground">
            <Inspector key={sel} layer={layer} onBox={(b) => setBoxes({ ...boxes, [sel]: b })} />
          </aside>
        </WindowBody>
      </Window>
    </ToolScope>
  )
}

export default function ShellPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Editor shell">
        Layer tree, canvas and inspector in one window at compact density.
      </PageHeader>

      <Section title="Editor shell" note="click layers or canvas · ↑↓←→ · ↵ renames · eye and lock on hover">
        <Meta>
          <PatternId>shell-01</PatternId>
          <Uses
            ids={[
              ["window", "Window"],
              ["tree", "Tree"],
              ["inspector", "Inspector"],
              ["tabs", "Tabs"],
              ["number-field", "Number field"],
            ]}
          />
        </Meta>
        <Example align="stretch">
          <EditorShell />
        </Example>
      </Section>

      <Related
        ids={[
          ["vellum", "Vellum"],
          ["navigation", "Sidebars and trees"],
          ["inspector", "Inspector"],
        ]}
      />
    </>
  )
}
