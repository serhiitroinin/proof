import { useEffect, useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Motif, MotifBroken, MotifDot } from "@/components/ui/motif"
import { Spinner } from "@/components/ui/spinner"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"
import { Meta } from "./shared"

type JobState = "running" | "waiting" | "done" | "failed"
type Job = { id: number; name: string; state: JobState; note: string; progress: number; target: number }

const JOBS: Job[] = [
  { id: 1, name: "Refactor auth middleware", state: "running", note: "step 4 of 7 · editing 3 files", progress: 0.1, target: 4 / 7 },
  { id: 2, name: "Write migration tests", state: "waiting", note: "needs your review of #1", progress: 0, target: 0 },
  { id: 3, name: "Bump dependencies", state: "done", note: "12 packages · 4 min", progress: 1, target: 1 },
  { id: 4, name: "Fix flaky e2e", state: "failed", note: "timeout in checkout.spec.ts", progress: 0, target: 0 },
]

function JobGlyph({ state }: { state: JobState }) {
  if (state === "running") return <Spinner className="size-3.5" />
  if (state === "done") return <CheckIcon className="size-3.5 text-success" />
  if (state === "failed") return <XIcon className="size-3.5 text-destructive" />
  return (
    <span className="flex opacity-40">
      <MotifDot size={7} land={false} tone="foreground" />
    </span>
  )
}

function Queue() {
  const [jobs, setJobs] = useState<Job[]>(JOBS)

  useEffect(() => {
    if (!jobs.some((j) => j.state === "running" && j.progress < j.target)) return
    const t = setInterval(() => {
      setJobs((js) =>
        js.map((j) => {
          if (j.state !== "running" || j.progress >= j.target) return j
          const next = Math.min(j.target, j.progress + 0.02)
          if (j.id === 4 && next >= 1) return { ...j, state: "done", progress: 1, note: "passed on retry · 1 min" }
          return { ...j, progress: next }
        })
      )
    }, 48)
    return () => clearInterval(t)
  }, [jobs])

  const retry = (id: number) => setJobs((js) => js.map((j) => (j.id === id ? { ...j, state: "running", note: "retrying…", progress: 0, target: 1 } : j)))
  const reset = () => setJobs(JOBS)

  return (
    <div className="flex w-115 max-w-full flex-col gap-1.5">
      {jobs.map((j) => (
        <div
          key={j.id}
          data-state={j.state}
          className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors data-[state=waiting]:border-tool-border data-[state=waiting]:bg-tool-subtle/40"
        >
          <span className="grid size-5 shrink-0 place-items-center">
            <JobGlyph state={j.state} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{j.name}</span>
              <span className="ml-auto flex shrink-0 items-center gap-2">
                {j.state === "failed" && (
                  <Button size="sm" variant="outline" onClick={() => retry(j.id)}>
                    Retry
                  </Button>
                )}
                {j.state === "waiting" && <Button size="sm">Review</Button>}
              </span>
            </div>
            <span className={`text-xs ${j.state === "failed" ? "text-destructive" : "text-muted-foreground"}`}>{j.note}</span>
            {j.state === "running" && <Motif state="running" progress={j.progress} width={220} size={7} className="mt-1" />}
            {j.state === "failed" && <MotifBroken width={220} size={7} className="mt-1" />}
            {j.state === "done" && j.id === 4 && <Motif key="retry-done" state="done" width={220} size={7} className="mt-1" />}
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-1">
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default function QueuesPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Queues">
        Long jobs show their state as the motif; only the job that waits on you gets a primary button.
      </PageHeader>

      <Section title="Agent queue" note="click Retry">
        <Meta>
          <PatternId>queue-01</PatternId>
          <Uses
            ids={[
              ["motif", "Motif"],
              ["spinner", "Spinner"],
              ["button", "Button"],
            ]}
          />
        </Meta>
        <Example>
          <Queue />
        </Example>
      </Section>

      <Section title="States">
        <div className="flex flex-col gap-3 rounded-lg border bg-background p-6 text-sm">
          {(
            [
              ["Running", "Spinner and the motif line. No button."],
              ["Waiting on you", "Faint dot, tool-accent tint, the only primary button."],
              ["Done", "Check in success ink and a plain note."],
              ["Failed", "Cross, note in destructive ink, broken motif line. Retry is an outline button."],
            ] as [string, string][]
          ).map(([part, text]) => (
            <div key={part} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="w-32 shrink-0 font-medium">{part}</span>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Related
        ids={[
          ["motif", "Motif"],
          ["progress", "Progress"],
          ["sonner", "Toast"],
        ]}
      />
    </>
  )
}
