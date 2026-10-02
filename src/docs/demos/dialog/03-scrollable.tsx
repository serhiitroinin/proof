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

const changes = [
  "Rate limits now apply per workspace instead of per user.",
  "Webhook retries back off exponentially up to six attempts.",
  "The /exports endpoint returns a job id and streams progress.",
  "API keys can be scoped to read-only.",
  "Deprecated: the v1 /search endpoint shuts down on 1 December.",
  "Timestamps are returned in RFC 3339 with an explicit offset.",
  "Pagination cursors are opaque; do not parse them.",
  "Error bodies include a stable code next to the message.",
]

export default function DialogScrollable() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Review changes</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API v2 changes</DialogTitle>
          <DialogDescription>Read before you switch the production key.</DialogDescription>
        </DialogHeader>
        <ol className="flex max-h-56 flex-col gap-2 overflow-y-auto pl-4 text-sm text-muted-foreground">
          {changes.map((c) => (
            <li key={c} className="list-decimal">
              {c}
            </li>
          ))}
        </ol>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Later</DialogClose>
          <Button>Switch key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
