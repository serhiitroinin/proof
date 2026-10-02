import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchStates() {
  return (
    <div className="grid gap-4">
      <Label>
        <Switch />
        Off
      </Label>
      <Label>
        <Switch defaultChecked />
        On
      </Label>
      <Label>
        <Switch disabled />
        Disabled
      </Label>
      <Label>
        <Switch disabled defaultChecked />
        Disabled and on
      </Label>
    </div>
  )
}
