import { Fragment, useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  MinusIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  Rows3Icon,
  Rows4Icon,
  SearchIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Motif } from "@/components/ui/motif"
import { NumberRoll } from "@/components/ui/number-roll"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Example, PageHeader, Section } from "./kit"

/* ---------------------------------------------------------------- data */

type File = { id: number; name: string; path: string; kind: string; size: number; at: string }
const FILES: File[] = [
  { id: 1, name: "invoice-0425.pdf", path: "~/Downloads", kind: "PDF", size: 182, at: "09:14" },
  { id: 2, name: "Screenshot 2026-10-01 at 08.52.11.png", path: "~/Desktop", kind: "Image", size: 2458, at: "08:52" },
  { id: 3, name: "setup-4.2.dmg", path: "~/Downloads", kind: "Disk image", size: 90112, at: "08:40" },
  { id: 4, name: "notes.txt", path: "~/Desktop", kind: "Text", size: 4, at: "Yesterday" },
  { id: 5, name: "contract-final-v3.pdf", path: "~/Downloads/Contracts", kind: "PDF", size: 640, at: "Yesterday" },
  { id: 6, name: "IMG_4471.heic", path: "~/Pictures/Import", kind: "Image", size: 3891, at: "Mon" },
  { id: 7, name: "export-2026-09.csv", path: "~/Downloads", kind: "Data", size: 311, at: "Mon" },
  { id: 8, name: "glu-backup.sqlite", path: "~/Library/glu", kind: "Database", size: 24576, at: "Sun" },
]

type Invoice = { id: string; client: string; issued: string; amount: number; delta: number; status: "paid" | "open" | "overdue" }
const INVOICES: Invoice[] = [
  { id: "INV-0425", client: "Haldane Labs", issued: "2026-09-28", amount: 4800, delta: 0, status: "open" },
  { id: "INV-0424", client: "Marrow & Co", issued: "2026-09-21", amount: 1250, delta: -12.5, status: "paid" },
  { id: "INV-0423", client: "Studio Pell", issued: "2026-09-14", amount: 9600, delta: 33.3, status: "paid" },
  { id: "INV-0422", client: "Northgate", issued: "2026-08-30", amount: 2400, delta: 0, status: "overdue" },
  { id: "INV-0421", client: "Haldane Labs", issued: "2026-08-28", amount: 4800, delta: 6.7, status: "paid" },
]

type Person = { name: string; email: string; role: string; status: "active" | "invited" | "suspended"; seen: string }
const PEOPLE: Person[] = [
  { name: "Ines Okafor", email: "ines@haldane.dev", role: "Owner", status: "active", seen: "2 min ago" },
  { name: "Teodor Lind", email: "teodor@haldane.dev", role: "Editor", status: "active", seen: "1 h ago" },
  { name: "Mireille Dubois", email: "mireille@pell.studio", role: "Viewer", status: "invited", seen: "Never" },
  { name: "Kenji Sato", email: "k.sato@northgate.io", role: "Editor", status: "suspended", seen: "3 weeks ago" },
  { name: "Ana Ribeiro", email: "ana@marrow.co", role: "Viewer", status: "active", seen: "Yesterday" },
]

type Run = { id: string; day: string; task: string; model: string; tokens: number; dur: number; status: "done" | "running" | "failed" | "queued"; steps: string[] }
const RUNS: Run[] = [
  { id: "run_8f21", day: "Today", task: "Tidy Downloads into folders", model: "local 8B", tokens: 1840, dur: 6.2, status: "running", steps: ["scan 212 files", "propose 9 moves", "await approval"] },
  { id: "run_8f1e", day: "Today", task: "Rename screenshots by content", model: "local 8B", tokens: 3920, dur: 14.8, status: "done", steps: ["read 31 images", "name 31 files", "moved 31"] },
  { id: "run_8f1a", day: "Today", task: "Summarise glucose week", model: "cloud", tokens: 12480, dur: 22.1, status: "done", steps: ["fetch 14 d", "compute TIR", "write note"] },
  { id: "run_8e97", day: "Yesterday", task: "Archive invoices older than 2 y", model: "local 8B", tokens: 960, dur: 3.4, status: "failed", steps: ["scan 40 files", "permission denied: ~/Documents/Tax"] },
  { id: "run_8e90", day: "Yesterday", task: "Dedupe photo import", model: "local 8B", tokens: 7700, dur: 41.0, status: "done", steps: ["hash 1 204 files", "found 86 duplicates", "trashed 86"] },
  { id: "run_8e88", day: "Yesterday", task: "Draft reply to accountant", model: "cloud", tokens: 2210, dur: 0, status: "queued", steps: [] },
]

type Log = { t: string; level: "info" | "warn" | "error"; src: string; msg: string }
const LOGS: Log[] = [
  { t: "09:14:02.118", level: "info", src: "watcher", msg: "~/Downloads changed (1 added)" },
  { t: "09:14:02.131", level: "info", src: "classify", msg: "invoice-0425.pdf → Invoices (0.96)" },
  { t: "09:14:02.140", level: "info", src: "plan", msg: "move 1 file, 0 renames" },
  { t: "09:14:02.402", level: "warn", src: "fs", msg: "target exists, appending suffix (2)" },
  { t: "09:14:02.410", level: "info", src: "fs", msg: "moved invoice-0425 (2).pdf" },
  { t: "09:14:03.009", level: "error", src: "index", msg: "EACCES ~/Documents/Tax, skipped" },
  { t: "09:14:03.011", level: "info", src: "watcher", msg: "idle, next check 18:00" },
]

/* ---------------------------------------------------------------- helpers */

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} GB` : n >= 1024 ? `${(n / 1024).toFixed(n >= 10240 ? 0 : 1)} MB` : `${n} KB`)
const eur = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")

function Unit({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground"> {children}</span>
}

function Delta({ v }: { v: number }) {
  if (v === 0) return <span className="text-muted-foreground">—</span>
  const up = v > 0
  return (
    <span data-dir={up ? "up" : "down"} className="inline-flex items-center gap-1 data-[dir=down]:text-destructive data-[dir=up]:text-success">
      {up ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
      {Math.abs(v).toFixed(1)}%
    </span>
  )
}

const STATUS: Record<string, { variant: "outline" | "secondary" | "destructive"; icon?: ReactNode; word: string }> = {
  paid: { variant: "outline", icon: <CheckIcon />, word: "Paid" },
  open: { variant: "secondary", word: "Open" },
  overdue: { variant: "destructive", word: "Overdue" },
  active: { variant: "outline", icon: <CheckIcon />, word: "Active" },
  invited: { variant: "secondary", word: "Invited" },
  suspended: { variant: "destructive", icon: <MinusIcon />, word: "Suspended" },
  done: { variant: "outline", icon: <CheckIcon />, word: "Done" },
  running: { variant: "secondary", icon: <Spinner />, word: "Running" },
  failed: { variant: "destructive", icon: <XIcon />, word: "Failed" },
  queued: { variant: "secondary", word: "Queued" },
}

function Status({ k }: { k: string }) {
  const s = STATUS[k]
  return (
    <Badge variant={s.variant}>
      {s.icon}
      {s.word}
    </Badge>
  )
}

type Dir = "asc" | "desc" | null
type Sort<K extends string> = { key: K; dir: Dir }

// aria-sort on the cell drives the colour.
function SortHead<K extends string>({ k, sort, onSort, numeric, children }: { k: K; sort: Sort<K>; onSort: (s: Sort<K>) => void; numeric?: boolean; children: ReactNode }) {
  const on = sort.key === k ? sort.dir : null
  const next = (): Sort<K> => (on === null ? { key: k, dir: "asc" } : on === "asc" ? { key: k, dir: "desc" } : { key: k, dir: null })
  return (
    <TableHead variant={numeric ? "numeric" : "default"} aria-sort={on === "asc" ? "ascending" : on === "desc" ? "descending" : "none"}>
      <Button variant="ghost" size="xs" onClick={() => onSort(next())}>
        {children}
        {on === "asc" ? <ArrowUpIcon data-icon="inline-end" /> : on === "desc" ? <ArrowDownIcon data-icon="inline-end" /> : <ChevronsUpDownIcon data-icon="inline-end" />}
      </Button>
    </TableHead>
  )
}

function sortBy<T>(rows: T[], key: keyof T | null, dir: Dir): T[] {
  if (!key || !dir) return rows
  const out = [...rows].sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))
  })
  return dir === "desc" ? out.reverse() : out
}

/* ---------------------------------------------------------------- examples */

function Anatomy() {
  const [sel, setSel] = useState(1)
  return (
    <Section title="Anatomy" note="Click a row to select it.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Where</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead variant="numeric">Size</TableHead>
              <TableHead variant="numeric">Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FILES.slice(0, 5).map((f, i) => (
              <TableRow key={f.id} data-state={i === sel ? "selected" : undefined} onClick={() => setSel(i)}>
                <TableCell className="max-w-56 truncate" title={f.name}>
                  {f.name}
                </TableCell>
                <TableCell variant="mono">{f.path}</TableCell>
                <TableCell variant="muted">{f.kind}</TableCell>
                <TableCell variant="numeric">{kb(f.size)}</TableCell>
                <TableCell variant="numeric">{f.at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

function Financial() {
  const total = INVOICES.reduce((a, r) => a + r.amount, 0)
  const open = INVOICES.filter((r) => r.status !== "paid").reduce((a, r) => a + r.amount, 0)
  return (
    <Section title="Numbers and totals" note="Totals live in the footer.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead variant="numeric">Issued</TableHead>
              <TableHead variant="numeric">Amount</TableHead>
              <TableHead variant="numeric">vs last</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((r) => (
              <TableRow key={r.id}>
                <TableCell variant="mono">{r.id}</TableCell>
                <TableCell>{r.client}</TableCell>
                <TableCell variant="numeric" tone="muted">
                  {r.issued}
                </TableCell>
                <TableCell variant="numeric">
                  {eur(r.amount)}
                  <Unit>EUR</Unit>
                </TableCell>
                <TableCell variant="numeric">
                  <Delta v={r.delta} />
                </TableCell>
                <TableCell>
                  <Status k={r.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                Total <span className="font-normal text-muted-foreground">{INVOICES.length} invoices</span>
              </TableCell>
              <TableCell variant="numeric">
                {eur(total)}
                <Unit>EUR</Unit>
              </TableCell>
              <TableCell variant="numeric" tone="muted" colSpan={2} className="font-normal">
                {eur(open)} EUR outstanding
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Example>
    </Section>
  )
}

function People() {
  return (
    <Section title="People and actions" note="Row actions are quiet icon buttons in the last column.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead variant="numeric">Last seen</TableHead>
              <TableHead className="w-28">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PEOPLE.map((p) => (
              <TableRow key={p.email}>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell variant="muted">{p.role}</TableCell>
                <TableCell>
                  <Status k={p.status} />
                </TableCell>
                <TableCell variant="numeric" tone="muted">
                  {p.seen}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-xs" aria-label="Edit role">
                      <PencilIcon />
                    </Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Copy email">
                      <CopyIcon />
                    </Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Remove">
                      <Trash2Icon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

type FileKey = "name" | "kind" | "size" | "at"
function Selection() {
  const [sort, setSort] = useState<Sort<FileKey>>({ key: "size", dir: "desc" })
  const [on, setOn] = useState<Set<number>>(() => new Set([2, 6]))
  const rows = useMemo(() => sortBy(FILES, sort.dir ? sort.key : null, sort.dir), [sort])
  const all = on.size === FILES.length
  const toggle = (ids: number[], v: boolean) =>
    setOn((prev) => {
      const n = new Set(prev)
      ids.forEach((id) => (v ? n.add(id) : n.delete(id)))
      return n
    })
  return (
    <Section title="Selection and sorting" note="Headers cycle ascending, descending, off.">
      <Example align="stretch">
        <div className="flex flex-col gap-4">
          {on.size > 0 ? (
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm">
              <span className="font-medium">{on.size} selected</span>
              <span className="text-muted-foreground">of {FILES.length}</span>
              <div className="flex-1" />
              <Button variant="outline" size="sm">
                <FolderIcon data-icon="inline-start" /> Move
              </Button>
              <Button variant="outline" size="sm">
                <ArchiveIcon data-icon="inline-start" /> Archive
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2Icon data-icon="inline-start" /> Trash
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Clear selection" onClick={() => setOn(new Set())}>
                <XIcon />
              </Button>
            </div>
          ) : (
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm">
              <span className="text-muted-foreground">{FILES.length} files</span>
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground">Sorted by {sort.dir ? `${sort.key} ${sort.dir}` : "none"}</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox aria-label="All files" checked={all} indeterminate={on.size > 0 && !all} onCheckedChange={(v) => toggle(FILES.map((f) => f.id), v)} />
                </TableHead>
                <SortHead k="name" sort={sort} onSort={setSort}>
                  Name
                </SortHead>
                <TableHead>Path</TableHead>
                <SortHead k="kind" sort={sort} onSort={setSort}>
                  Kind
                </SortHead>
                <SortHead k="size" sort={sort} onSort={setSort} numeric>
                  Size
                </SortHead>
                <SortHead k="at" sort={sort} onSort={setSort} numeric>
                  Modified
                </SortHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((f) => (
                <TableRow key={f.id} data-state={on.has(f.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox aria-label={f.name} checked={on.has(f.id)} onCheckedChange={(v) => toggle([f.id], v)} />
                  </TableCell>
                  <TableCell className="max-w-56 truncate" title={f.name}>
                    {f.name}
                  </TableCell>
                  <TableCell variant="mono">{f.path}</TableCell>
                  <TableCell variant="muted">{f.kind}</TableCell>
                  <TableCell variant="numeric">{kb(f.size)}</TableCell>
                  <TableCell variant="numeric" tone="muted">
                    {f.at}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Example>
    </Section>
  )
}

function Grouped() {
  const [open, setOpen] = useState<string | null>("run_8e97")
  const days = [...new Set(RUNS.map((r) => r.day))]
  return (
    <Section title="Grouped and expandable" note="Click a run for its steps.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Model</TableHead>
              <TableHead variant="numeric">Tokens</TableHead>
              <TableHead variant="numeric">Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((d) => (
              <Fragment key={d}>
                <TableRow variant="group">
                  <TableCell colSpan={6} className="h-8">
                    {d} <span className="font-normal">{RUNS.filter((r) => r.day === d).length}</span>
                  </TableCell>
                </TableRow>
                {RUNS.filter((r) => r.day === d).map((r) => {
                  const isOpen = open === r.id
                  return (
                    <Fragment key={r.id}>
                      <TableRow aria-expanded={isOpen} aria-disabled={r.status === "queued" || undefined} onClick={() => setOpen(isOpen ? null : r.id)}>
                        <TableCell variant="mono">
                          <span className="inline-flex items-center gap-2">
                            <ChevronRightIcon data-open={isOpen} className="size-3 text-muted-foreground transition-transform data-[open=true]:rotate-90" />
                            {r.id}
                          </span>
                        </TableCell>
                        <TableCell>{r.task}</TableCell>
                        <TableCell variant="muted">{r.model}</TableCell>
                        <TableCell variant="numeric">{r.tokens.toLocaleString("en-US")}</TableCell>
                        <TableCell variant="numeric">
                          {r.dur ? (
                            <>
                              {r.dur.toFixed(1)}
                              <Unit>s</Unit>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Status k={r.status} />
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow variant="detail">
                          <TableCell colSpan={6} className="py-3 pl-12 whitespace-normal">
                            <ol className="flex list-decimal flex-col gap-1 pl-4 text-sm text-muted-foreground">
                              {r.steps.map((s, i) => (
                                <li key={i} data-bad={r.status === "failed" && i === r.steps.length - 1} className="data-[bad=true]:text-destructive">
                                  {s}
                                </li>
                              ))}
                              {r.steps.length === 0 && <li>Waiting for a free slot</li>}
                            </ol>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

function DenseLog() {
  return (
    <Section title="Dense log" note="Compact density for logs and audit trails.">
      <Example align="stretch">
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LOGS.map((l, i) => (
              <TableRow key={i}>
                <TableCell variant="mono" tone="muted">
                  {l.t}
                </TableCell>
                <TableCell variant="mono">
                  <span data-level={l.level} className="data-[level=error]:text-destructive data-[level=info]:text-muted-foreground data-[level=warn]:text-warning">
                    {l.level}
                  </span>
                </TableCell>
                <TableCell variant="muted">{l.src}</TableCell>
                <TableCell variant="mono" className="w-full">
                  {l.msg}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

function ThreeHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Kind</TableHead>
        <TableHead variant="numeric">Size</TableHead>
      </TableRow>
    </TableHeader>
  )
}

function States() {
  const [q, setQ] = useState("dmgx")
  const hits = FILES.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <Section title="Empty, loading and filtered" note="The header stays so the columns keep their place.">
      <Example align="stretch">
        <div className="grid gap-4 md:grid-cols-2">
          <Table>
            <ThreeHead />
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="h-48 text-center whitespace-normal">
                  <div className="flex flex-col items-center gap-1">
                    <FolderIcon className="mb-2 size-5 text-muted-foreground" />
                    <span className="font-medium">Nothing to tidy</span>
                    <span className="text-sm text-muted-foreground">Downloads is already in order. Butler checks again at 18:00.</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table aria-busy>
            <ThreeHead />
            <TableBody>
              {[0, 1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton data-row={i} className="h-4 w-32 data-[row=1]:w-24 data-[row=2]:w-36 data-[row=3]:w-28 data-[row=4]:w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  <TableCell variant="numeric">
                    <Skeleton className="ml-auto h-4 w-10" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <ThreeHead />
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="h-48 text-center whitespace-normal">
                  <div className="flex flex-col items-center gap-1">
                    <XIcon className="mb-2 size-5 text-destructive" />
                    <span className="font-medium">Couldn’t read ~/Downloads</span>
                    <span className="text-sm text-muted-foreground">Butler needs Files and Folders access in System Settings.</span>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">Open settings</Button>
                      <Button variant="outline" size="sm">
                        Retry
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex flex-col gap-4">
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter files"
                aria-label="Filter files"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
              <span className="text-xs text-muted-foreground">
                {hits.length} of {FILES.length}
              </span>
            </div>
            <Table>
              <ThreeHead />
              <TableBody>
                {hits.slice(0, 4).map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="max-w-40 truncate">{f.name}</TableCell>
                    <TableCell variant="muted">{f.kind}</TableCell>
                    <TableCell variant="numeric">{kb(f.size)}</TableCell>
                  </TableRow>
                ))}
                {hits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center whitespace-normal">
                      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          No file matches <span className="font-mono text-foreground">“{q}”</span>
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setQ("")}>
                          Clear filter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Example>
    </Section>
  )
}

function Properties() {
  const f = FILES[2]
  const rows: [string, ReactNode][] = [
    ["Name", f.name],
    ["Kind", f.kind],
    ["Size", <>{kb(f.size)} <span className="text-muted-foreground">(92,274,688 bytes)</span></>],
    ["Where", <span className="font-mono">{f.path}</span>],
    ["Created", "2026-10-01 08:40"],
    ["Modified", "2026-10-01 08:40"],
    ["Proposed", <span className="inline-flex items-center gap-2"><span className="font-mono">~/Downloads/Installers</span><Badge variant="secondary">Review</Badge></span>],
  ]
  return (
    <Section title="Properties" note="The key column is a header cell, so values line up down one edge.">
      <Example align="stretch">
        <div className="max-w-xl">
          <Table>
            <TableBody>
              {rows.map(([k, v]) => (
                <TableRow key={k}>
                  <TableHead scope="row" className="w-32">
                    {k}
                  </TableHead>
                  <TableCell>{v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Example>
    </Section>
  )
}

function LongText() {
  const rules = [
    { name: "Invoices", match: "~/Downloads/**/*{invoice,receipt}*.pdf", note: "Matched by invoice or receipt in the name, then by a date on the first page." },
    { name: "Installers", match: "~/Downloads/*.{dmg,pkg}", note: "Disk images and packages. Kept 30 days, then offered for trash." },
    { name: "Screenshots", match: "~/Desktop/Screenshot *.png", note: "Renamed by what is on them." },
  ]
  return (
    <Section title="Long text" note="Patterns truncate with the full text on hover; notes wrap.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Pattern</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="w-32 py-3 align-top font-medium">{r.name}</TableCell>
                <TableCell variant="mono" className="max-w-48 truncate py-3 align-top" title={r.match}>
                  {r.match}
                </TableCell>
                <TableCell variant="muted" className="py-3 align-top whitespace-normal">
                  {r.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

function Density() {
  const rows = FILES.slice(0, 4)
  return (
    <Section title="Density" note="Default rows are 40px; compact rows are 32px.">
      <Example align="stretch">
        <div className="grid gap-4 md:grid-cols-2">
          {(["default", "compact"] as const).map((d) => (
            <Table key={d} density={d}>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead variant="numeric">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="max-w-48 truncate">{f.name}</TableCell>
                    <TableCell variant="numeric">{kb(f.size)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
        </div>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- shared visuals */

function Sparkline({ values, w = 64, h = 20, tone = "faint" }: { values: number[]; w?: number; h?: number; tone?: "faint" | "foreground" }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * (w - 2) + 1},${h - 1 - ((v - min) / (max - min || 1)) * (h - 2)}`).join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block shrink-0 overflow-visible">
      <polyline points={pts} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={tone === "faint" ? "stroke-faint" : "stroke-foreground"} />
    </svg>
  )
}

function Bar({ p }: { p: number }) {
  return (
    <span className="inline-flex w-16 items-center gap-2">
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-fill-active">
        <span className="block h-full w-(--w) rounded-full bg-primary" style={{ "--w": `${Math.round(p * 100)}%` } as CSSProperties} />
      </span>
    </span>
  )
}

function Heat({ v, children }: { v: number; children: ReactNode }) {
  const low = v < RANGE.lo
  const step = low ? 0 : Math.min(4, Math.max(0, Math.round(((v - RANGE.lo) / (RANGE.max - RANGE.lo)) * 6)))
  return (
    <span
      data-step={step}
      data-low={low || undefined}
      className="flex h-7 min-w-10 items-center justify-center rounded-sm text-xs tabular-nums text-foreground data-[step=1]:bg-tool/15 data-[step=2]:bg-tool/30 data-[step=3]:bg-tool/50 data-[step=3]:text-tool-foreground data-[step=4]:bg-tool data-[step=4]:text-tool-foreground data-low:bg-destructive-subtle data-low:text-destructive"
    >
      {children}
    </span>
  )
}

const RANGE = { lo: 3.9, hi: 10, max: 15 }

/* ---------------------------------------------------------------- data grid */

type Doc = { id: number; name: string; kind: string; owner: string; size: number; at: string; tags: string[]; status: "filed" | "review" | "new" }
const KINDS = ["PDF", "Image", "Disk image", "Data", "Text", "Database"] as const
const OWNERS = ["Ines Okafor", "Teodor Lind", "Mireille Dubois", "Kenji Sato", "Ana Ribeiro"]
const NAMES = ["invoice", "receipt", "Screenshot", "setup", "export", "notes", "contract", "backup", "scan", "statement"]
const TAGS = ["tax", "client", "personal", "2026", "keep", "shared"]
const DOCS: Doc[] = Array.from({ length: 37 }, (_, i) => {
  const kind = KINDS[(i * 7) % KINDS.length]
  const ext = kind === "PDF" ? "pdf" : kind === "Image" ? "png" : kind === "Disk image" ? "dmg" : kind === "Data" ? "csv" : kind === "Text" ? "txt" : "sqlite"
  return {
    id: i + 1,
    name: `${NAMES[(i * 3) % NAMES.length]}-${String(425 - i).padStart(4, "0")}.${ext}`,
    kind,
    owner: OWNERS[(i * 3 + Math.floor(i / 5)) % OWNERS.length],
    size: Math.round([182, 2458, 90112, 311, 4, 24576, 640, 3891][(i * 11) % 8] * (1 + ((i * 37) % 100) / 100)),
    at: ["09:14", "08:52", "Yesterday", "Mon", "Sun", "Sep 24", "Sep 19"][(i * 13) % 7],
    tags: [TAGS[i % TAGS.length], ...(i % 3 === 0 ? [TAGS[(i + 2) % TAGS.length]] : [])],
    status: (["filed", "review", "new"] as const)[(i * 17) % 3],
  }
})

type DocKey = "name" | "kind" | "owner" | "size" | "at"
const COLUMNS: { key: DocKey | "tags" | "status"; label: string; numeric?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "kind", label: "Kind" },
  { key: "owner", label: "Owner" },
  { key: "tags", label: "Tags" },
  { key: "status", label: "Status" },
  { key: "size", label: "Size", numeric: true },
  { key: "at", label: "Modified", numeric: true },
]

function DataGrid() {
  const [q, setQ] = useState("")
  const [kinds, setKinds] = useState<string[]>([])
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(["owner", "tags"]))
  const [density, setDensity] = useState<"default" | "compact">("default")
  const [sort, setSort] = useState<Sort<DocKey>>({ key: "size", dir: "desc" })
  const [page, setPage] = useState(0)
  const [sel, setSel] = useState<Set<number>>(() => new Set())
  const per = density === "compact" ? 10 : 8

  const rows = useMemo(() => {
    const hit = DOCS.filter((d) => (!q || d.name.toLowerCase().includes(q.toLowerCase())) && (kinds.length === 0 || kinds.includes(d.kind)))
    return sortBy(hit, sort.dir ? sort.key : null, sort.dir)
  }, [q, kinds, sort])
  const pages = Math.max(1, Math.ceil(rows.length / per))
  const cur = Math.min(page, pages - 1)
  const view = rows.slice(cur * per, cur * per + per)
  const cols = COLUMNS.filter((c) => !hidden.has(c.key))
  const allOnPage = view.length > 0 && view.every((d) => sel.has(d.id))

  const toggle = (ids: number[], v: boolean) =>
    setSel((prev) => {
      const n = new Set(prev)
      ids.forEach((id) => (v ? n.add(id) : n.delete(id)))
      return n
    })
  const toggleKind = (k: string) => {
    setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]))
    setPage(0)
  }

  return (
    <Section
      title="Data grid"
      note="Search, filter chips, column menu and density toggle in one toolbar."
    >
      <Example align="stretch">
        <div className="relative flex w-full flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup className="w-56">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search files"
                aria-label="Search files"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(0)
                }}
              />
              {q && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="icon-xs" aria-label="Clear" onClick={() => setQ("")}>
                    <XIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            <div className="flex flex-wrap items-center gap-1">
              {KINDS.map((k) => (
                <Toggle key={k} size="sm" variant="outline" pressed={kinds.includes(k)} onPressedChange={() => toggleKind(k)} aria-label={`Filter ${k}`}>
                  {kinds.includes(k) && <CheckIcon data-icon="inline-start" />}
                  {k}
                </Toggle>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                  <Columns3Icon data-icon="inline-start" />
                  Columns
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                  {COLUMNS.filter((c) => c.key !== "name").map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.key}
                      checked={!hidden.has(c.key)}
                      onCheckedChange={(v) =>
                        setHidden((h) => {
                          const n = new Set(h)
                          if (v) n.delete(c.key)
                          else n.add(c.key)
                          return n
                        })
                      }
                    >
                      {c.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ToggleGroup
                size="sm"
                value={[density]}
                onValueChange={(v) => {
                  const next = v[0] as "default" | "compact" | undefined
                  if (next) setDensity(next)
                }}
                aria-label="Density"
              >
                <ToggleGroupItem value="default" aria-label="Comfortable rows">
                  <Rows3Icon />
                </ToggleGroupItem>
                <ToggleGroupItem value="compact" aria-label="Compact rows">
                  <Rows4Icon />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Table density={density}>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox aria-label="Select page" checked={allOnPage} indeterminate={!allOnPage && view.some((d) => sel.has(d.id))} onCheckedChange={(v) => toggle(view.map((d) => d.id), v)} />
                </TableHead>
                {cols.map((c) =>
                  c.key === "tags" || c.key === "status" ? (
                    <TableHead key={c.key}>{c.label}</TableHead>
                  ) : (
                    <SortHead key={c.key} k={c.key} sort={sort} onSort={setSort} numeric={c.numeric}>
                      {c.label}
                    </SortHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody key={`${cur}-${sort.key}-${sort.dir}-${q}-${kinds.join()}`}>
              {view.map((d) => (
                <TableRow key={d.id} data-state={sel.has(d.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox aria-label={d.name} checked={sel.has(d.id)} onCheckedChange={(v) => toggle([d.id], v)} />
                  </TableCell>
                  {cols.map((c) => {
                    switch (c.key) {
                      case "name":
                        return (
                          <TableCell key={c.key} className="max-w-56 truncate font-medium" title={d.name}>
                            {d.name}
                          </TableCell>
                        )
                      case "kind":
                        return (
                          <TableCell key={c.key} variant="muted">
                            {d.kind}
                          </TableCell>
                        )
                      case "owner":
                        return (
                          <TableCell key={c.key}>
                            <span className="inline-flex items-center gap-2">
                              <Avatar size="sm">
                                <AvatarFallback>{initials(d.owner)}</AvatarFallback>
                              </Avatar>
                              {d.owner}
                            </span>
                          </TableCell>
                        )
                      case "tags":
                        return (
                          <TableCell key={c.key}>
                            <span className="inline-flex gap-1">
                              {d.tags.map((t) => (
                                <Badge key={t} variant="outline">
                                  {t}
                                </Badge>
                              ))}
                            </span>
                          </TableCell>
                        )
                      case "status":
                        return (
                          <TableCell key={c.key}>
                            <Badge variant={d.status === "review" ? "warning" : d.status === "new" ? "tool" : "outline"} dot={d.status !== "filed"}>
                              {d.status === "filed" ? "Filed" : d.status === "review" ? "Needs review" : "New"}
                            </Badge>
                          </TableCell>
                        )
                      case "size":
                        return (
                          <TableCell key={c.key} variant="numeric">
                            {kb(d.size)}
                          </TableCell>
                        )
                      case "at":
                        return (
                          <TableCell key={c.key} variant="numeric" tone="muted">
                            {d.at}
                          </TableCell>
                        )
                    }
                  })}
                </TableRow>
              ))}
              {view.length === 0 && (
                <TableRow>
                  <TableCell colSpan={cols.length + 1} className="h-24 text-center whitespace-normal">
                    <span className="text-sm text-muted-foreground">
                      No file matches <span className="font-mono text-foreground">“{q}”</span>
                      {kinds.length > 0 && ` in ${kinds.join(", ")}`}
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={cols.length + 1} className="h-10 py-0 font-normal">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {rows.length === 0 ? "0" : `${cur * per + 1}–${Math.min(rows.length, (cur + 1) * per)}`} of {rows.length}
                      {rows.length !== DOCS.length && ` (${DOCS.length} total)`}
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="icon-xs" aria-label="Previous page" disabled={cur === 0} onClick={() => setPage(cur - 1)}>
                        <ChevronLeftIcon />
                      </Button>
                      <span className="min-w-16 text-center tabular-nums">
                        Page {cur + 1} of {pages}
                      </span>
                      <Button variant="ghost" size="icon-xs" aria-label="Next page" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>
                        <ChevronRightIcon />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {sel.size > 0 && (
            <div className="absolute inset-x-0 bottom-14 flex justify-center">
              <div className="flex h-10 animate-enter items-center gap-2 rounded-lg border border-card-border bg-popover px-2 pl-3 text-sm shadow-lg">
                <span className="font-medium tabular-nums">{sel.size} selected</span>
                <Separator orientation="vertical" className="mx-1 h-5" />
                <Button variant="ghost" size="sm">
                  <FolderIcon data-icon="inline-start" /> Move
                </Button>
                <Button variant="ghost" size="sm">
                  <TagIcon data-icon="inline-start" /> Tag
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2Icon data-icon="inline-start" /> Trash
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="Clear selection" onClick={() => setSel(new Set())}>
                  <XIcon />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- in-cell visuals */

type Job = { name: string; tool: string; owners: string[]; share: number; latency: number[]; p: number; state: "running" | "done" | "error" | "stalled" }
const JOBS: Job[] = [
  { name: "Tidy Downloads", tool: "Butler", owners: ["Ines Okafor"], share: 0.62, latency: [1.2, 1.1, 1.4, 1.0, 0.9, 1.3, 1.1], p: 0.72, state: "running" },
  { name: "Sync glucose", tool: "glu", owners: ["Ines Okafor", "Teodor Lind"], share: 0.18, latency: [0.4, 0.5, 0.4, 0.6, 0.4, 0.4, 0.5], p: 1, state: "done" },
  { name: "Recovery pull", tool: "strap", owners: ["Teodor Lind"], share: 0.11, latency: [2.1, 2.4, 2.2, 3.8, 2.3, 2.0, 2.2], p: 1, state: "done" },
  { name: "Export board", tool: "Easel", owners: ["Mireille Dubois", "Kenji Sato", "Ana Ribeiro"], share: 0.06, latency: [5.1, 4.8, 6.2, 5.5, 7.1, 6.8, 9.4], p: 0.58, state: "error" },
  { name: "Render preview", tool: "Vellum", owners: ["Ana Ribeiro"], share: 0.03, latency: [0.8, 0.8, 0.9, 0.8, 0.8, 0.9, 0.8], p: 0.31, state: "stalled" },
]

function Visuals() {
  return (
    <Section
      title="In-cell visuals"
      note="Each mark carries its figure in text."
    >
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Owners</TableHead>
              <TableHead>Share of runs</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {JOBS.map((j) => (
              <TableRow key={j.name}>
                <TableCell className="font-medium">{j.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <span
                      data-tool={j.tool.toLowerCase()}
                      aria-hidden
                      className="size-2 rounded-full data-[tool=butler]:bg-family-butler data-[tool=easel]:bg-family-easel data-[tool=glu]:bg-family-glu data-[tool=strap]:bg-family-strap data-[tool=vellum]:bg-family-vellum"
                    />
                    {j.tool}
                  </span>
                </TableCell>
                <TableCell>
                  <AvatarGroup>
                    {j.owners.slice(0, 2).map((o) => (
                      <Avatar key={o} size="sm">
                        <AvatarFallback>{initials(o)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {j.owners.length > 2 && <AvatarGroupCount>+{j.owners.length - 2}</AvatarGroupCount>}
                  </AvatarGroup>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-3">
                    <Bar p={j.share} />
                    <span className="w-9 text-right tabular-nums">{Math.round(j.share * 100)}%</span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-3">
                    <Sparkline values={j.latency} w={48} h={16} />
                    <span className="tabular-nums">
                      {j.latency[j.latency.length - 1].toFixed(1)}
                      <Unit>s</Unit>
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-3">
                    <Motif width={56} size={6} progress={j.p} state={j.state} />
                    <span data-state={j.state} className="w-12 text-xs text-muted-foreground data-[state=error]:text-destructive data-[state=stalled]:text-warning">
                      {j.state === "running" ? `${Math.round(j.p * 100)}%` : j.state === "done" ? "Done" : j.state === "error" ? "Failed" : "Stalled"}
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- sticky and pinned */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const METRICS = ["Files filed", "Renames", "Moves undone", "Rules fired", "Review queue", "Minutes saved", "Runs", "Failures", "Duplicates found", "Disk freed (MB)", "Screenshots named", "Invoices filed", "Installers trashed", "Receipts matched"]
const SERIES = METRICS.map((m, r) => ({ metric: m, values: MONTHS.map((_, c) => Math.round((Math.sin(r * 3.1 + c * 0.9) + 1.2) * (r % 4 === 3 ? 4 : 60) * (1 + c / 12))) }))

function Pinned() {
  const [edge, setEdge] = useState({ x: false, y: false })
  return (
    <Section
      title="Sticky header, pinned column"
      note="A raw table in its own scroll box: a sticky header needs the scroll container to own the height."
    >
      <Example align="stretch">
        <div
          className="max-h-72 w-full overflow-auto rounded-lg border border-card-border bg-card text-sm tabular-nums"
          onScroll={(e) => {
            const el = e.currentTarget
            setEdge({ x: el.scrollLeft > 0, y: el.scrollTop > 0 })
          }}
        >
          <table className="w-max min-w-full caption-bottom">
            <TableHeader>
              <TableRow>
                <GridHead pinned edge={edge}>
                  Metric
                </GridHead>
                {MONTHS.map((m) => (
                  <GridHead key={m} edge={edge}>
                    {m} 2026
                  </GridHead>
                ))}
                <GridHead edge={edge}>Total</GridHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SERIES.map((s) => (
                <TableRow key={s.metric}>
                  <PinnedCell edge={edge.x}>{s.metric}</PinnedCell>
                  {s.values.map((v, i) => (
                    <TableCell key={i} variant="numeric">
                      {v.toLocaleString("en-US")}
                    </TableCell>
                  ))}
                  <TableCell variant="numeric" className="font-medium">
                    {s.values.reduce((a, b) => a + b, 0).toLocaleString("en-US")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </Example>
    </Section>
  )
}

// Sticky cells need their own surface and a rule on the scrolled edge; declared once here, not per cell.
function GridHead({ pinned, edge, children }: { pinned?: boolean; edge: { x: boolean; y: boolean }; children: ReactNode }) {
  return (
    <TableHead
      variant={pinned ? "default" : "numeric"}
      data-pinned={pinned || undefined}
      data-x={(pinned && edge.x) || undefined}
      data-y={edge.y || undefined}
      // eslint-disable-next-line shadcn/no-restyle, shadcn/no-arbitrary-values -- sticky grid header: own surface plus a scroll-edge rule (DESIGN.md, Approved exceptions)
      className="sticky top-0 z-10 min-w-20 bg-muted transition-shadow data-pinned:left-0 data-pinned:z-20 data-pinned:min-w-44 data-y:shadow-[0_1px_0_0_var(--border-strong)] data-x:shadow-[1px_0_0_0_var(--border-strong)] data-x:data-y:shadow-[1px_0_0_0_var(--border-strong),0_1px_0_0_var(--border-strong)]"
    >
      {children}
    </TableHead>
  )
}
function PinnedCell({ edge, children }: { edge: boolean; children: ReactNode }) {
  return (
    <TableCell
      data-x={edge || undefined}
      // eslint-disable-next-line shadcn/no-restyle, shadcn/no-arbitrary-values -- pinned column: own surface plus a scroll-edge rule (DESIGN.md, Approved exceptions)
      className="sticky left-0 z-10 bg-card font-medium transition-shadow data-x:shadow-[1px_0_0_0_var(--border-strong)]"
    >
      {children}
    </TableCell>
  )
}

/* ---------------------------------------------------------------- inline editing */

type Rule = { id: number; name: string; dest: string; on: boolean; hits: number }
const RULES_INIT: Rule[] = [
  { id: 1, name: "Invoices", dest: "~/Documents/Invoices/2026", on: true, hits: 212 },
  { id: 2, name: "Screenshots", dest: "~/Pictures/Screenshots", on: true, hits: 1204 },
  { id: 3, name: "Installers", dest: "~/Downloads/Installers", on: false, hits: 48 },
  { id: 4, name: "Receipts", dest: "~/Documents/Receipts", on: true, hits: 97 },
]

function Editing() {
  const [rules, setRules] = useState(RULES_INIT)
  const [edit, setEdit] = useState<{ id: number; field: "name" | "dest" } | null>(null)
  const [saved, setSaved] = useState<number | null>(null)
  const update = (id: number, patch: Partial<Rule>) => setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const commit = (id: number, field: "name" | "dest", value: string) => {
    const prev = rules.find((r) => r.id === id)?.[field]
    if (value.trim() && value !== prev) {
      update(id, { [field]: value.trim() })
      setSaved(id)
    }
    setEdit(null)
  }
  return (
    <Section
      title="Inline editing"
      note="Double-click a cell to edit it; Enter saves, Escape cancels."
    >
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Rule</TableHead>
              <TableHead>Moves to</TableHead>
              <TableHead variant="numeric">Matched</TableHead>
              <TableHead className="w-20">On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((r) => (
              <TableRow key={`${r.id}-${saved === r.id ? "saved" : ""}`} flash={saved === r.id} onAnimationEnd={() => saved === r.id && setSaved(null)}>
                <EditableCell editing={edit?.id === r.id && edit.field === "name"} value={r.name} onStart={() => setEdit({ id: r.id, field: "name" })} onCommit={(v) => commit(r.id, "name", v)} onCancel={() => setEdit(null)} className="font-medium" />
                <EditableCell editing={edit?.id === r.id && edit.field === "dest"} value={r.dest} onStart={() => setEdit({ id: r.id, field: "dest" })} onCommit={(v) => commit(r.id, "dest", v)} onCancel={() => setEdit(null)} mono />
                <TableCell variant="numeric">{r.hits.toLocaleString("en-US")}</TableCell>
                <TableCell>
                  <Switch size="sm" checked={r.on} onCheckedChange={(v) => update(r.id, { on: v })} aria-label={`${r.name} on`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

function EditableCell({ editing, value, onStart, onCommit, onCancel, mono, className }: { editing: boolean; value: string; onStart: () => void; onCommit: (v: string) => void; onCancel: () => void; mono?: boolean; className?: string }) {
  const [draft, setDraft] = useState(value)
  return (
    <TableCell variant={mono ? "mono" : "default"} className={cn("group/cell py-1", className)} onDoubleClick={onStart}>
      {editing ? (
        <Input
          autoFocus
          aria-label="Edit value"
          defaultValue={value}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setDraft(value)}
          onBlur={(e) => onCommit(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit(draft)
            if (e.key === "Escape") onCancel()
          }}
          className="h-7"
        />
      ) : (
        <span className="inline-flex h-7 w-full items-center gap-2">
          <span className="truncate">{value}</span>
          <span className="ml-auto opacity-0 transition-opacity group-hover/cell:opacity-100 focus-within:opacity-100">
            <Button variant="ghost" size="icon-xs" aria-label="Edit" onClick={onStart}>
              <PencilIcon />
            </Button>
          </span>
        </span>
      )}
    </TableCell>
  )
}

/* ---------------------------------------------------------------- tree */

type Node = { name: string; kind: string; size: number; count?: number; children?: Node[] }
const TREE: Node[] = [
  {
    name: "Downloads",
    kind: "Folder",
    size: 118_400,
    count: 212,
    children: [
      {
        name: "Installers",
        kind: "Folder",
        size: 93_900,
        count: 4,
        children: [
          { name: "setup-4.2.dmg", kind: "Disk image", size: 90_112 },
          { name: "Postgres-17.dmg", kind: "Disk image", size: 3_788 },
        ],
      },
      {
        name: "Contracts",
        kind: "Folder",
        size: 1_920,
        count: 3,
        children: [
          { name: "contract-final-v3.pdf", kind: "PDF", size: 640 },
          { name: "contract-final-v2.pdf", kind: "PDF", size: 638 },
          { name: "nda-haldane.pdf", kind: "PDF", size: 642 },
        ],
      },
      { name: "invoice-0425.pdf", kind: "PDF", size: 182 },
      { name: "export-2026-09.csv", kind: "Data", size: 311 },
    ],
  },
  {
    name: "Desktop",
    kind: "Folder",
    size: 6_353,
    count: 12,
    children: [
      { name: "Screenshot 2026-10-01 at 08.52.11.png", kind: "Image", size: 2_458 },
      { name: "IMG_4471.heic", kind: "Image", size: 3_891 },
      { name: "notes.txt", kind: "Text", size: 4 },
    ],
  },
]

function Tree() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["Downloads", "Downloads/Installers"]))
  const toggle = (p: string) =>
    setOpen((o) => {
      const n = new Set(o)
      if (n.has(p)) n.delete(p)
      else n.add(p)
      return n
    })
  const flat: { node: Node; depth: number; path: string; open: boolean }[] = []
  const walk = (nodes: Node[], depth: number, parent: string) => {
    for (const node of nodes) {
      const path = parent ? `${parent}/${node.name}` : node.name
      const isOpen = open.has(path)
      flat.push({ node, depth, path, open: isOpen })
      if (node.children && isOpen) walk(node.children, depth + 1, path)
    }
  }
  walk(TREE, 0, "")
  return (
    <Section title="Tree" note="Folder sizes are the sum of their contents.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead variant="numeric">Items</TableHead>
              <TableHead variant="numeric">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flat.map((r) => (
              <TableRow key={r.path} aria-expanded={r.node.children ? r.open : undefined} onClick={() => r.node.children && toggle(r.path)}>
                <TableCell data-depth={r.depth} className="data-[depth=1]:pl-8 data-[depth=2]:pl-12 data-[depth=3]:pl-16">
                  <span className="inline-flex items-center gap-2">
                    {r.node.children ? (
                      <ChevronRightIcon data-open={r.open} className="size-3 text-muted-foreground transition-transform data-[open=true]:rotate-90" />
                    ) : (
                      <span className="size-3" />
                    )}
                    {r.node.children ? <FolderIcon className="size-4 text-faint" /> : <FileIcon className="size-4 text-faint" />}
                    <span className="max-w-64 truncate">{r.node.name}</span>
                  </span>
                </TableCell>
                <TableCell variant="muted">{r.node.kind}</TableCell>
                <TableCell variant="numeric" tone="muted" className="font-mono text-xs">
                  {r.node.count ?? ""}
                </TableCell>
                <TableCell variant="numeric">{kb(r.node.size)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- pivot */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOURS = ["00", "03", "06", "09", "12", "15", "18", "21"]
const GLUCOSE = WEEKDAYS.map((_, d) => HOURS.map((_, h) => +(6.4 + Math.sin(d * 1.7 + h * 0.9) * 1.6 + (h === 3 || h === 6 ? 2.4 : 0) - (d === 2 && h === 2 ? 3.6 : 0) + (d % 3) * 0.3).toFixed(1)))

function Pivot() {
  const tir = (row: number[]) => Math.round((row.filter((v) => v >= RANGE.lo && v <= RANGE.hi).length / row.length) * 100)
  return (
    <Section
      title="Pivot"
      note="Weekday by hour, each cell a mean glucose reading."
    >
      <Example align="stretch">
        <Table density="compact">
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              {HOURS.map((h) => (
                <TableHead key={h} variant="numeric" className="text-center">
                  {h}:00
                </TableHead>
              ))}
              <TableHead variant="numeric">TIR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GLUCOSE.map((row, d) => (
              <TableRow key={d}>
                <TableCell variant="muted">{WEEKDAYS[d]}</TableCell>
                {row.map((v, h) => (
                  <TableCell key={h} className="px-1 py-0.5">
                    <Heat v={v}>{v.toFixed(1)}</Heat>
                  </TableCell>
                ))}
                <TableCell variant="numeric">
                  <span data-ok={tir(row) >= 70} className="data-[ok=false]:text-warning">
                    {tir(row)}
                    <Unit>%</Unit>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>TIR</TableCell>
              {HOURS.map((_, h) => (
                <TableCell key={h} variant="numeric" className="text-center">
                  {tir(GLUCOSE.map((r) => r[h]))}
                  <Unit>%</Unit>
                </TableCell>
              ))}
              <TableCell variant="numeric">
                {tir(GLUCOSE.flat())}
                <Unit>%</Unit>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- live */

type Watch = { path: string; events: number; rate: number; last: string; hist: number[] }
const WATCH_INIT: Watch[] = [
  { path: "~/Downloads", events: 1_284, rate: 3.2, last: "now", hist: [2, 3, 4, 3, 5, 4, 3] },
  { path: "~/Desktop", events: 412, rate: 0.8, last: "4 s", hist: [1, 1, 2, 1, 0, 1, 1] },
  { path: "~/Pictures/Import", events: 96, rate: 0.1, last: "2 min", hist: [0, 0, 1, 0, 0, 0, 0] },
  { path: "~/Documents/Invoices", events: 2_013, rate: 1.4, last: "11 s", hist: [1, 2, 1, 2, 1, 2, 1] },
]

function Live() {
  const [rows, setRows] = useState(WATCH_INIT)
  const [hot, setHot] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setTick((t) => t + 1)
      const i = [0, 0, 3, 1, 0, 3, 2][Math.floor(Date.now() / 1000) % 7]
      setRows((rs) =>
        rs.map((r, k) => {
          if (k !== i) return r
          const add = 1 + Math.floor((Math.sin(Date.now() / 700) + 1) * 3)
          return { ...r, events: r.events + add, rate: +(r.rate * 0.8 + add * 0.25).toFixed(1), last: "now", hist: [...r.hist.slice(1), add] }
        })
      )
      setHot(rows[i].path)
    }, 1800)
    return () => window.clearInterval(id)
  }, [paused, rows])
  const total = rows.reduce((a, r) => a + r.events, 0)
  return (
    <Section title="Live" note="A changed row flashes once and its count rolls.">
      <Example align="stretch">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex size-2">
              {!paused && <span className="absolute inline-flex size-full animate-ping rounded-full bg-tool opacity-60" />}
              <span className="relative inline-flex size-2 rounded-full bg-tool" />
            </span>
            <span className="text-muted-foreground">{paused ? "Paused" : "Watching"}</span>
            <span className="text-xs text-faint tabular-nums">{tick} updates</span>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setPaused((p) => !p)}>
              {paused ? <PlayIcon data-icon="inline-start" /> : <PauseIcon data-icon="inline-start" />}
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folder</TableHead>
                <TableHead>Last minute</TableHead>
                <TableHead variant="numeric">Events</TableHead>
                <TableHead variant="numeric">Rate</TableHead>
                <TableHead variant="numeric">Last</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody stagger={false}>
              {rows.map((r) => (
                <TableRow key={`${r.path}-${hot === r.path ? r.events : ""}`} flash={hot === r.path}>
                  <TableCell variant="mono">{r.path}</TableCell>
                  <TableCell>
                    <Sparkline values={r.hist} w={56} h={16} />
                  </TableCell>
                  <TableCell variant="numeric">
                    <NumberRoll value={r.events} />
                  </TableCell>
                  <TableCell variant="numeric">
                    <NumberRoll value={r.rate.toFixed(1)} />
                    <Unit>/min</Unit>
                  </TableCell>
                  <TableCell variant="numeric" tone="muted">
                    {r.last}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell variant="numeric">
                  <NumberRoll value={total} />
                </TableCell>
                <TableCell variant="numeric" colSpan={2} tone="muted" className="font-normal">
                  {rows.reduce((a, r) => a + r.rate, 0).toFixed(1)} /min
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- long list */

const ROW_H = 32
const LONG = Array.from({ length: 2_000 }, (_, i) => ({
  id: `evt_${(0x9a00 + i).toString(16)}`,
  t: `${String(Math.floor(i / 120)).padStart(2, "0")}:${String(Math.floor(i / 2) % 60).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
  src: ["watcher", "classify", "plan", "fs", "index"][i % 5],
  msg: ["changed (1 added)", "→ Invoices (0.96)", "move 1 file", "moved", "indexed 1 file", "skipped, exists"][(i * 3) % 6],
}))

function LongList() {
  const [top, setTop] = useState(0)
  const H = 288
  const first = Math.max(0, Math.floor(top / ROW_H) - 4)
  const count = Math.ceil(H / ROW_H) + 8
  const slice = LONG.slice(first, first + count)
  return (
    <Section
      title="Long list"
      note={`${LONG.length.toLocaleString("en-US")} rows in a ScrollArea; only the rows in view render.`}
    >
      <Example align="stretch">
        <ScrollArea variant="outline" className="h-72" onScrollCapture={(e) => setTop((e.target as HTMLElement).scrollTop)}>
          <Table variant="plain" density="compact">
            <TableBody stagger={false}>
              <tr aria-hidden style={{ "--h": `${first * ROW_H}px` } as CSSProperties} className="h-(--h)" />
              {slice.map((l) => (
                <TableRow key={l.id}>
                  <TableCell variant="mono" tone="muted" className="w-24">
                    {l.t}
                  </TableCell>
                  <TableCell variant="mono" className="w-28">
                    {l.id}
                  </TableCell>
                  <TableCell variant="muted" className="w-24">
                    {l.src}
                  </TableCell>
                  <TableCell variant="mono" className="w-full">
                    {l.msg}
                  </TableCell>
                </TableRow>
              ))}
              <tr aria-hidden style={{ "--h": `${Math.max(0, LONG.length - first - slice.length) * ROW_H}px` } as CSSProperties} className="h-(--h)" />
            </TableBody>
          </Table>
        </ScrollArea>
        <p className="text-xs text-muted-foreground tabular-nums">
          Rows {first + 1}–{first + slice.length} rendered · scrolled {Math.round((top / ((LONG.length - count) * ROW_H)) * 100)}%
        </p>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- comparison */

const PLANS = ["Local", "Sync", "Team"] as const
const FEATURES: { name: string; note?: string; v: (boolean | string)[] }[] = [
  { name: "Watched folders", v: ["3", "Unlimited", "Unlimited"] },
  { name: "Rules", v: ["10", "Unlimited", "Unlimited"] },
  { name: "Local 8B model", v: [true, true, true] },
  { name: "Cloud model for hard cases", note: "Only the file name and first page leave the machine.", v: [false, true, true] },
  { name: "Undo window", v: ["7 days", "30 days", "90 days"] },
  { name: "Shared rules", v: [false, false, true] },
  { name: "Audit log", v: [false, "30 days", "1 year"] },
  { name: "Price", v: ["Free", "€4 / mo", "€9 / seat"] },
]

function Comparison() {
  return (
    <Section title="Comparison" note="The recommended column is marked in the header.">
      <Example align="stretch">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Feature</TableHead>
              {PLANS.map((p) => (
                <TableHead key={p} className="w-36">
                  <span className="inline-flex items-center gap-2">
                    {p}
                    {p === "Sync" && <Badge variant="tool">Recommended</Badge>}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {FEATURES.map((f) => (
              <TableRow key={f.name}>
                <TableCell className="py-2 whitespace-normal">
                  <span className="font-medium">{f.name}</span>
                  {f.note && <span className="block text-xs text-muted-foreground">{f.note}</span>}
                </TableCell>
                {f.v.map((v, i) => (
                  <TableCell key={i} data-rec={PLANS[i] === "Sync" || undefined} className="data-rec:font-medium">
                    {v === true ? (
                      <span className="inline-flex items-center gap-1.5 text-success">
                        <CheckIcon className="size-3.5" />
                        <span className="sr-only">Yes</span>
                      </span>
                    ) : v === false ? (
                      <span className="inline-flex items-center gap-1.5 text-faint">
                        <MinusIcon className="size-3.5" />
                        <span className="sr-only">No</span>
                      </span>
                    ) : (
                      v
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- keyboard */

function Keyboard() {
  const [focus, setFocus] = useState(0)
  const [sel, setSel] = useState<Set<number>>(() => new Set([2]))
  const rows = FILES.slice(0, 6)
  const onKey = (e: KeyboardEvent<HTMLTableSectionElement>) => {
    const i = Number((e.target as HTMLElement).dataset.index)
    if (Number.isNaN(i)) return
    const move = (n: number) => {
      e.preventDefault()
      const next = Math.max(0, Math.min(rows.length - 1, n))
      setFocus(next)
      ;(e.currentTarget.querySelector(`[data-index="${next}"]`) as HTMLElement | null)?.focus()
    }
    if (e.key === "ArrowDown") move(i + 1)
    else if (e.key === "ArrowUp") move(i - 1)
    else if (e.key === "Home") move(0)
    else if (e.key === "End") move(rows.length - 1)
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      setSel((s) => {
        const n = new Set(s)
        if (n.has(i)) n.delete(i)
        else n.add(i)
        return n
      })
    }
  }
  return (
    <Section
      title="Keyboard rows"
      note="One tab stop lands on the current row; arrows move, Home and End jump, Space or Enter toggles."
    >
      <Example align="stretch">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            move
            <KbdGroup>
              <Kbd>Space</Kbd>
            </KbdGroup>
            select
            <KbdGroup>
              <Kbd>Home</Kbd>
              <Kbd>End</Kbd>
            </KbdGroup>
            jump
            <span className="ml-auto tabular-nums">
              {sel.size} selected · row {focus + 1}
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <span className="sr-only">Selected</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead variant="numeric">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody onKeyDown={onKey}>
              {rows.map((f, i) => (
                <TableRow
                  key={f.id}
                  data-index={i}
                  tabIndex={i === focus ? 0 : -1}
                  aria-selected={sel.has(i)}
                  data-state={sel.has(i) ? "selected" : undefined}
                  onFocus={() => setFocus(i)}
                  onClick={() =>
                    setSel((s) => {
                      const n = new Set(s)
                      if (n.has(i)) n.delete(i)
                      else n.add(i)
                      return n
                    })
                  }
                >
                  <TableCell>
                    <span className="flex size-4 items-center justify-center text-tool-text">{sel.has(i) && <CheckIcon className="size-3.5" />}</span>
                  </TableCell>
                  <TableCell className="max-w-64 truncate">{f.name}</TableCell>
                  <TableCell variant="muted">{f.kind}</TableCell>
                  <TableCell variant="numeric">{kb(f.size)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Example>
    </Section>
  )
}

/* ---------------------------------------------------------------- page */

export default function TablesPage() {
  return (
    <>
      <PageHeader group="Examples" title="Tables">
        Tables compare many items on the same columns.
      </PageHeader>
      <Anatomy />
      <DataGrid />
      <Visuals />
      <Financial />
      <Pinned />
      <Selection />
      <Editing />
      <Grouped />
      <Tree />
      <Pivot />
      <Live />
      <LongList />
      <DenseLog />
      <Comparison />
      <Keyboard />
      <People />
      <States />
      <Properties />
      <LongText />
      <Density />
    </>
  )
}
