import { useEffect, useState } from "react"
import { CopyIcon, FileIcon, HashIcon, PlusIcon, TypeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"

export default function CommandInDialog() {
  const [open, setOpen] = useState(false)
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
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command onSelect={() => setOpen(false)}>
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
            <CommandSeparator />
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
              <CommandItem value="Duplicate">
                <CopyIcon />
                Duplicate
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandFooter>
            <Kbd>↑↓</Kbd> move <Kbd>↵</Kbd> run <Kbd>esc</Kbd> close
          </CommandFooter>
        </Command>
      </CommandDialog>
    </>
  )
}
