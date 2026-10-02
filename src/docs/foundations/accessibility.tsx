import { useEffect, useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useMode } from "@/hooks/use-mode"
import { audit, PAIRS, type Check } from "@/lib/contrast"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono, TOKENS } from "./shared"
import { hex, useTokens, type Vars } from "./use-tokens"

export default function Page() {
  const mode = useMode()
  const live = useTokens(TOKENS)
  const other = useAuthored(mode === "dark" ? ":root" : ".dark")
  const light = audit(mode === "light" ? live : other)
  const dark = audit(mode === "dark" ? live : other)
  const fails = [...light, ...dark].filter((c) => !c.pass).length
  return (
    <>
      <PageHeader group="Foundations" title="Accessibility">
        Every colour pair is checked in both modes: 4.5:1 for text, 3:1 for focus rings and indicators, 1.3:1 for hairlines.
      </PageHeader>

      <Section
        title="Contrast audit"
        note={`${PAIRS.length} pairs × 2 modes. ${fails ? `${fails} failing.` : "All pass."} The ${mode} column is live; the other reads globals.css. pnpm contrast runs the same check in CI.`}
      >
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Pair</th>
                <th className="px-4 py-2 text-right font-medium">Min</th>
                <th className="px-4 py-2 text-left font-medium">Light</th>
                <th className="px-4 py-2 text-left font-medium">Dark</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map((p, i) => (
                <tr key={p.name} className="border-t">
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.fg} / {p.bg}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">{p.min.toFixed(1)}</td>
                  <td className="px-4 py-2">
                    <Result c={light[i]} />
                  </td>
                  <td className="px-4 py-2">
                    <Result c={dark[i]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Focus" note="A 2px ring in the ring token, offset 2px, for keyboard focus only. Tab through the controls.">
        <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-background p-8">
          <Button>Approve</Button>
          <Button variant="outline">Preview</Button>
          <Input placeholder="Folder" className="w-40" />
        </div>
      </Section>

      <Section title="Reduced motion" note="Under reduced motion, every state change still happens without the movement.">
        <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-background p-8">
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
          <span className="text-sm text-muted-foreground">
            This skeleton stops under <Mono>prefers-reduced-motion</Mono>. Spinners and progress keep moving because they carry information.
          </span>
        </div>
      </Section>

      <Section title="Checklist">
        <div className="grid gap-2 sm:grid-cols-3">
          <Rule keys={["Tab"]} text="Every action reachable, in reading order, with a visible ring." />
          <Rule keys={["Esc"]} text="Every overlay closes and returns focus where it came from." />
          <Rule keys={["⌘", "Z"]} text="Every destructive action can be undone, or asks first." />
        </div>
        <Bullets
          items={[
            <>Targets are at least 24 × 24px. Controls are 32px tall; 28px is the minimum in dense rows.</>,
            <>Status pairs a glyph, a word and a colour.</>,
            <>Icon-only buttons have an aria-label and a tooltip with the same words.</>,
            <>Form fields have a visible label. Placeholders are examples. Errors sit under the field and are announced.</>,
            <>Colour is not the only channel. Links underline on hover; selected rows carry a check or a ring.</>,
            <>Charts have direct labels and a text alternative.</>,
          ]}
        />
      </Section>
    </>
  )
}

function Result({ c }: { c: Check }) {
  return (
    <div className="flex items-center gap-2">
      {c.pass ? (
        <span className="flex items-center gap-1 text-xs font-medium text-success">
          <CheckIcon className="size-3.5" aria-hidden />
          pass
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-destructive">
          <XIcon className="size-3.5" aria-hidden />
          fail
        </span>
      )}
      <span className="font-mono text-xs">{c.ratio ? c.ratio.toFixed(2) : "–"}</span>
      <span className="font-mono text-xs text-muted-foreground">
        {hex(c.fgValue)} / {hex(c.bgValue)}
      </span>
    </div>
  )
}

function Rule({ keys, text }: { keys: string[]; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
      <KbdGroup>
        {keys.map((k) => (
          <Kbd key={k}>{k}</Kbd>
        ))}
      </KbdGroup>
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

// Reads the inactive mode's authored values from CSSOM; follows HMR, not inline edits.
function useAuthored(selector: string): Vars {
  const [vars, setVars] = useState<Vars>({})
  useEffect(() => {
    const read = () => setVars(readRule(selector))
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [selector])
  return vars
}

function readRule(selector: string): Vars {
  const out: Vars = {}
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (rule.selectorText.split(",").some((s) => s.trim() === selector)) {
          for (const prop of Array.from(rule.style)) if (prop.startsWith("--")) out[prop.slice(2)] = rule.style.getPropertyValue(prop).trim()
        }
      } else if ("cssRules" in rule) visit((rule as CSSGroupingRule).cssRules)
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules)
    } catch {
      // cross-origin sheet
    }
  }
  return out
}
