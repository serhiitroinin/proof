import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const runs = Array.from({ length: 24 }, (_, i) => `run_${(0x8f21 - i).toString(16)}`)

export default function ScrollAreaVertical() {
  return (
    <ScrollArea variant="outline" className="h-56 w-48">
      <div className="p-4">
        <p className="pb-3 text-xs font-medium text-muted-foreground">Recent runs</p>
        {runs.map((id, i) => (
          <div key={id}>
            {i > 0 && <Separator className="my-2" />}
            <p className="font-mono text-sm">{id}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
