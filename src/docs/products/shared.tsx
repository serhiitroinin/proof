import { useEffect, useRef, useState, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { ToolMark, type ToolName } from "@/components/ui/tool-mark"
import { ToolScope } from "@/components/ui/tool-scope"

import { PageHeader, Section } from "../kit"
import { href } from "../router"

export function ProductPage({
  tool,
  title,
  lead,
  uses,
  look,
  related,
  children,
}: {
  tool: ToolName
  title: string
  lead: ReactNode
  uses: string[]
  look: ReactNode[]
  related?: { id: string; title: string }[]
  children: ReactNode
}) {
  return (
    <>
      <div className="flex items-start gap-4">
        <ToolMark tool={tool} size={48} className="mt-1 shrink-0" />
        <div className="min-w-0 flex-1">
          <PageHeader group="Products" title={title} lead={lead} />
        </div>
      </div>
      <div className="-mt-4 mb-10 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-xs text-faint uppercase">Uses</span>
        {uses.map((u) => (
          <Badge key={u} variant="outline">
            {u}
          </Badge>
        ))}
      </div>
      <ToolScope tool={tool} className="mb-12 w-full">
        {children}
      </ToolScope>
      <Section title="What to look at">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground marker:text-faint">
          {look.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </Section>
      {related && related.length > 0 && (
        <Section title="Related">
          <div className="flex flex-wrap gap-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={href(r.id)}
                className="rounded-md border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-fill"
              >
                {r.title} →
              </a>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// Wider than the prose column so the window reads at app density.
export function Scene({ children }: { children: ReactNode }) {
  return <div className="relative w-full lg:-mx-16 lg:w-[calc(100%+8rem)]">{children}</div>
}

export function Sparkline({ values, w = 96, h = 28, tone = "tool" }: { values: number[]; w?: number; h?: number; tone?: "tool" | "ink" | "muted" }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * (w - 2) + 1},${h - 2 - ((v - min) / span) * (h - 4)}`)
  const last = pts[pts.length - 1].split(",").map(Number)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block shrink-0 overflow-visible" aria-hidden>
      <polyline points={pts.join(" ")} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="stroke-foreground" />
      <circle
        cx={last[0]}
        cy={last[1]}
        r={3}
        data-tone={tone}
        className="fill-tool data-[tone=ink]:fill-foreground data-[tone=muted]:fill-muted-foreground"
      />
    </svg>
  )
}

export function useTween(target: number, ms = 880) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const e = 1 - Math.pow(1 - p, 4)
      const next = a + (target - a) * e
      setV(next)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      from.current = a + (target - a) * 1
    }
  }, [target, ms])
  return v
}

export function useLater(on: boolean, ms: number, fn: () => void) {
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  useEffect(() => {
    if (!on) return
    const t = setTimeout(() => ref.current(), ms)
    return () => clearTimeout(t)
  }, [on, ms])
}

export function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}
