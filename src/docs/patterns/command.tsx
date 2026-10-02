import { useEffect, useState } from "react"
import { BotIcon, CopyIcon, EyeOffIcon, FrameIcon, GroupIcon, HomeIcon, TagIcon, TypeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { MotifDot } from "@/components/ui/motif"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"
import { Keys, Meta } from "./shared"

const RECENT = [
  { id: "home", label: "Go to Home", icon: HomeIcon },
  { id: "pricing", label: "Open Pricing", icon: TagIcon },
]
const ACTIONS = [
  { id: "frame", label: "New frame", icon: FrameIcon, keys: "F" },
  { id: "text", label: "Add text", icon: TypeIcon, keys: "T" },
  { id: "group", label: "Group selection", icon: GroupIcon, keys: "⌘G" },
  { id: "dup", label: "Duplicate", icon: CopyIcon, keys: "⌘D" },
  { id: "hide", label: "Show or hide", icon: EyeOffIcon, keys: "⇧⌘H" },
  { id: "agent", label: "Ask the agent…", icon: BotIcon, keys: "⌘J" },
]
const LABEL = Object.fromEntries([...RECENT, ...ACTIONS].map((c) => [c.id, c.label]))

function PaletteBody({ ran }: { ran: string | null }) {
  return (
    <>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Recent">
          {RECENT.map((c) => (
            <CommandItem key={c.id} value={c.id} keywords={[c.label]}>
              <c.icon />
              {c.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {ACTIONS.map((c) => (
            <CommandItem key={c.id} value={c.id} keywords={[c.label]}>
              <c.icon />
              {c.label}
              <CommandShortcut>{c.keys}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span className="flex items-center gap-1">
          <KbdGroup>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </KbdGroup>
          move
        </span>
        <span className="flex items-center gap-1">
          <Kbd>↵</Kbd> run
        </span>
        {ran && (
          <span key={ran} className="ml-auto flex items-center gap-1.5 text-foreground animate-enter">
            <MotifDot size={7} />
            Ran “{LABEL[ran]}”
          </span>
        )}
      </CommandFooter>
    </>
  )
}

function Palette() {
  const [ran, setRan] = useState<string | null>(null)
  return (
    <Command className="w-105 max-w-full" onSelect={setRan}>
      <PaletteBody ran={ran} />
    </Command>
  )
}

function PaletteDialog() {
  const [open, setOpen] = useState(false)
  const [ran, setRan] = useState<string | null>(null)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette
        <KbdGroup data-icon="inline-end">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <span className="text-xs text-muted-foreground">
        {ran ? (
          <>
            Last ran <span className="text-foreground">{LABEL[ran]}</span>
          </>
        ) : (
          "Or press ⌘K anywhere on this page."
        )}
      </span>
      <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Search for a command or jump somewhere.">
        <Command
          onSelect={(v) => {
            setRan(v)
            setOpen(false)
          }}
        >
          <PaletteBody ran={null} />
        </Command>
      </CommandDialog>
    </div>
  )
}

export default function CommandPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Command palette">
        One palette per tool on ⌘K: recent items first, then actions with their shortcuts.
      </PageHeader>

      <Section title="Command palette" note="type, ↑↓, ↵">
        <Meta>
          <PatternId>cmdk-01</PatternId>
          <Uses
            ids={[
              ["command", "Command"],
              ["input", "Input"],
              ["kbd", "Kbd"],
            ]}
          />
        </Meta>
        <Example>
          <Palette />
        </Example>
      </Section>

      <Section title="In a dialog" note="closes on run; the marker starts on the first row">
        <Example>
          <PaletteDialog />
        </Example>
      </Section>

      <Section title="Keyboard">
        <Keys
          rows={[
            ["⌘ K", "Opens from anywhere."],
            ["↑ / ↓", "Moves the highlight."],
            ["↵", "Runs the highlighted command."],
            ["Esc", "Clears the query, then closes."],
          ]}
        />
      </Section>

      <Related
        ids={[
          ["command", "Command"],
          ["dropdown-menu", "Menu"],
          ["dialog", "Dialog"],
        ]}
      />
    </>
  )
}
