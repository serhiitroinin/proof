import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelDefault() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" placeholder="sk-live-…" />
    </div>
  )
}
