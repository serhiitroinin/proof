import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithTextAndInput() {
  return (
    <ButtonGroup className="w-full max-w-sm">
      <ButtonGroupText>https://</ButtonGroupText>
      <Input placeholder="example.com" aria-label="Domain" />
      <Button variant="outline">Verify</Button>
    </ButtonGroup>
  )
}
