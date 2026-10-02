import { Separator } from "@/components/ui/separator"

export default function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Files</span>
      <Separator orientation="vertical" />
      <span>Rules</span>
      <Separator orientation="vertical" />
      <span>History</span>
    </div>
  )
}
