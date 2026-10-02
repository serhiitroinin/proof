import { ToolMark } from "@/components/ui/tool-mark"

export default function ToolMarkSizes() {
  return (
    <div className="flex items-end gap-6">
      <ToolMark tool="butler" size={12} />
      <ToolMark tool="butler" size={16} />
      <ToolMark tool="butler" size={24} />
      <ToolMark tool="butler" size={32} />
      <ToolMark tool="butler" size={48} />
    </div>
  )
}
