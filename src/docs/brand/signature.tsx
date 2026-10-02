import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Motif } from "@/components/ui/motif"
import { Switch } from "@/components/ui/switch"
import { ToolMark, TOOLS } from "@/components/ui/tool-mark"
import {
  NATIVE_SIGNATURE,
  SIGNATURE_KEYS,
  SIGNATURE_OPTIONS,
  resetSignature,
  setSignature,
  useSignature,
  type Signature,
  type SignatureKey,
} from "@/hooks/use-signature"

import { PageHeader, Related, Section } from "../kit"

const KEYS: Record<SignatureKey, [title: string, note: string]> = {
  marker: ["Marker", "How the accent marks the selected row, tab and menu item."],
  backdrop: ["Backdrop", "The surface behind pages and canvases."],
  frame: ["Frame", "How cards and windows are edged."],
  accent: ["Accent use", "How much surface the accent may cover."],
  controls: ["Controls", "Whether primary controls are ink or accent."],
  headings: ["Headings", "The case of display headings."],
}

function Mini({ k }: { k: SignatureKey }) {
  switch (k) {
    case "marker":
      return (
        <ItemGroup variant="outline" className="w-40">
          <Item size="xs">
            <ItemContent>
              <ItemTitle>Inbox</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="xs" aria-selected>
            <ItemContent>
              <ItemTitle>Downloads</ItemTitle>
            </ItemContent>
          </Item>
          <Item size="xs">
            <ItemContent>
              <ItemTitle>Desktop</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      )
    case "backdrop":
    case "frame":
      return (
        <Card size="sm" className="w-32">
          <CardContent>
            <span className="text-sm font-medium">Card</span>
          </CardContent>
        </Card>
      )
    case "accent":
      return (
        <div className="flex flex-col gap-1">
          <span data-label className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Plan
          </span>
          <span data-display className="text-3xl leading-none font-bold tracking-tight">
            9 moves
          </span>
          <div className="pt-2">
            <Badge variant="tool" dot>
              Proposed
            </Badge>
          </div>
        </div>
      )
    case "controls":
      return (
        <div className="flex items-center gap-4">
          <Button size="sm">Approve</Button>
          <Switch checked readOnly aria-label="Sync" />
        </div>
      )
    case "headings":
      return (
        <span data-display className="text-3xl leading-none font-bold tracking-tight">
          Inbox zero
        </span>
      )
  }
}

function Tile({ k, value, current }: { k: SignatureKey; value: string; current: boolean }) {
  // data-sig-preview scopes the option's CSS to this tile instead of <html>.
  const attrs = { [`data-${k}`]: value } as Record<string, string>
  return (
    <button
      type="button"
      aria-pressed={current}
      onClick={() => setSignature(k, value)}
      className="group/tile flex flex-col overflow-hidden rounded-xl border border-card-border bg-card text-left transition-colors outline-none hover:border-border-heavy focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-pressed:border-foreground aria-pressed:ring-1 aria-pressed:ring-foreground"
    >
      <div data-sig-preview {...attrs} className="flex min-h-32 w-full items-center justify-center border-b bg-background p-5">
        <Mini k={k} />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 py-2">
        <span className="font-mono text-xs">{value}</span>
        {current && <span className="text-xs text-faint">current</span>}
      </div>
    </button>
  )
}

const meta = (sig: Signature) => SIGNATURE_KEYS.map((k) => `${k} ${sig[k]}`).join(" · ")

export default function SignaturePage() {
  const sig = useSignature()
  const native = SIGNATURE_KEYS.every((k) => sig[k] === NATIVE_SIGNATURE[k])
  return (
    <>
      <PageHeader
        group="Brand"
        title="Signature"
        lead="The codes every tool shares, whatever its accent; click a tile to apply it to the site."
        meta={meta(sig)}
      />

      <div className="flex items-center gap-3 pb-10">
        <Button variant="outline" size="sm" disabled={native} onClick={resetSignature}>
          Reset to Native
        </Button>
        <span className="text-xs text-muted-foreground">{native ? "Native preset." : "Changed; saved in this browser."}</span>
      </div>

      {SIGNATURE_KEYS.map((k) => (
        <Section key={k} title={KEYS[k][0]} note={KEYS[k][1]}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNATURE_OPTIONS[k].map((v) => (
              <Tile key={v} k={k} value={v} current={sig[k] === v} />
            ))}
          </div>
        </Section>
      ))}

      <Section title="The motif" note="One ink line with the tool dot at the tip.">
        <div className="flex flex-col gap-6 rounded-lg border bg-background p-6">
          <Row label="rest">
            <Motif width={240} size={10} />
          </Row>
          <Row label="running">
            <Motif width={240} size={10} progress={0.58} state="running" />
          </Row>
          <Row label="stalled">
            <Motif width={240} size={10} progress={0.58} state="stalled" />
          </Row>
          <Row label="error">
            <Motif width={240} size={10} state="error" />
          </Row>
        </div>
      </Section>

      <Section title="Marks" note="One mark per tool: a 1.5px ink line and one solid shape in the tool accent.">
        <div className="flex flex-col gap-6 rounded-lg border bg-background p-6">
          <div className="flex flex-wrap items-center gap-6">
            {TOOLS.map((t) => (
              <div key={t} className="flex flex-col items-center gap-2">
                <ToolMark tool={t} size={40} />
                <span className="font-mono text-xs text-faint">{t}</span>
              </div>
            ))}
          </div>
          <Row label="minimum">
            <div className="flex items-end gap-4">
              <ToolMark tool="butler" size={12} />
              <ToolMark tool="butler" size={16} />
              <ToolMark tool="butler" size={24} />
              <ToolMark tool="butler" size={32} />
            </div>
          </Row>
        </div>
      </Section>

      <Related
        ids={[
          ["intro", "Introduction"],
          ["colour", "Colour"],
          ["motion", "Motion"],
          ["tool-mark", "Tool Mark"],
        ]}
      />
    </>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-16 font-mono text-xs text-faint">{label}</span>
      {children}
    </div>
  )
}
