import { useState, type ReactNode } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { href } from "./router"

export function PageHeader({
  group,
  title,
  lead,
  meta,
  children,
}: {
  group: string
  title: string
  /** One sentence under the title; `children` is the same thing. */
  lead?: ReactNode
  /** Mono line under the lead: pattern id, signature, version. */
  meta?: ReactNode
  children?: ReactNode
}) {
  const summary = lead ?? children
  return (
    <header className="flex flex-col gap-3 pb-10">
      <span data-label className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {group}
      </span>
      <h1 data-display className="text-5xl leading-none font-bold tracking-tight text-balance md:text-6xl">
        {title}
      </h1>
      {summary && <p className="max-w-prose text-base text-muted-foreground">{summary}</p>}
      {meta && <div className="font-mono text-xs text-faint">{meta}</div>}
    </header>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span data-slot="wordmark" className={cn("font-mono font-bold tracking-tight", className)}>
      proof<span className="text-tool">.</span>
    </span>
  )
}

export function Section({ title, children, note, id }: { title: string; children: ReactNode; note?: ReactNode; id?: string }) {
  return (
    <section className="flex scroll-mt-20 flex-col gap-4 pb-12" id={id ?? slug(title)} data-toc={title}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {note && <p className="max-w-prose text-sm text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  )
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export function PatternId({ children }: { children: string }) {
  return (
    <span data-slot="pattern-id" className="font-mono text-xs text-faint">
      {children}
    </span>
  )
}

export function Chip({ id, children, size = "default" }: { id: string; children: ReactNode; size?: "default" | "sm" }) {
  return (
    <a
      href={href(id)}
      data-size={size}
      className="inline-flex h-7 items-center gap-1 rounded-full border border-border-strong bg-card px-3 text-xs text-foreground transition-colors hover:border-border-heavy hover:text-muted-foreground data-[size=sm]:h-6 data-[size=sm]:px-2.5 data-[size=sm]:text-xs"
    >
      {children}
    </a>
  )
}

export function Uses({ ids }: { ids: [id: string, title: string][] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-faint">Uses</span>
      {ids.map(([id, title]) => (
        <Chip key={id} id={id} size="sm">
          {title}
        </Chip>
      ))}
    </div>
  )
}

export function Related({ ids }: { ids: [id: string, title: string][] }) {
  return (
    <Section title="Related">
      <div className="flex flex-wrap gap-2">
        {ids.map(([id, title]) => (
          <Chip key={id} id={id}>
            {title} →
          </Chip>
        ))}
      </div>
    </Section>
  )
}

// The stage paints the page background so the component sits as it would in an app.
export function Example({ children, code, align = "center" }: { children: ReactNode; code?: string; align?: "center" | "start" | "stretch" }) {
  const stage = (
    <div
      data-align={align}
      className="flex min-h-48 min-w-0 flex-wrap items-center *:max-w-full justify-center gap-4 rounded-lg border bg-background p-8 data-[align=start]:items-start data-[align=start]:justify-start data-[align=stretch]:flex-col data-[align=stretch]:items-stretch"
    >
      {children}
    </div>
  )
  if (!code) return stage
  return (
    <Tabs defaultValue="preview">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">{stage}</TabsContent>
      <TabsContent value="code">
        <Code>{code}</Code>
      </TabsContent>
    </Tabs>
  )
}

export function Code({ children }: { children: string }) {
  return (
    <div className="relative">
      <pre className="max-h-120 overflow-auto rounded-lg border bg-muted p-4 font-mono text-xs/5">{children.trim()}</pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={children.trim()} />
      </div>
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Copy"
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1400)
      }}
    >
      {done ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}

export const REGISTRY_URL = "https://serhiitroinin.github.io/proof/r/{name}.json"

export function Install({ name }: { name: string }) {
  return <Code>{`npx shadcn@latest add @proof/${name}`}</Code>
}
