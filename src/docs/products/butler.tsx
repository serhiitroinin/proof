import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  HistoryIcon,
  ImageIcon,
  ListChecksIcon,
  LockIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Motif, MotifDot } from "@/components/ui/motif"
import { NumberRoll } from "@/components/ui/number-roll"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToolMark } from "@/components/ui/tool-mark"
import {
  Window,
  WindowBar,
  WindowBody,
  WindowFooter,
  WindowHeader,
  WindowToolbar,
} from "@/components/ui/window"

import { ProductPage, Scene, useLater } from "./shared"

type Kind = "pdf" | "png" | "dmg" | "zip"
type File = {
  id: string
  name: string
  rename?: string
  kind: Kind
  size: string
}
type Group = { id: string; dest: string; trash?: boolean; files: File[] }

const PLAN: Group[] = [
  {
    id: "invoices",
    dest: "Invoices/2025",
    files: [
      { id: "f1", name: "invoice-jan.pdf", kind: "pdf", size: "245 KB" },
      { id: "f2", name: "invoice-feb.pdf", kind: "pdf", size: "318 KB" },
      {
        id: "f3",
        name: "Scan 2025-03-14.pdf",
        rename: "acme-march.pdf",
        kind: "pdf",
        size: "412 KB",
      },
    ],
  },
  {
    id: "screenshots",
    dest: "Screenshots",
    files: [
      {
        id: "f4",
        name: "Screenshot 2025-09-28 at 10.14.02.png",
        kind: "png",
        size: "1.4 MB",
      },
      {
        id: "f5",
        name: "Screenshot 2025-09-29 at 18.40.11.png",
        kind: "png",
        size: "982 KB",
      },
      {
        id: "f6",
        name: "CleanShot 2025-09-30.png",
        kind: "png",
        size: "756 KB",
      },
    ],
  },
  {
    id: "installers",
    dest: "Installers",
    files: [
      { id: "f7", name: "Docker.dmg", kind: "dmg", size: "633 MB" },
      { id: "f8", name: "Postgres-17.dmg", kind: "dmg", size: "298 MB" },
    ],
  },
  {
    id: "trash",
    dest: "Trash",
    trash: true,
    files: [
      { id: "f9", name: "invoice-jan (1).pdf", kind: "pdf", size: "245 KB" },
      { id: "f10", name: "old-export.zip", kind: "zip", size: "12 MB" },
    ],
  },
]

const ALL_FILES = PLAN.flatMap((g) =>
  g.files.map((f) => ({ ...f, group: g.id, trash: !!g.trash }))
)
const DEFAULT_ON = new Set(ALL_FILES.filter((f) => !f.trash).map((f) => f.id))

const KIND_ICON: Record<Kind, typeof FileIcon> = {
  pdf: FileTextIcon,
  png: ImageIcon,
  dmg: PackageIcon,
  zip: FileIcon,
}

type Nav =
  "downloads" | "desktop" | "projects" | "rules" | "history" | "settings"
type Phase = "scanning" | "proposed" | "applying" | "done" | "rejected"
type View = "proposal" | "before" | "after"

export default function ButlerPage() {
  return (
    <ProductPage
      tool="butler"
      title="Butler"
      lead="A Mac app that proposes a tidy-up plan for a folder and lets you overrule it."
      uses={[
        "Window",
        "Sidebar",
        "Table",
        "Toggle Group",
        "Progress",
        "Button",
        "Toast",
        "Empty",
        "Switch",
      ]}
      look={[
        "The plan is a grouped table: the destination folder is the group row, renames sit beside the old names. Nothing moves until Approve.",
        "One decision at the bottom: Reject is quiet, Approve is lit and carries its shortcut. The ask field revises the plan in place.",
        "The long job is the motif: the line fills, the tool dot rides its tip, the current file reads out in mono. Done is a toast with Undo.",
        "Errors say what happened and what Butler can do: Projects lost folder access, so the button asks macOS.",
      ]}
      related={[
        { id: "cli", title: "Terminal" },
        { id: "readme", title: "README" },
        { id: "sidebar", title: "Sidebar" },
      ]}
    >
      <Scene>
        <ButlerApp />
      </Scene>
    </ProductPage>
  )
}

function ButlerApp() {
  const [nav, setNav] = useState<Nav>("downloads")
  const [view, setView] = useState<View>("proposal")
  const [phase, setPhase] = useState<Phase>("proposed")
  const [on, setOn] = useState<Set<string>>(DEFAULT_ON)
  const [cursor, setCursor] = useState<string>("f3")
  const [revised, setRevised] = useState(false)
  const [asking, setAsking] = useState(false)
  const [ask, setAsk] = useState("")
  const [progress, setProgress] = useState(0)
  const [runs, setRuns] = useState([
    {
      id: "r1",
      when: "Sep 28 · 18:02",
      folder: "Desktop",
      moves: 14,
      undone: false,
    },
    {
      id: "r2",
      when: "Sep 21 · 09:15",
      folder: "Downloads",
      moves: 31,
      undone: false,
    },
  ])
  const [movedTotal, setMovedTotal] = useState(0)

  const moving = ALL_FILES.filter((f) => on.has(f.id) && !f.trash)
  const moves = moving.length
  const off = ALL_FILES.length - moves
  const folders = new Set(moving.map((f) => f.group)).size
  const renames = moving.filter((f) => f.rename).length

  useLater(phase === "scanning", 1400, () => setPhase("proposed"))

  useLater(asking, 1400, () => {
    setAsking(false)
    setRevised(true)
    setAsk("")
  })

  const reset = () => {
    setPhase("proposed")
    setProgress(0)
    setRevised(false)
    setOn(DEFAULT_ON)
    setMovedTotal(0)
  }

  const total = moves
  useEffect(() => {
    if (phase !== "applying") return
    let i = 0
    const steps = total
    const timers: number[] = []
    let t = 0
    for (let k = 1; k <= steps; k++) {
      t += 160 + ((k * 7919) % 5) * 90
      timers.push(window.setTimeout(() => setProgress(++i), t))
    }
    timers.push(
      window.setTimeout(() => {
        setPhase("done")
        setMovedTotal(steps)
        setRuns((r) => [
          {
            id: `r${Date.now()}`,
            when: "Oct 1 · 11:24",
            folder: "Downloads",
            moves: steps,
            undone: false,
          },
          ...r,
        ])
        toast(`${steps} files moved`, {
          description: "Downloads is tidy. Undo stays available for 30 days.",
          action: { label: "Undo", onClick: () => reset() },
        })
      }, t + 500)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const toggle = (id: string) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const toggleGroup = (g: Group) =>
    setOn((s) => {
      const n = new Set(s)
      const all = g.files.every((f) => n.has(f.id))
      g.files.forEach((f) => (all ? n.delete(f.id) : n.add(f.id)))
      return n
    })

  const approve = () =>
    phase === "proposed" && moves > 0 && (setProgress(0), setPhase("applying"))

  const onKey = (e: KeyboardEvent) => {
    if (nav !== "downloads" || phase !== "proposed") return
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      approve()
      return
    }
    if ((e.target as HTMLElement).tagName === "INPUT") return
    const ids = ALL_FILES.map((f) => f.id)
    const i = ids.indexOf(cursor)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCursor(ids[Math.min(ids.length - 1, i + 1)])
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCursor(ids[Math.max(0, i - 1)])
    } else if (e.key === " ") {
      e.preventDefault()
      toggle(cursor)
    }
  }

  const downloadsCount = 28 - movedTotal

  return (
    <Window
      className="h-[620px]"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Butler"
    >
      <WindowBar>
        <WindowToolbar>
          <ToggleGroup
            size="sm"
            value={[view]}
            onValueChange={(v: string[]) => v[0] && setView(v[0] as View)}
            aria-label="View"
            disabled={nav !== "downloads"}
          >
            <ToggleGroupItem value="proposal">Proposal</ToggleGroupItem>
            <ToggleGroupItem value="before">Before</ToggleGroupItem>
            <ToggleGroupItem value="after">After</ToggleGroupItem>
          </ToggleGroup>
        </WindowToolbar>
        <WindowToolbar align="end">
          <Button variant="ghost" size="sm">
            Engine{" "}
            <span className="text-muted-foreground">Claude · Sonnet</span>
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
          <InputGroup className="w-44">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search files" />
          </InputGroup>
          <Button
            size="sm"
            onClick={() => (reset(), setNav("downloads"), setPhase("scanning"))}
            disabled={phase === "scanning" || phase === "applying"}
          >
            {phase === "scanning" && <Spinner data-icon="inline-start" />}
            Organise
          </Button>
        </WindowToolbar>
      </WindowBar>
      <WindowBody>
        <SidebarProvider className="min-h-0 flex-1">
          <Sidebar collapsible="none" className="w-56">
            <SidebarHeader>
              <div className="flex h-8 items-center gap-2 px-2 text-sm font-medium">
                <ToolMark tool="butler" size={18} />
                Butler
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Folders</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "downloads"}
                        onClick={() => setNav("downloads")}
                      >
                        <FolderIcon />
                        <span>Downloads</span>
                        <SidebarMenuBadge>
                          <NumberRoll value={downloadsCount} />
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "desktop"}
                        onClick={() => setNav("desktop")}
                      >
                        <FolderIcon />
                        <span>Desktop</span>
                        <SidebarMenuBadge>9</SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "projects"}
                        onClick={() => setNav("projects")}
                      >
                        <FolderIcon />
                        <span>Projects</span>
                        <SidebarMenuBadge>
                          <span className="font-semibold text-destructive">
                            !
                          </span>
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Butler</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "rules"}
                        onClick={() => setNav("rules")}
                      >
                        <ListChecksIcon />
                        <span>House rules</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "history"}
                        onClick={() => setNav("history")}
                      >
                        <HistoryIcon />
                        <span>History</span>
                        <SidebarMenuBadge>{runs.length}</SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={nav === "settings"}
                        onClick={() => setNav("settings")}
                      >
                        <SettingsIcon />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                <ShieldCheckIcon className="size-3.5 shrink-0" />
                Nothing leaves this Mac
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            {nav === "downloads" && (
              <Downloads
                view={view}
                phase={phase}
                on={on}
                cursor={cursor}
                revised={revised}
                asking={asking}
                ask={ask}
                progress={progress}
                moves={moves}
                off={off}
                folders={folders}
                renames={renames}
                movedTotal={movedTotal}
                onAsk={setAsk}
                onSubmitAsk={() => ask.trim() && setAsking(true)}
                onToggle={toggle}
                onToggleGroup={toggleGroup}
                onCursor={setCursor}
                onApprove={approve}
                onReject={() => setPhase("rejected")}
                onNewPlan={() => (reset(), setPhase("scanning"))}
                onHistory={() => setNav("history")}
              />
            )}
            {nav === "desktop" && <Desktop />}
            {nav === "projects" && <Projects />}
            {nav === "rules" && <HouseRules />}
            {nav === "history" && (
              <History
                runs={runs}
                onUndo={(id) =>
                  setRuns((r) =>
                    r.map((x) => (x.id === id ? { ...x, undone: true } : x))
                  )
                }
              />
            )}
            {nav === "settings" && <Settings />}
          </SidebarInset>
        </SidebarProvider>
      </WindowBody>
    </Window>
  )
}

type DownloadsProps = {
  view: View
  phase: Phase
  on: Set<string>
  cursor: string
  revised: boolean
  asking: boolean
  ask: string
  progress: number
  moves: number
  off: number
  folders: number
  renames: number
  movedTotal: number
  onAsk: (s: string) => void
  onSubmitAsk: () => void
  onToggle: (id: string) => void
  onToggleGroup: (g: Group) => void
  onCursor: (id: string) => void
  onApprove: () => void
  onReject: () => void
  onNewPlan: () => void
  onHistory: () => void
}

function Downloads(p: DownloadsProps) {
  const {
    view,
    phase,
    on,
    cursor,
    revised,
    asking,
    progress,
    moves,
    off,
    folders,
    renames,
  } = p
  const movingNow = ALL_FILES.filter((f) => on.has(f.id) && !f.trash)[
    Math.min(progress, moves - 1)
  ]
  const plan = useMemo(
    () =>
      PLAN.map((g) =>
        g.id === "installers" && revised
          ? { ...g, dest: "Desktop/Installers", changed: true }
          : { ...g, changed: false }
      ),
    [revised]
  )

  const badge =
    phase === "scanning" ? (
      <Badge>Reading</Badge>
    ) : phase === "applying" ? (
      <Badge variant="tool">Moving</Badge>
    ) : phase === "done" ? (
      <Badge variant="success" dot>
        Tidy
      </Badge>
    ) : phase === "rejected" ? (
      <Badge>Discarded</Badge>
    ) : (
      <Badge variant="tool">
        <MotifDot size={8} land={false} />
        {view === "proposal"
          ? "Proposed"
          : view === "before"
            ? "Before"
            : "After"}
      </Badge>
    )

  const subtitle =
    phase === "scanning"
      ? "Reading names, dates and contents. Nothing moves yet."
      : revised && phase === "proposed"
        ? "Revised: installers stay on the Desktop, in their own folder."
        : phase === "done"
          ? `${p.movedTotal} files moved. Undo stays available for 30 days.`
          : `${moves} moves into ${folders} folders · ${renames} rename · ${off} excluded`

  return (
    <>
      <WindowHeader>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold tracking-tight">Downloads</h3>
            {badge}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="mt-2 hidden text-xs text-faint lg:block">
          <KbdGroup>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>move</span>
            <Kbd>space</Kbd>
            <span>toggle</span>
          </KbdGroup>
        </span>
      </WindowHeader>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {phase === "scanning" && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Motif state="running" progress={0.4} width={240} />
            <span className="text-sm text-muted-foreground">
              Reading 28 files in Downloads
            </span>
          </div>
        )}
        {(phase === "proposed" || phase === "applying") && (
          <Table variant="plain" density="compact">
            <TableHeader>
              <TableRow>
                <TableHead className="w-9" />
                <TableHead>Name</TableHead>
                <TableHead className="w-44">
                  {view === "before" ? "Where" : "To"}
                </TableHead>
                <TableHead className="w-16">Kind</TableHead>
                <TableHead variant="numeric" className="w-20">
                  Size
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.map((g) => {
                const onCount = g.files.filter((f) => on.has(f.id)).length
                const state =
                  onCount === 0
                    ? false
                    : onCount === g.files.length
                      ? true
                      : "indeterminate"
                return [
                  <TableRow key={g.id} variant="group">
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${g.dest}`}
                        checked={state === true}
                        indeterminate={state === "indeterminate"}
                        onCheckedChange={() => p.onToggleGroup(g)}
                        disabled={phase !== "proposed"}
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <span className="flex items-center gap-2">
                        {g.trash ? (
                          <Trash2Icon className="size-3.5" />
                        ) : (
                          <FolderIcon className="size-3.5" />
                        )}
                        <span className="font-semibold text-foreground">
                          {g.dest}
                        </span>
                        <span>{g.files.length} files</span>
                        {g.trash && (
                          <Badge variant="outline">Excluded by default</Badge>
                        )}
                        {g.changed && <Badge variant="tool">Changed</Badge>}
                      </span>
                    </TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>,
                  ...g.files.map((f) => {
                    const Icon = KIND_ICON[f.kind]
                    const checked = on.has(f.id)
                    const idx = ALL_FILES.findIndex((x) => x.id === f.id)
                    const moved =
                      phase === "applying" &&
                      checked &&
                      idx < movedIndex(on, progress)
                    return (
                      <TableRow
                        key={f.id}
                        data-state={cursor === f.id ? "selected" : undefined}
                        aria-disabled={!checked || undefined}
                        onClick={() => p.onCursor(f.id)}
                      >
                        <TableCell>
                          <Checkbox
                            aria-label={`Include ${f.name}`}
                            checked={checked}
                            onCheckedChange={() => p.onToggle(f.id)}
                            disabled={phase !== "proposed"}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                            {f.rename && view !== "before" ? (
                              <>
                                <span className="truncate text-muted-foreground line-through">
                                  {f.name}
                                </span>
                                <ArrowRightIcon className="size-3 shrink-0 text-faint" />
                                <span className="truncate">{f.rename}</span>
                              </>
                            ) : (
                              <span className="truncate">
                                {view === "after" && f.rename
                                  ? f.rename
                                  : f.name}
                              </span>
                            )}
                            {moved && <MotifDot size={8} />}
                          </span>
                        </TableCell>
                        <TableCell variant="mono" tone="muted">
                          {view === "before"
                            ? "~/Downloads"
                            : checked
                              ? `~/${g.dest}`
                              : "stays"}
                        </TableCell>
                        <TableCell variant="mono" tone="muted">
                          {f.kind}
                        </TableCell>
                        <TableCell variant="numeric" tone="muted">
                          {f.size}
                        </TableCell>
                      </TableRow>
                    )
                  }),
                ]
              })}
            </TableBody>
          </Table>
        )}
        {phase === "done" && (
          <div className="flex h-full items-center justify-center p-8">
            <Empty variant="plain">
              <EmptyHeader>
                <EmptyMedia variant="halftone">
                  <FolderOpenIcon />
                </EmptyMedia>
                <EmptyTitle>Downloads is tidy</EmptyTitle>
                <EmptyDescription>
                  {p.movedTotal} files moved into {folders} folders, {renames}{" "}
                  renamed. Undo stays available for 30 days.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row">
                <Button variant="outline" size="sm">
                  Show in Finder
                </Button>
                <Button variant="ghost" size="sm" onClick={p.onHistory}>
                  History
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
        {phase === "rejected" && (
          <div className="flex h-full items-center justify-center p-8">
            <Empty variant="plain">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Trash2Icon />
                </EmptyMedia>
                <EmptyTitle>Plan discarded</EmptyTitle>
                <EmptyDescription>
                  Nothing moved.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" onClick={p.onNewPlan}>
                  Make a new plan
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>

      {(phase === "proposed" || phase === "applying") && (
        <WindowFooter>
          {phase === "applying" ? (
            <Progress
              value={(progress / Math.max(1, moves)) * 100}
              className="w-full max-w-md"
            >
              <ProgressLabel>
                Moving {Math.min(progress + 1, moves)} of {moves} ·{" "}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {movingNow?.rename ?? movingNow?.name}
                </span>
              </ProgressLabel>
            </Progress>
          ) : (
            <>
              <span className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground">
                <NumberRoll value={moves} /> moves · <NumberRoll value={off} />{" "}
                excluded
              </span>
              <InputGroup className="ml-2 max-w-sm flex-1">
                <InputGroupAddon>
                  {asking ? <Spinner /> : <SparklesIcon />}
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Ask for changes… “keep installers on the Desktop”"
                  value={p.ask}
                  disabled={asking}
                  onChange={(e) => p.onAsk(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.stopPropagation(), p.onSubmitAsk())
                  }
                />
              </InputGroup>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={p.onReject}>
                  Reject
                </Button>
                <Button size="sm" onClick={p.onApprove} disabled={moves === 0}>
                  Approve
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>↵</Kbd>
                  </KbdGroup>
                </Button>
              </div>
            </>
          )}
        </WindowFooter>
      )}
    </>
  )
}

// Index in ALL_FILES of the file currently moving.
function movedIndex(on: Set<string>, progress: number) {
  let n = 0
  for (let i = 0; i < ALL_FILES.length; i++) {
    const f = ALL_FILES[i]
    if (on.has(f.id) && !f.trash) {
      if (n === progress) return i
      n++
    }
  }
  return ALL_FILES.length
}

function Desktop() {
  const [checking, setChecking] = useState(false)
  useLater(checking, 1200, () => setChecking(false))
  return (
    <>
      <WindowHeader>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold tracking-tight">Desktop</h3>
          <Badge variant="success" dot>
            Tidy
          </Badge>
        </div>
      </WindowHeader>
      <div className="flex flex-1 items-center justify-center p-8">
        <Empty variant="plain">
          <EmptyHeader>
            <EmptyMedia variant="halftone">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>Nothing to tidy</EmptyTitle>
            <EmptyDescription>
              9 files, all where your rules put them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChecking(true)}
              disabled={checking}
            >
              {checking && <Spinner data-icon="inline-start" />}
              Check again
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </>
  )
}

function Projects() {
  const [state, setState] = useState<"error" | "waiting" | "ok">("error")
  const [details, setDetails] = useState(false)
  useLater(state === "waiting", 1600, () => setState("ok"))
  return (
    <>
      <WindowHeader>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold tracking-tight">Projects</h3>
          {state === "error" && <Badge variant="destructive">No access</Badge>}
          {state === "waiting" && <Badge>Waiting</Badge>}
          {state === "ok" && (
            <Badge variant="success" dot>
              Tidy
            </Badge>
          )}
        </div>
      </WindowHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        {state === "error" && (
          <>
            <Motif state="error" width={240} size={10} />
            <div className="flex max-w-sm flex-col items-center gap-1 text-center">
              <span className="text-sm font-medium">
                Lost access to ~/Projects
              </span>
              <span className="text-sm text-muted-foreground">
                macOS revoked folder access after the last update.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setState("waiting")}>
                <LockIcon data-icon="inline-start" />
                Grant access
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetails((d) => !d)}
                aria-expanded={details}
              >
                Details
              </Button>
            </div>
            {details && (
              <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-xs leading-5 text-muted-foreground">
                {
                  "EPERM: operation not permitted\nscandir '/Users/serhii/Projects'\nTCC: kTCCServiceSystemPolicyDocumentsFolder"
                }
              </pre>
            )}
          </>
        )}
        {state === "waiting" && (
          <>
            <Motif state="stalled" progress={0.3} width={240} size={10} />
            <span className="text-sm text-muted-foreground">
              Waiting for macOS to grant access…
            </span>
          </>
        )}
        {state === "ok" && (
          <>
            <Motif state="done" width={240} size={10} />
            <span className="text-sm text-muted-foreground">
              Projects is back. 212 files, none out of place.
            </span>
          </>
        )}
      </div>
    </>
  )
}

const RULES = [
  {
    id: "invoices",
    name: "Invoices",
    rule: "PDFs that mention “invoice” go to Invoices/{year}",
    on: true,
  },
  {
    id: "screenshots",
    name: "Screenshots",
    rule: "Screen captures go to Screenshots",
    on: true,
  },
  {
    id: "installers",
    name: "Installers",
    rule: "Disk images older than 7 days go to Trash",
    on: false,
  },
  {
    id: "fresh",
    name: "Fresh files",
    rule: "Never touch anything modified today",
    on: true,
  },
]

function HouseRules() {
  const [rules, setRules] = useState(RULES)
  return (
    <>
      <WindowHeader>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">House rules</h3>
          <p className="text-xs text-muted-foreground">
            {rules.filter((r) => r.on).length} of {rules.length} rules on.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <PlusIcon data-icon="inline-start" />
          New rule
        </Button>
      </WindowHeader>
      <div className="flex-1 overflow-y-auto p-4">
        <ItemGroup variant="outline">
          {rules.map((r, i) => (
            <Fragment key={r.id}>
              {i > 0 && <ItemSeparator />}
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>{r.name}</ItemTitle>
                  <ItemDescription>{r.rule}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={r.on}
                    aria-label={`${r.name} rule`}
                    onCheckedChange={(v) =>
                      setRules((rs) =>
                        rs.map((x) => (x.id === r.id ? { ...x, on: v } : x))
                      )
                    }
                  />
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </div>
    </>
  )
}

function History({
  runs,
  onUndo,
}: {
  runs: {
    id: string
    when: string
    folder: string
    moves: number
    undone: boolean
  }[]
  onUndo: (id: string) => void
}) {
  return (
    <>
      <WindowHeader>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">History</h3>
          <p className="text-xs text-muted-foreground">
            Every run can be undone for 30 days.
          </p>
        </div>
      </WindowHeader>
      <div className="flex-1 overflow-y-auto">
        <Table variant="plain" density="compact">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">When</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead variant="numeric" className="w-24">
                Moves
              </TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((r) => (
              <TableRow key={r.id} aria-disabled={r.undone || undefined}>
                <TableCell variant="mono" tone="muted">
                  {r.when}
                </TableCell>
                <TableCell>{r.folder}</TableCell>
                <TableCell variant="numeric">{r.moves}</TableCell>
                <TableCell className="text-right">
                  {r.undone ? (
                    <Badge>Undone</Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onUndo(r.id)}
                    >
                      Undo
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function Settings() {
  const [engine, setEngine] = useState<"local" | "claude">("claude")
  const [watch, setWatch] = useState(true)
  return (
    <>
      <WindowHeader>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">Settings</h3>
          <p className="text-xs text-muted-foreground">
            Engine and folder watching.
          </p>
        </div>
      </WindowHeader>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
        <Field>
          <FieldLabel>Engine</FieldLabel>
          <ToggleGroup
            value={[engine]}
            onValueChange={(v: string[]) =>
              v[0] && setEngine(v[0] as "local" | "claude")
            }
            aria-label="Engine"
          >
            <ToggleGroupItem value="local">Local</ToggleGroupItem>
            <ToggleGroupItem value="claude">Claude</ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription>
            {engine === "local"
              ? "Qwen 3 on this Mac. Slower, never online."
              : "File names and sizes are sent; contents never are."}
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Switch
            checked={watch}
            onCheckedChange={setWatch}
            id="butler-watch"
          />
          <FieldLabel htmlFor="butler-watch">
            Watch folders and propose when they get messy
          </FieldLabel>
        </Field>
      </div>
    </>
  )
}
