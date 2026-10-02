import { useEffect, useState } from "react"
import { FolderIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Motif } from "@/components/ui/motif"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

import { PageHeader, Related, Section } from "../kit"

function Cell({
  title,
  note,
  children,
  align = "stretch",
}: {
  title: string
  note?: string
  children: React.ReactNode
  align?: "stretch" | "start" | "center"
}) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-background">
      <div className="flex h-9 items-center gap-2 border-b px-4 text-xs">
        <span className="font-medium">{title}</span>
        {note && <span className="text-faint">{note}</span>}
      </div>
      <div
        data-align={align}
        className="flex flex-1 flex-col p-6 data-[align=center]:items-center data-[align=center]:justify-center data-[align=start]:items-start data-[align=stretch]:items-stretch"
      >
        {children}
      </div>
    </div>
  )
}

function FirstRun() {
  const [st, setSt] = useState<"empty" | "adding" | "ready">("empty")
  const [p, setP] = useState(0)
  useEffect(() => {
    if (st !== "adding") return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1600)
      setP(k)
      if (k < 1) raf = requestAnimationFrame(tick)
      else setSt("ready")
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [st])

  if (st === "ready") {
    return (
      <div className="flex w-full animate-enter">
        <Empty variant="plain" className="min-h-56 flex-1">
          <EmptyHeader>
            <EmptyTitle>Downloads is watched</EmptyTitle>
            <Motif
              state="done"
              width={200}
              size={10}
              className="mx-auto my-1"
            />
            <EmptyDescription>
              The first plan arrives when 10 new files land.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (setP(0), setSt("empty"))}
            >
              Reset
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }
  return (
    <Empty variant="plain" className="min-h-56">
      <EmptyHeader>
        <EmptyMedia variant="halftone">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No folders yet</EmptyTitle>
        <EmptyDescription>
          Add a folder and Butler proposes a plan. Nothing moves until you
          approve.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {st === "adding" ? (
          <Motif
            state="running"
            progress={p}
            width={140}
            size={9}
            className="my-2"
          />
        ) : (
          <Button size="sm" onClick={() => setSt("adding")}>
            Add a folder
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}

function Working() {
  const [p, setP] = useState(0.2)
  useEffect(() => {
    const t = setInterval(() => setP((x) => (x >= 0.92 ? 0.2 : x + 0.004)), 40)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="text-sm">Scanning ~/Downloads</span>
      <Motif state="running" progress={p} width={220} size={9} />
      <Button size="sm" variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Scanning
      </Button>
    </div>
  )
}

function AddSlot({
  small = false,
  children,
}: {
  small?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-size={small ? "sm" : "default"}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-sm font-medium text-muted-foreground transition-colors hover:border-border-heavy hover:bg-fill hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:translate-y-px data-[size=default]:h-8 data-[size=default]:px-3 data-[size=sm]:h-7 data-[size=sm]:px-2.5 data-[size=sm]:text-xs [&_svg]:size-3.5 [&_svg]:shrink-0"
    >
      <PlusIcon />
      {children}
    </button>
  )
}

function SkelCard({ cover = false }: { cover?: boolean }) {
  return (
    <div className="w-full rounded-xl border bg-card" aria-busy>
      {cover && (
        <Skeleton className="h-28 w-full rounded-t-xl rounded-b-none" />
      )}
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex gap-2 border-t px-4 py-3">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  )
}

function SkelList({
  rows = 3,
  icon = false,
}: {
  rows?: number
  icon?: boolean
}) {
  return (
    <div className="flex w-full flex-col rounded-xl border bg-card" aria-busy>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
        >
          <Skeleton
            className={icon ? "size-4 rounded-sm" : "size-8 rounded-full"}
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className={["w-2/5", "w-1/2", "w-1/3"][i % 3]}>
              <Skeleton className="h-3 w-full" />
            </div>
            {!icon && <Skeleton className="h-3 w-4/5" />}
          </div>
          {icon && <Skeleton className="h-3 w-8" />}
        </div>
      ))}
    </div>
  )
}

const TABLE_W = [
  ["w-3/4", "w-1/2", "w-3/5"],
  ["w-1/2", "w-4/5", "w-2/5"],
  ["w-5/6", "w-1/3", "w-3/4"],
  ["w-2/3", "w-3/5", "w-2/5"],
]

function SkelTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card" aria-busy>
      <div className="grid grid-cols-4 gap-4 border-b bg-muted px-4 py-2.5">
        <Skeleton className="h-2 w-2/5" />
        <Skeleton className="h-2 w-3/5" />
        <Skeleton className="h-2 w-1/2" />
        <Skeleton className="h-2 w-1/3" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 items-center gap-4 border-b px-4 py-3 last:border-b-0"
        >
          {TABLE_W[i % 4].map((w) => (
            <div key={w} className={w}>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
          <Skeleton className="h-5 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

function SkelText({ lines = 4 }: { lines?: number }) {
  const ws = ["w-full", "w-11/12", "w-full", "w-2/3", "w-5/6", "w-1/2"]
  return (
    <div className="flex w-full flex-col gap-2.5" aria-busy>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={ws[i % ws.length]}>
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  )
}

export default function LoadingPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Loading">
        Skeletons for layout, the running line for work, a spinner only inside the control that started it.
      </PageHeader>

      <Section title="Moments">
        <div className="grid gap-4 md:grid-cols-2">
          <Cell title="First run" note="add a folder" align="center">
            <FirstRun />
          </Cell>
          <Cell title="Skeleton" note="a card keeps its shape">
            <SkelCard />
          </Cell>
          <Cell title="Working" align="start">
            <Working />
          </Cell>
          <Cell title="Add slot" align="center">
            <AddSlot>Add a rule</AddSlot>
          </Cell>
        </div>
      </Section>

      <Section title="Skeletons" note="Each skeleton keeps the shape of its content. Reduced motion swaps the shimmer for a pulse.">
        <div className="grid gap-4 md:grid-cols-2">
          <Cell title="List" note="avatar and two lines">
            <SkelList rows={3} />
          </Cell>
          <Cell title="List, icon rows">
            <SkelList rows={3} icon />
          </Cell>
          <Cell title="Card with cover">
            <SkelCard cover />
          </Cell>
          <Cell title="Table">
            <SkelTable rows={4} />
          </Cell>
          <Cell title="Paragraph">
            <SkelText lines={4} />
          </Cell>
          <Cell title="Add slot, small" align="center">
            <AddSlot small>Add page</AddSlot>
          </Cell>
        </div>
      </Section>

      <Related
        ids={[
          ["empty", "Empty"],
          ["skeleton", "Skeleton"],
          ["motif", "Motif"],
          ["spinner", "Spinner"],
        ]}
      />
    </>
  )
}
