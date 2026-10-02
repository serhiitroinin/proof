import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchSizes() {
  return (
    <>
      <Label>
        <Switch size="sm" defaultChecked />
        Small
      </Label>
      <Label>
        <Switch defaultChecked />
        Default
      </Label>
    </>
  )
}
