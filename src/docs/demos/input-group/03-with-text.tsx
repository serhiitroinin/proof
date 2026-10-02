import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

export default function InputGroupWithText() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="acme" aria-label="Subdomain" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.proof.dev</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>€</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="number" defaultValue={49} aria-label="Price" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>per seat</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
