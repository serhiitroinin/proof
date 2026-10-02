import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdInText() {
  return (
    <p className="max-w-sm text-sm text-muted-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to open the command palette, then <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move and <Kbd>Enter</Kbd> to run.
    </p>
  )
}
