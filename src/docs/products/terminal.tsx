import { Fragment, useEffect, useRef, useState, type ReactNode } from "react"
import { RotateCcwIcon, SkipForwardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Terminal, TerminalBar, TerminalCaret, TerminalLine, TerminalPrompt, TerminalRule, TerminalSpinner, TerminalText } from "@/components/ui/terminal"
import { Window, WindowBar, WindowBody, WindowTitle } from "@/components/ui/window"

import { ProductPage, Scene } from "./shared"

type Step = { cmd: string; work?: number; out: (t: number) => ReactNode; job?: boolean }

const pad = (s: string, n: number) => s + " ".repeat(Math.max(0, n - s.length))

const STEPS: Step[] = [
  {
    cmd: "glu tir --days 14",
    work: 700,
    out: () => (
      <>
        <TerminalLine>
          <TerminalText tone="bold">glu</TerminalText>
          <TerminalText tone="muted"> · time in range · last 14 days · Libre 3 · synced 06:12</TerminalText>
        </TerminalLine>
        <TerminalLine />
        <TerminalLine>
          {"  in range  "}
          <TerminalBar value={0.78} tone="ok" /> <TerminalText tone="bold">78%</TerminalText>
          <TerminalText tone="faint">   target ≥ 70%</TerminalText>
        </TerminalLine>
        <TerminalLine>
          {"  below     "}
          <TerminalBar value={0.02} tone="error" /> <TerminalText tone="bold"> 2%</TerminalText>
          <TerminalText tone="faint">   {"< 3.9 mmol/L"}</TerminalText>
        </TerminalLine>
        <TerminalLine>
          {"  above     "}
          <TerminalBar value={0.2} tone="warn" /> <TerminalText tone="bold">20%</TerminalText>
          <TerminalText tone="faint">   {"> 10.0 mmol/L"}</TerminalText>
        </TerminalLine>
        <TerminalLine />
        <TerminalLine>
          {"  mean "}
          <TerminalText tone="bold">7.4 mmol/L</TerminalText>
          {"   GMI "}
          <TerminalText tone="bold">6.5%</TerminalText>
          {"   CV "}
          <TerminalText tone="bold">31%</TerminalText>
        </TerminalLine>
        <TerminalLine />
        <TerminalLine>
          <TerminalText tone="ok">✓</TerminalText> time in range above target
        </TerminalLine>
        <TerminalLine>
          <TerminalText tone="warn">▲</TerminalText> 2 overnight lows <TerminalText tone="muted">(Sep 24 03:10, Sep 29 04:45)</TerminalText>
        </TerminalLine>
      </>
    ),
  },
  {
    cmd: "strap today",
    work: 500,
    out: () => (
      <>
        <TerminalLine>
          <TerminalText tone="inverse"> RECOVERY 64% </TerminalText> <TerminalText tone="warn">● moderate</TerminalText>
        </TerminalLine>
        <TerminalLine>
          {"  HRV "}
          <TerminalText tone="bold">58 ms</TerminalText>
          {"   RHR "}
          <TerminalText tone="bold">52 bpm</TerminalText>
          {"   sleep "}
          <TerminalText tone="bold">7h12</TerminalText>
        </TerminalLine>
      </>
    ),
  },
  {
    cmd: "butler plan ~/Downloads --dry-run",
    work: 900,
    out: () => (
      <>
        <TerminalLine>
          <TerminalText tone="accent">●</TerminalText> {pad("Invoices/2025 ", 22).replace(/ (?= )/g, ".")}
          <TerminalText tone="muted"> 3 files</TerminalText>
        </TerminalLine>
        <TerminalLine>
          <TerminalText tone="accent">●</TerminalText> {pad("Screenshots ", 22).replace(/ (?= )/g, ".")}
          <TerminalText tone="muted"> 3 files</TerminalText>
        </TerminalLine>
        <TerminalLine>
          <TerminalText tone="accent">●</TerminalText> {pad("Installers ", 22).replace(/ (?= )/g, ".")}
          <TerminalText tone="muted"> 2 files</TerminalText>
        </TerminalLine>
        <TerminalLine>
          <TerminalText tone="faint">· {pad("Trash ", 22).replace(/ (?= )/g, ".")} 2 excluded</TerminalText>
        </TerminalLine>
        <TerminalLine />
        <TerminalLine>
          <TerminalText tone="muted">run </TerminalText>
          <TerminalText tone="bold">butler apply 7f3a</TerminalText>
          <TerminalText tone="muted"> to move 8 files · undo with </TerminalText>
          <TerminalText tone="bold">butler undo</TerminalText>
        </TerminalLine>
      </>
    ),
  },
  {
    cmd: "butler apply 7f3a",
    job: true,
    out: (t) =>
      t < 1 ? (
        <TerminalLine>
          <TerminalRule value={t} width={28} /> <TerminalText tone="muted">{`${Math.round(t * 8)}/8 · ${Math.round(t * 100)}%`}</TerminalText>
        </TerminalLine>
      ) : (
        <>
          <TerminalLine>
            <TerminalRule value={1} width={28} state="done" /> <TerminalText tone="muted">moved 8 files · 2.2s</TerminalText>
          </TerminalLine>
          <TerminalLine>
            <TerminalText tone="faint">undo with </TerminalText>
            <TerminalText tone="bold">butler undo 7f3a</TerminalText>
          </TerminalLine>
        </>
      ),
  },
  {
    cmd: "glu sync",
    work: 1100,
    out: () => (
      <>
        <TerminalLine>
          <TerminalRule state="error" width={28} /> <TerminalText tone="error">error</TerminalText>
          <TerminalText tone="muted"> · LibreLinkUp returned 429 (rate limited)</TerminalText>
        </TerminalLine>
        <TerminalLine>
          <TerminalText tone="faint">hint </TerminalText>retry after 60s, or pass <TerminalText tone="bold">--since 6h</TerminalText>
        </TerminalLine>
      </>
    ),
  },
]

export default function TerminalPage() {
  return (
    <ProductPage
      tool="glu"
      title="Terminal"
      lead="The same tools in a terminal: sixteen ANSI colours from the ramps, the motif glyph as the status mark, the accent on the prompt."
      uses={["Terminal", "Window", "Switch", "Colour", "Progress", "Writing"]}
      look={[
        "ANSI colours derive from the same scales, so the Ghostty export matches the apps.",
        "Progress uses the motif glyph: a heavy rule to the current position, the dot at its tip, a light rule for the rest.",
        "Errors say what failed and what to do next.",
        "NO_COLOR keeps the glyph and the rule.",
      ]}
      related={[
        { id: "readme", title: "README" },
        { id: "writing", title: "Writing" },
        { id: "colour", title: "Colour" },
      ]}
    >
      <Scene>
        <Session />
      </Scene>
    </ProductPage>
  )
}

type Phase = { step: number; typed: number; state: "typing" | "working" | "job" | "out" | "done"; t: number }

function Session() {
  const [noColor, setNoColor] = useState(false)
  const [run, setRun] = useState(0)
  const [p, setP] = useState<Phase>({ step: 0, typed: 0, state: "typing", t: 0 })
  const skip = useRef(false)
  const scroller = useRef<HTMLDivElement>(null)

  const replay = () => {
    skip.current = false
    setRun((r) => r + 1)
    setP({ step: 0, typed: 0, state: "typing", t: 0 })
  }

  useEffect(() => {
    if (p.state === "done") return
    const step = STEPS[p.step]
    let id = 0
    if (p.state === "typing") {
      if (p.typed < step.cmd.length) {
        id = window.setTimeout(() => setP((q) => ({ ...q, typed: q.typed + 1 })), skip.current ? 0 : 28 + ((p.typed * 37) % 41))
      } else {
        id = window.setTimeout(() => setP((q) => ({ ...q, state: step.job ? "job" : step.work ? "working" : "out" })), skip.current ? 0 : 320)
      }
    } else if (p.state === "working") {
      id = window.setTimeout(() => setP((q) => ({ ...q, state: "out" })), skip.current ? 0 : (step.work ?? 400))
    } else if (p.state === "job") {
      if (p.t >= 1) {
        id = window.setTimeout(() => setP((q) => ({ ...q, state: "out" })), skip.current ? 0 : 300)
      } else {
        // Uneven steps: the files differ in size.
        const dt = skip.current ? 1 : 0.04 + 0.08 * Math.abs(Math.sin(p.t * 9))
        id = window.setTimeout(() => setP((q) => ({ ...q, t: Math.min(1, q.t + dt) })), skip.current ? 0 : 90)
      }
    } else if (p.state === "out") {
      const last = p.step === STEPS.length - 1
      id = window.setTimeout(
        () => setP((q) => (last ? { ...q, state: "done" } : { step: q.step + 1, typed: 0, state: "typing", t: 0 })),
        skip.current ? 0 : 900
      )
    }
    return () => clearTimeout(id)
  }, [p])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  })

  const done = p.state === "done"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">glu · strap · butler CLI</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch size="sm" id="no-color" checked={noColor} onCheckedChange={setNoColor} />
            <Label htmlFor="no-color">NO_COLOR</Label>
          </div>
          {done ? (
            <Button variant="ghost" size="sm" onClick={replay}>
              <RotateCcwIcon data-icon="inline-start" />
              Replay
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => (skip.current = true)}>
              <SkipForwardIcon data-icon="inline-start" />
              Skip
            </Button>
          )}
        </div>
      </div>
      <Window variant="terminal" className="h-[560px]" onClick={() => !done && (skip.current = true)}>
        <WindowBar>
          <WindowTitle center>~ — zsh — 96×28</WindowTitle>
        </WindowBar>
        <WindowBody className="min-h-0 overflow-y-auto" ref={scroller}>
          <Terminal color={noColor ? "off" : "on"}>
            {STEPS.slice(0, p.step + 1).map((s, i) => {
              const current = i === p.step
              const typed = current ? s.cmd.slice(0, p.typed) : s.cmd
              const showOut = !current || p.state === "out" || p.state === "done" || p.state === "job"
              return (
                <Fragment key={`${run}-${i}`}>
                  {i > 0 && <TerminalLine />}
                  <TerminalLine>
                    <TerminalPrompt>{typed}</TerminalPrompt>
                    {current && p.state === "typing" && <TerminalCaret />}
                  </TerminalLine>
                  {current && p.state === "working" && (
                    <TerminalLine>
                      <TerminalSpinner /> <TerminalText tone="muted">working</TerminalText>
                    </TerminalLine>
                  )}
                  {showOut && s.out(current && p.state === "job" ? p.t : 1)}
                </Fragment>
              )
            })}
            {done && (
              <>
                <TerminalLine />
                <TerminalLine>
                  <TerminalPrompt>{""}</TerminalPrompt>
                  <TerminalCaret />
                </TerminalLine>
              </>
            )}
          </Terminal>
        </WindowBody>
      </Window>
      <p className="text-xs text-muted-foreground">
        Click the terminal to skip.
      </p>
    </div>
  )
}
