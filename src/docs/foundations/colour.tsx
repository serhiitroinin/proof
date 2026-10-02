import { CheckIcon, InfoIcon, TriangleAlertIcon, XCircleIcon } from "lucide-react"

import { Code, PageHeader, Section } from "../kit"
import { SwatchGrid, TokenTable } from "./shared"
import { hex, useTokens } from "./use-tokens"

// Literal class strings per token so the Tailwind lint can read every class.

const SWATCH = {
  background: "size-full bg-background",
  card: "size-full bg-card",
  popover: "size-full bg-popover",
  "surface-1": "size-full bg-surface-1",
  "surface-2": "size-full bg-surface-2",
  "surface-3": "size-full bg-surface-3",
  "surface-4": "size-full bg-surface-4",
  muted: "size-full bg-muted",
  sidebar: "size-full bg-sidebar",
  fill: "size-full bg-fill",
  "fill-hover": "size-full bg-fill-hover",
  "fill-active": "size-full bg-fill-active",
  secondary: "size-full bg-secondary",
  accent: "size-full bg-accent",
  skeleton: "size-full bg-skeleton",
  "skeleton-highlight": "size-full bg-skeleton-highlight",
  foreground: "size-full bg-foreground",
  "muted-foreground": "size-full bg-muted-foreground",
  faint: "size-full bg-faint",
  "primary-foreground": "size-full bg-primary-foreground",
  border: "size-full bg-border",
  "border-strong": "size-full bg-border-strong",
  "border-heavy": "size-full bg-border-heavy",
  "border-control": "size-full bg-border-control",
  "card-border": "size-full bg-card-border",
  input: "size-full bg-input",
  primary: "size-full bg-primary",
  "primary-hover": "size-full bg-primary-hover",
  ring: "size-full bg-ring",
  tool: "size-full bg-tool",
  "tool-foreground": "size-full bg-tool-foreground",
  "tool-subtle": "size-full bg-tool-subtle",
  "tool-text": "size-full bg-tool-text",
  "tool-border": "size-full bg-tool-border",
  selection: "size-full bg-selection",
  brand: "size-full bg-brand",
  "brand-foreground": "size-full bg-brand-foreground",
  "brand-text": "size-full bg-brand-text",
  "brand-subtle": "size-full bg-brand-subtle",
  destructive: "size-full bg-destructive",
  "destructive-subtle": "size-full bg-destructive-subtle",
  "destructive-border": "size-full bg-destructive-border",
  success: "size-full bg-success",
  "success-subtle": "size-full bg-success-subtle",
  "success-border": "size-full bg-success-border",
  warning: "size-full bg-warning",
  "warning-subtle": "size-full bg-warning-subtle",
  "warning-border": "size-full bg-warning-border",
  info: "size-full bg-info",
  "info-subtle": "size-full bg-info-subtle",
  "info-border": "size-full bg-info-border",
  "family-butler": "size-full bg-family-butler",
  "family-easel": "size-full bg-family-easel",
  "family-sculpt": "size-full bg-family-sculpt",
  "family-reins": "size-full bg-family-reins",
  "family-glu": "size-full bg-family-glu",
  "family-strap": "size-full bg-family-strap",
  "family-vellum": "size-full bg-family-vellum",
  "chart-1": "size-full bg-chart-1",
  "chart-2": "size-full bg-chart-2",
  "chart-3": "size-full bg-chart-3",
  "chart-4": "size-full bg-chart-4",
  "chart-5": "size-full bg-chart-5",
} as const

type Token = keyof typeof SWATCH
const TOKENS = Object.keys(SWATCH) as Token[]

const SURFACES: [Token, string][] = [
  ["background", "Page"],
  ["card", "Cards, tables, panels"],
  ["popover", "Menus, popovers, toasts"],
  ["surface-1", "Level 1 fill: raised controls"],
  ["surface-2", "Level 2 fill: cards"],
  ["surface-3", "Level 3 fill: overlays"],
  ["surface-4", "Level 4 fill: dialogs, sheets"],
  ["muted", "Wells, code, disabled fields"],
  ["sidebar", "Navigation rail"],
]

const FILLS: [Token, string][] = [
  ["fill", "Hover on rows, menu items, ghost buttons; badges"],
  ["fill-hover", "Hover on a filled control"],
  ["fill-active", "Pressed fill, switch and slider tracks"],
  ["secondary", "Secondary button fill"],
  ["accent", "Alias of fill for upstream components"],
  ["skeleton", "Loading placeholders"],
  ["skeleton-highlight", "Shimmer on skeletons"],
]

const TEXT: [Token, string][] = [
  ["foreground", "Body and headings"],
  ["muted-foreground", "Secondary text, labels, icons"],
  ["faint", "Placeholders, shortcuts, disabled text"],
  ["primary-foreground", "Label on primary"],
]

const BORDERS: [Token, string][] = [
  ["border", "Dividers, rows, keycaps"],
  ["border-strong", "Outline buttons and fields at rest"],
  ["border-heavy", "Buttons and fields on hover, slider thumb"],
  ["border-control", "Unchecked checkbox, radio and switch edge"],
  ["card-border", "Card, table and menu edge"],
  ["input", "Alias of border-strong for upstream components"],
]

const CONTROLS: [Token, string][] = [
  ["primary", "Ink: primary buttons, checked controls, active menu item"],
  ["primary-hover", "Primary button on hover"],
  ["ring", "Focus ring; same as tool"],
]

const TOOL: [Token, string][] = [
  ["tool", "Tool accent: focus, selection rings, active markers"],
  ["tool-foreground", "Label on tool"],
  ["tool-subtle", "Selected rows, cards and nav items"],
  ["tool-text", "Text on tool-subtle"],
  ["tool-border", "Edge of a selected, bordered item"],
  ["selection", "Text selection (::selection)"],
]

const BRAND: [Token, string][] = [
  ["brand", "Brand mark, series 1 in charts"],
  ["brand-foreground", "Label on brand"],
  ["brand-text", "Brand-coloured text and links"],
  ["brand-subtle", "Brand tint behind a mark"],
]

const STATUS: [name: string, text: Token, subtle: Token, border: Token][] = [
  ["destructive", "destructive", "destructive-subtle", "destructive-border"],
  ["success", "success", "success-subtle", "success-border"],
  ["warning", "warning", "warning-subtle", "warning-border"],
  ["info", "info", "info-subtle", "info-border"],
]

const FAMILY: [Token, string, string][] = [
  ["family-butler", "Butler", "Tidy folders with an agent you can overrule."],
  ["family-easel", "Easel", "A canvas for laying out real UI."],
  ["family-sculpt", "Sculpt", "Shape 3D parts from plain text."],
  ["family-reins", "Reins", "Hold many agents on a short rein."],
  ["family-glu", "glu", "Libre 3 glucose in your shell."],
  ["family-strap", "strap", "WHOOP recovery, strain and sleep."],
  ["family-vellum", "Vellum", "Design files that live next to the code."],
]

const DOT: Record<string, string> = {
  "family-butler": "bg-family-butler",
  "family-easel": "bg-family-easel",
  "family-sculpt": "bg-family-sculpt",
  "family-reins": "bg-family-reins",
  "family-glu": "bg-family-glu",
  "family-strap": "bg-family-strap",
  "family-vellum": "bg-family-vellum",
}

const CHARTS: [Token, string][] = [
  ["chart-1", "Series 1, brand"],
  ["chart-2", "Series 2"],
  ["chart-3", "Series 3"],
  ["chart-4", "Series 4"],
  ["chart-5", "Series 5, neutral"],
]

export default function Page() {
  const vars = useTokens(TOKENS)
  return (
    <>
      <PageHeader group="Foundations" title="Colour">
        Components read semantic tokens, never hex values. Hex codes on this page are live and follow the mode toggle.
      </PageHeader>

      <Section title="Theme" note="One theme, Native. The registry item adds the token block to globals.css. Dark mode is the dark class on html.">
        <Code>{`npx shadcn@latest add @proof/native`}</Code>
      </Section>

      <Section title="Surfaces" note="Solid fills. In dark mode, surfaces get lighter as they rise.">
        <SwatchGrid>
          {SURFACES.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section title="Fills" note="Three steps of one grey for interaction.">
        <SwatchGrid>
          {FILLS.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section title="Text" note="Three greys. Faint passes 4.5:1 on the page.">
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT.map(([t, role]) => (
            <div key={t} className="flex items-center gap-4 rounded-lg border border-card-border bg-card p-4">
              <TextSample token={t} />
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-xs">{t}</span>
                <span className="font-mono text-xs text-muted-foreground">{hex(vars[t])}</span>
                <span className="text-xs text-muted-foreground">{role}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Borders" note="Four hairline weights. The unchecked box takes the heaviest because it has no fill.">
        <SwatchGrid>
          {BORDERS.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section title="Controls" note="Ink for controls. Focus is the tool accent.">
        <SwatchGrid>
          {CONTROLS.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section
        title="Tool accent and selection"
        note="One accent for focus, selection and active navigation. Set it in the theme editor under Tool accent."
      >
        <SwatchGrid>
          {TOOL.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex h-8 items-center rounded-md bg-tool-subtle px-3 text-tool-text">Selected row</span>
          <span className="flex h-8 items-center rounded-md border border-tool-border bg-tool-subtle px-3 text-tool-text">Selected card</span>
          <span className="flex h-8 items-center rounded-md px-3 ring-2 ring-tool ring-inset">Inset ring</span>
          <span className="flex h-8 items-center rounded-md bg-selection px-3">Text selection</span>
        </div>
      </Section>

      <Section
        title="Tool family"
        note="One hue per tool, each at 3:1 on the page. A tool uses its hue as the tool accent on its own pages."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILY.map(([t, name, note]) => (
            <div key={t} className="flex flex-col gap-3 rounded-lg border border-card-border bg-card p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span aria-hidden className="relative flex h-3 w-12 items-center">
                  <span className="h-[1.5px] w-full rounded-full bg-foreground" />
                  <span className={`absolute right-0 size-2.5 rounded-full ${DOT[t]}`} />
                </span>
                <span className="text-sm font-semibold">{name}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">{hex(vars[t])}</span>
              </div>
              <p className="text-xs text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Brand" note="For the mark and chart series 1. Not for controls.">
        <SwatchGrid>
          {BRAND.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section
        title="Status"
        note="Each status has a text colour at 4.5:1, a subtle fill and a hairline border. Pair colour with a word and a glyph."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {STATUS.map(([name, text, subtle, border]) => (
            <div key={name} className="flex flex-col gap-3 rounded-lg border border-card-border bg-card p-4">
              <StatusSample name={name} />
              <div className="grid grid-cols-3 gap-3">
                <Swatch token={text} vars={vars} />
                <Swatch token={subtle} vars={vars} />
                <Swatch token={border} vars={vars} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Charts" note="Series 1 is the brand. Series 5 is a neutral for context lines.">
        <SwatchGrid>
          {CHARTS.map(([t, role]) => (
            <Swatch key={t} token={t} role={role} vars={vars} />
          ))}
        </SwatchGrid>
      </Section>

      <Section title="Tokens" note="Each token has a Tailwind class family: bg-*, text-*, border-*, ring-*.">
        <TokenTable
          vars={vars}
          rows={[
            ["--background", "Page"],
            ["--foreground", "Body text"],
            ["--card", "Cards, tables, panels"],
            ["--card-border", "Card, table and menu edge"],
            ["--popover", "Menus, popovers, toasts"],
            ["--surface-4", "Dialogs, sheets"],
            ["--primary", "Ink controls"],
            ["--primary-hover", "Ink controls on hover"],
            ["--muted", "Wells, code, disabled fields"],
            ["--muted-foreground", "Secondary text"],
            ["--faint", "Placeholders, shortcuts"],
            ["--fill", "Hover fill"],
            ["--fill-hover", "Filled control on hover"],
            ["--fill-active", "Pressed fill, tracks"],
            ["--border", "Dividers"],
            ["--border-strong", "Control edges at rest"],
            ["--border-heavy", "Control edges on hover"],
            ["--border-control", "Unchecked box edge"],
            ["--ring", "Focus"],
            ["--tool", "Tool accent"],
            ["--tool-subtle", "Selected fill"],
            ["--tool-text", "Text on selected fill"],
            ["--tool-border", "Selected edge"],
            ["--selection", "Text selection"],
            ["--brand", "Brand mark"],
            ["--destructive", "Error text"],
            ["--destructive-subtle", "Error fill"],
            ["--destructive-border", "Error edge"],
            ["--success", "Success text"],
            ["--warning", "Warning text"],
            ["--info", "Info text"],
            ["--skeleton", "Loading placeholders"],
            ["--sidebar", "Navigation rail"],
          ]}
        />
      </Section>

    </>
  )
}

function Swatch({ token, role, vars }: { token: Token; role?: string; vars: Record<string, string> }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="h-12 overflow-hidden rounded-md border">
        <div className={SWATCH[token]} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-mono text-xs">{token}</span>
        <span className="font-mono text-xs text-muted-foreground">{hex(vars[token])}</span>
        {role && <span className="text-xs text-muted-foreground">{role}</span>}
      </div>
    </div>
  )
}

function TextSample({ token }: { token: Token }) {
  switch (token) {
    case "foreground":
      return <span className="flex size-12 shrink-0 items-center justify-center rounded-md border text-xl font-semibold text-foreground">Aa</span>
    case "muted-foreground":
      return <span className="flex size-12 shrink-0 items-center justify-center rounded-md border text-xl font-semibold text-muted-foreground">Aa</span>
    case "faint":
      return <span className="flex size-12 shrink-0 items-center justify-center rounded-md border text-xl font-semibold text-faint">Aa</span>
    case "primary-foreground":
      return <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-xl font-semibold text-primary-foreground">Aa</span>
    default:
      return null
  }
}

function StatusSample({ name }: { name: string }) {
  switch (name) {
    case "destructive":
      return (
        <span className="flex items-center gap-2 rounded-md border border-destructive-border bg-destructive-subtle px-3 py-2 text-sm text-destructive">
          <XCircleIcon className="size-4" aria-hidden /> Couldn’t read ~/Desktop
        </span>
      )
    case "success":
      return (
        <span className="flex items-center gap-2 rounded-md border border-success-border bg-success-subtle px-3 py-2 text-sm text-success">
          <CheckIcon className="size-4" aria-hidden /> 26 files moved
        </span>
      )
    case "warning":
      return (
        <span className="flex items-center gap-2 rounded-md border border-warning-border bg-warning-subtle px-3 py-2 text-sm text-warning">
          <TriangleAlertIcon className="size-4" aria-hidden /> Sync is 2 h behind
        </span>
      )
    case "info":
      return (
        <span className="flex items-center gap-2 rounded-md border border-info-border bg-info-subtle px-3 py-2 text-sm text-info">
          <InfoIcon className="size-4" aria-hidden /> Retrying in 30 s
        </span>
      )
    default:
      return null
  }
}
