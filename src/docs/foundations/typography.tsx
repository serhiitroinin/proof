import { useState } from "react"

import { Button } from "@/components/ui/button"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono, TokenTable } from "./shared"

type Sample = "Product" | "Numbers" | "Pangram"

const text = (sample: Sample, step: string) => {
  if (sample === "Numbers") return "1,204 files · 7.3 h · 82%"
  if (sample === "Pangram") return "Sphinx of black quartz, judge my vow"
  if (step === "3xl" || step === "2xl") return "Tidy folders"
  if (step === "xl" || step === "lg") return "Move 26 files to Sorted"
  return "Butler proposes a plan. Nothing moves until you approve."
}

export default function Page() {
  const [sample, setSample] = useState<Sample>("Product")
  const t = (step: string) => text(sample, step)
  return (
    <>
      <PageHeader group="Foundations" title="Typography">
        One system face, Tailwind’s type scale, tabular numerals on the whole page.
      </PageHeader>

      <Section title="Scale" note="Size and line height in pixels. Pages use the four smallest steps.">
        <div className="flex gap-1">
          {(["Product", "Numbers", "Pangram"] as const).map((s) => (
            <Button key={s} variant={s === sample ? "secondary" : "ghost"} size="sm" onClick={() => setSample(s)}>
              {s}
            </Button>
          ))}
        </div>
        <div className="flex flex-col divide-y rounded-lg border bg-card">
          <Row name="text-3xl" meta="30 / 36 · headings">
            <span className="truncate text-3xl font-semibold tracking-tight">{t("3xl")}</span>
          </Row>
          <Row name="text-2xl" meta="24 / 32 · page titles">
            <span className="truncate text-2xl font-semibold tracking-tight">{t("2xl")}</span>
          </Row>
          <Row name="text-xl" meta="20 / 28 · section titles">
            <span className="truncate text-xl font-semibold tracking-tight">{t("xl")}</span>
          </Row>
          <Row name="text-lg" meta="18 / 28 · dialog titles">
            <span className="truncate text-lg font-medium">{t("lg")}</span>
          </Row>
          <Row name="text-base" meta="16 / 24 · long-form text">
            <span className="truncate text-base">{t("base")}</span>
          </Row>
          <Row name="text-sm" meta="14 / 20 · UI default">
            <span className="truncate text-sm">{t("sm")}</span>
          </Row>
          <Row name="text-xs" meta="12 / 16 · labels, metadata">
            <span className="truncate text-xs">{t("xs")}</span>
          </Row>
        </div>
      </Section>

      <Section title="Families" note="Sans for text. Mono for code, paths and tokens.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-6">
            <span className="text-5xl leading-none">Aa Gg 01</span>
            <span className="pt-2 text-sm">font-sans · system-ui</span>
            <span className="font-mono text-xs text-muted-foreground">400 · 500 · 600</span>
            <span className="text-xs text-muted-foreground">Body, headings, controls</span>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-6">
            <span className="font-mono text-5xl leading-none">Aa Gg 01</span>
            <span className="pt-2 font-mono text-sm">font-mono · ui-monospace</span>
            <span className="font-mono text-xs text-muted-foreground">400 · 500</span>
            <span className="text-xs text-muted-foreground">Code, paths, tokens, keycaps</span>
          </div>
        </div>
      </Section>

      <Section title="Weights" note="Three weights.">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 text-base">
          <span className="font-normal">400 Regular · body text, table cells, descriptions</span>
          <span className="font-medium">500 Medium · buttons, labels, selected nav item</span>
          <span className="font-semibold">600 Semibold · headings and titles</span>
        </div>
      </Section>

      <Section title="Labels, code and numbers">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
          <span className="text-xs font-medium text-muted-foreground">Sleep · 14 nights · v0.4.2</span>
          <span className="font-mono text-sm">~/Downloads → ~/Documents/Sorted · glu tir --days 14</span>
          <span className="text-base">
            11.11 · 88.88 · 1,204 KB <span className="text-muted-foreground">(tabular numerals: same width per digit)</span>
          </span>
        </div>
        <Bullets
          items={[
            <>
              Labels are <Mono>text-xs font-medium text-muted-foreground</Mono>, sentence case, not uppercase.
            </>,
            <>
              Code, paths and token names are <Mono>font-mono text-xs</Mono> or <Mono>text-sm</Mono>.
            </>,
            <>
              Only headings use <Mono>tracking-tight</Mono>.
            </>,
            <>
              Long-form text is <Mono>text-base</Mono> at <Mono>max-w-prose</Mono>; UI text is <Mono>text-sm</Mono>.
            </>,
          ]}
        />
      </Section>

      <Section title="Tokens">
        <TokenTable
          rows={[
            ["--font-sans", "system-ui, -apple-system, Segoe UI, Roboto"],
            ["--font-heading", "Same as --font-sans"],
            ["--font-mono", "ui-monospace, SF Mono, Menlo, Consolas"],
            ["font-variant-numeric", "tabular-nums, set on html"],
          ]}
        />
      </Section>
    </>
  )
}

function Row({ name, meta, children }: { name: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="grid items-baseline gap-4 px-6 py-4 sm:grid-cols-[7rem_minmax(0,1fr)_11rem]">
      <span className="font-mono text-xs text-muted-foreground">{name}</span>
      <div className="min-w-0">{children}</div>
      <span className="text-xs text-muted-foreground sm:text-right">{meta}</span>
    </div>
  )
}
