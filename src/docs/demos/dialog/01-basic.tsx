import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Archive project</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Northwind redesign?</DialogTitle>
          <DialogDescription>
            The project leaves the sidebar and stops sending notifications. You can restore it from Archive at any
            time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Archive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
