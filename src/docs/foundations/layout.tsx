import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono, Tile, TokenTable } from "./shared"
import { useTokens } from "./use-tokens"

const RADIUS_TOKENS = ["radius", "radius-xs", "radius-sm", "radius-md", "radius-lg", "radius-xl", "radius-2xl"] as const

export default function Page() {
  const vars = useTokens(RADIUS_TOKENS)
  // Computed custom properties stay unresolved (calc(0.5rem * 0.25)); derive each step from --radius.
  const base = toPx(vars.radius)
  const px = (f: number) => (base ? `${Math.round(base * f * 100) / 100}px` : "")
  const resolved = { radius: px(1), "radius-xs": px(0.25), "radius-sm": px(0.5), "radius-md": px(1), "radius-lg": px(1), "radius-xl": px(1.5), "radius-2xl": px(2) }
  const r = (k: (typeof RADIUS_TOKENS)[number]) => resolved[k]
  return (
    <>
      <PageHeader group="Foundations" title="Layout">
        Every padding, margin, gap and size is a multiple of 4px. Radius is one setting, {r("radius")}; the scale is derived from it.
      </PageHeader>

      <Section title="Grid" note="Heights, paddings and gaps land on 4px lines.">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-background p-8">
          <Button variant="outline">Button</Button>
          <Button>Primary</Button>
          <Input placeholder="Field" readOnly className="w-40" />
          <Kbd>⌘K</Kbd>
          <span className="font-mono text-xs text-muted-foreground">h-8 tall · px-2.5 inline · gap-1.5</span>
        </div>
      </Section>

      <Section title="Spacing" note="Tailwind steps are the spacing tokens. Skip 7, 9 and 11.">
        <div className="flex flex-col gap-2">
          <Ruler cls="w-1" name="1" px="4px" use="icon gaps, inline nudges" />
          <Ruler cls="w-2" name="2" px="8px" use="gap inside a control, between chips, menu padding" />
          <Ruler cls="w-3" name="3" px="12px" use="control padding, tight stacks" />
          <Ruler cls="w-4" name="4" px="16px" use="card padding, list gaps, stage gap" />
          <Ruler cls="w-5" name="5" px="20px" use="rarely: between a title and its description" />
          <Ruler cls="w-6" name="6" px="24px" use="dialog padding, card padding (lg)" />
          <Ruler cls="w-8" name="8" px="32px" use="between blocks" />
          <Ruler cls="w-10" name="10" px="40px" use="between groups of blocks" />
          <Ruler cls="w-12" name="12" px="48px" use="between sections, page margins" />
        </div>
      </Section>

      <Section title="Control heights" note="Rows in tables and menus are h-8. Dense lists can use h-7.">
        <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-background p-8">
          <Tile stage={<Button size="xs">Extra small</Button>} name="h-6" meta="24px · xs" />
          <Tile stage={<Button size="sm">Small</Button>} name="h-7" meta="28px · sm" />
          <Tile stage={<Button>Default</Button>} name="h-8" meta="32px · default" />
          <Tile stage={<Button size="lg">Large</Button>} name="h-9" meta="36px · lg" />
        </div>
      </Section>

      <Section
        title="Radius"
        note="Controls use rounded-md, inner parts rounded-sm, overlays rounded-lg, cards rounded-xl."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-xs border bg-card font-mono text-xs">{r("radius-xs")}</div>} name="rounded-xs" meta="hairline accents" />
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-sm border bg-card font-mono text-xs">{r("radius-sm")}</div>} name="rounded-sm" meta="menu items, keycaps, inner parts" />
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-md border bg-card font-mono text-xs">{r("radius-md")}</div>} name="rounded-md" meta="buttons, fields" />
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-lg border bg-card font-mono text-xs">{r("radius-lg")}</div>} name="rounded-lg" meta="menus, popovers, dialogs" />
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-xl border bg-card font-mono text-xs">{r("radius-xl")}</div>} name="rounded-xl" meta="cards" />
          <Tile stage={<div className="flex h-20 items-center justify-center rounded-2xl border bg-card font-mono text-xs">{r("radius-2xl")}</div>} name="rounded-2xl" meta="cap: 3xl and 4xl equal this" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Tile
            stage={
              <div className="rounded-xl border bg-card p-2">
                <div className="flex h-16 items-center justify-center rounded-md bg-muted font-mono text-xs">inner = outer − padding</div>
              </div>
            }
            name="concentric"
            meta="rounded-xl outside, p-2, rounded-md inside: 12 − 4 = 8"
          />
          <Tile
            stage={
              <div className="rounded-xl border bg-card p-2">
                <div className="flex h-16 items-center justify-center rounded-xl bg-muted font-mono text-xs">same radius inside and out</div>
              </div>
            }
            name="not concentric"
            meta="the inner corners look fatter than the outer ones"
          />
        </div>
      </Section>

      <Section title="Hairlines and half steps">
        <Bullets
          items={[
            <>
              Borders are 1px in <Mono>border</Mono>. Field edges use <Mono>border-input</Mono>, one step darker.
            </>,
            <>
              Half steps (<Mono>0.5</Mono>, <Mono>1.5</Mono>, <Mono>2.5</Mono>) are for optical work inside a component. Pages do not use them.
            </>,
            <>Icon size and stroke are not spacing. See Icons.</>,
            <>Use arbitrary values for layout only (a grid template, a sticky offset). Not for colour, radius or type.</>,
          ]}
        />
      </Section>

      <Section title="Tokens">
        <TokenTable
          vars={resolved}
          rows={[
            ["--radius", "The one setting (0.5rem)"],
            ["--radius-xs", "radius × 0.25"],
            ["--radius-sm", "radius × 0.5 · inner parts"],
            ["--radius-md", "radius · controls"],
            ["--radius-lg", "radius · overlays"],
            ["--radius-xl", "radius × 1.5 · cards"],
            ["--radius-2xl", "radius × 2 · cap for 3xl and 4xl"],
          ]}
        />
      </Section>
    </>
  )
}

const toPx = (v: string | undefined) => {
  if (!v) return 0
  const n = parseFloat(v)
  if (Number.isNaN(n)) return 0
  return v.trim().endsWith("rem") ? n * 16 : n
}

function Ruler({ cls, name, px, use }: { cls: string; name: string; px: string; use: string }) {
  return (
    <div className="grid grid-cols-[3rem_3rem_minmax(0,1fr)] items-center gap-4 text-sm">
      <code className="font-mono text-xs">{name}</code>
      <span className="font-mono text-xs text-muted-foreground">{px}</span>
      <span className="flex items-center gap-3">
        <Bar cls={cls} />
        <span className="text-muted-foreground">{use}</span>
      </span>
    </div>
  )
}

// Literal class strings so the Tailwind lint can read each width.
function Bar({ cls }: { cls: string }) {
  switch (cls) {
    case "w-1":
      return <span className="h-4 w-1 shrink-0 rounded-xs bg-foreground" />
    case "w-2":
      return <span className="h-4 w-2 shrink-0 rounded-xs bg-foreground" />
    case "w-3":
      return <span className="h-4 w-3 shrink-0 rounded-xs bg-foreground" />
    case "w-4":
      return <span className="h-4 w-4 shrink-0 rounded-xs bg-foreground" />
    case "w-5":
      return <span className="h-4 w-5 shrink-0 rounded-xs bg-foreground" />
    case "w-6":
      return <span className="h-4 w-6 shrink-0 rounded-xs bg-foreground" />
    case "w-8":
      return <span className="h-4 w-8 shrink-0 rounded-xs bg-foreground" />
    case "w-10":
      return <span className="h-4 w-10 shrink-0 rounded-xs bg-foreground" />
    default:
      return <span className="h-4 w-12 shrink-0 rounded-xs bg-foreground" />
  }
}
