import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDownIcon, FolderIcon, RotateCcwIcon, Trash2Icon, Undo2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CopyButton } from "@/components/ui/copy-button"
import { DotField } from "@/components/ui/dot-field"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { HoldButton } from "@/components/ui/hold-button"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Motif } from "@/components/ui/motif"
import { NumberRoll } from "@/components/ui/number-roll"
import { ScrollArea, ScrollAreaHeader } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono, TokenTable } from "./shared"

const DUR = 220

function useTween(target: number, ms: number) {
  const [v, setV] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    const a = cur.current
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const p = ms > 0 ? Math.min(1, (t - start) / ms) : 1
      cur.current = a + (target - a) * (1 - (1 - p) ** 4)
      setV(cur.current)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

function useJob(stops: [at: number, v: number][], run: number) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!run) return
    const ids = [setTimeout(() => setP(0), 0), ...stops.map(([at, v]) => setTimeout(() => setP(v), at))]
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])
  return p
}

export default function Page() {
  const [tick, setTick] = useState(0)
  return (
    <>
      <PageHeader group="Foundations" title="Motion">
        One duration, 220 ms, and one curve. Every other timing is a multiple. The motif is one ink line with one tool dot at the tip.
      </PageHeader>

      <Section title="Tokens" note="Defined in globals.css. Pages do not set durations.">
        <TokenTable
          rows={[
            ["transition-*", "220 ms, cubic-bezier(0.2, 0, 0, 1). Default for colour, border, shadow and transform."],
            ["ease-standard · ease-pop · ease-out-quart", "The curve; overshoot for a landing; settle for tweens."],
            ["animate-enter · animate-exit", "Surfaces fade and scale from .96 in 220 ms; out in 154 ms (0.7 dur)."],
            ["animate-draw", "A path with pathLength=1 draws over 880 ms (4 dur)."],
            ["animate-pop", "The dot lands: scale 0 → 1 with overshoot, 352 ms (1.6 dur)."],
            ["animate-fall", "The dot falls off a broken line, 660 ms (3 dur), linear."],
            ["animate-breathe", "Stall: opacity and scale breathe, 1.98 s (9 dur), looped."],
            ["animate-rise", "A row arrives: 4px up and fade, 264 ms (1.2 dur). Rows stagger 28 ms."],
            ["animate-flash", "A changed row fills tool-subtle and fades over 1.4 s."],
            ["animate-matrix", "The 5×5 loader."],
            ["active:translate-y-px active:scale-[0.99]", "Press: the control moves down 1px."],
          ]}
        />
      </Section>

      <Section title="Principles">
        <Bullets
          items={[
            <>
              <b className="font-medium text-foreground">One line, one dot.</b> Progress: the dot rides the tip. Done: the line draws, the dot lands. Error: the line breaks, the dot falls. Stall: the dot breathes.
            </>,
            <>
              <b className="font-medium text-foreground">Multiples of one beat.</b> 220 ms is the unit. Landings take 1.6, draws 4, falls 3, breathing 9.
            </>,
            <>
              <b className="font-medium text-foreground">The leading edge moves first.</b> The trailing edge follows 0.35 dur later. Tabs and list markers do this.
            </>,
            <>
              <b className="font-medium text-foreground">Keyboard is instant.</b> Arrow keys switch tabs without the slide. A menu opened with Enter appears without growing.
            </>,
            <>
              <b className="font-medium text-foreground">Exits are faster than entrances</b> (0.7 dur). Reduced motion sets every animation to 1 ms; state is kept.
            </>,
          ]}
        />
      </Section>

      <Section
        title="Signature"
        note="Each cell is the real component. Replay re-mounts it."
      >
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setTick((t) => t + 1)}>
            <RotateCcwIcon data-icon="inline-start" />
            Replay all
          </Button>
        </div>
        <Grid>
          <Cell title="Done" note="The line draws, then the dot lands." tick={tick} play={(k) => <Done key={k} />} />
          <Cell title="Error" note="The line breaks and the dot falls." tick={tick} play={(k) => <Fail key={k} />} />
          <Cell title="Copy" note="The dot confirms the copy.">
            <Copy />
          </Cell>
          <Cell title="Press" note="The control moves down 1px while pressed.">
            <div className="flex items-center gap-2">
              <Button>Apply plan</Button>
              <Button variant="outline">Preview</Button>
              <Button variant="outline" size="icon" aria-label="Undo">
                <Undo2Icon />
              </Button>
            </div>
          </Cell>
          <Cell title="Toggle" note="The thumb travels. The check draws after the box fills.">
            <Toggles />
          </Cell>
          <Cell title="Tabs" note="The leading edge moves first. Arrow keys switch instantly.">
            <Tabs defaultValue="plan">
              <TabsList variant="line">
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="moves">Moves</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>
            </Tabs>
          </Cell>
          <Cell title="Hover and select" note="A ghost marker follows the pointer and returns to the selection.">
            <Rows />
          </Cell>
          <Cell title="Focus" note="A 2px ring, offset from the control. Tab into the field.">
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Input placeholder="Filter files" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </div>
            </div>
          </Cell>
          <Cell title="Menu" note="Click: the menu grows from its trigger. Enter or Space: it appears.">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                Sort by
                <ChevronDownIcon data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Name</DropdownMenuItem>
                <DropdownMenuItem>Date added</DropdownMenuItem>
                <DropdownMenuItem>Size</DropdownMenuItem>
                <DropdownMenuItem>Kind</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Cell>
          <Cell title="Toast" note="The motif line counts down. Hover pauses it.">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast("26 files moved", {
                  description: "Undo stays available for 30 days.",
                  action: { label: "Undo", onClick: () => {} },
                })
              }
            >
              Move 26 files
            </Button>
          </Cell>
          <Cell title="Number" note="Only changed digits roll. The line follows the value.">
            <Count />
          </Cell>
          <Cell title="List enter" note="Rows arrive in order, 28 ms apart." tick={tick} play={(k) => <Stagger key={k} />} />
          <Cell title="Row change" note="The changed row flashes the tool tint.">
            <Flash />
          </Cell>
        </Grid>
      </Section>

      <Section title="Dots" note="The dotted backdrop reacts, then is still.">
        <Grid>
          <Cell
            title="Dots become the line"
            note="On done, a row of dots merges into the line and the dot lands."
            tick={tick}
            play={(k) => <DotField key={k} mode="line" />}
          />
          <Cell title="Ripple" note="One wave from the click point. Click anywhere.">
            <DotField mode="ripple">
              <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Apply plan</Button>
            </DotField>
          </Cell>
          <Cell title="Lens" note="Dots near the pointer grow toward ink.">
            <DotField mode="lens" />
          </Cell>
          <Cell
            title="Empty state"
            note="The backdrop draws the tool icon, then the dot."
            tick={tick}
            play={(k) => <DotField key={k} mode="halftone" />}
          />
          <Cell title="Drop target" note="Drag the file. Dots lean toward the zone.">
            <DotField mode="drop" />
          </Cell>
          <Cell title="Loader" note="The matrix for pages; the ring for buttons and inline text.">
            <div className="flex items-center gap-8">
              <Spinner variant="matrix" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner />
                Reading 1,204 files
              </div>
            </div>
          </Cell>
        </Grid>
      </Section>

      <Section title="Details">
        <Grid>
          <Cell title="Button becomes progress" note="The button becomes the line. The dot rides the tip, then lands.">
            <Morph />
          </Cell>
          <Cell title="Hold to confirm" note="Release early and the line retracts. Space also works.">
            <HoldButton doneLabel="Deleted 26 files">
              <Trash2Icon data-icon="inline-start" />
              Hold to delete 26 files
            </HoldButton>
          </Cell>
          <Cell
            title="Stall"
            note="After 2 s without progress, the dot breathes."
            tick={tick}
            play={(k) => <Stall key={k} />}
          />
          <Cell title="Field error" note="Submit the typo. The line breaks and the dot falls. Typing resets it.">
            <FieldErr />
          </Cell>
          <Cell title="Scroll edge" note="The header rule appears when content scrolls under it.">
            <ScrollArea variant="outline" className="h-28 w-full max-w-xs">
              <ScrollAreaHeader>9 moves</ScrollAreaHeader>
              <div className="flex flex-col">
                {["Invoices", "Screenshots", "Installers", "Archives", "Receipts", "Wallpapers", "Exports", "Fonts", "Recordings"].map(
                  (x) => (
                    <div key={x} className="truncate px-3 py-1 text-sm">
                      {x} <span className="text-faint">→ Documents</span>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </Cell>
        </Grid>
      </Section>

      <Section title="Rules">
        <Bullets
          items={[
            <>
              Use the utilities: <Mono>animate-enter</Mono> for surfaces, <Mono>animate-rise</Mono> for rows, <Mono>animate-pop</Mono> for a landing. Add new timings to globals.css as multiples of 220 ms.
            </>,
            <>Pages do not set durations or delays. If a page needs a new motion, add a prop to the component.</>,
            <>Only loaders and the stall breath loop. On page load, only rows animate.</>,
          ]}
        />
      </Section>
    </>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function Cell({
  title,
  note,
  children,
  tick = 0,
  play,
}: {
  title: string
  note: string
  children?: ReactNode
  tick?: number
  play?: (key: number) => ReactNode
}) {
  const [n, setN] = useState(0)
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-card-border bg-card p-4 shadow-md">
      <div className="flex h-7 items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {play && (
          <Button variant="ghost" size="xs" onClick={() => setN((x) => x + 1)}>
            <RotateCcwIcon data-icon="inline-start" />
            Replay
          </Button>
        )}
      </div>
      <div className="flex min-h-24 flex-col justify-center">{play ? play(tick * 1000 + n) : children}</div>
      <span className="text-xs text-muted-foreground">{note}</span>
    </section>
  )
}

function Done() {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-medium">Plan ready · 9 moves</span>
      <Motif state="done" width={200} size={11} />
    </div>
  )
}

function Fail() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-destructive">Lost access to ~/Downloads</span>
      <Motif state="error" width={200} size={11} />
    </div>
  )
}

function Copy() {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted py-2 pr-2 pl-3 font-mono text-xs shadow-well">
      <code className="min-w-0 flex-1 truncate">
        <span className="text-faint">$ </span>brew install butler
      </code>
      <CopyButton text="brew install butler" variant="ghost" />
    </div>
  )
}

function Toggles() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Switch id="mo-watch" defaultChecked />
        <Label htmlFor="mo-watch">Watch the folder</Label>
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id="mo-hidden" />
        <Label htmlFor="mo-hidden">Skip hidden files</Label>
      </div>
    </div>
  )
}

function Rows() {
  const rows = ["Invoices", "Screenshots", "Installers", "Archives"]
  const [on, setOn] = useState(1)
  return (
    <ItemGroup className="gap-0.5">
      {rows.map((r) => (
        <Item
          key={r}
          size="xs"
          role="option"
          aria-selected={rows[on] === r}
          render={<a href="#motion-rows" onClick={(e) => (e.preventDefault(), setOn(rows.indexOf(r)))} />}
        >
          <ItemMedia>
            <FolderIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{r}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}

function Count() {
  const [value, setValue] = useState(1204)
  const p = useTween(Math.min(0.999, (value - 900) / 600), DUR * 2)
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline gap-2">
        <NumberRoll value={value} variant="figure" />
        <span className="font-mono text-xs text-faint">files</span>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setValue((v) => {
              const n = v + Math.round(4 + Math.random() * 40)
              return n > 1490 ? n - 380 : n
            })
          }
        >
          Rescan
        </Button>
      </div>
      <Motif state="running" progress={p} width={200} size={9} />
    </div>
  )
}

const MOVES = [
  ["Invoices", "Documents/Invoices"],
  ["Screenshots", "Pictures/2026"],
  ["Installers", "Trash"],
  ["Archives", "Documents/Archive"],
]

function Stagger() {
  return (
    <Table variant="plain" density="compact">
      <TableBody>
        {MOVES.map(([from, to], i) => (
          <TableRow key={from}>
            <TableCell variant="mono" tone="muted" className="w-8">
              {String(i + 1).padStart(2, "0")}
            </TableCell>
            <TableCell>{from}</TableCell>
            <TableCell tone="muted">→ {to}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Flash() {
  const [sizes, setSizes] = useState([212, 48, 1204])
  const [hot, setHot] = useState<number | null>(null)
  const names = ["Downloads", "Desktop", "Pictures"]
  const bump = () => {
    const i = Math.floor(Math.random() * 3)
    setSizes((s) => s.map((v, j) => (j === i ? v + Math.round(1 + Math.random() * 9) : v)))
    setHot(i)
  }
  return (
    <div className="flex flex-col gap-2">
      <Table variant="plain" density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Folder</TableHead>
            <TableHead variant="numeric">Files</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody stagger={false}>
          {names.map((n, i) => (
            <TableRow key={hot === i ? `${n}-${sizes[i]}` : n} flash={hot === i}>
              <TableCell>{n}</TableCell>
              <TableCell variant="numeric">{sizes[i].toLocaleString("en-US")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <Button variant="outline" size="sm" onClick={bump}>
          Rescan
        </Button>
      </div>
    </div>
  )
}

const MORPH_JOB: [number, number][] = [
  [300, 0.18],
  [700, 0.34],
  [1100, 0.52],
  [1300, 0.61],
  [1900, 0.83],
  [2300, 1],
]

function Morph() {
  const [run, setRun] = useState(0)
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle")
  const target = useJob(MORPH_JOB, run)
  const p = useTween(target, DUR * 2)
  useEffect(() => {
    if (phase !== "run" || target < 1) return
    const t = setTimeout(() => setPhase("done"), DUR * 2)
    return () => clearTimeout(t)
  }, [target, phase])
  useEffect(() => {
    if (phase !== "done") return
    const t = setTimeout(() => setPhase("idle"), 1400 + DUR * 2)
    return () => clearTimeout(t)
  }, [phase])
  return (
    <div className="relative flex h-10 items-center">
      <div
        data-phase={phase}
        className="absolute left-0 w-30 transition-all duration-300 ease-standard data-[phase=done]:pointer-events-none data-[phase=done]:w-60 data-[phase=done]:opacity-0 data-[phase=run]:pointer-events-none data-[phase=run]:w-60 data-[phase=run]:opacity-0"
      >
        <Button
          className="w-full"
          disabled={phase !== "idle"}
          onClick={() => {
            setPhase("run")
            setRun((r) => r + 1)
          }}
        >
          Apply plan
        </Button>
      </div>
      <div
        data-phase={phase}
        className="pointer-events-none absolute left-0 flex items-center gap-3 opacity-0 transition-opacity data-[phase=done]:opacity-100 data-[phase=run]:opacity-100 data-[phase=run]:delay-200"
      >
        {phase === "done" ? <Motif state="done" width={150} size={10} /> : <Motif state="running" progress={Math.min(p, 0.999)} width={150} size={10} />}
        <span className="font-mono text-xs whitespace-nowrap text-faint">{phase === "done" ? "9 moves" : `${Math.round(p * 100)}%`}</span>
      </div>
    </div>
  )
}

const STALL_JOB: [number, number][] = [
  [200, 0.12],
  [600, 0.28],
  [1000, 0.41],
  [1200, 0.46],
  [6200, 0.7],
  [6800, 0.88],
  [7400, 1],
]

function Stall() {
  const target = useJob(STALL_JOB, 1)
  const p = useTween(target, DUR * 2)
  const [stalled, setStalled] = useState(false)
  useEffect(() => {
    const ids = [setTimeout(() => setStalled(false), 0)]
    if (target < 1) ids.push(setTimeout(() => setStalled(true), 2000))
    return () => ids.forEach(clearTimeout)
  }, [target])
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center text-sm">
        <span className="font-medium">{p >= 1 ? "Synced 1,204 files" : stalled ? "Waiting for iCloud" : "Syncing"}</span>
        <div className="flex-1" />
        <span className="font-mono text-xs text-faint">{Math.round(p * 100)}%</span>
      </div>
      {p >= 1 ? (
        <Motif state="done" width={200} size={10} />
      ) : (
        <Motif state={stalled ? "stalled" : "running"} progress={Math.min(p, 0.999)} width={200} size={10} />
      )}
    </div>
  )
}

function FieldErr() {
  const [v, setV] = useState("~/Downlaods")
  const [err, setErr] = useState(0)
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (v.trim() !== "~/Downloads") setErr((n) => n + 1)
      }}
    >
      <Field data-invalid={err > 0 || undefined}>
        <FieldLabel htmlFor="mo-folder">Folder</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="mo-folder"
            value={v}
            onChange={(e) => (setV(e.target.value), setErr(0))}
            spellCheck={false}
            aria-invalid={err > 0}
          />
          <Button variant="outline" type="submit">
            Watch
          </Button>
        </div>
        {err ? <Motif key={err} state="error" width={200} size={9} /> : <Motif key="ok" state="idle" width={200} size={9} />}
        {err > 0 && <FieldError>No folder at {v}</FieldError>}
      </Field>
    </form>
  )
}
