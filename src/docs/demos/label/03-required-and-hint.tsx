import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelRequiredAndHint() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="org">
        Organisation
        <span className="text-destructive" aria-hidden>
          *
        </span>
        <span className="ml-auto text-xs font-normal text-muted-foreground">Required</span>
      </Label>
      <Input id="org" required />
    </div>
  )
}
