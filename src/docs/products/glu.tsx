import { useMemo, useState, type MouseEvent } from "react"
import { SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Motif } from "@/components/ui/motif"
import { NumberRoll } from "@/components/ui/number-roll"
import { Spinner } from "@/components/ui/spinner"
import { StreamText } from "@/components/ui/stream-text"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToolMark } from "@/components/ui/tool-mark"

import { ProductPage, Scene, Sparkline, useLater, useTween } from "./shared"

type Range = "day" | "week" | "month" | "quarter"

const TITLE: Record<Range, string> = { day: "Today", week: "Last week", month: "Last month", quarter: "Last quarter" }

const STATS: Record<Range, { tir: number; rec: number; mean: number; sleep: string; tirNote: string; recNote: string; meanNote: string; sleepNote: string }> = {
  day: { tir: 78, rec: 64, mean: 7.4, sleep: "7h12", tirNote: "target ≥ 70%", recNote: "moderate · HRV 58 ms", meanNote: "GMI 6.5% · CV 31%", sleepNote: "+24 min vs 14-day mean" },
  week: { tir: 74, rec: 61, mean: 7.6, sleep: "6h58", tirNote: "+3 pts vs last week", recNote: "moderate · HRV 54 ms", meanNote: "GMI 6.6% · CV 33%", sleepNote: "5 of 7 nights over 7 h" },
  month: { tir: 71, rec: 66, mean: 7.8, sleep: "7h04", tirNote: "just over target", recNote: "moderate · HRV 57 ms", meanNote: "GMI 6.7% · CV 34%", sleepNote: "bedtime drifting later" },
  quarter: { tir: 69, rec: 63, mean: 8.0, sleep: "7h01", tirNote: "below target, 1 pt", recNote: "moderate · HRV 55 ms", meanNote: "GMI 6.8% · CV 35%", sleepNote: "steady since July" },
}

const SLEEP = [7.2, 6.4, 7.8, 8.1, 5.9, 6.8, 7.4, 7.1, 6.2, 7.9, 8.3, 6.6, 7.0, 7.2]

const EVENTS = [
  { time: "03:10", title: "Low · 3.4 mmol/L", note: "Treated with 15 g, back in range at 04:15", tone: "destructive" as const, idx: 13 },
  { time: "08:20", title: "Breakfast", note: "Peak 9.6 at 09:05 · 45 min", tone: "default" as const, idx: 33 },
  { time: "12:40", title: "Run · 8.2 km", note: "Garmin · avg HR 148 · strain 12.4", tone: "tool" as const, idx: 51 },
  { time: "19:30", title: "Dinner", note: "Peak 11.2 at 20:20 · above range 35 min", tone: "default" as const, idx: 78 },
]

const SUGGESTIONS = ["Why was I low last night?", "How did the run affect sleep?", "Compare this week to last"]
const ANSWER =
  "The 03:10 low followed yesterday’s evening run. Glucose drifted down overnight, as after your last two long runs. A small snack before bed would likely have kept you above 3.9."

// 96 readings at 15-minute steps.
function series(range: Range): number[] {
  if (range === "day") {
    const meal = (i: number, at: number, amp: number) => amp * Math.exp(-Math.pow((i / 4 - at) / 1.1, 2))
    return Array.from({ length: 96 }, (_, i) => {
      const h = i / 4
      const dip = h > 2.4 && h < 4.4 ? 2.4 * Math.sin(((h - 2.4) / 2) * Math.PI) : 0
      return Math.max(2.6, 6.1 + 0.6 * Math.sin(i / 7) + meal(i, 8.3, 4.2) + meal(i, 13.2, 3.4) + meal(i, 19.6, 5.1) - dip)
    })
  }
  let seed = range === "week" ? 7 : range === "month" ? 30 : 90
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: 96 }, (_, i) => 5.6 + 2.2 * Math.sin(i / 9 + seed) + rand() * 2.4 + (range === "quarter" ? 0.6 : 0))
}

export default function GluPage() {
  return (
    <ProductPage
      tool="glu"
      title="glu"
      lead="A glucose dashboard: headline figures, a chart and a reading table."
      uses={["Figure", "Card", "Table", "Badge", "Toggle Group", "Motif", "Input Group"]}
      look={[
        "Figures roll, they do not fade. Time in range and recovery carry the motif; mean and sleep carry a sparkline.",
        "The chart is paper: dotted grid, target band in the tool tint, reading in ink, the low in the danger colour with a word beside it.",
        "Sources are chips with a status word. The stale one is a button; syncing is the same gesture as reading.",
        "Ask opens a card in place. Thinking is the motif running; the answer arrives a word at a time.",
      ]}
      related={[
        { id: "cli", title: "Terminal" },
        { id: "number-roll", title: "Number Roll" },
        { id: "table", title: "Table" },
      ]}
    >
      <Scene>
        <GluApp />
      </Scene>
    </ProductPage>
  )
}

function GluApp() {
  const [range, setRange] = useState<Range>("day")
  const [garmin, setGarmin] = useState<"stale" | "syncing" | "fresh">("stale")
  const [asking, setAsking] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  useLater(garmin === "syncing", 1400, () => setGarmin("fresh"))
  const s = STATS[range]
  const data = useMemo(() => series(range), [range])
  const lows = data.filter((v) => v < 3.9).length

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-background p-5 shadow-lg">
      <header className="flex flex-wrap items-start gap-4">
        <ToolMark tool="glu" size={36} className="mt-1" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-3xl font-semibold tracking-tight">{TITLE[range]}</h3>
            <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Wednesday 1 October</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="success" dot>
              Libre 3 · synced 06:12
            </Badge>
            <Badge variant="success" dot>
              WHOOP · synced 07:40
            </Badge>
            {garmin === "fresh" ? (
              <Badge variant="success" dot>
                Garmin · synced just now
              </Badge>
            ) : (
              <Badge
                variant="warning"
                dot={garmin === "stale"}
                render={<button type="button" onClick={() => setGarmin("syncing")} disabled={garmin === "syncing"} />}
              >
                {garmin === "syncing" ? <Spinner className="size-3" /> : null}
                Garmin · {garmin === "syncing" ? "syncing" : "last sync Sep 29"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup size="sm" value={[range]} onValueChange={(v: string[]) => v[0] && setRange(v[0] as Range)} aria-label="Range">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="quarter">Quarter</ToggleGroupItem>
          </ToggleGroup>
          <Button variant={asking ? "secondary" : "outline"} size="sm" aria-expanded={asking} onClick={() => setAsking((a) => !a)}>
            <SparklesIcon data-icon="inline-start" />
            Ask
          </Button>
        </div>
      </header>

      {asking && <Ask />}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Time in range" value={s.tir} suffix="%" note={s.tirNote} rule />
        <Stat label="Recovery" value={s.rec} suffix="%" note={s.recNote} rule />
        <Stat label="Mean glucose" value={s.mean} suffix=" mmol/L" note={s.meanNote} spark={data.filter((_, i) => i % 8 === 0)} />
        <Stat label="Sleep" text={s.sleep} note={s.sleepNote} spark={SLEEP} />
      </div>

      <Card variant="flat" size="sm">
        <CardHeader>
          <CardTitle>Glucose, {range === "day" ? "last 24 hours" : TITLE[range].toLowerCase()}</CardTitle>
          <CardDescription>mmol/L · shaded band is the 3.9–10.0 target range</CardDescription>
          <CardAction>
            {lows > 0 ? (
              <Badge variant="destructive" dot>
                {range === "day" ? "1 low · 03:10–04:15" : `${lows} lows`}
              </Badge>
            ) : (
              <Badge variant="success" dot>
                no lows
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardContent>
          <Chart data={data} hover={hover} onHover={setHover} />
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <Card variant="flat" size="sm">
          <CardHeader>
            <CardTitle>Sleep, last 14 nights</CardTitle>
            <CardDescription>hours · dotted line marks the 7 h goal</CardDescription>
          </CardHeader>
          <CardContent>
            <SleepBars />
          </CardContent>
        </Card>
        <Card variant="flat" size="sm" className="gap-2">
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <CardDescription>hover to find it on the chart</CardDescription>
          </CardHeader>
          <Table variant="plain" density="compact">
            <TableHeader className="sr-only">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EVENTS.map((e) => (
                <TableRow
                  key={e.time}
                  data-state={hover === e.idx ? "selected" : undefined}
                  onMouseEnter={() => setHover(e.idx)}
                  onMouseLeave={() => setHover(null)}
                >
                  <TableCell variant="mono" tone="muted" className="w-14">
                    {e.time}
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2 font-medium">
                        {e.title}
                        {e.tone === "destructive" && <Badge variant="destructive">low</Badge>}
                        {e.tone === "tool" && <Badge variant="tool">run</Badge>}
                      </span>
                      <span className="text-xs text-muted-foreground">{e.note}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  text,
  suffix = "",
  note,
  rule,
  spark,
}: {
  label: string
  value?: number
  text?: string
  suffix?: string
  note: string
  rule?: boolean
  spark?: number[]
}) {
  const v = useTween(value ?? 0, 660)
  const decimals = value !== undefined && !Number.isInteger(value) ? 1 : 0
  return (
    <Card variant="flat" size="sm" className="gap-3">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline gap-1">
          {text ? (
            <span className="text-4xl font-semibold tracking-tight tabular-nums">{text}</span>
          ) : (
            <NumberRoll variant="figure" value={v} format={(n) => n.toFixed(decimals)} />
          )}
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {rule && value !== undefined ? <Motif state="running" progress={value / 100} width={120} size={8} /> : spark ? <Sparkline values={spark} w={120} h={24} /> : null}
        <span className="text-xs text-muted-foreground">{note}</span>
      </CardContent>
    </Card>
  )
}

const W = 720
const H = 210
const PAD = { l: 34, r: 16, t: 12, b: 24 }
const Y0 = 2
const Y1 = 14
const sx = (i: number, n: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r)
const sy = (v: number) => PAD.t + (1 - (v - Y0) / (Y1 - Y0)) * (H - PAD.t - PAD.b)

function Chart({ data, hover, onHover }: { data: number[]; hover: number | null; onHover: (i: number | null) => void }) {
  const [pinned, setPinned] = useState<number | null>(null)
  const n = data.length
  const path = data.map((v, i) => `${i ? "L" : "M"}${sx(i, n).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ")
  const at = hover ?? pinned
  const move = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const i = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1))
    onHover(Math.max(0, Math.min(n - 1, i)))
  }
  const time = (i: number) => `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`
  const grid = [4, 6, 8, 10, 12, 14]
  const last = n - 1
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full cursor-crosshair select-none overflow-visible"
      role="img"
      aria-label="Glucose over the last 24 hours"
      onMouseMove={move}
      onMouseLeave={() => onHover(null)}
      onClick={() => setPinned((p) => (p === hover ? null : hover))}
    >
      <rect x={PAD.l} y={sy(10)} width={W - PAD.l - PAD.r} height={sy(3.9) - sy(10)} className="fill-tool-subtle" />
      {grid.map((g) =>
        Array.from({ length: 25 }, (_, k) => (
          <circle key={`${g}-${k}`} cx={PAD.l + (k / 24) * (W - PAD.l - PAD.r)} cy={sy(g)} r={0.9} className="fill-border-heavy" />
        ))
      )}
      <line x1={PAD.l} x2={W - PAD.r} y1={sy(Y0)} y2={sy(Y0)} className="stroke-border-strong" strokeWidth={1} />
      {grid.map((g) => (
        <text key={g} x={PAD.l - 8} y={sy(g) + 3} textAnchor="end" className="fill-faint font-mono text-xs">
          {g}
        </text>
      ))}
      {[0, 24, 48, 72, 95].map((i, k) => (
        <text key={i} x={sx(i, n)} y={H - 6} textAnchor={k === 0 ? "start" : k === 4 ? "end" : "middle"} className="fill-faint font-mono text-xs">
          {["00:00", "06:00", "12:00", "18:00", "24:00"][k]}
        </text>
      ))}
      <path key={path.length + path.slice(0, 40)} d={path} pathLength={1} fill="none" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" className="animate-draw stroke-foreground [stroke-dasharray:1]" />
      {data.map((v, i) => (v < 3.9 && i % 2 === 0 ? <circle key={i} cx={sx(i, n)} cy={sy(v)} r={2.5} className="fill-destructive" /> : null))}
      <circle cx={sx(last, n)} cy={sy(data[last])} r={4} className="animate-pop fill-tool [transform-box:fill-box] origin-center" />
      {at !== null && (
        <g>
          <line x1={sx(at, n)} x2={sx(at, n)} y1={PAD.t} y2={H - PAD.b} className="stroke-border-heavy" strokeWidth={1} strokeDasharray="2 3" />
          <circle cx={sx(at, n)} cy={sy(data[at])} r={4} className="fill-background stroke-foreground" strokeWidth={1.5} />
          <g transform={`translate(${Math.min(W - 150, Math.max(PAD.l, sx(at, n) - 60))} ${PAD.t})`}>
            <rect width={pinned === at ? 150 : 110} height={22} rx={4} className="fill-popover stroke-border" strokeWidth={1} />
            <text x={8} y={15} className="fill-foreground font-mono text-xs">
              {time(at)} · {data[at].toFixed(1)}
              {pinned === at ? " · pinned" : ""}
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}

function SleepBars() {
  const w = 420
  const h = 120
  const max = 9
  const bw = w / SLEEP.length
  const y = (v: number) => h - 16 - (v / max) * (h - 24)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full overflow-visible" role="img" aria-label="Sleep, last 14 nights">
      <line x1={0} x2={w} y1={y(7)} y2={y(7)} strokeDasharray="2 4" strokeWidth={1} className="stroke-foreground" />
      {SLEEP.map((v, i) => (
        <rect
          key={i}
          x={i * bw + 6}
          y={y(v)}
          width={bw - 12}
          height={h - 16 - y(v)}
          rx={2}
          data-tone={i === SLEEP.length - 1 ? "accent" : v < 7 ? "muted" : "ink"}
          className="fill-foreground data-[tone=accent]:fill-tool data-[tone=muted]:fill-border-heavy"
        />
      ))}
      <text x={6} y={h - 2} className="fill-faint font-mono text-xs">
        Sep 18
      </text>
      <text x={w - 6} y={h - 2} textAnchor="end" className="fill-faint font-mono text-xs">
        Oct 1
      </text>
    </svg>
  )
}

function Ask() {
  const [q, setQ] = useState("")
  const [state, setState] = useState<"idle" | "thinking" | "answered">("idle")
  useLater(state === "thinking", 1800, () => setState("answered"))
  const submit = (text: string) => {
    if (!text.trim()) return
    setQ(text)
    setState("thinking")
  }
  return (
    <Card size="sm" variant="elevated" className="gap-3">
      <CardContent className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupAddon>
            <SparklesIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Why was I low last night?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit(q)}
            disabled={state === "thinking"}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => submit(q)} disabled={state === "thinking" || !q.trim()}>
              Ask <Kbd>↵</Kbd>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {state === "idle" && (
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline" size="xs" onClick={() => submit(s)}>
                {s}
              </Button>
            ))}
          </div>
        )}
        {state === "thinking" && (
          <div className="flex items-center gap-3">
            <Motif state="running" progress={0.55} width={160} />
            <span className="text-sm text-muted-foreground">Reading 14 days of glucose, sleep and runs</span>
          </div>
        )}
        {state === "answered" && (
          <StreamText className="max-w-prose">{ANSWER}</StreamText>
        )}
      </CardContent>
    </Card>
  )
}
