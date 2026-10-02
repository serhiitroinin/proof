import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export default function KbdInButton() {
  return (
    <>
      <Button variant="outline">
        <SearchIcon data-icon="inline-start" />
        Search
        <Kbd data-icon="inline-end">⌘K</Kbd>
      </Button>
      <Button>
        Publish
        <Kbd data-icon="inline-end">⏎</Kbd>
      </Button>
    </>
  )
}
