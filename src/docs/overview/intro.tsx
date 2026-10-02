import type { ReactNode } from "react"
import { ArrowRightIcon, CheckIcon, FolderIcon, SearchIcon, Undo2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Motif } from "@/components/ui/motif"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { ToolMark, type ToolName } from "@/components/ui/tool-mark"
import { TOOL_PRESETS } from "@/lib/theme"

import { Code, Install, PageHeader, REGISTRY_URL, Section, Wordmark } from "../kit"
import { components } from "../registry"
import { href } from "../router"

const PRINCIPLES: [string, string][] = [
  ["Ink first", "Pages are near-black on near-white. Colour marks one thing: the selection, the action, the value out of range."],
  ["One accent per tool", "Each tool has one hue. Paper, type, shape, motion and the signature stay the same."],
  ["Show the work", "Long jobs draw the motif line. Plans show before they run. Every change can be undone where it was made."],
  ["Keyboard is the fast path", "Every action has a key. Menus, tooltips and the palette show the shortcut next to the label."],
]

const FAMILY: { tool: ToolName; name: string }[] = [
  { tool: "butler", name: "Butler" },
  { tool: "easel", name: "Easel" },
  { tool: "sculpt", name: "Sculpt" },
  { tool: "reins", name: "Reins" },
  { tool: "glu", name: "glu" },
  { tool: "strap", name: "strap" },
  { tool: "vellum", name: "Vellum" },
]

const tagline = (name: string) => TOOL_PRESETS.find((p) => p.name.toLowerCase() === name.toLowerCase())?.note ?? ""

export default function Introduction() {
  return (
    <>
      <PageHeader
        group="Overview"
        title="Introduction"
        lead="Components, tokens and a signature for small, local-first tools."
      />

      <div className="grid gap-10 border-b pb-10 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <p className="max-w-prose text-base text-muted-foreground">
            A shadcn registry. Add a component and you get its source, built on Base UI and Tailwind v4, styled by the Native theme.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button nativeButton={false} render={<a href={href("button")} />}>
              Browse components
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" nativeButton={false} render={<a href={href("playground")} />}>
              Open the playground
            </Button>
          </div>
          <span className="font-mono text-xs text-faint">
            {components.length} components · 1 theme · light and dark
          </span>
        </div>
        <div className="flex min-h-56 items-center justify-center rounded-xl border bg-card">
          <Wordmark className="text-7xl" />
        </div>
      </div>

      <div className="pt-10">
        <Section title="Get started" note="You need a shadcn project with Tailwind v4 and a Base UI style.">
          <ol className="flex flex-col gap-6">
            <Step n={1} title="Add the registry to components.json">
              <Code>{`{\n  "registries": {\n    "@proof": "${REGISTRY_URL}"\n  }\n}`}</Code>
            </Step>
            <Step n={2} title="Add the theme">
              <Install name="native" />
            </Step>
            <Step n={3} title="Add components">
              <Code>{"npx shadcn@latest add @proof/button @proof/input @proof/textarea"}</Code>
            </Step>
          </ol>
        </Section>

        <Section title="Principles">
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(([title, body], i) => (
              <Card key={title} variant="flat" size="sm">
                <CardContent className="flex flex-col gap-2">
                  <span data-label className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    0{i + 1}
                  </span>
                  <b className="text-base font-bold tracking-tight">{title}</b>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Foundations">
        <div className="grid gap-4 sm:grid-cols-2">
          <Tile id="colour" title="Colour" blurb="Ink, paper, one accent, four statuses.">
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-foreground" />
              <span className="size-6 rounded-full border bg-card" />
              <span className="size-6 rounded-full bg-tool" />
              <span className="size-6 rounded-full bg-success" />
              <span className="size-6 rounded-full bg-warning" />
              <span className="size-6 rounded-full bg-destructive" />
            </div>
          </Tile>
          <Tile id="typography" title="Typography" blurb="One sans, one mono, tabular figures.">
            <span data-display className="text-5xl leading-none font-bold tracking-tight">
              Aa
            </span>
          </Tile>
          <Tile id="motion" title="Motion" blurb="220ms, one curve, the motif for every long job.">
            <Motif width={200} size={8} progress={0.62} state="running" />
          </Tile>
          <Tile id="icons" title="Icons" blurb="Lucide at 16px, 1.5px stroke, quiet.">
            <div className="flex items-center gap-4 text-muted-foreground">
              <FolderIcon className="size-5" />
              <SearchIcon className="size-5" />
              <CheckIcon className="size-5" />
              <Undo2Icon className="size-5" />
            </div>
          </Tile>
        </div>
      </Section>

      <Section title="Components" note="Each page shows the install command and every example as Preview and Code.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile id="button" title="Button" blurb="Raised at rest, sunk when pressed.">
            <div className="flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </div>
          </Tile>
          <Tile id="input" title="Input" blurb="A well with a hairline.">
            <Input className="w-40" placeholder="Search" aria-label="Search" />
          </Tile>
          <Tile id="badge" title="Badge" blurb="Status as a tint, not a fill.">
            <div className="flex gap-2">
              <Badge variant="tool">Proposed</Badge>
              <Badge variant="success">Approved</Badge>
            </div>
          </Tile>
          <Tile id="checkbox" title="Choices" blurb="Checks, radios and switches.">
            <div className="flex items-center gap-4">
              <Label>
                <Checkbox defaultChecked />
                Keep
              </Label>
              <Label>
                <Switch defaultChecked />
                Sync
              </Label>
            </div>
          </Tile>
          <Tile id="progress" title="Progress" blurb="The line, the dot and the stall.">
            <Progress value={48} className="w-40" />
          </Tile>
          <Tile id="tool-mark" title="Tool Mark" blurb="One mark per tool: ink line plus accent shape.">
            <div className="flex gap-3">
              <ToolMark tool="glu" size={28} />
              <ToolMark tool="strap" size={28} />
              <ToolMark tool="vellum" size={28} />
            </div>
          </Tile>
        </div>
      </Section>

      <Section title="One accent per tool" note="Wrap a tool in ToolScope to set its accent and mark. Nothing else changes.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILY.map(({ tool, name }) => (
            <Card key={tool} variant="flat" size="sm">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ToolMark tool={tool} size={24} />
                  <span className="text-lg font-bold tracking-tight">{name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tagline(name)}</p>
                <div className="flex items-center gap-2">
                  <span
                    data-tool={tool}
                    className="size-3 rounded-full data-[tool=butler]:bg-family-butler data-[tool=easel]:bg-family-easel data-[tool=glu]:bg-family-glu data-[tool=reins]:bg-family-reins data-[tool=sculpt]:bg-family-sculpt data-[tool=strap]:bg-family-strap data-[tool=vellum]:bg-family-vellum"
                  />
                  <span className="font-mono text-xs text-faint">❯ {tool} ● ready</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

function Tile({ id, title, blurb, children }: { id: string; title: string; blurb: string; children: ReactNode }) {
  return (
    <a href={href(id)} className="group/tile flex flex-col overflow-hidden rounded-xl border border-card-border bg-card transition-colors hover:border-border-heavy">
      <div className="flex min-h-32 items-center justify-center border-b bg-background p-6">{children}</div>
      <div className="flex flex-col gap-0.5 p-4">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">{blurb}</span>
      </div>
    </a>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-2">
      <span className="text-sm font-semibold">
        <span className="mr-2 font-mono text-xs text-faint">0{n}</span>
        {title}
      </span>
      {children}
    </li>
  )
}
