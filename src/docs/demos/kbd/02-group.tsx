import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdGroupDemo() {
  return (
    <>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </>
  )
}
