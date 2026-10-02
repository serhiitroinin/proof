import type { ReactNode } from "react"

import { hex, type Vars } from "./use-tokens"

// Literal class strings per token so the Tailwind lint can read every class.

export const SWATCH = {
  background: "size-full bg-background",
  foreground: "size-full bg-foreground",
  card: "size-full bg-card",
  "card-foreground": "size-full bg-card-foreground",
  popover: "size-full bg-popover",
  "popover-foreground": "size-full bg-popover-foreground",
  primary: "size-full bg-primary",
  "primary-foreground": "size-full bg-primary-foreground",
  secondary: "size-full bg-secondary",
  "secondary-foreground": "size-full bg-secondary-foreground",
  muted: "size-full bg-muted",
  "muted-foreground": "size-full bg-muted-foreground",
  accent: "size-full bg-accent",
  "accent-foreground": "size-full bg-accent-foreground",
  destructive: "size-full bg-destructive",
  border: "size-full bg-border",
  input: "size-full bg-input",
  ring: "size-full bg-ring",
  brand: "size-full bg-brand",
  "brand-foreground": "size-full bg-brand-foreground",
  success: "size-full bg-success",
  warning: "size-full bg-warning",
  info: "size-full bg-info",
  "chart-1": "size-full bg-chart-1",
  "chart-2": "size-full bg-chart-2",
  "chart-3": "size-full bg-chart-3",
  "chart-4": "size-full bg-chart-4",
  "chart-5": "size-full bg-chart-5",
  sidebar: "size-full bg-sidebar",
  "sidebar-foreground": "size-full bg-sidebar-foreground",
  "sidebar-primary": "size-full bg-sidebar-primary",
  "sidebar-primary-foreground": "size-full bg-sidebar-primary-foreground",
  "sidebar-accent": "size-full bg-sidebar-accent",
  "sidebar-accent-foreground": "size-full bg-sidebar-accent-foreground",
  "sidebar-border": "size-full bg-sidebar-border",
  "sidebar-ring": "size-full bg-sidebar-ring",
} as const

export type Token = keyof typeof SWATCH
export const TOKENS = Object.keys(SWATCH) as Token[]

export function Swatch({ token, role, vars }: { token: Token; role?: string; vars: Vars }) {
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

export function SwatchGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{children}</div>
}

export function TokenTable({ rows, vars }: { rows: [token: string, role: string][]; vars?: Vars }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([token, role]) => (
            <tr key={token} className="border-b last:border-b-0">
              <td className="w-56 px-4 py-2 font-mono text-xs">{token}</td>
              <td className="px-4 py-2 text-muted-foreground">{role}</td>
              {vars && <td className="w-24 px-4 py-2 text-right font-mono text-xs text-muted-foreground">{hex(vars[token.replace(/^--/, "")])}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground marker:text-border">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs text-foreground">{children}</code>
}

export function Tile({ stage, name, meta }: { stage: ReactNode; name: string; meta?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {stage}
      <div className="flex flex-col">
        <span className="font-mono text-xs">{name}</span>
        {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
      </div>
    </div>
  )
}
