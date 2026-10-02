import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const days = ["Mon 28", "Tue 29", "Wed 30", "Thu 1", "Fri 2", "Sat 3", "Sun 4", "Mon 5", "Tue 6", "Wed 7"]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea variant="outline" className="w-full max-w-md">
      <div className="flex w-max gap-4 p-4">
        {days.map((d) => (
          <figure key={d} className="flex w-32 shrink-0 flex-col gap-2">
            <div className="aspect-video rounded-md bg-muted" />
            <figcaption className="text-xs text-muted-foreground">{d}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
