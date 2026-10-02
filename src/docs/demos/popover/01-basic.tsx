import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Dimensions</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Applied to the exported frame.</PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-[1fr_2fr] items-center gap-x-4 gap-y-2">
          <Label htmlFor="w">Width</Label>
          <Input id="w" defaultValue="1440" />
          <Label htmlFor="h">Height</Label>
          <Input id="h" defaultValue="900" />
          <Label htmlFor="scale">Scale</Label>
          <Input id="scale" defaultValue="2×" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
