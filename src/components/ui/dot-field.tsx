import * as React from "react"
import { cn } from "cn"

import { MotifDot } from "@/components/ui/motif"

// Canvas dot backdrop. One dot per 24px tile; the frame loop runs only while something changes.
//
//   lens      dots near the pointer grow toward ink.
//   ripple    one wave from the pointer-down point.
//   halftone  dots under `icon` ink in from the centre; the motif dot lands top-right. Plays once.
//   line      dots along one row ink in and merge into the rule. Plays once.
//   drop      dots lean toward the drop zone while a chip is dragged.
//
// Colours come from the computed CSS variables. Reduced motion stills every effect.

type Mode = "lens" | "ripple" | "halftone" | "line" | "drop"
type Ctx = CanvasRenderingContext2D
type Pal = { dot: string; ink: string; accent: string; danger: string }
type Draw = (c: Ctx, w: number, h: number, now: number, pal: Pal) => boolean

const TAU = Math.PI * 2
const GAP = 24
const R0 = 1.1
const DUR = 220
const clamp = (x: number) => Math.max(0, Math.min(1, x))
const outQuart = (p: number) => 1 - (1 - p) ** 4
const outBack = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const prefersReduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches

/** Folder glyph, 24 viewbox. */
const FOLDER = "M3.5 6.5v11h17v-9h-9l-2-2z"

function palette(el: Element): Pal {
  const cs = getComputedStyle(el)
  const v = (n: string) => cs.getPropertyValue(n).trim()
  return { dot: v("--border-heavy"), ink: v("--foreground"), accent: v("--tool"), danger: v("--destructive") }
}

function dot(c: Ctx, x: number, y: number, r: number, color: string, alpha = 1) {
  if (r <= 0 || alpha <= 0) return
  c.globalAlpha = alpha
  c.fillStyle = color
  c.beginPath()
  c.arc(x, y, r, 0, TAU)
  c.fill()
  c.globalAlpha = 1
}

function inked(c: Ctx, p: Pal, x: number, y: number, a: number, grow: number) {
  dot(c, x, y, R0 + grow, p.dot, 0.7 * (1 - a))
  dot(c, x, y, R0 + grow, p.ink, a)
}

function grid(w: number, h: number, gap = GAP) {
  const pts: { x: number; y: number; i: number; j: number }[] = []
  for (let j = 0; j * gap < h; j++) for (let i = 0; i * gap < w; i++) pts.push({ x: gap / 2 + i * gap, y: gap / 2 + j * gap, i, j })
  return pts
}

// Runs `draw` each frame while it returns true. `kick` restarts the loop.
function useField(ref: React.RefObject<HTMLCanvasElement | null>, draw: Draw) {
  const fn = React.useRef(draw)
  React.useLayoutEffect(() => {
    fn.current = draw
  })
  const raf = React.useRef(0)
  const box = React.useRef({ w: 0, h: 0, dpr: 1 })
  const kick = React.useCallback(() => {
    if (raf.current) return
    const step = (now: number) => {
      raf.current = 0
      const el = ref.current
      if (!el || !box.current.w) return
      const c = el.getContext("2d")
      if (!c) return
      const { w, h, dpr } = box.current
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      if (fn.current(c, w, h, now, palette(el))) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [ref])
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      const w = el.clientWidth
      const h = el.clientHeight
      box.current = { w, h, dpr }
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      kick()
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [ref, kick])
  return kick
}

type DotFieldProps = React.ComponentProps<"div"> & {
  mode?: Mode
  /** halftone: a 24-viewbox SVG path. Defaults to the folder glyph. */
  icon?: string
  /** drop: labels. */
  chipLabel?: string
  zoneLabel?: string
  droppedLabel?: string
  onDrop?: () => void
}

function DotField({ mode = "lens", icon = FOLDER, chipLabel, zoneLabel, droppedLabel, onDrop, className, children, ...props }: DotFieldProps) {
  const body =
    mode === "lens" ? (
      <Lens>{children}</Lens>
    ) : mode === "ripple" ? (
      <Ripple>{children}</Ripple>
    ) : mode === "halftone" ? (
      <Halftone icon={icon}>{children}</Halftone>
    ) : mode === "line" ? (
      <DotsToLine>{children}</DotsToLine>
    ) : (
      <DropPull chipLabel={chipLabel} zoneLabel={zoneLabel} droppedLabel={droppedLabel} onDrop={onDrop}>
        {children}
      </DropPull>
    )
  return (
    <div
      data-slot="dot-field"
      data-mode={mode}
      className={cn("relative h-37.5 w-full overflow-hidden rounded-lg border bg-background", className)}
      {...props}
    >
      {body}
    </div>
  )
}

const canvasClass = "absolute inset-0 block size-full"
const hitClass = "absolute inset-0 touch-none"

const LENS_R = 84
type LensState = { x: number; y: number; tx: number; ty: number; on: number; target: number }

function Lens({ children }: { children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const l = React.useRef<LensState>({ x: 0, y: 0, tx: 0, ty: 0, on: 0, target: 0 })
  const kick = useField(ref, (c, w, h, _now, p) => {
    const s = l.current
    s.x = lerp(s.x, s.tx, 0.3)
    s.y = lerp(s.y, s.ty, 0.3)
    s.on = lerp(s.on, s.target, 0.14)
    if (Math.abs(s.on - s.target) < 0.01) s.on = s.target
    for (const q of grid(w, h)) {
      const d = Math.hypot(q.x - s.x, q.y - s.y)
      const f = d < LENS_R ? (1 - d / LENS_R) ** 2 * s.on : 0
      inked(c, p, q.x, q.y, f * 0.55, f * 1.1)
    }
    return Math.abs(s.x - s.tx) > 0.3 || Math.abs(s.y - s.ty) > 0.3 || s.on !== s.target
  })
  const move = (e: React.PointerEvent) => {
    if (prefersReduced() || e.pointerType === "touch" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (!l.current.on) Object.assign(l.current, { x, y })
    Object.assign(l.current, { tx: x, ty: y, target: 1 })
    kick()
  }
  return (
    <div className={hitClass} onPointerMove={move} onPointerLeave={() => ((l.current.target = 0), kick())}>
      <canvas ref={ref} className={canvasClass} aria-hidden />
      {children}
    </div>
  )
}

function Ripple({ children }: { children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const waves = React.useRef<{ x: number; y: number; t0: number }[]>([])
  const kick = useField(ref, (c, w, h, now, p) => {
    const speed = 60 / DUR
    const max = Math.hypot(w, h)
    waves.current = waves.current.filter((v) => (now - v.t0) * speed < max)
    for (const q of grid(w, h)) {
      let b = 0
      for (const v of waves.current) {
        const R = (now - v.t0) * speed
        const dd = Math.hypot(q.x - v.x, q.y - v.y) - R
        b = Math.max(b, Math.exp(-(dd * dd) / 288) * (1 - R / max) ** 1.5)
      }
      inked(c, p, q.x, q.y, b * 0.85, 1.6 * b)
    }
    return waves.current.length > 0
  })
  const fire = (e: React.PointerEvent) => {
    if (prefersReduced() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    waves.current = [...waves.current.slice(-2), { x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() }]
    kick()
  }
  return (
    <div className={hitClass} onPointerDown={fire}>
      <canvas ref={ref} className={canvasClass} aria-hidden />
      {children}
    </div>
  )
}

function Halftone({ icon, children }: { icon: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const t0 = React.useRef<number | null>(null)
  const cache = React.useRef<{ key: string; hits: number[]; box: [number, number, number, number] } | null>(null)
  const kick = useField(ref, (c, w, h, now, p) => {
    const gap = 8
    const pts = grid(w, h, gap)
    const key = `${w}x${h}:${icon}`
    if (cache.current?.key !== key) {
      const S = Math.min(w, h) / 24
      const off = new OffscreenCanvas(Math.max(1, w), Math.max(1, h)).getContext("2d")
      if (!off) return false
      off.translate(w / 2 - 12 * S, h / 2 - 12 * S)
      off.scale(S, S)
      // One full gap wide, so every stroke covers exactly one row or column of samples.
      off.lineWidth = (gap + 1) / S
      off.lineCap = "round"
      off.lineJoin = "round"
      off.stroke(new Path2D(icon))
      const img = off.getImageData(0, 0, w, h).data
      const box: [number, number, number, number] = [w, h, 0, 0]
      const hits = pts.map((q) => {
        const a = img[(Math.round(q.y) * w + Math.round(q.x)) * 4 + 3] / 255
        if (a > 0.5) box.splice(0, 4, Math.min(box[0], q.x), Math.min(box[1], q.y), Math.max(box[2], q.x), Math.max(box[3], q.y))
        return a
      })
      cache.current = { key, hits, box }
    }
    const { hits, box } = cache.current
    t0.current ??= now
    const t = prefersReduced() ? Infinity : now - t0.current
    const cx = w / 2
    const cy = h / 2
    const far = Math.hypot(w, h) / 2
    const spread = DUR * 3
    const grow = DUR * 1.5
    pts.forEach((q, k) => {
      const a = hits[k]
      const g = outQuart(clamp((t - (Math.hypot(q.x - cx, q.y - cy) / far) * spread) / grow)) * a
      dot(c, q.x, q.y, 0.9 + g * 1.5, p.dot, 0.55 * (1 - g))
      dot(c, q.x, q.y, 0.9 + g * 1.5, p.ink, g)
    })
    const size = 14
    const ts = spread + grow
    const sp = clamp((t - ts) / (DUR * 1.6))
    if (sp > 0) dot(c, box[2] + size / 2 + 8, box[1] - size / 2 - 2, (size / 2) * outBack(sp), p.accent)
    return t < ts + DUR * 1.6 + 32
  })
  React.useEffect(() => kick(), [kick, icon])
  return (
    <>
      <canvas ref={ref} className={canvasClass} aria-hidden />
      {children}
    </>
  )
}

function DotsToLine({ children }: { children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const t0 = React.useRef<number | null>(null)
  const kick = useField(ref, (c, w, h, now, p) => {
    t0.current ??= now
    const t = prefersReduced() ? Infinity : now - t0.current
    const step = DUR * 0.22
    const grow = DUR * 1.2
    const row = Math.floor(h / GAP / 2)
    const cols = Math.floor(w / GAP)
    const size = 11
    const hx = size / 2
    const head = GAP / 2 + (cols - 2) * GAP
    const lineMax = head - hx - 4
    const lw = 1.5
    const last = Math.floor((lineMax - GAP / 2) / GAP)
    const reach = (i: number) => grow + i * step
    const end = reach(last)
    const lineX = Math.min(lineMax, GAP / 2 + Math.max(0, (t - grow) / step) * GAP)
    for (const q of grid(w, h)) {
      if (q.j === row && q.i <= last) {
        const a = outQuart(clamp((t - q.i * step) / grow))
        const merge = outQuart(clamp((t - reach(q.i)) / (DUR * 0.8)))
        const r = lerp(R0 + 1.1 * a, lw / 2, merge)
        dot(c, q.x, q.y, r, p.dot, 0.7 * (1 - a))
        dot(c, q.x, q.y, r, p.ink, a)
      } else if (q.j === row && q.i > last) {
        const covered = q.i === cols - 2 && t > end
        if (!covered) inked(c, p, q.x, q.y, 0, 0)
      } else inked(c, p, q.x, q.y, 0, 0)
    }
    const y = GAP / 2 + row * GAP
    if (t > grow) {
      c.strokeStyle = p.ink
      c.lineWidth = lw
      c.lineCap = "round"
      c.beginPath()
      c.moveTo(GAP / 2, y)
      c.lineTo(lineX, y)
      c.stroke()
    }
    const sp = clamp((t - end) / (DUR * 1.6))
    if (sp > 0) dot(c, head, y, hx * outBack(sp), p.accent)
    return t < end + DUR * 1.6 + 32
  })
  React.useEffect(() => kick(), [kick])
  return (
    <>
      <canvas ref={ref} className={canvasClass} aria-hidden />
      {children}
    </>
  )
}

function DropPull({
  chipLabel = "invoice-0412.pdf",
  zoneLabel = "Drop to file",
  droppedLabel = "Filed to Invoices",
  onDrop,
  children,
}: {
  chipLabel?: string
  zoneLabel?: string
  droppedLabel?: string
  onDrop?: () => void
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const wrap = React.useRef<HTMLDivElement>(null)
  const zone = React.useRef<HTMLDivElement>(null)
  const st = React.useRef({ pull: 0, target: 0, hot: 0, hotT: 0 })
  const [drag, setDrag] = React.useState<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const [hot, setHot] = React.useState(false)
  const [filed, setFiled] = React.useState(0)
  const kick = useField(ref, (c, w, h, _now, p) => {
    const v = st.current
    v.pull = lerp(v.pull, v.target, 0.16)
    v.hot = lerp(v.hot, v.hotT, 0.16)
    const z = zone.current
    const wr = wrap.current
    if (!z || !wr) return false
    const zr = z.getBoundingClientRect()
    const wrr = wr.getBoundingClientRect()
    const zx = zr.left - wrr.left + zr.width / 2
    const zy = zr.top - wrr.top + zr.height / 2
    const R = 150
    for (const q of grid(w, h)) {
      const dx = zx - q.x
      const dy = zy - q.y
      const dd = Math.hypot(dx, dy)
      const f = dd < R ? (1 - dd / R) ** 1.5 * v.pull : 0
      const k = f * (2.5 + 3 * v.hot)
      inked(c, p, q.x + (dd ? (dx / dd) * k : 0), q.y + (dd ? (dy / dd) * k : 0), f * (0.35 + 0.3 * v.hot), f * 0.6)
    }
    return Math.abs(v.pull - v.target) > 0.005 || Math.abs(v.hot - v.hotT) > 0.005
  })
  const set = (pull: number, h: boolean) => {
    st.current.target = prefersReduced() ? 0 : pull
    st.current.hotT = h ? 1 : 0
    setHot(h)
    kick()
  }
  const inside = (x: number, y: number) => {
    const r = zone.current?.getBoundingClientRect()
    return !!r && x > r.left && x < r.right && y > r.top && y < r.bottom
  }
  const file = () => {
    setFiled((n) => n + 1)
    onDrop?.()
  }
  React.useEffect(() => {
    if (!filed) return
    const t = setTimeout(() => setFiled(0), 1800)
    return () => clearTimeout(t)
  }, [filed])
  return (
    <div
      ref={wrap}
      className={hitClass}
      onDragOver={(e) => {
        e.preventDefault()
        set(1, inside(e.clientX, e.clientY))
      }}
      onDragLeave={(e) => !wrap.current?.contains(e.relatedTarget as Node) && set(0, false)}
      onDrop={(e) => {
        e.preventDefault()
        if (inside(e.clientX, e.clientY)) file()
        set(0, false)
      }}
    >
      <canvas ref={ref} className={canvasClass} aria-hidden />
      <div
        ref={zone}
        data-slot="dot-field-zone"
        data-hot={hot || undefined}
        className="absolute inset-y-7 right-4 grid w-[46%] place-items-center rounded-lg border border-dashed border-border-heavy bg-background/70 text-xs text-muted-foreground transition-colors data-hot:border-solid data-hot:border-foreground data-hot:bg-tool-subtle data-hot:text-foreground"
      >
        {filed ? (
          <span key={filed} className="inline-flex items-center gap-1.5">
            <MotifDot size={12} />
            {droppedLabel}
          </span>
        ) : (
          zoneLabel
        )}
      </div>
      {!filed && (
        <div
          data-slot="dot-field-chip"
          data-dragging={drag ? "" : undefined}
          style={drag ? ({ "--dx": `${drag.x - drag.ox}px`, "--dy": `${drag.y - drag.oy}px` } as React.CSSProperties) : undefined}
          className="absolute top-14 left-4 cursor-grab rounded-sm border border-border-strong bg-card px-2 py-1 font-mono text-xs shadow-md transition-[transform,box-shadow] duration-[352ms] ease-pop select-none data-dragging:translate-x-(--dx) data-dragging:translate-y-(--dy) data-dragging:cursor-grabbing data-dragging:shadow-xl data-dragging:transition-[box-shadow]"
          onPointerDown={(e) => {
            try {
              e.currentTarget.setPointerCapture(e.pointerId)
            } catch {
              /* unsupported pointer */
            }
            setDrag({ x: e.clientX, y: e.clientY, ox: e.clientX, oy: e.clientY })
            set(1, false)
          }}
          onPointerMove={(e) => {
            if (!drag) return
            setDrag({ ...drag, x: e.clientX, y: e.clientY })
            const h = inside(e.clientX, e.clientY)
            if (h !== hot) set(1, h)
          }}
          onPointerUp={(e) => {
            if (!drag) return
            if (inside(e.clientX, e.clientY)) file()
            setDrag(null)
            set(0, false)
          }}
        >
          {chipLabel}
        </div>
      )}
      {children}
    </div>
  )
}

export { DotField, prefersReduced }
export type { DotFieldProps }
