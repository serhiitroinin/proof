import { useEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  FrameIcon,
  HandIcon,
  MousePointer2Icon,
  PenToolIcon,
  PlusIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToolMark } from "@/components/ui/tool-mark"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tree, type TreeNode } from "@/components/ui/tree"
import { Window, WindowBar, WindowBody, WindowCanvas, WindowFooter, WindowMain, WindowSidebar, WindowToolbar } from "@/components/ui/window"

import { ProductPage, Scene, useLater } from "./shared"

type Kind = "Frame" | "Text" | "Rect"
type Layer = { id: string; name: string; kind: Kind; x: number; y: number; w: number; h: number; fill: string; code: string }

const LAYERS: Record<string, Layer> = {
  desktop: { id: "desktop", name: "Welcome / desktop", kind: "Frame", x: 60, y: 54, w: 420, h: 300, fill: "surface/panel", code: "<Frame w={420} h={300} fill=\"surface/panel\">" },
  header: { id: "header", name: "Header", kind: "Frame", x: 60, y: 54, w: 420, h: 56, fill: "surface/panel", code: "<Row h={56} px={24} align=\"center\">" },
  hero: { id: "hero", name: "Hero", kind: "Frame", x: 60, y: 110, w: 420, h: 160, fill: "surface/panel", code: "<Stack gap={10} p={32}>" },
  title: { id: "title", name: "Title", kind: "Text", x: 92, y: 142, w: 356, h: 64, fill: "text/primary", code: "<Text style=\"display/28\">" },
  subtitle: { id: "subtitle", name: "Subtitle", kind: "Text", x: 92, y: 216, w: 356, h: 20, fill: "text/secondary", code: "<Text style=\"body/13\" tone=\"secondary\">" },
  button: { id: "button", name: "Button / primary", kind: "Rect", x: 92, y: 246, w: 112, h: 32, fill: "accent/solid", code: "<Button variant=\"primary\">" },
  mobile: { id: "mobile", name: "Welcome / mobile", kind: "Frame", x: 520, y: 54, w: 160, h: 300, fill: "surface/panel", code: "<Frame w={160} h={300} fill=\"surface/panel\">" },
  mtitle: { id: "mtitle", name: "Title", kind: "Text", x: 536, y: 86, w: 128, h: 56, fill: "text/primary", code: "<Text style=\"display/20\">" },
  mbutton: { id: "mbutton", name: "Button / primary", kind: "Rect", x: 536, y: 158, w: 128, h: 32, fill: "accent/solid", code: "<Button variant=\"primary\" full>" },
}

const TREE: TreeNode[] = [
  {
    id: "desktop",
    name: "Welcome / desktop",
    kind: "frame",
    children: [
      { id: "header", name: "Header", kind: "frame" },
      {
        id: "hero",
        name: "Hero",
        kind: "frame",
        children: [
          { id: "title", name: "Title", kind: "text" },
          { id: "subtitle", name: "Subtitle", kind: "text" },
          { id: "button", name: "Button / primary", kind: "rect" },
        ],
      },
    ],
  },
  {
    id: "mobile",
    name: "Welcome / mobile",
    kind: "frame",
    children: [
      { id: "mtitle", name: "Title", kind: "text" },
      { id: "mbutton", name: "Button / primary", kind: "rect" },
    ],
  },
]

type Tool = "v" | "f" | "r" | "t" | "p" | "h"
const TOOLS: { id: Tool; label: string; key: string; Icon: typeof MousePointer2Icon }[] = [
  { id: "v", label: "Move", key: "V", Icon: MousePointer2Icon },
  { id: "f", label: "Frame", key: "F", Icon: FrameIcon },
  { id: "r", label: "Rectangle", key: "R", Icon: SquareIcon },
  { id: "t", label: "Text", key: "T", Icon: TypeIcon },
  { id: "p", label: "Pen", key: "P", Icon: PenToolIcon },
  { id: "h", label: "Hand", key: "H", Icon: HandIcon },
]

export default function VellumPage() {
  return (
    <ProductPage
      tool="vellum"
      title="Vellum"
      lead="A design editor: dense chrome around a canvas, with layer tree, inspector and toolbar at compact density."
      uses={["Window", "Tree", "Toggle Group", "Input Group", "Field", "Tooltip", "Copy Button", "Toast"]}
      look={[
        "Three columns at compact density: layers, canvas, inspector. The chrome is quiet so the canvas carries the colour.",
        "Selection is the tool colour everywhere: the tree row, the box with four handles, the tag with name and size.",
        "Every number in the inspector is a field: arrows nudge by 1, shift by 8, a bad value says what the field takes. Fills are tokens in mono with a swatch.",
        "The agent lives in a bar under the canvas. Its change lands on the canvas, in the inspector and in a toast with Undo.",
      ]}
      related={[
        { id: "tree", title: "Tree" },
        { id: "butler", title: "Butler" },
        { id: "input-group", title: "Input Group" },
      ]}
    >
      <Scene>
        <Editor />
      </Scene>
    </ProductPage>
  )
}

function Editor() {
  const [page, setPage] = useState<"onboarding" | "settings">("onboarding")
  const [tool, setTool] = useState<Tool>("v")
  const [selected, setSelected] = useState<string[]>(["hero"])
  const [hover, setHover] = useState<string | null>(null)
  const [gap, setGap] = useState(10)
  const [pad, setPad] = useState(32)
  const [layout, setLayout] = useState<"none" | "stack" | "grid">("stack")
  const [saving, setSaving] = useState(false)
  const [ask, setAsk] = useState("")
  const [busy, setBusy] = useState(false)
  const [ripple, setRipple] = useState(0)

  useLater(saving, 900, () => setSaving(false))
  useLater(busy, 1400, () => {
    setBusy(false)
    setAsk("")
    const prev = gap
    setGap(16)
    setSaving(true)
    toast(`Agent changed Hero gap ${prev} → 16`, { action: { label: "Undo", onClick: () => setGap(prev) } })
  })

  useEffect(() => {
    const t = setTimeout(() => toast("Agent changed Hero padding 24 → 32", { action: { label: "Undo", onClick: () => setPad(24) } }), 600)
    return () => clearTimeout(t)
  }, [])

  const sel = selected[0] ? LAYERS[selected[0]] : null
  const select = (id: string | null) => setSelected(id ? [id] : [])

  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return
    const t = TOOLS.find((x) => x.key.toLowerCase() === e.key.toLowerCase())
    if (t) {
      e.preventDefault()
      setTool(t.id)
    }
    if (e.key === "Escape") select(null)
  }

  const onCanvasClick = () => {
    if (tool === "v") {
      select(null)
      setRipple((r) => r + 1)
    }
  }

  const change = (fn: () => void) => {
    fn()
    setSaving(true)
  }

  return (
    <Window className="h-[620px]" tabIndex={0} onKeyDown={onKey} aria-label="Vellum">
      <WindowBar>
        <WindowToolbar>
          <ToolMark tool="vellum" size={18} />
          <span className="text-sm font-semibold">onboarding</span>
          <ChevronRightIcon className="size-3.5 text-faint" />
          <Button variant="ghost" size="sm" onClick={() => setPage((p) => (p === "onboarding" ? "settings" : "onboarding"))}>
            {page === "onboarding" ? "Onboarding" : "Settings"}
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <span className="flex items-center gap-1.5 text-xs text-faint">
            {saving ? (
              <>
                <Spinner className="size-3" /> saving
              </>
            ) : (
              "saved"
            )}
          </span>
        </WindowToolbar>
        <WindowToolbar align="center">
          <ToggleGroup size="sm" value={[tool]} onValueChange={(v: string[]) => v[0] && setTool(v[0] as Tool)} aria-label="Tools">
            {TOOLS.map(({ id, label, key, Icon }) => (
              <Tooltip key={id}>
                <TooltipTrigger render={<ToggleGroupItem value={id} aria-label={label} />}>
                  <Icon />
                </TooltipTrigger>
                <TooltipContent>
                  {label} <Kbd>{key}</Kbd>
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </WindowToolbar>
        <WindowToolbar align="end">
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <Button variant="ghost" size="sm">
            100%
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Preview">
            <EyeIcon />
          </Button>
          <CopyButton
            variant="default"
            text="https://vellum.dev/f/onboarding"
            copiedLabel="Link copied"
            onCopied={() => toast("Link copied", { description: "https://vellum.dev/f/onboarding" })}
          >
            Share
          </CopyButton>
        </WindowToolbar>
      </WindowBar>
      <WindowBody>
        <WindowSidebar width="default">
          <div className="flex items-center justify-between px-2 pt-1 pb-1">
            <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Pages</span>
            <Button variant="ghost" size="icon-xs" aria-label="New page">
              <PlusIcon />
            </Button>
          </div>
          <PageRow active={page === "onboarding"} onClick={() => setPage("onboarding")}>
            Onboarding
          </PageRow>
          <PageRow active={page === "settings"} onClick={() => setPage("settings")}>
            Settings
          </PageRow>
          <Separator className="my-2" />
          <span className="px-2 pb-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">Layers</span>
          {page === "onboarding" ? (
            <Tree items={TREE} selected={selected} onSelectedChange={setSelected} defaultExpanded={["desktop", "hero", "mobile"]} className="-mx-2" />
          ) : (
            <span className="px-2 py-2 text-xs text-faint">No layers</span>
          )}
        </WindowSidebar>

        <WindowMain>
          <WindowCanvas data-tool={tool} className="data-[tool=h]:cursor-grab data-[tool=v]:cursor-default data-[tool=f]:cursor-crosshair data-[tool=r]:cursor-crosshair data-[tool=t]:cursor-text data-[tool=p]:cursor-crosshair" onClick={onCanvasClick}>
            {page === "settings" ? (
              <div className="flex h-full items-center justify-center">
                <Empty variant="plain">
                  <EmptyHeader>
                    <EmptyTitle>Empty page</EmptyTitle>
                    <EmptyDescription>Press F and drag to draw a frame.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              <>
                {ripple > 0 && <span key={ripple} className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 animate-exit rounded-full border border-tool-border" />}
                <Frame layer={LAYERS.desktop} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select}>
                  <Node layer={LAYERS.header} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} className="flex items-center justify-between border-b border-border px-6">
                    <ToolMark tool="butler" size={18} />
                    <span className="flex gap-2">
                      <span className="h-5 w-12 rounded-full bg-fill" />
                      <span className="h-5 w-12 rounded-full bg-fill" />
                    </span>
                  </Node>
                  <Node layer={LAYERS.hero} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} style={{ "--gap": `${gap}px`, "--pad": `${pad}px` } as CSSProperties} className="flex flex-col items-start gap-(--gap) p-(--pad)">
                    <Node layer={LAYERS.title} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} inline>
                      <span className="block text-3xl leading-8 font-bold tracking-tight">
                        Tidy without
                        <br />
                        losing a file.
                      </span>
                    </Node>
                    <Node layer={LAYERS.subtitle} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} inline>
                      <span className="block text-sm text-muted-foreground">Proposals you can read, edit and undo.</span>
                    </Node>
                    <Node layer={LAYERS.button} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} inline>
                      <span className="inline-flex h-8 items-center rounded-md bg-tool px-3 text-sm font-medium text-tool-foreground">Add a folder</span>
                    </Node>
                  </Node>
                </Frame>
                <Frame layer={LAYERS.mobile} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select}>
                  <div className="flex flex-col gap-4 p-4">
                    <Node layer={LAYERS.mtitle} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} inline>
                      <span className="block text-xl leading-6 font-bold tracking-tight">
                        Tidy without
                        <br />
                        losing a file.
                      </span>
                    </Node>
                    <Node layer={LAYERS.mbutton} hover={hover} selected={selected[0]} onHover={setHover} onSelect={select} inline>
                      <span className="flex h-8 items-center justify-center rounded-md bg-tool px-3 text-sm font-medium text-tool-foreground">Add a folder</span>
                    </Node>
                  </div>
                </Frame>
                {sel && <SelectionBox layer={sel} />}
              </>
            )}
          </WindowCanvas>
          <WindowFooter>
            <Avatar size="sm">
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <InputGroup className="flex-1">
              <InputGroupInput
                placeholder="Ask the agent… “more air between the lines”"
                value={ask}
                disabled={busy}
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === "Enter" && ask.trim()) setBusy(true)
                }}
              />
              <InputGroupAddon align="inline-end">{busy ? <Spinner /> : <Kbd>↵</Kbd>}</InputGroupAddon>
            </InputGroup>
          </WindowFooter>
        </WindowMain>

        <WindowSidebar side="right" width="wide">
          {sel ? (
            <Inspector
              layer={sel}
              gap={gap}
              pad={pad}
              layout={layout}
              onGap={(v) => change(() => setGap(v))}
              onPad={(v) => change(() => setPad(v))}
              onLayout={(v) => change(() => setLayout(v))}
            />
          ) : (
            <div className="flex h-full flex-col justify-center">
              <Empty variant="plain">
                <EmptyHeader>
                  <EmptyTitle>Nothing selected</EmptyTitle>
                  <EmptyDescription>Click a layer, or press V and click on the canvas.</EmptyDescription>
                </EmptyHeader>
              </Empty>
              <span className="flex items-center justify-center gap-2 px-4 text-xs text-faint">
                <ToolMark tool="vellum" size={14} />
                Every value here is a token.
              </span>
            </div>
          )}
        </WindowSidebar>
      </WindowBody>
    </Window>
  )
}

function PageRow({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-current={active || undefined}
      onClick={onClick}
      className="flex h-7 items-center rounded-md px-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent aria-[current]:bg-tool-subtle aria-[current]:font-medium aria-[current]:text-tool-text"
    >
      {children}
    </button>
  )
}

type NodeProps = {
  layer: Layer
  hover: string | null
  selected?: string
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  inline?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

function Frame({ layer, children, ...rest }: NodeProps) {
  return (
    <div className="absolute top-(--y) left-(--x) h-(--h) w-(--w)" style={{ "--x": `${layer.x}px`, "--y": `${layer.y}px`, "--w": `${layer.w}px`, "--h": `${layer.h}px` } as CSSProperties} data-slot="vellum-frame">
      <span className="absolute -top-5 left-0 font-mono text-xs text-faint">{layer.name}</span>
      <Node layer={layer} {...rest} className="h-full w-full rounded-md border border-border bg-card shadow-md">
        {children}
      </Node>
    </div>
  )
}

// `inline` layers size to content.
function Node({ layer, hover, selected, onHover, onSelect, inline, className, style, children }: NodeProps) {
  const state = selected === layer.id ? "selected" : hover === layer.id ? "hover" : undefined
  return (
    <div
      data-state={state}
      style={style}
      className={cnx(
        "relative outline-offset-0 data-[state=hover]:outline data-[state=hover]:outline-1 data-[state=hover]:outline-tool-border",
        inline ? "w-fit" : "w-full",
        className
      )}
      onMouseEnter={(e) => {
        e.stopPropagation()
        onHover(layer.id)
      }}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(layer.id)
      }}
    >
      {children}
    </div>
  )
}

const cnx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ")

function SelectionBox({ layer }: { layer: Layer }) {
  return (
    <div className="pointer-events-none absolute top-(--y) left-(--x) h-(--h) w-(--w)" style={{ "--x": `${layer.x}px`, "--y": `${layer.y}px`, "--w": `${layer.w}px`, "--h": `${layer.h}px` } as CSSProperties} aria-hidden>
      <div className="absolute inset-0 border-2 border-tool" />
      <span className="absolute -top-1 -left-1 size-2 border border-tool bg-card" />
      <span className="absolute -top-1 -right-1 size-2 border border-tool bg-card" />
      <span className="absolute -bottom-1 -left-1 size-2 border border-tool bg-card" />
      <span className="absolute -right-1 -bottom-1 size-2 border border-tool bg-card" />
      <span className="absolute -bottom-6 left-0 rounded-sm bg-tool px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-tool-foreground">
        {layer.name} · {layer.w} × {layer.h}
      </span>
    </div>
  )
}

function Inspector({
  layer,
  gap,
  pad,
  layout,
  onGap,
  onPad,
  onLayout,
}: {
  layer: Layer
  gap: number
  pad: number
  layout: "none" | "stack" | "grid"
  onGap: (v: number) => void
  onPad: (v: number) => void
  onLayout: (v: "none" | "stack" | "grid") => void
}) {
  const code =
    layer.id === "hero" ? `<Stack gap={${gap}} p={${pad}}>\n  <Text style="display/28" />\n  <Text style="body/13" />\n  <Button variant="primary" />\n</Stack>` : layer.code
  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{layer.name}</span>
        <Badge variant="outline">{layer.kind}</Badge>
        <CopyButton size="icon-xs" variant="ghost" text={layer.name} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Dim label="X" value={layer.x} />
        <Dim label="Y" value={layer.y} />
        <Dim label="W" value={layer.w} />
        <Dim label="H" value={layer.h} />
      </div>
      {layer.id === "hero" && (
        <>
          <Separator />
          <Field>
            <FieldLabel>Layout</FieldLabel>
            <ToggleGroup size="sm" value={[layout]} onValueChange={(v: string[]) => v[0] && onLayout(v[0] as "none" | "stack" | "grid")} aria-label="Layout">
              <ToggleGroupItem value="none">None</ToggleGroupItem>
              <ToggleGroupItem value="stack">Stack</ToggleGroupItem>
              <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Num label="gap" value={gap} onChange={onGap} />
            <Num label="pad" value={pad} onChange={onPad} />
          </div>
        </>
      )}
      <Separator />
      <Field>
        <FieldLabel>Fill</FieldLabel>
        <div className="flex items-center gap-2">
          <span
            data-fill={layer.fill}
            className="size-5 shrink-0 rounded-sm border border-border bg-card data-[fill=accent/solid]:bg-tool data-[fill=text/primary]:bg-foreground data-[fill=text/secondary]:bg-muted-foreground"
          />
          <span className="font-mono text-xs">{layer.fill}</span>
          <Badge variant="ghost">token</Badge>
        </div>
      </Field>
      <Separator />
      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Code</FieldLabel>
          <CopyButton size="icon-xs" variant="ghost" text={code} />
        </div>
        <pre className="overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs leading-5 text-muted-foreground">{code}</pre>
        <FieldDescription>Every value here is a token.</FieldDescription>
      </Field>
    </div>
  )
}

function Dim({ label, value }: { label: string; value: number }) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText className="w-3">
          <span className="font-mono">{label}</span>
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput readOnly value={value} aria-label={label} />
    </InputGroup>
  )
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [text, setText] = useState(String(value))
  const [seen, setSeen] = useState(value)
  if (seen !== value) {
    setSeen(value)
    setText(String(value))
  }
  const n = Number(text)
  const invalid = text.trim() === "" || !Number.isInteger(n) || n < 0 || n > 64
  const commit = (v: number) => {
    const c = Math.max(0, Math.min(64, Math.round(v)))
    setText(String(c))
    onChange(c)
  }
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel>
        <span className="font-mono text-xs">{label}</span>
      </FieldLabel>
      <Input
        value={text}
        aria-invalid={invalid || undefined}
        aria-label={label}
        onChange={(e) => {
          setText(e.target.value)
          const v = Number(e.target.value)
          if (e.target.value.trim() !== "" && Number.isInteger(v) && v >= 0 && v <= 64) onChange(v)
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            const step = (e.shiftKey ? 8 : 1) * (e.key === "ArrowUp" ? 1 : -1)
            commit((Number.isFinite(n) ? n : value) + step)
          }
        }}
        onBlur={() => !invalid && commit(n)}
      />
      {invalid && <FieldError>{label} takes a whole number from 0 to 64</FieldError>}
    </Field>
  )
}
