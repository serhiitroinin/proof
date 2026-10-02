import { clampChroma, formatHex, oklch, parse, wcagContrast } from "culori"

import { blockOf, parseBlock } from "@/lib/contrast"
import globals from "@/styles/globals.css?raw"

// Theme editor. Overrides neutral tint, tool accent, brand and radius on top of globals.css.

type Vars = Record<string, string>
export type ThemeTokens = { light: Vars; dark: Vars }

export type ThemeSettings = {
  /** Hue and chroma (OKLCH) of every neutral token; null keeps the theme's own. */
  neutral: { hue: number; chroma: number } | null
  /** Tool accent as #rrggbb; null keeps the theme's own. */
  tool: string | null
  /** Brand colour as #rrggbb; null keeps the theme's own. */
  brand: string | null
  /** Control radius in px; null keeps the theme's 8. */
  radius: number | null
}

export const DEFAULTS: ThemeSettings = { neutral: null, tool: null, brand: null, radius: null }
export const RADII = [0, 4, 6, 8, 10, 12] as const

/** One accent per tool. */
export const TOOL_PRESETS: ReadonlyArray<{ name: string; hex: string; note: string }> = [
  { name: "Butler", hex: "#5e6b4e", note: "Tidy folders with an agent you can overrule." },
  { name: "Easel", hex: "#e2482b", note: "A canvas for laying out real UI." },
  { name: "Sculpt", hex: "#ffb020", note: "Shape 3D parts from plain text." },
  { name: "Reins", hex: "#3d5a80", note: "Hold many agents on a short rein." },
  { name: "glu", hex: "#5f8f72", note: "Libre 3 glucose in your shell." },
  { name: "strap", hex: "#c8644a", note: "WHOOP recovery, strain and sleep." },
  { name: "Vellum", hex: "#6a5acd", note: "Design files that live next to the code." },
]
export const BRAND_PRESETS = TOOL_PRESETS

export const STORAGE_KEY = "theme-editor"
const STYLE_ID = "theme-editor"

const NEUTRAL = [
  "background", "foreground", "card", "card-foreground", "card-border", "popover", "popover-foreground",
  "primary", "primary-foreground", "primary-hover", "secondary", "secondary-foreground", "muted",
  "muted-foreground", "faint", "accent", "accent-foreground", "fill", "fill-hover", "fill-active", "border",
  "border-strong", "border-heavy", "border-control", "input", "surface-1", "surface-2", "surface-3",
  "surface-4", "skeleton", "skeleton-highlight", "chart-5", "sidebar", "sidebar-foreground", "sidebar-primary",
  "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border",
]

/** Light and dark tokens, merged like the cascade merges them. */
export function baseTokens(): ThemeTokens {
  const root = parseBlock(blockOf(globals, ":root"))
  return { light: root, dark: { ...root, ...parseBlock(blockOf(globals, ".dark")) } }
}

/** Neutral hue and chroma of the background. */
export function baseNeutral() {
  const c = oklch(parse(baseTokens().light.background))
  return { hue: Math.round(c?.h ?? 0), chroma: Number((c?.c ?? 0).toFixed(3)) }
}

const hex = (l: number, c: number, h: number) =>
  formatHex(clampChroma({ mode: "oklch", l: Math.min(1, Math.max(0, l)), c, h }, "oklch"))

const lch = (color: string) => oklch(parse(color)) ?? { mode: "oklch" as const, l: 0, c: 0, h: 0 }

/** Moves `fg` lightness away from `bg` until the pair reaches `min`. */
const reach = (fg: string, bg: string, min: number) => {
  const c = lch(fg)
  const dir = c.l < lch(bg).l ? -1 : 1
  let out = fg
  for (let i = 1; i <= 60 && wcagContrast(out, bg) < min; i++) out = hex(c.l + dir * 0.01 * i, c.c, c.h ?? 0)
  return out
}

/** A fill that carries a label at AA: white or the mode's ink, whichever reads better, nudging the fill if needed. */
const solid = (fill: string, ink: string): [string, string] => {
  const on = wcagContrast(fill, "#ffffff") >= wcagContrast(fill, ink) ? "#ffffff" : ink
  return [reach(fill, on, 4.5), on]
}

function accent(v: Vars, color: string, dark: boolean, prefix: "tool" | "brand") {
  const { l, c, h = 0 } = lch(color)
  const bg = v.background
  const fill = dark ? hex(Math.max(l, 0.62), c, h) : color
  const [f, on] = solid(fill, dark ? bg : v.foreground)
  const subtle = dark ? hex(0.27, Math.min(c * 0.3, 0.04), h) : hex(0.96, Math.min(c * 0.25, 0.03), h)
  const text = reach(dark ? hex(0.8, c * 0.7, h) : hex(l, c, h), subtle, 4.5)
  if (prefix === "tool") {
    v.tool = f
    v["tool-foreground"] = on
    v["tool-subtle"] = subtle
    v["tool-text"] = text
    v["tool-border"] = dark ? hex(0.42, c * 0.5, h) : hex(0.84, c * 0.45, h)
    v.selection = dark ? hex(0.32, Math.min(c * 0.4, 0.05), h) : hex(0.93, Math.min(c * 0.3, 0.04), h)
    v.ring = v["sidebar-ring"] = reach(dark ? hex(Math.max(l, 0.6), c, h) : color, bg, 3)
  } else {
    v.brand = f
    v["brand-foreground"] = on
    v["brand-subtle"] = subtle
    v["brand-text"] = reach(color, bg, 4.5)
    v["chart-1"] = color
  }
}

export function generateTokens(s: ThemeSettings): ThemeTokens {
  const base = baseTokens()
  const out: ThemeTokens = { light: { ...base.light }, dark: { ...base.dark } }
  for (const [mode, v] of Object.entries(out) as Array<[keyof ThemeTokens, Vars]>) {
    const dark = mode === "dark"
    if (s.neutral) {
      const ref = lch(base[mode].background).c || 0.001
      for (const k of NEUTRAL) {
        const c = lch(v[k])
        // Keep each token's lightness and its chroma relative to the background; swap the hue.
        v[k] = hex(c.l, (c.c / ref) * s.neutral.chroma, s.neutral.hue)
      }
    }
    if (s.tool) accent(v, s.tool, dark, "tool")
    if (s.brand) accent(v, s.brand, dark, "brand")
  }
  return out
}

const COLOURS = /^#|^rgb|^oklch/

const block = (vars: Vars) =>
  Object.entries(vars)
    .filter(([, v]) => COLOURS.test(v))
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n")

const radiusOf = (s: ThemeSettings) => (s.radius === null ? "0.5rem" : s.radius === 0 ? "0" : `${s.radius / 16}rem`)

/** Clean `:root` and `.dark` colour blocks for a project's globals.css. */
export function toCss(s: ThemeSettings): string {
  const { light, dark } = generateTokens(s)
  return `:root {\n  --radius: ${radiusOf(s)};\n${block(light)}\n}\n\n.dark {\n${block(dark)}\n}\n`
}

export const isDefault = (s: ThemeSettings) => !s.neutral && !s.tool && !s.brand && s.radius === null

export function readStoredTheme(): ThemeSettings {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<ThemeSettings>
    const hexOrNull = (x: unknown) => (typeof x === "string" && /^#[0-9a-f]{6}$/i.test(x) ? x : null)
    return {
      neutral:
        p.neutral && typeof p.neutral.hue === "number" && typeof p.neutral.chroma === "number" ? p.neutral : null,
      tool: hexOrNull(p.tool),
      brand: hexOrNull(p.brand),
      radius: typeof p.radius === "number" ? p.radius : null,
    }
  } catch {
    return DEFAULTS
  }
}

/** Writes the overrides to <style id="theme-editor"> and saves them. */
export function applyTheme(s: ThemeSettings) {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (isDefault(s)) {
    style?.remove()
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  if (!style) {
    style = document.createElement("style")
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  const { light, dark } = generateTokens(s)
  style.textContent = `:root:root {\n  --radius: ${radiusOf(s)};\n${block(light)}\n}\n:root:root.dark {\n${block(dark)}\n}\n`
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

/** Call once on boot so a stored theme applies before the first render. */
export function applyStoredTheme() {
  const s = readStoredTheme()
  if (!isDefault(s)) applyTheme(s)
}
