import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverWithAction() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Why is this locked?</PopoverTrigger>
      <PopoverContent side="top">
        <PopoverHeader>
          <PopoverTitle>Locked by Mara Lindqvist</PopoverTitle>
          <PopoverDescription>Editing since 09:42. Ask for the lock or wait until they close the file.</PopoverDescription>
        </PopoverHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Wait
          </Button>
          <Button size="sm">Request lock</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
