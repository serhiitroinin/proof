import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const regions = {
  ams: "Amsterdam",
  fra: "Frankfurt",
  lhr: "London",
  iad: "Virginia",
  sfo: "San Francisco",
  sin: "Singapore",
  syd: "Sydney (coming soon)",
}

export default function SelectWithGroups() {
  return (
    <Select items={regions}>
      <SelectTrigger className="w-56" aria-label="Region">
        <SelectValue placeholder="Choose a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="ams">Amsterdam</SelectItem>
          <SelectItem value="fra">Frankfurt</SelectItem>
          <SelectItem value="lhr">London</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="iad">Virginia</SelectItem>
          <SelectItem value="sfo">San Francisco</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="sin">Singapore</SelectItem>
          <SelectItem value="syd" disabled>
            Sydney (coming soon)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
