import { Input } from "@/components/ui/input"

export default function InputStates() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Input placeholder="Resting" aria-label="Resting" />
      <Input defaultValue="Read only value" readOnly aria-label="Read only" />
      <Input placeholder="Disabled" disabled aria-label="Disabled" />
      <Input defaultValue="not-an-email" aria-invalid aria-label="Invalid" />
    </div>
  )
}
