import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Motif } from "@/components/ui/motif"
import { ToolMark, type ToolName } from "@/components/ui/tool-mark"
import { ToolScope } from "@/components/ui/tool-scope"

const TOOLS: ToolName[] = ["butler", "glu", "vellum", "strap"]

export default function ToolScopeFamilyAccents() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {TOOLS.map((tool) => (
        <ToolScope key={tool} tool={tool} className="flex flex-col">
          <div className="flex items-center gap-2 rounded-t-lg border border-b-0 px-4 pt-4 pb-3">
            <ToolMark tool={tool} size={20} />
            <span className="text-sm font-medium capitalize">{tool}</span>
            <Badge variant="tool">Proposed</Badge>
          </div>
          <div className="border-x px-4 pb-3">
            <Motif state="done" width={200} />
          </div>
          <div className="flex items-center gap-2 rounded-b-lg border border-t-0 px-4 pb-4">
            <Button size="sm" variant="outline">
              Focus me
            </Button>
            <span className="text-xs text-muted-foreground">Select this text to see the selection tint.</span>
          </div>
        </ToolScope>
      ))}
    </div>
  )
}
