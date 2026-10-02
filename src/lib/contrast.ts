import { formatHex, parse, wcagContrast } from "culori"

// Shared by the Accessibility page and scripts/contrast.ts. Text needs 4.5:1 (1.4.3). Control
// edges, rings and indicators need 3:1 (1.4.11). A hairline only has to be visible: 1.3:1.

export type Pair = { name: string; fg: string; bg: string; min: number }
export type Check = Pair & { fgValue: string; bgValue: string; ratio: number; pass: boolean }

export const PAIRS: Pair[] = [
  { name: "Text on background", fg: "foreground", bg: "background", min: 4.5 },
  { name: "Text on card", fg: "card-foreground", bg: "card", min: 4.5 },
  { name: "Text on popover", fg: "popover-foreground", bg: "popover", min: 4.5 },
  { name: "Muted text on background", fg: "muted-foreground", bg: "background", min: 4.5 },
  { name: "Muted text on muted", fg: "muted-foreground", bg: "muted", min: 4.5 },
  { name: "Muted text on card", fg: "muted-foreground", bg: "card", min: 4.5 },
  { name: "Primary button label", fg: "primary-foreground", bg: "primary", min: 4.5 },
  { name: "Secondary button label", fg: "secondary-foreground", bg: "secondary", min: 4.5 },
  { name: "Accent (hover) label", fg: "accent-foreground", bg: "accent", min: 4.5 },
  { name: "Destructive text on background", fg: "destructive", bg: "background", min: 4.5 },
  { name: "Brand button label", fg: "brand-foreground", bg: "brand", min: 4.5 },
  { name: "Success text on background", fg: "success", bg: "background", min: 4.5 },
  { name: "Warning text on background", fg: "warning", bg: "background", min: 4.5 },
  { name: "Info text on background", fg: "info", bg: "background", min: 4.5 },
  { name: "Sidebar text", fg: "sidebar-foreground", bg: "sidebar", min: 4.5 },
  { name: "Border on background", fg: "border", bg: "background", min: 1.3 },
  { name: "Border on card", fg: "border", bg: "card", min: 1.3 },
  { name: "Input edge on card", fg: "input", bg: "card", min: 1.3 },
  { name: "Faint text on background", fg: "faint", bg: "background", min: 4.5 },
  { name: "Family butler mark on background", fg: "family-butler", bg: "background", min: 3 },
  { name: "Family easel mark on background", fg: "family-easel", bg: "background", min: 3 },
  { name: "Family sculpt mark on background", fg: "family-sculpt", bg: "background", min: 3 },
  { name: "Family reins mark on background", fg: "family-reins", bg: "background", min: 3 },
  { name: "Family glu mark on background", fg: "family-glu", bg: "background", min: 3 },
  { name: "Family strap mark on background", fg: "family-strap", bg: "background", min: 3 },
  { name: "Family vellum mark on background", fg: "family-vellum", bg: "background", min: 3 },
  { name: "Tool label", fg: "tool-foreground", bg: "tool", min: 4.5 },
  { name: "Tool text on tool subtle", fg: "tool-text", bg: "tool-subtle", min: 4.5 },
  { name: "Destructive text on subtle", fg: "destructive", bg: "destructive-subtle", min: 4.5 },
  { name: "Success text on subtle", fg: "success", bg: "success-subtle", min: 4.5 },
  { name: "Warning text on subtle", fg: "warning", bg: "warning-subtle", min: 4.5 },
  { name: "Info text on subtle", fg: "info", bg: "info-subtle", min: 4.5 },
  { name: "Muted text on fill", fg: "muted-foreground", bg: "fill", min: 4.5 },
  { name: "Checkbox edge on card", fg: "border-control", bg: "card", min: 3 },
  { name: "Focus ring on background", fg: "ring", bg: "background", min: 3 },
  { name: "Brand on background", fg: "brand", bg: "background", min: 3 },
]

export function contrast(fg: string, bg: string): number {
  const a = parse(fg.trim())
  const b = parse(bg.trim())
  if (!a || !b) return 0
  return wcagContrast(a, b)
}

export function toHex(value: string): string {
  const c = parse(value.trim())
  return c ? formatHex(c) : value.trim()
}

// vars: token name without the leading dashes → CSS colour value.
export function audit(vars: Record<string, string>): Check[] {
  return PAIRS.map((p) => {
    const fgValue = vars[p.fg] ?? ""
    const bgValue = vars[p.bg] ?? ""
    const ratio = fgValue && bgValue ? contrast(fgValue, bgValue) : 0
    return { ...p, fgValue, bgValue, ratio, pass: ratio >= p.min - 0.005 }
  })
}

// Pull `--name: value;` declarations out of one CSS block body.
export function parseBlock(css: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) out[m[1]] = m[2].trim()
  return out
}

// The body of a top-level `selector { … }` block, matching braces so nested rules survive.
export function blockOf(css: string, selector: string): string {
  const re = new RegExp(`(^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`, "g")
  const m = re.exec(css)
  if (!m) return ""
  let depth = 1
  let i = m.index + m[0].length
  const start = i
  while (i < css.length && depth > 0) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") depth--
    i++
  }
  return css.slice(start, i - 1)
}
