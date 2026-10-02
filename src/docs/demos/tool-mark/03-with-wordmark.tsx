import { ToolMark } from "@/components/ui/tool-mark"

export default function ToolMarkWithWordmark() {
  return (
    <div className="flex items-center gap-3">
      <ToolMark tool="glu" size={28} />
      <span className="text-2xl font-bold tracking-tight">glu</span>
    </div>
  )
}
