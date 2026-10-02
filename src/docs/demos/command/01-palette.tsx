import { useState } from "react"
import { CopyIcon, EyeIcon, FileIcon, HashIcon, LayersIcon, PlusIcon, SparklesIcon, TypeIcon } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"

export default function CommandPalette() {
  const [ran, setRan] = useState<string | null>(null)
  return (
    <Command className="w-full max-w-[420px]" onSelect={setRan}>
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Recent">
          <CommandItem value="Go to Home" keywords={["frame"]}>
            <HashIcon />
            Go to Home
          </CommandItem>
          <CommandItem value="Open Pricing" keywords={["file"]}>
            <FileIcon />
            Open Pricing
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="New frame">
            <PlusIcon />
            New frame
            <CommandShortcut>F</CommandShortcut>
          </CommandItem>
          <CommandItem value="Add text">
            <TypeIcon />
            Add text
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>
          <CommandItem value="Group selection">
            <LayersIcon />
            Group selection
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem value="Duplicate">
            <CopyIcon />
            Duplicate
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem value="Show or hide">
            <EyeIcon />
            Show or hide
            <CommandShortcut>⇧⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem value="Ask the agent…" keywords={["ai", "chat"]}>
            <SparklesIcon />
            Ask the agent…
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <Kbd>↑↓</Kbd> move <Kbd>↵</Kbd> run
        {ran && <span className="ml-auto text-foreground">Ran &ldquo;{ran}&rdquo;</span>}
      </CommandFooter>
    </Command>
  )
}
