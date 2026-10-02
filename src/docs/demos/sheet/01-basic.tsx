import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function SheetBasic() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Invite people</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite to Northwind</SheetTitle>
          <SheetDescription>Members can see every project. Guests see only the ones you share.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-6">
          <div className="grid gap-2">
            <Label htmlFor="emails">Email addresses</Label>
            <Input id="emails" placeholder="name@company.com, …" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Input id="note" placeholder="Optional" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button>Send invites</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
