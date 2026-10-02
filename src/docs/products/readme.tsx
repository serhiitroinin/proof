import { useState } from "react"
import { FileTextIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Motif } from "@/components/ui/motif"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, TerminalLine, TerminalPrompt, TerminalText } from "@/components/ui/terminal"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToolMark, TOOLS } from "@/components/ui/tool-mark"
import { WindowCanvas } from "@/components/ui/window"

import { ProductPage, useSeen } from "./shared"

const TOOL = "butler"
const NAME = "Butler"
const TAGLINE = "Tidy folders with an agent you can overrule."

const INSTALL = {
  Homebrew: `brew install serhiitroinin/tap/${TOOL}`,
  Source: `git clone https://github.com/serhiitroinin/${TOOL}\ncd ${TOOL} && make install`,
} as const

const LICENSE = `MIT License

Copyright (c) 2026 Serhii Troinin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction…`

export default function ReadmePage() {
  return (
    <ProductPage
      tool={TOOL}
      title="README"
      lead="The README for Butler as GitHub renders it, so the mark, the wordmark and the figure travel as images."
      uses={["Tool Mark", "Typography", "Tabs", "Toggle Group", "Copy Button", "Motif", "Terminal"]}
      look={[
        "The rule draws once when it scrolls into view. On GitHub it is an SVG with the same animation.",
        "The install line copies; the shape glyph landing is the confirmation.",
        "The family row names the other tools by their marks; the current one is lit.",
        "The social preview is dotted paper with the mark, the wordmark and the rule.",
      ]}
      related={[
        { id: "cli", title: "Terminal" },
        { id: "tool-mark", title: "Tool Mark" },
        { id: "typography", title: "Typography" },
      ]}
    >
      <div className="flex flex-col gap-8">
        <Repo />
        <SocialPreview />
      </div>
    </ProductPage>
  )
}

function Repo() {
  const [tab, setTab] = useState("readme")
  const [pm, setPm] = useState<keyof typeof INSTALL>("Homebrew")
  const [ruleRef, seen] = useSeen<HTMLDivElement>()
  const install = INSTALL[pm]

  return (
    <div className="max-w-4xl overflow-hidden rounded-xl border border-card-border bg-card shadow-md">
      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
          <TabsList>
            <TabsTrigger value="readme">README</TabsTrigger>
            <TabsTrigger value="license">License</TabsTrigger>
          </TabsList>
          <span className="flex items-center gap-1.5 font-mono text-xs text-faint">
            <FileTextIcon className="size-3" />
            {tab === "readme" ? "README.md" : "LICENSE"}
          </span>
        </div>
        <TabsContent value="license">
          <pre className="m-0 px-8 py-7 font-mono text-sm leading-6 whitespace-pre-wrap text-muted-foreground">{LICENSE}</pre>
        </TabsContent>
        <TabsContent value="readme">
          <article className="flex flex-col px-8 py-7">
            <div className="flex items-center gap-3.5">
              <ToolMark tool={TOOL} size={56} />
              <span className="text-5xl font-semibold tracking-tight text-foreground">{NAME}</span>
            </div>
            <p className="mt-3.5 text-base text-foreground">{TAGLINE}</p>
            <div className="mt-3 mb-6 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">v0.4.2</Badge>
              <Badge variant="outline">macOS 15+</Badge>
              <Badge variant="outline">MIT</Badge>
              <Badge variant="success" dot>
                build passing
              </Badge>
            </div>

            <div className="max-w-2xl overflow-hidden rounded-lg border border-border bg-popover">
              <Terminal>
                <TerminalLine>
                  <TerminalPrompt>
                    <TerminalText tone="bold">{TOOL} --help</TerminalText>
                  </TerminalPrompt>
                </TerminalLine>
                <TerminalLine>
                  <TerminalText tone="muted">usage</TerminalText> {TOOL} {"<command> [flags]"}
                </TerminalLine>
                <TerminalLine />
                <TerminalLine>
                  {"  "}
                  <TerminalText tone="accent">●</TerminalText> today
                  {"     "}
                  <TerminalText tone="muted">the numbers that matter right now</TerminalText>
                </TerminalLine>
                <TerminalLine>
                  {"  "}
                  <TerminalText tone="faint">·</TerminalText> history
                  {"   "}
                  <TerminalText tone="muted">raw readings, as JSON with --json</TerminalText>
                </TerminalLine>
                <TerminalLine>
                  {"  "}
                  <TerminalText tone="faint">·</TerminalText> sync
                  {"      "}
                  <TerminalText tone="muted">pull the latest data</TerminalText>
                </TerminalLine>
              </Terminal>
            </div>

            <h2 className="mt-8 mb-3 border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground">Install</h2>
            <div className="mb-2 w-50">
              <ToggleGroup
                value={[pm]}
                onValueChange={(v) => v[0] && setPm(v[0] as keyof typeof INSTALL)}
                size="sm"
                className="w-full"
                aria-label="Install from"
              >
                <ToggleGroupItem value="Homebrew" className="flex-1">
                  Homebrew
                </ToggleGroupItem>
                <ToggleGroupItem value="Source" className="flex-1">
                  Source
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="relative max-w-2xl rounded-lg bg-muted px-4 py-3 font-mono text-sm leading-6 whitespace-pre text-foreground">
              <span className="text-muted-foreground"># {pm}</span>
              {"\n"}
              {install}
              <span className="absolute top-2 right-2">
                <CopyButton text={install} variant="ghost" size="icon-sm" copiedLabel="Copied" />
              </span>
            </div>

            <h2 className="mt-8 mb-3 border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground">Why</h2>
            <p className="max-w-prose text-base leading-7 text-foreground">
              {NAME} does one job, keeps your data on your machine, and gets out of the way.
            </p>

            <div ref={ruleRef} className="mt-7 mb-4.5 min-h-3">
              {seen && <Motif state="done" width={720} size={9} className="block max-w-full" />}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-faint uppercase">Part of the family</span>
              {TOOLS.map((t) => (
                <a
                  key={t}
                  href="#"
                  title={t}
                  data-on={t === TOOL || undefined}
                  onClick={(e) => e.preventDefault()}
                  className="rounded-sm opacity-40 transition-opacity hover:opacity-100 data-on:opacity-100"
                >
                  <ToolMark tool={t} size={18} />
                </a>
              ))}
              <span className="ml-auto text-sm text-faint">serhii.tools</span>
            </div>
          </article>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Positioned on a 128px grid.
function SocialPreview() {
  return (
    <div>
      <div className="mb-2.5 font-mono text-xs text-faint uppercase">Social preview · 1280 × 640 (shown at 50%)</div>
      <div className="h-80 w-160 overflow-hidden rounded-xl border border-card-border shadow-md">
        <WindowCanvas className="h-[640px] w-[1280px] origin-top-left scale-50">
          <div className="absolute top-32 right-32 grid size-96 place-items-center">
            <ToolMark tool={TOOL} size={384} />
          </div>
          <div className="absolute top-32 left-32 flex w-160 flex-col">
            <span className="font-mono text-2xl tracking-wide text-faint uppercase">serhii.tools / {TOOL}</span>
            <span className="mt-7 text-9xl font-semibold tracking-tight text-foreground">{NAME}</span>
            <span className="mt-6 text-4xl leading-tight text-muted-foreground">{TAGLINE}</span>
          </div>
          <div className="absolute bottom-24 left-32">
            <Motif state="idle" width={1024} size={22} />
          </div>
        </WindowCanvas>
      </div>
    </div>
  )
}
