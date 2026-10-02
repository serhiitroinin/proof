import { FileIcon, HashIcon } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function CommandEmptyState() {
  return (
    <Command className="w-full max-w-[420px]" defaultQuery="q">
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Recent">
          <CommandItem value="Go to Home">
            <HashIcon />
            Go to Home
          </CommandItem>
          <CommandItem value="Open Pricing">
            <FileIcon />
            Open Pricing
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
